import { NextRequest, NextResponse } from "next/server";

const PROXY_URL = process.env.DIGIFLAZZ_PROXY_URL || "http://43.153.204.244:7890";
const PROXY_SECRET = process.env.DIGIFLAZZ_PROXY_SECRET || "nyinyi-digi-proxy-2026";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { buyer_sku_code, customer_no, ref_id, testing } = body;

    if (!buyer_sku_code || !customer_no || !ref_id) {
      return NextResponse.json(
        { error: "Missing required fields: buyer_sku_code, customer_no, ref_id" },
        { status: 400 }
      );
    }

    const res = await fetch(`${PROXY_URL}/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Proxy-Secret": PROXY_SECRET,
      },
      body: JSON.stringify({
        buyer_sku_code,
        customer_no,
        ref_id,
        testing: testing || false,
      }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process transaction" },
      { status: 500 }
    );
  }
}
