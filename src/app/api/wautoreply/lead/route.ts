import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// Rate limit: max 3 leads per IP per hour, max 2 per email per day
const RATE_LIMIT_IP_PER_HOUR = 3;
const RATE_LIMIT_EMAIL_PER_DAY = 2;

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}

function isValidPhone(phone: string): boolean {
  // Indonesian format: 08xxx, +62xxx, 62xxx, length 9-15
  return /^(\+?62|0)[0-9]{9,13}$/.test(phone.replace(/[\s-]/g, ''));
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

function sanitize(text: string, max: number): string {
  return String(text || '')
    .trim()
    .replace(/[<>]/g, '') // strip basic HTML
    .slice(0, max);
}

export async function POST(req: NextRequest) {
  try {
    // Parse body — limit size to prevent abuse
    const contentLength = parseInt(req.headers.get('content-length') || '0');
    if (contentLength > 10000) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Honeypot — if filled, it's a bot
    if (body.website && typeof body.website === 'string' && body.website.length > 0) {
      // Silently accept to avoid tipping off bot
      return NextResponse.json({ ok: true, id: 'spam-dropped' }, { status: 200 });
    }

    // Required fields validation
    const name = sanitize(String(body.name || ''), 100);
    const business = sanitize(String(body.business || ''), 100);
    const email = String(body.email || '').trim().toLowerCase().slice(0, 254);
    const whatsapp = String(body.whatsapp || '').replace(/[\s-]/g, '').slice(0, 20);
    const industry = sanitize(String(body.industry || ''), 50);
    const volume = sanitize(String(body.volume || ''), 30);
    const notes = sanitize(String(body.notes || ''), 500);

    if (name.length < 2) {
      return NextResponse.json({ error: 'Nama minimal 2 karakter' }, { status: 400 });
    }
    if (business.length < 2) {
      return NextResponse.json({ error: 'Nama bisnis minimal 2 karakter' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email tidak valid' }, { status: 400 });
    }
    if (!isValidPhone(whatsapp)) {
      return NextResponse.json({ error: 'Nomor WhatsApp tidak valid (format: 08xxx atau +62xxx)' }, { status: 400 });
    }

    const ip = getClientIp(req);
    const userAgent = (req.headers.get('user-agent') || '').slice(0, 500);

    const supabase = getSupabase();

    // Rate limit: IP-based (last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: ipCount, error: ipErr } = await supabase
      .from('wa_leads')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('created_at', oneHourAgo);

    if (!ipErr && ipCount !== null && ipCount >= RATE_LIMIT_IP_PER_HOUR) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan. Coba lagi nanti.' },
        { status: 429, headers: { 'Retry-After': '3600' } }
      );
    }

    // Rate limit: Email-based (last 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: emailCount, error: emailErr } = await supabase
      .from('wa_leads')
      .select('*', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', oneDayAgo);

    if (!emailErr && emailCount !== null && emailCount >= RATE_LIMIT_EMAIL_PER_DAY) {
      return NextResponse.json(
        { error: 'Email ini sudah pernah didaftarkan. Hubungi kami via WhatsApp untuk bantuan.' },
        { status: 429 }
      );
    }

    // Insert lead
    const { data, error } = await supabase
      .from('wa_leads')
      .insert({
        name,
        business,
        email,
        whatsapp,
        industry: industry || null,
        volume: volume || null,
        notes: notes || null,
        ip_address: ip,
        user_agent: userAgent,
        status: 'new',
        source: 'landing-page',
      })
      .select('id, created_at')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Gagal menyimpan. Coba lagi.' }, { status: 500 });
    }

    // Trigger Telegram notification (fire and forget — don't block response)
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    if (telegramToken && telegramChatId) {
      const msg = `🎯 *Lead Baru WA AutoReply*\n\n👤 ${name}\n🏪 ${business}\n📧 ${email}\n📱 ${whatsapp}\n📂 ${industry || '-'}\n📊 ${volume || '-'}\n${notes ? `📝 ${notes}\n` : ''}🌐 IP: ${ip}`;
      fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: msg,
          parse_mode: 'Markdown',
        }),
      }).catch(() => {}); // Silent fail — don't block user
    }

    return NextResponse.json(
      { ok: true, id: data.id, created_at: data.created_at },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (err) {
    console.error('Lead form error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Reject other methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
