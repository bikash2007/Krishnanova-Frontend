import React from "react";
import { IoTrophy } from "react-icons/io5";

/**
 * AchievementNotification - Fixed position notification for achievement unlocks
 * Note: This component is controlled via GSAP animations from the parent
 */
const AchievementNotification = ({ isMobile }) => {
  if (isMobile) return null; // Only show on desktop

  return (
    <div className="achievement-notification fixed top-24 right-6 z-50 opacity-0 pointer-events-none">
      <div className="backdrop-blur-md bg-gradient-to-br from-amber-400/90 to-orange-500/90 rounded-2xl p-4 shadow-2xl border border-white/30">
        <div className="flex items-center gap-3">
          <IoTrophy className="text-3xl text-white" />
          <div>
            <div className="text-white font-bold achievement-name">
              Achievement Unlocked!
            </div>
            <div className="text-white/90 text-sm achievement-desc">
              Description
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;
