import React from "react";
import { motion } from "framer-motion";
import YogaPracticeCards from "./YogaPracticeCards";

/**
 * AchievementsTab - Display spiritual journey progress and unlocked achievements
 */
const AchievementsTab = ({ practices, userStats, isMobile }) => {
  return (
    <motion.div
      key="achievements"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4 md:space-y-6"
    >
      {/* Yoga Practice Cards */}
      <div>
        <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-3 md:mb-4">
          Your Spiritual Journey
        </h2>
        <YogaPracticeCards practices={practices} isMobile={isMobile} />
      </div>

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
