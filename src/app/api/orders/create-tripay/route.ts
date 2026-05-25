import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createTransaction as createTripayTransaction } from "@/lib/tripay";
import { getGameBySlug } from "@/lib/games";
import { generateOrderId } from "@/lib/crypto-payment";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { game_slug, denomination_id, user_id, server_id, payment_channel } = body;

    // Validate required fields
    if (!game_slug || !denomination_id || !user_id || !payment_channel) {
      return NextResponse.json(
        { error: "Missing required fields: game_slug, denomination_id, user_id, payment_channel" },
        { status: 400 }
      );
    }

    // Find game and denomination
    const game = getGameBySlug(game_slug);
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const denomination = game.denominations.find((d) => d.amount === denomination_id);
    if (!denomination) {
      return NextResponse.json({ error: "Denomination not found" }, { status: 404 });
    }

    const orderId = generateOrderId();
    const amount = denomination.price;

    // Create Tripay transaction
    const tripayTx = await createTripayTransaction({
      amount,
      method: payment_channel,
      merchantRef: orderId,
      customerName: `Player ${user_id}`,
      orderItems: [
        {
          name: `${game.name} - ${denomination.label}`,
          price: amount,
          quantity: 1,
        },
      ],
      callbackUrl: `${BASE_URL}/api/webhook/tripay`,
      returnUrl: `${BASE_URL}/checkout/status?order_id=${orderId}`,
    });

    // Create order record
    const order = {
      id: orderId,
      game_slug,
      denomination_id,
      denomination_label: denomination.label,
      user_id,
      server_id: server_id || undefined,
      payment_method: "tripay",
      payment_channel,
      amount_idr: amount,
      tripay_reference: tripayTx.reference,
      tripay_checkout_url: tripayTx.checkout_url,
      status: "pending" as const,
      created_at: new Date().toISOString(),
      expires_at: new Date(tripayTx.expired_time * 1000).toISOString(),
    };

    // Read existing orders and append
    let orders = [];
    try {
      const data = await fs.readFile(ORDERS_FILE, "utf-8");
      orders = JSON.parse(data);
    } catch {
      // File doesn't exist or is empty
    }

    orders.push(order);
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));

    return NextResponse.json({
      success: true,
      order_id: orderId,
      checkout_url: tripayTx.checkout_url,
      reference: tripayTx.reference,
      amount,
      expired_time: tripayTx.expired_time,
    });
  } catch (error) {
    console.error("Create Tripay order error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 }
    );
  }
}
