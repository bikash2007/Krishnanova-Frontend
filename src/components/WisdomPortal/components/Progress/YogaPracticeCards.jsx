import React from "react";
import { motion } from "framer-motion";
import {
  GiPrayerBeads,
  GiAncientSword,
  GiWhiteBook,
  GiCrown,
} from "react-icons/gi";

/**
 * YogaPracticeCards - Display grid of yoga practice statistics
 */
const YogaPracticeCards = ({ practices, isMobile }) => {
  const yogaTypes = [
    {
      key: "bhaktiYoga",
      name: "Bhakti Yog",
      icon: <GiPrayerBeads className="text-2xl md:text-3xl" />,
      color: "from-pink-400 to-rose-500",
      description: "Path of Devotion",
    },
    {
      key: "karmaYoga",
      name: "Karma Yog",
      icon: <GiAncientSword className="text-2xl md:text-3xl" />,
      color: "from-orange-400 to-red-500",
      description: "Path of Action",
    },
    {
      key: "jnanaYoga",
      name: "Gyana Yog",
      icon: <GiWhiteBook className="text-2xl md:text-3xl" />,
      color: "from-blue-400 to-indigo-500",
      description: "Path of Knowledge",
    },
    {
      key: "rajaYoga",
      name: "Dhyana Yog",
      icon: <GiCrown className="text-2xl md:text-3xl" />,
      color: "from-purple-400 to-violet-500",
      description: "Path of Meditation",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {yogaTypes.map((yoga) => (
        <motion.div
          key={yoga.key}
          className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 text-center shadow-2xl border border-white/20 hover:border-amber-400/50 transition-all"
          whileHover={{ scale: 1.05 }}
        >
          <div
            className={`w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full bg-gradient-to-br ${yoga.color} flex items-center justify-center mb-2 md:mb-3`}
          >
            {yoga.icon}
          </div>
          <h3 className="font-bold text-amber-200 text-xs md:text-sm mb-1">
            {yoga.name}
          </h3>
          <p className="text-xs text-blue-100/60 mb-2 md:mb-3 hidden sm:block">
            {yoga.description}
          </p>
          <div className="text-2xl md:text-3xl font-bold text-white">
            {practices[yoga.key] || 0}
          </div>
          <p className="text-xs text-blue-100/60 mt-1">Practices</p>
        </motion.div>
      ))}
    </div>
  );
};

export default YogaPracticeCards;
