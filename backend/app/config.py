"""Application configuration loaded from environment."""
from __future__ import annotations

from typing import Any
import os
from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    """App settings loaded from .env or environment variables."""

    ANTHROPIC_API_KEY: str = Field(..., env="ANTHROPIC_API_KEY")
    MODEL_NAME: str = Field("claude-sonnet-4-20250514", env="MODEL_NAME")
    DATABASE_URL: str = Field("sqlite+aiosqlite:///./nistula.db", env="DATABASE_URL")
    APP_ENV: str = Field("development", env="APP_ENV")
    LOG_LEVEL: str = Field("INFO", env="LOG_LEVEL")

    class Config:
        # Load .env from the backend folder to keep env scoped to the service
        env_file = os.path.join(os.getcwd(), "backend", ".env")


def get_settings() -> Settings:
    """Return a cached Settings instance.

    Using function to keep type hints explicit for imports.
    """

    return Settings()


settings = get_settings()
