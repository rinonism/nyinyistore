import { NextResponse } from "next/server";
import { games } from "@/lib/games";

// Static at build time: this baked output changes ONLY when a new build deploys.
// The price-sync pipeline polls this after pushing to confirm the new prices are
// actually live on the web (not just committed/pushed). builtAt doubles as a
// per-deploy marker.
export const dynamic = "force-static";

export async function GET() {
  const prices: Record<string, number> = {};
  for (const g of games) {
    for (const d of g.denominations) {
      if (d.sku && typeof d.price === "number") {
        prices[d.sku] = d.price;
      }
    }
  }

  return NextResponse.json({
    count: Object.keys(prices).length,
    builtAt: new Date().toISOString(),
    prices,
  });
}
