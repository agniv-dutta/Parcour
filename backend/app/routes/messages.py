"""Message listing and retrieval endpoints."""
from __future__ import annotations

from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..models import Message
from ..schemas import MessageListItem

router = APIRouter()


@router.get("/messages", tags=["messages"], response_model=List[MessageListItem])
async def list_messages(limit: int = Query(20, ge=1, le=200), offset: int = 0, db: AsyncSession = Depends(get_db)):
    """Paginated list of messages."""
    q = select(Message).order_by(Message.created_at.desc()).limit(limit).offset(offset)
    resp = await db.execute(q)
    rows = resp.scalars().all()
    items = [
        MessageListItem(
            message_id=row.id,
            message_text=row.message_text,
            timestamp=row.timestamp,
            query_type=row.query_type,
            confidence_score=row.confidence_score,
        )
        for row in rows
    ]
    return items


@router.get("/messages/{message_id}", tags=["messages"])
async def get_message(message_id: str, db: AsyncSession = Depends(get_db)):
    """Get full message detail by id."""
    q = select(Message).where(Message.id == message_id)
    resp = await db.execute(q)
    row = resp.scalar_one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="message not found")

    return {
        "id": row.id,
        "conversation_id": row.conversation_id,
        "source": row.source,
        "direction": row.direction,
        "message_text": row.message_text,
        "query_type": row.query_type,
        "confidence_score": row.confidence_score,
        "drafted_reply": row.drafted_reply,
        "action": row.action,
        "ai_drafted": row.ai_drafted,
        "agent_edited": row.agent_edited,
        "auto_sent": row.auto_sent,
        "timestamp": row.timestamp,
        "created_at": row.created_at,
    }
