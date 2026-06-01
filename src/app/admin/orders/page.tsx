"use client";

import { useEffect, useState } from "react";

interface Order {
  order_id: string;
  game_slug: string;
  game_name?: string;
  item_name: string;
  item_sku?: string;
  user_game_id: string;
  user_server_id?: string;
  nickname?: string;
  payment_method?: string;
  payment_channel?: string;
  crypto_chain?: string;
  crypto_token?: string;
  price_idr: number;
  price_crypto?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  paid_at?: string;
  completed_at?: string;
  tripay_reference?: string;
  digiflazz_ref?: string;
  tx_hash?: string;
  phone?: string;
  email?: string;
}

const STATUSES = [
  "all",
  "pending",
  "paid",
  "processing",
  "completed",
  "failed",
  "expired",
];

const PAGE_SIZE = 20;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [fulfilling, setFulfilling] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        // API already returns newest-first (created_at desc)
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFulfill = async (orderId: string) => {
    setFulfilling(orderId);
    try {
      const res = await fetch("/api/admin/fulfill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });
      const data = await res.json();
      if (res.ok) {
        const charged = data.charged === false ? " (tidak di-charge ulang)" : "";
        alert(`✅ ${data.status || "OK"}: ${data.message || "Order diproses"}${charged}${data.sn ? `\nSN: ${data.sn}` : ""}`);
        await fetchOrders();
      } else {
        alert(`❌ Gagal: ${data.error || "Unknown error"}`);
      }
    } catch {
      alert("Network error during fulfillment");
    } finally {
      setFulfilling(null);
    }
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

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
        <div className="text-violet-400">Loading orders...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Orders</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto pb-1 -mx-1 px-1">
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilter(status);
              setPage(1);
            }}
            className={`shrink-0 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
              filter === status
                ? "bg-violet-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== "all" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({orders.filter((o) => o.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
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
                  User
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
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <>
                    <tr
                      key={order.order_id}
                      className="hover:bg-gray-750 cursor-pointer"
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order.order_id ? null : order.order_id
                        )
                      }
                    >
                      <td className="px-6 py-4 text-sm font-mono text-violet-300">
                        {order.order_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {order.game_name || order.game_slug}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {order.user_game_id}
                        {order.user_server_id && (
                          <span className="text-gray-500 ml-1">
                            ({order.user_server_id})
                          </span>
                        )}
                        {order.nickname && (
                          <span className="block text-xs text-gray-500">
                            {order.nickname}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {order.price_crypto
                          ? `$${order.price_crypto}`
                          : formatIDR(order.price_idr)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {order.payment_channel ||
                          order.crypto_token?.toUpperCase() ||
                          "—"}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        {["paid", "processing", "failed"].includes(order.status) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFulfill(order.order_id);
                            }}
                            disabled={fulfilling === order.order_id}
                            className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors"
                          >
                            {fulfilling === order.order_id
                              ? "..."
                              : order.status === "paid"
                              ? "Fulfill"
                              : "Re-fulfill"}
                          </button>
                        )}
                      </td>
                    </tr>
                    {expandedOrder === order.order_id && (
                      <tr key={`${order.order_id}-detail`}>
                        <td colSpan={8} className="px-6 py-4 bg-gray-850">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">
                                Item:
                              </span>
                              <p className="text-gray-300">
                                {order.item_name}
                                {order.item_sku && (
                                  <span className="text-gray-500 ml-1">
                                    ({order.item_sku})
                                  </span>
                                )}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                Payment Method:
                              </span>
                              <p className="text-gray-300">
                                {order.payment_method || "crypto"}
                                {order.payment_channel &&
                                  ` (${order.payment_channel})`}
                              </p>
                            </div>
                            {order.tripay_reference && (
                              <div>
                                <span className="text-gray-500">
                                  Tripay Ref:
                                </span>
                                <p className="text-gray-300 font-mono text-xs">
                                  {order.tripay_reference}
                                </p>
                              </div>
                            )}
                            {order.digiflazz_ref && (
                              <div>
                                <span className="text-gray-500">
                                  Digiflazz Ref:
                                </span>
                                <p className="text-gray-300 font-mono text-xs">
                                  {order.digiflazz_ref}
                                </p>
                              </div>
                            )}
                            {order.tx_hash && (
                              <div>
                                <span className="text-gray-500">Tx Hash:</span>
                                <p className="text-gray-300 font-mono text-xs break-all">
                                  {order.tx_hash}
                                </p>
                              </div>
                            )}
                            {order.phone && (
                              <div>
                                <span className="text-gray-500">HP:</span>
                                <p className="text-gray-300">{order.phone}</p>
                              </div>
                            )}
                            {order.completed_at && (
                              <div>
                                <span className="text-gray-500">Completed:</span>
                                <p className="text-gray-300">
                                  {formatDate(order.completed_at)}
                                </p>
                              </div>
                            )}
                            {order.updated_at && (
                              <div>
                                <span className="text-gray-500">Updated:</span>
                                <p className="text-gray-300">
                                  {formatDate(order.updated_at)}
                                </p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-700">
          {paginatedOrders.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              No orders found
            </div>
          ) : (
            paginatedOrders.map((order) => (
              <div key={order.order_id} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-violet-300 break-all">
                    {order.order_id}
                  </span>
                  {getStatusBadge(order.status)}
                </div>
                <div className="text-sm text-white mb-1">
                  {order.game_name || order.game_slug}
                  <span className="text-gray-500"> · {order.item_name}</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-300 mb-2">
                  <span>
                    ID: {order.user_game_id}
                    {order.user_server_id && ` (${order.user_server_id})`}
                  </span>
                  <span className="text-green-400 font-medium">
                    {order.price_crypto
                      ? `$${order.price_crypto}`
                      : formatIDR(order.price_idr)}
                  </span>
                  <span>
                    {order.payment_channel ||
                      order.crypto_token?.toUpperCase() ||
                      "—"}
                  </span>
                </div>
                {order.nickname && (
                  <div className="text-xs text-gray-500 mb-2">
                    Nick: {order.nickname}
                  </div>
                )}
                {order.digiflazz_ref && (
                  <div className="text-xs text-gray-500 mb-2 font-mono break-all">
                    Digi: {order.digiflazz_ref}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-500">
                    {formatDate(order.created_at)}
                  </span>
                  {["paid", "processing", "failed"].includes(order.status) && (
                    <button
                      onClick={() => handleFulfill(order.order_id)}
                      disabled={fulfilling === order.order_id}
                      className="px-4 py-2 text-xs bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors"
                    >
                      {fulfilling === order.order_id
                        ? "..."
                        : order.status === "paid"
                        ? "Fulfill"
                        : "Re-fulfill"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 md:px-6 py-4 border-t border-gray-700">
            <p className="text-xs md:text-sm text-gray-400">
              {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredOrders.length)} of {filteredOrders.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded-lg"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 rounded-lg"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
