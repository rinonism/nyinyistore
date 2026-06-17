import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Apigames credentials
const APIGAMES_MERCHANT_ID = "M260529GUUD7870JQ";
const APIGAMES_SECRET_KEY =
  "09d065946c24c7f03dd4fea9929d58244be9c9806d03344d2dbd38cf0cc64b93";
const APIGAMES_SIGNATURE = crypto
  .createHash("md5")
  .update(APIGAMES_MERCHANT_ID + APIGAMES_SECRET_KEY)
  .digest("hex");

// Digiflazz proxy (fallback 2)
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

// Game code mapping for isan API
function getIsanUrl(gameCode: string, customerNo: string): string | null {
  if (gameCode === "mobile-legends" || gameCode === "ml") {
    const [userId, zoneId] = customerNo.split("|");
    return `https://api.isan.eu.org/nickname/ml?id=${userId}&zone=${zoneId}`;
  }
  if (gameCode === "free-fire" || gameCode === "ff") {
    return `https://api.isan.eu.org/nickname/ff?id=${customerNo}`;
  }
  if (gameCode === "honkai-star-rail" || gameCode === "hsr") {
    return `https://api.isan.eu.org/nickname/hsr?id=${customerNo}`;
  }
  if (gameCode === "genshin-impact" || gameCode === "genshin") {
    return `https://api.isan.eu.org/nickname/genshin?id=${customerNo}`;
  }
  if (gameCode === "valorant") {
    return `https://api.isan.eu.org/nickname/valorant?id=${customerNo}`;
  }
  return null;
}

// Game code mapping for Apigames
function getApigamesGame(gameCode: string): string | null {
  const map: Record<string, string> = {
    "mobile-legends": "mobilelegend",
    ml: "mobilelegend",
    "free-fire": "freefire",
    ff: "freefire",
    "genshin-impact": "genshin",
    genshin: "genshin",
    valorant: "valorant",
  };
  return map[gameCode] || null;
}

// Primary: api.isan.eu.org (free)
async function checkIsan(
  gameCode: string,
  customerNo: string
): Promise<{ success: boolean; name?: string } | null> {
  const url = getIsanUrl(gameCode, customerNo);
  if (!url) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "NyinyiStore/1.0" },
      signal: controller.signal,
    });
    const data = await res.json();
    clearTimeout(timeout);

    if (data.success === true || data.name) {
      return { success: true, name: data.name || data.username || data.nickname };
    }
    return null;
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

// Fallback 1: Apigames (Rp10/request)
async function checkApigames(
  gameCode: string,
  customerNo: string
): Promise<{ success: boolean; name?: string } | null> {
  const apigamesGame = getApigamesGame(gameCode);
  if (!apigamesGame) return null;

  // Format user_id for Apigames
  let userId = customerNo;
  if (gameCode === "mobile-legends" || gameCode === "ml") {
    userId = customerNo.replace("|", "");
  }

  const url = `https://v1.apigames.id/merchant/${APIGAMES_MERCHANT_ID}/cek-username/${apigamesGame}?user_id=${userId}&signature=${APIGAMES_SIGNATURE}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    const data = await res.json();
    clearTimeout(timeout);

    if (data.status === 1 && data.data?.is_valid) {
      return { success: true, name: data.data.username };
    }
    if (data.status === 0 || data.data?.is_valid === false) {
      return { success: false };
    }
    return null;
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

// Fallback 2: Digiflazz via proxy (inq-game)
async function checkDigiflazz(
  gameCode: string,
  customerNo: string
): Promise<{ success: boolean; name?: string } | null> {
  if (!PROXY_SECRET) return null;

  try {
    const res = await fetch(`${getProxyBase()}/check-nickname`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Proxy-Secret": PROXY_SECRET,
      },
      body: JSON.stringify({ game_code: gameCode, customer_no: customerNo }),
    });

    if (!res.ok) return null;
    const data = await res.json();

    if (data.data?.customer_name) {
      return { success: true, name: data.data.customer_name };
    }
    return null;
  } catch {
    return null;
  }
}

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

    // 1. Primary: isan.eu.org (free)
    const isanResult = await checkIsan(game_code, customer_no);
    if (isanResult) {
      return NextResponse.json(isanResult);
    }

    // 2. Fallback: Apigames (Rp10/req)
    const apigamesResult = await checkApigames(game_code, customer_no);
    if (apigamesResult) {
      return NextResponse.json(apigamesResult);
    }

    // 3. Fallback: Digiflazz proxy
    const digiResult = await checkDigiflazz(game_code, customer_no);
    if (digiResult) {
      return NextResponse.json(digiResult);
    }

    // All failed
    return NextResponse.json(
      { success: false, error: "Unable to verify nickname. Please try again." },
      { status: 503 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to check nickname" },
      { status: 500 }
    );
  }
}
