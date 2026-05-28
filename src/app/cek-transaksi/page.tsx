"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CekTransaksi() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");

  const handleCheck = () => {
    const id = orderId.trim();
    if (!id) return;
    router.push(`/order?id=${encodeURIComponent(id)}`);
  };

  return (
    <div className="mx-auto max-w-[480px] px-4 py-10">
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1e1e1e] p-6">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">🔍</div>
          <h1 className="text-lg font-bold text-white">Cek Status Transaksi</h1>
          <p className="text-[11px] text-[#888] mt-1">Masukkan Order ID untuk melihat status pesanan kamu</p>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            placeholder="Masukkan Order ID (NY-...)"
            className="w-full rounded-xl border border-[#3a3a3a] bg-[#141414] px-4 py-3 text-sm text-white placeholder-[#555] focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors"
          />
          <button
            onClick={handleCheck}
            disabled={!orderId.trim()}
            className="w-full rounded-xl bg-[#d4af37] hover:bg-[#e6c04a] disabled:opacity-40 disabled:hover:bg-[#d4af37] px-4 py-3 text-sm font-bold text-black transition-colors"
          >
            Cek Sekarang
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-[#2a2a2a]">
          <p className="text-[10px] text-[#666] text-center">💡 Order ID bisa ditemukan di halaman order setelah checkout atau di notifikasi Telegram</p>
        </div>
      </div>
    </div>
  );
}
