import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSanga } from "./SangaContext";
import {
  FaUsers,
  FaMapMarkerAlt,
  FaTimes,
  FaOm,
  FaHeart,
} from "react-icons/fa";

// Simple SVG World Map with hotspot markers
const WorldMapSVG = ({ hotspots, selectedHotspot, onSelectHotspot }) => {
  // Convert lat/lng to SVG coordinates (simplified projection)
  const toSVGCoords = (lat, lng) => {
    const x = ((lng + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return { x, y };
  };

  return (
    <svg viewBox="0 0 800 400" className="w-full h-full">
      {/* Simple world outline */}
      <defs>
        <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Map background */}
      <rect
        x="0"
        y="0"
        width="800"
        height="400"
        fill="url(#mapGradient)"
        rx="16"
      />

      {/* Grid lines */}
      {[...Array(9)].map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 50}
          x2="800"
          y2={i * 50}
          stroke="rgba(251, 191, 36, 0.1)"
          strokeWidth="0.5"
        />
      ))}
      {[...Array(17)].map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 50}
          y1="0"
          x2={i * 50}
          y2="400"
          stroke="rgba(251, 191, 36, 0.1)"
          strokeWidth="0.5"
        />
      ))}

      {/* Simplified continent outlines */}
      <path
        d="M 60,100 Q 80,90 120,100 L 140,120 Q 160,140 140,160 L 100,170 Q 60,160 60,130 Z"
        fill="rgba(251, 191, 36, 0.15)"
        stroke="rgba(251, 191, 36, 0.3)"
        strokeWidth="1"
      />
      {/* Europe/Asia */}
      <path
        d="M 280,60 Q 350,50 450,60 L 550,80 Q 620,100 650,140 L 680,180 Q 700,220 680,260 L 600,280 Q 500,290 400,270 L 300,240 Q 260,200 280,140 Z"
        fill="rgba(251, 191, 36, 0.15)"
        stroke="rgba(251, 191, 36, 0.3)"
        strokeWidth="1"
      />
      {/* India highlight */}
      <path
        d="M 530,160 Q 560,150 580,170 L 590,210 Q 580,250 550,260 L 520,250 Q 510,220 520,190 Z"
        fill="rgba(251, 191, 36, 0.3)"
        stroke="rgba(251, 191, 36, 0.5)"
        strokeWidth="1"
      />
      {/* Americas */}
      <path
        d="M 100,80 Q 140,60 180,80 L 200,140 Q 220,200 180,280 L 140,320 Q 100,340 80,300 L 70,220 Q 60,160 100,80 Z"
        fill="rgba(251, 191, 36, 0.15)"
        stroke="rgba(251, 191, 36, 0.3)"
        strokeWidth="1"
      />

      {/* Hotspot markers */}
      {hotspots.map((hotspot) => {
        const coords = toSVGCoords(
          hotspot.coordinates.lat,
          hotspot.coordinates.lng,
        );
        const isSelected = selectedHotspot?.id === hotspot.id;
        const hasActivity = hotspot.activeDevotees > 0;

        return (
          <g key={hotspot.id}>
            {/* Pulse effect for active hotspots */}
            {hasActivity && (
              <motion.circle
                cx={coords.x}
                cy={coords.y}
                r="15"
                fill="none"
                stroke={hotspot.color}
                strokeWidth="2"
                opacity="0.5"
                animate={{ r: [15, 25, 15], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* Main marker */}
            <motion.g
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.3 }}
              onClick={() => onSelectHotspot(hotspot)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={coords.x}
                cy={coords.y}
                r={isSelected ? "12" : "8"}
                fill={hotspot.color}
                filter="url(#glow)"
                opacity={isSelected ? 1 : 0.8}
              />

              {/* Active devotee count */}
              {hasActivity && (
                <g transform={`translate(${coords.x + 12}, ${coords.y - 12})`}>
                  <circle
                    cx="0"
                    cy="0"
                    r="10"
                    fill="#1e1b4b"
                    stroke={hotspot.color}
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    {hotspot.activeDevotees}
                  </text>
                </g>
              )}
            </motion.g>
          </g>
        );
      })}
    </svg>
  );
};

// Hotspot Detail Panel
const HotspotDetailPanel = ({ hotspot, onClose, onJoin }) => {
  if (!hotspot) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 backdrop-blur-md bg-gradient-to-br from-white/15 to-white/5 rounded-2xl border border-white/20 overflow-hidden shadow-2xl"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${hotspot.color}30` }}
            >
              {hotspot.icon}
            </div>
            <div>
              <h3 className="font-bold text-amber-300">{hotspot.name}</h3>
              {hotspot.sanskrit && (
                <span className="text-xs text-amber-100/60">
                  {hotspot.sanskrit}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <FaTimes className="text-blue-100/60" />
          </button>
        </div>

        {/* Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-blue-100/80">
            <FaMapMarkerAlt className="text-amber-400" size={12} />
            <span>{hotspot.country}</span>
          </div>
          <p className="text-sm text-blue-100/70">{hotspot.significance}</p>
          <div className="flex items-center gap-2 text-sm">
            <FaUsers className="text-green-400" size={12} />
            <span className="text-green-300">
              {hotspot.activeDevotees} devotees active now
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onJoin(hotspot.id)}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
          >
            <FaOm size={14} />
            Join Sanga
          </button>
          <button className="py-2 px-4 bg-white/10 text-amber-300 rounded-xl font-semibold text-sm hover:bg-white/20 transition-all">
            <FaHeart size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Spiritual Hotspot Map Component
const SpiritualHotspotMap = ({ compact = false }) => {
  const {
    hotspotActivity,
    joinHotspot,
    leaveHotspot,
    devoteeData,
    refreshHotspots,
    isLoading,
  } = useSanga();
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [showLegend, setShowLegend] = useState(false);

  // Real-time activity updates via API polling
  useEffect(() => {
    // Refresh hotspots every 30 seconds for real-time counts
    const interval = setInterval(() => {
      refreshHotspots();
    }, 30000);

    // Initial fetch
    refreshHotspots();

    return () => clearInterval(interval);
  }, [refreshHotspots]);

  const handleJoinHotspot = async (hotspotId) => {
    await joinHotspot(hotspotId);
    setSelectedHotspot(null);
    // Refresh to get updated counts
    refreshHotspots();
  };

  // Sort hotspots by activity
  const sortedHotspots = useMemo(
    () =>
      [...hotspotActivity].sort((a, b) => b.activeDevotees - a.activeDevotees),
    [hotspotActivity],
  );

  if (compact) {
    return (
      <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 p-4">
        <h3 className="text-sm font-semibold text-amber-300 mb-3 flex items-center gap-2">
          <FaMapMarkerAlt />
          Spiritual Hotspots
        </h3>
        <div className="space-y-2">
          {sortedHotspots.slice(0, 4).map((hotspot) => (
            <div
              key={hotspot.id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => setSelectedHotspot(hotspot)}
            >
              <span className="text-lg">{hotspot.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-blue-100 truncate">{hotspot.name}</p>
              </div>
              {hotspot.activeDevotees > 0 && (
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  {hotspot.activeDevotees}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-amber-300 flex items-center gap-2">
              <FaMapMarkerAlt />
              Sacred Hotspots
            </h2>
            <p className="text-sm text-blue-100/60 mt-1">
              Connect with devotees at sacred locations worldwide
            </p>
          </div>
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="text-sm text-amber-300 hover:text-amber-200 transition-colors"
          >
            {showLegend ? "Hide" : "Show"} Legend
          </button>
        </div>

        {/* Legend */}
        <AnimatePresence>
          {showLegend && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 flex flex-wrap gap-3 text-xs"
            >
              {sortedHotspots.map((h) => (
                <div key={h.id} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: h.color }}
                  />
                  <span className="text-blue-100/70">{h.name}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map */}
      <div className="relative aspect-[2/1] min-h-[300px]">
        <WorldMapSVG
          hotspots={hotspotActivity}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={setSelectedHotspot}
        />

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedHotspot && (
            <HotspotDetailPanel
              hotspot={selectedHotspot}
              onClose={() => setSelectedHotspot(null)}
              onJoin={handleJoinHotspot}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Current Location */}
      {devoteeData.currentHotspot && (
        <div className="p-4 border-t border-white/10 bg-amber-400/10">
          <div className="flex items-center gap-2 text-sm">
            <FaOm className="text-amber-400" />
            <span className="text-amber-300">
              You are connected to:{" "}
              {
                hotspotActivity.find((h) => h.id === devoteeData.currentHotspot)
                  ?.name
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpiritualHotspotMap;
