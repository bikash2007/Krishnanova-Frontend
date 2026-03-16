import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { useApi } from "../Context/baseUrl";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingBag,
  FaEye,
  FaTruck,
  FaCheck,
  FaClock,
  FaBox,
  FaDownload,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCreditCard,
  FaChevronRight,
  FaReceipt,
} from "react-icons/fa";

// Status configuration
const statusConfig = {
  processing: {
    color: "from-amber-400 to-orange-400",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    icon: FaClock,
  },
  shipped: {
    color: "from-blue-400 to-cyan-400",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/30",
    icon: FaTruck,
  },
  delivered: {
    color: "from-green-400 to-emerald-400",
    bgColor: "bg-green-500/10",
    textColor: "text-green-400",
    borderColor: "border-green-500/30",
    icon: FaCheck,
  },
  cancelled: {
    color: "from-red-400 to-rose-400",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400",
    borderColor: "border-red-500/30",
    icon: FaClock,
  },
};

// Status Badge Component
const StatusBadge = ({ status, size = "default" }) => {
  const config = statusConfig[status] || statusConfig.processing;
  const Icon = config.icon;

  const sizeClasses =
    size === "large" ? "px-4 py-2.5 text-sm" : "px-3 py-1.5 text-xs";

  return (
    <div
      className={`inline-flex items-center ${sizeClasses} rounded-full font-medium ${config.bgColor} ${config.textColor} ${config.borderColor} border backdrop-blur-sm`}
    >
      <Icon className="mr-2" size={size === "large" ? 14 : 12} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
};

// Order Detail Modal
const OrderDetailModal = ({ order, isOpen, onClose }) => {
  const baseUrl = useApi();

  if (!isOpen || !order) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-white/5 to-white/10 border-b border-white/10 px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-1">
                  Order Details
                </h2>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 text-sm font-mono">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white"
              >
                <svg
                  className="w-5 h-5"
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
          </div>

          <div className="p-8 max-h-[calc(90vh-120px)] overflow-y-auto">
            {/* Order Summary */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-[#01abfd]/20 flex items-center justify-center mr-3">
                      <FaCalendarAlt className="text-[#01abfd] text-sm" />
                    </div>
                    <span className="text-gray-400 text-sm font-medium">
                      Order Date
                    </span>
                  </div>
                </div>
                <p className="text-white font-semibold">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-[#f4c430]/20 flex items-center justify-center mr-3">
                      <FaCreditCard className="text-[#f4c430] text-sm" />
                    </div>
                    <span className="text-gray-400 text-sm font-medium">
                      Total Amount
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-[#f4c430]">
                  ${order.total.toFixed(2)}
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mr-3">
                      <FaBox className="text-purple-400 text-sm" />
                    </div>
                    <span className="text-gray-400 text-sm font-medium">
                      Payment Status
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    order.paymentStatus === "paid"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  }`}
                >
                  {order.paymentStatus?.charAt(0).toUpperCase() +
                    order.paymentStatus?.slice(1)}
                </span>
              </div>
            </div>

            {/* Shipping Information */}
            {order.shippingInfo && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-[#01abfd]/20 flex items-center justify-center mr-3">
                    <FaMapMarkerAlt className="text-[#01abfd] text-sm" />
                  </div>
                  Shipping Address
                </h3>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-gray-300 space-y-2">
                    <p className="font-medium text-white">
                      {order.shippingInfo.address}
                    </p>
                    <p className="text-gray-400">
                      {order.shippingInfo.city}, {order.shippingInfo.state}{" "}
                      {order.shippingInfo.zipCode}
                    </p>
                    <p className="text-gray-400">
                      {order.shippingInfo.country}
                    </p>
                    {order.shippingInfo.phone && (
                      <div className="flex items-center mt-3 pt-3 border-t border-white/10">
                        <span className="text-gray-500 text-sm mr-2">
                          Phone:
                        </span>
                        <span className="text-gray-300 font-medium">
                          {order.shippingInfo.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-[#01abfd]/20 flex items-center justify-center mr-3">
                    <FaReceipt className="text-[#01abfd] text-sm" />
                  </div>
                  Order Items ({order.items.length})
                </h3>
              </div>
              <div className="divide-y divide-white/5">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 hover:bg-white/5 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={item.image || baseUrl + "/placeholder.jpg"}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg border border-white/10"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#01abfd] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1 line-clamp-2">
                          {item.title}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>${item.price.toFixed(2)} each</span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-[#f4c430]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-white/5 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-[#f4c430]">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Order Card Component
const OrderCard = ({ order, index, onViewDetails }) => {
  const baseUrl = useApi();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 hover:bg-white/10 transition-all duration-300 group"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-white text-base">
                #{order._id.slice(-8).toUpperCase()}
              </h3>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Total
            </p>
            <p className="text-xl font-bold text-[#f4c430]">
              ${order.total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Order Info */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#01abfd]/20 flex items-center justify-center">
                <FaShoppingBag className="text-[#01abfd] text-sm" />
              </div>
              <span className="text-gray-400 text-sm font-medium">
                {order.items.length} item(s)
              </span>
            </div>
            <span
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                order.paymentStatus === "paid"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
              }`}
            >
              Payment {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Items Preview */}
        <div className="mb-6">
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {order.items.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex-shrink-0 relative">
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                  <img
                    src={item.image || baseUrl + "/placeholder.jpg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {item.quantity > 1 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#01abfd] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {item.quantity}
                    </span>
                  </div>
                )}
              </div>
            ))}
            {order.items.length > 4 && (
              <div className="flex-shrink-0 w-14 h-14 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                <span className="text-xs text-gray-400 font-medium">
                  +{order.items.length - 4}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={() => onViewDetails(order)}
          className="w-full bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 hover:border-white/30 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 group"
        >
          <FaEye className="text-sm group-hover:scale-110 transition-transform duration-200" />
          <span>View Details</span>
          <FaChevronRight className="text-xs ml-1 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </motion.div>
  );
};

// Empty State Component
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-20"
  >
    <div className="w-24 h-24 mx-auto mb-8 bg-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10">
      <FaShoppingBag className="text-[#01abfd] text-3xl" />
    </div>
    <h3 className="text-2xl font-semibold text-white mb-3">No Orders Yet</h3>
    <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
      You haven't placed any orders yet. Start exploring our products to create
      your first order!
    </p>
    <motion.a
      href="/productpage"
      className="inline-flex items-center px-6 py-3 bg-[#01abfd] hover:bg-[#0189d1] text-white rounded-xl font-medium transition-all duration-200"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <FaShoppingBag className="mr-2 text-sm" />
      Browse Products
    </motion.a>
  </motion.div>
);

// Main Component
export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/orders/mine",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "radial-gradient(circle at center, #5b21b6 0%, #2e1065 50%, #170726 100%)",
        }}
      >
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent border-t-[#01abfd] mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full h-12 w-12 border-2 border-[#01abfd]/20 mx-auto"></div>
          </div>
          <p className="text-gray-400 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at center, #5b21b6 0%, #2e1065 50%, #170726 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#f4c430] to-[#01abfd] bg-clip-text text-transparent mb-3">
            My Orders
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Track your orders, view details, and manage your purchase history
          </p>
        </motion.div>

        {orders.length > 0 && (
          <>
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-10"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
                  <input
                    type="text"
                    placeholder="Search orders or items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#01abfd]/50 focus:border-[#01abfd]/50 outline-none transition-all duration-200 text-white placeholder-gray-500"
                  />
                </div>
                <div className="relative min-w-[180px]">
                  <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#01abfd]/50 focus:border-[#01abfd]/50 outline-none transition-all duration-200 text-white appearance-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Orders Grid */}
            {filteredOrders.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map((order, index) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    index={index}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 bg-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10">
                  <FaSearch className="text-[#01abfd] text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  No Orders Found
                </h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Try adjusting your search criteria or filter settings to find
                  the orders you're looking for.
                </p>
              </div>
            )}
          </>
        )}

        {orders.length === 0 && <EmptyState />}

        {/* Order Detail Modal */}
        <OrderDetailModal
          order={selectedOrder}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedOrder(null);
          }}
        />
      </div>
    </div>
  );
}
