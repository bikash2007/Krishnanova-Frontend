import React from "react";
import { motion } from "framer-motion";
import { MdHistory } from "react-icons/md";

/**
 * HistoryTab - Display and load previous chat sessions with Krishna
 */
const HistoryTab = ({
  chatHistory,
  onLoadSession,
  showToast,
  setActiveTab,
  Icons,
  isMobile,
}) => {
  return (
    <motion.div
      key="history"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-xl md:rounded-2xl shadow-2xl border border-white/20 p-4 md:p-8"
    >
      <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-4 md:mb-6">
        Chat History with Krishna
      </h2>

      {chatHistory.length === 0 ? (
        <div className="text-center py-8 md:py-12">
          <div className="text-3xl md:text-4xl mb-3 md:mb-4">
            {Icons.history}
          </div>
          <p className="text-blue-100/60 text-sm md:text-base">
            No conversations saved yet
          </p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4 max-h-[60vh] overflow-y-auto">
          {chatHistory.map((session, index) => (
            <motion.div
              key={session.sessionId || index}
              className="p-3 md:p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-lg md:rounded-xl border border-white/20 hover:border-amber-400/50 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                onLoadSession(session);
                setActiveTab("chat");
                showToast("Conversation loaded from history");
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-amber-200 line-clamp-1 text-sm md:text-base">
                  {session.title || "Conversation"}
                </h3>
                <span className="text-xs text-cyan-300 whitespace-nowrap ml-2">
                  {new Date(session.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs md:text-sm text-blue-100/60 line-clamp-2">
                {session.messages[0]?.content || "No preview available"}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs bg-gradient-to-r from-amber-400/20 to-orange-500/20 px-2 py-1 rounded-full text-amber-200 border border-amber-400/30">
                  {session.messages.length} messages
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default HistoryTab;
