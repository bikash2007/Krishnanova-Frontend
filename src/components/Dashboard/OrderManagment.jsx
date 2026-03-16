import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import {
  FaTruck,
  FaCheck,
  FaTimes,
  FaPause,
  FaCreditCard,
  FaUndo,
  FaHourglass,
} from "react-icons/fa";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    processing: {
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      icon: <FaHourglass />,
    },
    shipped: {
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      icon: <FaTruck />,
    },
    delivered: {
      color: "bg-green-500/20 text-green-400 border-green-500/30",
      icon: <FaCheck />,
    },
    cancelled: {
      color: "bg-red-500/20 text-red-400 border-red-500/30",
      icon: <FaTimes />,
    },
    pending: {
      color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      icon: <FaPause />,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}
    >
      <span className="mr-1">{config.icon}</span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Payment Badge Component
const PaymentBadge = ({ status }) => {
  const config = {
    paid: {
      color: "bg-green-500/20 text-green-400 border-green-500/30",
      icon: <FaCreditCard />,
    },
    pending: {
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      icon: <FaHourglass />,
    },
    failed: {
      color: "bg-red-500/20 text-red-400 border-red-500/30",
      icon: <FaTimes />,
    },
    refunded: {
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      icon: <FaUndo />,
    },
  };

  const statusConfig = config[status] || config.pending;

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
    >
      <span className="mr-1">{statusConfig.icon}</span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({ order, isOpen, onClose, onStatusUpdate }) => {
  const [newStatus, setNewStatus] = useState(order?.status || "processing");

  if (!isOpen || !order) return null;

  const handleStatusUpdate = async () => {
    await onStatusUpdate(order._id, newStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1e2139] to-[#23263a] rounded-2xl shadow-2xl border border-gray-700/50 max-w-4xl w-full max-h-[calc(var(--app-height)*0.9)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div>
            <h2 className="text-2xl font-bold text-white">Order Details</h2>
            <p className="text-gray-400">
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Customer Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white font-medium">
                    {order.user?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-blue-400">
                    {order.user?.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Phone:</span>
                  <span className="text-white">
                    {order.shippingInfo?.phone || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-gray-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                Shipping Address
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-white font-medium">
                  {order.shippingInfo?.address || "N/A"}
                </p>
                <p className="text-gray-300">
                  {order.shippingInfo?.city}, {order.shippingInfo?.state}{" "}
                  {order.shippingInfo?.zipCode}
                </p>
                <p className="text-gray-300">
                  {order.shippingInfo?.country || "N/A"}
                </p>
              </div>
            </div>

            {/* Order Status Update */}
            <div className="bg-gray-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                Update Status
              </h3>
              <div className="space-y-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-400 focus:outline-none"
                >
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-purple-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                </svg>
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order Date:</span>
                  <span className="text-white">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment:</span>
                  <PaymentBadge status={order.paymentStatus} />
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-green-400">
                    ${order.total?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-800/50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-orange-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8.5 13a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Items ({order.items?.length || 0})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-gray-400 text-sm">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        ${item.price}/each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function OrderManagement() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "employee")) return;

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/orders/admin",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setOrders(response.data.orders || response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const updateStatus = async (orderId, status) => {
    try {
      await axios.patch(
        import.meta.env.VITE_API_URL + `/orders/${orderId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o)),
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredOrders = orders
    .filter((order) => {
      const matchesStatus =
        filters.status === "all" || order.status === filters.status;
      const matchesSearch =
        !filters.search ||
        order.user?.name
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        order.user?.email
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        order._id.includes(filters.search);

      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

  if (!user || (user.role !== "admin" && user.role !== "employee")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#151922] to-[#1a1f2e] flex items-center justify-center">
        <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-2xl p-8 text-center">
          <svg
            className="w-16 h-16 text-red-400 mx-auto mb-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-2xl font-bold text-red-400 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-300">
            This area is restricted to administrators and employees only.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#151922] to-[#1a1f2e] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#01abfd] shadow-lg"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-2 border-[#01abfd] opacity-20"></div>
          </div>
          <p className="text-gray-300 mt-4 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#151922] to-[#1a1f2e] py-8 px-4 text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#01abfd] to-[#10b981] bg-clip-text text-transparent mb-2">
              Order Management
            </h1>
            <p className="text-gray-400 text-lg">
              Manage and track all customer orders
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="bg-gradient-to-r from-[#1e2139] to-[#23263a] rounded-xl px-4 py-2 border border-gray-700/50">
              <span className="text-gray-400 text-sm">Total Orders: </span>
              <span className="text-white font-bold">{orders.length}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-r from-[#1e2139] to-[#23263a] rounded-2xl p-6 mb-8 border border-gray-700/50">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or order ID..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full bg-gray-700/50 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full bg-gray-700/50 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-400 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
                }
                className="w-full bg-gray-700/50 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-400 focus:outline-none"
              >
                <option value="createdAt">Date</option>
                <option value="total">Total</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, sortOrder: e.target.value }))
                }
                className="w-full bg-gray-700/50 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-400 focus:outline-none"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-gradient-to-br from-[#1e2139] to-[#23263a] rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-800/50">
                <tr className="text-left border-b border-gray-700/50">
                  <th className="p-4 text-gray-300 font-semibold">Order ID</th>
                  <th className="p-4 text-gray-300 font-semibold">Customer</th>
                  <th className="p-4 text-gray-300 font-semibold">Contact</th>
                  <th className="p-4 text-gray-300 font-semibold">Address</th>
                  <th className="p-4 text-gray-300 font-semibold">Date</th>
                  <th className="p-4 text-gray-300 font-semibold">Total</th>
                  <th className="p-4 text-gray-300 font-semibold">Status</th>
                  <th className="p-4 text-gray-300 font-semibold">Payment</th>
                  <th className="p-4 text-gray-300 font-semibold">Items</th>
                  <th className="p-4 text-gray-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-4">
                      <span className="font-mono text-blue-400 font-semibold">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">
                          {order.user?.name || "N/A"}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {order.user?.email || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="text-white">
                          {order.shippingInfo?.phone || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm max-w-xs">
                        <p className="text-white truncate">
                          {order.shippingInfo?.address || "N/A"}
                        </p>
                        <p className="text-gray-400">
                          {order.shippingInfo?.city},{" "}
                          {order.shippingInfo?.state}{" "}
                          {order.shippingInfo?.zipCode}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="text-green-400 font-semibold text-lg">
                        ${order.total?.toFixed(2) || "0.00"}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4">
                      <PaymentBadge status={order.paymentStatus} />
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="text-white font-medium">
                          {order.items?.length || 0} items
                        </p>
                        <p className="text-gray-400 truncate max-w-32">
                          {order.items?.[0]?.title}
                          {order.items?.length > 1 &&
                            ` +${order.items.length - 1} more`}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedOrder(null);
          }}
          onStatusUpdate={updateStatus}
        />
      </div>
    </div>
  );
}
