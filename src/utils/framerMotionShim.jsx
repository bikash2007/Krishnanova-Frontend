import React from "react";

const MOTION_ONLY_PROPS = new Set([
  "initial",
  "animate",
  "exit",
  "variants",
  "transition",
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileInView",
  "viewport",
  "layout",
  "layoutId",
  "custom",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "dragTransition",
  "onDrag",
  "onDragStart",
  "onDragEnd",
  "onPan",
  "onPanStart",
  "onPanEnd",
  "onTap",
  "onTapStart",
  "onTapCancel",
  "onHoverStart",
  "onHoverEnd",
  "onAnimationStart",
  "onAnimationComplete",
]);

const ANIMATE_STYLE_KEYS = new Set([
  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
  "opacity",
]);

function stripMotionProps(props) {
  if (!props) return props;

  const cleaned = {};
  for (const key of Object.keys(props)) {
    if (MOTION_ONLY_PROPS.has(key)) continue;
    cleaned[key] = props[key];
  }
  return cleaned;
}

function extractStaticAnimateStyle(animate) {
  if (!animate || typeof animate !== "object" || Array.isArray(animate)) {
    return null;
  }

  const style = {};
  for (const key of Object.keys(animate)) {
    if (!ANIMATE_STYLE_KEYS.has(key)) continue;
    if (animate[key] == null) continue;
    style[key] = animate[key];
  }

  return Object.keys(style).length > 0 ? style : null;
}

function createMotionComponent(tag) {
  const MotionComponent = React.forwardRef(function MotionShim(props, ref) {
    const cleanedProps = stripMotionProps(props);

    // Preserve common layout/state driven values (e.g. progress bars that used
    // `animate={{ width: "42%" }}`) without bringing framer-motion back.
    const animateStyle = extractStaticAnimateStyle(props?.animate);
    if (animateStyle) {
      cleanedProps.style = { ...(cleanedProps.style || {}), ...animateStyle };
    }

    return React.createElement(tag, { ...cleanedProps, ref });
  });

  MotionComponent.displayName = `motion.${String(tag)}`;
  return MotionComponent;
}

const motionComponentCache = new Map();

export const motion = new Proxy(
  {},
  {
    get(_target, prop) {
      const tag = String(prop);

      if (!motionComponentCache.has(tag)) {
        motionComponentCache.set(tag, createMotionComponent(tag));
      }

      return motionComponentCache.get(tag);
    },
  },
);

export function AnimatePresence({ children }) {
  return <>{children}</>;
}

// These are imported in a few files but should not be used anymore.
// If they are invoked, we want a loud failure (to finish the migration).
export function useMotionValue() {
  throw new Error(
    "useMotionValue is not supported (framer-motion removed). Replace with GSAP or React state.",
  );
}

export function useTransform() {
  throw new Error(
    "useTransform is not supported (framer-motion removed). Replace with GSAP or React state.",
  );
}
