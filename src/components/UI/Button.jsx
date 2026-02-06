import React from "react";

const Button = ({
  children,
  onClick,
  variant = "krishna",
  size = "medium",
  className = "",
  disabled = false,
  loading = false,
  icon = null,
  ...props
}) => {
  // **Divine Color Palette**
  const colors = {
    primary: "#39C0CD",
    secondary: "#FF6B35",
    accent: "#FFB84D",
    deepTeal: "#0A7A85",
    warmRed: "#D63031",
    cream: "#FFF8E7",
    dark: "#2D3748",
    light: "#F8F9FA",
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-semibold 
    transition-all duration-300 ease-out
    hover:-translate-y-1 hover:scale-105 
    active:translate-y-0 active:scale-95
    shadow-lg hover:shadow-xl relative overflow-hidden 
    focus:outline-none focus:ring-4 focus:ring-offset-2 
    rounded-2xl cursor-pointer select-none
    transform-gpu will-change-transform
    disabled:opacity-50 disabled:cursor-not-allowed 
    disabled:hover:translate-y-0 disabled:hover:scale-100
    disabled:hover:shadow-lg
    before:absolute before:inset-0 before:rounded-2xl
    before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0
    before:translate-x-[-100%] hover:before:translate-x-[100%]
    before:transition-transform before:duration-700 before:ease-out
  `
    .replace(/\s+/g, " ")
    .trim();

  const getVariantClasses = (variant) => {
    switch (variant) {
      case "krishna":
        return {
          classes: `text-white font-bold border border-white/20`,
          style: {
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.deepTeal}, ${colors.primary})`,
            boxShadow: `0 4px 15px ${colors.primary}40`,
          },
          hoverStyle: {
            boxShadow: `0 8px 30px ${colors.primary}60`,
          },
        };

      case "secondary":
        return {
          classes: `font-bold border-2`,
          style: {
            background: `linear-gradient(135deg, white, ${colors.cream})`,
            borderColor: `${colors.secondary}50`,
            color: colors.secondary,
            boxShadow: `0 4px 15px ${colors.secondary}20`,
          },
        };

      case "accent":
        return {
          classes: `text-white font-bold border border-white/20`,
          style: {
            background: `linear-gradient(135deg, ${colors.accent}, ${colors.secondary}, ${colors.accent})`,
            boxShadow: `0 4px 15px ${colors.accent}40`,
          },
        };

      case "divine":
        return {
          classes: `text-white font-bold border border-white/20`,
          style: {
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent}, ${colors.secondary})`,
            boxShadow: `0 4px 15px ${colors.primary}30`,
          },
        };

      case "danger":
        return {
          classes: `text-white font-bold border border-white/20`,
          style: {
            background: `linear-gradient(135deg, ${colors.warmRed}, ${colors.secondary})`,
            boxShadow: `0 4px 15px ${colors.warmRed}40`,
          },
        };

      case "ghost":
        return {
          classes: `font-semibold border-2`,
          style: {
            backgroundColor: "transparent",
            borderColor: `${colors.primary}50`,
            color: colors.primary,
          },
        };

      default:
        return getVariantClasses("krishna");
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case "small":
        return "px-4 py-2 text-sm min-w-[80px] h-9";
      case "medium":
        return "px-6 py-3 text-base min-w-[120px] h-11";
      case "large":
        return "px-8 py-4 text-lg min-w-[150px] h-13";
      case "xl":
        return "px-10 py-5 text-xl min-w-[180px] h-15";
      default:
        return getSizeClasses("medium");
    }
  };

  // Enhanced ripple effect with divine colors
  const handleClick = (e) => {
    if (disabled || loading) return;

    // Create divine ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const rippleColor =
      variant === "secondary" || variant === "ghost"
        ? colors.primary
        : "rgba(255, 255, 255, 0.4)";

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: 50%;
      background: ${rippleColor};
      transform: scale(0);
      animation: divine-ripple 0.6s ease-out;
      pointer-events: none;
      z-index: 10;
    `;

    button.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);

    if (onClick) onClick(e);
  };

  const variantConfig = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);

  return (
    <>
      <style>{`
        @keyframes divine-ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        @keyframes divine-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes divine-shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        
        .divine-loading {
          animation: divine-pulse 1.5s ease-in-out infinite;
        }
        
        .divine-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%) skewX(-15deg);
          transition: transform 0.6s ease-out;
        }
        
        .divine-shimmer:hover::after {
          animation: divine-shimmer 0.8s ease-out;
        }

        .divine-button {
          position: relative;
          background-size: 200% 200%;
          animation: divine-gradient 3s ease-in-out infinite;
        }

        @keyframes divine-gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      <button
        className={`${baseClasses} ${sizeClasses} ${className} divine-shimmer ${
          loading ? "divine-loading" : ""
        } ${variant === "divine" ? "divine-button" : ""}`}
        onClick={handleClick}
        disabled={disabled || loading}
        style={variantConfig.style}
        {...props}
      >
        {/* Sacred Om Symbol Background */}
        {variant === "divine" && (
          <div className="absolute inset-0 flex items-center justify-center opacity-10 text-6xl text-white pointer-events-none">
            ॥
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
              style={{
                borderColor:
                  variant === "secondary" || variant === "ghost"
                    ? colors.primary
                    : "currentColor",
              }}
            />
          </div>
        )}

        {/* Content Container */}
        <span
          className={`relative z-10 flex items-center gap-2 transition-all duration-300 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Icon */}
          {icon && !loading && (
            <span className="flex-shrink-0">
              {typeof icon === "string" ? <span>{icon}</span> : icon}
            </span>
          )}

          {/* Text Content */}
          <span className="drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300">
            {children}
          </span>
        </span>

        {/* Divine Glow Overlay */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${
              variant === "secondary" || variant === "ghost"
                ? colors.primary + "10"
                : "rgba(255, 255, 255, 0.1)"
            } 0%, transparent 70%)`,
          }}
        />

        {/* Enhanced Border Glow */}
        {(variant === "krishna" ||
          variant === "divine" ||
          variant === "accent") && (
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              boxShadow: `inset 0 0 0 1px rgba(255, 255, 255, 0.2)`,
            }}
          />
        )}
      </button>
    </>
  );
};

export default Button;
