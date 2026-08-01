-- Migration v5: Add referenceUrls column to Package table

ALTER TABLE "Package" ADD COLUMN IF NOT EXISTS "referenceUrls" TEXT[] NOT NULL DEFAULT '{}';
