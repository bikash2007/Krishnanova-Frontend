import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSanga, EMOTIONAL_RASAS } from "./SangaContext";
import { DevoteeInlineBadge } from "./DevoteeLevelBadge";
import {
  FaHeart,
  FaHandsHelping,
  FaOm,
  FaArrowRight,
  FaUsers,
  FaSpinner,
  FaDove,
  FaPray,
  FaSearch,
} from "react-icons/fa";
import { GiLotusFlower, GiLotus, GiCrystalBall } from "react-icons/gi";
import { IoSparkles } from "react-icons/io5";

// Vibration States
const VIBRATION_STATES = {
  peaceful: {
    emoji: <FaDove />,
    label: "Peaceful",
    color: "from-blue-400 to-cyan-500",
    description: "In a state of inner calm",
  },
  joyful: {
    emoji: <GiLotusFlower />,
    label: "Joyful",
    color: "from-pink-400 to-rose-500",
    description: "Filled with divine joy",
  },
  devoted: {
    emoji: <FaPray />,
    label: "Devoted",
    color: "from-amber-400 to-orange-500",
    description: "Heart full of devotion",
  },
  seeking: {
    emoji: <FaSearch />,
    label: "Seeking",
    color: "from-purple-400 to-indigo-500",
    description: "Searching for truth",
  },
  grateful: {
    emoji: <FaHeart />,
    label: "Grateful",
    color: "from-yellow-400 to-amber-500",
    description: "Overflowing with gratitude",
  },
  surrendered: {
    emoji: <GiLotus />,
    label: "Surrendered",
    color: "from-teal-400 to-cyan-500",
    description: "Fully surrendered to divine will",
  },
  healing: {
    emoji: <FaHeart />,
    label: "Healing",
    color: "from-green-400 to-emerald-500",
    description: "In the process of healing",
  },
  inspired: {
    emoji: <IoSparkles />,
    label: "Inspired",
    color: "from-yellow-300 to-orange-400",
    description: "Touched by divine inspiration",
  },
};

// Vibration Selector
export const VibrationSelector = ({
  currentVibration,
  onSelect,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const vibrations = Object.entries(VIBRATION_STATES);
  const current =
    VIBRATION_STATES[currentVibration] || VIBRATION_STATES.peaceful;

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r ${current.color}/20 border border-white/20 hover:border-amber-400/30 transition-all`}
        >
          <span className="text-lg">{current.emoji}</span>
          <span className="text-sm text-amber-200">{current.label}</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 mt-2 p-2 backdrop-blur-md bg-indigo-900/95 rounded-xl border border-white/20 shadow-2xl z-50 min-w-[200px]"
            >
              <div className="grid grid-cols-2 gap-1">
                {vibrations.map(([key, vib]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onSelect(key);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                      currentVibration === key
                        ? `bg-gradient-to-r ${vib.color}/30`
                        : "hover:bg-white/10"
                    }`}
                  >
                    <span>{vib.emoji}</span>
                    <span className="text-xs text-blue-100">{vib.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 p-4">
      <h3 className="text-sm font-semibold text-amber-300 mb-3 flex items-center gap-2">
        <FaOm />
        Your Current Vibration
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {vibrations.map(([key, vib]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(key)}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
              currentVibration === key
                ? `bg-gradient-to-br ${vib.color} shadow-lg`
                : "bg-white/5 hover:bg-white/10 border border-white/10"
            }`}
          >
            <span className="text-2xl">{vib.emoji}</span>
            <span
              className={`text-xs ${currentVibration === key ? "text-white" : "text-blue-100/70"}`}
            >
              {vib.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Similar Soul Card
const SimilarSoulCard = ({ devotee, onConnect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
      onClick={() => onConnect?.(devotee)}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl font-bold text-indigo-900">
          {devotee.name?.charAt(0) || "D"}
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-indigo-900 animate-pulse" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-amber-300 truncate">
            {devotee.name}
          </h4>
          <DevoteeInlineBadge level={devotee.level} />
        </div>
        <div className="flex items-center gap-2 text-xs text-blue-100/60">
          <span>{VIBRATION_STATES[devotee.vibration]?.emoji}</span>
          <span>{VIBRATION_STATES[devotee.vibration]?.label}</span>
        </div>
      </div>

      <button className="p-2 bg-amber-400/20 rounded-full hover:bg-amber-400/30 transition-colors">
        <FaHandsHelping className="text-amber-400" size={14} />
      </button>
    </motion.div>
  );
};

// Main Vibration Matcher Component
const VibrationMatcher = ({ onConnect }) => {
  const {
    devoteeData,
    setVibration,
    getSimilarDevotees,
    setSelectedRasa,
    getSelectedRasa,
    EMOTIONAL_RASAS,
    similarSouls,
  } = useSanga();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const currentRasa = getSelectedRasa();
  const [showRasaPicker, setShowRasaPicker] = useState(false);

  const handleVibrationChange = async (newVibration) => {
    await setVibration(newVibration);
    findSimilarSouls();
  };

  const findSimilarSouls = async () => {
    setIsSearching(true);

    try {
      // Now uses real backend API
      const results = await getSimilarDevotees();
      setSearchResults(results);
    } catch (error) {
      console.error("Failed to find similar souls:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRasaSelect = async (rasaId) => {
    // Single-select: toggle off if same, otherwise set new
    const newRasa = currentRasa === rasaId ? null : rasaId;
    await setSelectedRasa(newRasa);
  };

  return (
    <div className="space-y-4">
      {/* Current Vibration */}
      <VibrationSelector
        currentVibration={devoteeData.vibration}
        onSelect={handleVibrationChange}
      />

      {/* Single Bhakti Rasa */}
      <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
            <FaHeart />
            Your Bhakti Rasa
          </h3>
          <button
            onClick={() => setShowRasaPicker(!showRasaPicker)}
            className="text-xs text-amber-400 hover:text-amber-300"
          >
            {showRasaPicker ? "Done" : "Choose"}
          </button>
        </div>

        {currentRasa ? (
          <div className="flex flex-wrap gap-2">
            {(() => {
              const rasa = Object.values(EMOTIONAL_RASAS).find(
                (r) => r.id === currentRasa,
              );
              if (!rasa) return null;
              return (
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${rasa.color} text-white text-sm font-medium shadow-lg`}
                >
                  <span className="text-lg">{rasa.emoji}</span>
                  <div>
                    <span className="font-semibold">{rasa.name}</span>
                    <span className="ml-2 opacity-80">· {rasa.meaning}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <p className="text-sm text-blue-100/60">
            Choose the one rasa that defines your relationship with the Divine
          </p>
        )}

        {/* Rasa Picker — Single Select */}
        <AnimatePresence>
          {showRasaPicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-white/10"
            >
              <p className="text-xs text-blue-100/50 mb-3">
                Select one rasa — this will be displayed on your profile
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.values(EMOTIONAL_RASAS).map((rasa) => (
                  <button
                    key={rasa.id}
                    onClick={() => handleRasaSelect(rasa.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      currentRasa === rasa.id
                        ? `bg-gradient-to-r ${rasa.color}/30 border-2 border-white/40 shadow-lg`
                        : "bg-white/5 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    <span className="text-xl">{rasa.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm text-blue-100 font-semibold">
                        {rasa.name}
                        {rasa.sanskrit && (
                          <span className="ml-1.5 text-xs opacity-60 font-normal">
                            {rasa.sanskrit}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-blue-100/50 truncate">
                        {rasa.meaning}
                      </p>
                    </div>
                    {currentRasa === rasa.id && (
                      <FaHeart className="ml-auto text-amber-400 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Similar Souls */}
      <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
            <FaUsers />
            Souls on Your Wavelength
          </h3>
          <button
            onClick={() => findSimilarSouls(devoteeData.vibration)}
            disabled={isSearching}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            {isSearching ? (
              <>
                <FaSpinner className="animate-spin" />
                Searching...
              </>
            ) : (
              <>
                Refresh
                <FaArrowRight size={10} />
              </>
            )}
          </button>
        </div>

        {isSearching ? (
          <div className="flex flex-col items-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-amber-400/30 border-t-amber-400 rounded-full"
            />
            <p className="text-sm text-blue-100/60 mt-4">
              Finding similar vibrations...
            </p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-2">
            {searchResults.map((devotee, index) => (
              <SimilarSoulCard
                key={index}
                devotee={devotee}
                onConnect={onConnect}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <GiCrystalBall className="text-4xl mb-2 mx-auto text-purple-300/50" />
            <p className="text-sm text-blue-100/60">
              Set your vibration to find similar souls
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VibrationMatcher;
