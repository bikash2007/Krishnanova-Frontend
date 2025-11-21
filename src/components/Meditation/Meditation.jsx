import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";

const Meditation = () => {
  const sectionRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // SEO Implementation
  useEffect(() => {
    document.title = "Daily Krishna Meditation Guide | Krishnova";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content =
        "Transform your Krishnova keychain into a powerful meditation tool. Learn sacred practices, morning prayers, and connect with divine Krishna energy.";
    }
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
      return () => section.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  const benefits = [
    {
      icon: "🕉️",
      title: "Inner Peace",
      desc: "Find tranquility in daily chaos",
      gradient: "from-amber-400 to-orange-500",
    },
    {
      icon: "💝",
      title: "Divine Connection",
      desc: "Strengthen your bond with Krishna",
      gradient: "from-cyan-400 to-blue-500",
    },
    {
      icon: "🌟",
      title: "Spiritual Growth",
      desc: "Evolve on your sacred journey",
      gradient: "from-purple-400 to-indigo-500",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-hidden py-20"
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

      {/* Floating Sacred Elements */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="text-2xl opacity-20">
              {["🕉️", "🪔", "🦚", "✨"][i % 4]}
            </div>
          </motion.div>
        ))}
      </div>

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
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Sacred Badge */}
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 rounded-full px-5 py-2.5 shadow-lg mb-8">
            <span className="text-amber-300 animate-pulse text-lg">✦</span>
            <span className="text-amber-100 font-medium tracking-wide text-sm">
              आध्यात्मिक अभ्यास
            </span>
            <span className="text-amber-300 animate-pulse text-lg">✦</span>
          </div>

          <h1 className=" text-3xl  md:text-5xl lg:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
              Spiritual Practice Guide
            </span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto">
            Transform your daily routine into a sacred journey with Krishna
          </p>
        </motion.div>

        {/* Main Card - Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:max-w-6xl mx-auto"
        >
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-purple-400/20 to-amber-400/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition duration-1000" />

            {/* Card Content */}
            <div className="relative backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
              <div className="flex flex-col lg:flex-row">
                {/* Left Side - Visual Design */}
                <div className="lg:w-1/3 relative bg-gradient-to-br from-amber-400/20 via-purple-400/20 to-indigo-400/20  md:p-8 flex flex-col justify-center items-center min-h-[200px] md:min-h-[400px]">
                  {/* Rotating Mandala Background */}
                  <motion.div
                    className="absolute inset-0 opacity-10"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 120,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `
                        radial-gradient(circle at 30% 30%, #fbbf24 2px, transparent 2px),
                        radial-gradient(circle at 70% 70%, #fbbf24 1px, transparent 1px)
                      `,
                        backgroundSize: "60px 60px, 40px 40px",
                      }}
                    />
                  </motion.div>

                  {/* Central Om Symbol */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ duration: 1, delay: 0.5, type: "spring" }}
                    className="relative z-10"
                  >
                    <motion.div
                      className=" w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/30 backdrop-blur-md border-2 border-amber-400/50 flex items-center justify-center shadow-2xl"
                      animate={{
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0 0 30px rgba(251, 191, 36, 0.3)",
                          "0 0 50px rgba(251, 191, 36, 0.5)",
                          "0 0 30px rgba(251, 191, 36, 0.3)",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <span className="text-4xl md:text-6xl text-amber-300">
                        ॐ
                      </span>
                    </motion.div>

                    {/* Orbiting Elements */}
                    {[0, 120, 240].map((angle, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 md:w-4 md:h-4 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full"
                        style={{
                          top: "50%",
                          left: "50%",
                        }}
                        animate={{
                          x: [
                            60 * Math.cos((angle * Math.PI) / 180),
                            60 * Math.cos(((angle + 360) * Math.PI) / 180),
                          ],
                          y: [
                            60 * Math.sin((angle * Math.PI) / 180),
                            60 * Math.sin(((angle + 360) * Math.PI) / 180),
                          ],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    ))}
                  </motion.div>

                  {/* Sacred Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-8"
                  >
                    <h3 className="text-2xl font-bold text-amber-300 mb-2">
                      Sacred Practice
                    </h3>
                    <p className="text-blue-100/80 text-sm">
                      Connect with Divine Energy
                    </p>
                  </motion.div>
                </div>

                {/* Right Side - Content */}
                <div className="lg:w-2/3 p-4 lg:p-12">
                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 }}
                    className="text-xl md:text-3xl font-bold mb-2 md:mb-6 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent"
                  >
                    Daily Krishna Meditation
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 }}
                    className="text-sm md:text-lg text-blue-100/80 mb-8 leading-relaxed"
                  >
                    Transform your{" "}
                    <span className="text-amber-300 font-semibold">
                      Krishnova keychain
                    </span>{" "}
                    into a powerful meditation tool. Hold it during prayer, feel
                    its{" "}
                    <span className="text-cyan-300 font-semibold">
                      sacred energy
                    </span>
                    , and let it remind you of{" "}
                    <span className="text-purple-300 font-semibold">
                      divine presence
                    </span>{" "}
                    throughout your day.
                  </motion.p>

                  {/* Morning Prayer Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 }}
                    className="mb-8"
                  >
                    <div className="flex items-center mb-4">
                      <div className="md:w-10 md:h-10 w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center mr-4 shadow-lg">
                        <span className="text-indigo-900 font-bold">॥</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-semibold text-amber-300">
                        Morning Prayer
                      </h3>
                    </div>

                    <div className="backdrop-blur-md bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-3 md:p-6 border border-amber-400/20">
                      <blockquote className="text-lg md:text-xl font-medium text-center text-amber-200 mb-4 italic">
                        "Hare Kṛṣṇa, Hare Kṛṣṇa, Kṛṣṇa Kṛṣṇa Hare Hare,
                        <br />
                        Hare Rāma, Hare Rāma, Rāma Rāma, Hare Hare"
                      </blockquote>
                      <p className="text-sm text-center text-blue-100/60">
                        Chant with devotion while holding your sacred keychain
                      </p>
                    </div>
                  </motion.div>

                  {/* Benefits Grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.7 }}
                  >
                    <h3 className="text-lg md:text-xl font-semibold text-amber-300 mb-6 text-center">
                      Benefits of Daily Practice
                    </h3>

                    <div className="hidden  md:grid-cols-3 gap-4">
                      {benefits.map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={isInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="backdrop-blur-md bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-2 md:p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300 text-center group"
                        >
                          <motion.div
                            className="text-2xl md:text-4xl mb-3"
                            animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: index * 0.5,
                            }}
                          >
                            {benefit.icon}
                          </motion.div>
                          <h4 className="font-semibold text-amber-300 mb-2">
                            {benefit.title}
                          </h4>
                          <p className="text-sm text-blue-100/70">
                            {benefit.desc}
                          </p>
                          <div
                            className={`w-12 h-1 mx-auto mt-3 rounded-full bg-gradient-to-r ${benefit.gradient} opacity-50 group-hover:w-full group-hover:opacity-100 transition-all duration-300`}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9 }}
          className="text-center mt-16"
        >
          <Link to="/productpage">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 overflow-hidden rounded-full shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 text-indigo-900 font-bold tracking-wide flex items-center gap-3">
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  🕉️
                </motion.span>
                <span>Start Your Sacred Journey</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </span>
            </motion.button>
          </Link>

          <p className="mt-6 text-blue-100/60">
            Transform your spiritual practice with Krishnova ✨
          </p>
        </motion.div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="text-center mt-12"
        >
          <div className="flex items-center justify-center space-x-2 text-amber-200/60 text-sm">
            <span>🪔</span>
            <span className="italic">
              "Manmanā bhava madbhakto mad-yājī māṃ namaskuru" - Bhagavad Gita
              18.65
            </span>
            <span>🪔</span>
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
    </section>
  );
};

export default Meditation;
