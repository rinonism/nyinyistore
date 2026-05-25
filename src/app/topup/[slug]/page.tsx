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
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);

  const paymentMethods = [
    { id: "crypto", name: "Crypto", icon: "🪙", description: "USDT / USDC / SOL" },
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

        router.push(`/checkout/${data.order_id}`);
      } catch {
        alert("Gagal membuat order. Coba lagi.");
      } finally {
        setIsOrdering(false);
      }
      return;
    }

    alert(
      `Order berhasil!\n\nGame: ${game.name}\nUser ID: ${userId}${serverId ? ` (${serverId})` : ""}\nItem: ${selectedDenom.amount}\nHarga: ${formatPrice(selectedDenom.price)}\nPembayaran: ${paymentMethod.toUpperCase()}`
    );
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6">
      {/* Hero Banner */}
      <div className="relative mb-6 overflow-hidden rounded-xl aspect-[3/1] bg-[#1e1e1e]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0f00] via-[#0a1525] to-[#1a0f00]" />
        <div className="absolute inset-0 flex items-center justify-between px-8">
          <div>
            <h1 className="text-xl md:text-3xl font-extrabold text-white">
              TOP UP <span className="text-[#c8a45c]">{game.name.toUpperCase()}</span>
            </h1>
            <p className="mt-1 text-sm text-[#b0b0b0]">Proses Cepat • Harga Termurah</p>
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-4">
        <div className="h-16 w-16 overflow-hidden rounded-xl border border-[#3a3a3a]">
          <img src={game.image} alt={game.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{game.name}</h2>
          <p className="text-xs text-[#777]">{game.description}</p>
          <div className="mt-1.5 flex items-center gap-3">
            <span className="text-[10px] text-[#4caf50]">⚡ Proses Cepat</span>
            <span className="text-[10px] text-[#4caf50]">🟢 Layanan Chat 24/7</span>
            <span className="text-[10px] text-[#4caf50]">✓ Pembayaran Aman!</span>
          </div>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        {/* Left Column - Form */}
        <div className="space-y-5">
          {/* Step 1: Account Data */}
          <section className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden">
            <div className="flex items-center gap-3 border-b border-[#2a2a2a] bg-[#252525] px-4 py-3">
              <div className="step-number">1</div>
              <h2 className="text-sm font-semibold text-white">Masukkan Data Akun</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="userId" className="mb-1 block text-xs text-[#b0b0b0]">
                    ID
                  </label>
                  <input
                    id="userId"
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Masukkan ID"
                    className="w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2.5 text-sm text-white placeholder-[#666] focus:border-[#c8a45c] focus:outline-none focus:ring-1 focus:ring-[#c8a45c]"
                  />
                </div>
                <div>
                  <label htmlFor="serverId" className="mb-1 block text-xs text-[#b0b0b0]">
                    Server
                  </label>
                  <input
                    id="serverId"
                    type="text"
                    value={serverId}
                    onChange={(e) => setServerId(e.target.value)}
                    placeholder="Masukkan Server"
                    className="w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2.5 text-sm text-white placeholder-[#666] focus:border-[#c8a45c] focus:outline-none focus:ring-1 focus:ring-[#c8a45c]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Step 2: Choose Nominal */}
          <section className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden">
            <div className="flex items-center gap-3 border-b border-[#2a2a2a] bg-[#252525] px-4 py-3">
              <div className="step-number">2</div>
              <h2 className="text-sm font-semibold text-white">Pilih Nominal</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {game.denominations.map((denom) => (
                  <button
                    key={denom.amount}
                    onClick={() => setSelectedDenom(denom)}
                    className={`product-card rounded-lg border p-3 text-left transition-all ${
                      selectedDenom?.amount === denom.amount
                        ? "selected border-[#c8a45c] bg-[#c8a45c]/10"
                        : "border-[#3a3a3a] bg-[#252525] hover:border-[#555]"
                    }`}
                  >
                    <div className="text-xs font-medium text-white">{denom.label}</div>
                    <div className="mt-1 text-xs font-semibold text-[#c8a45c]">{formatPrice(denom.price)}</div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Step 3: Payment Method */}
          <section className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden">
            <div className="flex items-center gap-3 border-b border-[#2a2a2a] bg-[#252525] px-4 py-3">
              <div className="step-number">3</div>
              <h2 className="text-sm font-semibold text-white">Pilih Pembayaran</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setPaymentMethod(method.id);
                      if (method.id !== "crypto") {
                        setCryptoSelection(null);
                      }
                    }}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                      paymentMethod === method.id
                        ? "border-[#c8a45c] bg-[#c8a45c]/10"
                        : "border-[#3a3a3a] bg-[#252525] hover:border-[#555]"
                    }`}
                  >
                    <span className="text-xl">{method.icon}</span>
                    <div>
                      <div className="text-xs font-medium text-white">{method.name}</div>
                      <div className="text-[10px] text-[#777]">{method.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              {paymentMethod === "crypto" && (
                <div className="mt-3">
                  <CryptoPaymentSelector
                    priceIdr={selectedDenom?.price || 0}
                    onSelect={handleCryptoSelect}
                    selected={cryptoSelection}
                  />
                </div>
              )}
            </div>
          </section>

          {/* Step 4: Contact Details */}
          <section className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden">
            <div className="flex items-center gap-3 border-b border-[#2a2a2a] bg-[#252525] px-4 py-3">
              <div className="step-number">4</div>
              <h2 className="text-sm font-semibold text-white">Detail Kontak</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="mb-1 block text-xs text-[#b0b0b0]">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2.5 text-sm text-white placeholder-[#666] focus:border-[#c8a45c] focus:outline-none focus:ring-1 focus:ring-[#c8a45c]"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1 block text-xs text-[#b0b0b0]">
                    No. WhatsApp
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="628XXXXXXXXXX"
                    className="w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2.5 text-sm text-white placeholder-[#666] focus:border-[#c8a45c] focus:outline-none focus:ring-1 focus:ring-[#c8a45c]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Step 5: Promo Code */}
          <section className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden">
            <div className="flex items-center gap-3 border-b border-[#2a2a2a] bg-[#252525] px-4 py-3">
              <div className="step-number">5</div>
              <h2 className="text-sm font-semibold text-white">Kode Promo</h2>
            </div>
            <div className="p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Ketik Kode Promo Kamu"
                  className="flex-1 rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2.5 text-sm text-white placeholder-[#666] focus:border-[#c8a45c] focus:outline-none focus:ring-1 focus:ring-[#c8a45c]"
                />
                <button className="rounded-lg border border-[#c8a45c] px-4 py-2.5 text-xs font-medium text-[#c8a45c] transition-colors hover:bg-[#c8a45c] hover:text-white">
                  Gunakan
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-4">
          {/* Rating */}
          <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-4">
            <p className="text-xs font-medium text-[#c8a45c] mb-2">Ulasan dan rating</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">4.99</span>
              <div className="flex text-[#e8b730]">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i} className="text-sm">{s}</span>
                ))}
              </div>
            </div>
            <p className="mt-1 text-[10px] text-[#777]">Berdasarkan total 8.53jt rating</p>
          </div>

          {/* Help */}
          <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-4">
            <p className="text-xs font-medium text-white mb-1">Butuh Bantuan?</p>
            <p className="text-[10px] text-[#777]">Kamu bisa hubungi admin disini.</p>
            <button className="mt-2 w-full rounded-lg border border-[#3a3a3a] bg-[#252525] px-3 py-2 text-xs text-[#ccc] hover:border-[#c8a45c] hover:text-[#c8a45c] transition-colors">
              💬 Chat Admin
            </button>
          </div>

          {/* Order Summary */}
          <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-4">
            {selectedDenom ? (
              <div>
                <p className="text-xs text-[#777] mb-2">Item dipilih:</p>
                <div className="rounded-lg bg-[#252525] border border-[#3a3a3a] p-3 mb-3">
                  <p className="text-xs font-medium text-white">{selectedDenom.label}</p>
                  <p className="text-sm font-bold text-[#c8a45c] mt-1">{formatPrice(selectedDenom.price)}</p>
                  {paymentMethod === "crypto" && cryptoSelection && (
                    <p className="text-[10px] text-[#4caf50] mt-0.5">
                      ≈ {(selectedDenom.price / 16300).toFixed(2)} {cryptoSelection.token.toUpperCase()}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#777] text-center py-4">
                Belum ada item produk yang dipilih.
              </p>
            )}

            {/* Order Button */}
            <button
              onClick={handleOrder}
              disabled={!userId || !selectedDenom || !paymentMethod || isOrdering || (paymentMethod === "crypto" && !cryptoSelection)}
              className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOrdering ? "Processing..." : "Pesan Sekarang!"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
