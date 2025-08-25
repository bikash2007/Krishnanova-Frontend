import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  const { user } = useAuth();
  const baseUrl = useApi();

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
  }, [user, email]);

  // Mouse tracking
  useEffect(() => {
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
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSendMessage = async () => {
    if (!email?.trim() || !message?.trim()) {
      setEmailStatus("error");
      setStatusMessage("Please fill in both email and message fields.");
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
        setStatusMessage(data.message || "Message sent successfully!");
        setEmail("");
        setMessage("");
      } else {
        setEmailStatus("error");
        setStatusMessage(data.message || "Failed to send. Please try again.");
      }
    } catch {
      setEmailStatus("error");
      setStatusMessage("Network error. Please try again.");
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
      className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-hidden py-20"
    >
      {/* Animated Mandala Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          animation: "float 30s linear infinite",
        }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #fbbf24 1px, transparent 1px),
            linear-gradient(to bottom, #fbbf24 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Mouse Glow Effect */}
      <div
        className="pointer-events-none absolute w-[600px] h-[600px] transition-transform duration-75 ease-out"
        style={{
          background: `radial-gradient(circle at center, rgba(251, 191, 36, 0.15) 0%, transparent 50%)`,
          transform: `translate(${mousePosition.x - 300}px, ${
            mousePosition.y - 300
          }px)`,
        }}
      />

      <div className="relative z-10 container mx-auto px-6">
        {/* Main Footer Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 shadow-2xl p-10 md:p-12"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-4">
              <img src={logo} alt="Krishnova" className="h-12 mr-3" />
              <h3 className="text-4xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                Krishnova
              </h3>
            </div>
            <p className="text-blue-100/80 max-w-2xl mx-auto">
              Where Ancient Krishna Wisdom Meets Modern Technology
            </p>
            <p className="text-amber-300 font-semibold mt-2">
              Connecting Souls Through Divine Love
            </p>
          </div>

          {/* Grid Content */}
          <div className="grid md:grid-cols-2 gap-10 mb-12">
            {/* Left Side - Info & Social */}
            <div className="space-y-8">
              <div>
                <h4 className="text-xl font-semibold text-amber-300 mb-3">
                  Sacred Digital Ecosystem
                </h4>
                <p className="text-blue-100/70">
                  Bridging spirituality and technology to create meaningful
                  connections with Lord Krishna.
                </p>
                <div className="flex items-center gap-2 mt-4 text-cyan-300">
                  <span>🕉️</span>
                  <span>Est. 2024 • Built for Krishna devotees worldwide</span>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-sm font-semibold uppercase tracking-wider text-amber-200/80">
                  Connect with Krishnova
                </h5>
                <div className="space-y-3">
                  <a
                    href="mailto:hello@krishnova.com"
                    className="flex items-center gap-3 text-blue-100/70 hover:text-amber-300 transition-colors"
                  >
                    <span>📧</span> hello@krishnova.com
                  </a>
                  <a
                    href="tel:+15555474746"
                    className="flex items-center gap-3 text-blue-100/70 hover:text-amber-300 transition-colors"
                  >
                    <span>📞</span> +1 (555) KRISHNA
                  </a>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-semibold uppercase tracking-wider text-amber-200/80 mb-4">
                  Join Our Community
                </h5>
                <div className="flex gap-3">
                  {social.map((s) => {
                    const Icon = s.icon;
                    return (
                      <motion.a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-full backdrop-blur-md bg-white/10 border border-amber-400/30 flex items-center justify-center text-amber-300 hover:bg-amber-400/20 hover:border-amber-400/50 transition-all duration-300"
                      >
                        <Icon size={20} />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="space-y-5">
              <h4 className="text-xl font-semibold text-amber-300">
                Send Us a Divine Message
              </h4>
              <p className="text-blue-100/70">
                Questions about our sacred products or spiritual journey? We'd
                love to hear from you.
              </p>

              {/* Status Message */}
              {emailStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl backdrop-blur-md border flex items-start gap-3 ${
                    emailStatus === "success"
                      ? "bg-green-400/10 border-green-400/30"
                      : "bg-red-400/10 border-red-400/30"
                  }`}
                >
                  {emailStatus === "success" ? (
                    <FaCheckCircle className="text-green-400 mt-0.5" />
                  ) : (
                    <FaExclamationTriangle className="text-red-400 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`font-medium ${
                        emailStatus === "success"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {emailStatus === "success" ? "Message sent!" : "Error"}
                    </p>
                    <p
                      className={`text-sm ${
                        emailStatus === "success"
                          ? "text-green-300/80"
                          : "text-red-300/80"
                      }`}
                    >
                      {statusMessage}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-amber-200/80 mb-2">
                    Your Email
                    {user && (
                      <span className="text-cyan-300 ml-2">
                        (from your account)
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="devotee@example.com"
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-blue-100 placeholder-blue-100/40 focus:border-amber-400/50 focus:bg-white/15 transition-all duration-300 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-amber-200/80 mb-2">
                    Your Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Share your spiritual journey or ask about Krishnova..."
                    disabled={isLoading}
                    maxLength={1000}
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-blue-100 placeholder-blue-100/40 focus:border-amber-400/50 focus:bg-white/15 transition-all duration-300 resize-none disabled:opacity-60"
                  />
                  <div className="text-right text-xs mt-1 text-blue-100/50">
                    {message.length}/1000
                  </div>
                </div>

                {/* Send Button */}
                <motion.button
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="group relative w-full px-6 py-3 overflow-hidden rounded-full shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 text-indigo-900 font-bold tracking-wide flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-indigo-900 border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane size={14} />
                        Send Message
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { label: "🛍️ Shop Sacred Items", id: "products" },
              { label: "📚 Wisdom Portal", id: "wisdom" },
              { label: "🤝 Join Community", id: "community" },
            ].map((cta) => (
              <motion.button
                key={cta.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(cta.id)}
                className="px-5 py-2.5 rounded-full backdrop-blur-md bg-white/10 border border-amber-400/30 text-amber-200 hover:bg-amber-400/20 hover:border-amber-400/50 transition-all duration-300"
              >
                {cta.label}
              </motion.button>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-blue-100/60 text-sm">
                  © 2024{" "}
                  <span className="text-amber-300 font-semibold">
                    Krishnova
                  </span>{" "}
                  • Sacred Digital Ecosystem
                </p>
              </div>

              {/* Sanskrit Quote */}
              <div className="flex items-center gap-2 text-amber-200/60 text-sm">
                <span>🪔</span>
                <span className="italic">
                  "सर्वं कृष्णार्पणं अस्तु" - May everything be offered to
                  Krishna
                </span>
                <span>🪔</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
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
