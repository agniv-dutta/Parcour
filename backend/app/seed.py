"""Seed script to insert sample messages for local development.

Run from the backend folder as:

  python app/seed.py

This will create guests, reservations, conversations and messages.
"""
from __future__ import annotations

import asyncio
from datetime import datetime, timedelta, timezone
from app.database import AsyncSessionLocal, engine
from app.models import Base as ModelsBase
from app.models import GuestProfile, Reservation, Conversation, Message
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select


SAMPLES = [
    {
        "guest": {"name": "Rahul Sharma"},
        "source": "whatsapp",
        "message_text": "Is the villa available on April 21-23?",
        "query_type": "pre_sales_availability",
        "confidence_score": 0.92,
        "action": "agent_review",
        "drafted_reply": "Hi Rahul — the villa is available on those dates. Would you like me to hold the dates?",
        "booking_ref": "NIS-2024-0891",
        "property_id": "villa-b1",
    },
    {
        "guest": {"name": "Priya Mehta"},
        "source": "airbnb",
        "message_text": "The air conditioning is not working and this is unacceptable",
        "query_type": "complaint",
        "confidence_score": 0.98,
        "action": "escalate",
        "drafted_reply": "We're very sorry Priya — we will dispatch maintenance immediately and follow up.",
        "booking_ref": "PRY-2025-0042",
        "property_id": "villa-b2",
    },
    {
        "guest": {"name": "Arjun Nair"},
        "source": "booking_com",
        "message_text": "Hi, what's the wifi password?",
        "query_type": "post_sales_checkin",
        "confidence_score": 0.85,
        "action": "auto_send",
        "drafted_reply": "Hi Arjun — the WiFi password is Parcour@2024",
        "booking_ref": "BR-456",
        "property_id": "villa-b1",
    },
    {
        "guest": {"name": "Kavya Reddy"},
        "source": "instagram",
        "message_text": "Do you offer airport pickup?",
        "query_type": "special_request",
        "confidence_score": 0.80,
        "action": "agent_review",
        "drafted_reply": "Yes Kavya — we can arrange airport pickup for an additional charge. Would you like a quote?",
        "booking_ref": "",
        "property_id": "villa-b3",
    },
]


async def seed() -> None:
    # ensure tables exist
    async with engine.begin() as conn:
        await conn.run_sync(ModelsBase.metadata.create_all)

    async with AsyncSessionLocal() as session:  # type: AsyncSession
        # create entries
        for s in SAMPLES:
            # guest (avoid duplicate by name)
            guest_name = s["guest"]["name"]
            existing = await session.scalar(select(GuestProfile).where(GuestProfile.name == guest_name))
            if existing:
                guest = existing
            else:
                guest = GuestProfile(name=guest_name)
                session.add(guest)
                await session.flush()

            reservation = None
            if s.get("booking_ref"):
                # avoid duplicate reservations by booking_ref
                existing_res = await session.scalar(select(Reservation).where(Reservation.booking_ref == s["booking_ref"]))
                if existing_res:
                    reservation = existing_res
                else:
                    reservation = Reservation(booking_ref=s["booking_ref"], property_id=s["property_id"], guest_id=guest.id)
                    session.add(reservation)
                    await session.flush()

            # find or create conversation
            conv_stmt = select(Conversation).where(
                Conversation.guest_id == guest.id,
                Conversation.reservation_id == (reservation.id if reservation else None),
                Conversation.property_id == s["property_id"],
                Conversation.channel == s["source"],
            )
            existing_conv = await session.scalar(conv_stmt)
            if existing_conv:
                conv = existing_conv
            else:
                conv = Conversation(guest_id=guest.id, reservation_id=(reservation.id if reservation else None), property_id=s["property_id"], channel=s["source"])
                session.add(conv)
                await session.flush()

            now = datetime.now(timezone.utc)
            # message timestamp slightly earlier than created_at
            ts = now - timedelta(seconds=2)
            msg = Message(
                conversation_id=conv.id,
                source=s["source"],
                direction="inbound",
                message_text=s["message_text"],
                query_type=s["query_type"],
                confidence_score=s["confidence_score"],
                drafted_reply=s["drafted_reply"],
                action=s["action"],
                ai_drafted=True,
                agent_edited=False,
                auto_sent=(s["action"] == "auto_send"),
                timestamp=ts,
            )
            session.add(msg)

        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed())
