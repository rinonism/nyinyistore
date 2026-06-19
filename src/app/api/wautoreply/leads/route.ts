import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// Auth check via Basic Auth header (matches middleware config)
// Allows the same ADMIN_PASSWORD env to access leads
function checkAuth(req: NextRequest): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 8) return false;
  const authHeader = req.headers.get('authorization') || '';
  if (!authHeader.startsWith('Basic ')) return false;
  const encoded = authHeader.slice(6).trim();
  let decoded = '';
  try {
    decoded = atob(encoded);
  } catch {
    return false;
  }
  const idx = decoded.indexOf(':');
  if (idx < 0) return false;
  const pw = decoded.slice(idx + 1);
  if (pw.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < pw.length; i++) {
    diff |= pw.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="WA AutoReply Admin", charset="UTF-8"',
        'Cache-Control': 'no-store',
      },
    });
  }

  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = (searchParams.get('q') || '').toLowerCase().trim();
    const limit = Math.min(parseInt(searchParams.get('limit') || '500'), 1000);

    let query = supabase
      .from('wa_leads')
      .select('id, name, business, email, whatsapp, industry, volume, notes, status, source, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }

    let leads = data || [];

    // Client-side search filter (Supabase text search needs tsvector column)
    if (search) {
      leads = leads.filter(l =>
        (l.name || '').toLowerCase().includes(search) ||
        (l.business || '').toLowerCase().includes(search) ||
        (l.email || '').toLowerCase().includes(search) ||
        (l.whatsapp || '').toLowerCase().includes(search)
      );
    }

    return NextResponse.json(
      { ok: true, count: leads.length, leads },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    console.error('Leads fetch error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return new NextResponse('Authentication required', { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status, notes } = body || {};

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Missing lead id' }, { status: 400 });
    }

    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (status && ['new', 'contacted', 'trial', 'paid', 'lost'].includes(status)) {
      update.status = status;
    }
    if (typeof notes === 'string') {
      update.notes = notes.slice(0, 500);
    }

    if (Object.keys(update).length === 1) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('wa_leads')
      .update(update)
      .eq('id', id)
      .select('id, status, notes, updated_at')
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, lead: data });
  } catch (err) {
    console.error('Lead update error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return new NextResponse('Authentication required', { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const confirm = searchParams.get('confirm');

    if (id) {
      // Delete single lead
      const supabase = getSupabase();
      const { error } = await supabase.from('wa_leads').delete().eq('id', id);
      if (error) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
      }
      return NextResponse.json({ ok: true, deleted: id });
    }

    // Bulk delete requires confirm
    if (confirm !== 'yes-delete-all') {
      return NextResponse.json(
        { error: 'Bulk delete requires confirm=yes-delete-all' },
        { status: 400 }
      );
    }
    const supabase = getSupabase();
    const { error } = await supabase.from('wa_leads').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) {
      return NextResponse.json({ error: 'Bulk delete failed' }, { status: 500 });
    }
    return NextResponse.json({ ok: true, bulk: true });
  } catch (err) {
    console.error('Lead delete error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
