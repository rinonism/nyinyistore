import GameCard from "@/components/GameCard";
import BannerCarousel from "@/components/BannerCarousel";
import Footer from "@/components/Footer";
import { games } from "@/lib/games";

const faqData = [
  {
    q: "Bagaimana cara top up di NyinyiStore?",
    a: "Pilih game yang ingin di-top up, masukkan User ID, pilih nominal, lalu pilih metode pembayaran. Proses otomatis 1-3 detik setelah pembayaran dikonfirmasi.",
  },
  {
    q: "Metode pembayaran apa saja yang tersedia?",
    a: "Kami menerima pembayaran via Crypto (USDT, USDC di Ethereum, BSC, Base, Arbitrum, Solana). Pembayaran QRIS dan Bank Transfer segera hadir.",
  },
  {
    q: "Berapa lama proses top up?",
    a: "Proses top up otomatis dalam 1-3 detik setelah pembayaran terverifikasi. Untuk pembayaran crypto, konfirmasi tergantung kecepatan blockchain (biasanya 1-5 menit).",
  },
  {
    q: "Apakah top up di NyinyiStore aman?",
    a: "100% aman. Kami menggunakan API resmi dari supplier terpercaya. Semua transaksi tercatat dan bisa dicek melalui halaman Cek Transaksi.",
  },
  {
    q: "Bagaimana cara cek transaksi?",
    a: "Klik menu 'Cek Transaksi' di navbar, lalu masukkan Order ID yang kamu terima saat melakukan pemesanan. Status transaksi akan ditampilkan secara real-time.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner Carousel */}
      <section className="mx-auto max-w-[1200px] px-3 sm:px-4 pt-3 sm:pt-5">
        <BannerCarousel />
      </section>

      {/* Rekomendasi Section */}
      <section className="mx-auto max-w-[1200px] px-3 sm:px-4 pt-6 sm:pt-8 pb-4">
        <h2 className="mb-1 text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <span>✨</span> REKOMENDASI
        </h2>
        <p className="mb-3 sm:mb-4 text-xs text-[#777]">
          Berikut adalah beberapa produk yang kami rekomendasikan untuk kamu.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {games.slice(0, 3).map((game, i) => (
            <GameCard
              key={game.slug}
              name={game.name}
              slug={game.slug}
              image={game.image}
              developer={game.developer}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* Populer Sekarang Section */}
      <section className="mx-auto max-w-[1200px] px-3 sm:px-4 py-4 sm:py-6">
        <h2 className="mb-1 text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <span>🔥</span> POPULER SEKARANG!
        </h2>
        <p className="mb-3 sm:mb-4 text-xs text-[#777]">
          Berikut adalah beberapa produk yang paling populer saat ini.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game, i) => (
            <GameCard
              key={game.slug}
              name={game.name}
              slug={game.slug}
              image={game.image}
              developer={game.developer}
              index={i}
              comingSoon={game.denominations.every((d) => d.comingSoon)}
            />
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-[1200px] px-4 py-8">
        <h2 className="mb-5 text-base font-bold text-white">Kamu Punya Pertanyaan?</h2>
        <div className="space-y-2">
          {faqData.map((item, i) => (
            <details key={i} className="group rounded-xl border border-[#2a2a2a] bg-[#1e1e1e]">
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm text-white">
                {item.q}
                <svg className="h-4 w-4 text-[#777] transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-4 pb-3 text-xs text-[#b0b0b0] leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <Footer />

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
