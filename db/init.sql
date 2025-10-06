-- Ensure ideas table exists on first boot
CREATE TABLE IF NOT EXISTS ideas (
  id SERIAL PRIMARY KEY,
  text VARCHAR(280) NOT NULL,
  votes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
