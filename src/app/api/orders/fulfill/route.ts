import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createTransaction } from "@/lib/digiflazz";
import { formatCustomerNo, getBuyerSkuCode } from "@/lib/fulfillment";
import { type Order } from "@/lib/crypto-payment";

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
    const { order_id } = body;

    if (!order_id) {
      return NextResponse.json(
        { error: "Missing order_id" },
        { status: 400 }
      );
    }

    const orders = await readOrders();
    const orderIndex = orders.findIndex((o) => o.id === order_id);

    if (orderIndex === -1) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const order = orders[orderIndex];

    if (order.status !== "paid") {
      return NextResponse.json(
        { error: `Order is not paid. Current status: ${order.status}` },
        { status: 400 }
      );
    }

    // Get buyer_sku_code from game slug + denomination
    const buyerSkuCode = getBuyerSkuCode(order.game_slug, order.denomination_id);
    if (!buyerSkuCode) {
      return NextResponse.json(
        { error: "Could not map order to Digiflazz product code" },
        { status: 400 }
      );
    }

    // Format customer_no based on game
    const customerNo = formatCustomerNo(
      order.game_slug,
      order.user_id,
      order.server_id
    );

    // Use order ID as ref_id for Digiflazz
    const refId = order.id;

    // Place transaction with Digiflazz
    const transaction = await createTransaction(buyerSkuCode, customerNo, refId);

    // Update order status
    orders[orderIndex] = {
      ...order,
      status: "processing",
      digiflazz_ref_id: refId,
      digiflazz_status: transaction.status,
      updated_at: new Date().toISOString(),
    };

    await writeOrders(orders);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      status: "processing",
      transaction: {
        ref_id: transaction.ref_id,
        status: transaction.status,
        message: transaction.message,
        sn: transaction.sn,
      },
    });
  } catch (error) {
    console.error("Fulfill order error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
