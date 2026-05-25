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
  tripay_reference?: string;
  digiflazz_ref_id?: string;
  digiflazz_sn?: string;
  digiflazz_message?: string;
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
        setOrders((data.orders || []).reverse());
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
      if (res.ok) {
        await fetchOrders();
      } else {
        const data = await res.json();
        alert(`Fulfillment failed: ${data.error || "Unknown error"}`);
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
      <h1 className="text-2xl font-bold text-white mb-6">Orders</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilter(status);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? "bg-violet-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== "all" && (
              <span className="ml-2 text-xs opacity-70">
                ({orders.filter((o) => o.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
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
                      key={order.id}
                      className="hover:bg-gray-750 cursor-pointer"
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order.id ? null : order.id
                        )
                      }
                    >
                      <td className="px-6 py-4 text-sm font-mono text-violet-300">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {order.game_slug}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {order.user_id}
                        {order.server_id && (
                          <span className="text-gray-500 ml-1">
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
                      <td className="px-6 py-4">
                        {order.status === "paid" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFulfill(order.id);
                            }}
                            disabled={fulfilling === order.id}
                            className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors"
                          >
                            {fulfilling === order.id
                              ? "..."
                              : "Fulfill"}
                          </button>
                        )}
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr key={`${order.id}-detail`}>
                        <td colSpan={8} className="px-6 py-4 bg-gray-850">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">
                                Denomination:
                              </span>
                              <p className="text-gray-300">
                                {order.denomination_label ||
                                  order.denomination_id}
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
                            {order.digiflazz_ref_id && (
                              <div>
                                <span className="text-gray-500">
                                  Digiflazz Ref:
                                </span>
                                <p className="text-gray-300 font-mono text-xs">
                                  {order.digiflazz_ref_id}
                                </p>
                              </div>
                            )}
                            {order.digiflazz_sn && (
                              <div>
                                <span className="text-gray-500">SN:</span>
                                <p className="text-gray-300 font-mono text-xs">
                                  {order.digiflazz_sn}
                                </p>
                              </div>
                            )}
                            {order.digiflazz_message && (
                              <div>
                                <span className="text-gray-500">Message:</span>
                                <p className="text-gray-300">
                                  {order.digiflazz_message}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Showing {(page - 1) * PAGE_SIZE + 1} -{" "}
              {Math.min(page * PAGE_SIZE, filteredOrders.length)} of{" "}
              {filteredOrders.length}
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
