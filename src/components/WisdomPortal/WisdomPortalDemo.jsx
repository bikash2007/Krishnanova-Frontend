import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const WisdomPortalPath = () => {
  const sectionRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // SEO Implementation
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "Divine Wisdom Portal - GPT Gita | Krishnova";

    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription?.content;
    if (metaDescription) {
      metaDescription.content =
        "Experience Krishnova's AI-powered GPT Gita integration. Ask Krishna any question and receive personalized wisdom from the Bhagavad Gita.";
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Experience Krishnova's AI-powered GPT Gita integration. Ask Krishna any question and receive personalized wisdom from the Bhagavad Gita.";
      document.head.appendChild(meta);
    }

    return () => {
      document.title = originalTitle;
      if (metaDescription && originalDescription) {
        metaDescription.content = originalDescription;
      }
    };
  }, []);

  // Fixed mouse tracking - smooth movement without glitch
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
      return () => {
        section.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Wisdom",
      desc: "Advanced GPT integration with sacred Krishna texts",
      gradient: "from-amber-400 to-orange-500",
    },
    {
      icon: "📖",
      title: "Authentic Teachings",
      desc: "Direct insights from Bhagavad Gita verses",
      gradient: "from-cyan-400 to-blue-500",
    },
    {
      icon: "✨",
      title: "Personal Guidance",
      desc: "Customized spiritual advice for your journey",
      gradient: "from-purple-400 to-indigo-500",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-hidden py-20"
    >
      {/* Animated Mandala Background - matching homepage */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          animation: "float 30s linear infinite",
        }}
      />

      {/* Grid Pattern - matching homepage */}

      {/* Static Floating Orbs - No mouse interaction */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${i * 12.5 + 6}%`,
              top: `${(i % 2 === 0 ? 20 : 70) + i * 5}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 10 : -10, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-amber-400/10 to-orange-500/10 rounded-full blur-xl" />
          </motion.div>
        ))}
      </div>

      {/* Fixed Mouse Glow Effect - Smooth following */}
      <div
        className="pointer-events-none absolute w-[600px] h-[600px] transition-transform duration-75 ease-out"
        style={{
          background: `radial-gradient(circle at center, rgba(251, 191, 36, 0.15) 0%, transparent 50%)`,
          transform: `translate(${mousePosition.x - 300}px, ${
            mousePosition.y - 300
          }px)`,
          willChange: "transform",
        }}
      />

      <div className="relative z-10 container mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Sacred Badge - matching homepage style */}
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 rounded-full px-5 py-2.5 shadow-lg mb-8">
            <span className="text-amber-300 animate-pulse text-lg">✦</span>
            <span className="text-amber-100 font-medium tracking-wide text-sm">
              connect with krishna
            </span>
            <span className="text-amber-300 animate-pulse text-lg">✦</span>
          </div>

          {/* Main Title with gradient */}
          <h1 className="text-3xl lg:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
              Divine Wisdom Portal
            </span>
          </h1>

          <p className="text-md md:text-xl text-blue-100/80 max-w-2xl mx-auto">
            Where ancient Krishna wisdom meets modern AI technology
          </p>
        </motion.div>

        {/* Main Content Card - Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="relative group">
            {/* Static Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-purple-400/20 to-amber-400/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />

            {/* Card Content */}
            <div className="relative backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-2 md:p-12 border border-white/20 shadow-2xl hover:border-amber-400/30 transition-all duration-300">
              {/* Animated Icon */}
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-3xl md:text-6xl text-center mb-8"
              >
                🔮
              </motion.div>

              <h2 className="text-xl md:text-4xl font-bold text-center mb-3 md:mb-6">
                <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  Sacred Wisdom Coming Soon
                </span>
              </h2>

              <p className="text-lg md:text-xl text-blue-100/80 text-center mb-4 md:mb-8 md:leading-relaxed">
                <span className="text-amber-300 font-bold">Krishnova's</span>{" "}
                revolutionary{" "}
                <span className="font-semibold text-cyan-300">GPT Gita</span>{" "}
                integration launches in{" "}
                <span className="font-bold bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-transparent text-2xl">
                  2 days!
                </span>
              </p>

              <p className="text-base text-blue-200/70 text-center mb-10">
                Ask Lord Krishna any question and receive personalized wisdom
                from the <span className="text-amber-200">Bhagavad Gita</span>.
                Experience the divine convergence of eternal teachings and
                modern AI.
              </p>

              {/* Sanskrit Quote */}
              <div className="bg-white/5 rounded-2xl p-4 mb-10 border border-amber-400/20">
                <p className="text-center text-amber-200/80 font-sanskrit text-lg mb-2">
                  "Karmaṇyevādhikāraste mā phaleṣu kadācana"
                </p>
                <p className="text-center text-blue-100/60 text-sm">
                  You have the right to perform your duty, but not to the fruits
                  of action
                </p>
              </div>

              {/* CTA Button - matching homepage style */}
              <div className="text-center">
                <Link to="/wishdomportal">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-4 md:px-8 py-4 overflow-hidden rounded-full shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative z-10 text-indigo-900 font-bold tracking-wide flex items-center gap-2">
                      Explore Wisdom Portal
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 md:max-w-5xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group relative"
            >
              <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-xl p-4 md:p-8 border border-white/20 hover:border-amber-400/50 transition-all duration-300 h-full">
                {/* Floating Animation for Icon */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.3,
                  }}
                  className="text-3xl md:text-5xl mb-6 text-center"
                >
                  {feature.icon}
                </motion.div>

                <h3 className="text-lg md:text-xl font-bold text-amber-300 mb-3 text-center">
                  {feature.title}
                </h3>

                <p className="text-blue-100/80 text-xs md:text-sm text-center leading-relaxed">
                  {feature.desc}
                </p>

                {/* Static Hover Gradient Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl pointer-events-none`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Coming Soon Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-6 backdrop-blur-md bg-gradient-to-r from-white/5 to-white/10 rounded-full px-8 py-4 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-300">02</div>
              <div className="text-xs text-blue-100/60 uppercase tracking-wider">
                Days
              </div>
            </div>
            <div className="text-amber-400">:</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-300">00</div>
              <div className="text-xs text-blue-100/60 uppercase tracking-wider">
                Hours
              </div>
            </div>
            <div className="text-amber-400">:</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-300">00</div>
              <div className="text-xs text-blue-100/60 uppercase tracking-wider">
                Minutes
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="flex items-center justify-center space-x-2 text-amber-200/60 text-sm">
            <span>🪔</span>
            <span className="italic">
              "Where technology meets transcendence - Krishnova"
            </span>
            <span>🪔</span>
          </div>
        </motion.div>
      </div>

      {/* Custom CSS for animations */}
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

export default WisdomPortalPath;
