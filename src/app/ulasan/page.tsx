export default function UlasanPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 py-10">
      <h1 className="text-xl font-bold text-white mb-2">⭐ Ulasan & Rating</h1>
      <p className="text-xs text-[#777] mb-6">
        Lihat apa kata pelanggan kami tentang NyinyiStore.
      </p>

      <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-8 text-center">
        <p className="text-4xl mb-3">⭐</p>
        <p className="text-sm text-white font-medium mb-1">Belum ada ulasan</p>
        <p className="text-xs text-[#777]">Ulasan akan muncul setelah ada transaksi selesai.</p>
      </div>
    </div>
  );
}
