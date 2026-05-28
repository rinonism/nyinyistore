import { NextRequest, NextResponse } from "next/server";
import { createTransaction as createTripayTransaction } from "@/lib/tripay";
import { getGameBySlug } from "@/lib/games";
import { getSupabase, generateOrderId } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { game_slug, game_name, item_name, item_sku, price_idr, user_game_id, user_server_id, phone, email, payment_channel } = body;

    // Validate required fields
    if (!game_slug || !item_name || !price_idr || !user_game_id || !payment_channel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const order_id = generateOrderId();
    const amount = Math.round(price_idr);

    // Create Tripay transaction
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://nyinyistore.com";
    const tripayTx = await createTripayTransaction({
      amount,
      method: payment_channel,
      merchantRef: order_id,
      customerName: `Player ${user_game_id}`,
      customerEmail: email || "customer@nyinyistore.com",
      customerPhone: phone || "08000000000",
      orderItems: [
        {
          name: `${game_name || game_slug} - ${item_name}`,
          price: amount,
          quantity: 1,
        },
      ],
      callbackUrl: `${baseUrl}/api/webhook/tripay`,
      returnUrl: `${baseUrl}/order?id=${order_id}`,
    });

    // Save order to Supabase
    const expires_at = new Date(tripayTx.expired_time * 1000).toISOString();

    const { error } = await supabase
      .from("orders")
      .insert({
        order_id,
        game_slug,
        game_name: game_name || game_slug,
        item_name,
        item_sku: item_sku || null,
        price_idr: amount,
        user_game_id,
        user_server_id: user_server_id || null,
        phone: phone || null,
        email: email || null,
        status: "pending",
        payment_method: "tripay",
        payment_channel,
        tripay_reference: tripayTx.reference,
        tripay_checkout_url: tripayTx.checkout_url,
        expires_at,
      });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Send Telegram notification
    try {
      const telegramMsg = `🛒 *Order Baru!*\n\n📋 Order: \`${order_id}\`\n🎮 ${game_name || game_slug}\n💎 ${item_name}\n💰 Rp ${amount.toLocaleString("id-ID")}\n👤 ID: ${user_game_id}${user_server_id ? ` (${user_server_id})` : ""}\n💳 ${payment_channel} (Tripay)\n⏰ Expires: ${expires_at}\n\nStatus: ⏳ Menunggu Pembayaran`;

      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: telegramMsg,
          parse_mode: "Markdown",
        }),
      });
    } catch (e) {
      console.error("Telegram notification failed:", e);
    }

    return NextResponse.json({
      success: true,
      order_id,
      checkout_url: tripayTx.checkout_url,
      reference: tripayTx.reference,
      amount,
      expires_at,
    });
  } catch (error) {
    console.error("Create Tripay order error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 }
    );
  }
}
