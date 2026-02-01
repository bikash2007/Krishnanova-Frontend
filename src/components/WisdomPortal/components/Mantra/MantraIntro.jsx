import React from "react";
import { motion } from "framer-motion";
import { GiPrayerBeads } from "react-icons/gi";
import { IoSparkles, IoHeart, IoShield } from "react-icons/io5";

const MantraIntro = ({ onContinue }) => {
  return (
    <div className="min-h-[60vh] max-h-[85vh] bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950 flex flex-col py-8 px-6">
      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mb-5"
        >
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl ring-4 ring-amber-400/20">
            <GiPrayerBeads className="text-3xl sm:text-4xl text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl font-bold text-white text-center mb-2"
        >
          Sacred Chanting
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/60 text-sm sm:text-base text-center max-w-xs leading-relaxed mb-6"
        >
          Transform your consciousness through the power of the Holy Name
        </motion.p>

        {/* Benefits - Compact inline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-6 sm:gap-10 py-3 px-4 rounded-xl bg-white/5 border border-white/10"
        >
          {[
            { icon: <IoHeart />, text: "Peace" },
            { icon: <IoShield />, text: "Protection" },
            { icon: <IoSparkles />, text: "Awakening" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-1 text-white/50"
            >
              <div className="text-lg sm:text-xl">{item.icon}</div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-medium">
                {item.text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="pt-6"
      >
        <motion.button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-950 font-bold text-base shadow-2xl active:scale-[0.98] transition-transform flex items-center justify-center gap-3"
          whileTap={{ scale: 0.98 }}
          style={{ boxShadow: "0 10px 40px rgba(251,191,36,0.3)" }}
        >
          <span>Begin Chanting</span>
          <GiPrayerBeads className="text-2xl" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default MantraIntro;
