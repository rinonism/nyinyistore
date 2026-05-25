import GameCard from "@/components/GameCard";
import { games } from "@/lib/games";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Banner Carousel */}
      <section className="mx-auto max-w-7xl px-4 pt-6">
        <div className="overflow-hidden rounded-2xl">
          <div className="relative aspect-[2.5/1] w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
                  Top Up Game Termurah 🔥
                </h2>
                <p className="text-lg text-slate-300">
                  Proses cepat 1-3 detik • Pembayaran Crypto & QRIS • 24/7
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <span className="rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm text-white backdrop-blur">
                    ⚡ Instan
                  </span>
                  <span className="rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm text-white backdrop-blur">
                    🔒 Aman
                  </span>
                  <span className="rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm text-white backdrop-blur">
                    💰 Termurah
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Section */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-6">
        <h2 className="mb-6 text-xl font-bold text-white flex items-center gap-2">
          🔥 <span>POPULER SEKARANG!</span>
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {games.slice(0, 5).map((game) => (
            <GameCard
              key={game.slug}
              name={game.name}
              slug={game.slug}
              image={game.image}
              description={game.description}
            />
          ))}
        </div>
      </section>

      {/* All Games Section */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <h2 className="mb-6 text-xl font-bold text-white flex items-center gap-2">
          🎮 <span>SEMUA GAME</span>
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {games.map((game) => (
            <GameCard
              key={game.slug}
              name={game.name}
              slug={game.slug}
              image={game.image}
              description={game.description}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800 bg-[#0a1018]">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🎮</span>
                <span className="text-lg font-bold text-white">NyinyiStore</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                NyinyiStore adalah tempat top up games yang aman, murah dan terpercaya. 
                Proses cepat 1-3 Detik. Open 24 jam. Payment terlengkap.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <a href="#" className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="#" className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.88 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.82.11V9.4a6.33 6.33 0 00-.82-.05A6.34 6.34 0 003.15 15.7a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.05a8.27 8.27 0 004.76 1.5V7.1a4.83 4.83 0 01-1-.41z"/></svg>
                </a>
                <a href="#" className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              </div>
            </div>

            {/* Peta Situs */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-white uppercase tracking-wider">Peta Situs</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/" className="hover:text-white transition-colors">Beranda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cek Transaksi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Leaderboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hubungi Kami</a></li>
              </ul>
            </div>

            {/* Pembayaran */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-white uppercase tracking-wider">Pembayaran</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>💲 USDT (ERC20 / BEP20)</li>
                <li>💲 USDC (Base / Arbitrum)</li>
                <li>📱 QRIS</li>
                <li>🏦 Bank Transfer</li>
                <li>🪙 SOL (Solana)</li>
              </ul>
            </div>

            {/* Dukungan */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-white uppercase tracking-wider">Dukungan</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">💬 Telegram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">📷 Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">📧 Email</a></li>
                <li className="pt-2 text-xs text-slate-500">🕐 Layanan 24/7</li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">© 2024 NyinyiStore. All rights reserved.</p>
            <div className="flex gap-4 text-xs text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat CS Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="#"
          className="relative flex items-center gap-2 rounded-full bg-green-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-green-600 hover:shadow-xl"
        >
          <span className="chat-pulse relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-300"></span>
          </span>
          CHAT CS
        </a>
      </div>
    </div>
  );
}
