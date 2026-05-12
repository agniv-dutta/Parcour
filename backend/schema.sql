-- SQLite schema for Nistula Message Handler (moved into backend)

CREATE TABLE IF NOT EXISTS guest_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  created_at TEXT,
  channels JSON
);

CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  booking_ref TEXT UNIQUE,
  property_id TEXT NOT NULL,
  guest_id TEXT NOT NULL,
  check_in TEXT,
  check_out TEXT,
  status TEXT,
  created_at TEXT
);

CREATE INDEX IF NOT EXISTS ix_reservation_booking_ref ON reservations(booking_ref);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  guest_id TEXT NOT NULL,
  reservation_id TEXT,
  property_id TEXT NOT NULL,
  channel TEXT NOT NULL,
  created_at TEXT,
  last_message_at TEXT
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  source TEXT NOT NULL,
  direction TEXT NOT NULL,
  message_text TEXT NOT NULL,
  query_type TEXT,
  confidence_score REAL,
  drafted_reply TEXT,
  action TEXT,
  ai_drafted INTEGER DEFAULT 1,
  agent_edited INTEGER DEFAULT 0,
  auto_sent INTEGER DEFAULT 0,
  timestamp TEXT,
  created_at TEXT
);
