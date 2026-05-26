"use client";

import { useState, useEffect } from "react";

const banners = [
  {
    id: 1,
    title: "TOP UP GAME KILAT",
    subtitle: "Proses cepat 1-3 detik • Harga termurah se-Indonesia",
    gradient: "from-[#1a0f00] via-[#0d1a2a] to-[#1a0f00]",
    accent: "🔥",
  },
  {
    id: 2,
    title: "MOBILE LEGENDS DIAMOND",
    subtitle: "Top up diamond ML murah & instan • Proses otomatis 24 jam",
    gradient: "from-[#0a1628] via-[#1a0a2e] to-[#0a1628]",
    accent: "⚔️",
  },
  {
    id: 3,
    title: "BAYAR PAKAI CRYPTO",
    subtitle: "Support USDT, USDC • Rate terbaik • Tanpa ribet",
    gradient: "from-[#0f1a0a] via-[#0a1a1a] to-[#0f1a0a]",
    accent: "🪙",
  },
  {
    id: 4,
    title: "PROMO SPESIAL",
    subtitle: "Gunakan kode promo untuk diskon tambahan • Limited time!",
    gradient: "from-[#1a0a0a] via-[#2a0f1a] to-[#1a0a0a]",
    accent: "🎉",
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
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6">
                <p className="text-xs text-[#c8a45c] uppercase tracking-widest mb-1 sm:mb-2">NyinyiStore</p>
                <h2 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-extrabold text-white mb-1 sm:mb-2">
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
        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-[#555] bg-black/40 text-white/70 hover:bg-black/60 hover:text-white transition-colors"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-[#555] bg-black/40 text-white/70 hover:bg-black/60 hover:text-white transition-colors"
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
              i === current ? "w-6 bg-[#c8a45c]" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
