import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Artikel & Panduan Top Up Game - NyinyiStore",
  description:
    "Kumpulan artikel dan panduan top up game murah. Cara top up ML, FF, Genshin Impact pakai crypto. Tips hemat beli diamond.",
  keywords: [
    "artikel top up game",
    "panduan top up ml",
    "cara top up ff",
    "tips top up murah",
  ],
  openGraph: {
    title: "Artikel & Panduan Top Up Game - NyinyiStore",
    description: "Panduan lengkap top up game murah dan cepat.",
    url: "https://nyinyistore.com/artikel",
    type: "website",
    locale: "id_ID",
  },
  alternates: {
    canonical: "https://nyinyistore.com/artikel",
  },
};

const articles = [
  {
    slug: "top-up-diamond-ml-murah-2026",
    title: "Top Up Diamond ML Murah 2026 — Harga Terbaru & Cara Order",
    description:
      "Daftar harga diamond Mobile Legends terbaru 2026. Mulai Rp1.650, proses cepat 3-5 menit.",
    date: "27 Mei 2026",
    tag: "Mobile Legends",
  },
  {
    slug: "cara-top-up-ml-pakai-crypto",
    title: "Cara Top Up ML Pakai Crypto (USDT/USDC) 2026",
    description:
      "Panduan lengkap top up Mobile Legends pakai crypto. Tanpa bank, tanpa e-wallet, proses instan.",
    date: "27 Mei 2026",
    tag: "Crypto",
  },
  {
    slug: "cara-top-up-ff-murah-cepat",
    title: "Cara Top Up FF (Free Fire) Murah & Cepat 2026",
    description:
      "Top up diamond Free Fire murah. 32 pilihan nominal, membership, proses 3-5 menit.",
    date: "27 Mei 2026",
    tag: "Free Fire",
  },
];

export default function ArtikelIndex() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
        Artikel & Panduan
      </h1>
      <p className="text-gray-400 mb-10">
        Tips, panduan, dan info terbaru seputar top up game murah di NyinyiStore.
      </p>

      <div className="space-y-6">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/artikel/${article.slug}`}
            className="block bg-[#1e1e2e] border border-gray-700 rounded-xl p-6 hover:border-[#d4af37]/50 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs bg-[#d4af37]/20 text-[#d4af37] px-2 py-1 rounded">
                {article.tag}
              </span>
              <span className="text-xs text-gray-500">{article.date}</span>
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-[#d4af37] transition-colors mb-2">
              {article.title}
            </h2>
            <p className="text-gray-400 text-sm">{article.description}</p>
          </Link>
        ))}
      </div>

      {/* Internal linking CTA */}
      <div className="mt-12 bg-[#1a1a2e] border border-gray-700 rounded-xl p-8 text-center">
        <h3 className="text-xl font-bold text-white mb-3">
          Langsung Top Up?
        </h3>
        <p className="text-gray-400 mb-5">
          Pilih game favorit kamu dan top up sekarang.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/topup/mobile-legends"
            className="bg-[#d4af37] text-black font-bold px-5 py-2 rounded-lg text-sm hover:bg-[#b8962e] transition-colors"
          >
            Mobile Legends
          </Link>
          <Link
            href="/topup/free-fire"
            className="bg-transparent border border-[#d4af37] text-[#d4af37] font-bold px-5 py-2 rounded-lg text-sm hover:bg-[#d4af37]/10 transition-colors"
          >
            Free Fire
          </Link>
          <Link
            href="/topup/genshin-impact"
            className="bg-transparent border border-[#d4af37] text-[#d4af37] font-bold px-5 py-2 rounded-lg text-sm hover:bg-[#d4af37]/10 transition-colors"
          >
            Genshin Impact
          </Link>
        </div>
      </div>
    </div>
  );
}
