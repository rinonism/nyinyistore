import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { type Order } from "@/lib/crypto-payment";
import { type DigiflazzStatus } from "@/lib/digiflazz";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");
const WEBHOOK_LOG_FILE = path.join(process.cwd(), "data", "digiflazz-webhooks.json");

interface DigiflazzCallback {
  data: {
    ref_id: string;
    customer_no: string;
    buyer_sku_code: string;
    message: string;
    status: DigiflazzStatus;
    rc: string;
    sn: string;
    price: number;
  };
}

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

async function logWebhook(payload: unknown): Promise<void> {
  let logs: unknown[] = [];
  try {
    const data = await fs.readFile(WEBHOOK_LOG_FILE, "utf-8");
    logs = JSON.parse(data);
  } catch {
    // File doesn't exist yet
  }

  logs.push({
    received_at: new Date().toISOString(),
    payload,
  });

  await fs.mkdir(path.dirname(WEBHOOK_LOG_FILE), { recursive: true });
  await fs.writeFile(WEBHOOK_LOG_FILE, JSON.stringify(logs, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body: DigiflazzCallback = await request.json();

    // Log the callback
    await logWebhook(body);

    // Verify callback structure
    if (!body.data || !body.data.ref_id || !body.data.status) {
      return NextResponse.json(
        { error: "Invalid callback structure" },
        { status: 400 }
      );
    }

    const { ref_id, status, sn, message } = body.data;

    // Find the order by ref_id (which is the order ID)
    const orders = await readOrders();
    const orderIndex = orders.findIndex((o) => o.id === ref_id);

    if (orderIndex === -1) {
      console.warn(`Webhook received for unknown order: ${ref_id}`);
      return NextResponse.json({ success: true, message: "Order not found, logged" });
    }

    const order = orders[orderIndex];

    // Map Digiflazz status to order status
    let newStatus: string;
    if (status === "Sukses") {
      newStatus = "completed";
    } else if (status === "Gagal") {
      newStatus = "failed";
    } else {
      newStatus = "processing";
    }

    // Update order
    orders[orderIndex] = {
      ...order,
      status: newStatus as Order["status"],
      digiflazz_status: status,
      digiflazz_sn: sn || undefined,
      digiflazz_message: message || undefined,
      updated_at: new Date().toISOString(),
    };

    await writeOrders(orders);

    console.log(
      `[Digiflazz Webhook] Order ${ref_id}: ${status} -> ${newStatus}`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Digiflazz webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
