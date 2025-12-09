import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";

const Mission = () => {
  const sectionRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // SEO Implementation without external packages
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "Our Sacred Mission - Krishnova | Divine Krishna Products";

    // Meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription?.content;
    if (metaDescription) {
      metaDescription.content =
        "Discover Krishnova's sacred mission to bridge ancient Krishna wisdom with modern technology through blessed artifacts and spiritual products.";
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Discover Krishnova's sacred mission to bridge ancient Krishna wisdom with modern technology through blessed artifacts and spiritual products.";
      document.head.appendChild(meta);
    }

    // Structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Krishnova",
      description: "Bridging ancient Krishna wisdom with modern technology",
      url: window.location.origin,
      mission:
        "Transform everyday moments into spiritual experiences through blessed Krishna artifacts",
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.title = originalTitle;
      if (metaDescription && originalDescription) {
        metaDescription.content = originalDescription;
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Throttle ref for mouse events
  const throttleRef = useRef(false);

  // Mouse tracking for interactive effects - throttled
  const handleMouseMove = useCallback((e) => {
    if (throttleRef.current) return;
    throttleRef.current = true;
    
    requestAnimationFrame(() => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
      setTimeout(() => {
        throttleRef.current = false;
      }, 50);
    });
  }, []);

  const missionPillars = [
    {
      icon: "🕉️",
      title: "Spiritual Heritage",
      description: "Preserving ancient Krishna wisdom for modern souls",
      gradient: "from-amber-400 to-orange-500",
    },
    {
      icon: "🦚",
      title: "Divine Connection",
      description: "Creating sacred touchpoints in everyday life",
      gradient: "from-cyan-400 to-blue-500",
    },
    {
      icon: "🪔",
      title: "Global Sangha",
      description: "Uniting devotees across continents",
      gradient: "from-purple-400 to-indigo-500",
    },
    {
      icon: "📿",
      title: "Blessed Artifacts",
      description: "Each product infused with divine energy",
      gradient: "from-amber-400 to-yellow-500",
    },
  ];

  const values = [
    {
      title: "Authenticity",
      desc: "Every Krishnova product carries genuine spiritual energy",
      icon: "🛡️",
      color: "amber",
    },
    {
      title: "Community",
      desc: "Building bridges between devotees worldwide",
      icon: "👥",
      color: "cyan",
    },
    {
      title: "Innovation",
      desc: "Merging ancient wisdom with modern technology",
      icon: "⚡",
      color: "purple",
    },
    {
      title: "Devotion",
      desc: "Deepening spiritual practice through mindful experiences",
      icon: "💜",
      color: "blue",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-hidden py-10"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Mandala Background - matching homepage */}
      {/* <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          animation: "float 30s linear infinite",
        }}
      /> */}

      {/* Grid Pattern - matching homepage */}
      {/* <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #fbbf24 1px, transparent 1px),
            linear-gradient(to bottom, #fbbf24 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      /> */}

      {/* Floating Sacred Elements - reduced for performance */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${(i * 16) + 8}%`,
              top: `${(i * 16) + 5}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 10 : -10, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* <div className="w-2 h-2 bg-amber-400/20 rounded-full blur-sm" /> */}
          </motion.div>
        ))}
      </div>

      {/* Interactive Mouse Gradient */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${
            mousePosition.x * 100
          }% ${mousePosition.y * 100}%, 
            rgba(251, 191, 36, 0.1) 0%, 
            transparent 40%)`,
        }}
      />

      <div className="relative z-10 container mx-auto px-6">
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Sacred Badge - matching homepage style */}
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 rounded-full px-5 py-2.5 shadow-lg mb-8">
            <span className="text-amber-300 animate-pulse text-lg">✦</span>
            <span className="text-amber-100 font-medium tracking-wide text-sm">
              कृष्णोवा का संकल्प
            </span>
            <span className="text-amber-300 animate-pulse text-lg">✦</span>
          </div>

          {/* Main Title with gradient */}
          <h1 className="text-4xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
              Our Sacred Mission
            </span>
          </h1>

          {/* Sanskrit Subtitle */}
          {/* <p className="text-lg text-amber-200/80 font-sanskrit mb-2">
            सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः
          </p> */}
          <p className="text-sm text-blue-100/60">
            May all beings be happy, may all be free from illness
          </p>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-400/50" />
            <span className="text-amber-300 text-xl">🪔</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-400/50" />
          </div>
        </motion.header>

        {/* Mission Statement Card - Glassmorphism style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="max-w-5xl mx-auto">
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition duration-1000" />

              {/* Card Content */}
              <article className="relative backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 md:p-16 border border-white/20 shadow-2xl hover:border-amber-400/30 transition-all duration-300">
                <p className="text-lg md:text-3xl leading-relaxed text-center text-blue-100">
                  <span className="font-bold text-amber-300">Krishnova</span>{" "}
                  bridges{" "}
                  <span className="font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                    ancient Krishna wisdom
                  </span>{" "}
                  with modern innovation, creating a global spiritual ecosystem
                  through{" "}
                  <span className="font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                    blessed artifacts
                  </span>{" "}
                  that connect souls worldwide in divine consciousness.
                </p>

                {/* Decorative Corner Elements */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-amber-400/30 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-amber-400/30 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-amber-400/30 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-amber-400/30 rounded-br-lg" />
              </article>
            </div>
          </div>
        </motion.div>

        {/* Mission Pillars Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {missionPillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group relative"
            >
              <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-xl p-3 md:p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300 h-full">
                {/* Icon */}
                <div className="text-xl md:text-5xl mb-2 md:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {pillar.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-amber-300 md:mb-3">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="text-blue-100/80 text-sm leading-relaxed">
                  {pillar.description}
                </p>

                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Core Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-20"
        >
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-purple-400/10 to-amber-400/10 rounded-3xl blur-2xl" />

            <div className="relative backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-4 md:p-12 border border-white/20 shadow-2xl">
              <h2 className=" text-2xl md:text-3xl font-bold text-center mb-6 md:mb-12">
                <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                  Our Guiding Principles
                </span>
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 8 }}
                    className="flex items-start space-x-4 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl">{value.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-amber-300">
                        {value.title}
                      </h3>
                      <p className="text-blue-100/80 text-sm">{value.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <Link to="/productpage">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 overflow-hidden rounded-full shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 text-indigo-900 font-bold tracking-wide flex items-center gap-2">
                Begin Your Sacred Journey
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </span>
            </motion.button>
          </Link>

          <p className="mt-6 text-blue-100/80">
            Join <span className="font-bold text-amber-300">10,000+</span>{" "}
            devotees on the path to enlightenment
          </p>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-amber-300">⭐</span>
              <span className="text-sm text-blue-100/60">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-300">🛡️</span>
              <span className="text-sm text-blue-100/60">Blessed Products</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-300">🌍</span>
              <span className="text-sm text-blue-100/60">
                Worldwide Delivery
              </span>
            </div>
          </div>
        </motion.div>

        {/* Bottom Decorative Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="text-center mt-10"
        >
          <div className="flex items-center justify-center space-x-2 text-amber-200/60 text-sm">
            <span>🪔</span>
            <span className="italic font-sanskrit">
              sarva-karmāṇy api sadā kurvāṇo mad-vyapāśhrayaḥ mat-prasādād
              avāpnoti śhāśhvataṁ padam avyayam
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

export default Mission;
