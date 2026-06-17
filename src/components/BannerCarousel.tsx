"use client";

import { useState, useEffect } from "react";

const banners = [
  {
    id: 1,
    title: "TOP UP GAME KILAT",
    subtitle: "Proses cepat hanya 3-5 menit • Harga termurah se-Indonesia",
    gradient: "from-[#1a1000] via-[#0d1a2a] to-[#1a0f00]",
    accent: "🔥",
    pattern: "radial-gradient(circle at 20% 50%, rgba(212,175,55,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212,175,55,0.05) 0%, transparent 40%)",
  },
  {
    id: 2,
    title: "MOBILE LEGENDS DIAMOND",
    subtitle: "Top up diamond ML murah & instan • Proses otomatis 24 jam",
    gradient: "from-[#0a1628] via-[#1a0a2e] to-[#0a1628]",
    accent: "⚔️",
    pattern: "radial-gradient(circle at 75% 60%, rgba(138,92,246,0.1) 0%, transparent 50%), radial-gradient(circle at 25% 30%, rgba(212,175,55,0.06) 0%, transparent 40%)",
  },
  {
    id: 3,
    title: "BAYAR PAKAI CRYPTO",
    subtitle: "Support USDT, USDC • Rate terbaik • Tanpa ribet",
    gradient: "from-[#0f1a0a] via-[#0a1a1a] to-[#0f1a0a]",
    accent: "🪙",
    pattern: "radial-gradient(circle at 30% 70%, rgba(76,175,80,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(212,175,55,0.06) 0%, transparent 40%)",
  },
  {
    id: 4,
    title: "PROMO SPESIAL",
    subtitle: "Gunakan kode promo untuk diskon tambahan • Limited time!",
    gradient: "from-[#1a0a0a] via-[#2a0f1a] to-[#1a0a0a]",
    accent: "🎉",
    pattern: "radial-gradient(circle at 60% 40%, rgba(239,143,143,0.08) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(212,175,55,0.06) 0%, transparent 40%)",
  },
];

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((current - 1 + banners.length) % banners.length);
  const next = () => setCurrent((current + 1) % banners.length);

  return (
    <div className="relative overflow-hidden rounded-2xl aspect-[2/1] sm:aspect-[3/1] lg:aspect-[3.5/1] bg-[#1e1e1e]">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`flex-shrink-0 w-full h-full relative bg-gradient-to-r ${banner.gradient}`}
          >
            {/* Decorative pattern overlay */}
            <div
              className="absolute inset-0"
              style={{ background: banner.pattern }}
            />
            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-24 h-24 opacity-20">
              <div className="absolute top-4 left-4 w-8 h-[1px] bg-[#d4af37]" />
              <div className="absolute top-4 left-4 w-[1px] h-8 bg-[#d4af37]" />
            </div>
            <div className="absolute bottom-0 right-0 w-24 h-24 opacity-20">
              <div className="absolute bottom-4 right-4 w-8 h-[1px] bg-[#d4af37]" />
              <div className="absolute bottom-4 right-4 w-[1px] h-8 bg-[#d4af37]" />
            </div>
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6">
                <p className="text-xs text-[#d4af37] uppercase tracking-widest mb-1 sm:mb-2 font-medium">NyinyiStore</p>
                <h2 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-extrabold text-white mb-1 sm:mb-2 drop-shadow-lg">
                  {banner.accent} {banner.title}
                </h2>
                <p className="text-[11px] sm:text-xs md:text-sm text-[#b0b0b0]">
                  {banner.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-[#555] bg-black/50 text-white/70 hover:bg-[#d4af37]/20 hover:border-[#d4af37]/50 hover:text-white transition-all"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-[#555] bg-black/50 text-white/70 hover:bg-[#d4af37]/20 hover:border-[#d4af37]/50 hover:text-white transition-all"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? "w-6 bg-[#d4af37] shadow-[0_0_6px_rgba(212,175,55,0.5)]" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
