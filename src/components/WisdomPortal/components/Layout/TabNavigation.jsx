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
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 mb-3 md:mb-5">
      <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-lg sm:rounded-xl md:rounded-2xl p-1 sm:p-1.5 md:p-2 border border-white/20">
        <div className="grid grid-cols-5 gap-0.5 sm:gap-1 md:gap-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-1.5 sm:py-2 md:py-3 px-1.5 sm:px-2 md:px-4 rounded-md sm:rounded-lg md:rounded-xl font-semibold transition-all flex items-center justify-center gap-0.5 sm:gap-1 md:gap-2 text-[10px] sm:text-xs md:text-base min-h-[44px] ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg"
                  : "text-blue-100/60 hover:text-amber-200 hover:bg-white/5"
              }`}
              style={{
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
                cursor: "pointer",
              }}
              whileHover={!isMobile ? { scale: 1.02 } : {}}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.1 }}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
