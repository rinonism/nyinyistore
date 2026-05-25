import GameCard from "@/components/GameCard";
import BannerCarousel from "@/components/BannerCarousel";
import { games } from "@/lib/games";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner Carousel */}
      <section className="mx-auto max-w-[1200px] px-4 pt-5">
        <BannerCarousel />
      </section>

      {/* Rekomendasi Section */}
      <section className="mx-auto max-w-[1200px] px-4 pt-8 pb-4">
        <h2 className="mb-1 text-base font-bold text-white flex items-center gap-2">
          <span>✨</span> REKOMENDASI
        </h2>
        <p className="mb-4 text-xs text-[#777]">
          Berikut adalah beberapa produk yang kami rekomendasikan untuk kamu.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {games.slice(0, 3).map((game) => (
            <GameCard
              key={game.slug}
              name={game.name}
              slug={game.slug}
              image={game.image}
              developer={game.developer}
            />
          ))}
        </div>
      </section>

      {/* Populer Sekarang Section */}
      <section className="mx-auto max-w-[1200px] px-4 py-6">
        <h2 className="mb-1 text-base font-bold text-white flex items-center gap-2">
          <span>🔥</span> POPULER SEKARANG!
        </h2>
        <p className="mb-4 text-xs text-[#777]">
          Berikut adalah beberapa produk yang paling populer saat ini.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard
              key={game.slug}
              name={game.name}
              slug={game.slug}
              image={game.image}
              developer={game.developer}
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
            <details key={i} className="group rounded-xl border border-[#2a2a2a] bg-[#1e1e1e]">
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
                <img src="/logo-cat.svg" alt="NyinyiStore" className="h-7 w-7" />
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

      {/* Floating WhatsApp CS Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/6285157434365?text=Halo%20NyinyiStore%2C%20saya%20butuh%20bantuan"
          target="_blank"
          rel="noopener noreferrer"
          className="chat-pulse relative flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition-all hover:bg-[#1da851]"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          CHAT CS
        </a>
      </div>
    </div>
  );
}
