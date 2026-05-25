import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

export async function GET(request: NextRequest) {
  // Simple auth check via cookie
  const adminToken = request.cookies.get("admin_token");
  if (!adminToken?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let orders = [];
    try {
      const data = await fs.readFile(ORDERS_FILE, "utf-8");
      orders = JSON.parse(data);
    } catch {
      // File doesn't exist yet
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Failed to read orders:", error);
    return NextResponse.json(
      { error: "Failed to read orders" },
      { status: 500 }
    );
  }
}
