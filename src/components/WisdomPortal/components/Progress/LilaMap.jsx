import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  GiTempleGate,
  GiLotusFlower,
  GiFlute,
  GiPeaceDove,
  GiSunRadiations,
  GiMeditation,
  GiPrayerBeads,
  GiCrystalShrine,
  GiChariot,
  GiCrown,
  GiScrollUnfurled,
  GiFeather,
} from "react-icons/gi";
import {
  IoSparkles,
  IoLockClosed,
  IoCheckmarkCircle,
  IoStar,
} from "react-icons/io5";
import {
  FaSpinner,
  FaHome,
  FaWater,
  FaTree,
  FaMountain,
  FaLandmark,
  FaShieldAlt,
} from "react-icons/fa";

// Icon mapping for locations
const LOCATION_ICONS = {
  gokula: GiTempleGate,
  yamuna: GiLotusFlower,
  vrindavan: GiFlute,
  govardhan: GiCrystalShrine,
  mathura: GiTempleGate,
  kurukshetra: GiChariot,
  goloka: GiCrown,
};

// Color mapping for locations
const LOCATION_COLORS = {
  gokula: "from-green-400 to-emerald-500",
  yamuna: "from-blue-400 to-cyan-500",
  vrindavan: "from-purple-400 to-violet-500",
  govardhan: "from-amber-400 to-orange-500",
  mathura: "from-rose-400 to-pink-500",
  kurukshetra: "from-red-400 to-rose-500",
  goloka: "from-yellow-300 to-amber-400",
};

// Position mapping for map visualization
const LOCATION_POSITIONS = {
  gokula: { x: 10, y: 80 },
  yamuna: { x: 25, y: 65 },
  vrindavan: { x: 40, y: 50 },
  govardhan: { x: 55, y: 35 },
  mathura: { x: 70, y: 45 },
  kurukshetra: { x: 85, y: 30 },
  goloka: { x: 95, y: 15 },
};

// Background images for locations
const LOCATION_IMAGES = {
  gokula: <FaHome />,
  yamuna: <FaWater />,
  vrindavan: <FaTree />,
  govardhan: <FaMountain />,
  mathura: <FaLandmark />,
  kurukshetra: <FaShieldAlt />,
  goloka: <IoSparkles />,
};

// Unlocks for each location
const LOCATION_UNLOCKS = {
  gokula: ["Basic wisdom access", "Simple mantras"],
  yamuna: ["Deeper meditations", "Water element practices"],
  vrindavan: ["Rasa teachings", "Advanced chanting"],
  govardhan: ["Protection mantras", "Surrender practices"],
  mathura: ["Dharma teachings", "Sacred stories"],
  kurukshetra: ["Full Gita access", "Warrior wisdom"],
  goloka: ["Eternal wisdom", "Divine presence"],
};

// Lila Map locations representing spiritual journey (default/fallback)
const LILA_LOCATIONS = [
  {
    id: "gokula",
    name: "Gokula",
    sanskrit: "गोकुल",
    description: "The place of Krishna's birth - where your journey begins",
    theme: "birth",
    icon: GiTempleGate,
    position: { x: 10, y: 80 },
    requiredProgress: 0,
    color: "from-green-400 to-emerald-500",
    unlocks: ["Basic wisdom access", "Simple mantras"],
    bgImage: <FaHome />,
  },
  {
    id: "yamuna",
    name: "Yamuna Ghat",
    sanskrit: "यमुना तट",
    description: "The sacred river where Krishna played",
    theme: "purification",
    icon: GiLotusFlower,
    position: { x: 25, y: 65 },
    requiredProgress: 50,
    color: "from-blue-400 to-cyan-500",
    unlocks: ["Deeper meditations", "Water element practices"],
    bgImage: <FaWater />,
  },
  {
    id: "vrindavan",
    name: "Vrindavan",
    sanskrit: "वृन्दावन",
    description: "The forest of divine love and devotion",
    theme: "devotion",
    icon: GiFlute,
    position: { x: 40, y: 50 },
    requiredProgress: 150,
    color: "from-purple-400 to-violet-500",
    unlocks: ["Rasa teachings", "Advanced chanting"],
    bgImage: <FaTree />,
  },
  {
    id: "govardhan",
    name: "Govardhan",
    sanskrit: "गोवर्धन",
    description: "The hill lifted by Krishna's finger",
    theme: "surrender",
    icon: GiCrystalShrine,
    position: { x: 55, y: 35 },
    requiredProgress: 300,
    color: "from-amber-400 to-orange-500",
    unlocks: ["Protection mantras", "Surrender practices"],
    bgImage: <FaMountain />,
  },
  {
    id: "mathura",
    name: "Mathura",
    sanskrit: "मथुरा",
    description: "The city of Krishna's divine play",
    theme: "dharma",
    icon: GiTempleGate,
    position: { x: 70, y: 45 },
    requiredProgress: 500,
    color: "from-rose-400 to-pink-500",
    unlocks: ["Dharma teachings", "Sacred stories"],
    bgImage: <FaLandmark />,
  },
  {
    id: "kurukshetra",
    name: "Kurukshetra",
    sanskrit: "कुरुक्षेत्र",
    description: "The battlefield of transformation - where Gita was spoken",
    theme: "wisdom",
    icon: GiChariot,
    position: { x: 85, y: 30 },
    requiredProgress: 800,
    color: "from-red-400 to-rose-500",
    unlocks: ["Full Gita access", "Warrior wisdom"],
    bgImage: <FaShieldAlt />,
  },
  {
    id: "goloka",
    name: "Goloka Vrindavan",
    sanskrit: "गोलोक वृन्दावन",
    description: "The eternal spiritual abode - your ultimate destination",
    theme: "liberation",
    icon: GiCrown,
    position: { x: 95, y: 15 },
    requiredProgress: 1200,
    color: "from-yellow-300 to-amber-400",
    unlocks: ["Eternal wisdom", "Divine presence"],
    bgImage: <IoSparkles />,
  },
];

// Helper to enrich location with UI config
const enrichLocation = (location) => {
  return {
    ...location,
    icon: LOCATION_ICONS[location.id] || GiTempleGate,
    color: LOCATION_COLORS[location.id] || "from-gray-400 to-gray-500",
    position: LOCATION_POSITIONS[location.id] || { x: 50, y: 50 },
    bgImage: LOCATION_IMAGES[location.id] || <IoSparkles />,
    unlocks: LOCATION_UNLOCKS[location.id] || [],
  };
};

// Path connections between locations
const PATH_CONNECTIONS = [
  { from: "gokula", to: "yamuna" },
  { from: "yamuna", to: "vrindavan" },
  { from: "vrindavan", to: "govardhan" },
  { from: "govardhan", to: "mathura" },
  { from: "mathura", to: "kurukshetra" },
  { from: "kurukshetra", to: "goloka" },
];

// Location Node Component
const LocationNode = ({
  location,
  isUnlocked,
  isCurrent,
  isNext,
  onClick,
  totalProgress,
  isMobile,
}) => {
  const Icon = location.icon;
  const progressPercent = Math.min(
    100,
    (totalProgress / location.requiredProgress) * 100,
  );

  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        left: `${location.position.x}%`,
        top: `${location.position.y}%`,
        transform: "translate(-50%, -50%)",
        minWidth: 44,
        minHeight: 44,
        touchAction: "manipulation",
        cursor: "pointer",
        zIndex: 10,
      }}
      onClick={() => onClick(location)}
    >
      {/* Static glow effect for current location - no infinite animation for iOS */}
      {isCurrent && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: "0 0 30px rgba(251, 191, 36, 0.6)",
            width: "100%",
            height: "100%",
          }}
        />
      )}

      {/* Next location indicator - static border instead of rotating animation */}
      {isNext && !isUnlocked && (
        <div className="absolute -inset-2 rounded-full border-2 border-dashed border-amber-400/50" />
      )}

      {/* Main node */}
      <div
        className={`relative ${isMobile ? "w-12 h-12" : "w-16 h-16"} rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
          isUnlocked
            ? `bg-gradient-to-br ${location.color} border-2 border-white/50`
            : "bg-gray-700/80 border-2 border-gray-500/50"
        }`}
      >
        {isUnlocked ? (
          <Icon
            className={`${isMobile ? "text-xl" : "text-2xl"} text-white drop-shadow-lg`}
          />
        ) : (
          <IoLockClosed
            className={`${isMobile ? "text-lg" : "text-xl"} text-gray-400`}
          />
        )}

        {/* Current indicator - static instead of pulsing for iOS */}
        {isCurrent && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
            <IoStar className="text-xs text-white" />
          </div>
        )}

        {/* Completed checkmark */}
        {isUnlocked && !isCurrent && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <IoCheckmarkCircle className="text-xs text-white" />
          </div>
        )}
      </div>

      {/* Location name */}
      <div
        className={`absolute ${
          location.position.y > 50 ? "-top-10" : "top-full mt-2"
        } left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap`}
      >
        <p
          className={`text-xs font-bold ${
            isUnlocked ? "text-amber-200" : "text-gray-400"
          }`}
        >
          {location.name}
        </p>
        {!isMobile && (
          <p className="text-xs text-blue-100/50">{location.sanskrit}</p>
        )}
      </div>

      {/* Progress indicator for next location */}
      {isNext && !isUnlocked && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-16">
          <div className="h-1 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-[width] duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-center text-amber-300 mt-1">
            {totalProgress}/{location.requiredProgress}
          </p>
        </div>
      )}
    </div>
  );
};

// Path Line Component - plain SVG, no animations
const PathLine = ({ from, to, isUnlocked, isMobile }) => {
  const fromLoc = LILA_LOCATIONS.find((l) => l.id === from);
  const toLoc = LILA_LOCATIONS.find((l) => l.id === to);

  if (!fromLoc || !toLoc) return null;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <line
        x1={`${fromLoc.position.x}%`}
        y1={`${fromLoc.position.y}%`}
        x2={`${toLoc.position.x}%`}
        y2={`${toLoc.position.y}%`}
        stroke={
          isUnlocked ? "rgba(251, 191, 36, 0.6)" : "rgba(107, 114, 128, 0.4)"
        }
        strokeWidth={isMobile ? 2 : 3}
        strokeDasharray={isUnlocked ? "0" : "8,8"}
      />
    </svg>
  );
};

// Location Detail Modal - plain div, no framer-motion, no body scroll lock
const LocationDetailModal = ({
  location,
  isUnlocked,
  onClose,
  totalProgress,
}) => {
  if (!location) return null;

  const Icon = location.icon;
  const progressPercent = Math.min(
    100,
    (totalProgress / location.requiredProgress) * 100,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-4"
      style={{ touchAction: "none" }}
      onClick={onClose}
    >
      <div
        className={`bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-blue-900/95 rounded-2xl p-6 max-w-md w-full shadow-2xl border ${
          isUnlocked ? "border-amber-400/50" : "border-gray-500/50"
        } max-h-[85vh] overflow-y-auto`}
        style={{ touchAction: "pan-y" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
              isUnlocked ? `bg-gradient-to-br ${location.color}` : "bg-gray-700"
            }`}
          >
            {isUnlocked ? (
              <Icon className="text-3xl text-white" />
            ) : (
              <IoLockClosed className="text-2xl text-gray-400" />
            )}
          </div>
          <div>
            <h2
              className={`text-xl font-bold ${isUnlocked ? "text-amber-200" : "text-gray-400"}`}
            >
              {location.name}
            </h2>
            <p className="text-amber-100/60 font-sanskrit">
              {location.sanskrit}
            </p>
          </div>
          <span className="text-4xl ml-auto">{location.bgImage}</span>
        </div>

        {/* Description */}
        <p
          className={`mb-4 ${isUnlocked ? "text-blue-100/80" : "text-gray-400"}`}
        >
          {location.description}
        </p>

        {/* Progress bar if locked */}
        {!isUnlocked && (
          <div className="mb-4 p-4 bg-black/30 rounded-xl">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progress Required</span>
              <span className="text-amber-300">
                {totalProgress}/{location.requiredProgress}
              </span>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-[width] duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {location.requiredProgress - totalProgress} more points to unlock
            </p>
          </div>
        )}

        {/* Unlocks */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-amber-200 mb-2">
            {isUnlocked ? "✓ Unlocked Blessings" : "Blessings Awaiting"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {location.unlocks.map((unlock, idx) => (
              <span
                key={idx}
                className={`text-xs px-3 py-1 rounded-full border ${
                  isUnlocked
                    ? "bg-amber-400/20 text-amber-200 border-amber-400/30"
                    : "bg-gray-700/50 text-gray-400 border-gray-600"
                }`}
              >
                {isUnlocked ? "✓" : "○"} {unlock}
              </span>
            ))}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className={`w-full py-3 font-semibold rounded-lg transition-all ${
            isUnlocked
              ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {isUnlocked ? "Continue Journey" : "Keep Practicing"}
        </button>
      </div>
    </div>
  );
};

// Main Lila Map Component
const LilaMap = ({ totalProgress = 0, onLocationClick, isMobile = false }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Calculate current and unlocked locations
  const { currentLocation, unlockedLocations, nextLocation } = useMemo(() => {
    const unlocked = LILA_LOCATIONS.filter(
      (loc) => totalProgress >= loc.requiredProgress,
    );
    const current = unlocked[unlocked.length - 1] || LILA_LOCATIONS[0];
    const nextIdx = LILA_LOCATIONS.indexOf(current) + 1;
    const next = LILA_LOCATIONS[nextIdx] || null;

    return {
      currentLocation: current,
      unlockedLocations: unlocked,
      nextLocation: next,
    };
  }, [totalProgress]);

  const handleLocationClick = useCallback(
    (location) => {
      setSelectedLocation(location);
      onLocationClick?.(location);
    },
    [onLocationClick],
  );

  const isLocationUnlocked = useCallback(
    (location) => totalProgress >= location.requiredProgress,
    [totalProgress],
  );

  return (
    <div className="relative">
      {/* Map Container */}
      <div
        className={`relative ${isMobile ? "h-64" : "h-96"} bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-blue-900/80 rounded-2xl border border-white/20 overflow-hidden`}
      >
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: "10%", top: "20%" }}
          />
          <div
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: "25%", top: "70%" }}
          />
          <div
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: "45%", top: "15%" }}
          />
          <div
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: "60%", top: "80%" }}
          />
          <div
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: "80%", top: "40%" }}
          />
          <div
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: "90%", top: "60%" }}
          />
        </div>

        {/* Path lines */}
        {PATH_CONNECTIONS.map((path) => (
          <PathLine
            key={`${path.from}-${path.to}`}
            from={path.from}
            to={path.to}
            isUnlocked={isLocationUnlocked(
              LILA_LOCATIONS.find((l) => l.id === path.to),
            )}
            isMobile={isMobile}
          />
        ))}

        {/* Location nodes */}
        {LILA_LOCATIONS.map((location) => (
          <LocationNode
            key={location.id}
            location={location}
            isUnlocked={isLocationUnlocked(location)}
            isCurrent={currentLocation?.id === location.id}
            isNext={nextLocation?.id === location.id}
            onClick={handleLocationClick}
            totalProgress={totalProgress}
            isMobile={isMobile}
          />
        ))}

        {/* Legend */}
        <div className="absolute bottom-2 left-2 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-blue-100/60">Current</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-blue-100/60">Visited</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-blue-100/60">Locked</span>
          </div>
        </div>
      </div>

      {/* Current location info card */}
      <div className="mt-4 p-4 bg-gradient-to-r from-amber-400/15 to-orange-500/15 rounded-xl border border-amber-400/30">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-full bg-gradient-to-br ${currentLocation.color} flex items-center justify-center flex-shrink-0`}
          >
            {React.createElement(currentLocation.icon, {
              className: "text-lg text-white",
            })}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-amber-200 text-sm">
              You are at {currentLocation.name}
            </h3>
            <p className="text-xs text-blue-100/60 truncate">
              {currentLocation.description}
            </p>
          </div>
          {nextLocation && (
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-400">Next stop</p>
              <p className="text-sm text-amber-300">{nextLocation.name}</p>
              <p className="text-xs text-cyan-300">
                {nextLocation.requiredProgress - totalProgress} pts away
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Location Detail Modal */}
      {selectedLocation && (
        <LocationDetailModal
          location={selectedLocation}
          isUnlocked={isLocationUnlocked(selectedLocation)}
          onClose={() => setSelectedLocation(null)}
          totalProgress={totalProgress}
        />
      )}
    </div>
  );
};

// Connected version that uses backend data via context
import { useBhaktiProgress } from "./BhaktiProgressContext";

const LilaMapConnected = ({ onLocationClick, isMobile = false }) => {
  const { lilaMap, totalProgress, isLoading, fetchLilaMap } =
    useBhaktiProgress();
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Refresh lila map data on mount
  useEffect(() => {
    fetchLilaMap();
  }, [fetchLilaMap]);

  // Get locations from backend or use defaults
  const locations = useMemo(() => {
    if (lilaMap?.allLocations) {
      return lilaMap.allLocations.map(enrichLocation);
    }
    return LILA_LOCATIONS;
  }, [lilaMap]);

  const currentLocation = useMemo(() => {
    if (lilaMap?.currentLocation) {
      const loc = locations.find(
        (l) =>
          l.id === lilaMap.currentLocation.id ||
          l.id === lilaMap.currentLocation,
      );
      return loc ? enrichLocation(loc) : enrichLocation(LILA_LOCATIONS[0]);
    }
    return enrichLocation(LILA_LOCATIONS[0]);
  }, [lilaMap, locations]);

  const nextLocation = useMemo(() => {
    const currentIdx = locations.findIndex((l) => l.id === currentLocation.id);
    const next = locations[currentIdx + 1];
    return next ? enrichLocation(next) : null;
  }, [locations, currentLocation]);

  const handleLocationClick = useCallback(
    (location) => {
      setSelectedLocation(location);
      onLocationClick?.(location);
    },
    [onLocationClick],
  );

  const isLocationUnlocked = useCallback(
    (location) => {
      if (lilaMap?.unlockedLocations) {
        return lilaMap.unlockedLocations.includes(location.id);
      }
      return totalProgress >= location.requiredProgress;
    },
    [lilaMap, totalProgress],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-3xl text-amber-400" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Map Container */}
      <div
        className={`relative ${isMobile ? "h-64" : "h-96"} bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-blue-900/80 rounded-2xl border border-white/20 overflow-hidden`}
      >
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: "10%", top: "20%" }}
          />
          <div
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: "25%", top: "70%" }}
          />
          <div
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: "45%", top: "15%" }}
          />
          <div
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: "60%", top: "80%" }}
          />
          <div
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: "80%", top: "40%" }}
          />
          <div
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ left: "90%", top: "60%" }}
          />
        </div>

        {/* Path lines */}
        {PATH_CONNECTIONS.map((path) => (
          <PathLine
            key={`${path.from}-${path.to}`}
            from={path.from}
            to={path.to}
            isUnlocked={isLocationUnlocked(
              locations.find((l) => l.id === path.to) ||
                LILA_LOCATIONS.find((l) => l.id === path.to),
            )}
            isMobile={isMobile}
          />
        ))}

        {/* Location nodes */}
        {locations.map((location) => (
          <LocationNode
            key={location.id}
            location={enrichLocation(location)}
            isUnlocked={isLocationUnlocked(location)}
            isCurrent={currentLocation?.id === location.id}
            isNext={nextLocation?.id === location.id}
            onClick={handleLocationClick}
            totalProgress={totalProgress}
            isMobile={isMobile}
          />
        ))}

        {/* Legend */}
        <div className="absolute bottom-2 left-2 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-blue-100/60">Current</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-blue-100/60">Visited</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-blue-100/60">Locked</span>
          </div>
        </div>
      </div>

      {/* Current location info card */}
      <div className="mt-4 p-4 bg-gradient-to-r from-amber-400/15 to-orange-500/15 rounded-xl border border-amber-400/30">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-full bg-gradient-to-br ${currentLocation.color} flex items-center justify-center flex-shrink-0`}
          >
            {React.createElement(currentLocation.icon, {
              className: "text-lg text-white",
            })}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-amber-200 text-sm">
              You are at {currentLocation.name}
            </h3>
            <p className="text-xs text-blue-100/60 truncate">
              {currentLocation.description}
            </p>
          </div>
          {nextLocation && (
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-400">Next stop</p>
              <p className="text-sm text-amber-300">{nextLocation.name}</p>
              <p className="text-xs text-cyan-300">
                {nextLocation.requiredProgress - totalProgress} pts away
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Location Detail Modal */}
      {selectedLocation && (
        <LocationDetailModal
          location={selectedLocation}
          isUnlocked={isLocationUnlocked(selectedLocation)}
          onClose={() => setSelectedLocation(null)}
          totalProgress={totalProgress}
        />
      )}
    </div>
  );
};

export {
  LilaMap,
  LilaMapConnected,
  LILA_LOCATIONS,
  LOCATION_ICONS,
  LOCATION_COLORS,
  enrichLocation,
};
export default LilaMap;
