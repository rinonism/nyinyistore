import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const USERNAME = process.env.DIGIFLAZZ_USERNAME || "rukizuD8RKag";
const DEV_KEY = process.env.DIGIFLAZZ_DEV_KEY || "dev-69240ad0-589e-11f1-b96e-298257930237";
const DIGIFLAZZ_URL = "https://api.digiflazz.com/v1/transaction";

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

    const refId = `nick-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
    const sign = crypto
      .createHash("md5")
      .update(USERNAME + DEV_KEY + refId)
      .digest("hex");

    const payload = {
      username: USERNAME,
      buyer_sku_code: game_code,
      customer_no: customer_no,
      ref_id: refId,
      sign: sign,
      commands: "inq-game",
    };

    const res = await fetch(DIGIFLAZZ_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
