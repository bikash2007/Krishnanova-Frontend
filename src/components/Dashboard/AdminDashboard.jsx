// src/components/Dashboard/AdminDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaDollarSign,
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChartLine,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://krishnanova-backend.onrender.com/api";

// Animated Counter Component
const AnimatedCounter = ({
  value,
  prefix = "",
  suffix = "",
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!value && value !== 0) return;
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className="tabular-nums">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// Growth Indicator Component
const GrowthIndicator = ({ growth, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-2 flex items-center text-xs sm:text-sm text-gray-500">
        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 bg-gray-600 rounded animate-pulse"></div>
        <div className="w-20 h-3 bg-gray-600 rounded animate-pulse"></div>
      </div>
    );
  }

  if (growth === null || growth === undefined) {
    return (
      <div className="mt-2 flex items-center text-xs sm:text-sm text-gray-500">
        <svg
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <span>No data</span>
      </div>
    );
  }

  const isPositive = growth >= 0;
  const colorClass = isPositive ? "text-emerald-400" : "text-red-400";
  const icon = isPositive ? (
    <path
      fillRule="evenodd"
      d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  ) : (
    <path
      fillRule="evenodd"
      d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  );

  return (
    <div className={`mt-2 flex items-center text-xs sm:text-sm ${colorClass}`}>
      <svg
        className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        {icon}
      </svg>
      <span>
        {isPositive ? "+" : ""}
        {Math.abs(growth).toFixed(1)}% from last month
      </span>
    </div>
  );
};

// Stat Card Component
const StatCard = ({
  title,
  value,
  icon,
  color,
  prefix = "",
  suffix = "",
  delay = 0,
  growth = null,
  isLoading = false,
}) => (
  <div
    className={`relative overflow-hidden bg-gradient-to-br from-[#1e2139] to-[#23263a] p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 transform hover:scale-[1.02] sm:hover:scale-105 hover:shadow-2xl group`}
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Decorative glow effect */}
    <div
      className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-r ${color} opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity duration-500`}
    />

    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div
          className={`p-2.5 sm:p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        <div className="text-right">
          <div className="text-xs sm:text-sm text-gray-400 font-medium uppercase tracking-wider">
            {title}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-8 sm:h-10 bg-gray-600 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-600 rounded animate-pulse w-3/4"></div>
        </div>
      ) : (
        <>
          <div
            className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${color
              .replace("from-", "from-")
              .replace("to-", "to-")} bg-clip-text text-transparent`}
          >
            <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
          </div>
          <GrowthIndicator growth={growth} isLoading={isLoading} />
        </>
      )}
    </div>
  </div>
);

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="animate-pulse p-4 sm:p-6 lg:p-8">
    <div className="h-6 sm:h-8 bg-gray-700 rounded w-2/3 sm:w-1/3 mb-6 sm:mb-8"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-700 h-28 sm:h-32 rounded-2xl"></div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
      <div className="lg:col-span-2 bg-gray-700 h-64 sm:h-80 rounded-2xl"></div>
      <div className="bg-gray-700 h-64 sm:h-80 rounded-2xl"></div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [previousStats, setPreviousStats] = useState(null);
  const [orderTrend, setOrderTrend] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const [topStates, setTopStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Calculate growth percentages
  const calculateGrowth = useMemo(() => {
    if (!stats || !previousStats) return {};

    const calculatePercent = (current, previous) => {
      if (!previous || previous === 0) return null;
      return ((current - previous) / previous) * 100;
    };

    return {
      users: calculatePercent(stats.totalUsers, previousStats.totalUsers),
      products: calculatePercent(
        stats.totalProducts,
        previousStats.totalProducts,
      ),
      events: calculatePercent(stats.totalEvents, previousStats.totalEvents),
      orders: calculatePercent(stats.totalOrders, previousStats.totalOrders),
      revenue: calculatePercent(stats.totalRevenue, previousStats.totalRevenue),
    };
  }, [stats, previousStats]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      navigate("/");
      return;
    }

    const fetchDashboardData = async (isRetry = false) => {
      try {
        if (!isRetry) setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000, // 30 seconds timeout
        };

        const currentData = await axios.get(
          `${API_URL}/admin/dashboard`,
          config,
        );

        setStats(currentData.data.stats || {});
        setPreviousStats(null); // TODO: Implement backend endpoint for previous month data
        setOrderTrend(currentData.data.orderTrend || []);
        setAgeGroups(currentData.data.ageGroups || []);
        setTopStates(currentData.data.topStates || []);

        setRetryCount(0);
        // Add delay for smooth animation
        setTimeout(() => setLoading(false), 300);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        let errorMessage;
        if (error.code === "ECONNABORTED") {
          errorMessage =
            "Request timed out. The server is taking too long to respond. Please try again.";
        } else {
          errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Failed to load dashboard data";
        }
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 300000);

    return () => clearInterval(interval);
  }, [user, isAdmin, authLoading, navigate]);

  // Error retry handler
  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount((prev) => prev + 1);
      setError(null);
      setLoading(true);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#151922] to-[#1a1f2e] p-4 sm:p-6 lg:p-8">
        <LoadingSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#151922] to-[#1a1f2e] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center backdrop-blur-sm">
          <FaExclamationTriangle className="text-red-400 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-300 mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-red-200 mb-6">{error}</p>
          <div className="space-y-3">
            {retryCount < 3 ? (
              <button
                onClick={handleRetry}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                Retry ({3 - retryCount} attempts left)
              </button>
            ) : (
              <p className="text-red-300 text-sm">
                Please refresh the page or contact support
              </p>
            )}
            <button
              onClick={() => navigate("/")}
              className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#151922] to-[#1a1f2e] flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#01abfd] shadow-lg"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-2 border-[#01abfd] opacity-20"></div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: (orderTrend || []).map((d) => d.month),
    datasets: [
      {
        label: "Orders",
        data: (orderTrend || []).map((d) => d.orders),
        borderColor: "#01abfd",
        backgroundColor: "rgba(1,171,253,0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#01abfd",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: "Revenue ($)",
        data: (orderTrend || []).map((d) => d.revenue),
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb",
          font: { size: 14, weight: "600" },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#f9fafb",
        bodyColor: "#e5e7eb",
        borderColor: "#374151",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: { color: "#9ca3af", font: { size: 12 } },
        grid: { color: "rgba(75, 85, 99, 0.3)", drawBorder: false },
      },
      y: {
        ticks: { color: "#9ca3af", font: { size: 12 } },
        grid: { color: "rgba(75, 85, 99, 0.3)", drawBorder: false },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#151922] to-[#1a1f2e] py-4 sm:py-6 lg:py-8 px-2 sm:px-4 text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 lg:mb-12 animate-fadeInDown gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#01abfd] to-[#10b981] bg-clip-text text-transparent mb-1 sm:mb-2">
              Admin Dashboard
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-400">
              Monitor your business performance
            </p>
          </div>
          <button
            className="group relative bg-gradient-to-r from-[#01abfd] to-[#0189d1] text-white px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-[#0189d1] hover:to-[#01abfd] text-sm sm:text-base w-full sm:w-auto"
            onClick={() => navigate("/admin/orders")}
          >
            <span className="relative z-10 flex items-center justify-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-12 transition-transform duration-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Manage Orders
            </span>
          </button>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 lg:mb-12 animate-fadeInUp">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={<FaUsers className="w-6 h-6 text-white" />}
            color="from-blue-400 to-cyan-500"
            delay={0}
            growth={calculateGrowth.users}
            isLoading={loading}
          />
          <StatCard
            title="Total Products"
            value={stats?.totalProducts || 0}
            icon={<FaBox className="w-6 h-6 text-white" />}
            color="from-purple-400 to-pink-500"
            delay={100}
            growth={calculateGrowth.products}
            isLoading={loading}
          />
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon={<FaShoppingCart className="w-6 h-6 text-white" />}
            color="from-orange-400 to-red-500"
            delay={200}
            growth={calculateGrowth.orders}
            isLoading={loading}
          />
          <StatCard
            title="Total Revenue"
            value={stats?.totalRevenue || 0}
            prefix="$"
            icon={<FaDollarSign className="w-6 h-6 text-white" />}
            color="from-green-400 to-emerald-500"
            delay={300}
            growth={calculateGrowth.revenue}
            isLoading={loading}
          />
        </div>

        {/* Secondary Stats */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 lg:mb-12 animate-fadeInUp"
          style={{ animationDelay: "0.4s" }}
        >
          <StatCard
            title="Pending Orders"
            value={stats?.pendingOrders || 0}
            icon={<FaClock className="w-5 h-5 text-white" />}
            color="from-yellow-400 to-orange-500"
            delay={400}
            isLoading={loading}
          />
          <StatCard
            title="Shipped Orders"
            value={stats?.shippedOrders || 0}
            icon={<FaTruck className="w-5 h-5 text-white" />}
            color="from-blue-400 to-indigo-500"
            delay={500}
            isLoading={loading}
          />
          <StatCard
            title="Delivered Orders"
            value={stats?.deliveredOrders || 0}
            icon={<FaCheckCircle className="w-5 h-5 text-white" />}
            color="from-green-400 to-teal-500"
            delay={600}
            isLoading={loading}
          />
        </div>

        {/* Charts and Analytics Section */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 lg:mb-12 animate-fadeInUp"
          style={{ animationDelay: "600ms" }}
        >
          {/* Revenue/Order Trends Chart */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#1e2139] to-[#23263a] rounded-2xl shadow-xl border border-gray-700/50 p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center">
                <FaChartLine className="mr-3 text-[#01abfd]" />
                Sales & Orders Trend
              </h2>
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#01abfd] animate-pulse"></div>
                <div
                  className="w-3 h-3 rounded-full bg-[#10b981] animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>
            </div>
            <div className="h-64 sm:h-72 lg:h-80">
              {(orderTrend || []).length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <FaChartLine className="text-6xl mb-4 opacity-20" />
                  <p className="text-lg font-medium">No trend data available</p>
                  <p className="text-sm mt-2">
                    Data will appear once orders are placed
                  </p>
                </div>
              ) : (
                <Line data={chartData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Side Analytics */}
          <div className="bg-gradient-to-br from-[#1e2139] to-[#23263a] rounded-2xl shadow-xl border border-gray-700/50 p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-500">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-[#01abfd] to-[#10b981] rounded-lg mr-3 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              Age Groups
            </h2>
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {(ageGroups || []).length === 0 ? (
                <div className="text-gray-400 text-center py-4">
                  No data available
                </div>
              ) : (
                ageGroups.map((ag, index) => (
                  <div
                    key={ag.age}
                    className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/50 hover:to-gray-600/50 transition-all duration-300 transform hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="font-medium text-sm sm:text-base">
                      {ag.age}
                    </span>
                    <span className="text-[#01abfd] font-bold text-base sm:text-lg">
                      <AnimatedCounter value={ag.count} duration={1500} />
                    </span>
                  </div>
                ))
              )}
            </div>

            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-[#10b981] to-[#01abfd] rounded-lg mr-3 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              Top States
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {(topStates || []).length === 0 ? (
                <div className="text-gray-400 text-center py-4">
                  No data available
                </div>
              ) : (
                topStates.map((st, index) => (
                  <div
                    key={st.state}
                    className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/50 hover:to-gray-600/50 transition-all duration-300 transform hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 100 + 500}ms` }}
                  >
                    <span className="font-medium text-sm sm:text-base">
                      {st.state}
                    </span>
                    <span className="text-green-400 font-bold text-base sm:text-lg">
                      <AnimatedCounter value={st.count} duration={1500} />
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translate3d(0, -100%, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 100%, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}
