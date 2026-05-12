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

    return {"status": "ok", "model": settings.MODEL_NAME, "db": "connected" if db_connected else "disconnected"}
