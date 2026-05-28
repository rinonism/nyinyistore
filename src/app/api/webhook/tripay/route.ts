import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";
import { getSupabase } from "@/lib/supabase";
import type { TripayCallback } from "@/lib/tripay";

const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY || "";

/**
 * Tripay Webhook/Callback Handler
 * Tripay sends POST with JSON body when payment status changes
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    // Verify signature
    const callbackSignature = request.headers.get("x-callback-signature");
    if (!callbackSignature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", TRIPAY_PRIVATE_KEY)
      .update(rawBody)
      .digest("hex");

    if (callbackSignature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const callback: TripayCallback = JSON.parse(rawBody);
    const supabase = getSupabase();

    // Find order by tripay reference or merchant_ref (order_id)
    const { data: order, error: findError } = await supabase
      .from("orders")
      .select("*")
      .or(`tripay_reference.eq.${callback.reference},order_id.eq.${callback.merchant_ref}`)
      .single();

    if (findError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order based on callback status
    let newStatus = order.status;
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    switch (callback.status) {
      case "PAID":
        newStatus = "paid";
        updateData.status = "paid";
        updateData.paid_at = callback.paid_at || new Date().toISOString();
        break;
      case "EXPIRED":
        newStatus = "expired";
        updateData.status = "expired";
        break;
      case "FAILED":
        newStatus = "failed";
        updateData.status = "failed";
        break;
      case "REFUND":
        newStatus = "failed";
        updateData.status = "failed";
        break;
      default:
        // UNPAID or unknown - no action
        break;
    }

    // Update in Supabase
    if (updateData.status) {
      await supabase
        .from("orders")
        .update(updateData)
        .eq("order_id", order.order_id);
    }

    // If paid, send Telegram notification
    if (callback.status === "PAID") {
      try {
        const msg = `✅ *Pembayaran Diterima!*\n\n📋 Order: \`${order.order_id}\`\n🎮 ${order.game_name}\n💎 ${order.item_name}\n💰 Rp ${order.price_idr?.toLocaleString("id-ID")}\n💳 ${order.payment_channel} (Tripay)\n\nStatus: ✅ Paid → Siap fulfill`;

        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: msg,
            parse_mode: "Markdown",
          }),
        });
      } catch (e) {
        console.error("Telegram notification failed:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tripay webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
