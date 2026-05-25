import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { fulfillPaidOrders } from "@/lib/fulfillment";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

export async function POST(request: NextRequest) {
  // Simple auth check via cookie
  const adminToken = request.cookies.get("admin_token");
  if (!adminToken?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { order_id } = body;

    if (!order_id) {
      return NextResponse.json(
        { error: "order_id is required" },
        { status: 400 }
      );
    }

    // Read orders and verify the order exists and is paid
    let orders: Record<string, unknown>[] = [];
    try {
      const data = await fs.readFile(ORDERS_FILE, "utf-8");
      orders = JSON.parse(data);
    } catch {
      return NextResponse.json(
        { error: "Orders file not found" },
        { status: 500 }
      );
    }

    const orderIndex = orders.findIndex((o) => o.id === order_id);
    if (orderIndex === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = orders[orderIndex];
    if (order.status !== "paid") {
      return NextResponse.json(
        { error: `Order status is '${order.status}', must be 'paid' to fulfill` },
        { status: 400 }
      );
    }

    // Trigger fulfillment
    const result = await fulfillPaidOrders();

    const wasFulfilled = result.fulfilled.includes(order_id);
    const hadError = result.errors.find((e) => e.orderId === order_id);

    if (wasFulfilled) {
      return NextResponse.json({
        success: true,
        message: "Order sent for fulfillment",
      });
    } else if (hadError) {
      return NextResponse.json(
        { error: `Fulfillment error: ${hadError.error}` },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: "Order was not fulfilled (may have already been processed)" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Manual fulfill error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Fulfillment failed" },
      { status: 500 }
    );
  }
}
