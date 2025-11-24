import React from "react";
import { motion } from "framer-motion";
import { IoFlame, IoTrophy } from "react-icons/io5";
import { GiMeditation, GiPrayerBeads } from "react-icons/gi";

/**
 * StatsOverview - 4-card grid displaying key user statistics
 */
const StatsOverview = ({
  meditationStreak,
  totalMeditationTime,
  totalChants,
  achievementsCount,
  isMobile,
}) => {
  const stats = [
    {
      icon: <IoFlame className="mx-auto text-amber-400" />,
      value: meditationStreak,
      label: "Day Streak",
    },
    {
      icon: <GiMeditation className="mx-auto text-purple-400" />,
      value: `${totalMeditationTime}m`,
      label: "Meditation",
    },
    {
      icon: <GiPrayerBeads className="mx-auto text-rose-400" />,
      value: totalChants,
      label: "Chants",
    },
    {
      icon: <IoTrophy className="mx-auto text-yellow-400" />,
      value: achievementsCount,
      label: "Achievements",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6 px-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 text-center shadow-2xl border border-white/20 hover:border-amber-400/50 transition-all"
        >
          <div className="text-2xl md:text-3xl mb-1 md:mb-2">{stat.icon}</div>
          <div className="text-xl md:text-2xl font-bold text-amber-300">
            {stat.value}
          </div>
          <div className="text-blue-100/70 text-xs md:text-sm">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </section>
  );
};

export default StatsOverview;
