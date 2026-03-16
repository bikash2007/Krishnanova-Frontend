/**
 * GSAP Animation Utilities
 * Replaces Framer Motion patterns with GSAP for better performance
 */
import { gsap } from "gsap";

const supportsHoverAndFinePointer = () => {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
};

// Animation presets for common patterns
export const animations = {
  // Fade in from bottom
  fadeInUp: (element, options = {}) => {
    return gsap.fromTo(
      element,
      { opacity: 0, y: options.y || 20 },
      {
        opacity: 1,
        y: 0,
        duration: options.duration || 0.4,
        ease: options.ease || "power2.out",
        delay: options.delay || 0,
        ...options,
      },
    );
  },

  // Fade out to bottom
  fadeOutDown: (element, options = {}) => {
    return gsap.to(element, {
      opacity: 0,
      y: options.y || 20,
      duration: options.duration || 0.3,
      ease: options.ease || "power2.in",
      ...options,
    });
  },

  // Scale in
  scaleIn: (element, options = {}) => {
    return gsap.fromTo(
      element,
      { opacity: 0, scale: options.fromScale || 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: options.duration || 0.3,
        ease: options.ease || "power2.out",
        ...options,
      },
    );
  },

  // Scale out
  scaleOut: (element, options = {}) => {
    return gsap.to(element, {
      opacity: 0,
      scale: options.toScale || 0.9,
      duration: options.duration || 0.2,
      ease: options.ease || "power2.in",
      ...options,
    });
  },

  // Stagger children
  staggerIn: (elements, options = {}) => {
    return gsap.fromTo(
      elements,
      { opacity: 0, y: options.y || 20 },
      {
        opacity: 1,
        y: 0,
        duration: options.duration || 0.4,
        stagger: options.stagger || 0.1,
        ease: options.ease || "power2.out",
        ...options,
      },
    );
  },

  // Hover scale effect
  hoverScale: (element, scale = 1.05) => {
    if (!supportsHoverAndFinePointer()) return () => {};

    const handleEnter = () =>
      gsap.to(element, { scale, duration: 0.2, ease: "power2.out" });
    const handleLeave = () =>
      gsap.to(element, { scale: 1, duration: 0.2, ease: "power2.out" });

    element.addEventListener("mouseenter", handleEnter);
    element.addEventListener("mouseleave", handleLeave);

    // Return cleanup function
    return () => {
      element.removeEventListener("mouseenter", handleEnter);
      element.removeEventListener("mouseleave", handleLeave);
    };
  },

  // Modal show/hide
  showModal: (overlay, modal, options = {}) => {
    const tl = gsap.timeline();
    tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    tl.fromTo(
      modal,
      { opacity: 0, scale: 0.9, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" },
      "-=0.1",
    );
    return tl;
  },

  hideModal: (overlay, modal, onComplete) => {
    const tl = gsap.timeline({ onComplete });
    tl.to(modal, {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.2,
      ease: "power2.in",
    });
    tl.to(overlay, { opacity: 0, duration: 0.2 }, "-=0.1");
    return tl;
  },

  // List item animation
  animateListItems: (
    container,
    itemSelector = ".animate-item",
    options = {},
  ) => {
    const items = container.querySelectorAll(itemSelector);
    if (items.length === 0) return;

    return gsap.fromTo(
      items,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: options.duration || 0.4,
        stagger: options.stagger || 0.08,
        ease: options.ease || "power2.out",
        ...options,
      },
    );
  },

  // Button press effect
  buttonPress: (element) => {
    if (!supportsHoverAndFinePointer()) return () => {};

    const handleDown = () => gsap.to(element, { scale: 0.95, duration: 0.1 });
    const handleUp = () => gsap.to(element, { scale: 1, duration: 0.1 });

    element.addEventListener("pointerdown", handleDown, { passive: true });
    element.addEventListener("pointerup", handleUp);
    element.addEventListener("pointercancel", handleUp);
    element.addEventListener("pointerleave", handleUp);

    return () => {
      element.removeEventListener("pointerdown", handleDown);
      element.removeEventListener("pointerup", handleUp);
      element.removeEventListener("pointercancel", handleUp);
      element.removeEventListener("pointerleave", handleUp);
    };
  },
};

// Hook-like utility for React components
export const useGsapAnimation = (ref, animationType, options = {}) => {
  if (!ref.current) return null;
  return animations[animationType](ref.current, options);
};

// CSS transition classes (for simple animations without JS)
export const transitionClasses = {
  fadeIn: "transition-opacity duration-300 ease-out",
  fadeOut: "transition-opacity duration-200 ease-in",
  scale: "transition-transform duration-200 ease-out",
  all: "transition-all duration-300 ease-out",
};

export default animations;
