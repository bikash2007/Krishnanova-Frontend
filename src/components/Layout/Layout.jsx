import React, {
  useEffect,
  memo,
  lazy,
  Suspense,
  useState,
  useRef,
} from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "../Navigation/NavigationGSAP";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Lazy load heavy game component - only loads when actually needed
const EnhancedKrishnaGame = lazy(() => import("../FloatingKrishna"));

// Memoized static background - prevents unnecessary re-renders
const BackgroundEffects = memo(() => (
  <div className="fixed inset-0 z-0 pointer-events-none">
    {/* OPTIMIZED: Removed animate-slow-spin - causes constant GPU repaints */}
    <div
      className="absolute w-[40rem] h-[40rem] rounded-full top-20 left-1/4 opacity-40"
      style={{
        background:
          "radial-gradient(circle, rgba(255,255,255,0.06), transparent 80%)",
      }}
    />
    <div
      className="absolute w-[25rem] h-[25rem] rounded-full bottom-10 right-1/4 opacity-30"
      style={{
        background:
          "radial-gradient(circle, rgba(255,255,255,0.04), transparent 70%)",
      }}
    />
    {/* Simplified grid pattern */}
    <div
      className="absolute inset-0 opacity-15"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
      }}
    />
  </div>
));

BackgroundEffects.displayName = "BackgroundEffects";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");
  const mainRef = useRef(null);

  // OPTIMIZATION: Only load game after main content is ready
  const [gameReady, setGameReady] = useState(false);

  // Scroll to section from navigation state
  useEffect(() => {
    if (location.state?.scrollToId) {
      const section = document.getElementById(location.state.scrollToId);
      if (section) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          gsap.to(window, {
            duration: 0.8,
            scrollTo: { y: section, offsetY: 70 },
            ease: "power2.inOut",
          });
        }, 100);
      }
    }
  }, [location.state]);

  // GSAP smooth scroll animations on route change
  useEffect(() => {
    // Scroll to top with GSAP smooth animation
    if (!location.state?.scrollToId) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // Animate main content on route change
    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0.7, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      );
    }

    // Setup ScrollTrigger for sections
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0.8, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        },
      );
    });

    // Cleanup ScrollTriggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [location.pathname]);

  // OPTIMIZATION: Delay game loading to prioritize content rendering
  useEffect(() => {
    if (!isAuthPage && !isAdminPage) {
      // Load game component after 2 seconds to let main content render first
      const timer = setTimeout(() => setGameReady(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthPage, isAdminPage]);

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
      {/* Static background - no heavy animations */}
      <BackgroundEffects />

      {!isAuthPage && <Navigation />}

      {/* OPTIMIZATION: Lazy load game component with delayed mounting */}
      {gameReady && !isAuthPage && (
        <Suspense fallback={null}>
          <EnhancedKrishnaGame />
        </Suspense>
      )}

      <main ref={mainRef} className="flex-grow relative z-10 w-full">
        {children}
      </main>
    </div>
  );
};

export default memo(Layout);
