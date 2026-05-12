"""Confidence scoring for classified messages.

Provides `calculate_confidence` which implements the scoring rules.
"""
from __future__ import annotations

from typing import Tuple


def calculate_confidence(
    query_type: str,
    classifier_confidence: float,
    message_length: int,
    has_booking_ref: bool,
    is_complaint: bool,
) -> Tuple[float, str]:
    """Calculate a final confidence score and map it to an action.

    Rules:
    1. Start with classifier_confidence as base
    2. If message_length > 20 words: +0.05
    3. If has_booking_ref: +0.05
    4. If is_complaint: cap at 0.58 regardless
    5. Clamp to [0.0, 1.0]

    Action mapping:
    - score >= 0.85 → "auto_send"
    - 0.60 <= score < 0.85 → "agent_review"
    - score < 0.60 OR complaint → "escalate"

    Returns (score, action)
    """
    score = float(classifier_confidence)

    if message_length > 20:
        score += 0.05

    if has_booking_ref:
        score += 0.05

    if is_complaint:
        score = min(score, 0.58)

    # Clamp
    score = max(0.0, min(1.0, score))

    if is_complaint or score < 0.60:
        action = "escalate"
    elif score >= 0.85:
        action = "auto_send"
    else:
        action = "agent_review"

    return score, action
