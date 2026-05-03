import React from "react";
import { motion } from "framer-motion";

/**
 * iOS Detection — avoid framer-motion gestures on iOS Safari
 * where they cause scrolling / touch glitches.
 */
const isIOSSafari = () => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const isAppleMobileUA = /iPad|iPhone|iPod/.test(ua);
  // iPadOS 13+ often reports itself as Macintosh with touch points.
  const isIPadOSDesktopUA =
    platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return (isAppleMobileUA || isIPadOSDesktopUA) && !window.MSStream;
};

/**
 * SafeMotionDiv — renders a plain <div> on iOS Safari,
 * a framer-motion <motion.div> everywhere else.
 */
export const SafeMotionDiv = ({
  children,
  whileHover,
  whileTap,
  initial,
  animate,
  exit,
  transition,
  ...props
}) => {
  if (isIOSSafari()) {
    return (
      <div
        {...props}
        style={{
          ...props.style,
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      {...props}
      whileHover={whileHover}
      whileTap={whileTap}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};

/**
 * SafeMotionButton — renders a plain <button> on iOS Safari,
 * a framer-motion <motion.button> everywhere else.
 */
export const SafeMotionButton = ({
  children,
  whileHover,
  whileTap,
  initial,
  animate,
  exit,
  transition,
  ...props
}) => {
  if (isIOSSafari()) {
    return (
      <button
        {...props}
        style={{
          ...props.style,
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <motion.button
      {...props}
      whileHover={whileHover}
      whileTap={whileTap}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
    >
      {children}
    </motion.button>
  );
};
