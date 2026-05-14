# Part 3 — Thinking Question

## The Scenario
3am. Villa B1. Guest message: *"There is no hot water and we have guests arriving for breakfast in 4 hours. This is unacceptable. I want a refund for tonight."*

---

## Question A — The Immediate Response

**AI reply sent at 3:07am:**

> Hi [Guest Name], I'm so sorry — this is completely unacceptable and I understand the urgency with your guests arriving at 7am. I've already alerted our caretaker and property manager and they will call you within the next 15 minutes. We will resolve this tonight. A refund for tonight's stay is being processed and you will receive confirmation by morning. Please stay warm — we are on this right now.

**Why this wording:**
The message leads with accountability, not process. It gives a concrete next step with a time commitment (15 minutes, not "soon"), pre-authorises the refund rather than promising to "look into it", and closes with human warmth. At 3am a guest needs to feel someone is awake and moving — not reading a policy.

---

## Question B — The System Design

Beyond sending the message, the platform triggers this sequence automatically:

1. **Classify as complaint + confidence < 0.60** → action = `escalate`, bypasses auto-send
2. **Immediate notifications** (within 60 seconds of message receipt):
	- SMS + WhatsApp push to on-call caretaker with guest name, villa, and issue
	- Email to property manager with full message thread
	- Slack/internal alert to ops team flagged URGENT
3. **Incident log created** in database: timestamp, property_id, issue_type = "maintenance", status = "open"
4. **30-minute escalation timer starts**: if no human marks incident as "acknowledged" in the dashboard, the system auto-escalates — sends a second SMS to property manager and flags the conversation red in the agent dashboard
5. **Refund flag**: a refund_requested field is set on the reservation record, triggering a finance workflow for human approval by 9am
6. **Guest follow-up**: if caretaker has not updated status within 90 minutes, the AI sends a second message: *"Our caretaker is on the way — we'll update you shortly."*

---

## Question C — The Learning

Two prior complaints about hot water at Villa B1 means this is a maintenance pattern, not a one-off.

**What I would build:**

1. **Pattern detection query** — a scheduled job (runs nightly) queries the messages table: `WHERE property_id = 'villa-b1' AND query_type = 'complaint' AND message_text ILIKE '%hot water%'`. On third occurrence, triggers a maintenance alert to property management.

2. **Proactive pre-arrival check** — 24 hours before every check-in at Villa B1, the system sends an automated checklist to the caretaker including "hot water functional: ✓/✗". No human has to remember.

3. **Guest pre-emption** — if the hot water issue recurs a fourth time before the fix is confirmed, the system sends an arrival message to incoming guests: *"Our team has performed a full systems check on the villa — everything is in order for your stay."* This builds trust before a complaint can form.

The goal is to turn reactive AI into preventive infrastructure.
