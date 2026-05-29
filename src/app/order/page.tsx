"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

interface Order {
  order_id: string;
  game_name: string;
  item_name: string;
  price_idr: number;
  price_crypto: number;
  crypto_token: string;
  crypto_chain: string;
  payment_wallet: string;
  user_game_id: string;
  user_server_id: string | null;
  status: string;
  created_at: string;
  paid_at: string | null;
  completed_at: string | null;
  expires_at: string;
  digiflazz_sn: string | null;
  game_slug: string;
}

const statusMap: Record<string, { label: string; color: string; icon: string; bg: string }> = {
  pending: { label: "Menunggu Pembayaran", color: "#f59e0b", icon: "⏳", bg: "from-amber-500/10 to-transparent" },
  paid: { label: "Pembayaran Diterima", color: "#3b82f6", icon: "✅", bg: "from-blue-500/10 to-transparent" },
  processing: { label: "Sedang Diproses", color: "#8b5cf6", icon: "⚙️", bg: "from-purple-500/10 to-transparent" },
  completed: { label: "Selesai", color: "#4caf50", icon: "🎉", bg: "from-green-500/10 to-transparent" },
  failed: { label: "Gagal", color: "#ef4444", icon: "❌", bg: "from-red-500/10 to-transparent" },
  expired: { label: "Expired", color: "#6b7280", icon: "⏰", bg: "from-gray-500/10 to-transparent" },
};

export default function OrderStatusPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[480px] px-4 py-10 text-center text-white">Loading...</div>}>
      <OrderStatusContent />
    </Suspense>
  );
}

function OrderStatusContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [verifying, setVerifying] = useState(false);

  const copyToClipboard = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const verifyPayment = async () => {
    if (!order || verifying) return;
    setVerifying(true);
    try {
      const res = await fetch(`/api/order/verify-crypto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: order.order_id }),
      });
      const data = await res.json();
      if (data.status && data.status !== "pending") {
        setOrder({ ...order, status: data.status });
      } else if (data.status === "pending") {
        // Still pending, show message
        alert("Pembayaran belum terdeteksi. Pastikan kamu sudah mengirim dengan nominal dan network yang tepat.");
      }
    } catch {
      alert("Gagal mengecek pembayaran. Coba lagi.");
    } finally {
      setVerifying(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (!order || order.status !== "pending" || !order.expires_at) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const expires = new Date(order.expires_at).getTime();
      const diff = Math.floor((expires - now) / 1000);
      setTimeLeft(diff);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [order]);

  const checkOrder = async (id?: string) => {
    const checkId = id || orderId.trim();
    if (!checkId) return;
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(`/api/order/status?id=${encodeURIComponent(checkId)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Order tidak ditemukan");
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Gagal mengecek order. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setOrderId(id);
      checkOrder(id);
    }
  }, [searchParams]);

  const formatPrice = (price: number) => `Rp ${price.toLocaleString("id-ID")}`;
  const formatDate = (date: string) => new Date(date).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });

  const status = order ? statusMap[order.status] || statusMap.pending : null;

  return (
    <div className="mx-auto max-w-[480px] px-4 py-8">
      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1e1e1e] p-8 text-center">
          <div className="animate-pulse text-2xl mb-2">⏳</div>
          <p className="text-sm text-[#999]">Memuat order...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-500/5 to-transparent p-6 text-center">
          <p className="text-3xl mb-2">😵</p>
          <p className="text-sm text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* Order Result */}
      {order && status && (
        <div className="space-y-4">
          {/* Status Card */}
          <div className={`rounded-2xl border border-[#2a2a2a] bg-gradient-to-b ${status.bg} bg-[#1e1e1e] overflow-hidden`}>
            {/* Status Header */}
            <div className="px-5 pt-5 pb-4 text-center">
              <div className="text-4xl mb-2">{status.icon}</div>
              <p className="text-base font-bold" style={{ color: status.color }}>{status.label}</p>
              {order.status === "pending" && timeLeft !== null && (
                <div className="mt-2 inline-flex items-center gap-1.5 bg-[#1a1a1a] border border-[#333] rounded-full px-3 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className={`text-xs font-mono font-semibold ${timeLeft <= 300 ? "text-red-400" : "text-[#ccc]"}`}>
                    {timeLeft <= 0 ? "Expired" : `${Math.floor(timeLeft / 60).toString().padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`}
                  </span>
                </div>
              )}
            </div>

            {/* Progress Steps */}
            <div className="px-6 pb-5">
              {(() => {
                const steps = [
                  { key: "pending", label: "Menunggu", icon: "⏳" },
                  { key: "paid", label: "Dibayar", icon: "✅" },
                  { key: "processing", label: "Diproses", icon: "⚙️" },
                  { key: "completed", label: "Selesai", icon: "🎉" },
                ];
                const failedStates = ["failed", "expired"];
                const isFailed = failedStates.includes(order.status);
                const currentIdx = isFailed ? -1 : steps.findIndex(s => s.key === order.status);

                return (
                  <div className="relative flex items-start justify-between">
                    {/* Connector line background */}
                    <div className="absolute top-[16px] left-[32px] right-[32px] h-[2px] bg-[#2a2a2a] rounded-full" />
                    {/* Connector line progress - animated */}
                    {currentIdx > 0 && (
                      <div
                        className="absolute top-[16px] left-[32px] h-[2px] rounded-full bg-gradient-to-r from-[#d4af37] to-[#f5d76e] transition-all duration-1000 ease-out"
                        style={{ width: `${(currentIdx / (steps.length - 1)) * (100 - (64 / 3.6))}%` }}
                      />
                    )}
                    {/* Shimmer on active progress line */}
                    {currentIdx > 0 && currentIdx < steps.length - 1 && (
                      <div
                        className="absolute top-[15px] left-[32px] h-[4px] rounded-full opacity-30 animate-pulse bg-gradient-to-r from-transparent via-[#f5d76e] to-transparent transition-all duration-1000"
                        style={{ width: `${(currentIdx / (steps.length - 1)) * (100 - (64 / 3.6))}%` }}
                      />
                    )}
                    {steps.map((step, i) => (
                      <div key={step.key} className="relative z-10 flex flex-col items-center w-16">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-500 ${
                            isFailed
                              ? "bg-[#1a1a1a] border border-[#333] text-[#555]"
                              : i < currentIdx
                              ? "bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/25"
                              : i === currentIdx
                              ? "bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/40 animate-pulse"
                              : "bg-[#1a1a1a] border border-[#333] text-[#555]"
                          }`}
                        >
                          {step.icon}
                        </div>
                        <span className={`text-[9px] mt-1.5 text-center leading-tight font-medium transition-all duration-500 ${
                          isFailed
                            ? "text-[#555]"
                            : i <= currentIdx
                            ? "text-[#d4af37]"
                            : "text-[#555]"
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Order Details Card */}
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1e1e1e] p-5">
            <p className="text-[10px] uppercase tracking-wider text-[#666] font-semibold mb-3">Detail Order</p>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#888]">Order ID</span>
                <button
                  onClick={() => copyToClipboard(order.order_id, setCopied)}
                  className="flex items-center gap-1.5 text-xs text-white font-mono hover:text-[#d4af37] transition-colors"
                >
                  {order.order_id}
                  <span className="text-[10px] opacity-60">{copied ? "✓" : "📋"}</span>
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#888]">Game</span>
                <span className="text-xs text-white font-medium">{order.game_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#888]">Item</span>
                <span className="text-xs text-white font-medium">{order.item_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#888]">User ID</span>
                <span className="text-xs text-white font-mono">{order.user_game_id}{order.user_server_id ? ` (${order.user_server_id})` : ""}</span>
              </div>
              <div className="h-px bg-[#2a2a2a] my-1" />
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#888]">Harga</span>
                <span className="text-sm text-[#d4af37] font-bold">{formatPrice(order.price_idr)}</span>
              </div>
              {order.price_crypto && (
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#888]">Crypto</span>
                  <span className="text-xs text-white font-mono">{order.price_crypto} {order.crypto_token.toUpperCase()} ({order.crypto_chain.toUpperCase()})</span>
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="mt-4 pt-3 border-t border-[#2a2a2a] space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[#666]">Dibuat</span>
                <span className="text-[10px] text-[#888]">{formatDate(order.created_at)}</span>
              </div>
              {order.paid_at && (
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#666]">Dibayar</span>
                  <span className="text-[10px] text-[#4caf50]">{formatDate(order.paid_at)}</span>
                </div>
              )}
              {order.completed_at && (
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#666]">Selesai</span>
                  <span className="text-[10px] text-[#4caf50]">{formatDate(order.completed_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Section - only for pending */}
          {order.status === "pending" && order.payment_wallet && (
            <div className="rounded-2xl border border-[#2a2a2a] bg-[#1e1e1e] p-5 space-y-4">
              <p className="text-[10px] uppercase tracking-wider text-[#666] font-semibold">Pembayaran</p>

              {/* Amount to pay */}
              <div className="flex justify-between items-center bg-[#141414] rounded-xl px-4 py-3 border border-[#2a2a2a]">
                <div className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#26A17B"/><path d="M17.9 17.1v-.002c-.1.008-1 .06-2.8.06-1.5 0-2.5-.045-2.8-.058v.002C9.1 16.8 7 16.3 7 15.7s2.1-1.1 5.3-1.3v2.1c.3.02 1.3.07 2.8.07 1.9 0 2.7-.06 2.8-.07v-2.1c3.2.2 5.3.7 5.3 1.3s-2.1 1.1-5.3 1.4zm0-2.8v-1.9h4.6v-3h-13v3h4.6v1.9C8.5 14.5 6 15.2 6 16s2.5 1.5 6.5 1.7v6.1h2.9v-6.1c4-.2 6.5-.9 6.5-1.7s-2.5-1.5-6.5-1.7z" fill="#fff"/></svg>
                  <div>
                    <p className="text-sm text-white font-bold font-mono">{order.price_crypto} {order.crypto_token.toUpperCase()}</p>
                    <p className="text-[9px] text-[#888]">{order.crypto_chain.toUpperCase()}</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(String(order.price_crypto), setCopiedAmount)}
                  className="text-[10px] bg-[#2a2a2a] hover:bg-[#333] text-[#ccc] px-2.5 py-1 rounded-lg transition-colors"
                >
                  {copiedAmount ? "Copied ✓" : "Copy"}
                </button>
              </div>

              {/* QR Code */}
              <div className="text-center">
                <p className="text-[11px] text-[#888] mb-3">Scan atau copy alamat di bawah</p>
                <div className="inline-block bg-white p-3 rounded-xl shadow-lg">
                  <QRCodeSVG value={order.payment_wallet} size={150} />
                </div>
              </div>

              {/* Wallet Address */}
              <div className="bg-[#141414] rounded-xl px-4 py-3 border border-[#2a2a2a]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] text-[#666] uppercase tracking-wider">{order.crypto_token.toUpperCase()} ({order.crypto_chain.toUpperCase()})</span>
                  <button
                    onClick={() => copyToClipboard(order.payment_wallet, setCopiedWallet)}
                    className="text-[10px] bg-[#2a2a2a] hover:bg-[#333] text-[#ccc] px-2.5 py-1 rounded-lg transition-colors"
                  >
                    {copiedWallet ? "Copied ✓" : "Copy"}
                  </button>
                </div>
                <p className="text-[11px] text-white font-mono break-all leading-relaxed">{order.payment_wallet}</p>
              </div>

              {/* Panduan */}
              <div className="bg-[#0d0d0d] rounded-xl p-4 border border-[#222]">
                <p className="text-[11px] text-[#d4af37] font-semibold mb-2.5">📖 Panduan Pembayaran</p>
                <ol className="text-[10px] text-[#999] space-y-2 list-decimal list-inside leading-relaxed">
                  <li>Copy alamat wallet atau scan QR code di atas</li>
                  <li>Buka aplikasi wallet kamu ({order.crypto_chain.toLowerCase() === "solana" ? "Phantom, Solflare, dll" : "MetaMask, Trust Wallet, dll"})</li>
                  <li>Pastikan pilih network <span className="text-white font-semibold">{order.crypto_chain.toUpperCase()}</span></li>
                  <li>Kirim <span className="text-[#d4af37] font-semibold">{order.price_crypto} {order.crypto_token.toUpperCase()}</span> (nominal harus tepat)</li>
                  <li>Tunggu konfirmasi — status otomatis update dalam 1-3 menit</li>
                </ol>
                <div className="mt-3 pt-2.5 border-t border-[#222]">
                  <p className="text-[9px] text-red-400/80">⚠️ Kirim hanya {order.crypto_token.toUpperCase()} di network {order.crypto_chain.toUpperCase()}. Token atau network salah = dana hilang.</p>
                </div>
                {/* Confirm payment button */}
                <button
                  onClick={verifyPayment}
                  disabled={verifying}
                  className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-black text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifying ? "⏳ Mengecek..." : "✅ Sudah Bayar? Cek Sekarang"}
                </button>
              </div>
            </div>
          )}

          {/* Completed Section */}
          {order.status === "completed" && (
            <div className="rounded-2xl border border-green-500/20 bg-gradient-to-b from-green-500/5 to-[#1e1e1e] p-5 space-y-4">
              {/* Confetti header */}
              <div className="text-center">
                <div className="text-3xl mb-1 animate-bounce">🎊</div>
                <p className="text-sm font-bold text-[#4caf50]">Transaksi Berhasil!</p>
                <p className="text-[10px] text-[#888] mt-1">Diamond sudah masuk ke akun kamu</p>
              </div>

              {/* Serial Number / Voucher */}
              {order.digiflazz_sn && (
                <div className="bg-[#141414] rounded-xl px-4 py-3 border border-green-500/20">
                  <p className="text-[9px] text-[#666] uppercase tracking-wider mb-1">Serial Number</p>
                  <p className="text-xs text-white font-mono font-semibold">{order.digiflazz_sn}</p>
                </div>
              )}

              {/* Receipt summary */}
              <div className="bg-[#141414] rounded-xl p-4 border border-[#2a2a2a] space-y-2">
                <p className="text-[9px] text-[#666] uppercase tracking-wider mb-2">Bukti Transaksi</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#888]">Game</span>
                  <span className="text-[10px] text-white">{order.game_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#888]">Item</span>
                  <span className="text-[10px] text-white">{order.item_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#888]">User ID</span>
                  <span className="text-[10px] text-white font-mono">{order.user_game_id}{order.user_server_id ? ` (${order.user_server_id})` : ""}</span>
                </div>
                <div className="h-px bg-[#2a2a2a]" />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#888]">Total</span>
                  <span className="text-xs text-[#4caf50] font-bold">{formatPrice(order.price_idr)}</span>
                </div>
                {order.completed_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#888]">Waktu</span>
                    <span className="text-[10px] text-[#999]">{formatDate(order.completed_at)}</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <a
                  href={`/topup/${order.game_slug}`}
                  className="flex-1 text-center bg-[#d4af37] hover:bg-[#e6c04a] text-black text-xs font-bold py-3 rounded-xl transition-colors"
                >
                  🔄 Order Lagi
                </a>
                <a
                  href="/"
                  className="flex-1 text-center bg-[#2a2a2a] hover:bg-[#333] text-white text-xs font-medium py-3 rounded-xl transition-colors"
                >
                  🏠 Beranda
                </a>
              </div>
            </div>
          )}

          {/* Failed/Expired Section */}
          {(order.status === "failed" || order.status === "expired") && (
            <div className="rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-500/5 to-[#1e1e1e] p-5 space-y-4">
              <div className="text-center">
                <div className="text-3xl mb-1">😔</div>
                <p className="text-sm font-bold text-red-400">
                  {order.status === "expired" ? "Order Expired" : "Transaksi Gagal"}
                </p>
                <p className="text-[10px] text-[#888] mt-1">
                  {order.status === "expired" ? "Waktu pembayaran sudah habis" : "Terjadi kesalahan saat memproses order"}
                </p>
              </div>
              <div className="flex gap-3">
                <a
                  href={`/topup/${order.game_slug}`}
                  className="flex-1 text-center bg-[#d4af37] hover:bg-[#e6c04a] text-black text-xs font-bold py-3 rounded-xl transition-colors"
                >
                  🔄 Coba Lagi
                </a>
                <a
                  href="/"
                  className="flex-1 text-center bg-[#2a2a2a] hover:bg-[#333] text-white text-xs font-medium py-3 rounded-xl transition-colors"
                >
                  🏠 Beranda
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
