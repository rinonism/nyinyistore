import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { Order } from "@/lib/crypto-payment";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

async function readOrders(): Promise<Order[]> {
  try {
    const data = await fs.readFile(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orders = await readOrders();
    const order = orders.find((o) => o.id === params.id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if expired
    if (order.status === "pending" && new Date(order.expires_at) < new Date()) {
      order.status = "expired";
      // Update in file
      const updatedOrders = orders.map((o) =>
        o.id === order.id ? order : o
      );
      await fs.writeFile(ORDERS_FILE, JSON.stringify(updatedOrders, null, 2));
    }

    return NextResponse.json({
      id: order.id,
      game_slug: order.game_slug,
      denomination_label: order.denomination_label,
      user_id: order.user_id,
      server_id: order.server_id,
      payment_chain: order.payment_chain,
      payment_token: order.payment_token,
      payment_address: order.payment_address,
      amount_idr: order.amount_idr,
      amount_crypto: order.amount_crypto,
      token_symbol: order.token_symbol,
      status: order.status,
      tx_hash: order.tx_hash,
      created_at: order.created_at,
      expires_at: order.expires_at,
    });
  } catch (error) {
    console.error("Order status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
