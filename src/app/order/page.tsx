"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface Order {
  order_id: string;
  game_name: string;
  item_name: string;
  price_idr: number;
  price_crypto: number;
  crypto_token: string;
  crypto_chain: string;
  payment_wallet: string;
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
  const [countdown, setCountdown] = useState("");

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
      const diff = expires - now;

      if (diff <= 0) {
        setCountdown("Expired");
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setCountdown(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
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
              <span className="text-[11px] text-[#777]">Harga</span>
              <span className="text-xs text-[#d4af37] font-semibold">{formatPrice(order.price_idr)}</span>
            </div>
            {order.price_crypto && (
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[#777]">Crypto</span>
                <span className="text-xs text-white">{order.price_crypto} {order.crypto_token} ({order.crypto_chain})</span>
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
              {order.status === "pending" && (
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[11px] text-[#777]">Sisa Waktu</span>
                  <span className={`text-[11px] font-mono font-semibold ${countdown === "Expired" ? "text-red-400" : "text-[#f59e0b]"}`}>
                    {countdown || "..."}
                  </span>
                </div>
              )}
            </div>

            {/* Payment Info for pending */}
            {order.status === "pending" && order.payment_wallet && (
              <div className="border-t border-[#2a2a2a] pt-3 mt-3">
                <p className="text-[11px] text-[#777] mb-2">Kirim pembayaran ke:</p>
                <div className="rounded-lg bg-[#1a1a1a] border border-[#3a3a3a] p-3">
                  <p className="text-[10px] text-[#999] mb-1">{order.crypto_token} ({order.crypto_chain})</p>
                  <p className="text-xs text-white font-mono break-all">{order.payment_wallet}</p>
                  <p className="text-sm text-[#d4af37] font-bold mt-2">{order.price_crypto} {order.crypto_token}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
