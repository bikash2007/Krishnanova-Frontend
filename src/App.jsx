import React, { useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import Mission from "./components/Mission/Mission";

import KrishnaNames from "./components/KrishnaNames/KrishnaNames";

import Community from "./components/Community/Community";
import Festival from "./components/Festival/Festival";
import Meditation from "./components/Meditation/Meditation";

import {
  FeatherSVG,
  FluteSVG,
  LotusSVG,
  PeacockFeatherSVG,
} from "./components/UI/Svg";
import { useLocation } from "react-router-dom";
import WisdomPortalPath from "./components/WisdomPortal/WisdomPortalPath";
import CarouselSlider from "./components/Products/CarouselSlider";

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
    // Use RAF for smooth updates
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
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

      // Simplified parallax - only on desktop for performance
      if (window.innerWidth > 768) {
        gsap.utils.toArray(".parallax-bg").forEach((bg) => {
          gsap.to(bg, {
            yPercent: 30,
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
      ScrollTrigger.refresh();
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

      <div className="relative">
        <div id="wisdom" className="relative z-10 ">
          <WisdomPortalPath />
        </div>
        <div id="products">
          <CarouselSlider />
        </div>

        <div id="mission">
          <Mission />
        </div>

        <div id="krishna-names">
          <KrishnaNames />
        </div>

        {/* 🎨 Decorative background elements specific to Home */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Animated SVG flute / feather */}
          <FluteSVG className="absolute w-40 md:w-56 opacity-10 top-20 left-10 animate-float-slow" />
          <FluteSVG className="absolute w-40 md:w-56 opacity-10 top-[40%] right-10 animate-float-slow" />
          <FeatherSVG className="absolute w-32 md:w-48 opacity-10 bottom-10 right-10 animate-float-slower" />
          <PeacockFeatherSVG className="absolute w-48 opacity-8 top-1/3 right-1/3 animate-float-slower" />
          <LotusSVG className="absolute w-32 opacity-8 bottom-20 left-1/4 animate-float-slow" />
        </div>

        {/* 🌟 Main Content */}

        <div id="community">
          <Community />
        </div>
        <div id="festival">
          <Festival />
        </div>
        <div className="relative" id="meditation">
          <Meditation />
        </div>
        <div id="contact">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;
