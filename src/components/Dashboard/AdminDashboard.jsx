// src/components/Dashboard/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
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
  Filler
);

const API_URL = import.meta.env.VITE_API_URL || "https://krishnanova-backend.onrender.com/api";

// Animated Counter Component
const AnimatedCounter = ({
  value,
  prefix = "",
  suffix = "",
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
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

// Stat Card Component
const StatCard = ({
  title,
  value,
  icon,
  color,
  prefix = "",
  suffix = "",
  delay = 0,
}) => (
  <div
    className={`bg-gradient-to-br from-[#1e2139] to-[#23263a] p-6 rounded-2xl shadow-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg`}>
        {icon}
      </div>
      <div className="text-right">
        <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">
          {title}
        </div>
      </div>
    </div>
    <div
      className={`text-3xl font-bold bg-gradient-to-r ${color
        .replace("from-", "from-")
        .replace("to-", "to-")} bg-clip-text text-transparent`}
    >
      <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
    </div>
    <div className="mt-2 flex items-center text-sm text-green-400">
      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
      <span>+12% from last month</span>
    </div>
  </div>
);

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-700 rounded w-1/3 mb-8"></div>
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-700 h-32 rounded-2xl"></div>
      ))}
    </div>
    <div className="grid md:grid-cols-3 gap-8 mb-8">
      <div className="md:col-span-2 bg-gray-700 h-80 rounded-2xl"></div>
      <div className="bg-gray-700 h-80 rounded-2xl"></div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [orderTrend, setOrderTrend] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const [topStates, setTopStates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      navigate("/");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${API_URL}/admin/dashboard`, config);

        setStats(res.data.stats || {});
        setOrderTrend(res.data.orderTrend || []);
        setAgeGroups(res.data.ageGroups || []);
        setTopStates(res.data.topStates || []);

        // Add slight delay for smooth animation
        setTimeout(() => setLoading(false), 500);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, isAdmin, authLoading, navigate]);

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
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#151922] to-[#1a1f2e] py-8 px-4 text-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 animate-fadeInDown">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#01abfd] to-[#10b981] bg-clip-text text-transparent mb-2">
              Admin Analytics Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Monitor your business performance and insights
            </p>
          </div>
          <button
            className="group relative bg-gradient-to-r from-[#01abfd] to-[#0189d1] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-[#0189d1] hover:to-[#01abfd] mt-4 md:mt-0"
            onClick={() => navigate("/admin/orders")}
          >
            <span className="relative z-10 flex items-center">
              <svg
                className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300"
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
        <div className="grid md:grid-cols-3 gap-8 mb-12 animate-fadeInUp">
          <StatCard
            title="Total Revenue"
            value={stats?.totalRevenue || 0}
            prefix="$"
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            }
            color="from-green-400 to-emerald-500"
            delay={0}
          />
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8.5 13a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z"
                  clipRule="evenodd"
                />
              </svg>
            }
            color="from-blue-400 to-cyan-500"
            delay={200}
          />
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            }
            color="from-purple-400 to-pink-500"
            delay={400}
          />
        </div>

        {/* Charts and Analytics Section */}
        <div
          className="grid md:grid-cols-3 gap-8 mb-12 animate-fadeInUp"
          style={{ animationDelay: "600ms" }}
        >
          {/* Revenue/Order Trends Chart */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#1e2139] to-[#23263a] rounded-2xl shadow-xl border border-gray-700/50 p-8 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
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
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Side Analytics */}
          <div className="bg-gradient-to-br from-[#1e2139] to-[#23263a] rounded-2xl shadow-xl border border-gray-700/50 p-8 hover:shadow-2xl transition-all duration-500">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
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
            <div className="space-y-4 mb-8">
              {(ageGroups || []).length === 0 ? (
                <div className="text-gray-400 text-center py-4">
                  No data available
                </div>
              ) : (
                ageGroups.map((ag, index) => (
                  <div
                    key={ag.age}
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/50 hover:to-gray-600/50 transition-all duration-300 transform hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="font-medium">{ag.age}</span>
                    <span className="text-[#01abfd] font-bold text-lg">
                      <AnimatedCounter value={ag.count} duration={1500} />
                    </span>
                  </div>
                ))
              )}
            </div>

            <h2 className="text-2xl font-bold mb-6 flex items-center">
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
            <div className="space-y-4">
              {(topStates || []).length === 0 ? (
                <div className="text-gray-400 text-center py-4">
                  No data available
                </div>
              ) : (
                topStates.map((st, index) => (
                  <div
                    key={st.state}
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/50 hover:to-gray-600/50 transition-all duration-300 transform hover:scale-105"
                    style={{ animationDelay: `${index * 100 + 500}ms` }}
                  >
                    <span className="font-medium">{st.state}</span>
                    <span className="text-green-400 font-bold text-lg">
                      <AnimatedCounter value={st.count} duration={1500} />
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Order Status Cards */}
        <div
          className="grid md:grid-cols-3 gap-8 animate-fadeInUp"
          style={{ animationDelay: "800ms" }}
        >
          <StatCard
            title="Pending Orders"
            value={stats?.pendingOrders || 0}
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            }
            color="from-yellow-400 to-orange-500"
            delay={0}
          />
          <StatCard
            title="Shipped Orders"
            value={stats?.shippedOrders || 0}
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707L16 7.586A1 1 0 0015.414 7H14z" />
              </svg>
            }
            color="from-blue-400 to-indigo-500"
            delay={200}
          />
          <StatCard
            title="Delivered Orders"
            value={stats?.deliveredOrders || 0}
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            }
            color="from-green-400 to-emerald-500"
            delay={400}
          />
        </div>
      </div>

      <style jsx>{`
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
