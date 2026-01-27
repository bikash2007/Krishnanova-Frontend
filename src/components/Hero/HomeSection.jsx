import React, { useEffect, useState, useRef, useCallback } from "react";
import kPng from "../../Media/k.png";
import { NavLink } from "react-router-dom";

const HomeSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mandalaRef = useRef(null);
  const throttleRef = useRef(false);

  useEffect(() => {
    setIsVisible(true);

    // Throttled mouse handler - only updates every 50ms for performance
    const handleMouseMove = (e) => {
      if (throttleRef.current) return;
      throttleRef.current = true;

      requestAnimationFrame(() => {
        // For parallax effect
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 30,
          y: (e.clientY / window.innerHeight - 0.5) * 30,
        });

        // Add glow effect to mandala on mouse proximity
        if (mandalaRef.current) {
          const rect = mandalaRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distance = Math.sqrt(
            Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2),
          );

          if (distance < 300) {
            const intensity = 1 - distance / 300;
            mandalaRef.current.style.filter = `brightness(${
              1 + intensity * 0.5
            }) contrast(${1 + intensity * 0.2})`;
          } else {
            mandalaRef.current.style.filter = "brightness(1) contrast(1)";
          }
        }

        setTimeout(() => {
          throttleRef.current = false;
        }, 50);
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen  bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* Animated Mandala Background with Parallax */}
      {/* <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      /> */}

      {/* Moving Energy Particles */}
      <div className="absolute inset-0 hidden md:block">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-amber-400 rounded-full animate-pulse"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              filter: "blur(1px)",
              boxShadow: "0 0 10px rgba(251, 191, 36, 0.8)",
            }}
          />
        ))}
      </div>

      {/* Grid Pattern with Parallax */}
      <div className="absolute inset-0 opacity-10" />

      {/* Main Content */}
      <div className="lg:scale-90 relative z-10 container mx-auto px-4 py-4 md:px-6 md:py-0 flex flex-col lg:flex-row items-center justify-between min-h-[100dvh]">
        {/* Left Content */}
        <div
          className={`w-full lg:w-1/2 space-y-6 transform transition-all duration-1000 ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-10 md:-translate-x-20 opacity-0"
          }`}
        >
          {/* Sacred Badge */}
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 rounded-full scale-90 md:scale-100 px-4 py-2 md:px-5 md:py-2.5 shadow-lg">
            <span className="text-amber-300 animate-pulse text-lg">✦</span>
            <span className="text-amber-100 font-medium tracking-wide text-sm text-float">
              Śrī Kṛṣṇa
            </span>
            <span className="text-amber-300 animate-pulse text-lg">✦</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold leading-tight">
              <span className="inline-block bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent animate-shimmer">
                Krishnova
              </span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-blue-100 font-light leading-relaxed">
              <span className="inline-block text-float animation-delay-100">
                Where
              </span>{" "}
              <span className="inline-block text-float animation-delay-200">
                Divine
              </span>{" "}
              <span className="inline-block text-float animation-delay-300">
                Grace
              </span>{" "}
              <span className="inline-block text-float">Meets</span>
              <span className="block font-semibold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mt-1 text-float">
                Contemporary Devotion
              </span>
            </p>
          </div>

          {/* Description */}
          <div className="space-y-3 max-w-xl">
            <p className="text-blue-100/80 text-base md:text-lg leading-relaxed">
              Experience the divine presence of Lord Krishna through our curated
              collection of sacred artifacts and spiritual treasures.
            </p>
            <div className="flex items-center space-x-2 text-amber-200/60 text-sm">
              <span className="animate-pulse">🪔</span>
              <span className="italic text-float">Bhagavad Gita</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row flex-wrap gap-4 pt-4">
            <NavLink
              to={"/productpage"}
              className="group relative px-6 py-3.5 md:px-8 md:py-4 w-full md:w-auto overflow-hidden rounded-full shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex justify-center items-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 animate-gradient"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 text-indigo-900 font-bold tracking-wide flex items-center gap-2">
                Explore Divine Collection
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </span>
            </NavLink>

            <NavLink
              to="/readvagwatgita"
              className="group px-6 py-3.5 md:px-8 md:py-4 w-full md:w-auto border-2 border-amber-400/50 text-amber-200 rounded-full font-semibold backdrop-blur-md bg-white/5 hover:bg-amber-400/10 hover:border-amber-400 transform hover:-translate-y-1 transition-all duration-300 flex justify-center items-center"
            >
              <span className="flex items-center gap-2">
                📖 Read Bhagavad Gita
              </span>
            </NavLink>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 md:flex md:gap-8 pt-6 mb-6 md:mb-2">
            <div className="group cursor-pointer text-center md:text-left">
              <div className="text-xl md:text-3xl font-bold text-amber-300 group-hover:scale-110 transition-transform text-float">
                500+
              </div>
              <div className="text-xs md:text-sm text-blue-200/60">
                Blessed Devotees
              </div>
            </div>
            <div className="group cursor-pointer text-center md:text-left">
              <div className="text-xl md:text-3xl font-bold text-cyan-300 group-hover:scale-110 transition-transform text-float animation-delay-100">
                108
              </div>
              <div className="text-xs md:text-sm text-blue-200/60">
                Sacred Items
              </div>
            </div>
            <div className="group cursor-pointer text-center md:text-left">
              <div className="text-xl md:text-3xl font-bold text-purple-300 group-hover:scale-110 transition-transform text-float animation-delay-200">
                4.9★
              </div>
              <div className="text-xs md:text-sm text-blue-200/60">
                Divine Rating
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Enhanced Hero Visual */}
        <div
          className={`w-full lg:w-1/2 mt-12 md:mt-0 relative transform transition-all duration-1000 delay-300 ${
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          ref={mandalaRef}
        >
          <div className="relative flex justify-center lg:block">
            {/* Multiple Mandala Layers with Different Effects */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Outer energy ring */}
              <div
                className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full opacity-30"
                style={{
                  background:
                    "radial-gradient(circle, transparent 30%, rgba(251, 191, 36, 0.1) 50%, transparent 70%)",
                  animation: "energy-wave 4s ease-out infinite",
                }}
              />

              {/* Main Mandala Circles - Fixed for mobile symmetry */}
              <div
                className="absolute w-[260px] h-[260px] md:w-96 md:h-96 rounded-full border-2 border-amber-400/40 animate-spin-very-slow"
                style={{
                  boxShadow:
                    "0 0 80px rgba(251, 191, 36, 0.4), inset 0 0 80px rgba(251, 191, 36, 0.2)",
                  transform: `rotate(${mousePosition.x}deg)`,
                  aspectRatio: "1/1",
                }}
              />

              <div
                className="absolute w-[220px] h-[220px] md:w-80 md:h-80 rounded-full border-2 border-cyan-400/40 animate-spin-reverse-slow"
                style={{
                  boxShadow:
                    "0 0 60px rgba(0, 255, 255, 0.3), inset 0 0 60px rgba(0, 255, 255, 0.1)",
                  transform: `rotate(${-mousePosition.y}deg)`,
                  aspectRatio: "1/1",
                }}
              />

              <div
                className="absolute w-[180px] h-[180px] md:w-64 md:h-64 rounded-full border-2 border-purple-400/40 animate-spin-slow"
                style={{
                  boxShadow:
                    "0 0 40px rgba(138, 43, 226, 0.3), inset 0 0 40px rgba(138, 43, 226, 0.1)",
                  aspectRatio: "1/1",
                }}
              />

              {/* Inner chakra pattern */}
              <div className="absolute w-[140px] h-[140px] md:w-48 md:h-48 rounded-full">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "conic-gradient(from 0deg, rgba(251, 191, 36, 0.3), rgba(0, 255, 255, 0.3), rgba(138, 43, 226, 0.3), rgba(251, 191, 36, 0.3))",
                    aspectRatio: "1/1",
                  }}
                />
              </div>
            </div>

            {/* Main Visual Container */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mx-auto">
              {/* Multi-layer Glowing Aura */}
              <div
                className="absolute inset-0 rounded-full animate-pulse-slow"
                style={{
                  background:
                    "radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(0, 255, 255, 0.2) 40%, rgba(138, 43, 226, 0.1) 70%, transparent 100%)",
                  filter: "blur(30px)",
                  transform: `scale(${1 + Math.sin(Date.now() / 1000) * 0.1})`,
                }}
              />

              {/* Central Krishna Element with reduced glow */}
              <div
                className="absolute inset-8 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-blue-900/90 backdrop-blur-xl rounded-full shadow-2xl flex flex-col items-center justify-center group border-2 border-amber-400/40 krishna-container"
                style={{
                  boxShadow: `
                    0 0 20px rgba(251, 191, 36, 0.3),
                    0 0 40px rgba(251, 191, 36, 0.2),
                    0 0 60px rgba(0, 255, 255, 0.1),
                    inset 0 0 20px rgba(251, 191, 36, 0.05)
                  `,
                }}
              >
                <div className="text-5xl md:text-7xl mb-2 transform transition-all duration-500 krishna-image-wrapper">
                  <img
                    src={kPng}
                    alt="Krishna"
                    className="w-16 md:w-72 text-float krishna-image"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(251, 191, 36, 0.3))",
                      transition: "filter 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.filter =
                        "drop-shadow(0 0 12px rgba(251, 191, 36, 0.4))";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.filter =
                        "drop-shadow(0 0 8px rgba(251, 191, 36, 0.3))";
                    }}
                  />
                </div>
                <p
                  className="text-amber-200 text-lg md:text-xl text-float"
                  style={{ textShadow: "0 0 10px rgba(251, 191, 36, 0.8)" }}
                >
                  कृष्ण
                </p>

                {/* Rotating Icons with Enhanced Glow */}
                <div
                  className="absolute inset-0 animate-spin-very-slow"
                  style={{ zIndex: -1 }}
                >
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                    <span
                      className="text-lg md:text-2xl animate-pulse"
                      style={{
                        filter: "drop-shadow(0 0 10px rgba(251, 191, 36, 0.8))",
                      }}
                    >
                      🪈
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <span
                      className="text-lg md:text-2xl animate-pulse animation-delay-100"
                      style={{
                        filter: "drop-shadow(0 0 10px rgba(251, 191, 36, 0.8))",
                      }}
                    >
                      🪔
                    </span>
                  </div>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <span
                      className="text-lg md:text-2xl animate-pulse animation-delay-200"
                      style={{
                        filter: "drop-shadow(0 0 10px rgba(251, 191, 36, 0.8))",
                      }}
                    >
                      🌺
                    </span>
                  </div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span
                      className="text-lg md:text-2xl animate-pulse animation-delay-300"
                      style={{
                        filter: "drop-shadow(0 0 10px rgba(251, 191, 36, 0.8))",
                      }}
                    >
                      📿
                    </span>
                  </div>
                </div>
              </div>

              {/* Energy particles orbiting */}
              <div className="absolute inset-0 animate-spin-slow">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 md:w-3 md:h-3 bg-amber-400 rounded-full"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `rotate(${i * 120}deg) translateX(120px) md:translateX(180px)`,
                      boxShadow: "0 0 15px rgba(251, 191, 36, 0.8)",
                      animation: `pulse ${2 + i * 0.5}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Floating Cards - Now visible on mobile with responsive positioning */}
            <div
              className="absolute -top-2 -left-2 md:-top-5 md:-left-5 backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-2xl p-3 md:p-4 border border-white/20 animate-float-slow scale-75 md:scale-100 origin-top-left"
              style={{
                boxShadow: "0 10px 40px rgba(251, 191, 36, 0.3)",
              }}
            >
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg animate-pulse">
                  📿
                </div>
                <div>
                  <p className="text-xs md:text-sm font-semibold text-amber-100">
                    Sacred Mala
                  </p>
                  <p className="text-xs text-amber-200/60">108 Beads</p>
                </div>
              </div>
            </div>

            <div
              className="absolute -bottom-2 -right-2 md:-bottom-5 md:-right-5 backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-2xl p-3 md:p-4 border border-white/20 animate-float-slow animation-delay-2000 scale-75 md:scale-100 origin-bottom-right"
              style={{
                boxShadow: "0 10px 40px rgba(0, 255, 255, 0.3)",
              }}
            >
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg animate-pulse">
                  📖
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
      <div className="absolute bottom-[env(safe-area-inset-bottom,8px)] pb-2 md:bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center space-y-1 md:space-y-2">
          <p className="text-amber-200/60 text-xs tracking-widest uppercase text-float">
            Scroll to explore
          </p>
          <div className="w-6 h-10 border-2 border-amber-400/50 rounded-full flex justify-center animate-pulse">
            <div className="w-1 h-3 bg-amber-400 rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx>{`
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
