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
}

const statusMap: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: "Menunggu Pembayaran", color: "#f59e0b", icon: "⏳" },
  paid: { label: "Pembayaran Diterima", color: "#3b82f6", icon: "✅" },
  processing: { label: "Sedang Diproses", color: "#8b5cf6", icon: "⚙️" },
  completed: { label: "Selesai", color: "#4caf50", icon: "🎉" },
  failed: { label: "Gagal", color: "#ef4444", icon: "❌" },
  expired: { label: "Expired", color: "#6b7280", icon: "⏰" },
};

export default function OrderStatusPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[500px] px-4 py-10 text-center text-white">Loading...</div>}>
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

  const copyOrderId = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    <div className="mx-auto max-w-[500px] px-4 py-10">


      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
          <p className="text-sm text-red-400">❌ {error}</p>
        </div>
      )}

      {/* Order Result */}
      {order && status && (
        <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden">
          {/* Status Header */}
          <div className="border-b border-[#2a2a2a] bg-[#252525] px-4 py-3 text-center">
            <p className="text-2xl mb-1">{status.icon}</p>
            <p className="text-sm font-semibold" style={{ color: status.color }}>{status.label}</p>
            {order.status === "pending" && timeLeft !== null && (
              <p className={`text-xs mt-1.5 font-mono ${timeLeft <= 300 ? "text-red-400" : "text-[#999]"}`}>
                {timeLeft <= 0 ? "Expired" : `${Math.floor(timeLeft / 60).toString().padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="px-4 pt-4">
            {(() => {
              const steps = [
                { key: "pending", label: "Menunggu Pembayaran", icon: "⏳" },
                { key: "paid", label: "Dibayar", icon: "✅" },
                { key: "processing", label: "Diproses", icon: "⚙️" },
                { key: "completed", label: "Selesai", icon: "🎉" },
              ];
              const failedStates = ["failed", "expired"];
              const isFailed = failedStates.includes(order.status);
              const currentIdx = isFailed ? -1 : steps.findIndex(s => s.key === order.status);

              return (
                <div className="flex items-center justify-between mb-4">
                  {steps.map((step, i) => (
                    <div key={step.key} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                            isFailed
                              ? "bg-[#2a2a2a] text-[#666]"
                              : i <= currentIdx
                              ? "bg-[#d4af37] text-black"
                              : "bg-[#2a2a2a] text-[#666]"
                          }`}
                        >
                          {step.icon}
                        </div>
                        <span className={`text-[9px] mt-1 text-center leading-tight ${
                          isFailed
                            ? "text-[#666]"
                            : i <= currentIdx
                            ? "text-[#d4af37]"
                            : "text-[#666]"
                        }`}>
                          {step.label}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`flex-1 h-[2px] mx-1 mt-[-14px] ${
                          isFailed
                            ? "bg-[#2a2a2a]"
                            : i < currentIdx
                            ? "bg-[#d4af37]"
                            : "bg-[#2a2a2a]"
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Order Details */}
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#777]">Order ID</span>
              <button
                onClick={() => copyOrderId(order.order_id)}
                className="flex items-center gap-1.5 text-xs text-white font-mono hover:text-[#d4af37] transition-colors"
              >
                {order.order_id}
                <span className="text-[10px]">{copied ? "✓" : "📋"}</span>
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#777]">Game</span>
              <span className="text-xs text-white">{order.game_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#777]">Item</span>
              <span className="text-xs text-white">{order.item_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#777]">User ID</span>
              <span className="text-xs text-white">{order.user_game_id}{order.user_server_id ? ` (${order.user_server_id})` : ""}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#777]">Harga</span>
              <span className="text-xs text-[#d4af37] font-semibold">{formatPrice(order.price_idr)}</span>
            </div>
            {order.price_crypto && (
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#777]">Crypto</span>
                <span className="text-xs text-white">{order.price_crypto} {order.crypto_token.toUpperCase()} ({order.crypto_chain.toUpperCase()})</span>
              </div>
            )}
            <div className="border-t border-[#2a2a2a] pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#777]">Dibuat</span>
                <span className="text-[11px] text-[#999]">{formatDate(order.created_at)}</span>
              </div>
              {order.paid_at && (
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[11px] text-[#777]">Dibayar</span>
                  <span className="text-[11px] text-[#4caf50]">{formatDate(order.paid_at)}</span>
                </div>
              )}
              {order.completed_at && (
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[11px] text-[#777]">Selesai</span>
                  <span className="text-[11px] text-[#4caf50]">{formatDate(order.completed_at)}</span>
                </div>
              )}

            </div>

            {/* Payment Info for pending */}
            {order.status === "pending" && order.payment_wallet && (
              <div className="border-t border-[#2a2a2a] pt-3 mt-3 space-y-3">
                {/* Crypto amount row */}
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-[#777]">Crypto</span>
                  <button
                    onClick={() => { navigator.clipboard.writeText(String(order.price_crypto)); setCopiedAmount(true); setTimeout(() => setCopiedAmount(false), 2000); }}
                    className="flex items-center gap-1.5 text-xs text-white font-mono font-semibold hover:text-[#d4af37] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#26A17B"/><path d="M17.9 17.1v-.002c-.1.008-1 .06-2.8.06-1.5 0-2.5-.045-2.8-.058v.002C9.1 16.8 7 16.3 7 15.7s2.1-1.1 5.3-1.3v2.1c.3.02 1.3.07 2.8.07 1.9 0 2.7-.06 2.8-.07v-2.1c3.2.2 5.3.7 5.3 1.3s-2.1 1.1-5.3 1.4zm0-2.8v-1.9h4.6v-3h-13v3h4.6v1.9C8.5 14.5 6 15.2 6 16s2.5 1.5 6.5 1.7v6.1h2.9v-6.1c4-.2 6.5-.9 6.5-1.7s-2.5-1.5-6.5-1.7z" fill="#fff"/></svg>
                    {order.price_crypto} {order.crypto_token.toUpperCase()} ({order.crypto_chain.toUpperCase()})
                    <span className="text-[9px]">{copiedAmount ? "✓" : "📋"}</span>
                  </button>
                </div>

                {/* QR + Address */}
                <div className="rounded-lg bg-[#1a1a1a] border border-[#3a3a3a] p-4">
                  <p className="text-[11px] text-[#777] mb-3 text-center">Kirim pembayaran</p>
                  <div className="flex justify-center mb-3">
                    <div className="bg-white p-2 rounded-lg">
                      <QRCodeSVG value={order.payment_wallet} size={140} />
                    </div>
                  </div>
                  <p className="text-[10px] text-[#999] mb-1 text-center">{order.crypto_token.toUpperCase()} ({order.crypto_chain.toUpperCase()})</p>
                  <button
                    onClick={() => { navigator.clipboard.writeText(order.payment_wallet); setCopiedWallet(true); setTimeout(() => setCopiedWallet(false), 2000); }}
                    className="w-full flex items-center justify-center gap-1.5 text-xs text-white font-mono break-all hover:text-[#d4af37] transition-colors text-center"
                  >
                    <span className="break-all">{order.payment_wallet}</span>
                    <span className="text-[9px] shrink-0">{copiedWallet ? "✓" : "📋"}</span>
                  </button>
                </div>

                {/* Panduan Pembayaran */}
                <div className="rounded-lg bg-[#141414] border border-[#2a2a2a] p-3">
                  <p className="text-[11px] text-[#d4af37] font-semibold mb-2">📖 Panduan Pembayaran</p>
                  <ol className="text-[10px] text-[#999] space-y-1.5 list-decimal list-inside">
                    <li>Copy alamat wallet atau scan QR code di atas</li>
                    <li>Buka aplikasi wallet kamu ({order.crypto_chain.toLowerCase() === "solana" ? "Phantom, Solflare, dll" : "MetaMask, Trust Wallet, dll"})</li>
                    <li>Pastikan pilih network <span className="text-white font-semibold">{order.crypto_chain.toUpperCase()}</span></li>
                    <li>Kirim <span className="text-[#d4af37] font-semibold">{order.price_crypto} {order.crypto_token.toUpperCase()}</span> (nominal harus tepat)</li>
                    <li>Tunggu konfirmasi — status otomatis update dalam 1-3 menit</li>
                  </ol>
                  <div className="mt-2 pt-2 border-t border-[#2a2a2a]">
                    <p className="text-[9px] text-red-400">⚠️ Kirim hanya {order.crypto_token.toUpperCase()} di network {order.crypto_chain.toUpperCase()}. Token atau network salah = dana hilang.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
