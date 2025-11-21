import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KrishnaNames = () => {
  const sectionRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [viewMode, setViewMode] = useState("circle");
  const [selectedName, setSelectedName] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const viewModes = [
    {
      id: "circle",
      icon: "☸",
      label: "Mandala",
      fullLabel: "Mandala View",
      mobileIcon: "☸",
    },
    {
      id: "grid",
      icon: "⊞",
      label: "Grid",
      fullLabel: "Grid View",
      mobileIcon: "⊞",
    },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-hidden py-12 sm:py-16 md:py-20">
      {/* Animated Mandala Background - simplified on mobile */}
      <div
        className="absolute inset-0 opacity-10 sm:opacity-15 md:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: isMobile ? "20px 20px" : "30px 30px",
          animation: isMobile ? "none" : "float 20s linear infinite",
        }}
      />

      {/* Grid Pattern - hidden on mobile */}
      {/* {!isMobile && (
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
      )} */}

      {/* Floating Orbs - reduced on mobile */}
      <div className="absolute inset-0">
        {[...Array(isMobile ? 2 : 5)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
            }}
          >
            <div
              className={`${
                isMobile ? "w-20 h-20" : "w-32 h-32"
              } bg-gradient-to-br from-amber-400/10 to-orange-500/10 rounded-full blur-xl`}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          {/* Sacred Badge */}
          <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 rounded-full px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 shadow-lg mb-4 sm:mb-6">
            <span className="text-amber-300 animate-pulse text-sm sm:text-base md:text-lg">
              ✦
            </span>
            <span className="text-amber-100 font-medium tracking-wide text-xs sm:text-sm">
              Krishna 108 Names
            </span>
            <span className="text-amber-300 animate-pulse text-sm sm:text-base md:text-lg">
              ✦
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
              Divine Names of Krishna
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto px-4">
            Each name reveals a unique aspect of the Lord's infinite nature
          </p>

          <div className="flex items-center justify-center space-x-2 text-amber-200/60 text-xs sm:text-sm mt-3 sm:mt-4">
            <span>🪔</span>
            <span className="italic hidden sm:inline">
              "Sahasranāmatatulyam Rāmanāma Varānane" - Vishnu Sahasranama
            </span>
            <span className="italic sm:hidden">Vishnu Sahasranama</span>
          </div>
        </motion.div>

        {/* View Mode Toggle - Responsive Design */}
        <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10 md:mb-12">
          {viewModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`
                ${
                  viewMode === mode.id
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 shadow-lg shadow-amber-500/30"
                    : "border border-amber-400/50 text-amber-200 backdrop-blur-md bg-white/5 hover:bg-amber-400/10"
                }
                px-3 sm:px-4 md:px-6 
                py-2 sm:py-2.5 md:py-3 
                rounded-full 
                font-medium sm:font-semibold 
                transition-all duration-300
                text-xs sm:text-sm md:text-base
                flex items-center gap-1 sm:gap-2
              `}
            >
              <span className="text-sm sm:text-base">{mode.icon}</span>
              <span className="hidden sm:inline">{mode.fullLabel}</span>
              <span className="sm:hidden">{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Alternative compact mobile design - uncomment if preferred */}
        {/* <div className="flex justify-center gap-1 mb-8 sm:hidden">
          {viewModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`
                ${viewMode === mode.id
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900"
                  : "border border-amber-400/50 text-amber-200 bg-white/5"
                }
                w-12 h-12
                rounded-full 
                flex items-center justify-center
                transition-all duration-300
              `}
              aria-label={mode.fullLabel}
            >
              <span className="text-lg">{mode.mobileIcon}</span>
            </button>
          ))}
        </div> */}

        {/* Names Display */}
        <AnimatePresence mode="wait">
          {viewMode === "grid" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
            >
              {krishnaNames.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={!isMobile ? { scale: 1.02, y: -5 } : {}}
                  className="group relative backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => setSelectedName(item)}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Icon */}
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>

                  {/* English Name */}
                  <h3 className="text-xl sm:text-2xl text-amber-300 font-bold mb-1.5 sm:mb-2 group-hover:text-amber-200 transition-colors">
                    {item.name}
                  </h3>

                  {/* Meaning */}
                  <p className="text-cyan-300/80 text-xs sm:text-sm mb-2 sm:mb-3">
                    {item.meaning}
                  </p>

                  {/* Description */}
                  <p className="text-blue-200/60 text-xs leading-relaxed">
                    {item.description}
                  </p>

                  {/* Mantra on hover - desktop only */}
                  {!isMobile && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-900/90 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-amber-200/80 text-xs font-sanskrit">
                        {item.mantra}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {viewMode === "circle" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative h-[500px] sm:h-[600px] lg:h-[700px] flex items-center justify-center"
            >
              {/* Center Krishna Symbol */}
              <div className="absolute w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-blue-900/90 backdrop-blur-xl rounded-full shadow-2xl flex flex-col items-center justify-center border-2 border-amber-400/50 z-20">
                <span className="text-5xl sm:text-6xl lg:text-7xl">🦚</span>
                <span className="text-amber-200 font-sanskrit text-base sm:text-xl mt-1 sm:mt-2">
                  कृष्ण
                </span>
              </div>

              {/* Rotating circles */}
              <div className="absolute w-72 sm:w-96 lg:w-[500px] h-72 sm:h-96 lg:h-[500px] rounded-full border border-amber-400/20 animate-spin-very-slow" />
              <div className="absolute w-60 sm:w-80 lg:w-96 h-60 sm:h-80 lg:h-96 rounded-full border border-cyan-400/20 animate-spin-reverse-slow" />

              {/* Names in circle */}
              {krishnaNames.map((item, index) => {
                const angle = (index * 360) / krishnaNames.length;
                const radius = isMobile
                  ? 140
                  : window.innerWidth < 768
                  ? 180
                  : 250;
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
                    whileHover={!isMobile ? { scale: 1.2, zIndex: 30 } : {}}
                    className="absolute w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-full shadow-xl p-2 sm:p-3 border border-white/20 hover:border-amber-400/50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center group"
                    onClick={() => setSelectedName(item)}
                  >
                    <span className="text-xl sm:text-2xl mb-0.5 sm:mb-1 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span className="text-amber-300 font-bold text-[10px] sm:text-xs hidden sm:block">
                      {item.sanskrit}
                    </span>
                    <span className="text-blue-100 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
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
                  className="mb-4 sm:mb-5 md:mb-6"
                >
                  <div className="group relative backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-8 border border-white/20 hover:border-amber-400/50 transition-all duration-300 overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-gradient-to-br from-amber-400/5 to-transparent rounded-full -translate-y-16 sm:-translate-y-24 md:-translate-y-32 translate-x-16 sm:translate-x-24 md:translate-x-32" />

                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 md:gap-8">
                      {/* Left side - Icon and Sanskrit */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <span className="text-4xl sm:text-5xl">
                            {item.icon}
                          </span>
                        </div>
                      </div>

                      {/* Right side - Details */}
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-2">
                          <h3 className="text-2xl sm:text-3xl font-bold text-amber-300">
                            {item.sanskrit}
                          </h3>
                          <span className="text-lg sm:text-xl text-blue-100 font-semibold">
                            {item.name}
                          </span>
                        </div>

                        <p className="text-cyan-300 mb-2 sm:mb-3 text-sm sm:text-base">
                          {item.meaning}
                        </p>

                        <p className="text-blue-200/80 mb-3 sm:mb-4 text-sm sm:text-base">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-2 text-amber-200/60 text-xs sm:text-sm">
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
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
              onClick={() => setSelectedName(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-amber-400/50 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">
                    {selectedName.icon}
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-amber-300 mb-1.5 sm:mb-2">
                    {selectedName.sanskrit}
                  </h2>
                  <h3 className="text-xl sm:text-2xl text-blue-100 mb-3 sm:mb-4">
                    {selectedName.name}
                  </h3>
                  <p className="text-cyan-300 text-base sm:text-lg mb-3 sm:mb-4">
                    {selectedName.meaning}
                  </p>
                  <p className="text-blue-200/80 mb-4 sm:mb-6 text-sm sm:text-base">
                    {selectedName.description}
                  </p>
                  <div className="bg-white/5 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="text-amber-200 font-sanskrit text-base sm:text-lg">
                      {selectedName.mantra}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedName(null)}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 font-bold rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 text-sm sm:text-base"
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
