"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
}

export default function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className = "",
  fill = false,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [src]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-[#252525] text-[#555] text-xs ${className}`}
        style={!fill ? { width, height } : undefined}
      >
        🎮
      </div>
    );
  }

  return (
    <div className={`relative ${!loaded ? "animate-pulse bg-[#252525]" : ""} ${fill ? "w-full h-full" : ""}`}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
}
