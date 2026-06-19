-- WA AutoReply A/B Testing Events
-- Run in Supabase SQL Editor (idempotent)

CREATE TABLE IF NOT EXISTS wa_ab_events (
  id BIGSERIAL PRIMARY KEY,
  event TEXT NOT NULL CHECK (event IN ('pageview', 'cta_click', 'scroll_depth', 'conversion', 'form_view')),
  experiment TEXT,
  variant TEXT CHECK (variant IS NULL OR variant IN ('A', 'B', 'C', 'D')),
  meta JSONB DEFAULT '{}'::jsonb,
  url TEXT,
  referrer TEXT,
  ip_address TEXT,
  user_agent TEXT,
  visitor_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wa_ab_events_event ON wa_ab_events(event, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wa_ab_events_experiment ON wa_ab_events(experiment, variant, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wa_ab_events_visitor ON wa_ab_events(visitor_id, created_at DESC);

ALTER TABLE wa_ab_events ENABLE ROW LEVEL SECURITY;

-- Allow anon INSERT (page-side tracking)
DROP POLICY IF EXISTS "Anon insert ab events" ON wa_ab_events;
CREATE POLICY "Anon insert ab events" ON wa_ab_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Service role full access
DROP POLICY IF EXISTS "Service role full access ab" ON wa_ab_events;
CREATE POLICY "Service role full access ab" ON wa_ab_events
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Helper view for conversion rate analysis
CREATE OR REPLACE VIEW wa_ab_conversion_summary AS
SELECT
  experiment,
  variant,
  COUNT(DISTINCT CASE WHEN event = 'pageview' THEN visitor_id END) AS unique_visitors,
  COUNT(DISTINCT CASE WHEN event = 'conversion' THEN visitor_id END) AS conversions,
  COUNT(DISTINCT CASE WHEN event = 'cta_click' THEN visitor_id END) AS cta_clicks,
  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN event = 'conversion' THEN visitor_id END)::numeric /
    NULLIF(COUNT(DISTINCT CASE WHEN event = 'pageview' THEN visitor_id END), 0),
    2
  ) AS conversion_rate_pct
FROM wa_ab_events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY experiment, variant
ORDER BY experiment, variant;

COMMENT ON TABLE wa_ab_events IS 'A/B test events from landing page (variants, conversions)';
COMMENT ON VIEW wa_ab_conversion_summary IS 'A/B test conversion rates last 30 days';
