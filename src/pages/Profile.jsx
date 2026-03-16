import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useApi } from "../Context/baseUrl";
import {
  SangaProvider,
  useSanga,
  EMOTIONAL_RASAS,
} from "../components/Community/SangaSystem";
import {
  FaCrown,
  FaGem,
  FaOm,
  FaPray,
  FaFire,
  FaTrophy,
  FaScroll,
  FaStar,
  FaCog,
  FaMedal,
  FaExclamationTriangle,
  FaHourglass,
  FaHeart,
  FaCheck,
} from "react-icons/fa";
import {
  GiFeather,
  GiFlute,
  GiPrayerBeads,
  GiCandleLight,
  GiMeditation,
  GiLotus,
} from "react-icons/gi";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Inner profile content that uses Sanga context
function ProfileContent() {
  const { user, logout, setUser } = useAuth();
  const baseUrl = useApi();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [krishnaStats, setKrishnaStats] = useState(null);
  const [wisdomData, setWisdomData] = useState(null);

  // Refs for GSAP
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const cardsRef = useRef([]);
  const avatarRef = useRef(null);

  // SEO Implementation
  useEffect(() => {
    document.title = `${
      user?.name || "Profile"
    } | Krishnova - Your Divine Account`;

    const metaDescription = document.querySelector('meta[name="description"]');
    const description =
      "Manage your Krishnova account, track orders, view purchase history, and access exclusive spiritual content.";

    if (metaDescription) {
      metaDescription.content = description;
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    return () => {
      document.title = "Krishnova - Authentic Krishna Spiritual Products";
    };
  }, [user]);

  // GSAP Animations
  useEffect(() => {
    if (user && containerRef.current) {
      const ctx = gsap.context(() => {
        // Container entrance
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, scale: 0.9, y: 50 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
        );

        // Avatar animation
        if (avatarRef.current) {
          gsap.fromTo(
            avatarRef.current,
            { scale: 0, rotation: -180 },
            {
              scale: 1,
              rotation: 0,
              duration: 1,
              delay: 0.3,
              ease: "back.out(1.7)",
            },
          );

          // Continuous floating animation
          gsap.to(avatarRef.current, {
            y: -10,
            duration: 2,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true,
          });
        }

        // Header animation
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: -30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.5,
            ease: "power3.out",
          },
        );

        // Cards stagger animation
        gsap.fromTo(
          cardsRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.7,
            ease: "power3.out",
          },
        );

        // Floating elements
        gsap.to(".floating-element", {
          y: -20,
          duration: 3,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
          stagger: 0.3,
        });

        // Rotating sacred symbols
        gsap.to(".rotating-symbol", {
          rotation: 360,
          duration: 20,
          ease: "none",
          repeat: -1,
        });
      }, containerRef);

      return () => ctx.revert();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Fetch Krishna game stats
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const uid = user.id || user._id;

    // Fetch Krishna game stats
    fetch(`${baseUrl}/api/krishna/stats/${uid}`, { headers })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setKrishnaStats(data.stats);
      })
      .catch(() => {});

    // Fetch Wisdom Portal data
    fetch(`${baseUrl}/api/krishna/wisdom-portal/data/${uid}`, { headers })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setWisdomData(data.data);
      })
      .catch(() => {});
  }, [user, baseUrl]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Input animation
    gsap.to(e.target, {
      scale: 1.02,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);

      setMessage("Profile blessed and updated successfully!");
      setIsEditing(false);

      // Success animation
      gsap.fromTo(
        ".success-message",
        { scale: 0, opacity: 0, rotation: -10 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
      );

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Logout animation
    gsap.to(containerRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        logout();
        navigate("/login");
      },
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-white/20 max-w-md mx-auto"
        >
          <h2 className="text-2xl font-bold text-purple-200 mb-4">
            Please Login to Continue
          </h2>
          <motion.button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.15),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.1),transparent_50%)] pointer-events-none" />

      {/* Floating Krishna Elements */}
      <motion.div
        className="floating-element fixed top-20 left-10 text-5xl opacity-10 pointer-events-none hidden lg:block"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <GiFeather className="text-purple-300" />
      </motion.div>

      <motion.div
        className="floating-element fixed bottom-20 right-10 text-5xl opacity-10 pointer-events-none hidden lg:block text-indigo-300"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <GiFlute />
      </motion.div>

      {/* Subtle Floating Orbs */}
      <motion.div
        className="fixed top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none hidden lg:block"
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="pt-20 pb-8 px-4 lg:px-8 relative z-10 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
          >
            {/* Premium Header */}
            <div
              ref={headerRef}
              className="relative bg-gradient-to-br from-purple-600/30 via-indigo-600/30 to-blue-600/30 backdrop-blur-lg border-b border-white/10"
            >
              {/* Subtle Pattern overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]" />

              <div className="relative p-8 pt-10 pb-6">
                {/* Role Badge - Top Right */}
                {user.role === "admin" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-6 right-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg border border-purple-400/50 flex items-center gap-2"
                  >
                    <FaCrown className="text-yellow-300" />
                    ADMIN
                  </motion.div>
                )}

                <div className="flex flex-col items-center">
                  <motion.div
                    ref={avatarRef}
                    className="w-24 h-24 lg:w-28 lg:h-28 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-4xl font-bold text-white mx-auto mb-4 border-4 border-purple-400/30 shadow-2xl relative overflow-hidden"
                  >
                    {user.avatar ? (
                      <img
                        src={
                          user.isGoogleUser && user.avatar.startsWith("http")
                            ? user.avatar
                            : user.avatar.startsWith("/uploads")
                              ? `${baseUrl}${user.avatar}`
                              : user.avatar.startsWith("http")
                                ? user.avatar
                                : `${baseUrl}/uploads/${user.avatar}`
                        }
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`bg-gradient-to-br from-purple-400 to-indigo-500 w-full h-full rounded-full flex items-center justify-center absolute inset-0 ${user.avatar ? "hidden" : ""}`}
                    >
                      {user.name?.charAt(0).toUpperCase() || "K"}
                    </div>

                    {/* Subtle ring effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-purple-400/30"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* Name & Email */}
                  <div className="text-center space-y-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">
                      {user.name}
                    </h1>
                    <p className="text-purple-200/80 text-sm">{user.email}</p>

                    {/* Member Since */}
                    <div className="flex items-center justify-center gap-2 text-xs text-white/60 mt-2">
                      <GiPrayerBeads className="text-purple-300" />
                      <span>
                        Member since{" "}
                        {new Date(
                          user.createdAt || Date.now(),
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Bhakti Rasa Badge */}
                    <BhaktiRasaBadge />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 bg-white/5">
              {["profile", "spiritual"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-4 font-medium capitalize transition-all text-sm ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-200 border-b-2 border-purple-400"
                      : "text-white/60 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  {tab === "profile" && "Profile"}
                  {tab === "spiritual" && "Journey"}
                </button>
              ))}
            </div>

            {/* Profile Content */}
            <div ref={contentRef} className="p-6 lg:p-8">
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`success-message mb-6 p-4 rounded-xl backdrop-blur-md ${
                    message.includes("success")
                      ? "bg-green-400/20 border border-green-400/30 text-green-300"
                      : "bg-red-400/20 border border-red-400/30 text-red-300"
                  }`}
                >
                  {message}
                </motion.div>
              )}

              {activeTab === "profile" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                  {/* Profile Information */}
                  <div ref={(el) => (cardsRef.current[0] = el)}>
                    <h2 className="text-xl font-bold text-purple-200 mb-4 flex items-center gap-2">
                      <FaCog className="text-purple-400" />
                      Account Information
                    </h2>

                    {isEditing ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-purple-400/30 bg-white/5 backdrop-blur-md text-white placeholder-white/40 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-purple-400/30 bg-white/5 backdrop-blur-md text-white placeholder-white/40 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
                            required
                          />
                        </div>

                        <div className="flex gap-4 pt-4">
                          <motion.button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 hover:shadow-purple-500/50 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {loading ? "Saving..." : "Save Changes"}
                          </motion.button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditing(false);
                              setFormData({
                                name: user.name || "",
                                email: user.email || "",
                              });
                            }}
                            className="flex-1 border border-purple-400/50 text-purple-200 py-3 rounded-xl font-semibold backdrop-blur-md bg-white/5 hover:bg-purple-400/10 hover:border-purple-400 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-3">
                        <motion.div
                          className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-xl border border-white/20"
                          whileHover={{ scale: 1.02 }}
                        >
                          <label className="block text-xs font-medium text-purple-300 mb-1">
                            Name
                          </label>
                          <p className="text-base font-semibold text-white">
                            {user.name}
                          </p>
                        </motion.div>

                        <motion.div
                          className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-xl border border-white/20"
                          whileHover={{ scale: 1.02 }}
                        >
                          <label className="block text-xs font-medium text-purple-300 mb-1">
                            Email
                          </label>
                          <p className="text-base font-semibold text-white break-all">
                            {user.email}
                          </p>
                        </motion.div>

                        <motion.div
                          className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-xl border border-white/20"
                          whileHover={{ scale: 1.02 }}
                        >
                          <label className="block text-xs font-medium text-purple-300 mb-1">
                            Role
                          </label>
                          <p className="text-base font-semibold text-white capitalize flex items-center gap-2">
                            {user.role === "admin" ? "Administrator" : "Member"}
                          </p>
                        </motion.div>

                        <motion.button
                          onClick={() => setIsEditing(true)}
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-purple-500/50 transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Edit Profile
                        </motion.button>
                      </div>
                    )}
                  </div>

                  {/* Account Actions */}
                  <div
                    ref={(el) => (cardsRef.current[1] = el)}
                    className="xl:col-span-2"
                  >
                    <h2 className="text-xl font-bold text-purple-200 mb-4 flex items-center gap-2">
                      <FaOm className="text-purple-400" />
                      Quick Actions
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <motion.div
                        className="backdrop-blur-md bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 rounded-xl border border-green-400/30"
                        whileHover={{ scale: 1.02 }}
                      >
                        <h3 className="font-medium text-green-300 mb-2 flex items-center gap-2 text-sm">
                          <FaOm />
                          Status
                        </h3>
                        <div className="flex items-center gap-2">
                          <motion.span
                            className="w-2 h-2 bg-green-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span className="text-green-300 font-medium text-sm">
                            Active
                          </span>
                        </div>
                      </motion.div>

                      <motion.div
                        className="backdrop-blur-md bg-gradient-to-br from-indigo-500/10 to-blue-500/10 p-4 rounded-xl border border-indigo-400/30"
                        whileHover={{ scale: 1.02 }}
                      >
                        <h3 className="font-medium text-indigo-300 mb-2 flex items-center gap-2 text-sm">
                          <GiPrayerBeads /> Member Since
                        </h3>
                        <p className="text-indigo-200 text-sm">
                          {new Date(
                            user.createdAt || Date.now(),
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </motion.div>

                      {user.role === "admin" && (
                        <motion.div
                          className="backdrop-blur-md bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-xl border border-indigo-400/30"
                          whileHover={{ scale: 1.02 }}
                        >
                          <h3 className="font-medium text-indigo-300 mb-2 flex items-center gap-2 text-sm">
                            <FaCrown className="text-yellow-400" /> Admin Panel
                          </h3>
                          <motion.button
                            onClick={() => navigate("/admin/dashboard")}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg text-sm w-full hover:shadow-indigo-500/50 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Open Dashboard
                          </motion.button>
                        </motion.div>
                      )}

                      <motion.div
                        className="backdrop-blur-md bg-gradient-to-br from-red-500/10 to-pink-500/10 p-4 rounded-xl border border-red-400/30"
                        whileHover={{ scale: 1.02 }}
                      >
                        <h3 className="font-medium text-red-300 mb-2 flex items-center gap-2 text-sm">
                          <FaExclamationTriangle />
                          Logout
                        </h3>
                        <motion.button
                          onClick={handleLogout}
                          className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg text-sm w-full"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Leave Realm
                        </motion.button>
                      </motion.div>
                    </div>
                  </div>

                  {/* Krishna Game Stats */}
                  {krishnaStats && krishnaStats.totalCatches > 0 && (
                    <div
                      ref={(el) => (cardsRef.current[2] = el)}
                      className="md:col-span-2 xl:col-span-3"
                    >
                      <h2 className="text-xl font-bold text-purple-200 mb-4 flex items-center gap-2">
                        <GiFlute /> Krishna Game Stats
                      </h2>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        {/* Total Catches */}
                        <motion.div
                          className="backdrop-blur-md bg-gradient-to-br from-purple-500/15 to-indigo-500/15 p-4 rounded-xl border border-purple-400/30 text-center"
                          whileHover={{ scale: 1.03 }}
                        >
                          <GiFeather className="text-3xl mb-2 text-purple-300 mx-auto" />
                          <div className="text-2xl font-bold text-purple-300">
                            {krishnaStats.totalCatches}
                          </div>
                          <div className="text-xs text-purple-200/60">
                            Times Caught
                          </div>
                        </motion.div>

                        {/* Last Catch */}
                        <motion.div
                          className="backdrop-blur-md bg-gradient-to-br from-blue-500/15 to-cyan-500/15 p-4 rounded-xl border border-blue-400/30 text-center"
                          whileHover={{ scale: 1.03 }}
                        >
                          <div className="text-3xl mb-2 text-blue-300">
                            <FaHourglass className="inline" />
                          </div>
                          <div className="text-sm font-bold text-blue-300">
                            {krishnaStats.lastCatchAgo || "Never"}
                          </div>
                          <div className="text-xs text-blue-200/60">
                            Last Caught
                          </div>
                        </motion.div>

                        {/* Current Keychain */}
                        <motion.div
                          className="backdrop-blur-md bg-gradient-to-br from-pink-500/15 to-purple-500/15 p-4 rounded-xl border border-pink-400/30 text-center"
                          whileHover={{ scale: 1.03 }}
                        >
                          <div className="text-3xl mb-2">
                            <FaCrown className="w-8 h-8 mx-auto text-yellow-400" />
                          </div>
                          <div className="text-sm font-bold text-pink-300 truncate px-1">
                            {krishnaStats.currentKeychain || "None"}
                          </div>
                          <div className="text-xs text-pink-200/60">
                            Current Keychain
                          </div>
                        </motion.div>

                        {/* Rare Catches */}
                        <motion.div
                          className="backdrop-blur-md bg-gradient-to-br from-emerald-500/15 to-green-500/15 p-4 rounded-xl border border-emerald-400/30 text-center"
                          whileHover={{ scale: 1.03 }}
                        >
                          <div className="text-2xl sm:text-3xl mb-1">
                            <FaGem className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-emerald-400" />
                          </div>
                          <div className="text-xl sm:text-2xl font-bold text-emerald-300">
                            {krishnaStats.recentCatches?.filter(
                              (c) => c.rarity === "rare",
                            ).length || 0}
                          </div>
                          <div className="text-xs text-emerald-200/60">
                            Rare Catches
                          </div>
                        </motion.div>
                      </div>

                      {/* Recent Catch History */}
                      {krishnaStats.recentCatches?.length > 0 && (
                        <div className="backdrop-blur-md bg-gradient-to-br from-white/5 to-white/10 p-4 rounded-xl border border-white/20">
                          <h3 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                            <FaScroll className="inline" /> Recent Catches
                          </h3>
                          <div className="space-y-1.5 max-h-40 overflow-y-auto">
                            {krishnaStats.recentCatches.map((c, i) => (
                              <div
                                key={i}
                                className={`flex items-center justify-between text-xs p-2 rounded-lg ${
                                  c.rarity === "rare"
                                    ? "bg-yellow-500/10 border border-yellow-400/20"
                                    : "bg-white/5 border border-white/10"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span>
                                    {c.rarity === "rare" ? (
                                      <FaStar className="inline text-yellow-300" />
                                    ) : (
                                      <GiLotus className="inline text-purple-300" />
                                    )}
                                  </span>
                                  <span
                                    className={
                                      c.rarity === "rare"
                                        ? "text-yellow-300 font-semibold"
                                        : "text-gray-300"
                                    }
                                  >
                                    {c.keychainName}
                                  </span>
                                </div>
                                <span className="text-gray-400">
                                  {new Date(c.caughtAt).toLocaleDateString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "spiritual" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-amber-200 mb-4 flex items-center gap-2">
                    <FaOm className="text-amber-400" />
                    Your Spiritual Journey
                  </h2>

                  {/* Bhakti Rasa Selector */}
                  <BhaktiRasaSelector />

                  {wisdomData ? (
                    <>
                      {/* Level & XP Progress */}
                      <div className="backdrop-blur-md bg-gradient-to-br from-purple-600/30 to-purple-800/30 p-4 rounded-xl border border-purple-400/30">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-amber-300 font-semibold text-lg">
                            Level {wisdomData.level}
                          </span>
                          <span className="text-xs text-purple-200/70">
                            {wisdomData.experience} / {wisdomData.level * 100}{" "}
                            XP
                          </span>
                        </div>
                        <div className="w-full bg-purple-900/40 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all shadow-lg shadow-amber-500/50"
                            style={{
                              width: `${Math.min(100, (wisdomData.experience / (wisdomData.level * 100)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Real Stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <motion.div
                          className="backdrop-blur-md bg-gradient-to-br from-purple-600/30 to-purple-800/30 p-4 rounded-xl border border-purple-400/30 text-center"
                          whileHover={{ scale: 1.02 }}
                        >
                          <GiPrayerBeads className="text-3xl mb-2 text-purple-300 mx-auto" />
                          <div className="text-2xl font-bold text-white">
                            {wisdomData.stats?.totalChants?.toLocaleString() ||
                              0}
                          </div>
                          <div className="text-xs text-purple-200/60">
                            Total Chants
                          </div>
                        </motion.div>

                        <motion.div
                          className="backdrop-blur-md bg-gradient-to-br from-purple-600/30 to-purple-800/30 p-4 rounded-xl border border-purple-400/30 text-center"
                          whileHover={{ scale: 1.02 }}
                        >
                          <GiMeditation className="text-3xl mb-2 text-amber-300 mx-auto" />
                          <div className="text-2xl font-bold text-white">
                            {wisdomData.stats?.totalMeditationTime || 0} min
                          </div>
                          <div className="text-xs text-purple-200/60">
                            Meditation Time
                          </div>
                        </motion.div>

                        <motion.div
                          className="backdrop-blur-md bg-gradient-to-br from-purple-600/30 to-purple-800/30 p-4 rounded-xl border border-purple-400/30 text-center"
                          whileHover={{ scale: 1.02 }}
                        >
                          <FaFire className="text-3xl mb-2 text-amber-400 mx-auto" />
                          <div className="text-2xl font-bold text-white">
                            {wisdomData.stats?.meditationStreak || 0}
                          </div>
                          <div className="text-xs text-purple-200/60">
                            Day Streak
                          </div>
                        </motion.div>

                        <motion.div
                          className="backdrop-blur-md bg-gradient-to-br from-purple-600/30 to-purple-800/30 p-4 rounded-xl border border-purple-400/30 text-center"
                          whileHover={{ scale: 1.02 }}
                        >
                          <FaTrophy className="text-3xl mb-2 text-amber-400 mx-auto" />
                          <div className="text-2xl font-bold text-white">
                            {wisdomData.achievements?.length || 0}
                          </div>
                          <div className="text-xs text-purple-200/60">
                            Achievements
                          </div>
                        </motion.div>
                      </div>

                      {/* Yoga Practices */}
                      <div className="backdrop-blur-md bg-gradient-to-br from-purple-600/30 to-purple-800/30 p-4 rounded-xl border border-purple-400/30">
                        <h3 className="text-sm font-semibold text-amber-300 mb-3 flex items-center gap-2">
                          <FaOm className="inline" /> Yoga Practices
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            {
                              name: "Bhakti",
                              value: wisdomData.practices?.bhaktiYoga || 0,
                              color:
                                "from-pink-500/30 to-rose-500/30 border-pink-400/40",
                            },
                            {
                              name: "Karma",
                              value: wisdomData.practices?.karmaYoga || 0,
                              color:
                                "from-blue-500/30 to-cyan-500/30 border-blue-400/40",
                            },
                            {
                              name: "Jnana",
                              value: wisdomData.practices?.jnanaYoga || 0,
                              color:
                                "from-purple-500/30 to-violet-500/30 border-purple-400/40",
                            },
                            {
                              name: "Raja",
                              value: wisdomData.practices?.rajaYoga || 0,
                              color:
                                "from-purple-600/30 to-indigo-600/30 border-purple-400/40",
                            },
                          ].map((yoga) => (
                            <div
                              key={yoga.name}
                              className={`bg-gradient-to-br ${yoga.color} p-2.5 rounded-lg border text-center`}
                            >
                              <div className="text-xs text-purple-200/70 mb-0.5">
                                {yoga.name} Yoga
                              </div>
                              <div className="text-xl font-bold text-white">
                                {yoga.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Achievements */}
                      {wisdomData.achievements?.length > 0 && (
                        <div className="backdrop-blur-md bg-gradient-to-br from-purple-600/30 to-purple-800/30 p-4 rounded-xl border border-purple-400/30">
                          <h3 className="text-sm font-semibold text-amber-300 mb-3 flex items-center gap-2">
                            <FaMedal className="inline" /> Achievements
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {wisdomData.achievements.map((a, i) => (
                              <div
                                key={i}
                                className="bg-purple-700/20 border border-purple-500/30 p-3 rounded-lg text-center hover:bg-purple-600/30 transition-all"
                              >
                                <div className="text-3xl mb-2">
                                  {a.icon || (
                                    <FaMedal className="text-amber-400" />
                                  )}
                                </div>
                                <div className="text-xs font-semibold text-white">
                                  {a.name}
                                </div>
                                <div className="text-xs text-purple-200/60 truncate">
                                  {a.description}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <FaOm className="text-5xl mb-4 mx-auto text-amber-400/80" />
                      <p className="text-purple-200/70 mb-4">
                        Begin your spiritual journey through the Wisdom Portal
                      </p>
                      <motion.button
                        onClick={() => navigate("/")}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-amber-500/50 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Go to Wisdom Portal
                      </motion.button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute -bottom-4 -right-4 text-6xl text-purple-400/10 pointer-events-none hidden lg:block"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            ॐ
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── Bhakti Rasa Badge (shown in profile header) ──────
function BhaktiRasaBadge() {
  let rasa = null;
  try {
    const { getSelectedRasa } = useSanga();
    const rasaId = getSelectedRasa();
    if (rasaId) {
      rasa = Object.values(EMOTIONAL_RASAS).find((r) => r.id === rasaId);
    }
  } catch {
    // SangaProvider not available; graceful fallback
  }
  if (!rasa) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${rasa.color} text-white text-sm font-medium shadow-lg`}
    >
      <span className="text-base">{rasa.emoji}</span>
      <span>{rasa.name}</span>
      <span className="opacity-70 text-xs">· {rasa.meaning}</span>
    </motion.div>
  );
}

// ─── Bhakti Rasa Selector (shown in spiritual tab) ──────
function BhaktiRasaSelector() {
  let contextAvailable = false;
  let getSelectedRasa, setSelectedRasa;
  try {
    const sanga = useSanga();
    getSelectedRasa = sanga.getSelectedRasa;
    setSelectedRasa = sanga.setSelectedRasa;
    contextAvailable = true;
  } catch {
    // SangaProvider not available
  }

  const currentRasa = contextAvailable ? getSelectedRasa() : null;
  const rasas = Object.values(EMOTIONAL_RASAS);

  const handleSelect = async (rasaId) => {
    if (!contextAvailable) return;
    const newRasa = currentRasa === rasaId ? null : rasaId;
    await setSelectedRasa(newRasa);
  };

  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-4 sm:p-5 rounded-xl border border-purple-400/30">
      <h3 className="text-sm font-semibold text-amber-300 mb-1 flex items-center gap-2">
        <FaHeart className="text-pink-400" />
        Your Bhakti Rasa
      </h3>
      <p className="text-xs text-purple-200/60 mb-4">
        Choose the one rasa that best describes your relationship with the Divine. This will be displayed on your profile.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {rasas.map((rasa) => {
          const isSelected = currentRasa === rasa.id;
          return (
            <motion.button
              key={rasa.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(rasa.id)}
              className={`relative text-left p-3 sm:p-4 rounded-xl transition-all duration-200 ${
                isSelected
                  ? `bg-gradient-to-br ${rasa.color}/25 border-2 border-white/40 shadow-lg`
                  : "bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`text-2xl mt-0.5 ${isSelected ? "" : "opacity-60"}`}>
                  {rasa.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`font-bold text-sm ${isSelected ? "text-white" : "text-blue-100/80"}`}>
                      {rasa.name}
                    </p>
                    {rasa.sanskrit && (
                      <span className="text-[10px] text-white/40">
                        {rasa.sanskrit}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 ${isSelected ? "text-white/70" : "text-blue-100/50"}`}>
                    {rasa.meaning}
                  </p>
                  <p className={`text-[11px] mt-1.5 leading-relaxed ${isSelected ? "text-white/60" : "text-blue-100/40"} line-clamp-2`}>
                    {rasa.description}
                  </p>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5"
                  >
                    <FaCheck size={10} className="text-white" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Main export wrapped with SangaProvider
export default function Profile() {
  return (
    <SangaProvider>
      <ProfileContent />
    </SangaProvider>
  );
}
