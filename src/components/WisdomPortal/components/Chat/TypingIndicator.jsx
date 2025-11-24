import React from "react";
import { motion } from "framer-motion";

/**
 * TypingIndicator - Shows when Krishna is typing a response
 */
const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-gradient-to-r from-purple-400/20 to-blue-500/20 text-blue-100 p-2.5 md:p-3 rounded-xl md:rounded-2xl border border-purple-400/30">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm md:text-base"
        >
          Krishna is typing...
        </motion.div>
      </div>
    </div>
  );
};

export default TypingIndicator;
