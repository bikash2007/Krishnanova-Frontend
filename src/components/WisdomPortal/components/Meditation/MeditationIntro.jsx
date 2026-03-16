import React from "react";
import { motion } from "framer-motion";
import { GiLotusFlower, GiInnerSelf } from "react-icons/gi";
import { IoSparkles, IoHeart, IoArrowForward } from "react-icons/io5";

const MeditationIntro = ({ onContinue }) => {
  return (
    <div className="min-h-[calc(var(--app-height)*0.6)] max-h-[calc(var(--app-height)*0.85)] bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex flex-col py-8 px-6 relative">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/20 blur-3xl"
        />
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mb-5"
        >
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/30 ring-4 ring-white/10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <GiLotusFlower className="text-3xl sm:text-4xl text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl font-bold text-amber-200 mb-2 text-center"
        >
          Divine Meditation
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-blue-100/70 text-sm sm:text-base text-center max-w-xs mb-6"
        >
          Quiet your mind and connect with the divine consciousness
        </motion.p>

        {/* Benefits Row - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-6 sm:gap-10 py-3 px-4 rounded-xl bg-white/5 border border-white/10"
        >
          {[
            { icon: <IoHeart />, text: "Peace" },
            { icon: <IoSparkles />, text: "Clarity" },
            { icon: <GiInnerSelf />, text: "Bliss" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-1 text-blue-200/60"
            >
              <div className="text-lg sm:text-xl">{item.icon}</div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider">
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
        className="pt-6 relative z-10"
      >
        <motion.button
          onClick={onContinue}
          className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl font-bold text-base shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Begin Meditation <IoArrowForward className="text-lg" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default MeditationIntro;
