import React from "react";
import { motion } from "framer-motion";
import {
  IoBookmark,
  IoBookmarkOutline,
  IoClose,
  IoEye,
  IoTrash,
} from "react-icons/io5";
import useLockBodyScroll from "../../../../utils/useLockBodyScroll";

/**
 * SavedConversationsModal - Modal for viewing and managing saved conversations
 */
const SavedConversationsModal = ({
  isOpen,
  onClose,
  savedConversations,
  onLoadConversation,
  onDeleteConversation,
}) => {
  useLockBodyScroll(isOpen);
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-hidden overscroll-contain"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="backdrop-blur-md bg-gradient-to-br from-white/20 to-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-3xl max-h-[calc(var(--app-height)*0.8)] overflow-hidden border border-white/30"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-amber-200 flex items-center gap-2">
            <IoBookmark /> Saved Conversations
          </h2>
          <button
            onClick={onClose}
            className="text-blue-100/60 hover:text-amber-200 transition-colors"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(var(--app-height)*0.6)] space-y-3">
          {savedConversations.length === 0 ? (
            <div className="text-center py-12">
              <IoBookmarkOutline className="text-5xl text-blue-100/40 mx-auto mb-4" />
              <p className="text-blue-100/60">No saved conversations yet</p>
              <p className="text-xs text-blue-100/40 mt-2">
                Save important conversations to access them later
              </p>
            </div>
          ) : (
            savedConversations.map((conv) => (
              <motion.div
                key={conv.id}
                className="p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/20 hover:border-amber-400/50 transition-all"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-200 mb-1">
                      {conv.title}
                    </h3>
                    <p className="text-xs text-cyan-300">
                      {new Date(conv.savedAt).toLocaleDateString()} •{" "}
                      {conv.messageCount} messages
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => onLoadConversation(conv)}
                      className="p-2 rounded-lg bg-gradient-to-r from-amber-400/20 to-orange-500/20 text-amber-200 hover:from-amber-400/30 hover:to-orange-500/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title="Load conversation"
                    >
                      <IoEye />
                    </motion.button>
                    <motion.button
                      onClick={() => onDeleteConversation(conv.id)}
                      className="p-2 rounded-lg bg-gradient-to-r from-red-400/20 to-rose-500/20 text-red-300 hover:from-red-400/30 hover:to-rose-500/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title="Delete conversation"
                    >
                      <IoTrash />
                    </motion.button>
                  </div>
                </div>
                {conv.preview && (
                  <p className="text-sm text-blue-100/60 line-clamp-2">
                    {conv.preview}
                  </p>
                )}
                {conv.tags && conv.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {conv.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-400/20 to-blue-500/20 text-purple-200 border border-purple-400/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SavedConversationsModal;
