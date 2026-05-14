Parcour Message Handler
=======================

Project Overview
----------------
Parcour Message Handler is a FastAPI-based backend that ingests guest messages from multiple channels, classifies intent, drafts AI replies using Anthropic Claude, scores confidence, and persists the conversation data in a SQLite database. It is designed for production-ready patterns while remaining lightweight and easy to run locally.

Tech Stack
----------
- Python 3.11+
- FastAPI + Uvicorn
- SQLite (aiosqlite + SQLAlchemy async)
- Anthropic Python SDK (Claude)
- python-dotenv for environment variables

Setup Instructions
------------------
1. Clone the repo and change directory:

```bash
git clone <repo> && cd Parcour
```

2. Create and activate a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

PowerShell on Windows uses a different activation command:

```powershell
& .\.venv\Scripts\Activate.ps1
```

If PowerShell blocks script execution, run this once in the current terminal session:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

3. Copy `.env.example` to `.env` and fill in `ANTHROPIC_API_KEY`.

4. Run the app:

```bash
uvicorn backend.app.main:app --reload --port 8000
```

Environment Variables
---------------------
ENV | Description
:--|:--
`ANTHROPIC_API_KEY` | API key for Anthropic Claude
`MODEL_NAME` | Claude model name (default: claude-sonnet-4-20250514)
`DATABASE_URL` | SQLAlchemy DB URL (default sqlite+aiosqlite:///./parcour.db)
`APP_ENV` | Application environment (development/production)
`LOG_LEVEL` | Logging level

API Reference
-------------
Health

```bash
curl http://localhost:8000/api/v1/health
```

Webhook

```bash
curl -X POST http://localhost:8000/api/v1/webhook/message \
  -H "Content-Type: application/json" \
  -d '{"source":"whatsapp","guest_name":"Alice","message":"Is the villa available on April 21?","timestamp":"2026-04-01T12:00:00Z","booking_ref":"","property_id":"villa-b1"}'
```

List messages

```bash
curl http://localhost:8000/api/v1/messages
```

The response is a flat array of joined message records with these fields: `id`, `source`, `guest_name`, `message_text`, `query_type`, `confidence_score`, `action`, `drafted_reply`, `booking_ref`, `property_id`, `timestamp`, and `processing_time_ms`.

Get message

```bash
curl http://localhost:8000/api/v1/messages/<message_id>
```

Seed Sample Data
----------------
To load the four demo messages used in local testing, run:

```powershell
cd backend
python app/seed.py
```

This seeds Rahul, Priya, Arjun, and Kavya into the SQLite database used by the app.

Notes
-----
- The app now allows `http://localhost:5173` in CORS so the Vite frontend can call the API directly.
- The health endpoint returns `status`, `model`, `db`, `message_count`, and `env`.

Confidence Scoring Logic
------------------------
The `calculate_confidence` function follows these rules:

1. Start with the classifier confidence (from rule-based match or Claude fallback).
2. If message length &gt; 20 words, add +0.05.
3. If a booking reference is present, add +0.05.
4. If the message is a complaint, cap score at 0.58 (always escalate complaints).
5. Clamp the final score into [0.0, 1.0].

Action mapping:
- score >= 0.85 → `auto_send`
- 0.60 <= score &lt; 0.85 → `agent_review`
- score &lt; 0.60 OR complaint → `escalate`

Query Classification
--------------------
Two-stage classifier:

1. Rule-based keyword matching across categories. If keyword-derived confidence &gt;= 0.75, use it.
2. Otherwise, fallback to Claude with a tightly scoped prompt asking for exactly one category.

Testing
-------
Three sample curl commands:

1. Availability query (pre-sales availability):

```bash
curl -X POST http://localhost:8000/api/v1/webhook/message \
  -H "Content-Type: application/json" \
  -d '{"source":"whatsapp","guest_name":"Raj","message":"Is the villa available on April 21-23?","timestamp":"2026-04-01T12:00:00Z","booking_ref":"","property_id":"villa-b1"}'
```

2. Complaint:

```bash
curl -X POST http://localhost:8000/api/v1/webhook/message \
  -H "Content-Type: application/json" \
  -d '{"source":"airbnb","guest_name":"Maya","message":"The air conditioning is not working and this is unacceptable","timestamp":"2026-04-02T08:00:00Z","booking_ref":"BR-123","property_id":"villa-b1"}'
```

3. Post-checkin question:

```bash
curl -X POST http://localhost:8000/api/v1/webhook/message \
  -H "Content-Type: application/json" \
  -d '{"source":"direct","guest_name":"Luca","message":"Hi, what's the wifi password?","timestamp":"2026-04-03T10:00:00Z","booking_ref":"BR-456","property_id":"villa-b1"}'
```

Design Decisions
----------------
- SQLite: lightweight, zero-dependency, suitable for single-server deployments and tests.
- Two-stage classifier: low-latency rule-based first, with Claude fallback for ambiguous messages.
- Async SQLAlchemy + aiosqlite: keeps the I/O non-blocking in FastAPI.
- Anthropic Claude: high-quality natural language drafts and classification fallback.
