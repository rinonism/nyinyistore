import { getPriceList, type DigiflazzProduct } from "./digiflazz";
import { readFileSync } from "fs";
import { join } from "path";
import { games } from "./games";

// Cached price map: SKU -> price from Digiflazz
let priceMap: Map<string, number> | null = null;
let stockMap: Map<string, { stock: number; unlimited: boolean }> | null = null;
let priceMapTimestamp = 0;
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

// Sell price map: SKU -> sell price from games.ts (hardcoded catalog)
const sellPriceMap: Map<string, number> = new Map();
for (const game of games) {
  for (const denom of game.denominations) {
    if (denom.sku) {
      sellPriceMap.set(denom.sku, denom.price);
    }
  }
}

// Margin config: client price must match sell price from games.ts catalog
// This prevents price manipulation (submitting cost price instead of sell price)

/**
 * Get the sell price for a given SKU from the catalog.
 * Returns null if SKU not found in catalog.
 */
export function getSellPrice(sku: string): number | null {
  return sellPriceMap.get(sku) ?? null;
}

/**
 * Get the server-side price for a given SKU.
 * Returns null if SKU not found.
 */
export async function getServerPrice(sku: string): Promise<number | null> {
  await refreshPriceMap();
  return priceMap?.get(sku) ?? null;
}

/**
 * Validate that the client-submitted price is not below cost.
 * Returns { valid, serverPrice, message }
 */
export async function validatePrice(
  sku: string,
  clientPrice: number
): Promise<{ valid: boolean; serverPrice: number | null; message?: string }> {
  if (!sku) {
    return { valid: false, serverPrice: null, message: "item_sku is required" };
  }

  await refreshPriceMap();

  // If price list unavailable (Digiflazz down/rate limited), block order creation entirely
  if (!priceMap) {
    console.error(`Price validation BLOCKED: Digiflazz unavailable, cannot validate SKU=${sku}`);
    return { valid: false, serverPrice: null, message: "Layanan sedang gangguan. Coba lagi dalam beberapa menit." };
  }

  const serverPrice = priceMap.get(sku) ?? null;

  if (serverPrice === null) {
    return {
      valid: false,
      serverPrice: null,
      message: `Product SKU "${sku}" not found or unavailable`,
    };
  }

  // Stock check: reject if stock is 0 AND not unlimited
  const stockInfo = stockMap?.get(sku) ?? null;
  if (stockInfo !== null && !stockInfo.unlimited && stockInfo.stock <= 0) {
    return {
      valid: false,
      serverPrice,
      message: "Stok sedang habis untuk item ini. Coba beberapa saat lagi.",
    };
  }

  // Client price must match the sell price from catalog (not cost price)
  const sellPrice = sellPriceMap.get(sku);
  if (sellPrice && clientPrice < sellPrice) {
    return {
      valid: false,
      serverPrice,
      message: `Harga tidak valid. Hubungi admin jika masalah berlanjut.`,
    };
  }

  // Fallback: if SKU not in catalog, at least ensure price >= cost
  if (!sellPrice && clientPrice < serverPrice) {
    return {
      valid: false,
      serverPrice,
      message: `Harga tidak valid.`,
    };
  }

  return { valid: true, serverPrice };
}

async function refreshPriceMap(): Promise<void> {
  const now = Date.now();
  if (priceMap && now - priceMapTimestamp < CACHE_DURATION_MS) {
    return;
  }

  try {
    const products = await getPriceList();
    const newMap = new Map<string, number>();
    const newStockMap = new Map<string, { stock: number; unlimited: boolean }>();
    for (const p of products) {
      if (p.buyer_product_status) {
        newMap.set(p.buyer_sku_code, p.price);
        newStockMap.set(p.buyer_sku_code, { stock: p.stock ?? 0, unlimited: p.unlimited_stock ?? false });
      }
    }
    if (newMap.size > 0) {
      priceMap = newMap;
      stockMap = newStockMap;
      priceMapTimestamp = now;
    }
  } catch (err) {
    console.error("Failed to refresh price map:", err);
  }

  // If Digiflazz unavailable, priceMap stays null but orders still validated
  // against sellPriceMap (from games.ts catalog) — no public endpoint fallback needed
  if (!priceMap) {
    console.warn("Digiflazz price list unavailable — using catalog sell prices only");
  }
}
