"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface OrderData {
  id: string;
  game_slug: string;
  denomination_label: string;
  user_id: string;
  server_id?: string;
  payment_address: string;
  amount_crypto: string;
  token_symbol: string;
  payment_chain: string;
  amount_idr: number;
  status: string;
  expires_at: string;
}

export default function CheckoutPage({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, []);

  useEffect(() => {
    if (!order) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(order.expires_at).getTime();
      const diff = Math.max(0, Math.floor((expires - now) / 1000));
      setTimeLeft(diff);
      if (diff === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [order]);

  // Auto-check payment every 15 seconds
  useEffect(() => {
    if (!order || order.status !== "pending") return;
    const interval = setInterval(() => {
      checkPayment();
    }, 15000);
    return () => clearInterval(interval);
  }, [order]);

  const fetchOrder = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get", order_id: params.orderId }),
      });
      if (!res.ok) throw new Error("Order not found");
      const data = await res.json();
      setOrder(data);
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const checkPayment = async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check", order_id: params.orderId }),
      });
      const data = await res.json();
      if (data.status && data.status !== "pending") {
        setOrder((prev) => prev ? { ...prev, status: data.status } : prev);
      }
    } catch {}
    setChecking(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-pulse text-[#999]">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <p className="text-red-400">Order tidak ditemukan</p>
        <button onClick={() => router.push("/")} className="text-sm text-[#c8a45c] underline">
          Kembali ke Home
        </button>
      </div>
    );
  }

  const isExpired = timeLeft === 0 && order.status === "pending";
  const isPaid = order.status === "paid" || order.status === "processing" || order.status === "completed";

  return (
    <div className="mx-auto max-w-[500px] px-4 py-6">
      {/* Header */}
      <div className="mb-4 text-center">
        <h1 className="text-lg font-bold text-white">Checkout</h1>
        <p className="text-xs text-[#999]">Order #{order.id}</p>
      </div>

      {/* Status */}
      {isPaid && (
        <div className="mb-4 rounded-xl border border-[#4caf50]/30 bg-[#4caf50]/10 p-4 text-center">
          <span className="text-2xl">✅</span>
          <p className="mt-1 text-sm font-medium text-[#4caf50]">
            {order.status === "completed" ? "Pembayaran berhasil! Diamond sedang diproses." : "Pembayaran terdeteksi! Sedang diproses..."}
          </p>
        </div>
      )}

      {isExpired && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
          <span className="text-2xl">⏰</span>
          <p className="mt-1 text-sm font-medium text-red-400">Order expired. Silakan buat order baru.</p>
          <button onClick={() => router.back()} className="mt-2 text-xs text-[#c8a45c] underline">
            Kembali
          </button>
        </div>
      )}

      {/* Timer */}
      {!isExpired && !isPaid && (
        <div className="mb-4 rounded-xl border border-[#c8a45c]/30 bg-[#c8a45c]/10 p-3 text-center">
          <p className="text-xs text-[#999]">Bayar sebelum</p>
          <p className={`text-xl font-bold ${timeLeft < 120 ? "text-red-400" : "text-[#c8a45c]"}`}>
            {formatTime(timeLeft)}
          </p>
        </div>
      )}

      {/* Order Details */}
      <div className="mb-4 rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-4">
        <h2 className="mb-2 text-xs font-medium text-[#999]">Detail Order</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#999]">Item</span>
            <span className="text-white">{order.denomination_label}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#999]">ID Game</span>
            <span className="text-white">{order.user_id}{order.server_id ? ` (${order.server_id})` : ""}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#999]">Harga</span>
            <span className="text-white">{formatPrice(order.amount_idr)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#999]">Network</span>
            <span className="text-white capitalize">{order.payment_chain}</span>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      {!isExpired && !isPaid && (
        <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-4">
          <h2 className="mb-3 text-xs font-medium text-[#999]">Kirim Pembayaran</h2>

          {/* Amount */}
          <div className="mb-3 rounded-lg bg-[#252525] p-3">
            <p className="text-[10px] text-[#999] mb-1">Jumlah (exact amount)</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-[#c8a45c]">
                {order.amount_crypto} {order.token_symbol}
              </span>
              <button
                onClick={() => copyToClipboard(order.amount_crypto, "amount")}
                className="rounded bg-[#3a3a3a] px-2 py-1 text-[10px] text-white hover:bg-[#4a4a4a]"
              >
                {copied === "amount" ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-lg bg-[#252525] p-3">
            <p className="text-[10px] text-[#999] mb-1">Kirim ke address</p>
            <div className="flex items-center gap-2">
              <span className="flex-1 break-all text-xs text-white font-mono">
                {order.payment_address}
              </span>
              <button
                onClick={() => copyToClipboard(order.payment_address, "address")}
                className="flex-shrink-0 rounded bg-[#3a3a3a] px-2 py-1 text-[10px] text-white hover:bg-[#4a4a4a]"
              >
                {copied === "address" ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Warning */}
          <div className="mt-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-2">
            <p className="text-[10px] text-yellow-400">
              ⚠️ Kirim EXACT amount di atas. Jangan dibulatkan. Pastikan network {order.payment_chain} dan token {order.token_symbol}.
            </p>
          </div>

          {/* Check button */}
          <button
            onClick={checkPayment}
            disabled={checking}
            className="mt-3 w-full rounded-lg bg-[#c8a45c] py-2.5 text-sm font-medium text-white hover:bg-[#b8944c] disabled:opacity-50"
          >
            {checking ? "Mengecek..." : "Cek Pembayaran"}
          </button>
          <p className="mt-1 text-center text-[9px] text-[#666]">Auto-check setiap 15 detik</p>
        </div>
      )}
    </div>
  );
}
