-- Migration v7: Self Audit — prompt quality confirmations + model benchmark results

-- Prompt quality confirmations (users upvote the quality of a test prompt)
CREATE TABLE IF NOT EXISTS "PromptQuality" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "promptKey" TEXT NOT NULL,            -- "categoryId:::vectorName:::sampleIndex"
  "userId"    TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PromptQuality_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PromptQuality_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "PromptQuality_promptKey_userId_key"
    UNIQUE ("promptKey", "userId")
);

CREATE INDEX IF NOT EXISTS "PromptQuality_promptKey_idx" ON "PromptQuality" ("promptKey");

-- Model benchmark results (model evaluation scores against self-audit dataset)
CREATE TABLE IF NOT EXISTS "ModelBenchmarkResult" (
  "id"            TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "modelName"     TEXT NOT NULL,
  "modelVersion"  TEXT,
  "provider"      TEXT,
  "categoryId"    TEXT NOT NULL,
  "categoryName"  TEXT NOT NULL,
  "totalSamples"  INTEGER NOT NULL,
  "passCount"     INTEGER NOT NULL,
  "failCount"     INTEGER NOT NULL,
  "notes"         TEXT,
  "submittedById" TEXT,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ModelBenchmarkResult_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ModelBenchmarkResult_submittedById_fkey"
    FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS "ModelBenchmarkResult_modelName_idx"   ON "ModelBenchmarkResult" ("modelName");
CREATE INDEX IF NOT EXISTS "ModelBenchmarkResult_categoryId_idx"  ON "ModelBenchmarkResult" ("categoryId");
CREATE INDEX IF NOT EXISTS "ModelBenchmarkResult_createdAt_idx"   ON "ModelBenchmarkResult" ("createdAt");
