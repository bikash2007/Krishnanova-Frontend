import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";

const Meditation = () => {
  const sectionRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    // SEO Logic
    document.title = "Daily Krishna Meditation Guide | Krishnova";

    // Simple mock of background logic
    const handleMouseMove = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };
    if (sectionRef.current)
      sectionRef.current.addEventListener("mousemove", handleMouseMove);
    return () =>
      sectionRef.current?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const benefits = [
    { icon: "🕉️", title: "Inner Peace", desc: "Find tranquility" },
    { icon: "💝", title: "Connection", desc: "Bond with Krishna" },
    { icon: "🌟", title: "Growth", desc: "Sacred journey" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-hidden flex items-center py-8 md:py-0"
    >
      {/* Background Elements */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      <div
        className="pointer-events-none absolute w-[600px] h-[600px]"
        style={{
          background: `radial-gradient(circle at center, rgba(251, 191, 36, 0.12) 0%, transparent 50%)`,
          transform: `translate3d(${mousePosition.x - 300}px, ${mousePosition.y - 300}px, 0)`,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex flex-col justify-center">
        {/* Compact Header */}
        <motion.div
          className="text-center mb-6 md:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <div className="inline-block text-amber-200 text-xs md:text-sm font-medium tracking-[0.2em] uppercase mb-2">
            Spiritual Practice
          </div>
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
            Daily Meditation Guide
          </h1>
        </motion.div>

        {/* Main Content Card - Compacted */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="w-full max-w-6xl mx-auto"
        >
          <div className="relative backdrop-blur-xl bg-white/5 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col lg:flex-row">
            {/* LEFT: Visual (Smaller on Desktop) */}
            <div className="lg:w-4/12 relative bg-gradient-to-br from-amber-400/10 via-purple-400/10 to-indigo-400/10 p-8 flex flex-col justify-center items-center min-h-[200px] lg:min-h-[450px]">
              {/* Om Animation */}
              <motion.div
                className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 backdrop-blur-md border border-amber-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.3)] relative z-10"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <span className="text-5xl md:text-6xl text-amber-300">ॐ</span>
              </motion.div>
              <div className="absolute inset-0 z-0">
                <div
                  className="absolute inset-0 opacity-10 animate-[spin_60s_linear_infinite]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>
            </div>

            {/* RIGHT: Content (Expanded) */}
            <div className="lg:w-8/12 p-6 md:p-10 flex flex-col justify-center">
              <h2 className="text-xl md:text-2xl font-bold text-cyan-200 mb-4">
                Transform Your Routine
              </h2>
              <p className="text-sm md:text-lg text-blue-100/80 mb-8 leading-relaxed">
                Transform your{" "}
                <span className="text-amber-300 font-semibold">
                  Krishnova keychain
                </span>{" "}
                into a tool for tranquility. Hold it close, feel the{" "}
                <span className="text-purple-300">divine energy</span>, and
                center yourself.
              </p>

              {/* Prayer Box */}
              <div className="bg-white/5 rounded-xl p-4 md:p-6 mb-8 border-l-4 border-amber-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">📿</span>
                  <h3 className="text-sm md:text-base font-bold text-amber-100 uppercase tracking-wide">
                    Morning Mantra
                  </h3>
                </div>
                <p className="text-base md:text-xl font-medium text-amber-200 italic font-serif">
                  "Hare Kṛṣṇa, Hare Kṛṣṇa, Kṛṣṇa Kṛṣṇa Hare Hare..."
                </p>
              </div>

              {/* Bottom Row: Benefits + CTA */}
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex gap-4 flex-1 w-full overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                  {benefits.map((b, i) => (
                    <div
                      key={i}
                      className="bg-white/5 rounded-lg p-3 min-w-[100px] text-center border border-white/5 flex-1"
                    >
                      <div className="text-xl mb-1">{b.icon}</div>
                      <div className="text-xs font-bold text-amber-100">
                        {b.title}
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/wishdomportal" className="w-full md:w-auto">
                  <button className="w-full whitespace-nowrap px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full font-bold text-white shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2">
                    Start Practice <span>→</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Quote */}
        <div className="text-center mt-6 md:mt-8 opacity-60 text-xs md:text-sm font-serif italic text-amber-100">
          "Manmanā bhava madbhakto mad-yājī māṃ namaskuru"
        </div>
      </div>
    </section>
  );
};

export default Meditation;
