import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // 🎯 ADD THIS FOR /test DEPLOYMENT
  base: "/test/", // Critical: trailing slash required

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React - always needed
          vendor: ["react", "react-dom"],
          // Router - needed for navigation
          router: ["react-router-dom"],
          // Animation libraries - GSAP only (removed framer-motion for performance)
          animations: ["gsap"],
          // UI components
          ui: ["react-icons", "lucide-react"],
          // Charts - only loaded when needed
          charts: ["chart.js", "react-chartjs-2"],
          // Auth - separate chunk
          auth: ["@react-oauth/google", "jwt-decode"],
          // Stripe - only on checkout
          stripe: ["@stripe/react-stripe-js", "@stripe/stripe-js"],
        },
      },
    },
    // Increase warning limit since we have chunked properly
    chunkSizeWarningLimit: 500,
    // Disable source maps in production for smaller bundle
    sourcemap: false,
    // Minify for production
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },

  // Pre-bundle dependencies for faster dev startup
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "gsap", "axios"],
    // Exclude large dependencies that don't need pre-bundling
    exclude: ["chart.js"],
  },

  server: {
    hmr: {
      overlay: false,
      path: "/test/",
    },
  },

  // Enable CSS code splitting
  css: {
    devSourcemap: false,
  },
});
