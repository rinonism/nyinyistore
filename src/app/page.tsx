import GameCard from "@/components/GameCard";
import { games } from "@/lib/games";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Top Up Game
            </span>
            <br />
            <span className="text-white">Pakai Crypto</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
            Isi diamond, UC, VP, dan crystal game favorit kamu dengan crypto.
            Proses cepat, harga murah, dan aman.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
              ⚡ Proses Instan
            </span>
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
              🔒 Aman & Terpercaya
            </span>
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
              💰 Harga Terbaik
            </span>
          </div>
        </div>
      </section>

      {/* Game Grid */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold text-white">Pilih Game</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard
              key={game.slug}
              name={game.name}
              slug={game.slug}
              icon={game.icon}
              description={game.description}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 pt-8 pb-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎮</span>
              <span className="text-lg font-bold text-white">NyinyiStore</span>
            </div>
            <p className="text-sm text-gray-400">
              Platform top up game terpercaya dengan pembayaran crypto.
              Layanan 24/7 dengan proses otomatis.
            </p>
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-white">Pembayaran</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>💲 USDT (TRC20 / ERC20)</li>
              <li>💲 USDC (TRC20 / ERC20)</li>
              <li>📱 QRIS</li>
              <li>🏦 Bank Transfer</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-semibold text-white">Kontak</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📧 support@nyinyistore.com</li>
              <li>💬 Telegram: @nyinyistore</li>
              <li>🕐 Layanan 24/7</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © 2024 NyinyiStore. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
