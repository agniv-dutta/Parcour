"""Wrapper around Anthropic (Claude) API calls for drafting replies and classification."""
from __future__ import annotations

import asyncio
import inspect
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

    async def _call_sdk_method(self, method, **kwargs):
        """Call Anthropic SDK methods safely across sync/async variants."""
        if inspect.iscoroutinefunction(method):
            return await method(**kwargs)
        return await asyncio.to_thread(method, **kwargs)

    @staticmethod
    def _extract_text(response) -> str:
        """Extract plain text from Claude response shapes used by SDK versions."""
        # Modern messages API: response.content is a list of typed blocks.
        content = getattr(response, "content", None)
        if isinstance(content, list):
            parts = []
            for block in content:
                text = getattr(block, "text", None)
                if text:
                    parts.append(text)
                elif isinstance(block, dict) and block.get("text"):
                    parts.append(str(block["text"]))
            if parts:
                return "\n".join(parts).strip()

        # Older completions APIs.
        text = getattr(response, "completion", None) or getattr(response, "text", None)
        if text:
            return str(text).strip()

        choices = getattr(response, "choices", None)
        if choices:
            first = choices[0]
            choice_text = getattr(first, "text", None)
            if choice_text:
                return str(choice_text).strip()
            if isinstance(first, dict) and first.get("text"):
                return str(first["text"]).strip()

        if isinstance(response, dict):
            if response.get("completion"):
                return str(response["completion"]).strip()
            if response.get("text"):
                return str(response["text"]).strip()
            if response.get("choices"):
                first = response["choices"][0]
                if isinstance(first, dict) and first.get("text"):
                    return str(first["text"]).strip()

        raise ClaudeAPIError("Claude response did not contain text content")

    async def _complete(self, system_prompt: str, user_prompt: str, max_tokens: int) -> str:
        """Generate text using Claude, preferring messages API with a legacy fallback."""
        if not _HAS_ANTHROPIC:
            raise ClaudeAPIError("anthropic SDK is not installed")
        if not self.client:
            raise ClaudeAPIError("ANTHROPIC_API_KEY is not configured")

        # Preferred path for current Anthropic models/SDK.
        if hasattr(self.client, "messages") and hasattr(self.client.messages, "create"):
            try:
                response = await self._call_sdk_method(
                    self.client.messages.create,
                    model=self.model,
                    max_tokens=max_tokens,
                    system=system_prompt,
                    messages=[{"role": "user", "content": user_prompt}],
                )
                return self._extract_text(response)
            except Exception as exc:
                logger.warning("Claude messages.create failed, attempting legacy fallback: %s", exc)

        # Legacy fallback for older clients.
        prompt = f"{system_prompt}\n\nHuman: {user_prompt}\n\nAssistant:"
        try:
            if hasattr(self.client, "completions") and hasattr(self.client.completions, "create"):
                response = await self._call_sdk_method(
                    self.client.completions.create,
                    model=self.model,
                    prompt=prompt,
                    max_tokens=max_tokens,
                )
                return self._extract_text(response)
            if hasattr(self.client, "create_completion"):
                response = await self._call_sdk_method(
                    self.client.create_completion,
                    model=self.model,
                    prompt=prompt,
                    max_tokens=max_tokens,
                )
                return self._extract_text(response)
            if hasattr(self.client, "create"):
                response = await self._call_sdk_method(
                    self.client.create,
                    prompt=prompt,
                    model=self.model,
                    max_tokens=max_tokens,
                )
                return self._extract_text(response)
        except Exception as exc:
            logger.exception("Claude completion error: %s", exc)
            raise ClaudeAPIError(str(exc))

        raise ClaudeAPIError("No compatible Anthropic completion method found")

    async def draft_reply(self, guest_name: str, message_text: str, query_type: str, booking_ref: str, property_id: str) -> str:
        """Draft a reply using Claude.

        Returns the assistant text or raises ClaudeAPIError.
        """
        system_prompt = self._system_prompt()
        user_prompt = f"QueryType: {query_type}\nBookingRef: {booking_ref}\nGuestName: {guest_name}\nMessage: {message_text}\n"

        try:
            return await self._complete(system_prompt=system_prompt, user_prompt=user_prompt, max_tokens=500)
        except Exception as exc:
            logger.exception("Claude API error: %s", exc)
            raise ClaudeAPIError(str(exc))

    async def classify_text(self, message: str) -> str:
        """Call Claude to classify a message into a single category label."""
        prompt = (
            'Classify this guest message into exactly one category. '\
            'Reply with ONLY the category name, nothing else. '\
            'Categories: pre_sales_availability, pre_sales_pricing, post_sales_checkin, special_request, complaint, general_enquiry '\
            f'Message: "{message}"'
        )

        try:
            return await self._complete(system_prompt="You are a strict classifier.", user_prompt=prompt, max_tokens=50)
        except Exception as exc:
            logger.exception("Claude classification error: %s", exc)
            raise ClaudeAPIError(str(exc))

    async def get_custom_completion(self, system_prompt: str, user_prompt: str, max_tokens: int = 1000) -> str:
        """Generic method to get a completion from Claude with custom prompts."""
        try:
            return await self._complete(system_prompt=system_prompt, user_prompt=user_prompt, max_tokens=max_tokens)
        except Exception as exc:
            logger.exception("Claude completion error: %s", exc)
            raise ClaudeAPIError(str(exc))

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
