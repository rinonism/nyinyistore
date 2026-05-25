import GameCard from "@/components/GameCard";
import { games } from "@/lib/games";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="mx-auto max-w-[1200px] px-4 pt-5">
        <div className="relative overflow-hidden rounded-xl aspect-[2.5/1] bg-[#1e1e1e]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a0f00] via-[#2a1800] to-[#1a0f00]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-6">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2">
                TOP UP GAME <span className="text-[#c8a45c]">TERMURAH</span> 🔥
              </h1>
              <p className="text-sm md:text-base text-[#b0b0b0]">
                Proses cepat 1-3 detik • Payment terlengkap • Open 24 jam
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="rounded-full bg-[#2a2a2a] border border-[#3a3a3a] px-3 py-1 text-xs text-[#ccc]">
                  ⚡ Proses Instan
                </span>
                <span className="rounded-full bg-[#2a2a2a] border border-[#3a3a3a] px-3 py-1 text-xs text-[#ccc]">
                  🔒 Pembayaran Aman
                </span>
                <span className="rounded-full bg-[#2a2a2a] border border-[#3a3a3a] px-3 py-1 text-xs text-[#ccc]">
                  💰 Harga Termurah
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Section */}
      <section className="mx-auto max-w-[1200px] px-4 pt-8 pb-4">
        <h2 className="mb-5 text-base font-bold text-white flex items-center gap-2">
          <span className="text-[#c8a45c]">🔥</span> POPULER SEKARANG!
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
      <section className="mx-auto max-w-[1200px] px-4 py-6">
        <h2 className="mb-5 text-base font-bold text-white flex items-center gap-2">
          <span className="text-[#c8a45c]">🎮</span> SEMUA GAME
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

      {/* FAQ Section */}
      <section className="mx-auto max-w-[1200px] px-4 py-8">
        <h2 className="mb-5 text-base font-bold text-white">Kamu Punya Pertanyaan?</h2>
        <div className="space-y-2">
          {[
            "Bagaimana cara top up di NyinyiStore?",
            "Metode pembayaran apa saja yang tersedia?",
            "Berapa lama proses top up?",
            "Apakah top up di NyinyiStore aman?",
            "Bagaimana cara cek transaksi?",
          ].map((q, i) => (
            <details key={i} className="group rounded-lg border border-[#2a2a2a] bg-[#1e1e1e]">
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm text-white">
                {q}
                <svg className="h-4 w-4 text-[#777] transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-4 pb-3 text-xs text-[#b0b0b0]">
                Silahkan hubungi customer service kami melalui tombol Chat CS di kanan bawah.
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 border-t border-[#2a2a2a] bg-[#0f0f0f]">
        <div className="mx-auto max-w-[1200px] px-4 py-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🔥</span>
                <span className="text-base font-bold text-[#c8a45c]">NyinyiStore</span>
              </div>
              <p className="text-xs text-[#777] leading-relaxed">
                NyinyiStore adalah tempat top up games yang aman, murah dan terpercaya.
                Proses cepat 1-3 Detik. Open 24 jam. Payment terlengkap.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <a href="#" className="rounded-full bg-[#2a2a2a] p-2 text-[#777] hover:text-[#c8a45c] transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="#" className="rounded-full bg-[#2a2a2a] p-2 text-[#777] hover:text-[#c8a45c] transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.88 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.82.11V9.4a6.33 6.33 0 00-.82-.05A6.34 6.34 0 003.15 15.7a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.05a8.27 8.27 0 004.76 1.5V7.1a4.83 4.83 0 01-1-.41z"/></svg>
                </a>
                <a href="#" className="rounded-full bg-[#2a2a2a] p-2 text-[#777] hover:text-[#c8a45c] transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>

            {/* Peta Situs */}
            <div>
              <h3 className="mb-3 text-xs font-semibold text-[#c8a45c] uppercase tracking-wider">Peta Situs</h3>
              <ul className="space-y-2 text-xs text-[#777]">
                <li><a href="/" className="hover:text-white transition-colors">Beranda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cek Transaksi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hubungi Kami</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ulasan</a></li>
              </ul>
            </div>

            {/* Dukungan */}
            <div>
              <h3 className="mb-3 text-xs font-semibold text-[#c8a45c] uppercase tracking-wider">Dukungan</h3>
              <ul className="space-y-2 text-xs text-[#777]">
                <li><a href="#" className="hover:text-white transition-colors">Whatsapp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Email</a></li>
              </ul>
            </div>

            {/* Legalitas */}
            <div>
              <h3 className="mb-3 text-xs font-semibold text-[#c8a45c] uppercase tracking-wider">Legalitas</h3>
              <ul className="space-y-2 text-xs text-[#777]">
                <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-8 border-t border-[#2a2a2a] pt-6 text-center text-xs text-[#555]">
            © 2024 NyinyiStore. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating Chat CS Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="#"
          className="chat-pulse relative flex items-center gap-2 rounded-full bg-[#4caf50] px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition-all hover:bg-[#43a047]"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
          CHAT CS
        </a>
      </div>
    </div>
  );
}
