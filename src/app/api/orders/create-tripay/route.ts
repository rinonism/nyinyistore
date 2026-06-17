import { NextRequest, NextResponse } from "next/server";
import { createTransaction as createTripayTransaction } from "@/lib/tripay";
import { getGameBySlug } from "@/lib/games";
import { getSupabase, generateOrderId } from "@/lib/supabase";
import { validatePrice } from "@/lib/price-validator";
import { validateOrderInput } from "@/lib/input-validator";
import { validateCsrfToken } from "@/lib/csrf";

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

export async function POST(request: NextRequest) {
  try {
    // CSRF token validation
    const csrfValid = await validateCsrfToken(request);
    if (!csrfValid) {
      return NextResponse.json(
        { error: "Invalid or missing security token. Refresh halaman dan coba lagi." },
        { status: 403 }
      );
    }

    // Rate limit check
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Terlalu banyak request. Coba lagi dalam 1 menit." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { game_slug, game_name, item_name, item_sku, price_idr, user_game_id, user_server_id, phone, email, payment_channel, nickname } = body;

    // Validate required fields
    if (!game_slug || !item_name || !price_idr || !user_game_id || !payment_channel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!item_sku) {
      return NextResponse.json(
        { error: "item_sku is required" },
        { status: 400 }
      );
    }

    // Validate email + phone
    const inputCheck = validateOrderInput({ email, phone });
    if (!inputCheck.valid) {
      return NextResponse.json(
        { error: inputCheck.message },
        { status: 400 }
      );
    }

    // Server-side price determination — IGNORE client price, use catalog
    const priceCheck = await validatePrice(item_sku, 0); // pass 0 to just get server price + stock check
    if (!priceCheck.valid && priceCheck.message?.includes("Stok")) {
      return NextResponse.json(
        { error: priceCheck.message },
        { status: 400 }
      );
    }

    // Get authoritative sell price from catalog
    const { getSellPrice } = await import("@/lib/price-validator");
    const serverSellPrice = getSellPrice(item_sku);
    if (!serverSellPrice) {
      console.error(`SKU not in catalog: ${item_sku}`);
      return NextResponse.json(
        { error: "Item tidak tersedia." },
        { status: 400 }
      );
    }

    // Use server-determined price, not client price
    const amount = serverSellPrice;

    const supabase = getSupabase();
    const order_id = generateOrderId();

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
        nickname: nickname || null,
        status: "pending",
        payment_method: "tripay",
        payment_channel,
        tripay_reference: tripayTx.reference,
        tripay_checkout_url: tripayTx.checkout_url,
        expires_at,
        client_ip: ip,
      });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Send Telegram notification
    try {
      const telegramMsg = `🛒 *Order Baru!*\n\n📋 Order: \`${order_id}\`\n🎮 ${game_name || game_slug}\n💎 ${item_name}\n👤 ID: ${user_game_id}${user_server_id ? ` (${user_server_id})` : ""}${nickname ? `\n🏷️ Nickname: ${nickname}` : ""}\n📦 SKU: ${item_sku}\n💰 Harga: Rp ${amount.toLocaleString("id-ID")}\n📧 Email: ${email || "-"}\n📱 HP: ${phone || "-"}\n💳 Pembayaran: ${payment_channel} (tripay)\n🔗 Ref: ${tripayTx.reference}\n🌐 IP: ${ip}\n⏰ Expires: ${expires_at}\n\nStatus: ⏳ Menunggu Pembayaran`;

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
