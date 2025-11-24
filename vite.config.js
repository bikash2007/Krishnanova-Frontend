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
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["framer-motion", "react-icons"],
          charts: ["chart.js", "react-chartjs-2"],
          auth: ["@react-oauth/google", "jwt-decode"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "framer-motion"],
  },
  server: {
    hmr: {
      overlay: false,
      path: "/test/",
    },
  },
});
