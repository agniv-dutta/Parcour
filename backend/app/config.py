"""Application configuration loaded from environment."""
from __future__ import annotations

from typing import Any
import os
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """App settings loaded from .env or environment variables."""

    model_config = SettingsConfigDict(env_file=os.path.join(os.getcwd(), "backend", ".env"))

    ANTHROPIC_API_KEY: str = Field("")
    MODEL_NAME: str = Field("claude-sonnet-4-20250514")
    DATABASE_URL: str = Field("sqlite+aiosqlite:///./parcour.db")
    APP_ENV: str = Field("development")
    LOG_LEVEL: str = Field("INFO")


def get_settings() -> Settings:
    """Return a cached Settings instance.

    Using function to keep type hints explicit for imports.
    """

    return Settings()


settings = get_settings()
