-- Migration v3: Vendor marketplace, requirement media
-- Run this in the Supabase SQL Editor

-- Vendor table
CREATE TABLE IF NOT EXISTS "Vendor" (
  "id"             TEXT NOT NULL,
  "name"           TEXT NOT NULL,
  "website"        TEXT,
  "description"    TEXT,
  "logoUrl"        TEXT,
  "categories"     TEXT[] DEFAULT '{}',
  "verified"       BOOLEAN NOT NULL DEFAULT false,
  "submittedById"  TEXT,
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Vendor_submittedById_fkey"
    FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS "Vendor_verified_idx" ON "Vendor"("verified");

-- Media column on Requirement
ALTER TABLE "Requirement"
  ADD COLUMN IF NOT EXISTS "media" JSONB NOT NULL DEFAULT '[]';
