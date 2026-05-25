"use client";

import { useState } from "react";
import { games, formatPrice } from "@/lib/games";

export default function KalkulatorPage() {
  const [selectedGame, setSelectedGame] = useState("");
  const [quantity, setQuantity] = useState(1);

  const game = games.find((g) => g.slug === selectedGame);

  return (
    <div className="mx-auto max-w-[600px] px-4 py-10">
      <h1 className="text-xl font-bold text-white mb-2">🧮 Kalkulator Harga</h1>
      <p className="text-xs text-[#777] mb-6">
        Hitung estimasi harga top up sebelum membeli.
      </p>

      <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-5 space-y-4">
        {/* Game Select */}
        <div>
          <label className="mb-1 block text-xs text-[#b0b0b0]">Pilih Game</label>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white focus:border-[#c8a45c] focus:outline-none focus:ring-1 focus:ring-[#c8a45c]"
          >
            <option value="">-- Pilih Game --</option>
            {games.map((g) => (
              <option key={g.slug} value={g.slug}>{g.name}</option>
            ))}
          </select>
        </div>

        {/* Denomination List */}
        {game && (
          <>
            <div>
              <label className="mb-1 block text-xs text-[#b0b0b0]">Pilih Nominal</label>
              <div className="space-y-2">
                {game.denominations.map((denom) => (
                  <div
                    key={denom.amount}
                    className="flex items-center justify-between rounded-lg border border-[#3a3a3a] bg-[#252525] px-4 py-3"
                  >
                    <span className="text-xs text-white">{denom.amount}</span>
                    <span className="text-xs font-semibold text-[#c8a45c]">{formatPrice(denom.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Calculator */}
            <div>
              <label className="mb-1 block text-xs text-[#b0b0b0]">Jumlah Pembelian</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#3a3a3a] bg-[#252525] text-white hover:border-[#c8a45c] transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2 text-center text-sm text-white focus:border-[#c8a45c] focus:outline-none"
                  min={1}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#3a3a3a] bg-[#252525] text-white hover:border-[#c8a45c] transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="rounded-lg border border-[#c8a45c]/30 bg-[#c8a45c]/5 p-4">
              <p className="text-xs text-[#777] mb-2">Estimasi harga untuk {quantity}x pembelian:</p>
              <div className="space-y-1">
                {game.denominations.map((denom) => (
                  <div key={denom.amount} className="flex justify-between">
                    <span className="text-xs text-[#b0b0b0]">{denom.amount} × {quantity}</span>
                    <span className="text-xs font-semibold text-[#c8a45c]">{formatPrice(denom.price * quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
