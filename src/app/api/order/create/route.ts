import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, generateOrderId } from '@/lib/supabase';
import { validatePrice } from '@/lib/price-validator';
import { validateOrderInput } from '@/lib/input-validator';
import { validateCsrfToken } from '@/lib/csrf';

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // max 5 orders per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // CSRF token validation
    const csrfValid = await validateCsrfToken(req);
    if (!csrfValid) {
      return NextResponse.json(
        { error: "Invalid or missing security token. Refresh halaman dan coba lagi." },
        { status: 403 }
      );
    }

    // Rate limit check
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Terlalu banyak request. Coba lagi dalam 1 menit.' }, { status: 429 });
    }

    const body = await req.json();
    const {
      game_slug,
      game_name,
      item_name,
      item_sku,
      price_idr,
      price_crypto,
      crypto_token,
      crypto_chain,
      payment_wallet,
      user_game_id,
      user_server_id,
      phone,
      email,
      nickname,
    } = body;

    // Validate required fields
    if (!game_slug || !game_name || !item_name || !price_idr || !user_game_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!item_sku) {
      return NextResponse.json({ error: 'item_sku is required' }, { status: 400 });
    }

    // Validate email + phone
    const inputCheck = validateOrderInput({ email, phone });
    if (!inputCheck.valid) {
      return NextResponse.json({ error: inputCheck.message || 'Invalid input' }, { status: 400 });
    }

    // Server-side price validation — prevent client price manipulation
    const priceCheck = await validatePrice(item_sku, price_idr);
    if (!priceCheck.valid) {
      console.error(`Price manipulation attempt: SKU=${item_sku}, client_price=${price_idr}, server_price=${priceCheck.serverPrice}`);
      return NextResponse.json({ error: priceCheck.message || 'Invalid price' }, { status: 400 });
    }

    const supabase = getSupabase();
    const order_id = generateOrderId();
    const expires_at = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 min expiry

    // Generate unique crypto amount (add random 0.0001-0.0099 suffix)
    const uniqueSuffix = Math.floor(Math.random() * 99 + 1) / 10000; // 0.0001 to 0.0099
    const unique_price_crypto = price_crypto
      ? Math.round((parseFloat(price_crypto) + uniqueSuffix) * 10000) / 10000
      : null;

    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_id,
        game_slug,
        game_name,
        item_name,
        item_sku,
        price_idr,
        price_crypto: unique_price_crypto,
        crypto_token,
        crypto_chain,
        payment_wallet,
        user_game_id,
        user_server_id,
        phone,
        email,
        nickname: nickname || null,
        status: 'pending',
        expires_at,
        client_ip: ip,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Send Telegram notification
    try {
      const telegramMsg = `🛒 *Order Baru!*\n\n📋 Order: \`${order_id}\`\n🎮 ${game_name}\n💎 ${item_name}\n💰 Rp ${price_idr.toLocaleString('id-ID')}\n👤 ID: ${user_game_id}${user_server_id ? ` (${user_server_id})` : ''}${nickname ? `\n🏷️ Nick: ${nickname}` : ''}\n💳 ${crypto_token} on ${crypto_chain}\n🌐 IP: ${ip}\n⏰ Expires: 30 menit\n\nStatus: ⏳ Menunggu Pembayaran`;

      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: telegramMsg,
          parse_mode: 'Markdown',
        }),
      });
    } catch (e) {
      console.error('Telegram notification failed:', e);
    }

    return NextResponse.json({
      success: true,
      order_id,
      expires_at,
      payment_wallet,
      price_crypto: unique_price_crypto,
      crypto_token,
      crypto_chain,
    });
  } catch (e) {
    console.error('Order creation error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
