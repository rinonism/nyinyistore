"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="sticky top-0 z-50 border-b border-[#2a2a2a] bg-[#1a1a1a]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <span className="text-lg font-bold text-[#c8a45c]">
            NyinyiStore
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-sm mx-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Cari Game atau Voucher"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            href="/"
            className="hidden sm:block rounded-lg px-3 py-2 text-xs font-medium text-[#ccc] transition-colors hover:text-white"
          >
            Cek Transaksi
          </Link>
          <Link
            href="/"
            className="hidden lg:block rounded-lg px-3 py-2 text-xs font-medium text-[#ccc] transition-colors hover:text-white"
          >
            Leaderboard
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-[#c8a45c] px-4 py-1.5 text-xs font-medium text-[#c8a45c] transition-colors hover:bg-[#c8a45c] hover:text-white"
          >
            Masuk
          </Link>
          <Link
            href="/"
            className="rounded-lg bg-[#c8a45c] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#d4a843]"
          >
            Daftar
          </Link>
        </div>
      </div>
    </nav>
  );
}
