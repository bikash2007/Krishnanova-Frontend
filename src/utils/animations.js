export const handleSmoothScroll = (e, targetId) => {
  e.preventDefault();
  const target = document.querySelector(targetId);
  if (target) {
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

// Limit max particles for performance
const MAX_PARTICLES = 10;
let particleCount = 0;

export const createParticle = () => {
  const particlesContainer = document.querySelector(".particles");
  if (!particlesContainer) return;

  // Limit particles to prevent DOM bloat
  if (particleCount >= MAX_PARTICLES) return;

  const particle = document.createElement("div");
  particle.className = "particle";

  const randomLeft = Math.random() * 100;
  const randomDelay = Math.random() * 10;
  const randomDuration = Math.random() * 5 + 5;

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
  `;

  particlesContainer.appendChild(particle);
  particleCount++;

  setTimeout(() => {
    particle.remove();
    particleCount--;
  }, 15000);
};
