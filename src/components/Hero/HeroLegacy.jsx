import React, { useEffect, useMemo, useRef, useState } from "react";

const HeroLegacy = ({
  title = "Welcome to Krishnova",
  subtitle = "A Journey of faith, where all things blossom",
  ctaText = "Begin Your Sacred Journey",
  ctaHref = "#products",
}) => {
  const parallaxRef = useRef(null);
  const flowsRef = useRef([]);
  const heroRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Enhanced shooting stars with peacock colors
  const shootingStars = useMemo(
    () => [
      {
        id: 1,
        startX: 10,
        startY: 10,
        endX: 80,
        endY: 60,
        delay: 0,
        duration: 3000,
        color: "var(--peacock-gold)",
      },
      {
        id: 2,
        startX: 90,
        startY: 20,
        endX: 20,
        endY: 70,
        delay: 5000,
        duration: 2500,
        color: "var(--peacock-teal)",
      },
      {
        id: 3,
        startX: 5,
        startY: 80,
        endX: 95,
        endY: 15,
        delay: 10000,
        duration: 4000,
        color: "var(--peacock-emerald)",
      },
      {
        id: 4,
        startX: 85,
        startY: 5,
        endX: 15,
        endY: 85,
        delay: 15000,
        duration: 3500,
        color: "var(--peacock-purple)",
      },
      {
        id: 5,
        startX: 50,
        startY: 0,
        endX: 20,
        endY: 100,
        delay: 20000,
        duration: 2800,
        color: "var(--peacock-bronze)",
      },
      {
        id: 6,
        startX: 100,
        startY: 40,
        endX: 0,
        endY: 90,
        delay: 25000,
        duration: 3200,
        color: "var(--peacock-azure)",
      },
    ],
    []
  );

  // Seed particles with peacock theme
  const seed = useMemo(
    () => [
      {
        id: 1,
        left: "10%",
        delay: "0s",
        dur: "8s",
        colorVar: "--peacock-gold",
      },
      {
        id: 2,
        left: "20%",
        delay: "-1s",
        dur: "9s",
        colorVar: "--peacock-teal",
      },
      {
        id: 3,
        left: "30%",
        delay: "-2s",
        dur: "10s",
        colorVar: "--peacock-emerald",
      },
      {
        id: 4,
        left: "40%",
        delay: "-3s",
        dur: "7s",
        colorVar: "--peacock-purple",
      },
      {
        id: 5,
        left: "50%",
        delay: "-4s",
        dur: "8s",
        colorVar: "--peacock-azure",
      },
      {
        id: 6,
        left: "60%",
        delay: "-5s",
        dur: "9s",
        colorVar: "--peacock-bronze",
      },
      {
        id: 7,
        left: "70%",
        delay: "-1.5s",
        dur: "10s",
        colorVar: "--peacock-gold",
      },
      {
        id: 8,
        left: "80%",
        delay: "-2.5s",
        dur: "8s",
        colorVar: "--peacock-teal",
      },
      {
        id: 9,
        left: "90%",
        delay: "-3.5s",
        dur: "9s",
        colorVar: "--peacock-emerald",
      },
    ],
    []
  );
  const [particles, setParticles] = useState(seed);

  // Energy beams positions
  const flows = useMemo(
    () => [
      { left: "10%", delay: "0s" },
      { left: "30%", delay: "-2s" },
      { left: "50%", delay: "-4s" },
      { left: "70%", delay: "-6s" },
      { left: "90%", delay: "-8s" },
    ],
    []
  );

  // Mouse tracking for cursor glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("mousemove", handleMouseMove);
      return () => hero.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  // Scroll parallax
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    let raf;
    const onScroll = () => {
      const y = window.scrollY || 0;
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${y * 0.5}px)`;
      }
      flowsRef.current.forEach((el, idx) => {
        if (!el) return;
        el.style.transform = `translateY(${y * (0.2 + idx * 0.1)}px)`;
      });
    };
    const handler = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(onScroll);
    };

    window.addEventListener("scroll", handler, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", handler);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Auto-spawn particles periodically
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    let id = 1000;
    const colors = [
      "--peacock-gold",
      "--peacock-teal",
      "--peacock-emerald",
      "--peacock-purple",
      "--peacock-azure",
      "--peacock-bronze",
    ];
    const iv = setInterval(() => {
      setParticles((prev) => {
        const next = [...prev];
        if (next.length > 50) next.splice(0, next.length - 50);
        next.push({
          id: id++,
          left: `${Math.random() * 100}%`,
          delay: `-${(Math.random() * 10).toFixed(2)}s`,
          dur: `${(Math.random() * 5 + 5).toFixed(2)}s`,
          colorVar: colors[Math.floor(Math.random() * colors.length)],
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  // Shooting star animation effect
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    const animateShootingStar = (star) => {
      const starElement = document.getElementById(`shooting-star-${star.id}`);
      if (!starElement) return;

      const startX = (star.startX / 100) * window.innerWidth;
      const startY = (star.startY / 100) * window.innerHeight;
      const endX = (star.endX / 100) * window.innerWidth;
      const endY = (star.endY / 100) * window.innerHeight;

      starElement.style.left = `${startX}px`;
      starElement.style.top = `${startY}px`;
      starElement.style.opacity = "0";

      setTimeout(() => {
        starElement.style.transition = `all ${star.duration}ms linear`;
        starElement.style.left = `${endX}px`;
        starElement.style.top = `${endY}px`;
        starElement.style.opacity = "1";

        setTimeout(() => {
          starElement.style.opacity = "0";
        }, star.duration * 0.8);
      }, 100);
    };

    shootingStars.forEach((star) => {
      const animate = () => {
        animateShootingStar(star);
        setTimeout(animate, star.delay + star.duration + Math.random() * 5000);
      };
      setTimeout(animate, star.delay);
    });
  }, [shootingStars]);

  return (
    <>
      <style jsx>{`
        :root {
          /* ========================================
             PEACOCK FEATHER COLOR GRADING SYSTEM
             Use these colors throughout your app
             ======================================== */

          /* Primary Peacock Colors */
          --peacock-deep-blue: #003153; /* Deep Krishna Blue */
          --peacock-royal-blue: #005b8c; /* Royal Blue */
          --peacock-azure: #0099cc; /* Bright Azure */
          --peacock-teal: #00a896; /* Peacock Teal */
          --peacock-emerald: #02c39a; /* Emerald Green */
          --peacock-jade: #00bfa5; /* Jade Green */

          /* Accent Colors */
          --peacock-gold: #ffb700; /* Golden Eye */
          --peacock-bronze: #b08d57; /* Bronze Shimmer */
          --peacock-copper: #c77e23; /* Copper Accent */
          --peacock-purple: #6b46c1; /* Royal Purple */
          --peacock-indigo: #4c1d95; /* Deep Indigo */
          --peacock-violet: #7c3aed; /* Bright Violet */

          /* Light Variants (for backgrounds) */
          --peacock-blue-light: #e0f2fe;
          --peacock-teal-light: #ccfbf1;
          --peacock-emerald-light: #d1fae5;
          --peacock-gold-light: #fef3c7;
          --peacock-purple-light: #ede9fe;

          /* Dark Variants (for text/shadows) */
          --peacock-blue-dark: #001e3c;
          --peacock-teal-dark: #065f46;
          --peacock-emerald-dark: #064e3b;
          --peacock-gold-dark: #92400e;
          --peacock-purple-dark: #2e1065;

          /* Gradient Combinations */
          --gradient-peacock-primary: linear-gradient(
            135deg,
            var(--peacock-deep-blue) 0%,
            var(--peacock-teal) 50%,
            var(--peacock-emerald) 100%
          );

          --gradient-peacock-accent: linear-gradient(
            135deg,
            var(--peacock-gold) 0%,
            var(--peacock-bronze) 50%,
            var(--peacock-copper) 100%
          );

          --gradient-peacock-mystical: linear-gradient(
            135deg,
            var(--peacock-indigo) 0%,
            var(--peacock-purple) 35%,
            var(--peacock-violet) 70%,
            var(--peacock-azure) 100%
          );

          /* Opacity Variants */
          --peacock-overlay-light: rgba(0, 153, 204, 0.1);
          --peacock-overlay-medium: rgba(0, 153, 204, 0.3);
          --peacock-overlay-dark: rgba(0, 49, 83, 0.8);

          /* Text Colors */
          --text-peacock-primary: var(--peacock-deep-blue);
          --text-peacock-secondary: var(--peacock-teal-dark);
          --text-peacock-accent: var(--peacock-gold-dark);

          /* Shadow Colors */
          --shadow-peacock-soft: 0 4px 20px rgba(0, 153, 204, 0.15);
          --shadow-peacock-medium: 0 10px 40px rgba(0, 91, 140, 0.25);
          --shadow-peacock-strong: 0 20px 60px rgba(0, 49, 83, 0.35);
          --shadow-peacock-glow: 0 0 40px rgba(255, 183, 0, 0.4);
        }

        .bg-krishnova-hero {
          background: radial-gradient(
              ellipse at top,
              var(--peacock-overlay-light) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at bottom,
              rgba(255, 183, 0, 0.05) 0%,
              transparent 50%
            ),
            linear-gradient(
              135deg,
              var(--peacock-deep-blue) 0%,
              var(--peacock-royal-blue) 25%,
              var(--peacock-indigo) 50%,
              var(--peacock-purple) 75%,
              var(--peacock-deep-blue) 100%
            );
        }

        .cursor-peacock {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill="%2300A896" opacity="0.8"/><circle cx="16" cy="16" r="4" fill="%23FFB700"/><path d="M16 8 Q24 16 16 24 Q8 16 16 8" fill="%23005B8C" opacity="0.6"/></svg>')
              16 16,
            auto;
        }

        .hero-parallax {
          background-image: radial-gradient(
              circle at 20px 20px,
              rgba(255, 183, 0, 0.3) 2px,
              transparent 2px
            ),
            radial-gradient(
              circle at 80px 30px,
              rgba(0, 168, 150, 0.3) 1.5px,
              transparent 1.5px
            ),
            radial-gradient(
              circle at 60px 70px,
              rgba(107, 70, 193, 0.2) 1px,
              transparent 1px
            ),
            radial-gradient(
              circle at 30px 80px,
              rgba(2, 195, 154, 0.25) 2.5px,
              transparent 2.5px
            );
          background-size: 100px 100px;
          background-repeat: repeat;
        }

        .particle-dot {
          position: absolute;
          top: 0;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          opacity: 0.8;
          filter: blur(0.5px);
          box-shadow: 0 0 10px currentColor;
        }

        .peacock-eye {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 30% 30%,
            var(--peacock-gold) 0%,
            var(--peacock-bronze) 30%,
            var(--peacock-teal) 60%,
            var(--peacock-deep-blue) 100%
          );
          box-shadow: 0 0 40px var(--peacock-gold), 0 0 60px var(--peacock-teal),
            inset 0 0 20px rgba(255, 255, 255, 0.3);
          position: relative;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .peacock-eye::before {
          content: "";
          position: absolute;
          width: 30px;
          height: 30px;
          background: radial-gradient(
            circle,
            var(--peacock-gold) 0%,
            var(--peacock-bronze) 100%
          );
          border-radius: 50%;
          box-shadow: 0 0 20px var(--peacock-gold);
        }

        .energy-flow {
          position: absolute;
          top: 0;
          width: 3px;
          height: 120px;
          background: linear-gradient(
            to bottom,
            transparent,
            var(--peacock-teal),
            var(--peacock-emerald),
            transparent
          );
          filter: blur(1px);
        }

        .text-peacock-shimmer {
          background: linear-gradient(
            135deg,
            var(--peacock-gold) 0%,
            var(--peacock-teal) 25%,
            var(--peacock-emerald) 50%,
            var(--peacock-purple) 75%,
            var(--peacock-gold) 100%
          );
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Shooting Stars with peacock colors */
        .shooting-star {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          opacity: 0;
          pointer-events: none;
          z-index: 5;
          filter: brightness(1.5);
        }

        .shooting-star::before {
          content: "";
          position: absolute;
          top: 50%;
          right: 100%;
          width: 150px;
          height: 2px;
          background: linear-gradient(
            to left,
            currentColor 0%,
            transparent 100%
          );
          transform: translateY(-50%);
          border-radius: 1px;
          box-shadow: 0 0 8px currentColor, 0 0 16px currentColor;
        }

        .shooting-star::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, currentColor 0%, transparent 70%);
          transform: translate(-50%, -50%);
          border-radius: 50%;
          box-shadow: 0 0 12px currentColor;
        }

        @keyframes floatUp {
          0%,
          100% {
            transform: translateY(100vh) translateX(0) rotate(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(50vh) translateX(30px) rotate(180deg);
          }
        }

        .animate-particle {
          animation: floatUp 10s ease-in-out infinite;
        }

        @keyframes peacockSwing {
          0%,
          100% {
            transform: rotate(-20deg) scale(1);
          }
          50% {
            transform: rotate(20deg) scale(1.1);
          }
        }

        .animate-peacock {
          animation: peacockSwing 5s ease-in-out infinite;
          transform-origin: top center;
        }

        @keyframes energyFlow {
          0% {
            opacity: 0;
            transform: translateY(-100px) scaleY(0.5);
          }
          20% {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
          80% {
            opacity: 1;
            transform: translateY(calc(100vh - 100px)) scaleY(1);
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) scaleY(0.5);
          }
        }

        .animate-energy {
          animation: energyFlow 5s ease-in-out infinite;
        }

        @keyframes gentleFloat {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.02);
          }
        }

        .animate-gentle-float {
          animation: gentleFloat 4s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-shift {
          animation: gradientShift 8s ease-in-out infinite;
        }

        /* ===========================
           MODERN BUTTON DESIGNS
           =========================== */

        /* Enhanced Modern Peacock Button with Better Contrast */
        .peacock-cta-button {
          position: relative;
          background: linear-gradient(
            135deg,
            #ffffff 0%,
            #f0f9ff 50%,
            #ffffff 100%
          );
          border: 2px solid rgba(255, 255, 255, 0.9);
          border-radius: 60px;
          padding: 20px 48px;
          font-weight: 700;
          font-size: 1.15rem;
          letter-spacing: 0.5px;
          color: var(--peacock-deep-blue);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3),
            0 2px 10px rgba(0, 0, 0, 0.2), 0 0 60px rgba(255, 183, 0, 0.4),
            0 0 100px rgba(0, 168, 150, 0.2),
            inset 0 0 20px rgba(255, 183, 0, 0.1);
          backdrop-filter: blur(20px) saturate(1.5);
          transform: translateZ(0) scale(1);
          overflow: hidden;
          isolation: isolate;
          cursor: pointer;
        }

        /* Gradient text effect */
        .peacock-cta-button span {
          background: linear-gradient(
            135deg,
            var(--peacock-deep-blue) 0%,
            var(--peacock-purple) 50%,
            var(--peacock-deep-blue) 100%
          );
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
          position: relative;
          z-index: 2;
          animation: textShine 3s ease-in-out infinite;
        }

        @keyframes textShine {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        /* Glowing border effect */
        .peacock-cta-button::before {
          content: "";
          position: absolute;
          inset: -4px;
          background: linear-gradient(
            90deg,
            #ffb700 0%,
            #00f5ff 20%,
            #ff00ff 40%,
            #00ff88 60%,
            #ffb700 80%,
            #00f5ff 100%
          );
          background-size: 300% 100%;
          border-radius: 60px;
          z-index: -1;
          opacity: 1;
          animation: borderGlow 4s linear infinite;
          filter: blur(8px);
        }

        @keyframes borderGlow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 300% 50%;
          }
        }

        /* Inner glow */
        .peacock-cta-button::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            rgba(255, 183, 0, 0.2) 0%,
            transparent 70%
          );
          border-radius: 60px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        /* Hover state */
        .peacock-cta-button:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4),
            0 10px 30px rgba(0, 0, 0, 0.3), 0 0 100px rgba(255, 183, 0, 0.6),
            0 0 150px rgba(0, 168, 150, 0.4),
            inset 0 0 30px rgba(255, 183, 0, 0.2);
          background: linear-gradient(
            135deg,
            #ffffff 0%,
            #fff9e6 50%,
            #ffffff 100%
          );
        }

        .peacock-cta-button:hover::after {
          opacity: 1;
        }

        .peacock-cta-button:hover span {
          animation-duration: 1s;
        }

        /* Shimmer effect */
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }

        .shimmer-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transform: skewX(-15deg);
          animation: shimmer 3s ease-in-out infinite;
        }

        /* Alternative Modern Glass Button Design */
        .glass-peacock-button {
          position: relative;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          border-radius: 50px;
          padding: 22px 52px;
          font-weight: 800;
          font-size: 1.2rem;
          letter-spacing: 0.8px;
          color: #003153;
          text-transform: uppercase;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 32px rgba(255, 255, 255, 0.3),
            0 4px 16px rgba(0, 0, 0, 0.2),
            inset 0 2px 8px rgba(255, 255, 255, 0.9),
            inset 0 -2px 8px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px) brightness(1.1);
          overflow: hidden;
          cursor: pointer;
        }

        .glass-peacock-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 183, 0, 0.4),
            transparent
          );
          transition: left 0.5s ease;
        }

        .glass-peacock-button:hover::before {
          left: 100%;
        }

        .glass-peacock-button:hover {
          transform: translateY(-6px) scale(1.02);
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 12px 48px rgba(255, 255, 255, 0.5),
            0 6px 24px rgba(0, 0, 0, 0.3), 0 0 80px rgba(255, 183, 0, 0.5);
        }

        /* Neon Outline Button Alternative */
        .neon-peacock-button {
          position: relative;
          background: rgba(9, 43, 156, 0.9);
          border: 3px solid #00f5ff;
          border-radius: 50px;
          padding: 20px 50px;
          font-weight: 700;
          font-size: 1.15rem;
          letter-spacing: 1px;
          color: #ffffff;
          text-transform: uppercase;
          text-decoration: none;
          text-shadow: 0 0 20px rgba(0, 245, 255, 0.5);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 0 40px rgba(0, 245, 255, 0.5),
            inset 0 0 20px rgba(0, 245, 255, 0.2), 0 4px 20px rgba(0, 0, 0, 0.5);
          animation: neonPulse 2s ease-in-out infinite;
          cursor: pointer;
        }

        @keyframes neonPulse {
          0%,
          100% {
            box-shadow: 0 0 40px rgba(0, 245, 255, 0.5),
              inset 0 0 20px rgba(0, 245, 255, 0.2),
              0 4px 20px rgba(0, 0, 0, 0.5);
          }
          50% {
            box-shadow: 0 0 60px rgba(0, 245, 255, 0.7),
              inset 0 0 30px rgba(0, 245, 255, 0.3),
              0 4px 30px rgba(0, 0, 0, 0.6);
          }
        }

        .neon-peacock-button:hover {
          transform: translateY(-4px);
          background: rgba(0, 245, 255, 0.1);
          border-color: #ffb700;
          color: #ffb700;
          text-shadow: 0 0 20px rgba(255, 183, 0, 0.8);
          box-shadow: 0 0 60px rgba(255, 183, 0, 0.6),
            inset 0 0 30px rgba(255, 183, 0, 0.2), 0 6px 30px rgba(0, 0, 0, 0.6);
        }

        /* Ripple effect */
        .ripple {
          position: absolute;
          inset: 0;
          border-radius: 60px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.3) 0%,
            transparent 70%
          );
          transform: scale(0);
          animation: rippleEffect 0.6s ease-out;
        }

        @keyframes rippleEffect {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>

      <section
        ref={heroRef}
        id="home"
        className="krishnova-hero relative min-h-[100svh] flex items-center justify-center text-center overflow-hidden cursor-peacock bg-krishnova-hero"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(255, 183, 0, 0.06) 0%, 
              rgba(0, 168, 150, 0.04) 25%, 
              rgba(107, 70, 193, 0.03) 50%, 
              transparent 70%),
            radial-gradient(ellipse at top, var(--peacock-overlay-light) 0%, transparent 50%),
            linear-gradient(135deg, 
              var(--peacock-deep-blue) 0%, 
              var(--peacock-royal-blue) 25%, 
              var(--peacock-indigo) 50%, 
              var(--peacock-purple) 75%, 
              var(--peacock-deep-blue) 100%)
          `,
        }}
      >
        {/* Parallax background */}
        <div
          ref={parallaxRef}
          className="hero-parallax absolute inset-0 pointer-events-none"
        />

        {/* Shooting Stars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {shootingStars.map((star) => (
            <div
              key={star.id}
              id={`shooting-star-${star.id}`}
              className="shooting-star"
              style={{
                color: star.color,
                background: star.color,
              }}
            />
          ))}
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <span
              key={p.id}
              className="particle-dot animate-particle"
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.dur,
                background: `var(${p.colorVar})`,
                color: `var(${p.colorVar})`,
              }}
            />
          ))}
        </div>

        {/* Peacock Eye Animation */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2">
          <div className="peacock-eye animate-peacock" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-[900px] px-6">
          <h1 className="font-playfair font-bold mb-6 text-peacock-shimmer text-[clamp(2.8rem,7vw,4.5rem)] animate-gentle-float animate-gradient-shift">
            {title}
          </h1>

          <p className="text-[clamp(1.2rem,2.5vw,1.6rem)] text-white/90 mb-12 animate-gentle-float font-light">
            {subtitle}
          </p>

          {/* Primary Button - Best contrast and modern look */}
          {/* <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => (window.location.href = ctaHref)}
            className="peacock-cta-button flex"
          >
            <span className="shimmer-effect flex" />
            {isHovered && <span className="ripple" />}
            <span>{ctaText}</span>
          </button> */}

          {/* Optional: You can switch to these alternatives */}

          <button
            onClick={() => (window.location.href = ctaHref)}
            className="glass-peacock-button"
          >
            {ctaText}
          </button>

          {/* <button
            onClick={() => (window.location.href = ctaHref)}
            className="neon-peacock-button"
          >
            {ctaText}
          </button> */}
        </div>

        {/* Energy flows */}
        {flows.map((f, i) => (
          <span
            key={i}
            ref={(el) => (flowsRef.current[i] = el)}
            className="energy-flow animate-energy"
            style={{ left: f.left, animationDelay: f.delay }}
          />
        ))}
      </section>
    </>
  );
};

export default HeroLegacy;
