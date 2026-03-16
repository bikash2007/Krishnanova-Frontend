import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSanga, DEVOTEE_LEVELS } from "./SangaContext";
import {
  FaLock,
  FaCheck,
  FaStar,
  FaArrowRight,
  FaChevronDown,
  FaInfoCircle,
} from "react-icons/fa";
import { GiMeditation, GiPrayerBeads } from "react-icons/gi";
import { IoSparkles } from "react-icons/io5";

// ─── Point System Breakdown ──────
const POINT_ACTIVITIES = [
  { activity: "Daily Login", points: 1, icon: "🌅" },
  { activity: "Chanting", points: 2, icon: "📿" },
  { activity: "Meditation", points: 3, icon: "🧘" },
  { activity: "Completing Practice", points: 5, icon: "✅" },
  { activity: "Reading Gita", points: 5, icon: "📖" },
  { activity: "Helping a Devotee", points: 8, icon: "🙏" },
  { activity: "Sharing Your Story", points: 10, icon: "✍️" },
  { activity: "Attending an Event", points: 15, icon: "🎪" },
];

// Individual Level Badge
const LevelBadge = ({ level, isCurrentLevel, isUnlocked, size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-xl",
    lg: "w-16 h-16 text-2xl",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`relative ${sizes[size]} rounded-full flex items-center justify-center flex-shrink-0
        ${
          isCurrentLevel
            ? `bg-gradient-to-br ${level.color} shadow-lg ring-2 ring-white/30`
            : isUnlocked
              ? `bg-gradient-to-br ${level.color} opacity-70`
              : "bg-gray-700/50 opacity-40"
        }`}
    >
      <span className={isUnlocked ? "" : "grayscale opacity-50"}>
        {level.icon}
      </span>

      {isCurrentLevel && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/40"
          animate={{ scale: [1, 1.15, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}

      {!isUnlocked && (
        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
          <FaLock size={size === "sm" ? 8 : 12} className="text-gray-400" />
        </div>
      )}
    </motion.div>
  );
};

// Devotee Level Card with full details + algorithm explainer
export const DevoteeLevelCard = ({ showProgress = true }) => {
  const { currentLevel, devoteeData, getNextLevelProgress } = useSanga();
  const [showDetails, setShowDetails] = useState(false);
  const [showAlgorithm, setShowAlgorithm] = useState(false);
  const progress = getNextLevelProgress();
  const levels = Object.values(DEVOTEE_LEVELS).sort(
    (a, b) => a.minPoints - b.minPoints,
  );

  return (
    <motion.div
      layout
      className="backdrop-blur-md bg-gradient-to-br from-white/[0.08] to-white/[0.03] rounded-2xl border border-white/[0.12] overflow-hidden"
    >
      {/* Main Badge Display */}
      <div
        className="p-4 cursor-pointer active:bg-white/[0.03] transition-colors"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <LevelBadge
            level={currentLevel}
            isCurrentLevel={true}
            isUnlocked={true}
            size="lg"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-bold text-amber-300">
                {currentLevel.name}
              </h3>
              <span className="text-amber-100/40 text-xs sm:text-sm">
                {currentLevel.sanskrit}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-blue-100/60">
              {currentLevel.meaning}
            </p>

            {showProgress && progress.next && (
              <div className="mt-2">
                <div className="flex justify-between text-[10px] sm:text-xs text-blue-100/50 mb-1">
                  <span>{devoteeData.points} pts</span>
                  <span>
                    {progress.pointsNeeded} to {progress.next.name}
                  </span>
                </div>
                <div className="h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${currentLevel.color} rounded-full`}
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
            className="text-amber-400/60"
          >
            <FaChevronDown
              size={14}
              className={`transform transition-transform ${showDetails ? "rotate-180" : ""}`}
            />
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
            className="border-t border-white/10 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Level Description */}
              <p className="text-sm text-blue-100/70 leading-relaxed">
                {currentLevel.description}
              </p>

              {/* Visual Journey Path */}
              <div>
                <h4 className="text-xs font-semibold text-amber-300/80 uppercase tracking-wider mb-3">
                  Spiritual Journey
                </h4>
                <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
                  {levels.map((level, idx) => {
                    const isUnlocked =
                      devoteeData.points >= level.minPoints;
                    const isCurrent = level.id === currentLevel.id;

                    return (
                      <React.Fragment key={level.id}>
                        <div className="flex flex-col items-center flex-shrink-0 w-12 sm:w-14">
                          <LevelBadge
                            level={level}
                            isCurrentLevel={isCurrent}
                            isUnlocked={isUnlocked}
                            size="sm"
                          />
                          <span
                            className={`text-[9px] sm:text-[10px] mt-1 text-center leading-tight ${
                              isCurrent
                                ? "text-amber-300 font-bold"
                                : isUnlocked
                                  ? "text-blue-100/60"
                                  : "text-blue-100/30"
                            }`}
                          >
                            {level.name}
                          </span>
                          <span
                            className={`text-[8px] ${isCurrent ? "text-amber-400/60" : "text-blue-100/30"}`}
                          >
                            {level.minPoints}pts
                          </span>
                        </div>
                        {idx < levels.length - 1 && (
                          <div
                            className={`h-px w-3 sm:w-4 flex-shrink-0 mt-[-12px] ${
                              isUnlocked ? "bg-amber-400/40" : "bg-white/10"
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* How Points Work (Algorithm) */}
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAlgorithm(!showAlgorithm);
                  }}
                  className="flex items-center gap-2 text-xs font-semibold text-cyan-300/80 hover:text-cyan-200 transition-colors w-full"
                >
                  <FaInfoCircle size={12} />
                  <span>How the Sangha Point System Works</span>
                  <FaChevronDown
                    size={10}
                    className={`ml-auto transform transition-transform ${showAlgorithm ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {showAlgorithm && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 p-3 bg-white/[0.04] rounded-xl border border-white/10 space-y-3">
                        <p className="text-xs text-blue-100/60 leading-relaxed">
                          Your spiritual level is determined by your accumulated
                          points. Every spiritual activity you perform earns
                          points, and as you cross level thresholds, you
                          progress to the next stage of devotion.
                        </p>

                        {/* Points per activity table */}
                        <div className="grid grid-cols-2 gap-1.5">
                          {POINT_ACTIVITIES.map((act) => (
                            <div
                              key={act.activity}
                              className="flex items-center gap-2 p-1.5 bg-white/[0.03] rounded-lg"
                            >
                              <span className="text-sm">{act.icon}</span>
                              <div className="min-w-0 flex-1">
                                <p className="text-[10px] sm:text-xs text-blue-100/70 truncate">
                                  {act.activity}
                                </p>
                              </div>
                              <span className="text-[10px] sm:text-xs font-bold text-amber-300 flex-shrink-0">
                                +{act.points}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Level thresholds */}
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-blue-100/40 mb-1.5 font-semibold">
                            Level Thresholds
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {levels.map((level) => (
                              <span
                                key={level.id}
                                className={`text-[10px] px-2 py-0.5 rounded-full ${
                                  devoteeData.points >= level.minPoints
                                    ? `bg-gradient-to-r ${level.color}/20 text-blue-100/80 border border-white/15`
                                    : "bg-white/[0.04] text-blue-100/40 border border-white/5"
                                }`}
                              >
                                {level.name}: {level.minPoints}pts
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Current Badges */}
              {devoteeData.badges.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-amber-300/80 uppercase tracking-wider mb-2">
                    Earned Badges
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {devoteeData.badges.map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-400/15 text-amber-300 text-xs rounded-full border border-amber-400/25"
                      >
                        <FaStar size={9} />
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Access */}
              <div>
                <h4 className="text-xs font-semibold text-amber-300/80 uppercase tracking-wider mb-2">
                  Event Access
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentLevel.eventAccess.map((access) => (
                    <span
                      key={access}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-400/15 text-green-300 text-xs rounded-full border border-green-400/25"
                    >
                      <FaCheck size={8} />
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
  if (!displayLevel) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r ${displayLevel.color} text-[10px] sm:text-xs font-semibold text-white shadow-sm`}
    >
      <span className="text-xs">{displayLevel.icon}</span>
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
              className={`h-full bg-gradient-to-r ${currentLevel.color} rounded-full`}
              style={{ width: `${progress.current}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Rasa Tag Component (for displaying on profiles and posts)
export const RasaTag = ({ rasaId, size = "sm" }) => {
  const { EMOTIONAL_RASAS } = useSanga();
  const rasa = Object.values(EMOTIONAL_RASAS).find((r) => r.id === rasaId);
  if (!rasa) return null;

  const sizes = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-3 py-1 text-xs gap-1.5",
    lg: "px-4 py-1.5 text-sm gap-2",
  };

  return (
    <span
      className={`inline-flex items-center ${sizes[size]} rounded-full bg-gradient-to-r ${rasa.color} text-white font-medium shadow-sm`}
    >
      <span>{rasa.emoji}</span>
      <span>{rasa.name}</span>
    </span>
  );
};

export default DevoteeLevelCard;
