"""Webhook endpoint that ingests guest messages and processes them end-to-end."""
from __future__ import annotations

from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..schemas import WebhookPayload, MessageResponse
from ..database import get_db
from .. import models
from ..classifier import classify_message
from ..claude_client import claude_client, ClaudeAPIError
from ..confidence import calculate_confidence
import time
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/webhook/message", response_model=MessageResponse, tags=["webhook"])
async def handle_webhook(payload: WebhookPayload, db: AsyncSession = Depends(get_db)) -> Any:
    """Process an incoming guest message webhook.

    Implements the full flow: classify, draft reply via Claude, score confidence,
    persist all records, and return a unified response.
    """
    start = time.perf_counter()

    try:
        # 1. classify
        query_type, classifier_confidence = await classify_message(payload.message)

        # 2. guest lookup/create by name (simple for now)
        q = select(models.GuestProfile).where(models.GuestProfile.name == payload.guest_name)
        resp = await db.execute(q)
        guest = resp.scalar_one_or_none()
        if not guest:
            guest = models.GuestProfile(name=payload.guest_name)
            db.add(guest)
            await db.flush()

        # 3. reservation get/create
        reservation = None
        if payload.booking_ref:
            q = select(models.Reservation).where(models.Reservation.booking_ref == payload.booking_ref)
            resp = await db.execute(q)
            reservation = resp.scalar_one_or_none()
            if not reservation:
                reservation = models.Reservation(booking_ref=payload.booking_ref, property_id=payload.property_id, guest_id=guest.id)
                db.add(reservation)
                await db.flush()

        # 4. conversation get/create (guest + channel + property)
        q = select(models.Conversation).where(
            models.Conversation.guest_id == guest.id,
            models.Conversation.channel == payload.source,
            models.Conversation.property_id == payload.property_id,
        )
        resp = await db.execute(q)
        conv = resp.scalar_one_or_none()
        if not conv:
            conv = models.Conversation(guest_id=guest.id, reservation_id=(reservation.id if reservation else None), property_id=payload.property_id, channel=payload.source)
            db.add(conv)
            await db.flush()

        # 5. Call Claude to draft reply
        try:
            drafted = await claude_client.draft_reply(guest_name=payload.guest_name, message_text=payload.message, query_type=query_type, booking_ref=payload.booking_ref, property_id=payload.property_id)
        except ClaudeAPIError as exc:
            logger.exception("Claude failed: %s", exc)
            raise HTTPException(status_code=503, detail=f"Claude API error: {exc}")

        # 6. Calculate confidence
        message_word_count = len(payload.message.split())
        is_complaint = query_type == "complaint"
        has_booking_ref = bool(payload.booking_ref)
        score, action = calculate_confidence(query_type=query_type, classifier_confidence=classifier_confidence, message_length=message_word_count, has_booking_ref=has_booking_ref, is_complaint=is_complaint)

        # 7. Save message
        msg = models.Message(
            conversation_id=conv.id,
            source=payload.source,
            direction="inbound",
            message_text=payload.message,
            query_type=query_type,
            confidence_score=score,
            drafted_reply=drafted,
            action=action,
            ai_drafted=True,
            agent_edited=False,
            auto_sent=(action == "auto_send"),
            timestamp=payload.timestamp,
        )
        db.add(msg)
        # update conversation last_message_at
        conv.last_message_at = payload.timestamp

        await db.commit()

    except HTTPException:
        await db.rollback()
        raise
    except Exception as exc:  # explicit catch for DB/other errors
        logger.exception("Webhook processing failed: %s", exc)
        await db.rollback()
        raise HTTPException(status_code=500, detail="internal server error")

    end = time.perf_counter()
    elapsed_ms = int((end - start) * 1000)

    normalized = {
        "id": msg.id,
        "guest_id": guest.id,
        "reservation_id": reservation.id if reservation else None,
        "conversation_id": conv.id,
        "source": payload.source,
        "message": payload.message,
        "timestamp": payload.timestamp.isoformat(),
    }

    return MessageResponse(
        message_id=msg.id,
        query_type=query_type,
        drafted_reply=drafted,
        confidence_score=score,
        action=action,
        normalized_message=normalized,
        processing_time_ms=elapsed_ms,
    )
