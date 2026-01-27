import React from "react";
import { motion } from "framer-motion";
import {
  GiPrayerBeads,
  GiLotusFlower,
  GiSunRadiations,
  GiCrystalShrine,
  GiIncense,
  GiPrayer,
} from "react-icons/gi";
import { IoSparkles, IoHeart, IoShield } from "react-icons/io5";
import { FaOm } from "react-icons/fa";

const MantraIntro = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4 md:p-8 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto w-full text-center"
      >
        {/* Main Content */}
        <div className="mb-8 md:mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-6 md:mb-8"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl mx-auto ring-4 ring-white/10">
              <GiPrayerBeads className="text-5xl md:text-6xl text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-amber-200 mb-4 md:mb-6 tracking-tight">
            Sacred Mantra Chanting
          </h1>
          
          <p className="text-blue-100/80 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            Transform your consciousness through the power of the Holy Name.
          </p>
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12 md:mb-16"
        >
          <motion.button
            onClick={onContinue}
            className="group relative px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-bold text-lg md:text-xl shadow-2xl hover:shadow-amber-400/50 transition-all overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
             <span className="relative z-10 flex items-center gap-2">
              Begin Chanting <GiPrayerBeads />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </motion.button>
        </motion.div>

        {/* Minimal Benefits Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-4 md:gap-8 max-w-lg mx-auto"
        >
          {[
            { icon: <IoHeart />, text: "Inner Peace" },
            { icon: <IoShield />, text: "Protection" },
            { icon: <IoSparkles />, text: "Awakening" },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2 text-blue-200/60">
              <div className="text-2xl md:text-3xl opacity-80">{item.icon}</div>
              <span className="text-xs md:text-sm uppercase tracking-wider font-medium">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MantraIntro;
