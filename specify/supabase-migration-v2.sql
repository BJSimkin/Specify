-- Migration v2: New taxonomy, AI models with purpose, datasets, vendors, compliance
-- Run this in the Supabase SQL Editor

ALTER TABLE "Package"
  ADD COLUMN IF NOT EXISTS "aiModels"          JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "datasetRefs"       JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "vendorList"        JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "taxonomyData"      JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "complianceTargets" TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "otherCompliance"   TEXT;
