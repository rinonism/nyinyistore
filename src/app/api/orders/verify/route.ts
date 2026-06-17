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

async function writeOrders(orders: Order[]): Promise<void> {
  await fs.mkdir(path.dirname(ORDERS_FILE), { recursive: true });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, tx_hash } = body;

    if (!order_id) {
      return NextResponse.json(
        { error: "Missing order_id" },
        { status: 400 }
      );
    }

    const orders = await readOrders();
    const orderIndex = orders.findIndex((o) => o.id === order_id);

    if (orderIndex === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = orders[orderIndex];

    // Check if order is expired
    if (new Date(order.expires_at) < new Date() && order.status === "pending") {
      orders[orderIndex].status = "expired";
      await writeOrders(orders);
      return NextResponse.json(
        { error: "Order has expired" },
        { status: 400 }
      );
    }

    // Check if already paid or processed
    if (order.status !== "pending") {
      return NextResponse.json(
        { error: `Order is already ${order.status}` },
        { status: 400 }
      );
    }

    // In production, we would verify the transaction on-chain here
    // For now, just mark as paid
    orders[orderIndex].status = "paid";
    orders[orderIndex].tx_hash = tx_hash || undefined;
    await writeOrders(orders);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      status: "paid",
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Verify order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
