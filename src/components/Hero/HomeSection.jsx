import React, { useEffect, useState } from "react";
import kPng from "../../Media/k.png";
import { NavLink } from "react-router-dom";
import "./HomeSection.css";
import { FaBook } from "react-icons/fa";
import { GiCandleLight, GiPrayerBeads } from "react-icons/gi";

const HomeSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="home-hero-section relative md:min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* Animated Mandala Background with Parallax */}
      {/* <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      /> */}

      {/* Main Content */}
      <div className="lg:scale-90 relative z-10 container mx-auto px-4 py-7 md:px-6 md:py-0 flex flex-col lg:flex-row items-center justify-between md:min-h-screen">
        {/* Left Content */}
        <div
          className={`hero-content-panel w-full lg:w-1/2 space-y-4 md:space-y-5 lg:space-y-6 transform transition-all duration-1000 ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-10 md:-translate-x-20 opacity-0"
          }`}
        >
          {/* Sacred Badge */}
          <div className="inline-flex items-center mt-14 md:mt-0 gap-2 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-400/30 rounded-full px-3 py-1.5 md:px-4 md:py-2 shadow-lg">
            <span className="text-amber-400 text-sm md:text-base">ॐ</span>
            <span className="text-amber-100 font-medium tracking-widest text-xs md:text-sm uppercase">
              Sri Kṛṣṇa
            </span>
            <span className="text-amber-400 text-sm md:text-base">ॐ</span>
          </div>

          {/* Main Heading - Brand Name */}
          <div className="space-y-2 md:space-y-3">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-none mt-3">
              <span className="brand-name-animate">KRISHNOVA</span>
            </h1>

            {/* Tagline with vibrant colors */}
            <div className="text-xl md:text-2xl lg:text-3xl leading-relaxed pt-2 md:pt-3">
              <p className="flex flex-wrap items-center gap-x-2">
                <span className="text-white/90 font-medium">Where</span>
                <span className="tagline-highlight">Divine Grace</span>
                <span className="text-white/90 font-medium">Meets</span>
              </p>
              <p className="mt-1">
                <span className="tagline-secondary">Contemporary Devotion</span>
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="max-w-lg space-y-3">
            <p className="text-blue-100/80 text-sm md:text-base lg:text-lg leading-relaxed">
              Experience the divine presence of Lord Krishna through our curated
              collection of sacred artifacts and spiritual treasures.
            </p>
            <div className="flex items-center gap-2 text-amber-300 text-sm md:text-base">
              <GiCandleLight className="text-amber-300" />
              <span className="italic font-medium">
                "The soul is eternal" — Bhagavad Gita
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <NavLink
              to={"/productpage"}
              className="group relative px-5 py-3 md:px-7 md:py-3.5 overflow-hidden rounded-full shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 animate-gradient"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 text-indigo-900 font-bold tracking-wide text-sm md:text-base flex items-center gap-2">
                Explore Divine Collection
                <span className="group-hover:translate-x-1 transition-transform">
                  ?
                </span>
              </span>
            </NavLink>

            <NavLink
              to="/readvagwatgita"
              className="group px-5 py-3 md:px-7 md:py-3.5 border-2 border-amber-400/40 text-amber-200 rounded-full font-semibold backdrop-blur-md bg-white/5 hover:bg-amber-400/10 hover:border-amber-400 transform hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center text-sm md:text-base"
            >
              <span className="flex items-center gap-2">
                <FaBook className="inline" /> Read Bhagavad Gita
              </span>
            </NavLink>
          </div>

          {/* Stats - Compact */}
          <div className="flex justify-between sm:justify-start sm:gap-8 pt-3 pb-4 md:pb-0">
            <div className="group cursor-pointer text-center sm:text-left">
              <div className="text-xl md:text-2xl font-bold text-amber-400 group-hover:scale-105 transition-transform">
                500+
              </div>
              <div className="text-[10px] md:text-xs text-blue-200/50 group-hover:text-amber-200/70 transition-colors">
                Blessed Devotees
              </div>
            </div>
            <div className="group cursor-pointer text-center sm:text-left">
              <div className="text-xl md:text-2xl font-bold text-cyan-400 group-hover:scale-105 transition-transform">
                108
              </div>
              <div className="text-[10px] md:text-xs text-blue-200/50 group-hover:text-cyan-200/70 transition-colors">
                Sacred Items
              </div>
            </div>
            <div className="group cursor-pointer text-center sm:text-left">
              <div className="text-xl md:text-2xl font-bold text-purple-400 group-hover:scale-105 transition-transform">
                4.9?
              </div>
              <div className="text-[10px] md:text-xs text-blue-200/50 group-hover:text-purple-200/70 transition-colors">
                Divine Rating
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Enhanced Hero Visual */}
        <div
          className={`w-full lg:w-1/2 mt-20 mb-6 md:mt-0 scale-105 relative transition-opacity duration-700 delay-300 ${
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="relative flex justify-center lg:block">
            {/* Multiple Mandala Layers with Different Effects */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Single Mandala Circle */}
              <div
                className="absolute w-[260px] h-[260px] md:w-96 md:h-96 rounded-full border border-amber-400/30 animate-spin-very-slow"
                style={{
                  boxShadow: "0 0 40px rgba(251, 191, 36, 0.2)",
                  aspectRatio: "1/1",
                }}
              />

              <div
                className="absolute w-[200px] h-[200px] md:w-72 md:h-72 rounded-full border border-cyan-400/20"
                style={{ aspectRatio: "1/1" }}
              />
            </div>

            {/* Main Visual Container */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto">
              {/* Subtle Aura */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, rgba(138, 43, 226, 0.08) 60%, transparent 100%)",
                  opacity: 0.95,
                }}
              />

              {/* Central Krishna Element */}
              <div
                className="absolute inset-8 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-blue-900/90 rounded-full shadow-2xl flex flex-col items-center justify-center group border-2 border-amber-400/40 krishna-container"
                style={{
                  boxShadow:
                    "0 0 20px rgba(251, 191, 36, 0.2), 0 0 40px rgba(251, 191, 36, 0.1)",
                }}
              >
                <div className="text-7xl md:text-7xl mb-2 krishna-image-wrapper">
                  <img
                    src={kPng}
                    alt="Krishna"
                    className="w-22 md:w-72 krishna-image"
                  />
                </div>
                <p
                  className="text-amber-200 text-base md:text-xl font-medium tracking-wide"
                  style={{ textShadow: "0 0 10px rgba(251, 191, 36, 0.6)" }}
                >
                  हरे कृष्ण
                </p>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-2 left-1 md:-top-5 md:-left-5 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-lg p-3 md:p-4 border border-white/20 scale-75 md:scale-100 origin-top-left">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <GiPrayerBeads className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-semibold text-amber-100">
                    Sacred Mala
                  </p>
                  <p className="text-xs text-amber-200/60">108 Beads</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-2 right-1 md:-bottom-5 md:-right-5 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-lg p-3 md:p-4 border border-white/20 scale-75 md:scale-100 origin-bottom-right">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <FaBook className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-semibold text-blue-100">
                    Bhagavad Gita
                  </p>
                  <p className="text-xs text-blue-200/60">Divine Wisdom</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-only cards section below mandala */}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute hidden md:flex bottom-[env(safe-area-inset-bottom,8px)] pb-2 md:bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center space-y-1 md:space-y-2">
          <p className="text-amber-200/60 text-xs tracking-widest uppercase">
            Scroll to explore
          </p>
          <div className="w-6 h-10 border-2 border-amber-400/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-amber-400 rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx="true">{`
        @media (max-width: 768px) {
          .krishna-container {
            transform-origin: center;
          }

          .krishna-image-wrapper:hover {
            transform: scale(1.02);
          }
        }
      `}</style>
    </section>
  );
};

export default HomeSection;
