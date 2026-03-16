import React, { useRef, useEffect, useState } from "react";
import {
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationTriangle,
  FaOm,
  FaEnvelope,
  FaPhone,
  FaShoppingBag,
  FaBook,
  FaHandshake,
} from "react-icons/fa";
import { GiCandleLight } from "react-icons/gi";
import { useAuth } from "../../Context/AuthContext";
import { useApi } from "../../Context/baseUrl";
import logo from "../../../public/logo.png";

const Footer = () => {
  const footerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();
  const baseUrl = useApi();

  // Removed auto-fill email from user account

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mouse tracking - disable on mobile for performance
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e) => {
      if (footerRef.current) {
        const rect = footerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const footer = footerRef.current;
    if (footer) {
      footer.addEventListener("mousemove", handleMouseMove);
      return () => footer.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isMobile]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSendMessage = async () => {
    if (!message?.trim()) {
      setEmailStatus("error");
      setStatusMessage("Please enter a message.");
      setTimeout(() => {
        setEmailStatus(null);
        setStatusMessage("");
      }, 4000);
      return;
    }

    setIsLoading(true);
    setEmailStatus(null);
    setStatusMessage("");

    // Use user's email if logged in, otherwise use anonymous
    const senderEmail = user?.email || "anonymous@krishnova.com";
    const senderName = user?.name || "Anonymous Visitor";

    try {
      const res = await fetch(`${baseUrl}/api/contact/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: senderEmail,
          message: message.trim(),
          userName: senderName,
          userInfo: user
            ? `Logged in as: ${user.name} (${user.email})`
            : "Anonymous visitor",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmailStatus("success");
        setStatusMessage("Message sent!");
        setMessage("");
      } else {
        setEmailStatus("error");
        setStatusMessage("Failed to send.");
      }
    } catch {
      setEmailStatus("error");
      setStatusMessage("Network error.");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setEmailStatus(null);
        setStatusMessage("");
      }, 4000);
    }
  };

  const social = [
    {
      name: "Instagram",
      icon: FaInstagram,
      url: "https://instagram.com/krishnova",
    },
    { name: "Twitter", icon: FaTwitter, url: "https://twitter.com/krishnova" },
    { name: "YouTube", icon: FaYoutube, url: "https://youtube.com/@krishnova" },
    { name: "WhatsApp", icon: FaWhatsapp, url: "https://wa.me/15555474746" },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-hidden "
    >
      {/* Animated Mandala Background - simplified for mobile */}
      <div
        className="absolute inset-0 opacity-10 md:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: isMobile ? "20px 20px" : "30px 30px",
          animation: isMobile ? "none" : "float 30s linear infinite",
        }}
      />

      {/* Mouse Glow Effect - desktop only */}
      {!isMobile && (
        <div
          className="pointer-events-none absolute w-96 h-96"
          style={{
            background: `radial-gradient(circle at center, rgba(251, 191, 36, 0.15) 0%, rgba(139, 92, 246, 0.1) 30%, transparent 70%)`,
            transform: `translate3d(${mousePosition.x - 192}px, ${
              mousePosition.y - 192
            }px, 0)`,
            transition: "transform 150ms ease-out",
            willChange: "transform",
            filter: "blur(40px)",
          }}
        />
      )}

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Main Footer Card */}
        <div className="backdrop-blur-xl bg-gradient-to-br w-full from-white/10 via-purple-500/5 to-blue-500/10 rounded-xl sm:rounded-2xl border border-white/30 shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 p-4 sm:p-6 md:p-7 lg:p-8 relative overflow-hidden">
          {/* Decorative corner elements */}
          <div className="absolute top-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-400/20 to-transparent rounded-br-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tl from-purple-400/20 to-transparent rounded-tl-full blur-2xl"></div>
          {/* Header - Enhanced with animations */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8 relative">
            <div className="inline-flex items-center justify-center mb-2 sm:mb-3 group">
              <img
                src={logo}
                alt="Krishnova"
                className="h-8 sm:h-10 md:h-12 mr-2 sm:mr-3 transform group-hover:rotate-12 transition-transform duration-500"
              />
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                Krishnova
              </h3>
              <FaOm
                className="ml-2 sm:ml-3 text-amber-300 text-lg sm:text-xl md:text-2xl animate-spin"
                style={{ animationDuration: "8s" }}
              />
            </div>
            {/* Show on all devices but smaller on mobile */}
            <p className="text-blue-100/80 max-w-2xl mx-auto text-xs sm:text-sm px-4 mb-1">
              Where Ancient Krishna Wisdom Meets Modern Technology
            </p>
            <p className="text-amber-300 font-semibold text-xs sm:text-base flex items-center justify-center gap-2">
              <GiCandleLight className="animate-pulse" />
              Connecting Souls Through Divine Love
              <GiCandleLight
                className="animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
            </p>
          </div>

          {/* Grid Content - Perfectly aligned */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-4 md:mb-6">
            {/* Mobile: Show contact form first, Desktop: Show info first */}
            <div className="order-2 lg:order-1 space-y-3 sm:space-y-4">
              {/* Show on all devices with backdrop */}
              <div className="backdrop-blur-sm bg-white/5 rounded-lg p-3 sm:p-4 border border-amber-400/20 hover:border-amber-400/40 transition-all duration-300">
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-amber-300 mb-2 flex items-center gap-2">
                  <FaOm className="animate-pulse text-sm sm:text-base" />
                  Sacred Digital Ecosystem
                </h4>
                <p className="text-blue-100/80 text-xs sm:text-sm leading-relaxed">
                  Bridging spirituality and technology to create meaningful
                  connections with Lord Krishna.
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-cyan-300 text-xs font-medium">
                  <GiCandleLight className="animate-pulse text-xs" />
                  <span className="text-xs">
                    Est. 2024 • Built for devotees worldwide
                  </span>
                </div>
              </div>

              {/* Contact info - Enhanced styling */}
              <div className="space-y-2 sm:space-y-3 backdrop-blur-sm bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg p-3 sm:p-4 border border-white/20">
                <h5 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-200 flex items-center gap-2">
                  <FaEnvelope className="text-amber-300" />
                  Connect with Krishnova
                </h5>
                <div className="space-y-3">
                  <a
                    href="mailto:hello@krishnova.com"
                    className="flex items-center gap-3 text-blue-100/80 hover:text-amber-300 hover:translate-x-1 transition-all duration-300 text-sm sm:text-base group"
                  >
                    <span className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center group-hover:bg-amber-400/30 transition-colors">
                      <FaEnvelope className="text-amber-300" size={14} />
                    </span>
                    <span className="break-all">hello@krishnova.com</span>
                  </a>
                  <a
                    href="tel:+15555474746"
                    className="flex items-center gap-2 text-blue-100/80 hover:text-amber-300 hover:translate-x-1 transition-all duration-300 text-xs sm:text-sm group"
                  >
                    <span className="w-7 h-7 rounded-full bg-amber-400/20 flex items-center justify-center group-hover:bg-amber-400/30 transition-colors">
                      <FaPhone className="text-amber-300" size={12} />
                    </span>
                    <span>+1 (555) KRISHNA</span>
                  </a>
                </div>
              </div>

              {/* Social icons - Enhanced */}
              <div className="backdrop-blur-sm bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg p-3 sm:p-4 border border-amber-400/30">
                <h5 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-200 mb-3 flex items-center gap-2">
                  <FaHandshake className="text-amber-300 text-xs" />
                  Follow Our Journey
                </h5>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {social.map((s, idx) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg backdrop-blur-md bg-gradient-to-br from-white/15 to-white/5 border border-amber-400/40 flex items-center justify-center text-amber-300 hover:text-amber-200 hover:border-amber-400/70 hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-amber-500/50"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        <Icon size={isMobile ? 16 : 18} />
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-400/0 to-amber-400/0 group-hover:from-amber-400/20 group-hover:to-orange-400/20 transition-all duration-300"></div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Contact Form - Show first on mobile */}
            <div className="order-1 lg:order-2 space-y-3 sm:space-y-4 backdrop-blur-sm bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-yellow-500/10 rounded-lg p-4 sm:p-5 border border-amber-400/30 shadow-xl">
              <div className="flex items-center justify-between">
                <h4 className="text-base sm:text-lg font-bold text-amber-300 flex items-center gap-2">
                  <FaPaperPlane className="text-amber-400 text-sm" />
                  Send Message
                </h4>
                <GiCandleLight className="text-amber-300 text-lg animate-pulse" />
              </div>
              <p className="text-blue-100/80 text-xs leading-relaxed">
                Share your thoughts with us.{" "}
                {user ? `Sending as ${user.name}` : "Send anonymous messages"}.
              </p>

              {/* Status Message - Enhanced */}
              {emailStatus && (
                <div
                  className={`p-3 rounded-lg backdrop-blur-lg border-2 flex items-center gap-2 animate-fade-in shadow-lg ${
                    emailStatus === "success"
                      ? "bg-green-400/20 border-green-400/50 shadow-green-500/30"
                      : "bg-red-400/20 border-red-400/50 shadow-red-500/30"
                  }`}
                >
                  {emailStatus === "success" ? (
                    <FaCheckCircle className="text-green-300 flex-shrink-0 text-base animate-bounce" />
                  ) : (
                    <FaExclamationTriangle className="text-red-300 flex-shrink-0 text-base animate-pulse" />
                  )}
                  <p
                    className={`text-xs sm:text-sm font-medium ${
                      emailStatus === "success"
                        ? "text-green-200"
                        : "text-red-200"
                    }`}
                  >
                    {statusMessage}
                  </p>
                </div>
              )}

              {/* Form - Enhanced styling */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-amber-200 mb-1.5 flex items-center gap-1.5">
                    <FaPaperPlane className="text-amber-300" size={12} />
                    Your Message{" "}
                    {user && (
                      <span className="text-cyan-300 text-xs ml-1 px-2 py-0.5 bg-cyan-500/20 rounded-full border border-cyan-400/30">
                        as {user.name}
                      </span>
                    )}
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Share your thoughts..."
                    disabled={isLoading}
                    maxLength={500}
                    className="w-full px-3 py-2 rounded-lg backdrop-blur-md bg-white/15 border-2 border-white/30 text-blue-50 placeholder-blue-100/50 focus:border-amber-400/70 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/30 transition-all duration-300 resize-none disabled:opacity-60 text-xs sm:text-sm shadow-inner"
                  />
                  <div className="flex justify-end items-center text-xs mt-1">
                    <span
                      className={`font-medium transition-colors ${
                        message.length > 450
                          ? "text-amber-300"
                          : "text-blue-100/60"
                      }`}
                    >
                      {message.length}/500
                    </span>
                  </div>
                </div>

                {/* Send Button - Enhanced */}
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="group relative w-full px-4 py-2.5 overflow-hidden rounded-lg shadow-2xl transform hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  </div>
                  <span className="relative z-10 text-indigo-900 font-bold tracking-wide flex items-center justify-center gap-2 text-sm">
                    {isLoading ? (
                      <>
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-indigo-900 border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane
                          size={12}
                          className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                        />
                        Send Message
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions - Enhanced for all devices */}
          <div className="mt-4 mb-4">
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
              {[
                {
                  label: "Shop Sacred Items",
                  id: "products",
                  icon: <FaShoppingBag />,
                  gradient: "from-amber-400 to-orange-500",
                },
                {
                  label: "Wisdom Portal",
                  id: "wisdom",
                  icon: <FaBook />,
                  gradient: "from-purple-400 to-pink-500",
                },
                {
                  label: "Join Community",
                  id: "community",
                  icon: <FaHandshake />,
                  gradient: "from-blue-400 to-cyan-500",
                },
              ].map((cta, idx) => (
                <button
                  key={cta.id}
                  onClick={() => scrollToSection(cta.id)}
                  className="group relative px-3 sm:px-4 py-2 rounded-full backdrop-blur-lg bg-white/15 border border-amber-400/40 text-amber-200 hover:text-white hover:border-amber-400/70 hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 text-xs sm:text-sm font-semibold shadow-lg hover:shadow-amber-500/30"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${cta.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  ></div>
                  <span className="flex items-center gap-2">
                    <span className="group-hover:scale-110 transition-transform duration-300">
                      {cta.icon}
                    </span>
                    <span className="hidden sm:inline">{cta.label}</span>
                    <span className="sm:hidden">{cta.label.split(" ")[0]}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Section - Enhanced */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5">
                <img src={logo} alt="Krishnova" className="h-5 sm:h-6" />
                <p className="text-blue-100/70 text-xs sm:text-sm text-center sm:text-left">
                  © 2024{" "}
                  <span className="text-amber-300 font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                    Krishnova
                  </span>
                  <span className="hidden md:inline text-blue-100/50 ml-2">
                    • All rights reserved
                  </span>
                </p>
              </div>

              {/* Sanskrit Quote - Enhanced */}
              <div className="flex items-center gap-1.5 text-amber-200/80 text-xs backdrop-blur-sm bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-400/30">
                <GiCandleLight className="animate-pulse text-amber-300 text-xs" />
                <span className="italic font-semibold sm:hidden text-xs">
                  कृष्णार्पणं
                </span>
                <span className="italic font-semibold hidden sm:inline text-xs">
                  "Sarvaṃ Kṛṣṇārpaṇaṃ astu"
                </span>
                <GiCandleLight
                  className="animate-pulse text-amber-300 text-xs"
                  style={{ animationDelay: "0.5s" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx="true">{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(30px, 30px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
