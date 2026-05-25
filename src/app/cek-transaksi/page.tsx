"use client";

import { useState } from "react";

interface TransactionResult {
  order_id: string;
  game: string;
  item: string;
  status: "pending" | "processing" | "success" | "failed";
  user_id: string;
  created_at: string;
  total: string;
}

export default function CekTransaksiPage() {
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState<TransactionResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!orderId.trim()) {
      setError("Masukkan Order ID terlebih dahulu");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/orders/${orderId}/status`);
      if (!res.ok) {
        setError("Transaksi tidak ditemukan. Pastikan Order ID benar.");
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Gagal mengecek transaksi. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-400 bg-green-400/10 border-green-400/30";
      case "processing": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "pending": return "text-blue-400 bg-blue-400/10 border-blue-400/30";
      case "failed": return "text-red-400 bg-red-400/10 border-red-400/30";
      default: return "text-[#777] bg-[#252525] border-[#3a3a3a]";
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "success": return "✅ Sukses";
      case "processing": return "⏳ Diproses";
      case "pending": return "🕐 Menunggu Pembayaran";
      case "failed": return "❌ Gagal";
      default: return status;
    }
  };

  return (
    <div className="mx-auto max-w-[600px] px-4 py-10">
      <h1 className="text-xl font-bold text-white mb-2">Cek Transaksi</h1>
      <p className="text-xs text-[#777] mb-6">
        Masukkan Order ID untuk mengecek status transaksi kamu.
      </p>

      {/* Search Box */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-5">
        <label htmlFor="orderId" className="mb-2 block text-sm text-[#b0b0b0]">
          Order ID
        </label>
        <div className="flex gap-2">
          <input
            id="orderId"
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            placeholder="Masukkan Order ID (contoh: ORD-XXXXX)"
            className="flex-1 rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-[#666] focus:border-[#c8a45c] focus:outline-none focus:ring-1 focus:ring-[#c8a45c]"
          />
          <button
            onClick={handleCheck}
            disabled={loading}
            className="btn-gold px-6 disabled:opacity-50"
          >
            {loading ? "..." : "Cek"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="mt-3 text-xs text-red-400">{error}</p>
        )}

        {/* Result */}
        {result && (
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#777]">Status</span>
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusColor(result.status)}`}>
                {statusLabel(result.status)}
              </span>
            </div>
            <div className="space-y-2 rounded-lg border border-[#2a2a2a] bg-[#252525] p-4">
              <div className="flex justify-between">
                <span className="text-xs text-[#777]">Order ID</span>
                <span className="text-xs text-white font-mono">{result.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#777]">Game</span>
                <span className="text-xs text-white">{result.game}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#777]">Item</span>
                <span className="text-xs text-white">{result.item}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#777]">User ID</span>
                <span className="text-xs text-white">{result.user_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#777]">Total</span>
                <span className="text-xs text-[#c8a45c] font-semibold">{result.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#777]">Tanggal</span>
                <span className="text-xs text-white">{result.created_at}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Help */}
      <div className="mt-6 rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-4">
        <p className="text-xs text-[#777]">
          💡 Order ID bisa ditemukan di email konfirmasi atau halaman checkout setelah pembayaran.
          Jika ada kendala, hubungi CS kami via WhatsApp.
        </p>
      </div>
    </div>
  );
}
