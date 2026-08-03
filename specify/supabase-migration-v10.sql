-- Migration v10: Package metric votes
CREATE TABLE "PackageMetricVote" (
  "id"        TEXT NOT NULL,
  "packageId" TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "metric"    TEXT NOT NULL,
  "score"     INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PackageMetricVote_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PackageMetricVote_packageId_userId_metric_key"
  ON "PackageMetricVote"("packageId", "userId", "metric");

CREATE INDEX "PackageMetricVote_packageId_idx"
  ON "PackageMetricVote"("packageId");

ALTER TABLE "PackageMetricVote"
  ADD CONSTRAINT "PackageMetricVote_packageId_fkey"
  FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PackageMetricVote"
  ADD CONSTRAINT "PackageMetricVote_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
