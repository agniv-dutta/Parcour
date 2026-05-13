"""Health check route."""
from __future__ import annotations

from fastapi import APIRouter
from ..config import settings
from ..claude_client import claude_client
from ..database import engine
import sqlalchemy

router = APIRouter()


@router.get("/health", tags=["health"])
async def health() -> dict:
    """Return simple health info including DB connectivity and model name."""
    db_connected = False
    try:
        # quick check: get dialect name
        db_connected = engine.dialect.name is not None
    except Exception:
        db_connected = False

    # count messages if DB is connected
    message_count = 0
    try:
        if db_connected:
            # use a quick sync-ish path via engine.connect
            async def _count():
                async with engine.connect() as conn:
                    res = await conn.execute("select count(*) from messages")
                    return int(res.scalar() or 0)

            import asyncio

            message_count = asyncio.get_event_loop().run_until_complete(_count())
    except Exception:
        message_count = 0

    return {
        "status": "ok",
        "model": settings.MODEL_NAME,
        "db": "connected" if db_connected else "disconnected",
        "message_count": message_count,
        "env": settings.APP_ENV,
    }
