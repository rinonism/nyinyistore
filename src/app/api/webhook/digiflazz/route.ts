import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { getSupabase } from "@/lib/supabase";

const DIGIFLAZZ_WEBHOOK_SECRET = process.env.DIGIFLAZZ_WEBHOOK_SECRET || "";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

interface DigiflazzCallback {
  data: {
    ref_id: string;
    customer_no: string;
    buyer_sku_code: string;
    message: string;
    status: "Sukses" | "Pending" | "Gagal";
    rc: string;
    sn: string;
    price: number;
  };
}

async function notifyTelegram(text: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "Markdown",
      }),
    });
  } catch {}
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    // Verify signature — MANDATORY
    if (!DIGIFLAZZ_WEBHOOK_SECRET) {
      console.error("[Digiflazz Webhook] DIGIFLAZZ_WEBHOOK_SECRET not configured — rejecting all requests");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    const signature = request.headers.get("x-hub-signature") || "";
    const expected = "sha1=" + createHmac("sha1", DIGIFLAZZ_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");
    if (signature !== expected) {
      console.error("[Digiflazz Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const body: DigiflazzCallback = JSON.parse(rawBody);

    // Verify callback structure
    if (!body.data || !body.data.ref_id || !body.data.status) {
      return NextResponse.json(
        { error: "Invalid callback structure" },
        { status: 400 }
      );
    }

    const { ref_id, status, sn, message, customer_no, buyer_sku_code, price } = body.data;

    // ref_id could be "NY-XXXXX" or "NY-XXXXX-R1" (retry)
    // Extract base order_id
    const orderId = ref_id.replace(/-R\d+$/, "");

    const supabase = getSupabase();

    // Fetch order
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (fetchError || !order) {
      console.warn(`[Digiflazz Webhook] Order not found: ${orderId} (ref: ${ref_id})`);
      // Still return 200 so Digiflazz doesn't retry
      return NextResponse.json({ success: true, message: "Order not found, logged" });
    }

    // Don't update if already completed
    if (order.status === "completed" && status !== "Gagal") {
      return NextResponse.json({ success: true, message: "Already completed" });
    }

    // Map status
    let orderStatus: string;
    if (status === "Sukses") {
      orderStatus = "completed";
    } else if (status === "Gagal") {
      orderStatus = "failed";
    } else {
      orderStatus = "processing";
    }

    // Update order in Supabase
    const updateData: Record<string, unknown> = {
      status: orderStatus,
      digiflazz_ref: ref_id,
      updated_at: new Date().toISOString(),
    };

    if (status === "Sukses") {
      updateData.completed_at = new Date().toISOString();
    }

    await supabase
      .from("orders")
      .update(updateData)
      .eq("order_id", orderId);

    // Send Telegram notification based on status
    if (status === "Sukses") {
      await notifyTelegram(
        `✅ *Order Completed!*\n\n` +
        `📋 Order: \`${orderId}\`\n` +
        `🎮 ${order.game_name}\n` +
        `💎 ${order.item_name}\n` +
        `👤 ID: ${customer_no}\n` +
        `🏷️ Nickname: ${order.nickname || "-"}\n` +
        `📦 SKU: ${buyer_sku_code}\n` +
        `💰 Harga: Rp ${(order.price_idr || price || 0).toLocaleString("id-ID")}\n` +
        `📧 Email: ${order.email || "-"}\n` +
        `📱 HP: ${order.phone || "-"}\n` +
        `💳 Pembayaran: ${order.payment_channel} (tripay)\n` +
        `🔗 Ref: ${order.tripay_reference || "-"}\n` +
        `${sn ? `🔑 SN: ${sn}\n` : ""}` +
        `💬 ${message}\n\n` +
        `✅ SELESAI — Item sudah dikirim!`
      );
    } else if (status === "Gagal") {
      await notifyTelegram(
        `❌ *Order Gagal!*\n\n` +
        `📋 Order: \`${orderId}\`\n` +
        `🎮 ${order.game_name}\n` +
        `💎 ${order.item_name}\n` +
        `👤 ID: ${customer_no}\n` +
        `📦 SKU: ${buyer_sku_code}\n` +
        `💬 ${message}\n` +
        `📍 RC: ${body.data.rc}\n\n` +
        `⚠️ Perlu tindakan manual atau retry.`
      );
    }

    console.log(`[Digiflazz Webhook] Order ${orderId}: ${status} (ref: ${ref_id})`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Digiflazz webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
