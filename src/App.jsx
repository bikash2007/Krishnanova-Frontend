import React, { useEffect, useRef, useLayoutEffect, Suspense, lazy } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import Mission from "./components/Mission/Mission";

import KrishnaNames from "./components/KrishnaNames/KrishnaNames";

import Community from "./components/Community/Community";
import Festival from "./components/Festival/Festival";

const Meditation = lazy(() => import("./components/Meditation/Meditation"));

import {
  FeatherSVG,
  FluteSVG,
  LotusSVG,
  PeacockFeatherSVG,
} from "./components/UI/Svg";
import { useLocation } from "react-router-dom";

const WisdomPortalPath = lazy(() => import("./components/WisdomPortal/WisdomPortalPath"));
const CarouselSlider = lazy(() => import("./components/Products/CarouselSlider"));

const SectionSkeleton = () => (
  <div className="w-full min-h-[50vh] animate-pulse bg-transparent flex flex-col items-center justify-center p-8">
    <div className="h-12 bg-white/10 rounded-xl w-1/3 mb-12"></div>
    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="h-64 bg-white/5 rounded-2xl"></div>
      <div className="h-64 bg-white/5 rounded-2xl"></div>
      <div className="h-64 bg-white/5 rounded-2xl"></div>
    </div>
  </div>
);

import HomeSection from "./components/Hero/HomeSection";
import Footer from "./components/Footer/Footer";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Configure ScrollTrigger for optimal performance
ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true,
});

const App = () => {
  const appRef = useRef(null);
  const location = useLocation();

  // GSAP smooth scrolling and animations - optimized for performance
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const enableScrollAnimations = !prefersReducedMotion;
    const enableParallax =
      !prefersReducedMotion && !isTouchDevice && window.innerWidth > 1024;

    const ctx = gsap.context(() => {
      if (!enableScrollAnimations) return;

      // Batch ScrollTriggers for better performance
      ScrollTrigger.batch(".scroll-reveal", {
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.1,
              overwrite: true,
            },
          );
        },
        start: "top 90%",
        once: true,
      });

      ScrollTrigger.batch(".scroll-slide-left", {
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { opacity: 0, x: -50 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.1,
              overwrite: true,
            },
          );
        },
        start: "top 90%",
        once: true,
      });

      ScrollTrigger.batch(".scroll-slide-right", {
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { opacity: 0, x: 50 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.1,
              overwrite: true,
            },
          );
        },
        start: "top 90%",
        once: true,
      });

      // Simplified parallax - desktop non-touch only
      if (enableParallax) {
        gsap.utils.toArray(".parallax-bg").forEach((bg) => {
          gsap.to(bg, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
              trigger: bg,
              start: "top bottom",
              end: "bottom top",
              scrub: true, // Use true instead of number for native performance
            },
          });
        });
      }
    }, appRef);

    // Refresh ScrollTrigger after layout settles
    const refreshTimer = setTimeout(() => {
      if (enableScrollAnimations) {
        ScrollTrigger.refresh();
      }
    }, 100);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  // Handle scrolling after navigation from other routes
  useEffect(() => {
    if (location.state?.scrollToId) {
      const targetId = location.state.scrollToId;

      // Use requestAnimationFrame for smoother scroll initialization
      requestAnimationFrame(() => {
        const section = document.getElementById(targetId);
        if (section) {
          // Use GSAP for smooth scrolling with optimized duration
          gsap.to(window, {
            duration: 0.8,
            scrollTo: { y: section, offsetY: 0 },
            ease: "power2.out",
          });
        }

        // Clear the state to prevent re-scrolling on page refresh
        window.history.replaceState({}, document.title);
      });
    }
  }, [location]);

  return (
    <div ref={appRef} className="app relative">
      {/* Add the correct IDs below 👇 */}
      <div id="home">
        <HomeSection />
      </div>

      <div className="relative isolate">
        {/* 🎨 Decorative background elements (kept behind content) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <FluteSVG className="absolute w-40 md:w-56 opacity-10 top-20 left-10" />
          <FluteSVG className="absolute w-40 md:w-56 opacity-10 top-[40%] right-10" />
          <FeatherSVG className="absolute w-32 md:w-48 opacity-10 bottom-10 right-10" />
          <LotusSVG className="absolute w-32 opacity-[0.08] bottom-20 left-1/4" />
        </div>

        {/* 🌟 Main Content */}
        <div className="relative z-10">
          <div id="wisdom" className="relative z-10 ">
            <Suspense fallback={<SectionSkeleton />}>
              <WisdomPortalPath />
            </Suspense>
          </div>
          <div id="products">
            <Suspense fallback={<SectionSkeleton />}>
              <CarouselSlider />
            </Suspense>
          </div>

          <div id="mission">
            {/* <Mission /> */}
          </div>

          <div id="krishna-names">
            <KrishnaNames />
          </div>

          <div id="community">
            <Community />
          </div>
          <div id="festival">
            <Festival />
          </div>
          <div className="relative" id="meditation">
            <Suspense fallback={<SectionSkeleton />}>
              {/* <Meditation /> */}
            </Suspense>
          </div>
          <div id="contact">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
