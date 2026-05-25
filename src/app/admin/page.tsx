"use client";

import { useEffect, useState } from "react";

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
    const completedOrders = orderList.filter(
      (o) => o.status === "completed"
    ).length;
    const pendingOrders = orderList.filter(
      (o) => o.status === "pending"
    ).length;
    const paidOrders = orderList.filter((o) => o.status === "paid").length;
    const failedOrders = orderList.filter(
      (o) => o.status === "failed" || o.status === "expired"
    ).length;

    // Revenue from completed + paid + processing orders
    const revenueOrders = orderList.filter((o) =>
      ["completed", "paid", "processing"].includes(o.status)
    );

    const totalRevenueIDR = revenueOrders
      .filter((o) => o.payment_method === "tripay" || !o.amount_crypto)
      .reduce((sum, o) => sum + (o.amount_idr || 0), 0);

    const totalRevenueCrypto = revenueOrders
      .filter((o) => o.amount_crypto)
      .reduce((sum, o) => sum + parseFloat(o.amount_crypto || "0"), 0);

    setStats({
      totalOrders,
      totalRevenueIDR,
      totalRevenueCrypto,
      pendingOrders,
      completedOrders,
      paidOrders,
      failedOrders,
    });
  };

  const formatIDR = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-900/30 text-yellow-300 border-yellow-700",
      paid: "bg-blue-900/30 text-blue-300 border-blue-700",
      processing: "bg-purple-900/30 text-purple-300 border-purple-700",
      completed: "bg-green-900/30 text-green-300 border-green-700",
      failed: "bg-red-900/30 text-red-300 border-red-700",
      expired: "bg-gray-800/30 text-gray-400 border-gray-600",
    };
    return (
      <span
        className={`px-2 py-1 text-xs rounded-full border ${
          styles[status] || styles.pending
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-violet-400">Loading dashboard...</div>
      </div>
    );
  }

  const recentOrders = orders.slice(-10).reverse();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <p className="text-gray-400 text-sm">Total Orders</p>
          <p className="text-3xl font-bold text-white mt-2">
            {stats.totalOrders}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <p className="text-gray-400 text-sm">Revenue (IDR)</p>
          <p className="text-2xl font-bold text-green-400 mt-2">
            {formatIDR(stats.totalRevenueIDR)}
          </p>
          {stats.totalRevenueCrypto > 0 && (
            <p className="text-sm text-gray-400 mt-1">
              + ${stats.totalRevenueCrypto.toFixed(2)} crypto
            </p>
          )}
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <p className="text-gray-400 text-sm">Pending / Paid</p>
          <p className="text-3xl font-bold text-yellow-400 mt-2">
            {stats.pendingOrders}{" "}
            <span className="text-blue-400 text-xl">/ {stats.paidOrders}</span>
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <p className="text-gray-400 text-sm">Completed</p>
          <p className="text-3xl font-bold text-violet-400 mt-2">
            {stats.completedOrders}
          </p>
          {stats.failedOrders > 0 && (
            <p className="text-sm text-red-400 mt-1">
              {stats.failedOrders} failed/expired
            </p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">
                  Order ID
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">
                  Game
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">
                  User ID
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">
                  Amount
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">
                  Payment
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 text-sm font-mono text-violet-300">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {order.game_slug}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {order.user_id}
                      {order.server_id && (
                        <span className="text-gray-500">
                          ({order.server_id})
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {order.amount_crypto
                        ? `$${order.amount_crypto}`
                        : formatIDR(order.amount_idr)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {order.payment_channel ||
                        order.payment_token?.toUpperCase() ||
                        "—"}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
