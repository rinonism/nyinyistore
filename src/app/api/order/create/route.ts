import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, generateOrderId } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
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
    } = body;

    // Validate required fields
    if (!game_slug || !game_name || !item_name || !price_idr || !user_game_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getSupabase();
    const order_id = generateOrderId();
    const expires_at = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 min expiry

    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_id,
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
        status: 'pending',
        expires_at,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Send Telegram notification
    try {
      const telegramMsg = `🛒 *Order Baru!*\n\n📋 Order: \`${order_id}\`\n🎮 ${game_name}\n💎 ${item_name}\n💰 Rp ${price_idr.toLocaleString('id-ID')}\n👤 ID: ${user_game_id}${user_server_id ? ` (${user_server_id})` : ''}\n💳 ${crypto_token} on ${crypto_chain}\n⏰ Expires: 30 menit\n\nStatus: ⏳ Menunggu Pembayaran`;

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
      price_crypto,
      crypto_token,
      crypto_chain,
    });
  } catch (e) {
    console.error('Order creation error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
