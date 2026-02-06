import React, { useEffect, useState, lazy, Suspense, memo } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "../Navigation/Navigation";

// Lazy load heavy components - they only load when needed
const EnhancedKrishnaGame = lazy(() => import("../FloatingKrishna"));

// Simple loading fallback for lazy components
const LazyFallback = () => null;

// Memoized background to prevent re-renders
const BackgroundEffects = memo(() => (
  <div className="fixed inset-0 z-0 pointer-events-none">
    {/* Simplified background - removed heavy animations */}
    <div
      className="absolute w-[40rem] h-[40rem] bg-gradient-radial from-white/5 to-transparent rounded-full top-20 left-1/4 opacity-40"
      style={{ willChange: "auto" }} // Let browser decide, don't force GPU layer
    />
    <div className="absolute w-[25rem] h-[25rem] bg-gradient-radial from-white/3 to-transparent rounded-full bottom-10 right-1/4 opacity-30" />
    {/* Subtle grid - use CSS instead of complex patterns */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
      }}
    />
  </div>
));

BackgroundEffects.displayName = "BackgroundEffects";

const OptimizedLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");

  // Only load game on home page to reduce overhead on other pages
  const isHomePage = location.pathname === "/";
  const [shouldLoadGame, setShouldLoadGame] = useState(false);

  // Scroll to top on route change - use passive listener
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" }); // instant is faster than smooth for route changes
  }, [location.pathname]);

  // Delay loading the game component to prioritize main content
  useEffect(() => {
    if (isHomePage && !isAuthPage) {
      const timer = setTimeout(() => {
        setShouldLoadGame(true);
      }, 2000); // Load game after 2 seconds
      return () => clearTimeout(timer);
    } else {
      setShouldLoadGame(false);
    }
  }, [isHomePage, isAuthPage]);

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
      {/* Static background - no animations */}
      <BackgroundEffects />

      {!isAuthPage && <Navigation />}

      {/* Only load Krishna game on home page and after delay */}
      {shouldLoadGame && (
        <Suspense fallback={<LazyFallback />}>
          <EnhancedKrishnaGame />
        </Suspense>
      )}

      <main className="flex-grow relative z-10 w-full">{children}</main>
    </div>
  );
};

export default memo(OptimizedLayout);
