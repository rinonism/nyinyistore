export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 py-10">
      <h1 className="text-xl font-bold text-white mb-2">🏆 Leaderboard</h1>
      <p className="text-xs text-[#777] mb-6">
        Top buyer bulan ini. Semakin banyak transaksi, semakin tinggi peringkat kamu!
      </p>

      <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-8 text-center">
        <p className="text-4xl mb-3">🏆</p>
        <p className="text-sm text-white font-medium mb-1">Belum ada data</p>
        <p className="text-xs text-[#777]">Leaderboard akan muncul setelah ada transaksi.</p>
      </div>
    </div>
  );
}
