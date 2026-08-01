-- Migration v4: Card template download tracking
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS "CardTemplate" (
  "id"            TEXT NOT NULL,
  "downloadCount" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "CardTemplate_pkey" PRIMARY KEY ("id")
);

-- Seed the four card types
INSERT INTO "CardTemplate" ("id", "downloadCount")
VALUES
  ('system-card', 0),
  ('model-card', 0),
  ('dataset-card', 0),
  ('provenance-record', 0)
ON CONFLICT ("id") DO NOTHING;
