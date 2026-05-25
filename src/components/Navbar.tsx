"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { games } from "@/lib/games";

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter games based on search query
  const filteredGames = searchQuery.trim()
    ? games.filter(
        (game) =>
          game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.developer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (slug: string) => {
    setSearchQuery("");
    setShowResults(false);
    router.push(`/topup/${slug}`);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#2a2a2a] bg-[#1a1a1a]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <img src="/logo-cat.png" alt="NyinyiStore" className="h-8 w-8 object-contain" />
          <span className="text-lg font-bold text-[#EF8F8F]" style={{ fontFamily: "var(--font-fredoka), sans-serif" }}>
            NyinyiStore
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-sm mx-6" ref={searchRef}>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Cari Game atau Voucher"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="w-full rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-2 pl-10 text-sm text-white placeholder-[#777] focus:border-[#c8a45c] focus:outline-none focus:ring-1 focus:ring-[#c8a45c]"
            />
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            {/* Search Results Dropdown */}
            {showResults && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-[#3a3a3a] bg-[#1e1e1e] shadow-xl overflow-hidden z-50 max-h-[300px] overflow-y-auto">
                {filteredGames.length > 0 ? (
                  filteredGames.map((game) => (
                    <button
                      key={game.slug}
                      onClick={() => handleSelect(game.slug)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-[#252525] transition-colors"
                    >
                      <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg border border-[#3a3a3a]">
                        <img src={game.image} alt={game.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">{game.name}</p>
                        <p className="text-[10px] text-[#777]">{game.developer}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-xs text-[#777] text-center">
                    Game tidak ditemukan
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-xs font-medium text-[#ccc] transition-colors hover:text-white"
          >
            Topup
          </Link>
          <Link
            href="/cek-transaksi"
            className="hidden sm:block rounded-lg px-3 py-2 text-xs font-medium text-[#ccc] transition-colors hover:text-white"
          >
            Cek Transaksi
          </Link>
          <Link
            href="/leaderboard"
            className="hidden lg:block rounded-lg px-3 py-2 text-xs font-medium text-[#ccc] transition-colors hover:text-white"
          >
            Leaderboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
