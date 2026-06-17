import { NextRequest, NextResponse } from "next/server";

const PROXY_URL = process.env.TRIPAY_PROXY_URL || "http://43.153.204.244:3847/proxy";
const PROXY_SECRET = process.env.TRIPAY_PROXY_SECRET || "";

function getProxyBase(): string {
  try {
    const url = new URL(PROXY_URL);
    return `${url.protocol}//${url.host}`;
  } catch {
    return "http://43.153.204.244:3847";
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cmd } = body;

    const res = await fetch(`${getProxyBase()}/price-list`, {
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
