import CryptoJS from "crypto-js";

// Types
export interface DigiflazzProduct {
  product_name: string;
  category: string;
  brand: string;
  type: string;
  seller_name: string;
  price: number;
  buyer_sku_code: string;
  buyer_product_status: boolean;
  seller_product_status: boolean;
  unlimited_stock: boolean;
  stock: number;
  multi: boolean;
  start_cut_off: string;
  end_cut_off: string;
  desc: string;
}

export type DigiflazzStatus = "Pending" | "Sukses" | "Gagal";

export interface DigiflazzTransaction {
  ref_id: string;
  customer_no: string;
  buyer_sku_code: string;
  message: string;
  status: DigiflazzStatus;
  rc: string;
  sn: string;
  buyer_last_saldo: number;
  price: number;
}

// Config
const DIGIFLAZZ_BASE_URL = "https://api.digiflazz.com/v1";

function getUsername(): string {
  const username = process.env.DIGIFLAZZ_USERNAME;
  if (!username) throw new Error("DIGIFLAZZ_USERNAME is not set");
  return username;
}

function getApiKey(): string {
  const apiKey = process.env.DIGIFLAZZ_API_KEY;
  if (!apiKey) throw new Error("DIGIFLAZZ_API_KEY is not set");
  return apiKey;
}

/**
 * Generate MD5 signature for Digiflazz API
 * sign = md5(username + apikey + refId)
 */
export function generateSign(refId: string): string {
  const username = getUsername();
  const apiKey = getApiKey();
  return CryptoJS.MD5(username + apiKey + refId).toString();
}

// Game-related brand prefixes to filter from price list
const GAME_BRANDS = [
  "MOBILE LEGENDS",
  "FREE FIRE",
  "GENSHIN IMPACT",
  "VALORANT",
  "PUBG MOBILE",
  "HONKAI STAR RAIL",
  "STUMBLE GUYS",
];

// Proxy config (Digiflazz whitelists proxy IP only)
const PROXY_BASE = process.env.TRIPAY_PROXY_URL
  ? (() => { try { const u = new URL(process.env.TRIPAY_PROXY_URL); return `${u.protocol}//${u.host}`; } catch { return "http://43.153.204.244:3847"; } })()
  : "http://43.153.204.244:3847";
const PROXY_SECRET = process.env.TRIPAY_PROXY_SECRET || "";

/**
 * Fetch prepaid price list from Digiflazz via proxy (IP whitelisted)
 */
export async function getPriceList(): Promise<DigiflazzProduct[]> {
  const response = await fetch(`${PROXY_BASE}/price-list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Proxy-Secret": PROXY_SECRET,
    },
    body: JSON.stringify({ cmd: "prepaid" }),
  });

  if (!response.ok) {
    throw new Error(`Digiflazz price list error: ${response.status}`);
  }

  const result = await response.json();
  const products: DigiflazzProduct[] = result.data || [];

  // Handle error response from Digiflazz (rate limit, auth failure, etc.)
  if (!Array.isArray(products)) {
    const msg = (result.data as Record<string, unknown>)?.message || "Unknown error";
    throw new Error(`Digiflazz price list error: ${msg}`);
  }

  // Filter game-related products
  return products.filter((product) =>
    GAME_BRANDS.some((brand) =>
      product.brand.toUpperCase().includes(brand)
    )
  );
}

/**
 * Create a transaction (place order) on Digiflazz via proxy
 */
export async function createTransaction(
  buyerSkuCode: string,
  customerNo: string,
  refId: string
): Promise<DigiflazzTransaction> {
  const response = await fetch(`${PROXY_BASE}/transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Proxy-Secret": PROXY_SECRET,
    },
    body: JSON.stringify({
      buyer_sku_code: buyerSkuCode,
      customer_no: customerNo,
      ref_id: refId,
    }),
  });

  // Parse response body even on non-2xx for better error messages
  let result: Record<string, unknown>;
  try {
    result = await response.json();
  } catch {
    throw new Error(`Digiflazz transaction error: HTTP ${response.status} (no body)`);
  }

  if (!response.ok) {
    const msg = (result.data as Record<string, unknown>)?.message || (result as Record<string, unknown>).error || `HTTP ${response.status}`;
    throw new Error(`Digiflazz transaction error: ${msg} (HTTP ${response.status})`);
  }

  if (result.data && (result.data as Record<string, unknown>).rc && (result.data as Record<string, unknown>).rc !== "00" && (result.data as Record<string, unknown>).rc !== "03") {
    throw new Error(
      `Digiflazz transaction failed: ${(result.data as Record<string, unknown>).message} (rc: ${(result.data as Record<string, unknown>).rc})`
    );
  }

  return result.data as DigiflazzTransaction;
}

/**
 * Check transaction status by ref_id via proxy
 */
export async function checkTransaction(
  refId: string
): Promise<DigiflazzTransaction> {
  const response = await fetch(`${PROXY_BASE}/check-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Proxy-Secret": PROXY_SECRET,
    },
    body: JSON.stringify({
      buyer_sku_code: "",
      customer_no: "",
      ref_id: refId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Digiflazz status check error: ${response.status}`);
  }

  const result = await response.json();
  return result.data as DigiflazzTransaction;
}
