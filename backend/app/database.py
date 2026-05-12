"""Async database engine and session management for SQLite (aiosqlite + SQLAlchemy)."""
from __future__ import annotations

from typing import AsyncGenerator
import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from .config import settings

logger = logging.getLogger(__name__)

DATABASE_URL = settings.DATABASE_URL

engine = create_async_engine(DATABASE_URL, echo=(settings.APP_ENV == "development"))
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Yield an async DB session.

    Use as a dependency in FastAPI routes.
    """
    async with AsyncSessionLocal() as session:
        yield session
