import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSanga, DEVOTEE_LEVELS } from "./SangaContext";
import { FaLock, FaCheck, FaStar, FaArrowRight } from "react-icons/fa";

// Individual Level Badge
const LevelBadge = ({ level, isCurrentLevel, isUnlocked, size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8 text-lg",
    md: "w-12 h-12 text-2xl",
    lg: "w-16 h-16 text-3xl",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`relative ${sizes[size]} rounded-full flex items-center justify-center 
        ${
          isCurrentLevel
            ? `bg-gradient-to-br ${level.color} shadow-lg ring-4 ring-white/30`
            : isUnlocked
              ? `bg-gradient-to-br ${level.color} opacity-70`
              : "bg-gray-700/50 opacity-50"
        }`}
    >
      <span className={isUnlocked ? "" : "grayscale"}>{level.icon}</span>

      {isCurrentLevel && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/50"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {!isUnlocked && (
        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
          <FaLock size={size === "sm" ? 10 : 14} className="text-gray-400" />
        </div>
      )}
    </motion.div>
  );
};

// Devotee Level Card with full details
export const DevoteeLevelCard = ({ showProgress = true }) => {
  const { currentLevel, devoteeData, getNextLevelProgress } = useSanga();
  const [showDetails, setShowDetails] = useState(false);
  const progress = getNextLevelProgress();
  const levels = Object.values(DEVOTEE_LEVELS);

  return (
    <motion.div
      layout
      className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 overflow-hidden"
    >
      {/* Main Badge Display */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-4">
          <LevelBadge
            level={currentLevel}
            isCurrentLevel={true}
            isUnlocked={true}
            size="lg"
          />

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-amber-300">
                {currentLevel.name}
              </h3>
              <span className="text-amber-100/60 text-sm">
                {currentLevel.sanskrit}
              </span>
            </div>
            <p className="text-sm text-blue-100/70">{currentLevel.meaning}</p>

            {showProgress && progress.next && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-blue-100/60 mb-1">
                  <span>{devoteeData.points} points</span>
                  <span>
                    {progress.pointsNeeded} to {progress.next.name}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${currentLevel.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.current}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}
          </div>

          <motion.div
            animate={{ rotate: showDetails ? 90 : 0 }}
            className="text-amber-400"
          >
            <FaArrowRight />
          </motion.div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10"
          >
            <div className="p-4 space-y-4">
              {/* Level Description */}
              <p className="text-sm text-blue-100/80">
                {currentLevel.description}
              </p>

              {/* Journey Path */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
                {levels.map((level, idx) => {
                  const isUnlocked = devoteeData.points >= level.minPoints;
                  const isCurrent = level.id === currentLevel.id;

                  return (
                    <React.Fragment key={level.id}>
                      <div className="flex flex-col items-center flex-shrink-0">
                        <LevelBadge
                          level={level}
                          isCurrentLevel={isCurrent}
                          isUnlocked={isUnlocked}
                          size="sm"
                        />
                        <span
                          className={`text-xs mt-1 ${isCurrent ? "text-amber-300" : "text-blue-100/50"}`}
                        >
                          {level.name}
                        </span>
                      </div>
                      {idx < levels.length - 1 && (
                        <div
                          className={`h-0.5 w-4 flex-shrink-0 ${
                            isUnlocked ? "bg-amber-400/50" : "bg-white/10"
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Current Badges */}
              {devoteeData.badges.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-amber-300 mb-2">
                    Earned Badges
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {devoteeData.badges.map((badge) => (
                      <span
                        key={badge}
                        className="px-3 py-1 bg-amber-400/20 text-amber-300 text-xs rounded-full border border-amber-400/30"
                      >
                        <FaStar className="inline mr-1" size={10} />
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Access */}
              <div>
                <h4 className="text-sm font-semibold text-amber-300 mb-2">
                  Event Access
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentLevel.eventAccess.map((access) => (
                    <span
                      key={access}
                      className="px-3 py-1 bg-green-400/20 text-green-300 text-xs rounded-full border border-green-400/30"
                    >
                      <FaCheck className="inline mr-1" size={10} />
                      {access.charAt(0).toUpperCase() + access.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Compact inline badge for posts/comments
export const DevoteeInlineBadge = ({ level, points }) => {
  const levelData =
    Object.values(DEVOTEE_LEVELS)
      .sort((a, b) => b.minPoints - a.minPoints)
      .find((l) => (points || 0) >= l.minPoints) || DEVOTEE_LEVELS.SHRAVAKA;

  const displayLevel = level ? DEVOTEE_LEVELS[level.toUpperCase()] : levelData;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r ${displayLevel.color} text-xs font-semibold text-white shadow-lg`}
    >
      <span>{displayLevel.icon}</span>
      <span className="hidden sm:inline">{displayLevel.name}</span>
    </motion.div>
  );
};

// Level Progress Minimal
export const LevelProgressMini = () => {
  const { currentLevel, getNextLevelProgress, devoteeData } = useSanga();
  const progress = getNextLevelProgress();

  return (
    <div className="flex items-center gap-3">
      <LevelBadge
        level={currentLevel}
        isCurrentLevel={true}
        isUnlocked={true}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-xs text-blue-100/60">
          <span className="truncate">{currentLevel.name}</span>
          {progress.next && <span>{devoteeData.points}pts</span>}
        </div>
        {progress.next && (
          <div className="h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${currentLevel.color}`}
              style={{ width: `${progress.current}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DevoteeLevelCard;
