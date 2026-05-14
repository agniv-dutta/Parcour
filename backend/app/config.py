"""Application configuration loaded from environment."""
from __future__ import annotations

from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / "backend" / ".env"
DEFAULT_DB_PATH = (BASE_DIR / "parcour.db").resolve()


class Settings(BaseSettings):
    """App settings loaded from .env or environment variables."""

    model_config = SettingsConfigDict(env_file=ENV_FILE)

    CLAUDE_API_KEY: str = Field("")
    ANTHROPIC_API_KEY: str = Field("")
    MODEL_NAME: str = Field("claude-sonnet-4-20250514")
    DATABASE_URL: str = Field("sqlite+aiosqlite:///./parcour.db")
    APP_ENV: str = Field("development")
    LOG_LEVEL: str = Field("INFO")

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        if not isinstance(value, str):
            return value

        if value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+asyncpg://", 1)

        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+asyncpg://", 1)

        if value.startswith("sqlite+aiosqlite:///./"):
            db_name = value.rsplit("/", 1)[-1]
            return f"sqlite+aiosqlite:///{DEFAULT_DB_PATH}"

        return value

    @property
    def effective_claude_api_key(self) -> str:
        """Return the configured Claude key, preferring the new env var name."""
        return self.CLAUDE_API_KEY or self.ANTHROPIC_API_KEY


def get_settings() -> Settings:
    """Return a cached Settings instance.

    Using function to keep type hints explicit for imports.
    """

    return Settings()


settings = get_settings()
