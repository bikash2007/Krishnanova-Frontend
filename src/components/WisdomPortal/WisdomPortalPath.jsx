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

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  // Deep Purple Theme with Dot Grid Pattern
  const bgGradient = "radial-gradient(circle at center, #5b21b6 0%, #2e1065 50%, #170726 100%)";

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100vh] max-h-[100vh] overflow-hidden flex flex-col items-center justify-center font-sans antialiased text-white"
      style={{ background: bgGradient }}
    >
      {/* Background Pattern: Geometric Dot Grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px"
        }}
      />

      {/* Ambient Glows (Pink/Purple) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#d946ef] opacity-10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#d946ef] opacity-10 blur-[120px] rounded-full pointer-events-none" />

      {/* Particles Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-40"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content Stack */}
      <motion.div 
        style={{ y, opacity, scale }}
        className="relative z-10 flex flex-col items-center justify-center text-center px-6"
      >
        
        {/* Sacred Portal Visual */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8 flex items-center justify-center">
            {/* Outer Rotating Ring */}
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-t-[#d946ef] border-r-transparent border-b-[#d946ef] border-l-transparent border-[1px] rounded-full opacity-50"
            />
             {/* Inner Rotating Ring (Reverse) */}
             <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border border-t-[var(--peacock-gold)] border-r-transparent border-b-[var(--peacock-gold)] border-l-transparent border-[1px] rounded-full opacity-40"
            />
            
            {/* Core Glow */}
            <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-40 h-40 bg-[var(--peacock-gold)] rounded-full blur-[60px] opacity-30"
            />

             {/* Center Icon/Symbol */}
             <div className="text-6xl md:text-7xl opacity-90 drop-shadow-[0_0_15px_rgba(255,183,0,0.6)]">
                🕉️
             </div>
        </div>

        {/* Headline */}
        <h2 className="text-4xl md:text-6xl font-serif font-medium tracking-wide mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-white to-amber-100 drop-shadow-lg">
          Enter the <br /> Wisdom Portal
        </h2>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-blue-100/80 max-w-xl font-light tracking-wide mb-10 leading-relaxed">
          Receive divine guidance from Krishna through sacred AI wisdom.
        </p>

        {/* CTA Button */}
        <Link to="/wishdomportal">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-10 py-4 bg-transparent overflow-hidden rounded-full transition-all duration-300"
          >
            {/* Button Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#d946ef] to-[#63297D] opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Button Border */}
            <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/50 transition-colors duration-300" />

            <span className="relative z-10 flex items-center gap-3 text-white font-medium tracking-wider text-lg">
              Begin Divine Conversation
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
            
            {/* Button Shine Effect */}
            <div className="absolute inset-0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
};

export default WisdomPortalPath;
