"""SQLAlchemy ORM models for Nistula Message Handler."""
from __future__ import annotations

from typing import List
from uuid import uuid4
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Float, Boolean, Index
from sqlalchemy.dialects.sqlite import JSON as SQLITE_JSON
from sqlalchemy.orm import relationship
from .database import Base
from sqlalchemy.sql import func


def gen_uuid() -> str:
    return str(uuid4())


class GuestProfile(Base):
    """Guest profile record."""

    __tablename__ = "guest_profiles"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), nullable=True, unique=True)
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    channels = Column(SQLITE_JSON, nullable=False, default=list)

    reservations = relationship("Reservation", back_populates="guest")
    conversations = relationship("Conversation", back_populates="guest")


class Reservation(Base):
    """Reservation / booking record."""

    __tablename__ = "reservations"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    booking_ref = Column(String(128), nullable=False, unique=True, index=True)
    property_id = Column(String(128), nullable=False)
    guest_id = Column(String(36), ForeignKey("guest_profiles.id"), nullable=False)
    check_in = Column(DateTime(timezone=True), nullable=True)
    check_out = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(32), nullable=False, default="confirmed")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    guest = relationship("GuestProfile", back_populates="reservations")


class Conversation(Base):
    """Conversation thread between guest and property via a channel."""

    __tablename__ = "conversations"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    guest_id = Column(String(36), ForeignKey("guest_profiles.id"), nullable=False)
    reservation_id = Column(String(36), ForeignKey("reservations.id"), nullable=True)
    property_id = Column(String(128), nullable=False)
    channel = Column(String(64), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_message_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    guest = relationship("GuestProfile", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation")


class Message(Base):
    """Individual message record."""

    __tablename__ = "messages"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    conversation_id = Column(String(36), ForeignKey("conversations.id"), nullable=False, index=True)
    source = Column(String(64), nullable=False)
    direction = Column(String(16), nullable=False)
    message_text = Column(Text, nullable=False)
    query_type = Column(String(64), nullable=True)
    confidence_score = Column(Float, nullable=True)
    drafted_reply = Column(Text, nullable=True)
    action = Column(String(32), nullable=True)
    ai_drafted = Column(Boolean, nullable=False, default=True)
    agent_edited = Column(Boolean, nullable=False, default=False)
    auto_sent = Column(Boolean, nullable=False, default=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    conversation = relationship("Conversation", back_populates="messages")


Index("ix_reservation_booking_ref", Reservation.booking_ref)
