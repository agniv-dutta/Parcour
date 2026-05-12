# Thinking / Part 3

This file contains notes and the answers for Part 3 (placeholder structure).

1. Approach

- Implemented two-stage classifier with rule-based keywords and Claude fallback.
- Used SQLite for simplicity and async SQLAlchemy for non-blocking DB access.

2. Potential Improvements

- Add guest lookup by email/phone when available instead of name-only.
- Add background tasks for sending auto-sent replies and webhooks to downstream systems.

3. Security

- API keys are read from environment variables (.env) and not checked in.
