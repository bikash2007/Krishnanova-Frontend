import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  MdHistory,
  MdDeleteOutline,
  MdArrowBack,
  MdCalendarToday,
  MdAccessTime,
  MdChat,
} from "react-icons/md";
import {
  IoChatbubbleEllipses,
  IoChevronForward,
  IoArrowForward,
  IoSearch,
  IoClose,
} from "react-icons/io5";
import { GiScrollUnfurled, GiPrayerBeads } from "react-icons/gi";
import kpng from "../../../../Media/k.png";

/**
 * HistoryTab - Beautiful chat history viewer with inline preview.
 * Sessions are previewed WITHIN the history tab (read-only).
 * Users can optionally click "Continue" to resume in the chat tab.
 */
const HistoryTab = ({
  chatHistory,
  onContinueSession,
  onDeleteSession,
  isMobile,
}) => {
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedSession && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [selectedSession]);

  const handleDelete = async (e, sessionId) => {
    e.stopPropagation();
    if (confirmDeleteId !== sessionId) {
      setConfirmDeleteId(sessionId);
      return;
    }
    setDeletingId(sessionId);
    try {
      await onDeleteSession(sessionId);
      if (selectedSession?.sessionId === sessionId) {
        setSelectedSession(null);
      }
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleCardClick = (session) => {
    if (confirmDeleteId) {
      setConfirmDeleteId(null);
      return;
    }
    setSelectedSession(session);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const groupSessionsByDate = (sessions) => {
    const groups = {};
    sessions.forEach((session) => {
      const key = formatDate(session.createdAt);
      if (!groups[key]) groups[key] = [];
      groups[key].push(session);
    });
    return groups;
  };

  const filteredHistory = searchQuery.trim()
    ? chatHistory.filter((session) => {
        const query = searchQuery.toLowerCase();
        if (session.title?.toLowerCase().includes(query)) return true;
        return session.messages?.some((m) =>
          m.content?.toLowerCase().includes(query),
        );
      })
    : chatHistory;

  const groupedSessions = groupSessionsByDate(filteredHistory);

  // ─── Render a structured message block ───
  const renderMessageBlock = (block, idx) => {
    switch (block.type) {
      case "sanskrit":
        return (
          <div key={idx} className="mb-2">
            <div className="flex items-center gap-1.5 mb-1">
              <GiScrollUnfurled className="text-amber-300 text-xs" />
              <span className="text-amber-200/70 text-[10px] font-semibold uppercase tracking-wider">
                Sanskrit
              </span>
            </div>
            <p className="text-amber-100/80 italic text-sm font-serif leading-relaxed pl-3 border-l-2 border-amber-400/30">
              {block.content}
            </p>
          </div>
        );
      case "translation":
        return (
          <div key={idx} className="mb-2">
            <p className="text-blue-100/70 text-sm leading-relaxed pl-3 border-l-2 border-blue-400/20">
              {block.content}
            </p>
          </div>
        );
      case "verse_reference":
        return (
          <div
            key={idx}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/20 mb-2"
          >
            <GiScrollUnfurled className="text-amber-300 text-[10px]" />
            <span className="text-amber-200/80 text-[10px]">
              {block.content}
            </span>
          </div>
        );
      case "practice":
        return (
          <div
            key={idx}
            className="mb-2 p-2.5 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-400/20"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <GiPrayerBeads className="text-green-300 text-xs" />
              <span className="text-green-200/80 text-[10px] font-semibold uppercase tracking-wider">
                Practice
              </span>
            </div>
            <p className="text-green-100/70 text-sm leading-relaxed">
              {block.content}
            </p>
          </div>
        );
      default:
        return (
          <div key={idx} className="mb-2">
            <div className="text-blue-100/70 text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {block.content || ""}
              </ReactMarkdown>
            </div>
          </div>
        );
    }
  };

  // ─── Session preview (read-only) ───
  const renderSessionPreview = () => {
    if (!selectedSession) return null;
    const messages = selectedSession.messages || [];
    const userMsgCount = messages.filter((m) => m.role === "user").length;
    const krishnaMsgCount = messages.filter((m) => m.role === "assistant").length;

    return (
      <motion.div
        key="session-preview"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col h-full"
      >
        {/* Preview Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setSelectedSession(null)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-blue-100/60 hover:text-amber-200 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MdArrowBack className="text-lg" />
            </motion.button>
            <div>
              <h3 className="font-bold text-amber-100/90 text-sm md:text-base truncate max-w-[180px] md:max-w-[300px]">
                {selectedSession.title || "Conversation"}
              </h3>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-[10px] text-blue-100/40 flex items-center gap-1">
                  <MdCalendarToday className="text-[10px]" />
                  {formatDate(selectedSession.createdAt)}
                </span>
                <span className="text-[10px] text-blue-100/40 flex items-center gap-1">
                  <MdChat className="text-[10px]" />
                  {userMsgCount} questions, {krishnaMsgCount} answers
                </span>
              </div>
            </div>
          </div>

          <motion.button
            onClick={() => onContinueSession(selectedSession)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/30 text-amber-200 text-xs font-semibold transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Continue</span>
            <IoArrowForward className="text-sm" />
          </motion.button>
        </div>

        {/* Messages Preview */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[55vh] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.03, 0.5) }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "user" ? (
                <div
                  className={`${isMobile ? "max-w-[85%]" : "max-w-[75%]"} p-3 rounded-2xl bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400/20`}
                >
                  <p className="text-amber-100/90 text-sm">{msg.content}</p>
                  {msg.timestamp && (
                    <p className="text-[10px] text-amber-200/40 mt-1 flex items-center gap-1">
                      <MdAccessTime className="text-[10px]" />
                      {formatTime(msg.timestamp)}
                    </p>
                  )}
                </div>
              ) : (
                <div className={`${isMobile ? "max-w-[90%]" : "max-w-[80%]"} flex gap-2`}>
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mt-1">
                    <img src={kpng} className="h-5" alt="Krishna" />
                  </div>
                  <div className="flex-1 p-3 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10">
                    {msg.structured_message?.blocks ? (
                      msg.structured_message.blocks.map((block, bi) =>
                        renderMessageBlock(block, bi),
                      )
                    ) : (
                      <div className="text-blue-100/70 text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content || ""}
                        </ReactMarkdown>
                      </div>
                    )}
                    {msg.timestamp && (
                      <p className="text-[10px] text-blue-100/30 mt-2 flex items-center gap-1">
                        <MdAccessTime className="text-[10px]" />
                        {formatTime(msg.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Read-only footer */}
        <div className="mt-3 pt-3 border-t border-white/10 text-center">
          <p className="text-[10px] text-blue-100/30 flex items-center justify-center gap-1.5">
            <MdHistory className="text-xs" />
            Read-only preview &middot; Click "Continue" to resume this conversation
          </p>
        </div>
      </motion.div>
    );
  };

  // ─── Session list ───
  const renderSessionList = () => (
    <motion.div
      key="session-list"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="mb-4 md:mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
              Sacred Conversations
            </h2>
            <p className="text-[10px] md:text-xs text-blue-100/30 mt-1">
              Revisit your past dialogues with Krishna
            </p>
          </div>
          {chatHistory.length > 0 && (
            <div className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/20">
              <span className="text-[10px] md:text-xs text-amber-200/70 font-medium">
                {chatHistory.length}{" "}
                {chatHistory.length === 1 ? "session" : "sessions"}
              </span>
            </div>
          )}
        </div>

        {/* Search */}
        {chatHistory.length > 2 && (
          <div className="relative">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-100/30 text-sm" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-amber-400/30 text-sm text-blue-100/80 placeholder-blue-100/30 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-100/40 hover:text-blue-100/60"
              >
                <IoClose className="text-sm" />
              </button>
            )}
          </div>
        )}
      </div>

      {filteredHistory.length === 0 ? (
        <div className="text-center py-10 md:py-14">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            {searchQuery ? (
              <IoSearch className="text-3xl md:text-4xl text-blue-100/40" />
            ) : (
              <MdHistory className="text-3xl md:text-4xl text-blue-100/40" />
            )}
          </div>
          <p className="text-blue-100/60 text-sm md:text-base font-medium mb-1">
            {searchQuery ? "No matching conversations" : "No conversations yet"}
          </p>
          <p className="text-blue-100/30 text-xs md:text-sm">
            {searchQuery
              ? "Try a different search term"
              : "Your chat sessions with Krishna will appear here"}
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {Object.entries(groupedSessions).map(([dateLabel, sessions]) => (
            <div key={dateLabel}>
              <div className="flex items-center gap-2 mb-2">
                <MdCalendarToday className="text-blue-100/30 text-[10px]" />
                <span className="text-[10px] md:text-xs text-blue-100/40 font-medium uppercase tracking-wider">
                  {dateLabel}
                </span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <div className="space-y-2">
                <AnimatePresence>
                  {sessions.map((session, index) => {
                    const messageCount = session.messages?.length || 0;
                    const userMessages =
                      session.messages?.filter((m) => m.role === "user") || [];
                    const krishnaMessages =
                      session.messages?.filter((m) => m.role === "assistant") || [];
                    const firstQuestion = userMessages[0]?.content || "No preview";
                    const firstAnswer = krishnaMessages[0]?.content || "";
                    const isConfirmingDelete = confirmDeleteId === session.sessionId;

                    return (
                      <motion.div
                        key={session.sessionId || index}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100, height: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="group relative p-3 md:p-4 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 hover:border-amber-400/30 hover:from-white/[0.08] hover:to-white/[0.04] transition-all cursor-pointer"
                        onClick={() => handleCardClick(session)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/10">
                            <img src={kpng} className="h-6 md:h-7" alt="Krishna" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <h3 className="font-semibold text-amber-100/90 text-sm md:text-base line-clamp-1">
                                {session.title || "Conversation"}
                              </h3>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {session.createdAt && (
                                  <span className="text-[10px] text-blue-100/40 flex items-center gap-1">
                                    <MdAccessTime className="text-[9px]" />
                                    {formatTime(session.createdAt)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-amber-200/50 mb-1 line-clamp-1">
                              <span className="text-amber-300/40">Q: </span>
                              {firstQuestion}
                            </p>

                            {firstAnswer && (
                              <p className="text-xs text-blue-100/35 line-clamp-2 leading-relaxed mb-2">
                                <span className="text-blue-200/40">A: </span>
                                {firstAnswer.substring(0, 150)}
                                {firstAnswer.length > 150 ? "..." : ""}
                              </p>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-blue-100/40 border border-white/5 flex items-center gap-1">
                                  <IoChatbubbleEllipses className="text-[9px]" />
                                  {messageCount} {messageCount === 1 ? "msg" : "msgs"}
                                </span>
                                <span className="text-[10px] bg-amber-500/5 px-2 py-0.5 rounded-full text-amber-200/40 border border-amber-400/10">
                                  {userMessages.length}{" "}
                                  {userMessages.length === 1 ? "question" : "questions"}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <motion.button
                                  onClick={(e) => handleDelete(e, session.sessionId)}
                                  disabled={deletingId === session.sessionId}
                                  className={`${isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${
                                    isConfirmingDelete
                                      ? "bg-red-500/20 text-red-300 border border-red-400/30"
                                      : "text-blue-100/30 hover:text-red-300 hover:bg-red-500/10"
                                  }`}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {deletingId === session.sessionId ? (
                                    <span className="animate-spin inline-block">⟳</span>
                                  ) : (
                                    <MdDeleteOutline className="text-sm" />
                                  )}
                                  {isConfirmingDelete ? "Confirm?" : ""}
                                </motion.button>
                                <IoChevronForward
                                  className={`text-blue-100/20 text-sm ${isMobile ? "" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <motion.div
      key="history"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl md:rounded-2xl shadow-2xl border border-white/20 p-4 md:p-6"
    >
      <AnimatePresence mode="wait">
        {selectedSession ? renderSessionPreview() : renderSessionList()}
      </AnimatePresence>
    </motion.div>
  );
};

export default HistoryTab;
