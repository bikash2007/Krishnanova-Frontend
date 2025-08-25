import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KrishnaNames = () => {
  const sectionRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedName, setSelectedName] = useState(null);

  // SEO Meta tags
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "108 Divine Krishna Names & Meanings | Krishnova";

    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription?.content;
    if (metaDescription) {
      metaDescription.content =
        "Discover the 108 sacred names of Lord Krishna with meanings. Govinda, Kanha, Madhava, Shyam - explore divine Krishna names for spiritual enlightenment at Krishnova.";
    }

    return () => {
      document.title = originalTitle;
      if (metaDescription && originalDescription) {
        metaDescription.content = originalDescription;
      }
    };
  }, []);

  const krishnaNames = [
    {
      id: "govinda",
      name: "Govinda",
      meaning: "Protector of Cows",
      sanskrit: "गोविन्द",
      description: "The divine protector who tends to all beings with love",
      mantra: "ॐ गोविन्दाय नमः",
      icon: "🐄",
    },
    {
      id: "ladoo-gopal",
      name: "Ladoo Gopal",
      meaning: "Sweet Child Krishna",
      sanskrit: "लड्डू गोपाल",
      description: "The adorable child form who loves sweet offerings",
      mantra: "ॐ बाल गोपालाय नमः",
      icon: "🍯",
    },
    {
      id: "radha-ramana",
      name: "Radha Ramana",
      meaning: "Beloved of Radha",
      sanskrit: "राधा रमण",
      description: "The eternal lover, embodiment of divine romance",
      mantra: "ॐ राधा रमणाय नमः",
      icon: "💕",
    },
    {
      id: "kanaiya",
      name: "Kanaiya",
      meaning: "Playful One",
      sanskrit: "कन्हैया",
      description: "The mischievous divine child full of joy",
      mantra: "ॐ कन्हैयाय नमः",
      icon: "🎭",
    },
    {
      id: "kanha",
      name: "Kanha",
      meaning: "Dark Beautiful",
      sanskrit: "कान्हा",
      description: "The enchanting dark-complexioned lord",
      mantra: "ॐ कान्हाय नमः",
      icon: "🌙",
    },
    {
      id: "hari",
      name: "Hari",
      meaning: "Remover of Sorrows",
      sanskrit: "हरि",
      description: "The compassionate one who removes all suffering",
      mantra: "ॐ हरये नमः",
      icon: "✨",
    },
    {
      id: "banke-bihari",
      name: "Banke Bihari",
      meaning: "Bent in Three Places",
      sanskrit: "बांके बिहारी",
      description: "The graceful one with the iconic tribhanga pose",
      mantra: "ॐ बांके बिहारीये नमः",
      icon: "🪈",
    },
    {
      id: "shyam",
      name: "Shyam",
      meaning: "Dark Beauty",
      sanskrit: "श्याम",
      description: "The mesmerizing dark-hued divine beauty",
      mantra: "ॐ श्यामाय नमः",
      icon: "🦚",
    },
    {
      id: "madhava",
      name: "Madhava",
      meaning: "Sweet Like Honey",
      sanskrit: "माधव",
      description: "The spring of sweetness and divine nectar",
      mantra: "ॐ माधवाय नमः",
      icon: "🌺",
    },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-hidden py-20">
      {/* Animated Mandala Background - matching homepage */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          animation: "float 20s linear infinite",
        }}
      />

      {/* Grid Pattern - matching homepage */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #fbbf24 1px, transparent 1px),
            linear-gradient(to bottom, #fbbf24 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating Orbs */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
            }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-amber-400/10 to-orange-500/10 rounded-full blur-xl" />
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          {/* Sacred Badge - matching homepage style */}
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 rounded-full px-5 py-2.5 shadow-lg mb-6">
            <span className="text-amber-300 animate-pulse text-lg">✦</span>
            <span className="text-amber-100 font-medium tracking-wide text-sm">
              श्री कृष्ण के १०८ नाम
            </span>
            <span className="text-amber-300 animate-pulse text-lg">✦</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
              Divine Names of Krishna
            </span>
          </h1>

          <p className="text-xl text-blue-100/80 max-w-2xl mx-auto">
            Each name reveals a unique aspect of the Lord's infinite nature
          </p>

          <div className="flex items-center justify-center space-x-2 text-amber-200/60 text-sm mt-4">
            <span>🪔</span>
            <span className="italic">
              "सहस्रनामततुल्यं रामनाम वरानने" - Vishnu Sahasranama
            </span>
          </div>
        </motion.div>

        {/* View Mode Toggle - Enhanced */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              viewMode === "grid"
                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 shadow-lg shadow-amber-500/30"
                : "border-2 border-amber-400/50 text-amber-200 backdrop-blur-md bg-white/5 hover:bg-amber-400/10"
            }`}
          >
            <span className="flex items-center gap-2">
              <span>⊞</span> Grid View
            </span>
          </button>
          <button
            onClick={() => setViewMode("circle")}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              viewMode === "circle"
                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 shadow-lg shadow-amber-500/30"
                : "border-2 border-amber-400/50 text-amber-200 backdrop-blur-md bg-white/5 hover:bg-amber-400/10"
            }`}
          >
            <span className="flex items-center gap-2">
              <span>☸</span> Mandala View
            </span>
          </button>
          <button
            onClick={() => setViewMode("cards")}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              viewMode === "cards"
                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 shadow-lg shadow-amber-500/30"
                : "border-2 border-amber-400/50 text-amber-200 backdrop-blur-md bg-white/5 hover:bg-amber-400/10"
            }`}
          >
            <span className="flex items-center gap-2">
              <span>📿</span> Card View
            </span>
          </button>
        </div>

        {/* Names Display */}
        <AnimatePresence mode="wait">
          {viewMode === "grid" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {krishnaNames.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group relative backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-2xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => setSelectedName(item)}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Icon */}
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>

                  {/* Sanskrit Name */}
                  <div className="text-2xl text-amber-300 font-bold mb-2 group-hover:text-amber-200 transition-colors">
                    {item.sanskrit}
                  </div>

                  {/* English Name */}
                  <h3 className="text-xl font-semibold text-blue-100 mb-2">
                    {item.name}
                  </h3>

                  {/* Meaning */}
                  <p className="text-cyan-300/80 text-sm mb-3">
                    {item.meaning}
                  </p>

                  {/* Description */}
                  <p className="text-blue-200/60 text-xs leading-relaxed">
                    {item.description}
                  </p>

                  {/* Mantra on hover */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-900/90 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-amber-200/80 text-xs font-sanskrit">
                      {item.mantra}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {viewMode === "circle" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative h-[600px] lg:h-[700px] flex items-center justify-center"
            >
              {/* Center Krishna Symbol */}
              <div className="absolute w-40 h-40 lg:w-48 lg:h-48 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-blue-900/90 backdrop-blur-xl rounded-full shadow-2xl flex flex-col items-center justify-center border-2 border-amber-400/50 z-20">
                <span className="text-6xl lg:text-7xl">🦚</span>
                <span className="text-amber-200 font-sanskrit text-xl mt-2">
                  कृष्ण
                </span>
              </div>

              {/* Rotating circles */}
              <div className="absolute w-96 h-96 lg:w-[500px] lg:h-[500px] rounded-full border border-amber-400/20 animate-spin-very-slow" />
              <div className="absolute w-80 h-80 lg:w-96 lg:h-96 rounded-full border border-cyan-400/20 animate-spin-reverse-slow" />

              {/* Names in circle */}
              {krishnaNames.map((item, index) => {
                const angle = (index * 360) / krishnaNames.length;
                const radius = window.innerWidth < 768 ? 180 : 250;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x,
                      y,
                    }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100,
                    }}
                    whileHover={{ scale: 1.2, zIndex: 30 }}
                    className="absolute w-28 h-28 lg:w-32 lg:h-32 backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-full shadow-xl p-3 border border-white/20 hover:border-amber-400/50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center group"
                    onClick={() => setSelectedName(item)}
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span className="text-amber-300 font-bold text-xs">
                      {item.sanskrit}
                    </span>
                    <span className="text-blue-100 text-xs mt-1">
                      {item.name}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {viewMode === "cards" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              {krishnaNames.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="mb-6"
                >
                  <div className="group relative backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-3xl shadow-2xl p-8 border border-white/20 hover:border-amber-400/50 transition-all duration-300 overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/5 to-transparent rounded-full -translate-y-32 translate-x-32" />

                    <div className="relative flex items-center gap-8">
                      {/* Left side - Icon and Sanskrit */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <span className="text-5xl">{item.icon}</span>
                        </div>
                      </div>

                      {/* Right side - Details */}
                      <div className="flex-grow">
                        <div className="flex items-baseline gap-4 mb-2">
                          <h3 className="text-3xl font-bold text-amber-300">
                            {item.sanskrit}
                          </h3>
                          <span className="text-xl text-blue-100 font-semibold">
                            {item.name}
                          </span>
                        </div>

                        <p className="text-cyan-300 mb-3">{item.meaning}</p>

                        <p className="text-blue-200/80 mb-4">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-2 text-amber-200/60 text-sm">
                          <span>📿</span>
                          <span className="font-sanskrit italic">
                            {item.mantra}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Name Modal */}
        <AnimatePresence>
          {selectedName && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-6"
              onClick={() => setSelectedName(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-3xl p-8 max-w-md w-full border-2 border-amber-400/50 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{selectedName.icon}</div>
                  <h2 className="text-4xl font-bold text-amber-300 mb-2">
                    {selectedName.sanskrit}
                  </h2>
                  <h3 className="text-2xl text-blue-100 mb-4">
                    {selectedName.name}
                  </h3>
                  <p className="text-cyan-300 text-lg mb-4">
                    {selectedName.meaning}
                  </p>
                  <p className="text-blue-200/80 mb-6">
                    {selectedName.description}
                  </p>
                  <div className="bg-white/5 rounded-xl p-4 mb-6">
                    <p className="text-amber-200 font-sanskrit text-lg">
                      {selectedName.mantra}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedName(null)}
                    className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 font-bold rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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

        @keyframes spin-very-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse-slow {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .animate-spin-very-slow {
          animation: spin-very-slow 60s linear infinite;
        }

        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 45s linear infinite;
        }

        .animate-float-slow {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default KrishnaNames;
