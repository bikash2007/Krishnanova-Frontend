import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

const WisdomPortalPath = () => {
  const containerRef = useRef(null);

  // Parallax effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Deep Purple Theme with Dot Grid Pattern
  const bgGradient =
    "radial-gradient(circle at center, #5b21b6 0%, #2e1065 50%, #170726 100%)";

  // The 4 Pillars of Devotion
  const devotionPillars = [
    {
      id: "sravanam",
      title: "Sravanam",
      subtitle: "Listening",
      icon: "👂",
      description: "Ask questions & receive divine wisdom",
      points: "Clarity Points",
      color: "from-amber-400/20 to-orange-500/20",
      borderColor: "border-amber-400/40",
    },
    {
      id: "kirtanam",
      title: "Kirtanam",
      subtitle: "Chanting",
      icon: "🙏",
      description: "Sacred mantra counter & vibrations",
      points: "Vibration Points",
      color: "from-pink-400/20 to-rose-500/20",
      borderColor: "border-pink-400/40",
    },
    {
      id: "smaranam",
      title: "Smaranam",
      subtitle: "Remembrance",
      icon: "💫",
      description: "Daily practice & spiritual check-ins",
      points: "Presence Points",
      color: "from-cyan-400/20 to-blue-500/20",
      borderColor: "border-cyan-400/40",
    },
    {
      id: "archanam",
      title: "Archanam",
      subtitle: "Meditation",
      icon: "🧘",
      description: "Roop Dhyana & guided stillness",
      points: "Stillness Points",
      color: "from-purple-400/20 to-violet-500/20",
      borderColor: "border-purple-400/40",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative w-full py-10 sm:py-12 md:py-16 lg:py-20 overflow-hidden font-sans antialiased text-white"
      style={{ background: bgGradient }}
    >
      {/* Background Pattern: Geometric Dot Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-[#d946ef] opacity-10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[#d946ef] opacity-10 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* Desktop: Side by Side Layout | Mobile: Stacked */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16">
          {/* Left Side: Portal Visual + CTA */}
          <motion.div
            style={{ y, opacity }}
            className="flex-shrink-0 flex flex-col items-center text-center lg:text-left lg:items-start"
          >
            {/* Sacred Portal Visual - Compact */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-4 sm:mb-5 flex items-center justify-center">
              {/* Outer Rotating Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-t-[#d946ef] border-r-transparent border-b-[#d946ef] border-l-transparent rounded-full opacity-50"
              />
              {/* Inner Rotating Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-3 border border-t-[var(--peacock-gold)] border-r-transparent border-b-[var(--peacock-gold)] border-l-transparent rounded-full opacity-40"
              />
              {/* Core Glow */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute w-20 h-20 sm:w-24 sm:h-24 bg-[var(--peacock-gold)] rounded-full blur-[30px] opacity-30"
              />
              {/* Center Icon */}
              <div className="text-4xl sm:text-5xl md:text-6xl opacity-90 drop-shadow-[0_0_15px_rgba(255,183,0,0.6)]">
                🕉️
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-wide mb-2 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-white to-amber-100">
              Enter the Wisdom Portal
            </h2>

            {/* Subtext */}
            <p className="text-sm sm:text-base md:text-lg text-blue-100/70 max-w-md font-light tracking-wide mb-4 sm:mb-5 leading-relaxed">
              Receive divine guidance from Krishna through sacred AI wisdom.
              Track your spiritual journey across the 4 pillars of devotion.
            </p>

            {/* CTA Button */}
            <Link to="/wishdomportal">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-6 sm:px-8 py-3 bg-transparent overflow-hidden rounded-full transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#d946ef] to-[#63297D] opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/50 transition-colors duration-300" />
                <span className="relative z-10 flex items-center gap-2 text-white font-medium tracking-wider text-sm sm:text-base">
                  Begin Divine Conversation
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </span>
                <div className="absolute inset-0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </motion.button>
            </Link>

            {/* Smart Greeting Badge */}
            <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-amber-200/60">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>
                Krishna remembers your journey & follows up on your practice
              </span>
            </div>
          </motion.div>

          {/* Right Side: 4 Pillars Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex-1 w-full max-w-2xl"
          >
            {/* Section Label */}
            <div className="flex items-center gap-2 mb-4 justify-center lg:justify-start">
              <span className="text-amber-300 text-sm">✦</span>
              <span className="text-amber-200/80 text-xs sm:text-sm font-medium tracking-wider uppercase">
                4 Pillars of Devotion
              </span>
              <span className="text-amber-300 text-sm">✦</span>
            </div>

            {/* Pillars Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {devotionPillars.map((pillar, index) => (
                <motion.div
                  key={pillar.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`group relative backdrop-blur-sm bg-gradient-to-br ${pillar.color} rounded-xl p-3 sm:p-4 border ${pillar.borderColor} hover:border-white/40 transition-all duration-300 cursor-pointer`}
                >
                  {/* Icon */}
                  <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {pillar.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-white mb-0.5">
                    {pillar.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-amber-200/60 mb-1.5">
                    {pillar.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-[10px] sm:text-xs text-blue-100/60 leading-relaxed mb-2">
                    {pillar.description}
                  </p>

                  {/* Points Badge */}
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-full">
                    <span className="text-[8px] sm:text-[10px] text-amber-300">
                      ⚡
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-amber-200/80">
                      {pillar.points}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Features Row */}
            <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                <span className="text-sm">🎵</span>
                <span className="text-[10px] sm:text-xs text-blue-100/70">
                  Flute Meditation
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                <span className="text-sm">📿</span>
                <span className="text-[10px] sm:text-xs text-blue-100/70">
                  Mantra Counter
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                <span className="text-sm">🪷</span>
                <span className="text-[10px] sm:text-xs text-blue-100/70">
                  Roop Dhyana
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Particles - Reduced */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-30"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default WisdomPortalPath;
