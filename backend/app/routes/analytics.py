from __future__ import annotations

import json
import logging
from typing import Any

from fastapi import APIRouter, HTTPException
from ..schemas import AnalyticsStats, AnalyticsInsightsResponse
from ..claude_client import claude_client, ClaudeAPIError

logger = logging.getLogger(__name__)
router = APIRouter()

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
        return parsed_insights

    except ClaudeAPIError as exc:
        logger.exception("Claude failed to generate insights: %s", exc)
        raise HTTPException(status_code=503, detail=f"Claude API error: {exc}")
    except json.JSONDecodeError as exc:
        logger.exception("Failed to parse Claude response as JSON: %s. Raw: %s", exc, raw_response)
        raise HTTPException(status_code=500, detail="Failed to parse AI insights response")
    except Exception as exc:
        logger.exception("Unexpected error generating insights: %s", exc)
        raise HTTPException(status_code=500, detail="Internal server error during insights generation")
