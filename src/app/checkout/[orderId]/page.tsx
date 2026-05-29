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
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

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
        <button onClick={() => router.push("/")} className="text-sm text-[#d4af37] underline">
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
        <div className="flex items-center justify-center gap-1.5 mt-0.5">
          <p className="text-xs text-[#999]">Order #{order.id}</p>
          <button
            onClick={() => copyToClipboard(order.id, "orderId")}
            className="text-[10px] text-[#d4af37] hover:text-[#b8944c]"
          >
            {copied === "orderId" ? "✓" : "📋"}
          </button>
        </div>
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
          <button onClick={() => router.back()} className="mt-2 text-xs text-[#d4af37] underline">
            Kembali
          </button>
        </div>
      )}

      {/* CS Contact */}
      {(isPaid || isExpired) && (
        <div className="mb-4 rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-3 text-center">
          <p className="text-xs text-[#999]">Ada masalah? Hubungi CS kami</p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <a
              href="https://t.me/NyinyiStore_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-[#2a2a2a] px-3 py-1.5 text-xs text-[#29b6f6] hover:bg-[#3a3a3a]"
            >
              💬 Telegram
            </a>
            <a
              href="https://wa.me/6285718100782?text=Halo%20min%2C%20saya%20butuh%20bantuan%20order%20%23"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-[#2a2a2a] px-3 py-1.5 text-xs text-[#4caf50] hover:bg-[#3a3a3a]"
            >
              📱 WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Review Form */}
      {isPaid && !reviewSubmitted && (
        <div className="mb-4 rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-4">
          <h2 className="text-sm font-medium text-white mb-3">⭐ Beri Ulasan</h2>
          <p className="text-[11px] text-[#999] mb-3">Bagaimana pengalaman belanja kamu?</p>
          
          {/* Star Rating */}
          <div className="flex items-center justify-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-2xl transition-transform hover:scale-110"
              >
                {star <= (hoverRating || rating) ? "⭐" : "☆"}
              </button>
            ))}
          </div>

          {/* Review Text */}
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Tulis ulasan kamu di sini... (opsional)"
            className="w-full rounded-lg bg-[#252525] border border-[#3a3a3a] p-3 text-xs text-white placeholder-[#666] resize-none focus:border-[#d4af37] focus:outline-none"
            rows={3}
            maxLength={500}
          />
          <p className="text-[10px] text-[#666] mt-1 text-right">{reviewText.length}/500</p>

          {/* Submit */}
          <button
            onClick={async () => {
              if (rating === 0) return;
              setSubmittingReview(true);
              try {
                await fetch("/api/reviews", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    order_id: order.id,
                    game_slug: order.game_slug,
                    rating,
                    review: reviewText,
                  }),
                });
                setReviewSubmitted(true);
              } catch {}
              setSubmittingReview(false);
            }}
            disabled={rating === 0 || submittingReview}
            className="mt-3 w-full rounded-lg bg-[#d4af37] py-2.5 text-sm font-medium text-white hover:bg-[#b8944c] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submittingReview ? "Mengirim..." : "Kirim Ulasan"}
          </button>
        </div>
      )}

      {/* Review Submitted */}
      {reviewSubmitted && (
        <div className="mb-4 rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-4 text-center">
          <span className="text-2xl">🙏</span>
          <p className="mt-1 text-sm font-medium text-[#d4af37]">Terima kasih atas ulasannya!</p>
        </div>
      )}

      {/* Timer */}
      {!isExpired && !isPaid && (
        <div className="mb-4 rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-3 text-center">
          <p className="text-xs text-[#999]">Bayar sebelum</p>
          <p className={`text-xl font-bold ${timeLeft < 120 ? "text-red-400" : "text-[#d4af37]"}`}>
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
              <span className="text-lg font-bold text-[#d4af37]">
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
            className="mt-3 w-full rounded-lg bg-[#d4af37] py-2.5 text-sm font-medium text-white hover:bg-[#b8944c] disabled:opacity-50"
          >
            {checking ? "Mengecek..." : "Cek Pembayaran"}
          </button>
          <p className="mt-1 text-center text-[9px] text-[#666]">Auto-check setiap 15 detik</p>

          {/* Cancel button */}
          <button
            onClick={() => { if (confirm("Yakin mau cancel order ini?")) router.push("/"); }}
            className="mt-2 w-full rounded-lg border border-[#3a3a3a] bg-transparent py-2 text-sm text-[#999] hover:border-red-500 hover:text-red-400"
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
}
