"""FastAPI application entrypoint for Nistula Message Handler."""
from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Callable
import logging
import time
from .config import settings
from .database import engine, Base
from .routes import health as health_route
from .routes import webhook as webhook_route
from .routes import messages as messages_route
from sqlalchemy.ext.asyncio import AsyncEngine

logger = logging.getLogger("nistula")
logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO))


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(title="Nistula Message Handler", version="1.0.0")

    # CORS - allow all in development
    app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]) 

    # Include routes
    app.include_router(health_route.router)
    app.include_router(webhook_route.router, prefix="/api/v1")
    app.include_router(messages_route.router, prefix="/api/v1")

    # Request logging middleware
    @app.middleware("http")
    async def log_requests(request: Request, call_next: Callable):
        start = time.perf_counter()
        response = await call_next(request)
        duration_ms = int((time.perf_counter() - start) * 1000)
        logger.info("%s %s %s %dms", request.method, request.url.path, response.status_code, duration_ms)
        return response

    @app.on_event("startup")
    async def on_startup() -> None:
        # Create DB tables
        if isinstance(engine, AsyncEngine):
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)

    return app


app = create_app()
