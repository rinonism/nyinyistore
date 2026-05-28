"use client";

export default function TentangKami() {
  return (
    <div className="mx-auto max-w-[700px] px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-6">Tentang Kami</h1>
      <div className="space-y-4 text-sm text-[#ccc] leading-relaxed">
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1e1e1e] p-6 text-center mb-6">
          <div className="text-4xl mb-3">🎮</div>
          <h2 className="text-lg font-bold text-white mb-2">NyinyiStore</h2>
          <p className="text-[#999]">Platform top-up game terpercaya dengan pembayaran crypto</p>
        </div>

        <h2 className="text-base font-semibold text-white mt-6">Siapa Kami?</h2>
        <p>NyinyiStore adalah platform top-up game online yang menyediakan layanan pembelian diamond, voucher, dan item digital untuk berbagai game populer. Kami hadir untuk memberikan kemudahan bagi gamers Indonesia dalam melakukan top-up dengan cepat, aman, dan terjangkau.</p>

        <h2 className="text-base font-semibold text-white mt-6">Kenapa NyinyiStore?</h2>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] p-4 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-xs font-semibold text-white">Proses Instan</p>
            <p className="text-[10px] text-[#888] mt-1">Diamond masuk dalam hitungan menit</p>
          </div>
          <div className="rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] p-4 text-center">
            <div className="text-2xl mb-2">🔒</div>
            <p className="text-xs font-semibold text-white">Aman & Terpercaya</p>
            <p className="text-[10px] text-[#888] mt-1">Transaksi terenkripsi dan terverifikasi</p>
          </div>
          <div className="rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] p-4 text-center">
            <div className="text-2xl mb-2">💰</div>
            <p className="text-xs font-semibold text-white">Harga Bersaing</p>
            <p className="text-[10px] text-[#888] mt-1">Harga kompetitif dengan markup minimal</p>
          </div>
          <div className="rounded-xl bg-[#1e1e1e] border border-[#2a2a2a] p-4 text-center">
            <div className="text-2xl mb-2">🪙</div>
            <p className="text-xs font-semibold text-white">Bayar Crypto</p>
            <p className="text-[10px] text-[#888] mt-1">USDT & USDC di berbagai network</p>
          </div>
        </div>

        <h2 className="text-base font-semibold text-white mt-6">Game yang Tersedia</h2>
        <ul className="list-disc list-inside space-y-1 text-[#999]">
          <li>Mobile Legends: Bang Bang</li>
          <li>Free Fire</li>
          <li>Genshin Impact</li>
          <li>Dan game lainnya (terus bertambah)</li>
        </ul>

        <h2 className="text-base font-semibold text-white mt-6">Metode Pembayaran</h2>
        <ul className="list-disc list-inside space-y-1 text-[#999]">
          <li>USDT (Ethereum, BSC, Base, Arbitrum, Solana)</li>
          <li>USDC (Ethereum, BSC, Base, Arbitrum, Solana)</li>
          <li>QRIS, Transfer Bank, E-Wallet (segera hadir)</li>
        </ul>

        <h2 className="text-base font-semibold text-white mt-6">Hubungi Kami</h2>
        <p>Ada pertanyaan atau butuh bantuan? Jangan ragu untuk menghubungi kami:</p>
        <ul className="list-disc list-inside space-y-1 text-[#999]">
          <li>Telegram: <a href="https://t.me/NyinyiStore_bot" className="text-[#d4af37] hover:underline">@NyinyiStore_bot</a></li>
          <li>Email: support@nyinyistore.com</li>
        </ul>
      </div>
    </div>
  );
}
