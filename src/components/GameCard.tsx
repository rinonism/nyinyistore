"use client";

import Link from "next/link";
import { useState } from "react";

interface GameCardProps {
  name: string;
  slug: string;
  image: string;
  developer: string;
  index?: number;
}

export default function GameCard({ name, slug, image, developer, index = 0 }: GameCardProps) {
  return (
    <Link href={`/topup/${slug}`}>
      <div
        className="game-card card-animate flex items-center gap-3 rounded-2xl border border-[#2a2a2a] bg-[#1e1e1e] p-3 transition-all hover:border-[#c8a45c40] active:scale-[0.98]"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Square game icon */}
        <div className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 overflow-hidden rounded-xl border border-[#3a3a3a] bg-[#252525]">
          <GameImage src={image} alt={name} />
        </div>
        {/* Name + Developer */}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-white truncate">{name}</h3>
          <p className="text-[11px] text-[#777] truncate">{developer}</p>
        </div>
      </div>
    </Link>
  );
}

function GameImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#252525] text-lg">
        🎮
      </div>
    );
  }

  return (
    <>
      {!loaded && <div className="h-full w-full animate-pulse bg-[#252525]" />}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </>
  );
}
