from __future__ import annotations

import json
import logging
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import ValidationError
from ..schemas import AnalyticsStats, AnalyticsInsightsResponse
from ..claude_client import claude_client, ClaudeAPIError

logger = logging.getLogger(__name__)
router = APIRouter()


def _build_fallback_insights(stats: AnalyticsStats) -> dict[str, Any]:
    """Generate deterministic insights when AI is unavailable."""
    total = max(stats.total_messages, 1)
    escalation_rate = round((stats.escalated_count / total) * 100)
    auto_rate = max(0, min(stats.auto_sent_pct, 100))
    confidence_pct = max(0.0, min(stats.avg_confidence * 100, 100.0))
    risk_penalty = max(0, min(100, escalation_rate * 2))

    performance_score = int(round(auto_rate * 0.45 + confidence_pct * 0.35 + (100 - risk_penalty) * 0.20))
    if performance_score >= 80:
        performance_label = "Good"
    elif performance_score >= 60:
        performance_label = "Needs Attention"
    else:
        performance_label = "Critical"

    top_query = "General"
    top_count = 0
    if stats.query_breakdown:
        top_query, top_count = max(stats.query_breakdown.items(), key=lambda kv: kv[1])

    first_half = sum(stats.daily_volume[: max(1, len(stats.daily_volume) // 2)])
    second_half = sum(stats.daily_volume[max(1, len(stats.daily_volume) // 2) :])
    trend = "up" if second_half > first_half else "down" if second_half < first_half else "flat"

    insights = [
        {
            "type": "positive" if auto_rate >= 60 else "warning",
            "title": "Automation Coverage",
            "body": (
                f"{auto_rate}% of messages were auto-sent this period. "
                f"That leaves {100 - auto_rate}% requiring manual handling and review effort."
            ),
            "metric": f"{auto_rate}% auto-sent",
            "action": "Raise automation for repeated query templates by updating response playbooks.",
        },
        {
            "type": "positive" if confidence_pct >= 85 else "warning",
            "title": "Model Confidence Health",
            "body": (
                f"Average confidence is {stats.avg_confidence:.2f} across {stats.total_messages} messages. "
                "Lower-confidence decisions should be sampled for QA to prevent drift."
            ),
            "metric": f"{stats.avg_confidence:.2f} avg confidence",
            "action": "Review low-confidence messages weekly and add missing intents to classifier rules.",
        },
        {
            "type": "critical" if escalation_rate >= 25 else "warning" if escalation_rate >= 10 else "opportunity",
            "title": "Escalation Pressure",
            "body": (
                f"{stats.escalated_count} of {stats.total_messages} messages escalated ({escalation_rate}%). "
                "Escalation concentration is a leading indicator of guest risk and team load."
            ),
            "metric": f"{escalation_rate}% escalated",
            "action": "Create a fast-lane triage for complaint and check-in issues to reduce escalations.",
        },
        {
            "type": "opportunity",
            "title": "Volume and Intent Pattern",
            "body": (
                f"Top query type is {top_query} ({top_count}). "
                f"Daily message volume trend is {trend} in the latter half of the period."
            ),
            "metric": f"Top intent: {top_query}",
            "action": "Pre-draft answers for the top query type and schedule staffing to match the volume trend.",
        },
    ]

    headline = f"Performance score {performance_score} with {escalation_rate}% escalation rate"
    week_summary = (
        f"Processed {stats.total_messages} messages with {auto_rate}% auto-send and {stats.avg_confidence:.2f} average confidence. "
        f"Escalations were {stats.escalated_count} ({escalation_rate}%). "
        f"Most frequent intent: {top_query}."
    )

    return AnalyticsInsightsResponse(
        headline=headline,
        insights=insights,
        performance_score=performance_score,
        performance_label=performance_label,
        week_summary=week_summary,
    ).model_dump()

@router.post("/analytics/insights", response_model=AnalyticsInsightsResponse, tags=["analytics"])
async def get_analytics_insights(stats: AnalyticsStats) -> Any:
    """Generate AI insights based on messaging statistics using Claude."""
    system_prompt = (
        "You are an AI operations analyst for Nistula, a luxury villa rental company in Goa. "
        "You are analyzing messaging data from the guest communications platform. "
        "Return ONLY a valid JSON object — no markdown, no explanation, just raw JSON."
    )

    user_prompt = f"""
Analyze this messaging data and return insights as JSON:
{stats.json()}

Return exactly this structure:
{{
  "headline": "One sharp sentence summarizing performance (max 12 words)",
  "insights": [
    {{
      "type": "positive|warning|critical|opportunity",
      "title": "Short title (4-6 words)",
      "body": "2-3 sentence explanation with specific numbers from the data",
      "metric": "key number or percentage to highlight",
      "action": "One concrete recommended action"
    }}
  ],
  "performance_score": 78,
  "performance_label": "Good | Needs Attention | Critical",
  "week_summary": "2-3 sentence plain English summary of the week"
}}

Generate exactly 4 insights. Use the actual numbers. Be specific.
"""

    try:
        raw_response = await claude_client.get_custom_completion(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=1500
        )
        
        # Clean up response in case Claude included markdown fences
        clean_json = raw_response
        if "```json" in raw_response:
            clean_json = raw_response.split("```json")[1].split("```")[0].strip()
        elif "```" in raw_response:
            clean_json = raw_response.split("```")[1].strip()

        parsed_insights = json.loads(clean_json)
        validated = AnalyticsInsightsResponse.model_validate(parsed_insights)
        return validated.model_dump()

    except ClaudeAPIError as exc:
        logger.warning("Claude unavailable for insights, returning fallback output: %s", exc)
        return _build_fallback_insights(stats)
    except json.JSONDecodeError as exc:
        logger.warning("Invalid Claude JSON for insights, returning fallback output: %s", exc)
        return _build_fallback_insights(stats)
    except ValidationError as exc:
        logger.warning("Claude insights schema mismatch, returning fallback output: %s", exc)
        return _build_fallback_insights(stats)
    except Exception as exc:
        logger.exception("Unexpected error generating insights: %s", exc)
        raise HTTPException(status_code=500, detail="Internal server error during insights generation")
