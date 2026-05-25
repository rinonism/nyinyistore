import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import * as crypto from "crypto";
import { fulfillPaidOrders } from "@/lib/fulfillment";
import type { TripayCallback } from "@/lib/tripay";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");
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

    // Read orders
    let orders: Record<string, unknown>[] = [];
    try {
      const data = await fs.readFile(ORDERS_FILE, "utf-8");
      orders = JSON.parse(data);
    } catch {
      return NextResponse.json({ error: "Orders file not found" }, { status: 500 });
    }

    // Find order by tripay reference or merchant_ref
    const orderIndex = orders.findIndex(
      (o) =>
        o.tripay_reference === callback.reference ||
        o.id === callback.merchant_ref
    );

    if (orderIndex === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = orders[orderIndex];

    // Update order based on callback status
    switch (callback.status) {
      case "PAID":
        orders[orderIndex] = {
          ...order,
          status: "paid",
          paid_at: callback.paid_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        break;

      case "EXPIRED":
        orders[orderIndex] = {
          ...order,
          status: "expired",
          updated_at: new Date().toISOString(),
        };
        break;

      case "FAILED":
        orders[orderIndex] = {
          ...order,
          status: "failed",
          tripay_note: callback.note || "",
          updated_at: new Date().toISOString(),
        };
        break;

      case "REFUND":
        orders[orderIndex] = {
          ...order,
          status: "failed",
          tripay_note: "Refunded",
          updated_at: new Date().toISOString(),
        };
        break;

      default:
        // UNPAID or unknown - no action
        break;
    }

    // Save updated orders
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));

    // If paid, trigger auto-fulfillment
    if (callback.status === "PAID") {
      try {
        await fulfillPaidOrders();
      } catch (err) {
        console.error("Auto-fulfillment error:", err);
        // Don't fail the webhook response
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
