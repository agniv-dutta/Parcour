"""Message listing and retrieval endpoints."""
from __future__ import annotations

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, and_, desc
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models import Message, Conversation, GuestProfile, Reservation
import datetime

router = APIRouter()


@router.get("/messages", tags=["messages"])
async def list_messages(
    limit: int = Query(20, ge=1, le=200),
    offset: int = 0,
    action: Optional[str] = Query(None),
    query_type: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> List[dict]:
    """Return a flat list of messages joined with conversation/guest/reservation.

    Response shape is a flat array of objects with fields documented in the API.
    """

    # base query joining Message -> Conversation -> GuestProfile (left join reservation)
    q = (
        select(Message, Conversation, GuestProfile, Reservation)
        .join(Conversation, Message.conversation_id == Conversation.id)
        .join(GuestProfile, Conversation.guest_id == GuestProfile.id)
        .outerjoin(Reservation, Conversation.reservation_id == Reservation.id)
        .order_by(desc(Message.created_at))
        .limit(limit)
        .offset(offset)
    )

    # apply filters
    conditions = []
    if action is not None:
        conditions.append(Message.action == action)
    if query_type is not None:
        conditions.append(Message.query_type == query_type)
    if conditions:
        q = q.where(and_(*conditions))

    resp = await db.execute(q)
    rows = resp.all()

    results: List[dict] = []
    for message, conv, guest, reservation in rows:
        # compute processing_time_ms as difference between created_at and timestamp if present
        processing_time_ms = 0
        try:
            if message.created_at and message.timestamp:
                delta = message.created_at - message.timestamp
                processing_time_ms = max(0, int(delta.total_seconds() * 1000))
        except Exception:
            processing_time_ms = 0

        results.append(
            {
                "id": message.id,
                "source": message.source,
                "guest_name": guest.name if guest else None,
                "message_text": message.message_text,
                "query_type": message.query_type,
                "confidence_score": message.confidence_score,
                "action": message.action,
                "drafted_reply": message.drafted_reply,
                "booking_ref": reservation.booking_ref if reservation else None,
                "property_id": conv.property_id if conv else None,
                "timestamp": message.timestamp.isoformat() if message.timestamp else None,
                "processing_time_ms": processing_time_ms,
            }
        )

    return results



@router.get("/messages/{message_id}", tags=["messages"])
async def get_message(message_id: str, db: AsyncSession = Depends(get_db)):
    """Get full message detail by id."""
    q = (
        select(Message, Conversation, GuestProfile, Reservation)
        .join(Conversation, Message.conversation_id == Conversation.id)
        .join(GuestProfile, Conversation.guest_id == GuestProfile.id)
        .outerjoin(Reservation, Conversation.reservation_id == Reservation.id)
        .where(Message.id == message_id)
    )
    resp = await db.execute(q)
    row = resp.one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="message not found")

    message, conv, guest, reservation = row
    processing_time_ms = 0
    try:
        if message.created_at and message.timestamp:
            processing_time_ms = max(0, int((message.created_at - message.timestamp).total_seconds() * 1000))
    except Exception:
        processing_time_ms = 0

    return {
        "id": message.id,
        "source": message.source,
        "guest_name": guest.name if guest else None,
        "message_text": message.message_text,
        "query_type": message.query_type,
        "confidence_score": message.confidence_score,
        "action": message.action,
        "drafted_reply": message.drafted_reply,
        "booking_ref": reservation.booking_ref if reservation else None,
        "property_id": conv.property_id if conv else None,
        "timestamp": message.timestamp.isoformat() if message.timestamp else None,
        "processing_time_ms": processing_time_ms,
    }
