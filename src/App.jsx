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

const App = () => {
  const appRef = useRef(null);
  const location = useLocation();

  // GSAP smooth scrolling and animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Smooth parallax for background elements
      gsap.utils.toArray(".parallax-bg").forEach((bg) => {
        gsap.to(bg, {
          yPercent: 50,
          ease: "none",
          scrollTrigger: {
            trigger: bg,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      });

      // Smooth parallax for energy flows
      gsap.utils.toArray(".energy-flow").forEach((flow, index) => {
        gsap.to(flow, {
          yPercent: 20 + index * 10,
          ease: "none",
          scrollTrigger: {
            trigger: flow,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      });

      // Reveal animations for scroll elements
      gsap.utils.toArray(".scroll-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // Slide from left animations
      gsap.utils.toArray(".scroll-slide-left").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -80 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // Slide from right animations
      gsap.utils.toArray(".scroll-slide-right").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: 80 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    }, appRef);

    return () => ctx.revert();
  }, []);

  // Handle scrolling after navigation from other routes
  useEffect(() => {
    if (location.state?.scrollToId) {
      const targetId = location.state.scrollToId;

      // Small delay to ensure the page has fully rendered
      const timer = setTimeout(() => {
        const section = document.getElementById(targetId);
        if (section) {
          // Use GSAP for smooth scrolling
          gsap.to(window, {
            duration: 1,
            scrollTo: { y: section, offsetY: 0 },
            ease: "power2.inOut",
          });
        }

        // Clear the state to prevent re-scrolling on page refresh
        window.history.replaceState({}, document.title);
      }, 100);

      return () => clearTimeout(timer);
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
