import React from "react";
import { motion } from "framer-motion";
import { IoChatbubbles, IoTrophy } from "react-icons/io5";
import { GiMeditation, GiPrayerBeads } from "react-icons/gi";
import { MdHistory } from "react-icons/md";

/**
 * TabNavigation - Tab switcher for different portal sections
 */
const TabNavigation = ({ activeTab, setActiveTab, isMobile }) => {
  const tabs = [
    {
      id: "chat",
      label: "Chat",
      icon: <IoChatbubbles className="text-base md:text-xl" />,
    },
    {
      id: "meditation",
      label: "Meditate",
      icon: <GiMeditation className="text-base md:text-xl" />,
    },
    {
      id: "chanting",
      label: "Chant",
      icon: <GiPrayerBeads className="text-base md:text-xl" />,
    },
    {
      id: "achievements",
      label: "Progress",
      icon: <IoTrophy className="text-base md:text-xl" />,
    },
    {
      id: "history",
      label: "History",
      icon: <MdHistory className="text-base md:text-xl" />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 mb-4 md:mb-6">
      <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-xl md:rounded-2xl p-1.5 md:p-2 border border-white/20">
        <div className="grid grid-cols-5 gap-1 md:gap-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 md:py-3 px-2 md:px-4 rounded-lg md:rounded-xl font-semibold transition-all flex items-center justify-center gap-1 md:gap-2 text-xs md:text-base ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg"
                  : "text-blue-100/60 hover:text-amber-200 hover:bg-white/5"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.icon}
              <span className={isMobile ? "hidden" : "hidden md:inline"}>
                {tab.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
