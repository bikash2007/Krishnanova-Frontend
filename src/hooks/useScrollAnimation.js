import { useEffect, useRef } from "react";

const useScrollAnimation = () => {
  const observerRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    observerRef.current = new IntersectionObserver((entries) => {
      // Use requestAnimationFrame for smooth visual updates
      requestAnimationFrame(() => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");

            // Add sacred symbols animation (debounced)
            if (entry.target.classList.contains("name-card")) {
              createSacredSymbol(entry.target);
            }

            // Unobserve after revealing for better performance
            observerRef.current?.unobserve(entry.target);
          }
        });
      });
    }, observerOptions);

    // Defer observation to prevent blocking initial render
    requestAnimationFrame(() => {
      const elements = document.querySelectorAll(
        ".scroll-reveal, .scroll-slide-left, .scroll-slide-right",
      );
      elements.forEach((el) => {
        observerRef.current?.observe(el);
      });
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const createSacredSymbol = (element) => {
    const symbols = ["🕉️", "🪷", "🦚", "⭐", "💫", "🌙"];
    const symbol = document.createElement("div");
    symbol.className = "sacred-symbol";
    symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    symbol.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      color: #FFD700;
      position: absolute;
      pointer-events: none;
      will-change: opacity, transform;
    `;

    element.style.position = "relative";
    element.appendChild(symbol);

    setTimeout(() => {
      symbol.remove();
    }, 3000);
  };

  return observerRef;
};

export default useScrollAnimation;
