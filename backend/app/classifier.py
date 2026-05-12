"""Two-stage classifier: rule-based keyword matching and Claude fallback."""
from __future__ import annotations

from typing import Tuple, Dict, List
import re
from .claude_client import claude_client, ClaudeAPIError
import logging

logger = logging.getLogger(__name__)


KEYWORD_MAP: Dict[str, List[str]] = {
    "pre_sales_availability": ["available", "availability", "free", "dates", "book", "vacancy"],
    "pre_sales_pricing": ["rate", "price", "cost", "charge", "fee", "per night", "how much"],
    "post_sales_checkin": ["check in", "check-in", "wifi", "password", "key", "arrival", "time"],
    "special_request": ["early", "late checkout", "transfer", "airport", "chef", "extra"],
    "complaint": ["unacceptable", "refund", "not working", "broken", "unhappy", "disappointed", "complaint"],
    "general_enquiry": ["pet", "parking", "pool", "beach", "distance", "allow"],
}

PRIORITY = ["complaint", "post_sales_checkin", "pre_sales_availability", "pre_sales_pricing", "special_request", "general_enquiry"]


def _tokenize(text: str) -> str:
    return text.lower()


def rule_based_classify(message: str) -> Tuple[str, float]:
    """Classify using keyword matching.

    Returns (best_category, confidence) where confidence is in [0,1].
    """
    text = _tokenize(message)
    scores: Dict[str, int] = {k: 0 for k in KEYWORD_MAP}

    for cat, keywords in KEYWORD_MAP.items():
        for kw in keywords:
            if kw in text:
                scores[cat] += 1

    # Determine best category by count
    best = max(scores.items(), key=lambda x: x[1])
    best_cat, best_count = best

    # Compute a simple confidence: matches / keyword_set_size
    kw_count = len(KEYWORD_MAP[best_cat])
    confidence = float(best_count) / float(kw_count) if kw_count > 0 else 0.0

    # If multiple categories have matches, choose by priority order
    multi = [cat for cat, cnt in scores.items() if cnt > 0]
    if len(multi) > 1:
        for p in PRIORITY:
            if p in multi:
                best_cat = p
                break

    return best_cat, confidence


async def classify_message(message: str) -> Tuple[str, float]:
    """Classify message using two-stage approach.

    Returns (query_type, classifier_confidence).
    """
    best_cat, confidence = rule_based_classify(message)
    if confidence >= 0.75:
        return best_cat, confidence

    # Fallback to Claude
    try:
        claude_label = await claude_client.classify_text(message)
        claude_label = claude_label.strip()
        if claude_label in KEYWORD_MAP:
            # Provide moderate confidence for Claude fallback
            return claude_label, max(confidence, 0.7)
        else:
            # If Claude returns unexpected label, return rule-based
            logger.warning("Claude returned unknown label '%s'", claude_label)
            return best_cat, confidence
    except ClaudeAPIError as exc:
        logger.exception("Claude classification failed: %s", exc)
        # On error, fall back to rule-based result
        return best_cat, confidence
