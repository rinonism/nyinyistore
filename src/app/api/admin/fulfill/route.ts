import { NextRequest, NextResponse } from "next/server";
import { manualFulfillOrder } from "@/lib/auto-fulfill";
import { isAuthenticated } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  // Verify JWT token
  const authed = await isAuthenticated(request);
  if (!authed) {
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

    const result = await manualFulfillOrder(order_id);

    if (result.success) {
      return NextResponse.json({
        success: true,
        status: result.status,
        message: result.message,
        sn: result.sn,
        charged: result.charged,
      });
    }

    return NextResponse.json(
      { error: result.error || "Fulfillment failed" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Manual fulfill error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Fulfillment failed" },
      { status: 500 }
    );
  }
}
