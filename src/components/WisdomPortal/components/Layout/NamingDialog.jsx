import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSparkles } from "react-icons/io5";
import { GiTempleGate } from "react-icons/gi";
import kpng from "../../../../Media/k.png";

/**
 * NamingDialog - Initial modal for setting Krishna and spiritual names
 */
const NamingDialog = ({
  isOpen,
  krishnaName,
  setKrishnaName,
  yourName,
  setYourName,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="backdrop-blur-md bg-gradient-to-br from-white/20 to-white/10 rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md text-center space-y-4 md:space-y-6 border border-white/30"
        >
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 rounded-full px-4 md:px-5 py-2 md:py-2.5 shadow-lg">
            <img
              src={kpng}
              alt="Krishna"
              className="text-amber-300 animate-pulse text-base md:text-lg h-6"
            />
            <span className="text-amber-100 font-medium tracking-wide text-xs md:text-sm">
              Welcome to Divine Wisdom Portal
            </span>
            <IoSparkles className="text-amber-300 animate-pulse text-base md:text-lg" />
          </div>

          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
            Begin Your Sacred Journey
          </h2>
          <p className="text-blue-100/80 text-sm md:text-base">
            Before we begin, choose sacred names for this divine connection
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-amber-200 text-xs md:text-sm mb-2">
                Your Krishna's Name
              </label>
              <input
                type="text"
                placeholder="e.g., Shyam, Govinda, Madhav"
                className="w-full p-2.5 md:p-3 rounded-xl bg-white/10 backdrop-blur-md border border-amber-400/30 text-white placeholder-blue-100/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none text-sm md:text-base"
                value={krishnaName}
                onChange={(e) => setKrishnaName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-amber-200 text-xs md:text-sm mb-2">
                Your Spiritual Name
              </label>
              <input
                type="text"
                placeholder="Your preferred name"
                className="w-full p-2.5 md:p-3 rounded-xl bg-white/10 backdrop-blur-md border border-amber-400/30 text-white placeholder-blue-100/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none text-sm md:text-base"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
              />
            </div>
          </div>

          <motion.button
            className="w-full group relative px-6 md:px-8 py-3 md:py-4 overflow-hidden rounded-full shadow-2xl"
            onClick={onSave}
            disabled={!krishnaName || !yourName}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
            <span className="relative text-white font-bold text-base md:text-lg flex items-center justify-center gap-2">
              Enter Sacred Portal <GiTempleGate />
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NamingDialog;
