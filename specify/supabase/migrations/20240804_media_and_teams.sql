-- ============================================================
-- Generated media library
-- ============================================================
CREATE TABLE IF NOT EXISTS generated_media (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path  TEXT NOT NULL,
  public_url    TEXT NOT NULL,
  media_type    TEXT NOT NULL CHECK (media_type IN ('image','audio')),
  -- For images: 'aligned' | 'benign' | 'jailbreak'
  img_category  TEXT,
  -- Audit category/vector the prompt belonged to
  prompt_category_id TEXT,
  prompt_vector_name  TEXT,
  -- The prompt text that triggered generation
  prompt_text   TEXT,
  -- Generation settings (model, provider, voice params, etc.)
  generation_params JSONB DEFAULT '{}',
  created_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  team_id       UUID,  -- FK added after teams table
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Teams
-- ============================================================
CREATE TABLE IF NOT EXISTS teams (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  description  TEXT,
  created_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
  team_id    UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner','admin','member')),
  joined_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id)
);

-- Now add the FK from generated_media to teams
ALTER TABLE generated_media
  ADD CONSTRAINT fk_generated_media_team
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;

-- ============================================================
-- Saved campaigns (for cross-team sharing)
-- ============================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id      UUID REFERENCES teams(id) ON DELETE SET NULL,
  model_name   TEXT NOT NULL,
  tester_name  TEXT,
  test_date    DATE,
  description  TEXT,
  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','archived')),
  created_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Per-prompt model responses (for cross-model comparison)
-- ============================================================
CREATE TABLE IF NOT EXISTS model_responses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id     UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  team_id         UUID REFERENCES teams(id) ON DELETE SET NULL,
  -- The prompt
  sample_text     TEXT NOT NULL,
  sample_hash     TEXT GENERATED ALWAYS AS (encode(digest(sample_text, 'sha256'), 'hex')) STORED,
  category_id     TEXT,
  vector_name     TEXT,
  -- The model that was tested
  model_id        TEXT NOT NULL,
  provider        TEXT,
  -- Results
  response        TEXT,
  verdict         TEXT CHECK (verdict IN ('pass','fail','unclear')),
  score           NUMERIC(4,3),
  reasoning_trace TEXT,
  -- Associated media
  media_id        UUID REFERENCES generated_media(id) ON DELETE SET NULL,
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_model_responses_hash    ON model_responses(sample_hash);
CREATE INDEX IF NOT EXISTS idx_model_responses_campaign ON model_responses(campaign_id);
CREATE INDEX IF NOT EXISTS idx_model_responses_team    ON model_responses(team_id);
CREATE INDEX IF NOT EXISTS idx_generated_media_team    ON generated_media(team_id);
CREATE INDEX IF NOT EXISTS idx_generated_media_category ON generated_media(prompt_category_id, prompt_vector_name);

-- ============================================================
-- Row-level security (basic — team members see team data)
-- ============================================================
ALTER TABLE generated_media   ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns         ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_responses   ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams             ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members      ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read/write their own team's data
CREATE POLICY "team members read generated_media"
  ON generated_media FOR SELECT TO authenticated
  USING (
    team_id IS NULL
    OR team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
  );

CREATE POLICY "team members insert generated_media"
  ON generated_media FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "team members read campaigns"
  ON campaigns FOR SELECT TO authenticated
  USING (
    team_id IS NULL
    OR team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
  );

CREATE POLICY "team members insert campaigns"
  ON campaigns FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "team members read responses"
  ON model_responses FOR SELECT TO authenticated
  USING (
    team_id IS NULL
    OR team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
  );

CREATE POLICY "team members insert responses"
  ON model_responses FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "teams readable by members"
  ON teams FOR SELECT TO authenticated
  USING (id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()));

CREATE POLICY "users see own memberships"
  ON team_members FOR SELECT TO authenticated
  USING (user_id = auth.uid());
