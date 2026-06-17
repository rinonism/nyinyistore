import { getSupabase } from "@/lib/supabase";
import { maskName } from "@/lib/mask";

interface Review {
  id: string;
  order_id: string;
  game_slug: string;
  rating: number;
  review: string;
  created_at: string;
  name: string; // masked nickname, resolved server-side
}

export const revalidate = 60; // Revalidate every 60 seconds

async function getReviews(): Promise<Review[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Failed to fetch reviews:", error);
      return [];
    }

    const reviews = data || [];
    if (reviews.length === 0) return [];

    // Resolve player nicknames from the orders table (join by order_id),
    // then mask before sending anything to the client.
    const orderIds = reviews.map((r) => r.order_id).filter(Boolean);
    const nameMap = new Map<string, string>();
    if (orderIds.length > 0) {
      const { data: orders } = await supabase
        .from("orders")
        .select("order_id, nickname")
        .in("order_id", orderIds);
      for (const o of orders || []) {
        if (o.nickname) nameMap.set(o.order_id, o.nickname);
      }
    }

    return reviews.map((r) => ({
      ...r,
      name: maskName(nameMap.get(r.order_id)),
    }));
  } catch {
    return [];
  }
}

function getGameName(slug: string): string {
  const map: Record<string, string> = {
    "mobile-legends": "Mobile Legends",
    "free-fire": "Free Fire",
    "free-fire-max": "Free Fire MAX",
    "genshin-impact": "Genshin Impact",
    "stumble-guys": "Stumble Guys",
    "pubg-mobile": "PUBG Mobile",
    "valorant": "Valorant",
  };
  return map[slug] || slug;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-sm">
      {"⭐".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

export default async function UlasanPage() {
  const reviews = await getReviews();

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="mx-auto max-w-[800px] px-4 py-10">
      <h1 className="text-xl font-bold text-white mb-2">⭐ Ulasan & Rating</h1>
      <p className="text-xs text-[#777] mb-6">
        Lihat apa kata pelanggan kami tentang NyinyiStore.
      </p>

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-8 text-center">
          <p className="text-4xl mb-3">⭐</p>
          <p className="text-sm text-white font-medium mb-1">Belum ada ulasan</p>
          <p className="text-xs text-[#777]">Ulasan akan muncul setelah ada transaksi selesai.</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="mb-6 rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-5">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#d4af37]">{avgRating}</p>
                <p className="text-xs text-[#999] mt-1">{reviews.length} ulasan</p>
              </div>
              <div className="flex-1 space-y-1">
                {ratingCounts.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-[10px] text-[#999] w-3">{star}</span>
                    <div className="flex-1 h-2 rounded-full bg-[#2a2a2a] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#d4af37]"
                        style={{ width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#666] w-5">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d4af37]/15 text-[11px] font-bold text-[#d4af37]">
                      {r.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold text-white leading-tight">{r.name}</p>
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={r.rating} />
                        <span className="text-[10px] rounded bg-[#2a2a2a] px-1.5 py-0.5 text-[#999]">
                          {getGameName(r.game_slug)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#666]">{formatDate(r.created_at)}</span>
                </div>
                {r.review && (
                  <p className="text-xs text-[#ccc] leading-relaxed">{r.review}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
