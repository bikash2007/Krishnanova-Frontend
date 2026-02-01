import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import YogaPracticeCards from "./YogaPracticeCards";
import BhaktiPillars, { BHAKTI_PILLARS, DEVOTEE_STAGES } from "./BhaktiPillars";
import LilaMap from "./LilaMap";
import {
  GiTempleGate,
  GiLotusFlower,
  GiScrollUnfurled,
  GiMeditation,
} from "react-icons/gi";
import { IoSparkles, IoMap, IoStatsChart } from "react-icons/io5";

/**
 * AchievementsTab - Display spiritual journey progress with Bhakti Pillars and Lila Map
 */
const AchievementsTab = ({
  practices,
  userStats,
  isMobile,
  bhaktiProgress = {},
}) => {
  const [activeView, setActiveView] = useState("journey"); // journey, pillars, legacy

  // Calculate total bhakti progress
  const totalBhaktiProgress = useMemo(() => {
    return Object.values(bhaktiProgress).reduce(
      (sum, val) => sum + (val || 0),
      0,
    );
  }, [bhaktiProgress]);

  // Map old practices to bhakti pillars for backwards compatibility
  const mappedBhaktiProgress = useMemo(() => {
    return {
      sravanam: bhaktiProgress.sravanam || (practices.jnanaYoga || 0) * 5,
      kirtanam: bhaktiProgress.kirtanam || (practices.bhaktiYoga || 0) * 3,
      smaranam:
        bhaktiProgress.smaranam || Math.floor((practices.bhaktiYoga || 0) / 2),
      archanam: bhaktiProgress.archanam || (practices.rajaYoga || 0) * 4,
    };
  }, [bhaktiProgress, practices]);

  // View toggle buttons
  const ViewToggle = () => (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
      {[
        { id: "journey", label: "Lila Map", icon: IoMap },
        { id: "pillars", label: "Bhakti Pillars", icon: GiLotusFlower },
        { id: "legacy", label: "Yoga Paths", icon: GiMeditation },
      ].map((view) => {
        const Icon = view.icon;
        return (
          <motion.button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              activeView === view.id
                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg"
                : "bg-white/10 text-blue-100/70 hover:bg-white/20"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon className="text-lg" />
            {view.label}
          </motion.button>
        );
      })}
    </div>
  );

  return (
    <motion.div
      key="achievements"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4 md:space-y-6"
    >
      {/* Header with total progress */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
            Your Spiritual Journey
          </h2>
          <p className="text-sm text-blue-100/60">
            Walk the path of devotion through sacred milestones
          </p>
        </div>
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-400/20 to-orange-500/20 px-4 py-2 rounded-xl border border-amber-400/30">
          <IoSparkles className="text-xl text-amber-300" />
          <div>
            <p className="text-2xl font-bold text-white">
              {totalBhaktiProgress ||
                Object.values(mappedBhaktiProgress).reduce((a, b) => a + b, 0)}
            </p>
            <p className="text-xs text-cyan-300">Total Bhakti</p>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <ViewToggle />

      {/* Content based on active view */}
      <AnimatePresence mode="wait">
        {activeView === "journey" && (
          <motion.div
            key="journey-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <LilaMap
              totalProgress={
                totalBhaktiProgress ||
                Object.values(mappedBhaktiProgress).reduce((a, b) => a + b, 0)
              }
              isMobile={isMobile}
            />
          </motion.div>
        )}

        {activeView === "pillars" && (
          <motion.div
            key="pillars-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <BhaktiPillars
              progress={
                Object.keys(mappedBhaktiProgress).length > 0
                  ? mappedBhaktiProgress
                  : bhaktiProgress
              }
              isMobile={isMobile}
            />
          </motion.div>
        )}

        {activeView === "legacy" && (
          <motion.div
            key="legacy-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <YogaPracticeCards practices={practices} isMobile={isMobile} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievements Grid */}
      {userStats.achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-xl md:rounded-2xl shadow-2xl border border-white/20 p-4 md:p-6"
        >
          <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-3 md:mb-4">
            Unlocked Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {userStats.achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id || index}
                className="text-center p-3 md:p-4 bg-gradient-to-br from-amber-400/10 to-orange-500/10 rounded-lg md:rounded-xl border border-amber-400/30"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl md:text-3xl mb-1 md:mb-2">
                  {achievement.icon}
                </div>
                <div className="text-xs md:text-sm font-semibold text-amber-200">
                  {achievement.name}
                </div>
                <div className="text-xs text-blue-100/60 hidden sm:block">
                  {achievement.description}
                </div>
                {achievement.category && (
                  <div className="mt-2">
                    <span className="text-xs bg-gradient-to-r from-amber-400/20 to-orange-500/20 px-2 py-1 rounded-full text-amber-200 border border-amber-400/30">
                      {achievement.category}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AchievementsTab;
