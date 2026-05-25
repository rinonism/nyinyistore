export default function LeaderboardPage() {
  // Mock data - will be replaced with real data from database later
  const topBuyers = [
    { rank: 1, name: "Riz***", total: "Rp 12.450.000", transactions: 89, badge: "🥇" },
    { rank: 2, name: "And***", total: "Rp 8.320.000", transactions: 64, badge: "🥈" },
    { rank: 3, name: "Fah***", total: "Rp 6.780.000", transactions: 52, badge: "🥉" },
    { rank: 4, name: "Dev***", total: "Rp 5.120.000", transactions: 41, badge: "4" },
    { rank: 5, name: "Bag***", total: "Rp 4.890.000", transactions: 38, badge: "5" },
    { rank: 6, name: "Yus***", total: "Rp 3.650.000", transactions: 29, badge: "6" },
    { rank: 7, name: "Adi***", total: "Rp 3.210.000", transactions: 25, badge: "7" },
    { rank: 8, name: "Put***", total: "Rp 2.890.000", transactions: 22, badge: "8" },
    { rank: 9, name: "Ren***", total: "Rp 2.450.000", transactions: 19, badge: "9" },
    { rank: 10, name: "Alf***", total: "Rp 2.100.000", transactions: 16, badge: "10" },
  ];

  return (
    <div className="mx-auto max-w-[800px] px-4 py-10">
      <h1 className="text-xl font-bold text-white mb-2">🏆 Leaderboard</h1>
      <p className="text-xs text-[#777] mb-6">
        Top buyer bulan ini. Semakin banyak transaksi, semakin tinggi peringkat kamu!
      </p>

      {/* Leaderboard Table */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[60px_1fr_1fr_80px] gap-2 border-b border-[#2a2a2a] bg-[#252525] px-4 py-3">
          <span className="text-[10px] font-semibold text-[#c8a45c] uppercase">Rank</span>
          <span className="text-[10px] font-semibold text-[#c8a45c] uppercase">User</span>
          <span className="text-[10px] font-semibold text-[#c8a45c] uppercase text-right">Total Belanja</span>
          <span className="text-[10px] font-semibold text-[#c8a45c] uppercase text-right">Transaksi</span>
        </div>

        {/* Rows */}
        {topBuyers.map((buyer) => (
          <div
            key={buyer.rank}
            className={`grid grid-cols-[60px_1fr_1fr_80px] gap-2 items-center px-4 py-3 border-b border-[#2a2a2a] last:border-0 ${
              buyer.rank <= 3 ? "bg-[#c8a45c]/5" : ""
            }`}
          >
            <span className="text-sm font-bold text-center">
              {buyer.rank <= 3 ? buyer.badge : (
                <span className="text-[#777]">{buyer.badge}</span>
              )}
            </span>
            <span className="text-sm text-white font-medium">{buyer.name}</span>
            <span className="text-xs text-[#c8a45c] font-semibold text-right">{buyer.total}</span>
            <span className="text-xs text-[#777] text-right">{buyer.transactions}x</span>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="mt-6 rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-4">
        <p className="text-xs text-[#777]">
          📊 Leaderboard di-update setiap hari. Ranking berdasarkan total pembelian dalam 30 hari terakhir.
          Top 3 buyer mendapatkan bonus saldo setiap bulan!
        </p>
      </div>
    </div>
  );
}
