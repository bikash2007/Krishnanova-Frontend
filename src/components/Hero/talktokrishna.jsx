import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import kPng from "../../Media/k.webp";
import { IoSend } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import "./HomeSection.css";

const talktokrishna = () => {
  const navigate = useNavigate();

  return (
    <section
      className="home-hero-section relative w-full min-h-screen overflow-hidden flex items-center"
      style={{ backgroundColor: "#0e0520", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center">
        {/* Centered radial glow behind heading */}
        <div
          className="absolute lg:left-[25%] lg:top-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(232,160,32,0.15) 0%, transparent 70%)" }}
        />
        {/* Scattered 1px star dots */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: "1px",
              height: "1px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.2 + Math.random() * 0.8,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

        {/* LEFT SIDE */}
        <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
          {/* Small pill badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border"
            style={{
              backgroundColor: "transparent",
              borderColor: "rgba(232,160,32,0.3)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span
              className="text-[11px] font-semibold tracking-widest uppercase"
              style={{ color: "#E8A020" }}
            >
              Divine AI Companion
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <h1
              className="text-[56px] leading-[1.1] tracking-tight"
              style={{ color: "#ffffff", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
            >
              Not just answers.
            </h1>
            <h1
              className="text-[56px] leading-[1.1] tracking-tight"
              style={{ color: "#E8A020", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
            >
              Guidance that understands you.
            </h1>
          </div>

          {/* Subtitle */}
          <p
            className="text-[16px] leading-relaxed max-w-md mx-auto lg:mx-0"
            style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}
          >
            Find clarity, peace, and purpose through sacred conversations.
          </p>

          {/* Button row */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
            <button
              onClick={() => navigate("/wishdomportal")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
              style={{
                backgroundColor: "#E8A020",
                color: "#1a0c35",
              }}
            >
              Seek Guidance <span className="text-lg leading-none">→</span>
            </button>
            <NavLink
              to="/readvagwatgita"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold transition-colors hover:bg-white/5 flex items-center justify-center"
              style={{
                backgroundColor: "transparent",
                color: "#ffffff",
                border: "1px solid #E8A020",
              }}
            >
              Explore the Gita
            </NavLink>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4 justify-center lg:justify-start pt-4">
            <div className="flex -space-x-3">
              {["from-purple-400 to-indigo-500", "from-amber-400 to-orange-500", "from-pink-400 to-rose-500", "from-teal-400 to-cyan-500"].map((g, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${g} flex items-center justify-center text-white text-xs font-bold border-2 border-[#0e0520]`}
                >
                  {["A", "R", "P", "S"][i]}
                </div>
              ))}
            </div>
            <div className="text-left flex flex-col justify-center">
              <div className="flex items-center gap-1 mb-0.5">
                {[1, 2, 3, 4, 5].map(s => <FaStar key={s} className="text-sm" style={{ color: "#E8A020" }} />)}
              </div>
              <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                <span className="font-semibold text-white">4.9</span> · 1,000+ seekers finding peace daily
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — chat widget card */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative z-20">
          <div
            className="w-full max-w-[420px] rounded-[20px] overflow-hidden flex flex-col relative"
            style={{
              backgroundColor: "#1a0c35",
              boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.05)"
            }}
          >
            {/* Header */}
            <div className="flex items-center px-5 py-4 border-b border-white/5">
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#E8A020] to-orange-500 p-[1px]">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#1a0c35]">
                  <img src={kPng} alt="Krishna" className="w-full h-full object-cover scale-110" />
                </div>
              </div>
              <div className="ml-3 flex flex-col justify-center">
                <p
                  className="text-[16px] leading-tight m-0"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: "#ffffff", fontWeight: 500 }}
                >
                  Sri Kṛṣṇa
                </p>
                <p
                  className="text-[10px] leading-tight m-0 tracking-widest uppercase flex items-center gap-1.5 mt-0.5"
                  style={{ color: "#4ade80" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-[pulse_3s_ease-in-out_infinite]" />
                  ONLINE
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 px-5 py-6 space-y-6">
              {/* User message */}
              <div className="flex flex-col items-end">
                <div
                  className="text-[14px] px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] leading-relaxed"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  "I feel lost in my studies and anxious about the future."
                </div>
              </div>

              {/* Krishna reply */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#E8A020] to-orange-500 p-[1px]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#1a0c35]">
                     <img src={kPng} alt="K" className="w-full h-full object-cover scale-110" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span
                    className="text-[10px] tracking-widest uppercase mb-1.5 ml-1"
                    style={{ color: "#E8A020", fontWeight: 600 }}
                  >
                    KṚṢṆA SAYS
                  </span>
                  <div
                    className="text-[14px] px-4 py-3 rounded-2xl rounded-tl-sm leading-relaxed"
                    style={{
                      backgroundColor: "rgba(232,160,32,0.08)",
                      color: "#ffffff",
                      border: "1px solid rgba(232,160,32,0.15)",
                    }}
                  >
                    "Focus on your duty, not the result. Clarity comes through action — breathe, and take the next small step."
                  </div>
                </div>
              </div>
            </div>

            {/* Footer chips inside card */}
            <div className="px-5 pb-4 flex items-center gap-2">
              <div
                className="px-3 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1.5"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)" }}
              >
                <span className="text-sm">🕉️</span> 108 Names
              </div>
              <div
                className="px-3 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1.5"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)" }}
              >
                <span className="text-sm">📖</span> 700 Verses
              </div>
            </div>

            {/* Input bar */}
            <div className="px-5 pb-5">
              <div
                className="flex items-center rounded-full p-1.5 pl-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <input
                  type="text"
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-white/30 text-white cursor-pointer"
                  onClick={() => navigate("/wishdomportal")}
                  readOnly
                />
                <button
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#1a0c35] transition-transform hover:scale-105"
                  style={{ backgroundColor: "#E8A020" }}
                  onClick={() => navigate("/wishdomportal")}
                >
                  <IoSend className="text-[14px] ml-0.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default talktokrishna;
