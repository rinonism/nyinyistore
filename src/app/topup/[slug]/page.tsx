"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { games, formatPrice } from "@/lib/games";
import type { Denomination } from "@/lib/games";
import CryptoPaymentSelector from "@/components/CryptoPaymentSelector";
import type { ChainId, TokenId } from "@/lib/crypto-payment";

interface TopUpPageProps {
  params: { slug: string };
}

export default function TopUpPage({ params }: TopUpPageProps) {
  const router = useRouter();
  const game = games.find((g) => g.slug === params.slug);

  if (!game) {
    notFound();
  }

  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [selectedDenom, setSelectedDenom] = useState<Denomination | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cryptoSelection, setCryptoSelection] = useState<{ chain: ChainId; token: TokenId } | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);

  const paymentMethods = [
    { id: "crypto", name: "Crypto", icon: "🪙", description: "USDT / USDC" },
    { id: "qris", name: "QRIS", icon: "📱", description: "Scan QR Code" },
    { id: "bank", name: "Bank Transfer", icon: "🏦", description: "BCA, Mandiri, BNI" },
  ];

  const handleCryptoSelect = (chain: ChainId, token: TokenId) => {
    setCryptoSelection({ chain, token });
    setPaymentMethod("crypto");
  };

  const handleOrder = async () => {
    if (!userId || !selectedDenom || !paymentMethod) {
      alert("Mohon lengkapi semua field!");
      return;
    }

    // For crypto payments, redirect to checkout
    if (paymentMethod === "crypto") {
      if (!cryptoSelection) {
        alert("Pilih network dan token terlebih dahulu!");
        return;
      }

      setIsOrdering(true);
      try {
        const res = await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            game_slug: game.slug,
            denomination_id: selectedDenom.amount,
            user_id: userId,
            server_id: serverId || undefined,
            payment_chain: cryptoSelection.chain,
            payment_token: cryptoSelection.token,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          alert(data.error || "Failed to create order");
          return;
        }

        // Redirect to checkout page
        router.push(`/checkout/${data.order_id}`);
      } catch {
        alert("Gagal membuat order. Coba lagi.");
      } finally {
        setIsOrdering(false);
      }
      return;
    }

    // For other payment methods (placeholder)
    alert(
      `Order berhasil!\n\nGame: ${game.name}\nUser ID: ${userId}${serverId ? ` (${serverId})` : ""}\nItem: ${selectedDenom.amount}\nHarga: ${formatPrice(selectedDenom.price)}\nPembayaran: ${paymentMethod.toUpperCase()}`
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Game Header */}
      <div className="mb-8 flex items-center gap-4">
        <span className="text-5xl">{game.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{game.name}</h1>
          <p className="text-gray-400">{game.description}</p>
        </div>
      </div>

      {/* User ID Input */}
      <section className="mb-8 rounded-xl border border-gray-700 bg-gray-800 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">
          1. Masukkan Data Akun
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="userId" className="mb-1 block text-sm text-gray-300">
              User ID
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Masukkan User ID"
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-white placeholder-gray-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          <div>
            <label htmlFor="serverId" className="mb-1 block text-sm text-gray-300">
              Server ID (opsional)
            </label>
            <input
              id="serverId"
              type="text"
              value={serverId}
              onChange={(e) => setServerId(e.target.value)}
              placeholder="Masukkan Server ID"
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-white placeholder-gray-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
        </div>
      </section>

      {/* Denomination Grid */}
      <section className="mb-8 rounded-xl border border-gray-700 bg-gray-800 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">
          2. Pilih Nominal
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {game.denominations.map((denom) => (
            <button
              key={denom.amount}
              onClick={() => setSelectedDenom(denom)}
              className={`rounded-lg border p-4 text-left transition-all ${
                selectedDenom?.amount === denom.amount
                  ? "border-violet-500 bg-violet-500/20 shadow-lg shadow-violet-500/10"
                  : "border-gray-600 bg-gray-700 hover:border-gray-500"
              }`}
            >
              <div className="text-sm font-medium text-white">{denom.label}</div>
              <div className="mt-1 text-xs text-gray-400">{formatPrice(denom.price)}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Payment Method */}
      <section className="mb-8 rounded-xl border border-gray-700 bg-gray-800 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">
          3. Metode Pembayaran
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => {
                setPaymentMethod(method.id);
                if (method.id !== "crypto") {
                  setCryptoSelection(null);
                }
              }}
              className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                paymentMethod === method.id
                  ? "border-violet-500 bg-violet-500/20 shadow-lg shadow-violet-500/10"
                  : "border-gray-600 bg-gray-700 hover:border-gray-500"
              }`}
            >
              <span className="text-2xl">{method.icon}</span>
              <div>
                <div className="text-sm font-medium text-white">{method.name}</div>
                <div className="text-xs text-gray-400">{method.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Crypto Selector - shown when crypto is selected */}
        {paymentMethod === "crypto" && (
          <div className="mt-4">
            <CryptoPaymentSelector
              priceIdr={selectedDenom?.price || 0}
              onSelect={handleCryptoSelect}
              selected={cryptoSelection}
            />
          </div>
        )}
      </section>

      {/* Order Summary & Button */}
      <section className="rounded-xl border border-gray-700 bg-gray-800 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Pembayaran</p>
            <p className="text-2xl font-bold text-white">
              {selectedDenom ? formatPrice(selectedDenom.price) : "Rp 0"}
            </p>
            {selectedDenom && paymentMethod === "crypto" && cryptoSelection && (
              <p className="text-sm text-violet-400">
                ≈ {(selectedDenom.price / 16300).toFixed(2)} {cryptoSelection.token.toUpperCase()}
              </p>
            )}
          </div>
          <button
            onClick={handleOrder}
            disabled={!userId || !selectedDenom || !paymentMethod || isOrdering || (paymentMethod === "crypto" && !cryptoSelection)}
            className="rounded-lg bg-violet-600 px-8 py-3 font-semibold text-white transition-all hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isOrdering ? "Processing..." : "🛒 Order Sekarang"}
          </button>
        </div>
      </section>
    </div>
  );
}
