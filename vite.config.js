import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "framer-motion": "/src/utils/framerMotionShim.jsx",
    },
  },

  // 🎯 ADD THIS FOR /test DEPLOYMENT
  base: "/test/", // Critical: trailing slash required

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Group core React and routing libraries
            if (
              id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/react-router-dom/") ||
              id.includes("node_modules/@remix-run/")
            ) {
              return "vendor-core";
            }
            // Separate heavy animation and charting engines
            if (id.includes("gsap")) return "vendor-gsap";
            if (id.includes("chart.js") || id.includes("react-chartjs-2")) {
              return "vendor-charts";
            }
            // Feature-specific libraries (exclude from initial vendor)
            if (
              id.includes("react-markdown") ||
              id.includes("remark-gfm") ||
              id.includes("react-pageflip")
            ) {
              return; // Let Vite code-split these automatically
            }
            // Everything else into shared vendor
            return "vendor";
          }
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
