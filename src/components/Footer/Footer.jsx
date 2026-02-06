import React, { useRef, useEffect, useState } from "react";
import {
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import { useApi } from "../../Context/baseUrl";
import logo from "../../../public/logo.png";

const Footer = () => {
  const footerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();
  const baseUrl = useApi();

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
  }, [user, email]);

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
    if (!email?.trim() || !message?.trim()) {
      setEmailStatus("error");
      setStatusMessage("Please fill in both fields.");
      setTimeout(() => {
        setEmailStatus(null);
        setStatusMessage("");
      }, 4000);
      return;
    }

    setIsLoading(true);
    setEmailStatus(null);
    setStatusMessage("");

    try {
      const res = await fetch(`${baseUrl}/api/contact/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          message: message.trim(),
          userName: user?.name || email.split("@")[0],
          userInfo: user
            ? `Logged in as: ${user.name} (${user.email})`
            : "Anonymous visitor",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmailStatus("success");
        setStatusMessage("Message sent!");
        setEmail("");
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
          className="pointer-events-none absolute w-full"
          style={{
            background: `radial-gradient(circle at center, rgba(251, 191, 36, 0.12) 0%, transparent 50%)`,
            transform: `translate3d(${mousePosition.x - 300}px, ${
              mousePosition.y - 300
            }px, 0)`,
            transition: "transform 150ms ease-out",
            willChange: "transform",
          }}
        />
      )}

      <div className="relative z-10  px-2 lg:scale-90 sm:px-6">
        {/* Main Footer Card */}
        <div className="backdrop-blur-md bg-gradient-to-br w-full from-white/10 to-white/5 rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12">
          {/* Header - Simplified for mobile */}
          <div className="text-center mb-6 sm:mb-10 md:mb-12">
            <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
              <img
                src={logo}
                alt="Krishnova"
                className="h-8 sm:h-10 md:h-12 mr-2 sm:mr-3"
              />
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                Krishnova
              </h3>
            </div>
            {/* Hide tagline on mobile */}
            <p className="hidden sm:block text-blue-100/80 max-w-2xl mx-auto text-sm sm:text-base px-2">
              Where Ancient Krishna Wisdom Meets Modern Technology
            </p>
            <p className="text-amber-300 font-semibold mt-2 text-sm sm:text-base">
              Connecting Souls Through Divine Love
            </p>
          </div>

          {/* Grid Content - Mobile optimized */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-6 md:mb-12">
            {/* Mobile: Show contact form first, Desktop: Show info first */}
            <div className="order-2 md:order-1 space-y-4 sm:space-y-6 md:space-y-8">
              {/* Hide description on mobile */}
              <div className="hidden sm:block">
                <h4 className="text-lg sm:text-xl font-semibold text-amber-300 mb-2 sm:mb-3">
                  Sacred Digital Ecosystem
                </h4>
                <p className="text-blue-100/70 text-sm sm:text-base">
                  Bridging spirituality and technology to create meaningful
                  connections with Lord Krishna.
                </p>
                <div className="flex items-center gap-2 mt-3 sm:mt-4 text-cyan-300 text-xs sm:text-sm">
                  <span>🕉️</span>
                  <span>Est. 2024 • Built for Krishna devotees worldwide</span>
                </div>
              </div>

              {/* Contact info - simplified on mobile */}
              <div className="space-y-3 sm:space-y-4">
                <h5 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-amber-200/80 sm:block hidden">
                  Connect with Krishnova
                </h5>
                <div className="space-y-2 sm:space-y-3">
                  <a
                    href="mailto:hello@krishnova.com"
                    className="flex items-center gap-2 sm:gap-3 text-blue-100/70 hover:text-amber-300 transition-colors text-sm sm:text-base"
                  >
                    <span>📧</span>
                    <span className="break-all">hello@krishnova.com</span>
                  </a>
                  {/* Hide phone on mobile */}
                  <a
                    href="tel:+15555474746"
                    className="hidden sm:flex items-center gap-2 sm:gap-3 text-blue-100/70 hover:text-amber-300 transition-colors text-sm sm:text-base"
                  >
                    <span>📞</span> +1 (555) KRISHNA
                  </a>
                </div>
              </div>

              {/* Social icons */}
              <div>
                <h5 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-amber-200/80 mb-3 sm:mb-4">
                  Follow Us
                </h5>
                <div className="flex gap-2 sm:gap-3">
                  {social.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full backdrop-blur-md bg-white/10 border border-amber-400/30 flex items-center justify-center text-amber-300 hover:bg-amber-400/20 hover:border-amber-400/50 hover:scale-110 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
                      >
                        <Icon size={isMobile ? 16 : 20} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Contact Form - Show first on mobile */}
            <div className="order-1 md:order-2 space-y-4 sm:space-y-5">
              <h4 className="text-lg sm:text-xl font-semibold text-amber-300">
                Send Message
              </h4>
              {/* Hide description on mobile */}
              <p className="hidden sm:block text-blue-100/70 text-sm sm:text-base">
                Questions about our sacred products or spiritual journey? We'd
                love to hear from you.
              </p>

              {/* Status Message - Simplified */}
              {emailStatus && (
                <div
                  className={`p-3 sm:p-4 rounded-xl backdrop-blur-md border flex items-center gap-2 sm:gap-3 ${
                    emailStatus === "success"
                      ? "bg-green-400/10 border-green-400/30"
                      : "bg-red-400/10 border-red-400/30"
                  }`}
                >
                  {emailStatus === "success" ? (
                    <FaCheckCircle className="text-green-400 flex-shrink-0" />
                  ) : (
                    <FaExclamationTriangle className="text-red-400 flex-shrink-0" />
                  )}
                  <p
                    className={`text-xs sm:text-sm ${
                      emailStatus === "success"
                        ? "text-green-300/80"
                        : "text-red-300/80"
                    }`}
                  >
                    {statusMessage}
                  </p>
                </div>
              )}

              {/* Form */}
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs font-medium text-amber-200/80 mb-1.5 sm:mb-2">
                    Email
                    {user && (
                      <span className="hidden sm:inline text-cyan-300 ml-1 sm:ml-2">
                        (from account)
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={isLoading}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-blue-100 placeholder-blue-100/40 focus:border-amber-400/50 focus:bg-white/15 transition-all duration-300 disabled:opacity-60 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-amber-200/80 mb-1.5 sm:mb-2">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="Your message..."
                    disabled={isLoading}
                    maxLength={500}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-blue-100 placeholder-blue-100/40 focus:border-amber-400/50 focus:bg-white/15 transition-all duration-300 resize-none disabled:opacity-60 text-sm sm:text-base"
                  />
                  {/* Hide character count on mobile */}
                  <div className="hidden sm:block text-right text-xs mt-1 text-blue-100/50">
                    {message.length}/500
                  </div>
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="group relative w-full px-4 sm:px-6 py-2.5 sm:py-3 overflow-hidden rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 text-indigo-900 font-bold tracking-wide flex items-center justify-center gap-2 text-sm sm:text-base">
                    {isLoading ? (
                      <>
                        <span className="inline-block animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-indigo-900 border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane size={isMobile ? 12 : 14} />
                        Send
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions - Hidden on mobile */}
          <div className="hidden sm:block">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
              {[
                { label: "🛍️ Shop Sacred Items", id: "products" },
                { label: "📚 Wisdom Portal", id: "wisdom" },
                { label: "🤝 Join Community", id: "community" },
              ].map((cta) => (
                <button
                  key={cta.id}
                  onClick={() => scrollToSection(cta.id)}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-md bg-white/10 border border-amber-400/30 text-amber-200 hover:bg-amber-400/20 hover:border-amber-400/50 hover:scale-105 active:scale-95 transition-all duration-300 text-xs sm:text-sm"
                >
                  {cta.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Section - Simplified */}
          <div className="border-t border-white/10 pt-4 sm:pt-6 md:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
              <p className="text-blue-100/60 text-xs sm:text-sm text-center sm:text-left">
                © 2024{" "}
                <span className="text-amber-300 font-semibold">Krishnova</span>
              </p>

              {/* Sanskrit Quote - Ultra short on mobile */}
              <div className="flex items-center gap-1 text-amber-200/60 text-xs">
                <span>🪔</span>
                <span className="italic sm:hidden">कृष्णार्पणं</span>
                <span className="italic hidden sm:inline">
                  "Sarvaṃ Kṛṣṇārpaṇaṃ astu"
                </span>
                <span>🪔</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx="true">{`
        @keyframes float {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(30px, 30px);
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
