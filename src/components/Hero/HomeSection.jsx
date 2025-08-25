import React, { useEffect, useState } from "react";

const HomeSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* Animated Mandala Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

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
      ></div>
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-16 flex flex-col lg:flex-row items-center justify-between min-h-screen">
        {/* Left Content */}
        <div
          className={`lg:w-1/2 space-y-6 transform transition-all duration-1000 ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-20 opacity-0"
          }`}
        >
          {/* Sacred Badge */}
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 rounded-full px-5 py-2.5 shadow-lg">
            <span className="text-amber-300 animate-pulse text-lg">✦</span>
            <span className="text-amber-100 font-medium tracking-wide text-sm">
              श्री कृष्ण की कृपा से
            </span>
            <span className="text-amber-300 animate-pulse text-lg">✦</span>
          </div>

          {/* Main Heading with Sanskrit */}
          <div className="space-y-2">
            <p className="text-amber-200/80 text-lg font-sanskrit">
              कृष्णम् वन्दे जगद्गुरुम्
            </p>
            <h1 className="text-6xl lg:text-8xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                Krishnova
              </span>
            </h1>
            <p className="text-2xl lg:text-3xl text-blue-100 font-light leading-relaxed">
              Where Divine Grace Meets
              <span className="block font-semibold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent mt-1">
                Contemporary Devotion
              </span>
            </p>
          </div>

          {/* Poetic Description */}
          <div className="space-y-3 max-w-xl">
            <p className="text-blue-100/80 text-lg leading-relaxed">
              Experience the divine presence of Lord Krishna through our curated
              collection of sacred artifacts and spiritual treasures.
            </p>
            <div className="flex items-center space-x-2 text-amber-200/60 text-sm">
              <span>🪔</span>
              <span className="italic">
                "यदा यदा हि धर्मस्य..." - Bhagavad Gita
              </span>
            </div>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="group relative px-8 py-4 overflow-hidden rounded-full shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 animate-gradient"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 text-indigo-900 font-bold tracking-wide flex items-center gap-2">
                Explore Divine Collection
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </span>
            </button>

            <button className="group px-8 py-4 border-2 border-amber-400/50 text-amber-200 rounded-full font-semibold backdrop-blur-md bg-white/5 hover:bg-amber-400/10 hover:border-amber-400 transform hover:-translate-y-1 transition-all duration-300">
              <span className="flex items-center gap-2">
                📖 Read Bhagavad Gita
              </span>
            </button>
          </div>

          {/* Animated Stats with Sanskrit Numbers */}
          <div className="flex gap-8 pt-8">
            <div className="group cursor-pointer">
              <div className="text-3xl font-bold text-amber-300 group-hover:scale-110 transition-transform">
                ५०००+
              </div>
              <div className="text-sm text-blue-200/60">Blessed Devotees</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-3xl font-bold text-cyan-300 group-hover:scale-110 transition-transform">
                १०८+
              </div>
              <div className="text-sm text-blue-200/60">Sacred Items</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-3xl font-bold text-purple-300 group-hover:scale-110 transition-transform">
                ४.९★
              </div>
              <div className="text-sm text-blue-200/60">Divine Rating</div>
            </div>
          </div>
        </div>

        {/* Right Content - Enhanced Hero Visual */}
        <div
          className={`lg:w-1/2 relative transform transition-all duration-1000 delay-300 ${
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="relative">
            {/* Chakra/Mandala Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 rounded-full border border-amber-400/20 animate-spin-very-slow"></div>
              <div className="absolute w-80 h-80 rounded-full border border-cyan-400/20 animate-spin-reverse-slow"></div>
              <div className="absolute w-64 h-64 rounded-full border border-purple-400/20 animate-spin-slow"></div>
            </div>

            {/* Main Visual Container */}
            <div className="relative w-80 h-80 lg:w-96 lg:h-96 mx-auto">
              {/* Glowing Aura */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 via-blue-400/30 to-purple-400/30 rounded-full blur-2xl animate-pulse-slow"></div>

              {/* Central Krishna Element */}
              <div className="absolute inset-8 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-blue-900/90 backdrop-blur-xl rounded-full shadow-2xl flex flex-col items-center justify-center overflow-hidden group border border-amber-400/30">
                <div className="text-7xl mb-2 transform group-hover:scale-110 transition-all duration-500 filter drop-shadow-lg">
                  🦚
                </div>
                <p className="text-amber-200 font-sanskrit text-xl">कृष्ण</p>

                {/* Inner Rotating Elements */}
                <div className="absolute inset-0 animate-spin-very-slow">
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                    <span className="text-2xl">🪈</span>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <span className="text-2xl">🪔</span>
                  </div>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-2xl">🌺</span>
                  </div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-2xl">📿</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Product Cards with Glassmorphism */}
            <div className="absolute -top-5 -left-5 backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-2xl p-4 border border-white/20 animate-float-slow">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  📿
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-100">
                    Sacred Mala
                  </p>
                  <p className="text-xs text-amber-200/60">108 Beads</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-5 backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-2xl p-4 border border-white/20 animate-float-slow animation-delay-2000">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  📖
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-100">
                    Bhagavad Gita
                  </p>
                  <p className="text-xs text-blue-200/60">Divine Wisdom</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center space-y-2">
          <p className="text-amber-200/60 text-xs tracking-widest uppercase">
            Scroll to explore
          </p>
          <div className="w-6 h-10 border-2 border-amber-400/50 rounded-full flex justify-center animate-pulse">
            <div className="w-1 h-3 bg-amber-400 rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;
