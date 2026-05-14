"""Pydantic schemas for request and response payloads."""
from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field


class WebhookPayload(BaseModel):
    """Incoming webhook payload from channels."""

    source: Literal["whatsapp", "booking_com", "airbnb", "instagram", "direct"]
    guest_name: str
    message: str
    timestamp: datetime
    booking_ref: str
    property_id: str


class MessageResponse(BaseModel):
    """Unified response object after processing a message."""

    message_id: str
    query_type: str
    drafted_reply: str
    confidence_score: float
    action: Literal["auto_send", "agent_review", "escalate"]
    normalized_message: dict
    processing_time_ms: int


class MessageListItem(BaseModel):
    message_id: str
    message_text: str
    timestamp: datetime
    query_type: Optional[str]
    confidence_score: Optional[float]


class AnalyticsStats(BaseModel):
    total_messages: int
    auto_sent_pct: int
    avg_confidence: float
    escalated_count: int
    query_breakdown: dict[str, int]
    daily_volume: list[int]


class InsightCard(BaseModel):
    type: Literal["positive", "warning", "critical", "opportunity"]
    title: str
    body: str
    metric: str
    action: str


class AnalyticsInsightsResponse(BaseModel):
    headline: str
    insights: list[InsightCard]
    performance_score: int
    performance_label: str
    week_summary: str

