import { getSupabase } from "@/lib/supabase";

export const revalidate = 60; // Revalidate every 60 seconds

interface LeaderboardEntry {
  user_game_id: string;
  game_slug: string;
  total_orders: number;
  total_spent: number;
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

function maskUserId(id: string): string {
  if (id.length <= 4) return id;
  return id.slice(0, 3) + "***" + id.slice(-2);
}

function getMedalEmoji(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const supabase = getSupabase();

    // Get current month range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { data, error } = await supabase
      .from("orders")
      .select("user_game_id, game_slug, amount_idr")
      .in("status", ["completed", "paid", "processing"])
      .gte("created_at", startOfMonth);

    if (error || !data) {
      console.error("Leaderboard fetch error:", error);
      return [];
    }

    // Aggregate by user_game_id
    const userMap = new Map<string, LeaderboardEntry>();
    for (const order of data) {
      const key = order.user_game_id;
      if (!userMap.has(key)) {
        userMap.set(key, {
          user_game_id: order.user_game_id,
          game_slug: order.game_slug,
          total_orders: 0,
          total_spent: 0,
        });
      }
      const entry = userMap.get(key)!;
      entry.total_orders += 1;
      entry.total_spent += order.amount_idr || 0;
    }

    // Sort by total_orders desc, then total_spent desc
    return Array.from(userMap.values())
      .sort((a, b) => b.total_orders - a.total_orders || b.total_spent - a.total_spent)
      .slice(0, 20);
  } catch {
    return [];
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
}

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();

  const currentMonth = new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <div className="mx-auto max-w-[800px] px-4 py-10">
      <h1 className="text-xl font-bold text-white mb-2">🏆 Leaderboard</h1>
      <p className="text-xs text-[#777] mb-6">
        Top buyer bulan {currentMonth}. Semakin banyak transaksi, semakin tinggi peringkat kamu!
      </p>

      {leaderboard.length === 0 ? (
        <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-8 text-center">
          <p className="text-4xl mb-3">🏆</p>
          <p className="text-sm text-white font-medium mb-1">Belum ada data</p>
          <p className="text-xs text-[#777]">Leaderboard akan muncul setelah ada transaksi selesai bulan ini.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry, idx) => (
            <div
              key={entry.user_game_id}
              className={`flex items-center gap-3 rounded-xl border p-4 ${
                idx < 3
                  ? "border-[#d4af37]/30 bg-[#d4af37]/5"
                  : "border-[#2a2a2a] bg-[#1e1e1e]"
              }`}
            >
              {/* Rank */}
              <div className="w-8 text-center">
                <span className={`text-sm font-bold ${idx < 3 ? "text-[#d4af37]" : "text-[#666]"}`}>
                  {getMedalEmoji(idx + 1)}
                </span>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {maskUserId(entry.user_game_id)}
                </p>
                <p className="text-[10px] text-[#999]">
                  {getGameName(entry.game_slug)}
                </p>
              </div>

              {/* Stats */}
              <div className="text-right">
                <p className="text-sm font-medium text-[#d4af37]">
                  {formatPrice(entry.total_spent)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
