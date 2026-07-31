-- Migration: Add new fields for Specify v2 features
-- Run this in the Supabase SQL Editor

-- 1. Add new columns to "User" table
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "country"      TEXT,
  ADD COLUMN IF NOT EXISTS "occupation"   TEXT,
  ADD COLUMN IF NOT EXISTS "specialty"    TEXT,
  ADD COLUMN IF NOT EXISTS "linkedinUrl"  TEXT,
  ADD COLUMN IF NOT EXISTS "publications" TEXT[] DEFAULT '{}';

-- 2. Add new columns to "Package" table
ALTER TABLE "Package"
  ADD COLUMN IF NOT EXISTS "aiModelUrls"  TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "datasetUrls"  TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "isOpenSource" BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS "publishedAt"  TIMESTAMPTZ;

-- 3. Add diffSummary to "PackageVersion" table
ALTER TABLE "PackageVersion"
  ADD COLUMN IF NOT EXISTS "diffSummary" TEXT;

-- 4. Add new notification types to the enum
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'STAR';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'FOLLOW';

-- 5. Add new columns to "UserPreference" table
ALTER TABLE "UserPreference"
  ADD COLUMN IF NOT EXISTS "notifyOnStar"   BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS "notifyOnFollow" BOOLEAN DEFAULT TRUE;

-- 6. Create the "Follow" table
CREATE TABLE IF NOT EXISTS "Follow" (
  "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "followerId"  TEXT NOT NULL,
  "followingId" TEXT NOT NULL,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Follow_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Follow_followerId_followingId_key" UNIQUE ("followerId", "followingId"),
  CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "Follow_followerId_idx" ON "Follow"("followerId");
CREATE INDEX IF NOT EXISTS "Follow_followingId_idx" ON "Follow"("followingId");

-- 7. Create the "PackageContributor" table
CREATE TABLE IF NOT EXISTS "PackageContributor" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "packageId" TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "role"      TEXT NOT NULL DEFAULT 'contributor',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "PackageContributor_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PackageContributor_packageId_userId_key" UNIQUE ("packageId", "userId"),
  CONSTRAINT "PackageContributor_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE,
  CONSTRAINT "PackageContributor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "PackageContributor_packageId_idx" ON "PackageContributor"("packageId");
