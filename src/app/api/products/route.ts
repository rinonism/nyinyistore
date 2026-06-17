import { NextResponse } from "next/server";
import { getPriceList, type DigiflazzProduct } from "@/lib/digiflazz";

// Simple in-memory cache
let cachedProducts: DigiflazzProduct[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

// Game category mapping for grouping
const GAME_CATEGORIES: Record<string, string> = {
  "MOBILE LEGENDS": "mobile-legends",
  "FREE FIRE": "free-fire",
  "GENSHIN IMPACT": "genshin-impact",
  "VALORANT": "valorant",
  "PUBG MOBILE": "pubg-mobile",
  "HONKAI STAR RAIL": "honkai-star-rail",
};

export async function GET() {
  try {
    const now = Date.now();

    // Use cache if still valid
    if (cachedProducts && now - cacheTimestamp < CACHE_DURATION_MS) {
      return NextResponse.json({ products: formatProducts(cachedProducts) });
    }

    // Fetch fresh data from Digiflazz
    const products = await getPriceList();
    cachedProducts = products;
    cacheTimestamp = now;

    return NextResponse.json({ products: formatProducts(products) });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

function formatProducts(products: DigiflazzProduct[]) {
  // Group by game category
  const grouped: Record<
    string,
    { name: string; slug: string; items: FormattedProduct[] }
  > = {};

  for (const product of products) {
    if (!product.buyer_product_status) continue;

    const brandUpper = product.brand.toUpperCase();
    let slug = "other";
    let gameName = product.brand;

    for (const [key, value] of Object.entries(GAME_CATEGORIES)) {
      if (brandUpper.includes(key)) {
        slug = value;
        gameName = key
          .split(" ")
          .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
          .join(" ");
        break;
      }
    }

    if (!grouped[slug]) {
      grouped[slug] = { name: gameName, slug, items: [] };
    }

    grouped[slug].items.push({
      buyer_sku_code: product.buyer_sku_code,
      product_name: product.product_name,
      price: product.price,
      stock_available: product.unlimited_stock || product.stock > 0,
    });
  }

  return Object.values(grouped);
}

interface FormattedProduct {
  buyer_sku_code: string;
  product_name: string;
  price: number;
  stock_available: boolean;
}
