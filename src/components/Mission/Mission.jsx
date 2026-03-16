import React, { useRef, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaOm } from "react-icons/fa";
import { GiFeather, GiCandleLight, GiPrayerBeads } from "react-icons/gi";

const Mission = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    // Keep SEO Logic
    const originalTitle = document.title;
    document.title = "Our Sacred Mission - Krishnova";
    return () => {
      document.title = originalTitle;
    };
  }, []);

  const missionPillars = [
    {
      icon: <FaOm />,
      title: "Heritage",
      description: "Ancient wisdom preserved",
      gradient: "from-amber-400 to-orange-500",
    },
    {
      icon: <GiFeather />,
      title: "Connection",
      description: "Sacred daily touch",
      gradient: "from-cyan-400 to-blue-500",
    },
    {
      icon: <GiCandleLight />,
      title: "Sangha",
      description: "Global unity",
      gradient: "from-purple-400 to-indigo-500",
    },
    {
      icon: <GiPrayerBeads />,
      title: "Artifacts",
      description: "Divine energy infusion",
      gradient: "from-amber-400 to-yellow-500",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-hidden py-12 md:py-0"
    >
      {/* Subtle Background - Matching Hero */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-indigo-900/80 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 md:px-12 h-full flex flex-col justify-center">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Main Content (Left) */}
          <div className="lg:col-span-5 space-y-8 text-center lg:text-left">
            {/* Sacred Badge */}
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-md border border-amber-400/20 rounded-full px-4 py-2 mx-auto lg:mx-0 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
              <span className="text-amber-300 animate-pulse text-sm">✦</span>
              <span className="text-amber-100/90 text-sm font-medium tracking-wide uppercase">
                Our Sankalpa
              </span>
              <span className="text-amber-300 animate-pulse text-sm">✦</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-indigo-200">
                Bridging
              </span>{" "}
              <span className="block mt-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-100">
                Ancient Wisdom
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100/70 leading-relaxed font-medium max-w-lg mx-auto lg:mx-0">
              Krishnova is more than a store. It is a movement to restore
              sacredness to the everyday, connecting seekers worldwide through
              blessed artifacts and divine consciousness.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-6">
              <Link to="/wishdomportal" className="group w-full sm:w-auto">
                <div className="relative px-8 py-4 rounded-full overflow-hidden shadow-lg transform transition-all duration-300 group-hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center justify-center gap-2 text-indigo-950 font-bold tracking-wide">
                    Begin Journey
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Visual Grid (Right) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4 md:gap-8 relative">
              {/* Decorative Glow */}
              <div className="absolute inset-0 bg-amber-500/5 blur-3xl rounded-full -z-10" />

              {missionPillars.map((p, i) => (
                <div
                  key={i}
                  className={`relative group p-6 md:p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-700 hover:border-amber-400/20 ${
                    i % 2 !== 0 ? "lg:translate-y-12" : ""
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.gradient} bg-opacity-10 flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-500`}
                  >
                    <div className="drop-shadow-md">{p.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-amber-100 mb-2 group-hover:text-amber-200 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-blue-100/60 leading-relaxed group-hover:text-blue-100/80 transition-colors">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
