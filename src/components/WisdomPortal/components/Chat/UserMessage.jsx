import React from "react";
import { motion } from "framer-motion";

/**
 * UserMessage - Display component for user's chat messages
 */
const UserMessage = ({ message, isMobile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex justify-end mb-3"
    >
      <div
        className={`${
          isMobile ? "max-w-[85%]" : "max-w-[70%]"
        } p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg`}
      >
        <p className="text-sm md:text-base">{message.text || message.content}</p>
        <p className="text-xs opacity-70 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );
};

export default UserMessage;
