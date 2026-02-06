// Throttle function for scroll performance
const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Debounce function for resize events
const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Optimized smooth scroll using native + fallback
export const handleSmoothScroll = (e, targetId) => {
  e.preventDefault();
  const target = document.querySelector(targetId);
  if (target) {
    // Use native smooth scroll with GPU acceleration
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

// High-performance scroll to element
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const targetPosition =
    element.getBoundingClientRect().top + window.pageYOffset - offset;

  // Use native smooth scroll for best performance
  window.scrollTo({
    top: targetPosition,
    behavior: "smooth",
  });
};

// Limit max particles for performance
const MAX_PARTICLES = 6; // Reduced from 10 for better performance
let particleCount = 0;

export const createParticle = () => {
  const particlesContainer = document.querySelector(".particles");
  if (!particlesContainer) return;

  // Limit particles to prevent DOM bloat
  if (particleCount >= MAX_PARTICLES) return;

  const particle = document.createElement("div");
  particle.className = "particle";

  const randomLeft = Math.random() * 100;
  const randomDelay = Math.random() * 5; // Reduced delay range
  const randomDuration = Math.random() * 3 + 4; // Faster animations

  const colors = ["#FFD700", "#00FFFF", "#FF1493", "#8A2BE2"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  // Use cssText for batch style updates (faster than individual properties)
  particle.style.cssText = `
    left: ${randomLeft}%;
    animation-delay: ${randomDelay}s;
    animation-duration: ${randomDuration}s;
    background: ${randomColor};
    will-change: transform, opacity;
    contain: layout style paint;
    transform: translateZ(0);
  `;

  particlesContainer.appendChild(particle);
  particleCount++;

  // Faster cleanup
  setTimeout(() => {
    particle.remove();
    particleCount--;
  }, 10000);
};

// Intersection Observer for lazy loading animations
export const createScrollObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: "50px",
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// RAF-based scroll handler for smooth updates
export const createSmoothScrollHandler = (callback) => {
  let ticking = false;

  return () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
      ticking = true;
    }
  };
};

export { throttle, debounce };
