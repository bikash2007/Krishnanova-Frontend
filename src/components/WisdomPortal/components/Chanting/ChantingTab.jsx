import React from "react";
import { motion } from "framer-motion";
import { FaOm } from "react-icons/fa";

/**
 * ChantingTab - Sacred mantra chanting interface with mala counter
 */
const ChantingTab = ({
  selectedMantra,
  setSelectedMantra,
  chantCount,
  incrementChant,
  setChantCount,
  mantras,
  Icons,
  isMobile,
}) => {
  return (
    <motion.div
      key="chanting"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-xl md:rounded-2xl shadow-2xl border border-white/20 p-6 md:p-8"
    >
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-4 md:mb-6">
          Sacred Mantra Chanting
        </h2>

        {/* Mantra Selection */}
        <div className="mb-4 md:mb-6">
          <label className="block text-amber-200 text-xs md:text-sm mb-2">
            Select Mantra
          </label>
          <select
            value={selectedMantra}
            onChange={(e) => setSelectedMantra(e.target.value)}
            className="px-3 md:px-4 py-2 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-md border border-amber-400/30 text-amber-200 focus:border-amber-400 focus:outline-none text-sm md:text-base"
          >
            {mantras.map((mantra) => (
              <option key={mantra.name} value={mantra.name}>
                {mantra.name}
              </option>
            ))}
          </select>
        </div>

        {/* Mala Beads Visual */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-6 md:mb-8">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-amber-400/30"
            style={{
              background: `conic-gradient(from 0deg, rgba(251, 191, 36, ${
                (chantCount % 108) / 108
              }) ${((chantCount % 108) / 108) * 360}deg, transparent 0deg)`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl md:text-6xl mb-3 md:mb-4 chant-bead">
                {Icons.chanting}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-amber-300">
                {chantCount}
              </div>
              <div className="text-xs md:text-sm text-cyan-300 mt-2">
                {Math.floor(chantCount / 108)} malas completed
              </div>
            </div>
          </div>
        </div>

        {/* Sanskrit Display */}
        <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gradient-to-r from-amber-400/10 to-orange-500/10 rounded-lg md:rounded-xl border border-amber-400/30">
          <p className="text-base md:text-xl text-amber-200 font-bold">
            {mantras.find((m) => m.name === selectedMantra)?.sanskrit}
          </p>
        </div>

        {/* Chant Button */}
        <motion.button
          onClick={incrementChant}
          className="chant-button px-8 md:px-12 py-4 md:py-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-lg md:text-xl shadow-2xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Chant {Icons.om}
        </motion.button>

        {/* Reset Button */}
        {chantCount > 0 && (
          <motion.button
            onClick={() => setChantCount(0)}
            className="mt-4 px-4 md:px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-red-400/30 text-red-300 font-semibold block mx-auto text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Reset Count
          </motion.button>
        )}

        {/* Celebration Effect */}
        <div className="celebration fixed inset-0 flex items-center justify-center pointer-events-none opacity-0">
          <div className="text-6xl md:text-8xl">🎉</div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChantingTab;
