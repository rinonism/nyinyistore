import { NextRequest, NextResponse } from "next/server";

const PROXY_URL = process.env.DIGIFLAZZ_PROXY_URL || "http://43.153.204.244:3847";
const PROXY_SECRET = process.env.TRIPAY_PROXY_SECRET || "nys-tripay-proxy-2026-secret";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { game_code, customer_no } = body;

    if (!game_code || !customer_no) {
      return NextResponse.json(
        { error: "Missing game_code or customer_no" },
        { status: 400 }
      );
    }

    const res = await fetch(`${PROXY_URL}/check-nickname`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Proxy-Secret": PROXY_SECRET,
      },
      body: JSON.stringify({ game_code, customer_no }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check nickname" },
      { status: 500 }
    );
  }
}
