-- Migration v8: Newsletter subscriptions

CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
  "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "email"       TEXT NOT NULL,
  "name"        TEXT,
  "org"         TEXT,
  "userId"      TEXT,
  "confirmedAt" TIMESTAMP(3),
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "NewsletterSubscriber_email_key" UNIQUE ("email"),
  CONSTRAINT "NewsletterSubscriber_userId_key" UNIQUE ("userId"),
  CONSTRAINT "NewsletterSubscriber_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL
);
