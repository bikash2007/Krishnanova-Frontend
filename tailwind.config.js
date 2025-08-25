/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
      colors: {
        "electric-magenta": "#FF1493",
        "cosmic-purple": "#8A2BE2",
        "neon-cyan": "#00FFFF",
        "golden-sunrise": "#FFD700",
        "iridescent-white": "#F8F8FF",
        "deep-space-blue": "#191970",
        "divine-orange": "#FF8C00",
        "royal-krishna-blue": "#1E3A8A",
        "deep-burgundy": "#8B0000",
      },
      animation: {
        "gentle-float": "gentleFloat 3s ease-in-out infinite",
        "gentle-float-delayed": "gentleFloat 2.5s ease-in-out infinite 0.5s",
        "pendulum-swing": "pendulumSwing 4s ease-in-out infinite",
        "particle-float": "float 6s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-delayed-2": "float 8s ease-in-out infinite -2s",
        "float-delayed-4": "float 10s ease-in-out infinite -4s",
        "energy-flow": "energyFlow 4s ease-in-out infinite",
        "product-float": "productFloat 4s ease-in-out infinite",
        "spin-reverse": "spin 1s linear infinite reverse",
        "divine-flow":
          "divineFlow 12s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite",
        "cosmic-flow":
          "cosmicFlow 12s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite",
        "sacred-flow":
          "sacredFlow 9s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite",
        "mystical-flow":
          "mysticalFlow 11s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite",
        "krishna-flow":
          "krishnaFlow 8s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite",
        "parallax-float": "parallaxFloat 20s linear infinite",
        "symbol-materialize": "symbolMaterialize 3s ease-in-out",
      },
      keyframes: {
        gentleFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pendulumSwing: {
          "0%, 100%": { transform: "rotate(-15deg)" },
          "50%": { transform: "rotate(15deg)" },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(100vh) translateX(0px) rotate(0deg)",
            opacity: "0",
          },
          "10%": { opacity: "0.7" },
          "90%": { opacity: "0.7" },
          "50%": {
            transform: "translateY(50vh) translateX(50px) rotate(180deg)",
          },
        },
        energyFlow: {
          "0%": { opacity: "0", transform: "translateY(-100px)" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translateY(100vh)" },
        },
        productFloat: {
          "0%, 100%": { transform: "translateY(0px) rotateY(0deg)" },
          "50%": { transform: "translateY(-10px) rotateY(10deg)" },
        },
        divineFlow: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
            transform: "rotate(0deg) scale(1)",
          },
          "25%": {
            backgroundPosition: "100% 25%",
            transform: "rotate(2deg) scale(1.02)",
          },
          "50%": {
            backgroundPosition: "50% 100%",
            transform: "rotate(0deg) scale(1.05)",
          },
          "75%": {
            backgroundPosition: "25% 75%",
            transform: "rotate(-2deg) scale(1.02)",
          },
        },
        cosmicFlow: {
          "0%, 100%": {
            backgroundPosition: "0% 30%",
            transform: "rotate(0deg) scale(1)",
          },
          "33%": {
            backgroundPosition: "70% 70%",
            transform: "rotate(3deg) scale(1.03)",
          },
          "66%": {
            backgroundPosition: "30% 100%",
            transform: "rotate(-1deg) scale(1.06)",
          },
        },
        sacredFlow: {
          "0%, 100%": {
            backgroundPosition: "0% 80%",
            transform: "rotate(0deg) scale(1)",
          },
          "50%": {
            backgroundPosition: "100% 20%",
            transform: "rotate(4deg) scale(1.04)",
          },
        },
        mysticalFlow: {
          "0%, 100%": {
            backgroundPosition: "0% 0%",
            transform: "rotate(0deg) scale(1) translateX(0)",
          },
          "25%": {
            backgroundPosition: "100% 50%",
            transform: "rotate(1deg) scale(1.02) translateX(5px)",
          },
          "50%": {
            backgroundPosition: "50% 100%",
            transform: "rotate(0deg) scale(1.05) translateX(0)",
          },
          "75%": {
            backgroundPosition: "0% 50%",
            transform: "rotate(-1deg) scale(1.02) translateX(-5px)",
          },
        },
        krishnaFlow: {
          "0%, 100%": {
            backgroundPosition: "0% 60%",
            transform: "rotate(0deg) scale(1) translateY(0)",
          },
          "50%": {
            backgroundPosition: "100% 40%",
            transform: "rotate(2deg) scale(1.03) translateY(-3px)",
          },
        },
        parallaxFloat: {
          "0%": { transform: "translateY(0) translateX(0)" },
          "100%": { transform: "translateY(-100px) translateX(50px)" },
        },
        symbolMaterialize: {
          "0%": { opacity: "0", transform: "scale(0) rotate(0deg)" },
          "50%": { opacity: "0.7", transform: "scale(1.2) rotate(180deg)" },
          "100%": { opacity: "0", transform: "scale(0.8) rotate(360deg)" },
        },
      },
      backgroundSize: {
        400: "400% 400%",
      },
      spacing: {
        15: "3.75rem", // 60px
        18: "4.5rem", // 72px
        25: "6.25rem", // 100px
        50: "12.5rem", // 200px
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
