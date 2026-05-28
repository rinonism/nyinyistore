import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get('id');

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('orders')
    .select('order_id, game_name, item_name, price_idr, price_crypto, crypto_token, crypto_chain, payment_wallet, status, created_at, paid_at, completed_at, expires_at')
    .eq('order_id', orderId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, order: data });
}
