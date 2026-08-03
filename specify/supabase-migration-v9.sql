-- Migration v9: GSN Claims, Requirements, Evidence

-- Claims (top-level assurance statements in a package)
CREATE TABLE IF NOT EXISTS "PackageClaim" (
  "id"           TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "packageId"    TEXT NOT NULL,
  "text"         TEXT NOT NULL,
  "systemLevels" TEXT[] NOT NULL DEFAULT '{}',
  "order"        INTEGER NOT NULL DEFAULT 0,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PackageClaim_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PackageClaim_packageId_fkey"
    FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "PackageClaim_packageId_idx" ON "PackageClaim" ("packageId");

-- Legal obligation references on claims
CREATE TABLE IF NOT EXISTS "ClaimLegalRef" (
  "id"      TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "claimId" TEXT NOT NULL,
  "source"  TEXT NOT NULL,
  "text"    TEXT NOT NULL,

  CONSTRAINT "ClaimLegalRef_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ClaimLegalRef_claimId_fkey"
    FOREIGN KEY ("claimId") REFERENCES "PackageClaim"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "ClaimLegalRef_claimId_idx" ON "ClaimLegalRef" ("claimId");

-- Requirements under claims (Architecture | Functional | Process)
CREATE TABLE IF NOT EXISTS "PackageRequirement" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "claimId"   TEXT NOT NULL,
  "type"      TEXT NOT NULL,
  "text"      TEXT NOT NULL,
  "order"     INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PackageRequirement_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PackageRequirement_claimId_fkey"
    FOREIGN KEY ("claimId") REFERENCES "PackageClaim"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "PackageRequirement_claimId_idx" ON "PackageRequirement" ("claimId");

-- Evidence that requirements are met
CREATE TABLE IF NOT EXISTS "PackageEvidence" (
  "id"            TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "requirementId" TEXT NOT NULL,
  "title"         TEXT NOT NULL,
  "description"   TEXT,
  "url"           TEXT,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PackageEvidence_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PackageEvidence_requirementId_fkey"
    FOREIGN KEY ("requirementId") REFERENCES "PackageRequirement"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "PackageEvidence_requirementId_idx" ON "PackageEvidence" ("requirementId");
