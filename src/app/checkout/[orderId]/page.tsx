"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

interface OrderData {
  id: string;
  game_slug: string;
  denomination_label: string;
  user_id: string;
  server_id?: string;
  payment_chain: string;
  payment_token: string;
  payment_address: string;
  amount_idr: number;
  amount_crypto: string;
  token_symbol: string;
  status: string;
  tx_hash?: string;
  created_at: string;
  expires_at: string;
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [copied, setCopied] = useState<"address" | "amount" | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [txHash, setTxHash] = useState("");

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`);
      if (!res.ok) throw new Error("Order not found");
      const data = await res.json();
      setOrder(data);
    } catch {
      setError("Order not found");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // Initial fetch
  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Poll every 10 seconds
  useEffect(() => {
    if (!order || order.status !== "pending") return;
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [order, fetchOrder]);

  // Countdown timer
  useEffect(() => {
    if (!order) return;
    const updateTimer = () => {
      const now = new Date().getTime();
      const expires = new Date(order.expires_at).getTime();
      const diff = Math.max(0, Math.floor((expires - now) / 1000));
      setTimeLeft(diff);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order]);

  const copyToClipboard = async (text: string, type: "address" | "amount") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleVerify = async () => {
    if (!order) return;
    setVerifying(true);
    try {
      const res = await fetch("/api/orders/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: order.id, tx_hash: txHash || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchOrder();
      } else {
        alert(data.error || "Verification failed");
      }
    } catch {
      alert("Failed to verify payment");
    } finally {
      setVerifying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent mx-auto"></div>
          <p className="text-gray-400">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-400">❌ {error || "Order not found"}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 rounded-lg bg-violet-600 px-6 py-2 text-white hover:bg-violet-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Status screens
  if (order.status === "paid") {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-8 text-center">
          <div className="mb-4 text-5xl">✅</div>
          <h1 className="mb-2 text-2xl font-bold text-green-400">Payment Received!</h1>
          <p className="text-gray-300">Your order is being processed.</p>
          <p className="mt-4 text-sm text-gray-400">Order ID: {order.id}</p>
          {order.tx_hash && (
            <p className="mt-2 text-xs text-gray-500 break-all">TX: {order.tx_hash}</p>
          )}
          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-lg bg-violet-600 px-6 py-2 text-white hover:bg-violet-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (order.status === "expired") {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <div className="mb-4 text-5xl">⏰</div>
          <h1 className="mb-2 text-2xl font-bold text-red-400">Order Expired</h1>
          <p className="text-gray-300">This order has expired. Please create a new order.</p>
          <p className="mt-4 text-sm text-gray-400">Order ID: {order.id}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-lg bg-violet-600 px-6 py-2 text-white hover:bg-violet-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white">Complete Payment</h1>
        <p className="mt-1 text-sm text-gray-400">Order: {order.id}</p>
      </div>

      {/* Timer */}
      <div className={`mb-6 rounded-lg p-3 text-center ${
        timeLeft < 120
          ? "border border-red-500/30 bg-red-500/10"
          : "border border-violet-500/30 bg-violet-500/10"
      }`}>
        <p className="text-sm text-gray-300">Time remaining</p>
        <p className={`text-2xl font-mono font-bold ${
          timeLeft < 120 ? "text-red-400" : "text-violet-400"
        }`}>
          {formatTime(timeLeft)}
        </p>
      </div>

      {/* Order Details */}
      <div className="mb-6 rounded-xl border border-gray-700 bg-gray-800 p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase text-gray-400">Order Details</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Item</span>
            <span className="text-white">{order.denomination_label}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">User ID</span>
            <span className="text-white">{order.user_id}{order.server_id ? ` (${order.server_id})` : ""}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Network</span>
            <span className="text-white capitalize">{order.payment_chain}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Token</span>
            <span className="text-white">{order.token_symbol}</span>
          </div>
        </div>
      </div>

      {/* Payment Amount */}
      <div className="mb-4 rounded-xl border border-violet-500/30 bg-violet-500/10 p-5">
        <h2 className="mb-2 text-sm font-semibold uppercase text-gray-400">Send Exactly</h2>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-white">
            {order.amount_crypto} {order.token_symbol}
          </span>
          <button
            onClick={() => copyToClipboard(order.amount_crypto, "amount")}
            className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700"
          >
            {copied === "amount" ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Payment Address */}
      <div className="mb-6 rounded-xl border border-gray-700 bg-gray-800 p-5">
        <h2 className="mb-2 text-sm font-semibold uppercase text-gray-400">To Address</h2>
        <div className="mb-3 rounded-lg bg-gray-900 p-3">
          <p className="break-all font-mono text-sm text-white">{order.payment_address}</p>
        </div>
        <button
          onClick={() => copyToClipboard(order.payment_address, "address")}
          className="w-full rounded-lg bg-gray-700 py-2 text-sm font-medium text-white hover:bg-gray-600"
        >
          {copied === "address" ? "✓ Address Copied!" : "📋 Copy Address"}
        </button>
      </div>

      {/* QR Code Placeholder */}
      <div className="mb-6 rounded-xl border border-gray-700 bg-gray-800 p-5 text-center">
        <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-lg bg-white">
          <span className="text-4xl text-gray-400">QR</span>
        </div>
        <p className="mt-2 text-xs text-gray-500">QR Code (coming soon)</p>
      </div>

      {/* TX Hash Input + Verify */}
      <div className="rounded-xl border border-gray-700 bg-gray-800 p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase text-gray-400">Confirm Payment</h2>
        <input
          type="text"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          placeholder="Transaction hash (optional)"
          className="mb-3 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        />
        <button
          onClick={handleVerify}
          disabled={verifying || timeLeft === 0}
          className="w-full rounded-lg bg-violet-600 py-3 font-semibold text-white transition-all hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {verifying ? "Verifying..." : "✅ I've Paid"}
        </button>
        <p className="mt-2 text-center text-xs text-gray-500">
          Status auto-refreshes every 10 seconds
        </p>
      </div>
    </div>
  );
}
