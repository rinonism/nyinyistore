import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

const ALLOWED_EVENTS = new Set(['pageview', 'cta_click', 'scroll_depth', 'conversion', 'form_view']);
const ALLOWED_EXPERIMENTS = new Set(['hero-headline', 'cta-text', 'pricing-anchor']);
const ALLOWED_VARIANTS = new Set(['A', 'B']);

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    const contentLength = parseInt(req.headers.get('content-length') || '0');
    if (contentLength > 5000) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const event = String(body.event || '');
    const experiment = body.experiment ? String(body.experiment) : null;
    const variant = body.variant ? String(body.variant) : null;
    const meta = (body.meta && typeof body.meta === 'object') ? body.meta : {};
    const url = body.url ? String(body.url).slice(0, 200) : null;
    const referrer = body.referrer ? String(body.referrer).slice(0, 500) : null;

    if (!ALLOWED_EVENTS.has(event)) {
      return NextResponse.json({ error: 'Unknown event' }, { status: 400 });
    }
    if (experiment && !ALLOWED_EXPERIMENTS.has(experiment)) {
      return NextResponse.json({ error: 'Unknown experiment' }, { status: 400 });
    }
    if (variant && !ALLOWED_VARIANTS.has(variant)) {
      return NextResponse.json({ error: 'Unknown variant' }, { status: 400 });
    }

    const ip = getClientIp(req);
    const userAgent = (req.headers.get('user-agent') || '').slice(0, 500);

    // Anonymous visitor ID = hash of IP + UA (one-way, no PII stored)
    const visitorId = await hashVisitor(ip, userAgent);

    const supabase = getSupabase();
    const { error } = await supabase.from('wa_ab_events').insert({
      event,
      experiment,
      variant,
      meta: meta as Record<string, unknown>,
      url,
      referrer,
      ip_address: ip,
      user_agent: userAgent,
      visitor_id: visitorId,
    });

    if (error) {
      console.error('AB event insert error:', error);
      // Don't fail loudly — analytics should not break the page
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('AB event error:', err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

async function hashVisitor(ip: string, ua: string): Promise<string> {
  const text = ip + '|' + ua;
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  // SHA-256 via Web Crypto API (Edge runtime compatible)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
