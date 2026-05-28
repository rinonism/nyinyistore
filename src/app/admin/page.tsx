"use client";

import { useEffect, useState } from "react";
import { promoCodes } from "@/lib/promo";
import type { PromoCode } from "@/lib/promo";

interface Order {
  id: string;
  game_slug: string;
  denomination_id: string;
  denomination_label: string;
  user_id: string;
  server_id?: string;
  payment_method?: string;
  payment_channel?: string;
  payment_chain?: string;
  payment_token?: string;
  amount_idr: number;
  amount_crypto?: string;
  token_symbol?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

interface Stats {
  totalOrders: number;
  totalRevenueIDR: number;
  totalRevenueCrypto: number;
  pendingOrders: number;
  completedOrders: number;
  paidOrders: number;
  failedOrders: number;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenueIDR: 0,
    totalRevenueCrypto: 0,
    pendingOrders: 0,
    completedOrders: 0,
    paidOrders: 0,
    failedOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "promo">("orders");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        calculateStats(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orderList: Order[]) => {
    const totalOrders = orderList.length;
    const completedOrders = orderList.filter((o) => o.status === "completed").length;
    const pendingOrders = orderList.filter((o) => o.status === "pending").length;
    const paidOrders = orderList.filter((o) => o.status === "paid").length;
    const failedOrders = orderList.filter((o) => o.status === "failed" || o.status === "expired").length;

    const revenueOrders = orderList.filter((o) =>
      ["completed", "paid", "processing"].includes(o.status)
    );

    const totalRevenueIDR = revenueOrders
      .filter((o) => o.payment_method === "tripay" || !o.amount_crypto)
      .reduce((sum, o) => sum + (o.amount_idr || 0), 0);

    const totalRevenueCrypto = revenueOrders
      .filter((o) => o.amount_crypto)
      .reduce((sum, o) => sum + parseFloat(o.amount_crypto || "0"), 0);

    setStats({ totalOrders, totalRevenueIDR, totalRevenueCrypto, pendingOrders, completedOrders, paidOrders, failedOrders });
  };

  const formatIDR = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-900/30 text-yellow-300 border-yellow-700",
      paid: "bg-blue-900/30 text-blue-300 border-blue-700",
      processing: "bg-purple-900/30 text-purple-300 border-purple-700",
      completed: "bg-green-900/30 text-green-300 border-green-700",
      failed: "bg-red-900/30 text-red-300 border-red-700",
      expired: "bg-[#252525] text-[#777] border-[#3a3a3a]",
    };
    return (
      <span className={`px-2 py-1 text-[10px] rounded-full border ${styles[status] || styles.pending}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#d4af37]">Loading dashboard...</div>
      </div>
    );
  }

  const recentOrders = orders.slice(-20).reverse();

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">📊 Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-5">
          <p className="text-[#777] text-xs">Total Orders</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.totalOrders}</p>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-5">
          <p className="text-[#777] text-xs">Revenue (IDR)</p>
          <p className="text-xl font-bold text-[#4caf50] mt-1">{formatIDR(stats.totalRevenueIDR)}</p>
          {stats.totalRevenueCrypto > 0 && (
            <p className="text-[10px] text-[#777] mt-0.5">+ ${stats.totalRevenueCrypto.toFixed(2)} crypto</p>
          )}
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-5">
          <p className="text-[#777] text-xs">Pending / Paid</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">
            {stats.pendingOrders} <span className="text-blue-400 text-lg">/ {stats.paidOrders}</span>
          </p>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] p-5">
          <p className="text-[#777] text-xs">Completed</p>
          <p className="text-2xl font-bold text-[#d4af37] mt-1">{stats.completedOrders}</p>
          {stats.failedOrders > 0 && (
            <p className="text-[10px] text-red-400 mt-0.5">{stats.failedOrders} failed/expired</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === "orders" ? "bg-[#d4af37] text-white" : "bg-[#252525] text-[#777] hover:text-white"
          }`}
        >
          📋 Orders
        </button>
        <button
          onClick={() => setActiveTab("promo")}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === "promo" ? "bg-[#d4af37] text-white" : "bg-[#252525] text-[#777] hover:text-white"
          }`}
        >
          🎫 Promo Codes
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden">
          <div className="p-4 border-b border-[#2a2a2a]">
            <h2 className="text-sm font-semibold text-white">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left px-4 py-2 text-[10px] font-medium text-[#d4af37] uppercase">Order ID</th>
                  <th className="text-left px-4 py-2 text-[10px] font-medium text-[#d4af37] uppercase">Game</th>
                  <th className="text-left px-4 py-2 text-[10px] font-medium text-[#d4af37] uppercase">User</th>
                  <th className="text-left px-4 py-2 text-[10px] font-medium text-[#d4af37] uppercase">Amount</th>
                  <th className="text-left px-4 py-2 text-[10px] font-medium text-[#d4af37] uppercase">Payment</th>
                  <th className="text-left px-4 py-2 text-[10px] font-medium text-[#d4af37] uppercase">Status</th>
                  <th className="text-left px-4 py-2 text-[10px] font-medium text-[#d4af37] uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-xs text-[#777]">
                      Belum ada order
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#252525]">
                      <td className="px-4 py-3 text-xs font-mono text-[#d4af37]">{order.id}</td>
                      <td className="px-4 py-3 text-xs text-[#b0b0b0]">{order.game_slug}</td>
                      <td className="px-4 py-3 text-xs text-[#b0b0b0]">
                        {order.user_id}
                        {order.server_id && <span className="text-[#555]"> ({order.server_id})</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#b0b0b0]">
                        {order.amount_crypto ? `$${order.amount_crypto}` : formatIDR(order.amount_idr)}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#b0b0b0]">
                        {order.payment_channel || order.payment_token?.toUpperCase() || "—"}
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                      <td className="px-4 py-3 text-xs text-[#777]">{formatDate(order.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Promo Codes Tab */}
      {activeTab === "promo" && (
        <div className="rounded-xl border border-[#2a2a2a] bg-[#1e1e1e] overflow-hidden">
          <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Promo Codes</h2>
            <span className="text-[10px] text-[#777]">{promoCodes.length} total</span>
          </div>
          <div className="divide-y divide-[#2a2a2a]">
            {promoCodes.map((promo: PromoCode) => (
              <div key={promo.code} className="p-4 hover:bg-[#252525]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/30 px-3 py-1 text-xs font-mono font-bold text-[#d4af37]">
                      {promo.code}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${promo.active ? "bg-green-900/30 text-green-400 border border-green-700" : "bg-red-900/30 text-red-400 border border-red-700"}`}>
                      {promo.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#777]">
                    {promo.used_count}/{promo.usage_limit} used
                  </span>
                </div>
                <p className="text-xs text-[#b0b0b0] mb-1">{promo.description}</p>
                <div className="flex items-center gap-4 text-[10px] text-[#777]">
                  <span>
                    {promo.discount_type === "percentage"
                      ? `${promo.discount_value}% off (max Rp ${promo.max_discount.toLocaleString("id-ID")})`
                      : `Rp ${promo.discount_value.toLocaleString("id-ID")} off`}
                  </span>
                  <span>Min: Rp {promo.min_purchase.toLocaleString("id-ID")}</span>
                  <span>Exp: {promo.valid_until}</span>
                </div>
                {/* Usage bar */}
                <div className="mt-2 h-1.5 rounded-full bg-[#252525] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#d4af37]"
                    style={{ width: `${(promo.used_count / promo.usage_limit) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
