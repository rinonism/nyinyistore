-- WA AutoReply Leads table
-- Run this in Supabase SQL Editor (https://app.supabase.com → SQL → New query)
-- Idempotent: safe to run multiple times

CREATE TABLE IF NOT EXISTS wa_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (length(name) >= 2 AND length(name) <= 100),
  business TEXT NOT NULL CHECK (length(business) >= 2 AND length(business) <= 100),
  email TEXT NOT NULL CHECK (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
  whatsapp TEXT NOT NULL CHECK (whatsapp ~ '^(\+?62|0)[0-9]{9,13}$'),
  industry TEXT,
  volume TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'trial', 'paid', 'lost')),
  source TEXT DEFAULT 'landing-page',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_wa_leads_status ON wa_leads(status);
CREATE INDEX IF NOT EXISTS idx_wa_leads_email ON wa_leads(email);
CREATE INDEX IF NOT EXISTS idx_wa_leads_created_at ON wa_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wa_leads_ip ON wa_leads(ip_address, created_at DESC);

-- Auto-update updated_at on UPDATE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS wa_leads_updated_at ON wa_leads;
CREATE TRIGGER wa_leads_updated_at
  BEFORE UPDATE ON wa_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE wa_leads ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (serverless API uses service_role key)
DROP POLICY IF EXISTS "Service role full access" ON wa_leads;
CREATE POLICY "Service role full access" ON wa_leads
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Allow anonymous INSERT (for lead form submissions)
DROP POLICY IF EXISTS "Anon insert only" ON wa_leads;
CREATE POLICY "Anon insert only" ON wa_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Anon can SELECT nothing (privacy — only admins see leads via service_role)
DROP POLICY IF EXISTS "Anon no select" ON wa_leads;
CREATE POLICY "Anon no select" ON wa_leads
  FOR SELECT
  TO anon
  USING (false);

COMMENT ON TABLE wa_leads IS 'WA AutoReply trial signups from landing page';
