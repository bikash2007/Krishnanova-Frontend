import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  GiSoundWaves,
  GiMeditation,
  GiLotusFlower,
  GiPrayerBeads,
  GiThirdEye,
  GiHeartBeats,
  GiSunRadiations,
  GiScrollUnfurled,
} from "react-icons/gi";
import {
  IoSparkles,
  IoFlame,
  IoWater,
  IoLeaf,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { FaSpinner } from "react-icons/fa";
import { useBhaktiProgress } from "./BhaktiProgressContext";

// Icon mapping for pillars (used when rendering from backend data)
const PILLAR_ICONS = {
  sravanam: { icon: GiScrollUnfurled, element: IoWater },
  kirtanam: { icon: GiSoundWaves, element: IoFlame },
  smaranam: { icon: GiThirdEye, element: IoSparkles },
  archanam: { icon: GiMeditation, element: IoLeaf },
};

// Color mapping for pillars
const PILLAR_COLORS = {
  sravanam: {
    color: "from-cyan-400 to-blue-500",
    bgGlow: "rgba(34, 211, 238, 0.3)",
  },
  kirtanam: {
    color: "from-orange-400 to-red-500",
    bgGlow: "rgba(251, 146, 60, 0.3)",
  },
  smaranam: {
    color: "from-purple-400 to-violet-500",
    bgGlow: "rgba(167, 139, 250, 0.3)",
  },
  archanam: {
    color: "from-amber-400 to-yellow-500",
    bgGlow: "rgba(251, 191, 36, 0.3)",
  },
};

// The Four Pillars of Bhakti mapped to real devotional concepts (fallback/default)
const BHAKTI_PILLARS = {
  sravanam: {
    name: "Śravaṇam",
    sanskrit: "श्रवणम्",
    meaning: "Divine Listening",
    description: "Hearing the glories of the Lord",
    progressType: "Clarity",
    icon: GiScrollUnfurled,
    color: "from-cyan-400 to-blue-500",
    bgGlow: "rgba(34, 211, 238, 0.3)",
    element: IoWater,
    actions: ["asking", "reading", "listening"],
    milestones: [
      { level: 1, name: "Curious Soul", threshold: 0 },
      { level: 2, name: "Eager Listener", threshold: 50 },
      { level: 3, name: "Wisdom Seeker", threshold: 150 },
      { level: 4, name: "Knowledge Vessel", threshold: 300 },
      { level: 5, name: "Divine Receiver", threshold: 500 },
    ],
  },
  kirtanam: {
    name: "Kīrtanam",
    sanskrit: "कीर्तनम्",
    meaning: "Sacred Chanting",
    description: "Glorifying through sound vibration",
    progressType: "Vibration",
    icon: GiSoundWaves,
    color: "from-orange-400 to-red-500",
    bgGlow: "rgba(251, 146, 60, 0.3)",
    element: IoFlame,
    actions: ["chanting", "singing", "reciting"],
    milestones: [
      { level: 1, name: "First Sound", threshold: 0 },
      { level: 2, name: "Mantra Whisperer", threshold: 108 },
      { level: 3, name: "Japa Practitioner", threshold: 540 },
      { level: 4, name: "Kirtan Singer", threshold: 1080 },
      { level: 5, name: "Sound Vibration Master", threshold: 2160 },
    ],
  },
  smaranam: {
    name: "Smaraṇam",
    sanskrit: "स्मरणम्",
    meaning: "Divine Remembrance",
    description: "Constant remembrance of Krishna",
    progressType: "Presence",
    icon: GiThirdEye,
    color: "from-purple-400 to-violet-500",
    bgGlow: "rgba(167, 139, 250, 0.3)",
    element: IoSparkles,
    actions: ["remembering", "returning", "practicing"],
    milestones: [
      { level: 1, name: "Awakening", threshold: 0 },
      { level: 2, name: "Mindful Return", threshold: 7 },
      { level: 3, name: "Steady Remembrance", threshold: 21 },
      { level: 4, name: "Ever-Present Mind", threshold: 40 },
      { level: 5, name: "Constant Companion", threshold: 60 },
    ],
  },
  archanam: {
    name: "Arcanam",
    sanskrit: "अर्चनम्",
    meaning: "Sacred Worship",
    description: "Meditation and Roop Dhyana",
    progressType: "Stillness",
    icon: GiMeditation,
    color: "from-amber-400 to-yellow-500",
    bgGlow: "rgba(251, 191, 36, 0.3)",
    element: IoLeaf,
    actions: ["meditation", "visualization", "worship"],
    milestones: [
      { level: 1, name: "Silent Seeker", threshold: 0 },
      { level: 2, name: "Inner Observer", threshold: 30 },
      { level: 3, name: "Stillness Holder", threshold: 120 },
      { level: 4, name: "Vision Keeper", threshold: 300 },
      { level: 5, name: "Roop Dhyana Adept", threshold: 600 },
    ],
  },
};

// Devotee progression stages
const DEVOTEE_STAGES = [
  {
    name: "Seeker",
    sanskrit: "जिज्ञासु",
    threshold: 0,
    description: "Beginning the journey",
    unlocks: ["Basic wisdom", "Simple practices"],
  },
  {
    name: "Sadhaka",
    sanskrit: "साधक",
    threshold: 100,
    description: "Walking the path",
    unlocks: ["Deeper teachings", "Extended meditation"],
  },
  {
    name: "Devotee",
    sanskrit: "भक्त",
    threshold: 300,
    description: "Heart awakened",
    unlocks: ["Personal guidance", "Sacred mantras"],
  },
  {
    name: "Premi",
    sanskrit: "प्रेमी",
    threshold: 600,
    description: "Love blossoming",
    unlocks: ["Divine visions", "Intimate conversations"],
  },
  {
    name: "Rasika",
    sanskrit: "रसिक",
    threshold: 1000,
    description: "Tasting divine nectar",
    unlocks: ["Rasa teachings", "Lila meditations"],
  },
];

// Single Pillar Card Component
const PillarCard = ({
  pillarKey,
  pillar,
  progress,
  isMobile,
  onPillarClick,
}) => {
  const Icon = pillar.icon;
  const ElementIcon = pillar.element;

  const currentMilestone = useMemo(() => {
    const milestones = pillar.milestones;
    let current = milestones[0];
    for (const m of milestones) {
      if (progress >= m.threshold) current = m;
    }
    return current;
  }, [pillar.milestones, progress]);

  const nextMilestone = useMemo(() => {
    const milestones = pillar.milestones;
    for (const m of milestones) {
      if (progress < m.threshold) return m;
    }
    return null;
  }, [pillar.milestones, progress]);

  const progressToNext = useMemo(() => {
    if (!nextMilestone) return 100;
    const prevThreshold = currentMilestone.threshold;
    const range = nextMilestone.threshold - prevThreshold;
    const current = progress - prevThreshold;
    return Math.min(100, (current / range) * 100);
  }, [progress, currentMilestone, nextMilestone]);

  return (
    <div
      onClick={() => onPillarClick?.(pillarKey)}
      className="relative bg-gradient-to-br from-white/15 to-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl border border-white/20 md:hover:border-amber-400/50 transition-all cursor-pointer group overflow-hidden min-h-[44px]"
      style={{
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        cursor: "pointer",
      }}
    >
      {/* Background glow effect */}
      <div
        className="absolute inset-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
        style={{
          background: `radial-gradient(circle at center, ${pillar.bgGlow}, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon and Element */}
        <div className="flex items-center justify-between mb-3">
          <div
            className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${pillar.color} flex items-center justify-center shadow-lg`}
          >
            <Icon className="text-2xl md:text-3xl text-white" />
          </div>
          <ElementIcon className="text-xl text-white/40 md:group-hover:text-white/70 transition-colors" />
        </div>

        {/* Name and Sanskrit */}
        <h3 className="font-bold text-amber-200 text-sm md:text-base mb-0.5">
          {pillar.name}
        </h3>
        <p className="text-xs text-amber-100/60 font-sanskrit mb-2">
          {pillar.sanskrit}
        </p>

        {/* Progress Type */}
        <div className="flex items-center gap-1 mb-3">
          <GiLotusFlower className="text-xs text-amber-300" />
          <span className="text-xs text-cyan-300">{pillar.progressType}</span>
        </div>

        {/* Current Level */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-purple-200 font-medium">
              {currentMilestone.name}
            </span>
            <span className="text-amber-300">Lv.{currentMilestone.level}</span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${pillar.color} transition-[width] duration-1000 ease-out`}
              style={{ width: `${progressToNext}%` }}
            />
          </div>

          {nextMilestone && (
            <p className="text-xs text-blue-100/50 mt-1">
              {progress}/{nextMilestone.threshold} → {nextMilestone.name}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-blue-100/60 hidden md:block">
          {pillar.meaning}
        </p>
      </div>
    </div>
  );
};

// Pillar Detail Modal
const PillarDetailModal = ({
  pillarKey,
  pillar,
  progress,
  onClose,
  isMobile,
}) => {
  if (!pillar) return null;

  const Icon = pillar.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-4"
      style={{ touchAction: "none" }}
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-white/20 max-h-[85vh] overflow-y-auto"
        style={{ touchAction: "pan-y" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${pillar.color} flex items-center justify-center shadow-lg`}
          >
            <Icon className="text-3xl text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-amber-200">{pillar.name}</h2>
            <p className="text-amber-100/60 font-sanskrit">{pillar.sanskrit}</p>
            <p className="text-sm text-cyan-300">{pillar.meaning}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-blue-100/80 mb-6">{pillar.description}</p>

        {/* Milestones */}
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-semibold text-amber-200">
            Journey Milestones
          </h3>
          {pillar.milestones.map((milestone, idx) => {
            const isUnlocked = progress >= milestone.threshold;
            const isCurrent =
              progress >= milestone.threshold &&
              (idx === pillar.milestones.length - 1 ||
                progress < pillar.milestones[idx + 1].threshold);

            return (
              <div
                key={milestone.level}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isCurrent
                    ? "bg-amber-400/20 border border-amber-400/50"
                    : isUnlocked
                      ? "bg-white/5"
                      : "bg-black/20 opacity-50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isUnlocked
                      ? `bg-gradient-to-br ${pillar.color} text-white`
                      : "bg-gray-600 text-gray-400"
                  }`}
                >
                  {milestone.level}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium ${isUnlocked ? "text-amber-200" : "text-gray-400"}`}
                  >
                    {milestone.name}
                  </p>
                  <p className="text-xs text-blue-100/50">
                    {milestone.threshold} {pillar.progressType.toLowerCase()}{" "}
                    points
                  </p>
                </div>
                {isCurrent && (
                  <span className="text-xs bg-amber-400 text-black px-2 py-0.5 rounded-full font-semibold">
                    Current
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-lg md:hover:from-amber-500 md:hover:to-orange-600 transition-all min-h-[44px]"
          style={{
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          Continue Journey
        </button>
      </div>
    </div>
  );
};

// Connected Main Component - Uses real backend data
const BhaktiPillarsConnected = ({
  isMobile = false,
  showDetailedView = false,
}) => {
  const {
    bhaktiPillars,
    totalProgress,
    currentStage,
    nextStage,
    isLoading,
    getStageProgressPercent,
    addActivity,
  } = useBhaktiProgress();

  const [selectedPillar, setSelectedPillar] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-3xl text-amber-400" />
      </div>
    );
  }

  // Merge backend data with UI config
  const getPillarWithUI = (key) => {
    const backendPillar = bhaktiPillars[key] || {};
    const uiConfig = PILLAR_COLORS[key] || {};
    const icons = PILLAR_ICONS[key] || {};
    const fallback = BHAKTI_PILLARS[key] || {};

    return {
      ...fallback,
      ...backendPillar,
      ...uiConfig,
      icon: icons.icon || fallback.icon,
      element: icons.element || fallback.element,
    };
  };

  const progressToNextStage = getStageProgressPercent();
  const stage = currentStage || DEVOTEE_STAGES[0];

  return (
    <div className="space-y-6">
      {/* Current Stage Display */}
      <div className="bg-gradient-to-br from-amber-400/15 to-orange-500/15 rounded-xl p-4 md:p-6 border border-amber-400/30">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-amber-200">
              {stage.name}
            </h2>
            <p className="text-amber-100/60 font-sanskrit text-sm">
              {stage.sanskrit}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl md:text-3xl font-bold text-white">
              {totalProgress}
            </p>
            <p className="text-xs text-cyan-300">Total Bhakti</p>
          </div>
        </div>

        <p className="text-sm text-blue-100/70 mb-4">{stage.description}</p>

        {/* Progress to next stage */}
        {nextStage && (
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-blue-100/60">
                Progress to {nextStage.name}
              </span>
              <span className="text-amber-300">
                {totalProgress}/{nextStage.threshold}
              </span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-[width] duration-1000 ease-out"
                style={{ width: `${progressToNextStage}%` }}
              />
            </div>
          </div>
        )}

        {/* Unlocks */}
        {stage.unlocks && (
          <div className="mt-4 flex flex-wrap gap-2">
            {stage.unlocks.map((unlock, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-white/10 rounded-full text-cyan-300 border border-cyan-400/30"
              >
                ✓ {unlock}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Four Pillars Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {Object.keys(BHAKTI_PILLARS).map((key) => {
          const pillar = getPillarWithUI(key);
          return (
            <PillarCard
              key={key}
              pillarKey={key}
              pillar={pillar}
              progress={pillar.progress || 0}
              isMobile={isMobile}
              onPillarClick={setSelectedPillar}
            />
          );
        })}
      </div>

      {/* Pillar Detail Modal */}
      {selectedPillar && (
        <PillarDetailModal
          pillarKey={selectedPillar}
          pillar={getPillarWithUI(selectedPillar)}
          progress={bhaktiPillars[selectedPillar]?.progress || 0}
          onClose={() => setSelectedPillar(null)}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

// Standalone version (for use without context - legacy support)
const BhaktiPillars = ({
  progress = {},
  onPillarUpdate,
  isMobile = false,
  showDetailedView = false,
}) => {
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [totalProgress, setTotalProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(DEVOTEE_STAGES[0]);

  // Calculate total progress and current stage
  useEffect(() => {
    const total = Object.values(progress).reduce(
      (sum, val) => sum + (val || 0),
      0,
    );
    setTotalProgress(total);

    // Find current stage
    let stage = DEVOTEE_STAGES[0];
    for (const s of DEVOTEE_STAGES) {
      if (total >= s.threshold) stage = s;
    }
    setCurrentStage(stage);
  }, [progress]);

  // Get next stage
  const nextStage = useMemo(() => {
    const idx = DEVOTEE_STAGES.findIndex((s) => s.name === currentStage.name);
    return DEVOTEE_STAGES[idx + 1] || null;
  }, [currentStage]);

  const progressToNextStage = useMemo(() => {
    if (!nextStage) return 100;
    const range = nextStage.threshold - currentStage.threshold;
    const current = totalProgress - currentStage.threshold;
    return Math.min(100, (current / range) * 100);
  }, [totalProgress, currentStage, nextStage]);

  return (
    <div className="space-y-6">
      {/* Current Stage Display */}
      <div className="bg-gradient-to-br from-amber-400/15 to-orange-500/15 rounded-xl p-4 md:p-6 border border-amber-400/30">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-amber-200">
              {currentStage.name}
            </h2>
            <p className="text-amber-100/60 font-sanskrit text-sm">
              {currentStage.sanskrit}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl md:text-3xl font-bold text-white">
              {totalProgress}
            </p>
            <p className="text-xs text-cyan-300">Total Bhakti</p>
          </div>
        </div>

        <p className="text-sm text-blue-100/70 mb-4">
          {currentStage.description}
        </p>

        {/* Progress to next stage */}
        {nextStage && (
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-blue-100/60">
                Progress to {nextStage.name}
              </span>
              <span className="text-amber-300">
                {totalProgress}/{nextStage.threshold}
              </span>
            </div>
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-[width] duration-1000 ease-out"
                style={{ width: `${progressToNextStage}%` }}
              />
            </div>
          </div>
        )}

        {/* Unlocks */}
        <div className="mt-4 flex flex-wrap gap-2">
          {currentStage.unlocks.map((unlock, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 bg-white/10 rounded-full text-cyan-300 border border-cyan-400/30"
            >
              ✓ {unlock}
            </span>
          ))}
        </div>
      </div>

      {/* Four Pillars Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {Object.entries(BHAKTI_PILLARS).map(([key, pillar]) => (
          <PillarCard
            key={key}
            pillarKey={key}
            pillar={pillar}
            progress={progress[key] || 0}
            isMobile={isMobile}
            onPillarClick={setSelectedPillar}
          />
        ))}
      </div>

      {/* Pillar Detail Modal */}
      {selectedPillar && (
        <PillarDetailModal
          pillarKey={selectedPillar}
          pillar={BHAKTI_PILLARS[selectedPillar]}
          progress={progress[selectedPillar] || 0}
          onClose={() => setSelectedPillar(null)}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

export {
  BhaktiPillars,
  BhaktiPillarsConnected,
  BHAKTI_PILLARS,
  DEVOTEE_STAGES,
  PILLAR_ICONS,
  PILLAR_COLORS,
};
export default BhaktiPillars;
