import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { order_id, status, game_name, item_name, user_game_id, user_server_id, price_idr } = await req.json();

    const statusMessages: Record<string, string> = {
      paid: `✅ *Pembayaran Diterima!*\n\n📋 Order: \`${order_id}\`\n🎮 ${game_name}\n💎 ${item_name}\n👤 ID: ${user_game_id}${user_server_id ? ` (${user_server_id})` : ''}\n\nStatus: Sedang diproses...`,
      completed: `🎉 *Order Selesai!*\n\n📋 Order: \`${order_id}\`\n🎮 ${game_name}\n💎 ${item_name}\n👤 ID: ${user_game_id}${user_server_id ? ` (${user_server_id})` : ''}\n💰 Rp ${price_idr?.toLocaleString('id-ID') || '-'}\n\n✅ Item berhasil dikirim!`,
      failed: `❌ *Order Gagal!*\n\n📋 Order: \`${order_id}\`\n🎮 ${game_name}\n💎 ${item_name}\n👤 ID: ${user_game_id}${user_server_id ? ` (${user_server_id})` : ''}\n\n⚠️ Perlu pengecekan manual`,
      expired: `⏰ *Order Expired*\n\n📋 Order: \`${order_id}\`\n🎮 ${game_name}\n💎 ${item_name}\n\nPembayaran tidak diterima dalam 30 menit.`,
    };

    const message = statusMessages[status];
    if (!message) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Notification error:', e);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
