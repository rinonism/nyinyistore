import { promises as fs } from "fs";
import path from "path";
import { createTransaction } from "./digiflazz";
import { type Order } from "./crypto-payment";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

/**
 * Maps game slugs to Digiflazz buyer_sku_code prefixes
 */
const GAME_SKU_PREFIX: Record<string, string> = {
  "mobile-legends": "ml",
  "free-fire": "ff",
  "genshin-impact": "gi",
  "valorant": "vl",
  "pubg-mobile": "pubgm",
  "honkai-star-rail": "hsr",
};

/**
 * Maps game slug + denomination amount to specific buyer_sku_codes
 * Format: { "game-slug": { "denomination_id": "buyer_sku_code" } }
 */
const DENOMINATION_SKU_MAP: Record<string, Record<string, string>> = {
  "mobile-legends": {
    "86 Diamonds": "ml-86",
    "172 Diamonds": "ml-172",
    "257 Diamonds": "ml-257",
    "344 Diamonds": "ml-344",
    "514 Diamonds": "ml-514",
    "706 Diamonds": "ml-706",
  },
  "free-fire": {
    "70 Diamonds": "ff-70",
    "140 Diamonds": "ff-140",
    "355 Diamonds": "ff-355",
    "720 Diamonds": "ff-720",
    "1450 Diamonds": "ff-1450",
    "2180 Diamonds": "ff-2180",
  },
  "genshin-impact": {
    "60 Crystals": "gi-60",
    "330 Crystals": "gi-330",
    "1090 Crystals": "gi-1090",
    "2240 Crystals": "gi-2240",
    "3880 Crystals": "gi-3880",
    "8080 Crystals": "gi-8080",
  },
  "valorant": {
    "125 VP": "vl-125",
    "420 VP": "vl-420",
    "700 VP": "vl-700",
    "1375 VP": "vl-1375",
    "2400 VP": "vl-2400",
    "4000 VP": "vl-4000",
  },
  "pubg-mobile": {
    "60 UC": "pubgm-60",
    "325 UC": "pubgm-325",
    "660 UC": "pubgm-660",
    "1800 UC": "pubgm-1800",
    "3850 UC": "pubgm-3850",
    "8100 UC": "pubgm-8100",
  },
  "honkai-star-rail": {
    "60 Shards": "hsr-60",
    "330 Shards": "hsr-330",
    "1090 Shards": "hsr-1090",
    "2240 Shards": "hsr-2240",
    "3880 Shards": "hsr-3880",
    "8080 Shards": "hsr-8080",
  },
};

/**
 * Get the buyer_sku_code for a given game and denomination
 */
export function getBuyerSkuCode(
  gameSlug: string,
  denominationId: string
): string | null {
  const gameMap = DENOMINATION_SKU_MAP[gameSlug];
  if (!gameMap) return null;

  const skuCode = gameMap[denominationId];
  if (!skuCode) {
    // Fallback: try to construct from prefix + numeric part
    const prefix = GAME_SKU_PREFIX[gameSlug];
    if (!prefix) return null;

    const numericMatch = denominationId.match(/^(\d+)/);
    if (!numericMatch) return null;

    return `${prefix}-${numericMatch[1]}`;
  }

  return skuCode;
}

/**
 * Format customer_no based on game requirements
 * Mobile Legends: "userid|serverid"
 * Free Fire: "userid" (no server)
 * Genshin Impact: "userid|serverid"
 * Valorant: "userid"
 * PUBG Mobile: "userid"
 * Honkai Star Rail: "userid|serverid"
 */
export function formatCustomerNo(
  gameSlug: string,
  userId: string,
  serverId?: string
): string {
  const gamesWithServer = [
    "mobile-legends",
    "genshin-impact",
    "honkai-star-rail",
  ];

  if (gamesWithServer.includes(gameSlug) && serverId) {
    return `${userId}|${serverId}`;
  }

  return userId;
}

/**
 * Auto-fulfillment: checks for paid orders and triggers fulfillment
 * Can be called periodically or after payment verification
 */
export async function fulfillPaidOrders(): Promise<{
  fulfilled: string[];
  errors: { orderId: string; error: string }[];
}> {
  const fulfilled: string[] = [];
  const errors: { orderId: string; error: string }[] = [];

  let orders: Order[];
  try {
    const data = await fs.readFile(ORDERS_FILE, "utf-8");
    orders = JSON.parse(data);
  } catch {
    return { fulfilled, errors };
  }

  const paidOrders = orders.filter((o) => o.status === "paid");

  for (const order of paidOrders) {
    try {
      const buyerSkuCode = getBuyerSkuCode(order.game_slug, order.denomination_id);
      if (!buyerSkuCode) {
        errors.push({
          orderId: order.id,
          error: "Could not map to Digiflazz SKU code",
        });
        continue;
      }

      const customerNo = formatCustomerNo(
        order.game_slug,
        order.user_id,
        order.server_id
      );

      const refId = order.id;

      const transaction = await createTransaction(buyerSkuCode, customerNo, refId);

      // Update order status
      const orderIndex = orders.findIndex((o) => o.id === order.id);
      if (orderIndex !== -1) {
        orders[orderIndex] = {
          ...orders[orderIndex],
          status: "processing",
          digiflazz_ref_id: refId,
          digiflazz_status: transaction.status,
          updated_at: new Date().toISOString(),
        };
      }

      fulfilled.push(order.id);
    } catch (error) {
      errors.push({
        orderId: order.id,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Save updated orders
  if (fulfilled.length > 0) {
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
  }

  return { fulfilled, errors };
}
