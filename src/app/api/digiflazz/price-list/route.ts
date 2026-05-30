import { NextRequest, NextResponse } from "next/server";

const PROXY_URL = process.env.DIGIFLAZZ_PROXY_URL || "http://43.153.204.244:7890";
const PROXY_SECRET = process.env.DIGIFLAZZ_PROXY_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cmd } = body;

    const res = await fetch(`${PROXY_URL}/price-list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Proxy-Secret": PROXY_SECRET,
      },
      body: JSON.stringify({ cmd: cmd || "prepaid" }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch price list" },
      { status: 500 }
    );
  }
}
