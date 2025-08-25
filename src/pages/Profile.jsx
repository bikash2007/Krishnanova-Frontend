import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";
import { useApi } from "../Context/baseUrl";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function Profile() {
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
          }
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
            }
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
          }
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
          }
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

      setMessage("Profile blessed and updated successfully! 🙏");
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
        }
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
          className="text-center backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 border border-white/20"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-4">
            Please enter the divine realm
          </h2>
          <motion.button
            onClick={() => navigate("/login")}
            className="group relative px-8 py-3 overflow-hidden rounded-full shadow-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
            <span className="relative text-white font-semibold">
              Go to Login
            </span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      <Navigation />

      {/* Background Patterns */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
          linear-gradient(to right, #fbbf24 1px, transparent 1px),
          linear-gradient(to bottom, #fbbf24 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating Krishna Elements */}
      <motion.div
        className="floating-element fixed top-20 left-10 text-6xl opacity-20 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        🦚
      </motion.div>

      <motion.div
        className="floating-element fixed bottom-20 right-10 text-6xl opacity-20 pointer-events-none"
        animate={{ rotate: -360, y: [0, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      >
        🪈
      </motion.div>

      {/* Floating Orbs */}
      <motion.div
        className="fixed top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 blur-3xl pointer-events-none"
        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="py-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-3xl shadow-2xl border border-white/20 hover:border-amber-400/50 transition-all duration-300 overflow-hidden"
          >
            {/* Header */}
            <div
              ref={headerRef}
              className="bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 p-8 text-center relative"
            >
              {/* Pattern overlay */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Sacred Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-5 py-2.5 shadow-lg mb-6"
              >
                <span className="text-white animate-pulse text-lg">✦</span>
                <span className="text-white font-medium tracking-wide text-sm">
                  Divine Devotee Profile
                </span>
                <span className="text-white animate-pulse text-lg">✦</span>
              </motion.div>

              <div className="relative inline-block">
                <motion.div
                  ref={avatarRef}
                  className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-5xl font-bold text-white mx-auto mb-4 border-4 border-white/30 shadow-2xl relative overflow-hidden"
                >
                  {user.avatar ? (
                    <img
                      src={
                        user.isGoogleUser && user.avatar.startsWith("http")
                          ? user.avatar
                          : `${user.avatar}`
                      }
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-amber-300 to-orange-400 w-full h-full rounded-full flex items-center justify-center">
                      {user.name?.charAt(0).toUpperCase() || "🕉️"}
                    </div>
                  )}

                  {/* Glowing ring effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-amber-300/50"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                {user.role === "admin" && (
                  <motion.div
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span>👑</span> DIVINE ADMIN
                  </motion.div>
                )}
              </div>

              <h1 className="text-3xl font-bold text-white mb-2 relative z-10">
                {user.name}
              </h1>
              <p className="text-white/90 relative z-10">{user.email}</p>

              {/* Sanskrit blessing */}
              <p className="text-white/70 text-sm mt-2 italic">
                सर्वे भवन्तु सुखिनः
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-amber-400/20 bg-white/5">
              {["profile", "spiritual", "settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 px-6 font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-amber-400/20 to-orange-500/20 text-amber-300 border-b-2 border-amber-400"
                      : "text-blue-100/60 hover:text-amber-200 hover:bg-white/5"
                  }`}
                >
                  {tab === "profile" && "🙏 Profile"}
                  {tab === "spiritual" && "🕉️ Spiritual Journey"}
                  {tab === "settings" && "⚙️ Settings"}
                </button>
              ))}
            </div>

            {/* Profile Content */}
            <div ref={contentRef} className="p-8">
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
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Profile Information */}
                  <div ref={(el) => (cardsRef.current[0] = el)}>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-6">
                      Divine Information
                    </h2>

                    {isEditing ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-amber-200 mb-2">
                            Sacred Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-amber-400/30 bg-white/10 backdrop-blur-md text-white placeholder-blue-100/50 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-amber-200 mb-2">
                            Divine Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-amber-400/30 bg-white/10 backdrop-blur-md text-white placeholder-blue-100/50 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                            required
                          />
                        </div>

                        <div className="flex gap-4 pt-4">
                          <motion.button
                            type="submit"
                            disabled={loading}
                            className="flex-1 group relative px-6 py-3 overflow-hidden rounded-full shadow-2xl disabled:opacity-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                            <span className="relative text-white font-semibold">
                              {loading ? "Blessing..." : "Save Sacred Changes"}
                            </span>
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
                            className="flex-1 border-2 border-amber-400/50 text-amber-200 py-3 rounded-full font-semibold backdrop-blur-md bg-white/5 hover:bg-amber-400/10 hover:border-amber-400 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <motion.div
                          className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-xl border border-white/20"
                          whileHover={{ scale: 1.02 }}
                        >
                          <label className="block text-sm font-medium text-cyan-300 mb-1">
                            Sacred Name
                          </label>
                          <p className="text-lg font-semibold text-amber-200">
                            {user.name}
                          </p>
                        </motion.div>

                        <motion.div
                          className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-xl border border-white/20"
                          whileHover={{ scale: 1.02 }}
                        >
                          <label className="block text-sm font-medium text-cyan-300 mb-1">
                            Divine Email
                          </label>
                          <p className="text-lg font-semibold text-amber-200">
                            {user.email}
                          </p>
                        </motion.div>

                        <motion.div
                          className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-xl border border-white/20"
                          whileHover={{ scale: 1.02 }}
                        >
                          <label className="block text-sm font-medium text-cyan-300 mb-1">
                            Spiritual Role
                          </label>
                          <p className="text-lg font-semibold text-amber-200 capitalize flex items-center gap-2">
                            {user.role === "admin"
                              ? "👑 Divine Admin"
                              : "🙏 Blessed Devotee"}
                          </p>
                        </motion.div>

                        <motion.button
                          onClick={() => setIsEditing(true)}
                          className="w-full group relative px-6 py-3 overflow-hidden rounded-full shadow-2xl mt-6"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                          <span className="relative text-white font-semibold">
                            ✏️ Edit Divine Profile
                          </span>
                        </motion.button>
                      </div>
                    )}
                  </div>

                  {/* Account Actions */}
                  <div ref={(el) => (cardsRef.current[1] = el)}>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-6">
                      Sacred Actions
                    </h2>

                    <div className="space-y-4">
                      <motion.div
                        className="backdrop-blur-md bg-gradient-to-br from-green-400/10 to-green-500/10 p-6 rounded-xl border border-green-400/30"
                        whileHover={{ scale: 1.02 }}
                      >
                        <h3 className="font-semibold text-green-300 mb-2 flex items-center gap-2">
                          <span>🕉️</span> Spiritual Status
                        </h3>
                        <div className="flex items-center gap-2">
                          <motion.span
                            className="w-3 h-3 bg-green-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span className="text-green-300 font-medium">
                            Divinely Active
                          </span>
                        </div>
                      </motion.div>

                      <motion.div
                        className="backdrop-blur-md bg-gradient-to-br from-purple-400/10 to-blue-500/10 p-6 rounded-xl border border-purple-400/30"
                        whileHover={{ scale: 1.02 }}
                      >
                        <h3 className="font-semibold text-purple-300 mb-2 flex items-center gap-2">
                          <span>📿</span> Devotee Since
                        </h3>
                        <p className="text-cyan-300">
                          {new Date(
                            user.createdAt || Date.now()
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </motion.div>

                      <motion.div
                        className="backdrop-blur-md bg-gradient-to-br from-amber-400/10 to-orange-500/10 p-6 rounded-xl border border-amber-400/30"
                        whileHover={{ scale: 1.02 }}
                      >
                        <h3 className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
                          <span>🪔</span> Karma Points
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-amber-300">
                            {Math.floor(Math.random() * 1000) + 100}
                          </span>
                          <span className="text-amber-200/60 text-sm">
                            Divine blessings earned
                          </span>
                        </div>
                      </motion.div>

                      {user.role === "admin" && (
                        <motion.div
                          className="backdrop-blur-md bg-gradient-to-br from-yellow-400/10 to-amber-500/10 p-6 rounded-xl border border-yellow-400/30"
                          whileHover={{ scale: 1.02 }}
                        >
                          <h3 className="font-semibold text-yellow-300 mb-2 flex items-center gap-2">
                            <span>👑</span> Divine Admin Access
                          </h3>
                          <motion.button
                            onClick={() => navigate("/admin/dashboard")}
                            className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Enter Admin Realm
                          </motion.button>
                        </motion.div>
                      )}

                      <motion.div
                        className="backdrop-blur-md bg-gradient-to-br from-red-400/10 to-red-500/10 p-6 rounded-xl border border-red-400/30"
                        whileHover={{ scale: 1.02 }}
                      >
                        <h3 className="font-semibold text-red-300 mb-2 flex items-center gap-2">
                          <span>⚠️</span> Sacred Zone
                        </h3>
                        <motion.button
                          onClick={handleLogout}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Leave Divine Realm
                        </motion.button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "spiritual" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-6">
                    Your Spiritual Journey
                  </h2>

                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { icon: "🕉️", title: "Mantras Chanted", value: "1,008" },
                      { icon: "🪔", title: "Prayers Offered", value: "108" },
                      { icon: "📿", title: "Meditation Hours", value: "84" },
                      { icon: "🦚", title: "Krishna Badges", value: "7" },
                      { icon: "🪈", title: "Bhajans Listened", value: "432" },
                      { icon: "🌺", title: "Offerings Made", value: "21" },
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-xl border border-white/20 text-center"
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="text-3xl mb-2">{stat.icon}</div>
                        <div className="text-2xl font-bold text-amber-300">
                          {stat.value}
                        </div>
                        <div className="text-sm text-blue-100/60">
                          {stat.title}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-6">
                    Divine Settings
                  </h2>

                  <div className="space-y-4">
                    {[
                      {
                        title: "Email Notifications",
                        desc: "Receive divine updates",
                        enabled: true,
                      },
                      {
                        title: "Prayer Reminders",
                        desc: "Daily spiritual reminders",
                        enabled: true,
                      },
                      {
                        title: "Festival Alerts",
                        desc: "Krishna festival notifications",
                        enabled: false,
                      },
                      {
                        title: "Community Updates",
                        desc: "Devotee community news",
                        enabled: true,
                      },
                    ].map((setting, index) => (
                      <motion.div
                        key={index}
                        className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-xl border border-white/20 flex items-center justify-between"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div>
                          <h3 className="font-semibold text-amber-200">
                            {setting.title}
                          </h3>
                          <p className="text-sm text-blue-100/60">
                            {setting.desc}
                          </p>
                        </div>
                        <motion.button
                          className={`w-12 h-6 rounded-full p-1 transition-colors ${
                            setting.enabled ? "bg-amber-400" : "bg-gray-400/30"
                          }`}
                          whileTap={{ scale: 0.9 }}
                        >
                          <motion.div
                            className="w-4 h-4 bg-white rounded-full"
                            animate={{ x: setting.enabled ? 24 : 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div className="absolute -bottom-4 -right-4 text-6xl text-amber-400/20 rotating-symbol pointer-events-none">
            ॐ
          </motion.div>
        </div>
      </div>
    </div>
  );
}
