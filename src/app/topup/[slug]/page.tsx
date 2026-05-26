"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { games, formatPrice } from "@/lib/games";
import type { Denomination } from "@/lib/games";
import CryptoPaymentSelector from "@/components/CryptoPaymentSelector";
import type { ChainId, TokenId } from "@/lib/crypto-payment";

// Game code mapping for check nickname
const GAME_CODES: Record<string, string> = {
  "mobile-legends": "ml",
  "mobile-legends-paket-irit": "ml",
  "mobile-legends-global": "ml",
  "magic-chess-go-go": "ml",
  "free-fire": "ff",
  "free-fire-max": "ff",
};

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
  const [nickname, setNickname] = useState<string | null>(null);
  const [nickLoading, setNickLoading] = useState(false);
  const [nickError, setNickError] = useState<string | null>(null);
  const [selectedDenom, setSelectedDenom] = useState<Denomination | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cryptoSelection, setCryptoSelection] = useState<{ chain: ChainId; token: TokenId } | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [activeTab, setActiveTab] = useState<"transaksi" | "keterangan">("transaksi");
  const [toast, setToast] = useState<string | null>(null);

  // Show toast notification
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Validate before selecting denomination
  const handleSelectDenom = (denom: Denomination) => {
    if (denom.comingSoon) return;
    if (!userId) {
      showToast("Silahkan isi data akun terlebih dahulu.");
      return;
    }
    setSelectedDenom(denom);
  };

  // Validate before selecting payment
  const handleSelectPayment = (methodId: string) => {
    if (!userId) {
      showToast("Silahkan isi data akun terlebih dahulu.");
      return;
    }
    if (!selectedDenom) {
      showToast("Silahkan pilih nominal terlebih dahulu.");
      return;
    }
    setPaymentMethod(methodId);
    if (methodId !== "crypto") {
      setCryptoSelection(null);
    }
  };

  // Check nickname function
  const checkNickname = useCallback(async (uid: string, sid: string) => {
    const gameCode = GAME_CODES[game.slug];
    if (!gameCode || !uid) return;

    const customerNo = sid ? `${uid}|${sid}` : uid;
    setNickLoading(true);
    setNickError(null);
    setNickname(null);

    try {
      const res = await fetch("/api/digiflazz/check-nickname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game_code: gameCode, customer_no: customerNo }),
      });
      const data = await res.json();

      if (data?.data?.status === "Gagal") {
        setNickError("ID tidak ditemukan");
      } else if (data?.data?.sn) {
        setNickname(data.data.sn);
      } else if (data?.data?.status === "Pending") {
        // Dev mode - no nickname returned but ID valid
        setNickname("✓ ID Valid");
      }
    } catch {
      setNickError("Gagal cek nickname");
    } finally {
      setNickLoading(false);
    }
  }, [game.slug]);

  const paymentMethods = [
    { id: "crypto", name: "Crypto", icon: "🪙", description: "USDT / USDC / SOL", fee: "+Rp3.000" },
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
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create",
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
    <div className="pb-20 sm:pb-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-lg">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">✕</span>
            <span className="text-sm text-gray-800 font-medium">{toast}</span>
          </div>
        </div>
      )}
      {/* Hero Banner - Full width, tall on desktop */}
      <div className="relative overflow-hidden aspect-[2.5/1] sm:aspect-[3/1] lg:aspect-[3.5/1] bg-[#1e1e1e]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1525] via-[#1a0f2e] to-[#0a1525]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
        {/* Banner decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#c8a45c]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
        </div>
        {/* Banner text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-[10px] sm:text-xs lg:text-sm text-[#c8a45c] font-medium tracking-wider uppercase mb-1">Top Up Diamond Kilat</p>
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-white">PROSES CEPAT!</h2>
            <p className="text-[10px] sm:text-xs text-[#999] mt-1">Hanya di NyinyiStore.com</p>
          </div>
        </div>
      </div>

      {/* Game Info - Overlapping banner */}
      <div className="mx-auto max-w-[1100px] px-3 sm:px-6 -mt-10 sm:-mt-14 relative z-10">
        <div className="flex items-end gap-3 sm:gap-5">
          <div className="h-20 w-20 sm:h-32 sm:w-32 lg:h-36 lg:w-36 flex-shrink-0 overflow-hidden rounded-xl border-3 border-[#2a2a2a] shadow-2xl bg-[#1e1e1e]">
            <img src={game.image} alt={game.name} className="h-full w-full object-cover" />
          </div>
          <div className="pb-1 sm:pb-2">
            {game.region && (
              <span className="inline-block rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white mb-1">{game.region}</span>
            )}
            <h1 className="text-sm sm:text-xl lg:text-2xl font-extrabold text-white leading-tight">
              {game.name.toUpperCase()}
            </h1>
            <p className="text-[11px] sm:text-xs text-[#999] mt-0.5">{game.developer}</p>
          </div>
        </div>
      </div>

      {/* Feature badges */}
      <div className="mx-auto max-w-[1100px] px-3 sm:px-6 mt-4">
        <div className="flex items-center gap-4 sm:gap-6 py-3 border-b border-[#2a2a2a]">
          <span className="text-[10px] sm:text-xs text-[#4caf50] flex items-center gap-1.5">⚡ Proses Cepat</span>
          <span className="text-[10px] sm:text-xs text-[#4caf50] flex items-center gap-1.5">💬 Layanan Chat 24/7</span>
          <span className="text-[10px] sm:text-xs text-[#4caf50] flex items-center gap-1.5">✅ Pembayaran Aman!</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mx-auto max-w-[1100px] px-3 sm:px-6 mt-4">
        <div className="flex rounded-lg bg-[#1e1e1e] border border-[#2a2a2a] p-1 max-w-[300px]">
          <button
            onClick={() => setActiveTab("transaksi")}
            className={`flex-1 rounded-md py-2 text-xs sm:text-sm font-medium transition-all ${
              activeTab === "transaksi"
                ? "bg-[#c8a45c] text-white shadow"
                : "text-[#999] hover:text-white"
            }`}
          >
            Transaksi
          </button>
          <button
            onClick={() => setActiveTab("keterangan")}
            className={`flex-1 rounded-md py-2 text-xs sm:text-sm font-medium transition-all ${
              activeTab === "keterangan"
                ? "bg-[#c8a45c] text-white shadow"
                : "text-[#999] hover:text-white"
            }`}
          >
            Keterangan
          </button>
        </div>
      </div>

      {/* Main Content - 2 column on desktop */}
      <div className="mx-auto max-w-[1100px] px-3 sm:px-6 mt-4">
        {activeTab === "transaksi" ? (
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Left Column - Form */}
            <div className="flex-1 space-y-4">
            {/* Step 1: Account Data */}
            <section className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-[#2a2a2a] bg-[#252525] px-3 sm:px-4 py-2.5 sm:py-3">
                <div className="step-number text-xs sm:text-sm">1</div>
                <h2 className="text-xs sm:text-sm font-semibold text-white">Masukkan Data Akun</h2>
              </div>
              <div className="p-3 sm:p-4">
                <div className={`grid ${game.needsServerId ? "grid-cols-2" : "grid-cols-1"} gap-2 sm:gap-3`}>
                  <div>
                    <label htmlFor="userId" className="mb-1 block text-[11px] sm:text-xs text-[#b0b0b0]">
                      {game.idLabel || "ID"}
                    </label>
                    <input
                      id="userId"
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      onBlur={() => { if (userId) checkNickname(userId, serverId); }}
                      placeholder={game.idPlaceholder || "Masukkan ID"}
                      className="w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2.5 text-sm text-white placeholder-[#666] focus:border-[#c8a45c] focus:outline-none focus:ring-1 focus:ring-[#c8a45c]"
                    />
                  </div>
                  {game.needsServerId && (
                  <div>
                    <label htmlFor="serverId" className="mb-1 block text-[11px] sm:text-xs text-[#b0b0b0]">
                      Server
                    </label>
                    <input
                      id="serverId"
                      type="text"
                      value={serverId}
                      onChange={(e) => setServerId(e.target.value)}
                      onBlur={() => { if (userId && serverId) checkNickname(userId, serverId); }}
                      placeholder="Server"
                      className="w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2.5 text-sm text-white placeholder-[#666] focus:border-[#c8a45c] focus:outline-none focus:ring-1 focus:ring-[#c8a45c]"
                    />
                  </div>
                  )}
                </div>
                {/* Nickname result */}
                {nickLoading && (
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-[#999]">
                    <span className="animate-pulse">⏳</span> Mengecek akun...
                  </div>
                )}
                {nickname && !nickLoading && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg bg-[#4caf50]/10 border border-[#4caf50]/30 px-3 py-1.5">
                    <span className="text-[11px] text-[#4caf50] font-medium">👤 {nickname}</span>
                  </div>
                )}
                {nickError && !nickLoading && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-1.5">
                    <span className="text-[11px] text-red-400 font-medium">❌ {nickError}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Step 2: Choose Nominal */}
            <section className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-[#2a2a2a] bg-[#252525] px-3 sm:px-4 py-2.5 sm:py-3">
                <div className="step-number text-xs sm:text-sm">2</div>
                <h2 className="text-xs sm:text-sm font-semibold text-white">Pilih Nominal</h2>
              </div>
              <div className="p-3 sm:p-4">
                {/* Special Items section - on top */}
                {game.denominations.some(d => d.amount.includes("Pass") || d.amount.includes("Special")) && (
                  <div className="mb-4">
                    <p className="text-[11px] sm:text-xs font-semibold text-[#999] uppercase tracking-wider mb-2">🎁 Spesial Item</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {game.denominations.filter(d => d.amount.includes("Pass") || d.amount.includes("Special")).map((denom) => (
                        <button
                          key={denom.amount}
                          onClick={() => handleSelectDenom(denom)}
                          disabled={denom.comingSoon}
                          className={`product-card rounded-lg border p-3 sm:p-4 text-left transition-all active:scale-[0.97] relative ${
                            denom.comingSoon
                              ? "border-[#2a2a2a] bg-[#1a1a1a] opacity-60 cursor-not-allowed"
                              : selectedDenom?.amount === denom.amount
                              ? "selected border-[#c8a45c] bg-[#c8a45c]/10"
                              : "border-[#3a3a3a] bg-[#252525] hover:border-[#555]"
                          }`}
                        >
                          {!denom.comingSoon && (
                            <span className="absolute top-1.5 right-1.5 flex items-center gap-0.5 rounded bg-[#4caf50]/15 px-1.5 py-0.5 text-[8px] font-bold text-[#4caf50]">
                              ⚡ Instan
                            </span>
                          )}
                          <div className="text-sm sm:text-base font-bold text-white leading-tight mt-4">🎁 {denom.label}</div>
                          <div className="mt-1.5 text-xs sm:text-sm font-semibold text-[#c8a45c]">{formatPrice(denom.price)}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Diamond items */}
                <p className="text-[11px] sm:text-xs font-semibold text-[#999] uppercase tracking-wider mb-2">Top Up Instan 🔥</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {game.denominations.filter(d => !d.amount.includes("Pass") && !d.amount.includes("Special")).map((denom) => (
                    <button
                      key={denom.amount}
                      onClick={() => handleSelectDenom(denom)}
                      disabled={denom.comingSoon}
                      className={`product-card rounded-lg border p-3 sm:p-4 text-left transition-all active:scale-[0.97] relative ${
                        denom.comingSoon
                          ? "border-[#2a2a2a] bg-[#1a1a1a] opacity-60 cursor-not-allowed"
                          : selectedDenom?.amount === denom.amount
                          ? "selected border-[#c8a45c] bg-[#c8a45c]/10"
                          : "border-[#3a3a3a] bg-[#252525] hover:border-[#555]"
                      }`}
                    >
                      {denom.comingSoon ? (
                        <span className="absolute top-1.5 right-1.5 rounded bg-[#c8a45c]/20 px-1.5 py-0.5 text-[8px] font-bold text-[#c8a45c]">
                          SOON
                        </span>
                      ) : (
                        <span className="absolute top-1.5 right-1.5 flex items-center gap-0.5 rounded bg-[#4caf50]/15 px-1.5 py-0.5 text-[8px] font-bold text-[#4caf50]">
                          ⚡ Instan
                        </span>
                      )}
                      <div className="text-sm sm:text-base font-bold text-white leading-tight mt-4">{denom.label}</div>
                      <div className="mt-1.5 text-xs sm:text-sm font-semibold text-[#c8a45c]">{formatPrice(denom.price)}</div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Step 3: Payment Method */}
            <section className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-[#2a2a2a] bg-[#252525] px-3 sm:px-4 py-2.5 sm:py-3">
                <div className="step-number text-xs sm:text-sm">3</div>
                <h2 className="text-xs sm:text-sm font-semibold text-white">Pilih Pembayaran</h2>
              </div>
              <div className="p-3 sm:p-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handleSelectPayment(method.id)}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all active:scale-[0.97] ${
                        paymentMethod === method.id
                          ? "border-[#c8a45c] bg-[#c8a45c]/10"
                          : "border-[#3a3a3a] bg-[#252525] hover:border-[#555]"
                      }`}
                    >
                      <span className="text-lg sm:text-xl">{method.icon}</span>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-white">{method.name}</div>
                        <div className="text-[10px] text-[#777]">{method.description}</div>
                      </div>
                      {method.id === "crypto" && selectedDenom && (
                        <span className="text-[10px] font-bold text-[#c8a45c]">
                          {formatPrice(selectedDenom.price + 3000)}
                        </span>
                      )}
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
              <div className="flex items-center gap-3 border-b border-[#2a2a2a] bg-[#252525] px-3 sm:px-4 py-2.5 sm:py-3">
                <div className="step-number text-xs sm:text-sm">4</div>
                <h2 className="text-xs sm:text-sm font-semibold text-white">Detail Kontak</h2>
              </div>
              <div className="p-3 sm:p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="mb-1 block text-[11px] sm:text-xs text-[#b0b0b0]">
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
                    <label htmlFor="phone" className="mb-1 block text-[11px] sm:text-xs text-[#b0b0b0]">
                      No. WhatsApp
                    </label>
                    <div className="flex">
                      <span className="flex items-center gap-1 rounded-l-lg border border-r-0 border-[#3a3a3a] bg-[#252525] px-2.5 text-xs text-[#999]">🇮🇩 +62</span>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="8XXXXXXXXXX"
                        className="w-full rounded-r-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2.5 text-sm text-white placeholder-[#666] focus:border-[#c8a45c] focus:outline-none focus:ring-1 focus:ring-[#c8a45c]"
                      />
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-[10px] text-[#c8a45c]">
                  Nomor ini akan dihubungi jika terjadi masalah
                </p>
              </div>
            </section>

            {/* Step 5: Promo Code */}
            <section className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-[#2a2a2a] bg-[#252525] px-3 sm:px-4 py-2.5 sm:py-3">
                <div className="step-number text-xs sm:text-sm">5</div>
                <h2 className="text-xs sm:text-sm font-semibold text-white">Kode Promo</h2>
              </div>
              <div className="p-3 sm:p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Ketik Kode Promo Kamu"
                    className="flex-1 rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2.5 text-sm text-white placeholder-[#666] focus:border-[#c8a45c] focus:outline-none focus:ring-1 focus:ring-[#c8a45c]"
                  />
                  <button className="rounded-lg border border-[#c8a45c] px-3 sm:px-4 py-2.5 text-xs font-medium text-[#c8a45c] transition-colors hover:bg-[#c8a45c] hover:text-white active:scale-[0.97]">
                    Gunakan
                  </button>
                </div>
                <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#3a3a3a] py-2.5 text-xs text-[#999] hover:border-[#c8a45c] hover:text-[#c8a45c] transition-colors">
                  🎟️ Pakai Promo Yang Tersedia
                </button>
              </div>
            </section>

            {/* Ulasan Section */}
            <section className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden">
              <div className="flex items-center gap-3 border-b border-[#2a2a2a] bg-[#252525] px-3 sm:px-4 py-2.5 sm:py-3">
                <span className="text-sm">⭐</span>
                <h2 className="text-xs sm:text-sm font-semibold text-white">Ulasan</h2>
              </div>
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl sm:text-3xl font-bold text-[#c8a45c]">4.99</span>
                  <div>
                    <div className="flex text-[#e8b730] text-sm">★★★★★</div>
                    <p className="text-[10px] text-[#777]">/ 5.0</p>
                  </div>
                </div>
                <p className="text-[11px] text-[#b0b0b0]">Pelanggan merasa puas dengan produk ini.</p>
                <p className="text-[10px] text-[#777] mt-1">Dari 8.53jt ulasan.</p>
                <div className="mt-3 space-y-1.5">
                  {[
                    { star: 5, count: "8.52jt", pct: 99 },
                    { star: 4, count: "6.1rb", pct: 8 },
                    { star: 3, count: "1.2rb", pct: 3 },
                    { star: 2, count: "340", pct: 1 },
                    { star: 1, count: "89", pct: 0.5 },
                  ].map((r) => (
                    <div key={r.star} className="flex items-center gap-2">
                      <span className="text-[10px] text-[#999] w-3">{r.star}</span>
                      <span className="text-[10px] text-[#e8b730]">★</span>
                      <div className="flex-1 h-1.5 rounded-full bg-[#2a2a2a] overflow-hidden">
                        <div className="h-full rounded-full bg-[#c8a45c]" style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className="text-[10px] text-[#777] w-10 text-right">{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Desktop Order Button */}
            <div className="hidden sm:block">
              <button
                onClick={handleOrder}
                disabled={!userId || !selectedDenom || !paymentMethod || isOrdering || (paymentMethod === "crypto" && !cryptoSelection)}
                className="btn-gold w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isOrdering ? "Processing..." : "🛒 Pesan Sekarang!"}
              </button>
            </div>
            </div>

            {/* Right Column - Rating (desktop only) */}
            <div className="hidden lg:block w-[320px] flex-shrink-0">
              <div className="sticky top-4 space-y-4">
                {/* Rating Card */}
                <div className="rounded-xl border border-[#c8a45c]/30 bg-[#1e1e1e] p-5">
                  <h3 className="text-sm font-semibold text-white mb-3">Ulasan dan rating</h3>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl font-bold text-white">4.99</span>
                    <div>
                      <div className="flex text-[#FFD700] text-lg">★★★★★</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#999]">Berdasarkan total 1.25jt rating</p>
                  <div className="mt-4 space-y-2">
                    {[
                      { star: 5, pct: 99 },
                      { star: 4, pct: 8 },
                      { star: 3, pct: 3 },
                      { star: 2, pct: 1 },
                      { star: 1, pct: 0.5 },
                    ].map((r) => (
                      <div key={r.star} className="flex items-center gap-2">
                        <span className="text-[11px] text-[#999] w-3">{r.star}</span>
                        <span className="text-[11px] text-[#FFD700]">★</span>
                        <div className="flex-1 h-2 rounded-full bg-[#2a2a2a] overflow-hidden">
                          <div className="h-full rounded-full bg-[#c8a45c]" style={{ width: `${r.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary Card */}
                {selectedDenom && (
                  <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-5">
                    <h3 className="text-sm font-semibold text-white mb-3">Ringkasan</h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#999]">Game</span>
                        <span className="text-white">{game.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#999]">Item</span>
                        <span className="text-white">{selectedDenom.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#999]">Harga</span>
                        <span className="text-white">{formatPrice(selectedDenom.price)}</span>
                      </div>
                      {paymentMethod === "crypto" && (
                        <div className="flex justify-between">
                          <span className="text-[#999]">Biaya Crypto</span>
                          <span className="text-white">{formatPrice(3000)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-[#2a2a2a] pt-2 mt-2">
                        <span className="text-[#999]">Total</span>
                        <span className="text-[#c8a45c] font-bold">
                          {formatPrice(paymentMethod === "crypto" ? selectedDenom.price + 3000 : selectedDenom.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Keterangan Tab */
          <div className="space-y-4">
            <section className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden">
              <div className="flex items-center gap-2 border-b border-[#2a2a2a] bg-[#252525] px-3 sm:px-4 py-2.5 sm:py-3">
                <div className="w-1 h-4 rounded bg-[#c8a45c]" />
                <h2 className="text-xs sm:text-sm font-semibold text-white">Deskripsi {game.name}</h2>
              </div>
              <div className="p-3 sm:p-4 text-xs sm:text-sm text-[#b0b0b0] leading-relaxed space-y-3">
                <p>Top up {game.name} harga paling murah. Cara topup:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] sm:text-xs text-[#999]">
                  <li>Masukkan Data Akun</li>
                  <li>Pilih Nominal</li>
                  <li>Masukkan jumlah</li>
                  <li>Pilih Pembayaran</li>
                  <li>Tulis Kode Promo (jika ada)</li>
                  <li>Masukkan No WhatsApp</li>
                  <li>Klik Order Now & lakukan Pembayaran</li>
                  <li>Produk otomatis masuk ke akun game anda</li>
                </ol>
              </div>
            </section>

            {/* Ulasan in Keterangan tab too */}
            <section className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden">
              <div className="flex items-center gap-2 border-b border-[#2a2a2a] bg-[#252525] px-3 sm:px-4 py-2.5 sm:py-3">
                <div className="w-1 h-4 rounded bg-[#c8a45c]" />
                <h2 className="text-xs sm:text-sm font-semibold text-white">Ulasan</h2>
              </div>
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-[#c8a45c]">4.99</span>
                  <div>
                    <div className="flex text-[#e8b730] text-sm">★★★★★</div>
                    <p className="text-[10px] text-[#777]">/ 5.0 dari 8.53jt ulasan</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden border-t border-[#2a2a2a] bg-[#1a1a1a]/95 backdrop-blur-md">
        <div className="flex items-center gap-3 px-3 py-2.5">
          {/* Selected item preview */}
          <div className="flex-1 min-w-0">
            {selectedDenom ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg border border-[#3a3a3a]">
                  <img src={game.image} alt={game.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-white truncate">{game.name}</p>
                  <p className="text-[10px] text-[#c8a45c] truncate">{selectedDenom.label}</p>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-[#777]">Pilih item terlebih dahulu</p>
            )}
          </div>
          {/* Order button */}
          <button
            onClick={handleOrder}
            disabled={!userId || !selectedDenom || !paymentMethod || isOrdering || (paymentMethod === "crypto" && !cryptoSelection)}
            className="flex-shrink-0 rounded-lg bg-gradient-to-r from-[#a0833a] to-[#c8a45c] px-4 py-2.5 text-xs font-semibold text-white shadow disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] transition-transform"
          >
            {isOrdering ? "..." : "Pesan Sekarang!"}
          </button>
        </div>
      </div>
    </div>
  );
}
