/**
 * GSAP-powered Modal Component
 * Replaces Framer Motion AnimatePresence pattern with GSAP animations
 */
import React, { useEffect, useRef, memo } from "react";
import { gsap } from "gsap";

const Modal = memo(({ isOpen, onClose, children, className = "" }) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!overlayRef.current || !contentRef.current) return;

    if (isOpen) {
      // Show modal with GSAP
      gsap.set(overlayRef.current, { display: "flex" });
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" },
      );
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          delay: 0.05,
        },
      );
    } else {
      // Hide modal with GSAP
      const tl = gsap.timeline({
        onComplete: () => {
          if (overlayRef.current) {
            gsap.set(overlayRef.current, { display: "none" });
          }
        },
      });
      tl.to(contentRef.current, {
        opacity: 0,
        scale: 0.9,
        y: 20,
        duration: 0.2,
        ease: "power2.in",
      });
      tl.to(overlayRef.current, { opacity: 0, duration: 0.15 }, "-=0.1");
    }
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70"
      style={{ display: isOpen ? "flex" : "none" }}
      onClick={handleOverlayClick}
    >
      <div
        ref={contentRef}
        className={`w-full sm:max-w-2xl h-[90vh] sm:h-auto sm:max-h-[85vh] flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-t-3xl sm:rounded-2xl border-t sm:border border-amber-400/30 shadow-2xl overflow-hidden ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
});

Modal.displayName = "Modal";

export default Modal;
