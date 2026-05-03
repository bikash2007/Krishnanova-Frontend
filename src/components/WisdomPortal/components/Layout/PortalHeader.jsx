import React from "react";
import { motion } from "framer-motion";
import { IoStar, IoFlame } from "react-icons/io5";
import { FaOm } from "react-icons/fa";
import { GiFeather } from "react-icons/gi";
import kpng from "../../../../Media/k.webp";

/**
 * PortalHeader - Top header section with Krishna avatar, portal title, and user badges
 */
const PortalHeader = ({ krishnaName, yourName, userLevel, isMobile }) => {
  return (
    <header className="pt-16 mt-4 md:pt-20 pb-3 md:pb-6 text-center relative z-10 px-2 sm:px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="inline-block rounded-full border-2 md:border-4 border-amber-400/50 shadow-2xl p-0.5 bg-gradient-to-br from-amber-400/20 to-orange-500/20 backdrop-blur-md"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <img src={kpng} className="w-12 sm:w-16 md:w-20" alt="Krishna" />
        </div>
      </motion.div>

      <div className="mt-2 md:mt-3">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent drop-shadow-lg">
          Divine Wisdom Portal
        </h1>
        <p className="text-cyan-300 mt-1 font-semibold text-xs sm:text-sm md:text-base">
          Connect • Meditate • Transform
        </p>
      </div>

      <div className="mt-2 flex flex-wrap justify-center gap-1.5 sm:gap-2">
        <span className="bg-gradient-to-r from-amber-400/20 to-orange-500/20 backdrop-blur-md text-amber-200 px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs md:text-sm border border-amber-400/30 flex items-center gap-1">
          <GiFeather className="text-xs sm:text-sm" />{" "}
          {krishnaName || "Krishna"}
        </span>
        <span className="bg-gradient-to-r from-purple-400/20 to-blue-500/20 backdrop-blur-md text-purple-200 px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs md:text-sm border border-purple-400/30 flex items-center gap-1">
          <FaOm className="text-xs sm:text-sm" /> {yourName}
        </span>
        <span className="bg-gradient-to-r from-green-400/20 to-emerald-500/20 backdrop-blur-md text-green-200 px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs md:text-sm border border-green-400/30 flex items-center gap-1">
          <IoStar className="text-xs sm:text-sm" /> Level {userLevel}
        </span>
      </div>
    </header>
  );
};

export default PortalHeader;
