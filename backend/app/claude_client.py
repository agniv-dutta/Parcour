"""Wrapper around Anthropic (Claude) API calls for drafting replies and classification."""
from __future__ import annotations

from typing import Optional
import logging
from .config import settings

try:
    # Newer SDKs expose an Anthropic/Client class
    import anthropic
    _HAS_ANTHROPIC = True
except Exception:  # pragma: no cover - runtime availability
    anthropic = None
    _HAS_ANTHROPIC = False

logger = logging.getLogger(__name__)


class ClaudeAPIError(Exception):
    """Raised when the Claude API returns an error."""


class ClaudeClient:
    """Minimal wrapper for drafting replies and running classification via Claude.

    The implementation uses the official `anthropic` SDK when available. This
    wrapper is intentionally small and raises `ClaudeAPIError` on failures.
    """

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None) -> None:
        self.api_key = api_key or settings.ANTHROPIC_API_KEY
        self.model = model or settings.MODEL_NAME
        self.client = None
        if not _HAS_ANTHROPIC:
            logger.warning("anthropic SDK not installed; ClaudeClient will fail at runtime")
        elif not self.api_key:
            logger.warning("ANTHROPIC_API_KEY is not configured; ClaudeClient will remain disabled")
        else:
            try:
                # Prefer a Client class if present
                if hasattr(anthropic, "Anthropic"):
                    self.client = anthropic.Anthropic(api_key=self.api_key)
                elif hasattr(anthropic, "Client"):
                    self.client = anthropic.Client(api_key=self.api_key)
                else:
                    # fallback to module-level client factory
                    self.client = anthropic
            except Exception as exc:
                logger.exception("Failed to instantiate Anthropic client: %s", exc)
                raise ClaudeAPIError(str(exc))

    async def draft_reply(self, guest_name: str, message_text: str, query_type: str, booking_ref: str, property_id: str) -> str:
        """Draft a reply using Claude.

        Returns the assistant text or raises ClaudeAPIError.
        """
        system_prompt = self._system_prompt()
        user_prompt = f"QueryType: {query_type}\nBookingRef: {booking_ref}\nGuestName: {guest_name}\nMessage: {message_text}\n"

        prompt = system_prompt + "\n\n" + user_prompt

        if not _HAS_ANTHROPIC:
            raise ClaudeAPIError("anthropic SDK is not installed")
        if not self.client:
            raise ClaudeAPIError("ANTHROPIC_API_KEY is not configured")

        try:
            # Use the SDK's completions interface; adapt to available surface.
            if hasattr(self.client, "completions"):
                # modern client
                resp = await self.client.completions.create(model=self.model, prompt=prompt, max_tokens=500)
                # some SDKs return an object with 'completion' or 'text'
                text = getattr(resp, "completion", None) or getattr(resp, "text", None) or resp.choices[0].text
            elif hasattr(self.client, "create_completion"):
                resp = await self.client.create_completion(model=self.model, prompt=prompt, max_tokens=500)
                text = resp.choices[0].text
            else:
                # try synchronous fallback (unlikely in async server)
                resp = self.client.create(prompt=prompt, model=self.model, max_tokens=500)
                text = resp.get("completion") or resp.get("text") or resp["choices"][0]["text"]
        except Exception as exc:
            logger.exception("Claude API error: %s", exc)
            raise ClaudeAPIError(str(exc))

        return text.strip()

    async def classify_text(self, message: str) -> str:
        """Call Claude to classify a message into a single category label."""
        prompt = (
            'Classify this guest message into exactly one category. '\
            'Reply with ONLY the category name, nothing else. '\
            'Categories: pre_sales_availability, pre_sales_pricing, post_sales_checkin, special_request, complaint, general_enquiry '\
            f'Message: "{message}"'
        )

        if not _HAS_ANTHROPIC:
            raise ClaudeAPIError("anthropic SDK is not installed")
        if not self.client:
            raise ClaudeAPIError("ANTHROPIC_API_KEY is not configured")

        try:
            if hasattr(self.client, "completions"):
                resp = await self.client.completions.create(model=self.model, prompt=prompt, max_tokens=50)
                text = getattr(resp, "completion", None) or getattr(resp, "text", None) or resp.choices[0].text
            elif hasattr(self.client, "create_completion"):
                resp = await self.client.create_completion(model=self.model, prompt=prompt, max_tokens=50)
                text = resp.choices[0].text
            else:
                resp = self.client.create(prompt=prompt, model=self.model, max_tokens=50)
                text = resp.get("completion") or resp.get("text") or resp["choices"][0]["text"]
        except Exception as exc:
            logger.exception("Claude classification error: %s", exc)
            raise ClaudeAPIError(str(exc))

        return text.strip()

    def _system_prompt(self) -> str:
        PROPERTY_CONTEXT = """
Property: Villa B1, Assagao, North Goa
Bedrooms: 3 | Max guests: 6 | Private pool: Yes
Check-in: 2pm | Check-out: 11am
Base rate: INR 18,000 per night (up to 4 guests)
Extra guest: INR 2,000 per night per person
    WiFi password: Parcour@2024
Caretaker: Available 8am to 10pm
Chef on call: Yes, pre-booking required
Availability April 20-24: Available
Cancellation: Free up to 7 days before check-in
"""

        SYSTEM_PROMPT = (
            "You are a warm, professional guest relations assistant for Parcour, a luxury villa rental company in Goa.\n\n"
            "Your job is to draft replies to guest messages. Follow these rules exactly:\n"
            "1. Address the guest by their first name\n"
            "2. Be warm but concise — never more than 4 short paragraphs\n"
            "3. Answer every question asked using the property context provided\n"
            "4. If you don't know something, say \"our team will confirm this shortly\"\n"
            "5. End with a friendly closing line\n"
            "6. Never make up prices, dates, or policies not in the context\n"
            "7. For complaints — acknowledge first, apologise sincerely, then resolve\n\n"
            "Property Context:\n"
            f"{PROPERTY_CONTEXT}"
        )

        return SYSTEM_PROMPT


claude_client = ClaudeClient()
