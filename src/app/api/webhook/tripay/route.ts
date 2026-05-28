import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { getSupabase } from "@/lib/supabase";

const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY || "";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

function verifySignature(payload: string, signature: string): boolean {
  const hash = createHmac("sha256", TRIPAY_PRIVATE_KEY)
    .update(payload)
    .digest("hex");
  return hash === signature;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-callback-signature") || "";

    // Verify signature
    if (!verifySignature(rawBody, signature)) {
      console.error("Webhook: Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const body = JSON.parse(rawBody);
    const { merchant_ref, status, reference, total_amount } = body;

    if (!merchant_ref || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabase = getSupabase();

    // Map Tripay status to our status
    let orderStatus = "pending";
    if (status === "PAID") {
      orderStatus = "paid";
    } else if (status === "EXPIRED") {
      orderStatus = "expired";
    } else if (status === "FAILED") {
      orderStatus = "failed";
    } else if (status === "REFUND") {
      orderStatus = "refunded";
    }

    // Update order status
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", merchant_ref)
      .single();

    if (fetchError || !order) {
      console.error("Webhook: Order not found:", merchant_ref);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only update if status actually changed
    if (order.status === orderStatus) {
      return NextResponse.json({ success: true, message: "No change" });
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: orderStatus,
        paid_at: status === "PAID" ? new Date().toISOString() : null,
      })
      .eq("order_id", merchant_ref);

    if (updateError) {
      console.error("Webhook: Update failed:", updateError);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    // Send Telegram notification for payment
    if (status === "PAID") {
      try {
        const msg = `✅ *Pembayaran Diterima!*\n\n📋 Order: \`${merchant_ref}\`\n🎮 ${order.game_name}\n💎 ${order.item_name}\n💰 Rp ${(total_amount || order.price_idr).toLocaleString("id-ID")}\n👤 ID: ${order.user_game_id}${order.user_server_id ? ` (${order.user_server_id})` : ""}\n💳 ${order.payment_channel}\n🔗 Ref: ${reference}\n\nStatus: ✅ PAID — Siap diproses`;

        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: msg,
            parse_mode: "Markdown",
          }),
        });
      } catch (e) {
        console.error("Telegram notification failed:", e);
      }
    }

    if (status === "EXPIRED") {
      try {
        const msg = `⏰ *Order Expired*\n\n📋 Order: \`${merchant_ref}\`\n🎮 ${order.game_name}\n💎 ${order.item_name}\n\nCustomer tidak bayar dalam waktu yang ditentukan.`;

        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: msg,
            parse_mode: "Markdown",
          }),
        });
      } catch (e) {
        console.error("Telegram notification failed:", e);
      }
    }

    return NextResponse.json({ success: true, status: orderStatus });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
