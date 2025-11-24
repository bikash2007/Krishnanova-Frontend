import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCheckmark } from "react-icons/io5";

/**
 * NotificationToast - Toast notification for success messages
 */
const NotificationToast = ({ isVisible, message }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 md:top-24 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-full shadow-lg text-sm md:text-base font-semibold flex items-center gap-2">
            <IoCheckmark /> {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;
