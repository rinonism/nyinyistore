import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

const PROXY_URL = 'http://43.153.204.244:3847';
const PROXY_SECRET = 'nys-tripay-proxy-2026-secret';

// Rate limit: max 1 verify per order per 10 seconds
const verifyRateLimit = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    // Rate limit check
    const lastCheck = verifyRateLimit.get(order_id);
    if (lastCheck && Date.now() - lastCheck < 10000) {
      return NextResponse.json({ error: 'Tunggu 10 detik sebelum cek lagi', status: 'pending' }, { status: 429 });
    }
    verifyRateLimit.set(order_id, Date.now());

    // Get order from Supabase
    const supabase = getSupabase();
    const { data: order, error } = await supabase
      .from('orders')
      .select('order_id, status, price_crypto, crypto_token, crypto_chain, payment_wallet, expires_at')
      .eq('order_id', order_id)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'pending') {
      return NextResponse.json({ status: order.status });
    }

    // Check if expired
    if (new Date(order.expires_at) < new Date()) {
      await supabase.from('orders').update({ status: 'expired' }).eq('order_id', order_id);
      return NextResponse.json({ status: 'expired' });
    }

    // Call proxy to check on-chain payment
    try {
      const res = await fetch(`${PROXY_URL}/check-crypto-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Proxy-Secret': PROXY_SECRET,
        },
        body: JSON.stringify({
          order_id: order.order_id,
          amount: order.price_crypto,
          token: order.crypto_token,
          chain: order.crypto_chain,
          wallet: order.payment_wallet,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.paid) {
          // Update order status to paid
          await supabase
            .from('orders')
            .update({ status: 'paid', paid_at: new Date().toISOString() })
            .eq('order_id', order_id);
          return NextResponse.json({ status: 'paid', tx_hash: data.tx_hash });
        }
      }
    } catch (e) {
      console.error('Proxy check-crypto-payment error:', e);
    }

    return NextResponse.json({ status: 'pending' });
  } catch (error) {
    console.error('Verify crypto error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
