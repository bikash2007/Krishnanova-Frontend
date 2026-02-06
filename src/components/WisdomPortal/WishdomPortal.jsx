import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import KrishnaVoiceElevenLabs from "./components/KrishnaVoiceElevenLabs";
import kpng from "../../Media/k.png";

// Layout Components
import PortalHeader from "./components/Layout/PortalHeader";
import StatsOverview from "./components/Layout/StatsOverview";
import TabNavigation from "./components/Layout/TabNavigation";
import NamingDialog from "./components/Layout/NamingDialog";

// Shared Components
import NotificationToast from "./components/Shared/NotificationToast";
import AchievementNotification from "./components/Shared/AchievementNotification";
import {
  useSmartPresence,
  EmotionPicker,
  PendingPracticeBanner,
  ContextGreeting,
  EMOTIONAL_STATES,
} from "./components/Shared/SmartPresence";

// Tab Components

import AchievementsTab from "./components/Progress/AchievementsTab";
import HistoryTab from "./components/History/HistoryTab";
import MeditationModule from "./components/Meditation/MeditationModule";
import MantraModule from "./components/Mantra/MantraModule"; // Import MantraModule

// Import only available React Icons
import { FaOm } from "react-icons/fa";

import { MdAutoAwesome, MdMenuBook, MdHistory } from "react-icons/md";

import {
  IoSparkles,
  IoFlame,
  IoTrophy,
  IoStar,
  IoBook,
  IoChatbubbles,
  IoTime,
  IoCalendar,
  IoHeart,
  IoHeartOutline,
  IoBookmark,
  IoBookmarkOutline,
  IoSettings,
  IoPause,
  IoVolumeHigh,
  IoThumbsUp,
  IoThumbsDown,
  IoCheckmark,
  IoClose,
  IoLocation,
  IoLanguage,
  IoTrendingUp,
  IoEye,
  IoSave,
  IoTrash,
} from "react-icons/io5";

import {
  GiMeditation,
  GiPrayerBeads,
  GiFlute,
  GiPeaceDove,
  GiLotusFlower,
  GiSunRadiations,
  GiCrystalShrine,
  GiTempleGate,
  GiIncense,
  GiCandleFlame,
  GiChakram,
  GiThirdEye,
  GiPrayer,
  GiBowman,
  GiChariot,
  GiElephant,
  GiFeather, // Changed from GiPeacock to GiFeather
  GiSnake,
  GiTigerHead,
  GiWhiteBook,
  GiScrollUnfurled,
  GiAncientSword,
  GiCrown,
  GiDiamondRing,
  GiGems,
  GiCrystalBall,
  GiMoonOrbit,
  GiSunPriest,
  GiMoonClaws,
  GiStarSwirl,
  GiGalaxy,
  GiMagicSwirl,
  GiEnlightenment,
  GiInnerSelf,
  GiPsychicWaves,
  GiBrain,
  GiHeartOrgan,
  GiSoulVessel,
} from "react-icons/gi";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Add Icons object for easier reference
const Icons = {
  om: <FaOm />,
  history: <MdHistory />,
  chanting: <GiPrayerBeads />,
  streak: <IoFlame />,
  peacock: <GiFeather />, // Using GiFeather as peacock alternative
};

// Enhanced Voice Settings Component
const VoiceSettings = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [availableVoices, setAvailableVoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen) {
      loadVoiceOptions();
    }
  }, [isOpen]);

  const loadVoiceOptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/krishna/wisdom-portal/voice-options`,
      );
      if (response.data.success) {
        setAvailableVoices(response.data.voices);
      }
    } catch (error) {
      console.error("Failed to load voice options:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute top-16 right-0 z-50 backdrop-blur-md bg-gradient-to-br from-white/20 to-white/10 rounded-xl p-4 shadow-2xl border border-white/30 w-80"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-amber-200 font-semibold flex items-center gap-2">
          <IoSettings className="text-lg" /> Voice Settings
        </h3>
        <button
          onClick={onClose}
          className="text-blue-100/60 hover:text-amber-200 transition-colors"
        >
          <IoClose className="text-xl" />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-blue-100/80  mb-1 flex items-center gap-1">
              <IoLanguage /> Voice Provider
            </label>
            <select
              value={settings.provider || "auto"}
              onChange={(e) =>
                onSettingsChange({ ...settings, provider: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-amber-400/30 text-amber-200 text-sm"
            >
              <option value="auto">Auto (Best Available)</option>
              <option value="elevenlabs">ElevenLabs (Premium)</option>
              <option value="google">Google Cloud</option>
              <option value="browser">Browser (Basic)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-blue-100/80 block mb-1">
              Speed: {settings.rate || 0.95}x
            </label>
            <input
              type="range"
              min="0.7"
              max="1.2"
              step="0.05"
              value={settings.rate || 0.95}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  rate: parseFloat(e.target.value),
                })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="text-xs text-blue-100/80 block mb-1">
              Volume: {Math.round((settings.volume || 1) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.volume || 1}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  volume: parseFloat(e.target.value),
                })
              }
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoSpeak"
              checked={settings.autoSpeak || false}
              onChange={(e) =>
                onSettingsChange({ ...settings, autoSpeak: e.target.checked })
              }
              className="rounded"
            />
            <label
              htmlFor="autoSpeak"
              className="text-sm text-blue-100/80 flex items-center gap-1"
            >
              <MdAutoAwesome /> Auto-speak Krishna's messages
            </label>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Saved Conversations Modal
const SavedConversationsModal = ({
  isOpen,
  onClose,
  savedConversations,
  onLoadConversation,
  onDeleteConversation,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="backdrop-blur-md bg-gradient-to-br from-white/20 to-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-3xl max-h-[80vh] overflow-hidden border border-white/30"
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

        <div className="overflow-y-auto max-h-[60vh] space-y-3">
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

// Enhanced Krishna Message Component
// Enhanced Krishna Message Component with fixed TTS
const EnhancedKrishnaMessage = ({
  message,
  onFeedback,
  onAcceptPractice,
  hasActivePractice,
  isMobile,
  voiceSettings,
  onSaveMessage,
  isSaved = false,
  userId, // Add userId prop
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState(null);
  const [practiceAccepted, setPracticeAccepted] = useState(false);
  const [isMessageSaved, setIsMessageSaved] = useState(isSaved);

  const getPlainTextForSpeech = () => {
    const blocks = message.blocks ||
      message.structured_message?.blocks ||
      message.message?.blocks || [
        {
          type: "text",
          content: message.text || message.reply || message.content,
        },
      ];

    let speechText = "";
    blocks.forEach((block) => {
      if (block.type === "sanskrit") {
        speechText += block.content + "... ";
      } else if (
        block.type === "translation" ||
        block.type === "text" ||
        block.type === "explanation"
      ) {
        speechText += block.content + " ";
      } else if (block.type === "verse_reference") {
        speechText += "From " + block.content + ". ";
      }
    });

    return speechText.trim();
  };

  const handleFeedback = async (type) => {
    if (feedbackGiven) return;
    setFeedbackGiven(type);
    await onFeedback(message.id || message.messageId, type, message);
  };

  const handleAcceptPractice = (practice) => {
    if (!hasActivePractice && !practiceAccepted) {
      onAcceptPractice(practice);
      setPracticeAccepted(true);
    }
  };

  const handleSaveMessage = () => {
    setIsMessageSaved(!isMessageSaved);
    onSaveMessage(message, !isMessageSaved);
  };

  const blocks = message.blocks ||
    message.structured_message?.blocks ||
    message.message?.blocks || [
      {
        type: "text",
        content: message.text || message.reply || message.content,
      },
    ];

  const renderBlock = (block, index) => {
    switch (block.type) {
      case "sanskrit":
        return (
          <div key={index} className="mb-3 md:mb-4">
            <h4 className="text-amber-200 text-xs md:text-sm font-semibold mb-2 flex items-center gap-2">
              <GiScrollUnfurled className="text-amber-300" /> Sanskrit
            </h4>
            <div className="bg-gradient-to-r from-amber-400/10 to-orange-500/10 rounded-lg p-3 md:p-4 border border-amber-400/20">
              <p className="text-amber-100 font-serif text-base md:text-lg leading-relaxed break-words">
                {block.content}
              </p>
            </div>
          </div>
        );

      case "translation":
        return (
          <div key={index} className="mb-3 md:mb-4">
            <h4 className="text-amber-200 text-xs md:text-sm font-semibold mb-2 flex items-center gap-2">
              <MdMenuBook className="text-amber-300" /> Translation
            </h4>
            <div className="border-l-3 border-amber-400/50 pl-3 md:pl-4 text-blue-100/90 italic text-sm md:text-base">
              {block.content}
            </div>
          </div>
        );

      case "verse_reference":
        return (
          <div
            key={index}
            className="mb-3 inline-flex items-center gap-2 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full px-3 py-1.5 md:px-4 md:py-2 border border-amber-400/30"
          >
            <IoLocation className="text-amber-300" />
            <span className="text-amber-200 font-semibold text-xs md:text-sm">
              {block.content}
            </span>
          </div>
        );

      case "practice":
        if (hasActivePractice || practiceAccepted) return null;

        return (
          <div
            key={index}
            className="mt-3 md:mt-4 bg-gradient-to-r from-amber-400/20 to-orange-500/20 backdrop-blur-md rounded-xl p-3 md:p-4 border border-amber-400/30"
          >
            <h4 className="text-amber-200 font-semibold text-sm md:text-base mb-2 flex items-center gap-2">
              <IoSparkles className="text-amber-300" /> Suggested Practice
            </h4>
            <p className="text-blue-100/90 text-sm md:text-base mb-3">
              {block.content}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <motion.button
                onClick={() =>
                  handleAcceptPractice({
                    category: block.category || message.practice_category,
                    text: block.content,
                    duration: block.duration,
                  })
                }
                className="px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg font-semibold text-xs md:text-sm flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoCheckmark /> Accept Practice
              </motion.button>
              <motion.button
                onClick={() => setPracticeAccepted(true)}
                className="px-3 py-2 md:px-4 md:py-2 bg-white/10 text-blue-100 rounded-lg font-semibold text-xs md:text-sm flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoTime /> Maybe Later
              </motion.button>
            </div>
          </div>
        );

      default:
        return (
          <div
            key={index}
            className="text-blue-100/90 prose prose-sm md:prose-base prose-invert max-w-none"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {block.content || block.text || ""}
            </ReactMarkdown>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start mb-3 md:mb-4 w-full"
    >
      <div
        className={`flex gap-2 md:gap-3 ${
          isMobile ? "max-w-[95%]" : "max-w-[85%]"
        }`}
      >
        <div className="flex-shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg text-sm md:text-base">
            <img src={kpng} className="h-8" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-gradient-to-r from-purple-400/10 to-blue-500/10 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-5 border border-purple-400/30 shadow-xl">
            <div className="space-y-2 md:space-y-3">
              {blocks.map((block, index) => renderBlock(block, index))}
            </div>

            <div className="flex items-center justify-between mt-3 md:mt-4 pt-2 md:pt-3 border-t border-purple-400/20">
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-100/50">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>

                <div className="flex items-center gap-1">
                  {/* Replace all the voice button code with KrishnaVoiceElevenLabs */}
                  <KrishnaVoiceElevenLabs
                    text={getPlainTextForSpeech()}
                    messageId={message.id || message.messageId}
                    userId={userId}
                    voiceSettings={voiceSettings}
                    isProactive={message.isProactive || false} // Pass the proactive flag
                    autoPlay={
                      // Only auto-play if ALL conditions are met:
                      // 1. This is a proactive message
                      // 2. Auto-speak is enabled in settings
                      // 3. This is a Krishna message (not user)
                      message.isProactive &&
                      voiceSettings?.autoSpeak &&
                      message.sender === "krishna"
                    }
                  />

                  {/* Save Message Button */}
                  <motion.button
                    onClick={handleSaveMessage}
                    className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${
                      isMessageSaved
                        ? "text-amber-400"
                        : "text-blue-100/50 hover:text-amber-400"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={
                      isMessageSaved ? "Remove from saved" : "Save this message"
                    }
                  >
                    {isMessageSaved ? (
                      <IoBookmark className="text-lg" />
                    ) : (
                      <IoBookmarkOutline className="text-lg" />
                    )}
                  </motion.button>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                {!feedbackGiven && !message.isProactive ? (
                  <>
                    <motion.button
                      onClick={() => handleFeedback("thumbs_up")}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-blue-100/50 hover:text-green-400 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="This was helpful"
                    >
                      <IoThumbsUp className="text-lg" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleFeedback("thumbs_down")}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-blue-100/50 hover:text-red-400 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="This needs improvement"
                    >
                      <IoThumbsDown className="text-lg" />
                    </motion.button>
                  </>
                ) : (
                  feedbackGiven && (
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <IoCheckmark /> Feedback received
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Yoga Practice Cards Component
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
      name: "Gyana Yog ",
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

// Main WishdomPortal Component
export default function WishdomPortal() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;

  // ===== BHAKTI API HELPER =====
  // Call backend API to add bhakti activity with proper points
  const addBhaktiActivity = useCallback(
    async (pillar, activity) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return { success: false, message: "Not logged in" };

        const response = await axios.post(
          `${baseUrl}/bhakti/add-activity`,
          { pillar, activity },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data.success) {
          // Update local state with server values
          setBhaktiProgress((prev) => ({
            ...prev,
            [pillar]: response.data.pillarProgress,
            // Also update smaranam if streak bonus was earned
            ...(response.data.streak?.bonusEarned > 0 && pillar !== "smaranam"
              ? {
                  smaranam:
                    (prev.smaranam || 0) + response.data.streak.bonusEarned,
                }
              : {}),
          }));

          // Show streak bonus message if earned
          if (response.data.streak?.bonusEarned > 0) {
            showToast(response.data.streak.message, 4000);
          }

          return response.data;
        }

        return { success: false };
      } catch (error) {
        // Handle rate limiting
        if (error.response?.status === 429) {
          console.log("Rate limited:", error.response.data.message);
          return {
            success: false,
            rateLimited: true,
            message: error.response.data.message,
          };
        }
        console.error("Failed to add bhakti activity:", error);
        return { success: false, message: "Failed to connect" };
      }
    },
    [baseUrl],
  );

  // Listen for bhakti points from Gita reader
  useEffect(() => {
    const handleBhaktiPoints = (event) => {
      const { pillar, points, description, xpAwarded, leveledUp, newLevel } =
        event.detail;

      // Update local state
      setBhaktiProgress((prev) => ({
        ...prev,
        [pillar]: (prev[pillar] || 0) + points,
      }));

      // Show toast
      showToast(
        `+${xpAwarded} XP • +${points} ${pillar === "sravanam" ? "Śravaṇam" : pillar}`,
        3000,
      );

      // Handle level up
      if (leveledUp) {
        showLevelUpNotification(newLevel);
      }
    };

    window.addEventListener("bhaktiPointsEarned", handleBhaktiPoints);
    return () =>
      window.removeEventListener("bhaktiPointsEarned", handleBhaktiPoints);
  }, []);

  // Protect Route
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // State Management
  const [showNamingDialog, setShowNamingDialog] = useState(false);
  const [krishnaName, setKrishnaName] = useState("");
  const [yourName, setYourName] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [currentSessionId, setCurrentSessionId] = useState(
    Date.now().toString(),
  );
  const [loadingData, setLoadingData] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [activePractice, setActivePractice] = useState(null);
  const [lastProactiveTime, setLastProactiveTime] = useState(null);
  const [savedConversations, setSavedConversations] = useState([]);
  const [showSavedConversations, setShowSavedConversations] = useState(false);
  const [savedMessages, setSavedMessages] = useState(new Set());
  const [lastUserActivity, setLastUserActivity] = useState(Date.now());
  const [isUserActive, setIsUserActive] = useState(true);
  const activityTimeoutRef = useRef(null);
  // Voice State
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState(() => {
    // Load saved settings from localStorage
    const saved = localStorage.getItem("krishnaVoiceSettings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load voice settings:", e);
      }
    }

    // Default settings
    return {
      provider: "elevenlabs",
      quality: "high",
      voiceStyle: "divine",
      rate: 0.85,
      volume: 1.0,
      autoSpeak: true, // Only affects proactive messages
    };
  });

  // Also add a function to handle settings changes that saves to localStorage
  const handleVoiceSettingsChange = (newSettings) => {
    setVoiceSettings(newSettings);
    localStorage.setItem("krishnaVoiceSettings", JSON.stringify(newSettings));
  };

  // Meditation State
  const [isMeditating, setIsMeditating] = useState(false);
  const [meditationTime, setMeditationTime] = useState(0);
  const [totalMeditationTime, setTotalMeditationTime] = useState(
    user?.wisdomPortal?.stats?.totalMeditationTime || 0,
  );
  const [meditationStreak, setMeditationStreak] = useState(
    user?.wisdomPortal?.stats?.meditationStreak || 0,
  );
  const [meditationDuration, setMeditationDuration] = useState(5);

  // Chanting State
  const [chantCount, setChantCount] = useState(0);
  const [totalChants, setTotalChants] = useState(
    user?.wisdomPortal?.stats?.totalChants || 0,
  );
  const [selectedMantra, setSelectedMantra] = useState("Hare Krishna");

  // Practice Tracking State
  const [practices, setPractices] = useState({
    bhaktiYoga: 0,
    karmaYoga: 0,
    jnanaYoga: 0,
    rajaYoga: 0,
  });

  // Bhakti Pillars Progress (4 Pillars of Bhakti)
  const [bhaktiProgress, setBhaktiProgress] = useState({
    sravanam: 0, // Clarity - from asking/reading wisdom
    kirtanam: 0, // Vibration - from chanting
    smaranam: 0, // Presence - from remembering/returning
    archanam: 0, // Stillness - from meditation
  });

  // Smart Presence State
  const [emotionalState, setEmotionalState] = useState(null);
  const [showEmotionPicker, setShowEmotionPicker] = useState(false);
  const [pendingDailyPractice, setPendingDailyPractice] = useState(null);
  const [smartOpening, setSmartOpening] = useState(null);

  // User Stats
  const [userStats, setUserStats] = useState({
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
    achievements: [],
    dailyGoals: {
      meditation: 5,
      chanting: 108,
      wisdom: 3,
    },
    progress: {
      meditation: 0,
      chanting: 0,
      wisdom: 0,
    },
  });

  // Refs
  const containerRef = useRef(null);
  const chatEndRef = useRef(null);
  const timerInterval = useRef(null);

  // Save bhakti progress to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      const username = user?.username || user?.email || user?._id;
      localStorage.setItem(
        `bhakti_progress_${username}`,
        JSON.stringify(bhaktiProgress),
      );
    }
  }, [bhaktiProgress, user]);

  // Mantras
  // Add this function to track user activity
  const updateUserActivity = useCallback(() => {
    setLastUserActivity(Date.now());
    setIsUserActive(true);

    // Clear existing timeout
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }

    // Set user as inactive after 30 seconds of no activity
    activityTimeoutRef.current = setTimeout(() => {
      setIsUserActive(false);
    }, 30000); // 30 seconds
  }, []);

  // Add activity listeners
  useEffect(() => {
    const handleActivity = () => {
      updateUserActivity();
    };

    // Listen for various user activities
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keypress", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keypress", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("touchstart", handleActivity);

      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  }, [updateUserActivity]);

  const mantras = [
    {
      name: "Hare Krishna",
      sanskrit: "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे",
    },
    { name: "Om Namo Bhagavate", sanskrit: "ॐ नमो भगवते वासुदेवाय" },
    { name: "Radhe Radhe", sanskrit: "राधे राधे" },
    { name: "Govinda", sanskrit: "गोविन्द जय जय गोपाल जय जय" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getUserIdentifier = useCallback(() => {
    return user?.username || user?.email || user?._id;
  }, [user]);

  const showToast = useCallback((message, duration = 3000) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), duration);
  }, []);

  useEffect(() => {
    document.title = "Wisdom Portal | Krishna AI Chat & Spiritual Growth";
    return () => {
      document.title = "Krishnova";
    };
  }, []);

  useEffect(() => {
    if (!loading && user && containerRef.current && !isMobile) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
        );

        gsap.to(".floating-element", {
          y: -20,
          duration: 3,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
          stagger: 0.2,
        });

        gsap.to(".pulse-element", {
          scale: [1, 1.1, 1],
          duration: 2,
          repeat: -1,
          ease: "power1.inOut",
        });
      }, containerRef);

      return () => ctx.revert();
    }
  }, [loading, user, isMobile]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Load saved conversations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(
      `savedConversations_${getUserIdentifier()}`,
    );
    if (saved) {
      setSavedConversations(JSON.parse(saved));
    }
  }, [getUserIdentifier]);

  // Save conversation to localStorage
  const saveConversation = () => {
    if (chatMessages.length === 0) {
      showToast("No messages to save");
      return;
    }

    const conversation = {
      id: Date.now().toString(),
      title: `Conversation ${new Date().toLocaleDateString()}`,
      messages: chatMessages,
      savedAt: new Date(),
      messageCount: chatMessages.length,
      preview:
        chatMessages.find((m) => m.sender === "user")?.text ||
        "Krishna's wisdom",
      tags: extractTags(chatMessages),
    };

    const updatedSaved = [...savedConversations, conversation];
    setSavedConversations(updatedSaved);
    localStorage.setItem(
      `savedConversations_${getUserIdentifier()}`,
      JSON.stringify(updatedSaved),
    );
    showToast("Conversation saved successfully!");
  };

  // Extract tags from messages
  const extractTags = (messages) => {
    const tags = new Set();
    messages.forEach((msg) => {
      if (msg.practice_category) tags.add(msg.practice_category);
      if (msg.verse_reference) tags.add("Bhagavad Gita");
      const text = msg.text || msg.content || "";
      if (text.toLowerCase().includes("meditation")) tags.add("Meditation");
      if (text.toLowerCase().includes("karma")) tags.add("Karma");
      if (text.toLowerCase().includes("bhakti")) tags.add("Bhakti");
      if (text.toLowerCase().includes("peace")) tags.add("Peace");
    });
    return Array.from(tags).slice(0, 5);
  };

  // Load saved conversation
  const loadSavedConversation = (conversation) => {
    setChatMessages(conversation.messages);
    setCurrentSessionId(Date.now().toString());
    setShowSavedConversations(false);
    setActiveTab("chat");
    showToast("Conversation loaded");
  };

  // Delete saved conversation
  const deleteSavedConversation = (id) => {
    const updatedSaved = savedConversations.filter((c) => c.id !== id);
    setSavedConversations(updatedSaved);
    localStorage.setItem(
      `savedConversations_${getUserIdentifier()}`,
      JSON.stringify(updatedSaved),
    );
    showToast("Conversation deleted");
  };

  // Save individual message
  const handleSaveMessage = (message, shouldSave) => {
    if (shouldSave) {
      savedMessages.add(message.id);
    } else {
      savedMessages.delete(message.id);
    }
    setSavedMessages(new Set(savedMessages));
  };

  const loadPortalData = useCallback(async () => {
    if (!user) return;

    try {
      setLoadingData(true);
      const username = getUserIdentifier();
      const response = await axios.get(
        `${baseUrl}/krishna/wisdom-portal/data/${username}`,
      );

      if (response.data.success) {
        const data = response.data.data;

        setKrishnaName(data.krishnaName || "Krishna");
        setYourName(data.spiritualName || user.name);

        if (!data.krishnaName || !data.spiritualName) {
          setShowNamingDialog(true);
        }

        const currentLevelXP = data.experience % 100;
        const xpToNext = 100 - currentLevelXP;

        setUserStats({
          level: data.level || 1,
          experience: data.experience || 0,
          experienceToNextLevel: xpToNext,
          achievements: data.achievements || [],
          dailyGoals: data.stats?.dailyGoals || {
            meditation: 5,
            chanting: 108,
            wisdom: 3,
          },
          progress: data.stats?.todayProgress || {
            meditation: 0,
            chanting: 0,
            wisdom: 0,
          },
        });

        setPractices(
          data.practices || {
            bhaktiYoga: 0,
            karmaYoga: 0,
            jnanaYoga: 0,
            rajaYoga: 0,
          },
        );

        // Load Bhakti Pillars progress from backend API
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const bhaktiResponse = await axios.get(
              `${baseUrl}/bhakti/progress`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );
            if (bhaktiResponse.data.success) {
              const backendProgress = bhaktiResponse.data.bhaktiPillars || {};
              setBhaktiProgress({
                sravanam: backendProgress.sravanam || 0,
                kirtanam: backendProgress.kirtanam || 0,
                smaranam: backendProgress.smaranam || 0,
                archanam: backendProgress.archanam || 0,
              });
            }
          } catch (bhaktiError) {
            console.log(
              "Failed to load bhakti from backend, using fallback:",
              bhaktiError.message,
            );
            // Fallback to localStorage
            if (data.bhaktiProgress) {
              setBhaktiProgress(data.bhaktiProgress);
            } else {
              const savedBhakti = localStorage.getItem(
                `bhakti_progress_${username}`,
              );
              if (savedBhakti) {
                try {
                  setBhaktiProgress(JSON.parse(savedBhakti));
                } catch (e) {
                  console.error("Failed to parse saved bhakti progress:", e);
                }
              }
            }
          }
        } else {
          // No token - use localStorage fallback
          if (data.bhaktiProgress) {
            setBhaktiProgress(data.bhaktiProgress);
          } else {
            const savedBhakti = localStorage.getItem(
              `bhakti_progress_${username}`,
            );
            if (savedBhakti) {
              try {
                setBhaktiProgress(JSON.parse(savedBhakti));
              } catch (e) {
                console.error("Failed to parse saved bhakti progress:", e);
              }
            }
          }
        }

        // Track Smaranam (remembrance) via backend daily check-in
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const checkInResponse = await axios.post(
              `${baseUrl}/bhakti/daily-check-in`,
              {},
              { headers: { Authorization: `Bearer ${token}` } },
            );

            if (
              checkInResponse.data.success &&
              !checkInResponse.data.alreadyCheckedIn
            ) {
              // Update local state with the new points
              setBhaktiProgress((prev) => ({
                ...prev,
                smaranam:
                  (prev.smaranam || 0) + checkInResponse.data.pointsEarned,
              }));

              // Show subtle acknowledgment
              setTimeout(() => {
                showToast(
                  checkInResponse.data.message ||
                    "🙏 Your return is remembered • +1 Smaraṇam",
                  3000,
                );
              }, 2000);
            }
          }
        } catch (checkInError) {
          console.log("Daily check-in skipped:", checkInError.message);
        }

        // Load pending daily practice if exists
        if (data.pendingPractice) {
          setPendingDailyPractice(data.pendingPractice);
        }

        // Load last emotional state
        if (data.lastEmotionalState) {
          setEmotionalState(EMOTIONAL_STATES[data.lastEmotionalState] || null);
        }

        setTotalMeditationTime(data.stats?.totalMeditationTime || 0);
        setTotalChants(data.stats?.totalChants || 0);
        setMeditationStreak(data.stats?.meditationStreak || 0);
        setMeditationDuration(data.meditationDuration || 5);

        if (data.activePractices && data.activePractices.length > 0) {
          const activePracticeNotCompleted = data.activePractices.find(
            (p) => !p.completed,
          );
          setActivePractice(activePracticeNotCompleted || null);
        } else {
          setActivePractice(null);
        }

        if (data.chatHistory && data.chatHistory.length > 0) {
          setChatHistory(data.chatHistory);

          if (
            activeTab === "chat" &&
            chatMessages.length === 0 &&
            data.chatHistory[0]
          ) {
            const lastSession = data.chatHistory[0];
            const formattedMessages = lastSession.messages.map((msg, idx) => ({
              id: `${lastSession.sessionId}-${idx}`,
              sender: msg.role === "user" ? "user" : "krishna",
              text: msg.content,
              content: msg.content,
              timestamp: msg.timestamp || lastSession.createdAt,
              structured_message: msg.structured_message,
              blocks: msg.structured_message?.blocks,
              practice_category: msg.structured_message?.practice_category,
              practice_text: msg.structured_message?.practice_text,
            }));
            setChatMessages(formattedMessages);
            setCurrentSessionId(lastSession.sessionId);
          }
        }
      }
    } catch (error) {
      console.error("Error loading portal data:", error);
      if (error.response?.status === 404) {
        setShowNamingDialog(true);
      }
    } finally {
      setLoadingData(false);
    }
  }, [user, baseUrl, getUserIdentifier, activeTab, chatMessages.length]);

  useEffect(() => {
    if (!loading && user) {
      loadPortalData();
    }
  }, [user, loading, loadPortalData]);

  const handleSaveNames = async () => {
    if (!krishnaName || !yourName) {
      showToast("Please enter both names");
      return;
    }

    try {
      const username = getUserIdentifier();
      await axios.post(`${baseUrl}/krishna/wisdom-portal/names`, {
        userId: username,
        krishnaName,
        spiritualName: yourName,
      });

      setShowNamingDialog(false);
      showToast("Welcome to your spiritual journey!");
      loadPortalData();
    } catch (error) {
      console.error("Error saving names:", error);
      showToast("Failed to save names. Please try again.");
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: currentMessage,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const questionText = currentMessage;
    setCurrentMessage("");
    setIsTyping(true);

    try {
      const username = getUserIdentifier();

      const conversationHistory = chatMessages
        .filter((msg) => msg.sender === "krishna" || msg.sender === "user")
        .slice(-10)
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text || msg.content,
        }));

      const response = await axios.post(
        `${baseUrl}/krishna/wisdom-portal/chat`,
        {
          userId: username,
          message: questionText,
          sessionId: currentSessionId,
          conversationHistory,
        },
      );

      if (response.data.success) {
        const krishnaMsg = {
          id: Date.now() + 1,
          messageId: response.data.message?.id,
          sender: "krishna",
          text: response.data.reply,
          content: response.data.reply,
          blocks: response.data.message?.blocks,
          structured_message: response.data.message,
          timestamp: new Date(),
          practice_category: response.data.practice_category,
          practice_text: response.data.practice_text,
          verse_reference: response.data.verse_reference,
          question: questionText,
        };

        setChatMessages((prev) => [...prev, krishnaMsg]);

        if (response.data.experienceGained) {
          setUserStats((prev) => ({
            ...prev,
            experience: prev.experience + response.data.experienceGained,
            experienceToNextLevel: Math.max(
              0,
              prev.experienceToNextLevel - response.data.experienceGained,
            ),
            progress: {
              ...prev.progress,
              wisdom: Math.min(
                prev.progress.wisdom + 1,
                prev.dailyGoals.wisdom,
              ),
            },
          }));

          // Update Bhakti Pillars via backend API - Sravanam (asking spiritual questions)
          const bhaktiResult = await addBhaktiActivity(
            "sravanam",
            "asking_question",
          );

          // Add bonus to Krishna catch game if available
          if (window.addKrishnaPracticeBonus) {
            window.addKrishnaPracticeBonus("daily_wisdom");
          }

          // Show toast with proper points from backend
          if (bhaktiResult.success) {
            showToast(
              `+${response.data.experienceGained} XP • +${bhaktiResult.pointsEarned} Śravaṇam`,
              2000,
            );
          } else if (!bhaktiResult.rateLimited) {
            showToast(`+${response.data.experienceGained} XP`, 2000);
          }
        }

        if (response.data.leveledUp) {
          showLevelUpNotification(response.data.newLevel);
          setUserStats((prev) => ({
            ...prev,
            level: response.data.newLevel,
            experienceToNextLevel: 100,
          }));
        }

        if (response.data.sessionId) {
          setCurrentSessionId(response.data.sessionId);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg = {
        id: Date.now() + 1,
        sender: "krishna",
        text: `My dear ${yourName}, I'm having difficulty connecting. Please try again.`,
        content: `My dear ${yourName}, I'm having difficulty connecting. Please try again.`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const sendFeedback = async (messageId, feedbackType, messageData) => {
    try {
      const username = getUserIdentifier();
      await axios.post(`${baseUrl}/krishna/wisdom-portal/feedback`, {
        userId: username,
        messageId,
        feedbackType,
        question: messageData.question || "",
        answer: messageData.text || messageData.reply || messageData.content,
        sessionId: currentSessionId,
      });

      showToast("Thank you for your feedback!");
    } catch (error) {
      console.error("Feedback error:", error);
    }
  };

  const acceptPractice = async (practice) => {
    if (activePractice) {
      showToast("Please complete your current practice first!");
      return;
    }

    try {
      const username = getUserIdentifier();
      const response = await axios.post(
        `${baseUrl}/krishna/wisdom-portal/accept-practice`,
        {
          userId: username,
          practiceCategory: practice.category,
          practiceText: practice.text || practice.content,
          duration: practice.duration || meditationDuration,
        },
      );

      if (response.data.success) {
        setActivePractice(response.data.practice);
        showToast(
          "Practice accepted! Complete it to earn XP and achievements.",
        );
      }
    } catch (error) {
      console.error("Error accepting practice:", error);
      if (error.response?.data?.error) {
        showToast(error.response.data.error);
      } else {
        showToast("Failed to accept practice. Please try again.");
      }
    }
  };

  const completePractice = async () => {
    if (!activePractice) return;

    try {
      const username = getUserIdentifier();
      const response = await axios.post(
        `${baseUrl}/krishna/wisdom-portal/complete-practice`,
        {
          userId: username,
          practiceId: activePractice.id,
          actualDuration: meditationTime / 60,
        },
      );

      if (response.data.success) {
        setPractices(response.data.practices);

        if (response.data.experience) {
          setUserStats((prev) => ({
            ...prev,
            experience: prev.experience + response.data.experience,
            experienceToNextLevel: Math.max(
              0,
              prev.experienceToNextLevel - response.data.experience,
            ),
          }));
          showToast(`Practice completed! +${response.data.experience} XP`);
        }

        if (response.data.achievements?.length > 0) {
          response.data.achievements.forEach((achievement) => {
            showAchievementNotification(achievement);
          });
        }

        if (response.data.leveledUp) {
          showLevelUpNotification(response.data.newLevel);
          setUserStats((prev) => ({
            ...prev,
            level: response.data.newLevel,
            experienceToNextLevel: 100,
          }));
        }

        setActivePractice(null);
        loadPortalData();
      }
    } catch (error) {
      console.error("Error completing practice:", error);
      showToast("Failed to complete practice. Please try again.");
    }
  };

  const startMeditation = () => {
    setIsMeditating(true);
    timerInterval.current = setInterval(() => {
      setMeditationTime((prev) => prev + 1);
    }, 1000);

    if (!isMobile) {
      gsap.to(".meditation-circle", {
        scale: [1, 1.2, 1],
        duration: 4,
        repeat: -1,
        ease: "power1.inOut",
      });
    }
  };

  const stopMeditation = async () => {
    setIsMeditating(false);
    clearInterval(timerInterval.current);

    if (meditationTime > 0) {
      try {
        const username = getUserIdentifier();
        const response = await axios.post(
          `${baseUrl}/krishna/wisdom-portal/meditation`,
          {
            userId: username,
            duration: meditationTime,
          },
        );

        if (response.data.success) {
          setTotalMeditationTime(response.data.totalMeditationTime);
          setMeditationStreak(response.data.streak);

          const minutes = Math.floor(meditationTime / 60);

          // Update Bhakti Pillars via backend API - Archanam (meditation)
          // Use meditation_session for sessions, roop_dhyana for longer ones
          const activity = minutes >= 10 ? "roop_dhyana" : "meditation_session";
          const bhaktiResult = await addBhaktiActivity("archanam", activity);

          // Add bonus to Krishna catch game
          if (window.addKrishnaPracticeBonus) {
            window.addKrishnaPracticeBonus("meditation");
          }

          if (response.data.experience) {
            setUserStats((prev) => ({
              ...prev,
              experience: prev.experience + response.data.experience,
              experienceToNextLevel: Math.max(
                0,
                prev.experienceToNextLevel - response.data.experience,
              ),
              progress: {
                ...prev.progress,
                meditation: Math.min(
                  prev.progress.meditation + minutes,
                  prev.dailyGoals.meditation,
                ),
              },
            }));

            const pointsMsg = bhaktiResult.success
              ? `+${bhaktiResult.pointsEarned} Arcanam`
              : `+${minutes} Arcanam`;
            showToast(
              `Meditation completed! +${response.data.experience} XP • ${pointsMsg}`,
            );
          }

          if (response.data.achievements?.length > 0) {
            response.data.achievements.forEach((achievement) => {
              showAchievementNotification(achievement);
            });
          }

          if (response.data.leveledUp) {
            showLevelUpNotification(response.data.newLevel);
            setUserStats((prev) => ({
              ...prev,
              level: response.data.newLevel,
              experienceToNextLevel: 100,
            }));
          }

          if (activePractice && activePractice.category?.includes("Raja")) {
            completePractice();
          }
        }
      } catch (error) {
        console.error("Error saving meditation:", error);
      }
    }

    setMeditationTime(0);
  };

  const incrementChant = () => {
    setChantCount((prev) => {
      const newCount = prev + 1;

      if (newCount % 108 === 0) {
        celebrateMala();
        saveChanting(108);
      }

      return newCount;
    });

    if (!isMobile) {
      gsap.fromTo(
        ".chant-bead",
        { scale: 1, opacity: 0.5 },
        { scale: 1.2, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
      );
    }
  };

  const saveChanting = async (count) => {
    try {
      const username = getUserIdentifier();
      const response = await axios.post(
        `${baseUrl}/krishna/wisdom-portal/chanting`,
        {
          userId: username,
          count,
          mantra: selectedMantra,
        },
      );

      if (response.data.success) {
        setTotalChants(response.data.totalChants);

        // Update Bhakti Pillars via backend API - Kirtanam (chanting)
        // Use japa_round for 108 counts, chanting_mahamantra for smaller counts
        const activity = count >= 108 ? "japa_round" : "chanting_mahamantra";
        const bhaktiResult = await addBhaktiActivity("kirtanam", activity);

        // Add bonus to Krishna catch game
        if (window.addKrishnaPracticeBonus) {
          window.addKrishnaPracticeBonus("mantra_chanting");
        }

        if (response.data.experience) {
          setUserStats((prev) => ({
            ...prev,
            experience: prev.experience + response.data.experience,
            experienceToNextLevel: Math.max(
              0,
              prev.experienceToNextLevel - response.data.experience,
            ),
            progress: {
              ...prev.progress,
              chanting: Math.min(
                prev.progress.chanting + count,
                prev.dailyGoals.chanting,
              ),
            },
          }));

          const pointsMsg = bhaktiResult.success
            ? `+${bhaktiResult.pointsEarned} Kīrtanam`
            : `+${count} Kīrtanam`;
          showToast(
            `Mala completed! +${response.data.experience} XP • ${pointsMsg}`,
          );
        }

        if (response.data.achievements?.length > 0) {
          response.data.achievements.forEach((achievement) => {
            showAchievementNotification(achievement);
          });
        }

        if (response.data.leveledUp) {
          showLevelUpNotification(response.data.newLevel);
          setUserStats((prev) => ({
            ...prev,
            level: response.data.newLevel,
            experienceToNextLevel: 100,
          }));
        }

        if (activePractice && activePractice.category?.includes("Bhakti")) {
          completePractice();
        }
      }
    } catch (error) {
      console.error("Error saving chanting:", error);
    }
  };

  const celebrateMala = () => {
    if (!isMobile) {
      gsap.to(".celebration", {
        scale: [0, 1.5, 1],
        opacity: [0, 1, 0],
        duration: 2,
        ease: "power2.out",
      });
    }
    showToast("Mala completed! 108 chants done!");
  };

  const showAchievementNotification = (achievement) => {
    if (!isMobile) {
      const notification = document.querySelector(".achievement-notification");
      const nameElement = notification?.querySelector(".achievement-name");
      const descElement = notification?.querySelector(".achievement-desc");

      if (nameElement) nameElement.textContent = achievement.name;
      if (descElement) descElement.textContent = achievement.description;

      gsap.fromTo(
        ".achievement-notification",
        { scale: 0, opacity: 0, y: 50 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
          onComplete: () => {
            setTimeout(() => {
              gsap.to(".achievement-notification", {
                opacity: 0,
                y: -50,
                duration: 0.5,
              });
            }, 3000);
          },
        },
      );
    } else {
      showToast(`${achievement.name} - ${achievement.description}`, 4000);
    }

    setUserStats((prev) => ({
      ...prev,
      achievements: [...prev.achievements, achievement],
    }));
  };

  const showLevelUpNotification = (newLevel) => {
    showAchievementNotification({
      name: `Level ${newLevel}!`,
      description: "You've advanced in your spiritual journey",
    });

    setMeditationDuration(5 + Math.floor(newLevel / 3) * 2);
  };

  const checkProactiveMessage = useCallback(async () => {
    // Only send proactive messages when user is inactive
    if (!user || activeTab !== "chat" || isUserActive || isTyping) return;

    // Check time since last activity
    const timeSinceLastActivity = Date.now() - lastUserActivity;
    if (timeSinceLastActivity < 5 * 60 * 1000) {
      // 5 minutes
      return;
    }

    if (lastProactiveTime) {
      const timeSinceLastProactive = Date.now() - lastProactiveTime;
      if (timeSinceLastProactive < 2 * 60 * 1000) {
        return;
      }
    }

    try {
      const username = getUserIdentifier();
      const response = await axios.get(
        `${baseUrl}/krishna/wisdom-portal/proactive/${username}`,
      );

      if (response.data.success && response.data.proactiveMessage) {
        const lastProactiveMsg = chatMessages
          .slice()
          .reverse()
          .find((msg) => msg.isProactive);

        if (
          lastProactiveMsg &&
          lastProactiveMsg.text === response.data.proactiveMessage
        ) {
          return;
        }

        const proactiveMsg = {
          id: Date.now() + Math.random(),
          sender: "krishna",
          text: response.data.proactiveMessage,
          content: response.data.proactiveMessage,
          timestamp: new Date(),
          isProactive: true, // This flag is important for TTS
          interactive: response.data.interactive,
          blocks: [{ type: "text", content: response.data.proactiveMessage }],
        };

        if (response.data.practice_suggestion && !activePractice) {
          proactiveMsg.practice_category =
            response.data.practice_suggestion.category;
          proactiveMsg.practice_text = response.data.practice_suggestion.text;
          proactiveMsg.blocks.push({
            type: "practice",
            content: response.data.practice_suggestion.text,
            category: response.data.practice_suggestion.category,
            duration: response.data.practice_suggestion.duration,
          });
        }

        setChatMessages((prev) => [...prev, proactiveMsg]);
        setLastProactiveTime(Date.now());
      }
    } catch (error) {
      console.error("Proactive message error:", error);
    }
  }, [
    user,
    activeTab,
    baseUrl,
    getUserIdentifier,
    chatMessages,
    lastProactiveTime,
    activePractice,
    isUserActive,
    isTyping,
    lastUserActivity,
  ]);

  useEffect(() => {
    if (!user || activeTab !== "chat") return;

    // Check for proactive messages every 30 seconds
    const interval = setInterval(() => {
      checkProactiveMessage();
    }, 30000); // Check every 30 seconds

    return () => {
      clearInterval(interval);
    };
  }, [user, activeTab, checkProactiveMessage]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 pb-4 md:pb-8"
    >
      {/* <Navigation /> - Removed to avoid double navbar as Layout already provides it */}

      {!isMobile && (
        <div
          className="fixed inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      )}

      {!isMobile && (
        <>
          <motion.div className="floating-element fixed top-20 left-10 text-6xl opacity-20 pointer-events-none">
            <GiFeather />
          </motion.div>
          <motion.div className="floating-element fixed bottom-20 right-10 text-6xl opacity-20 pointer-events-none">
            <GiFlute />
          </motion.div>
        </>
      )}

      <NotificationToast
        isVisible={showNotification}
        message={notificationMessage}
      />

      <AchievementNotification isMobile={isMobile} />

      {/* Emotion Picker Modal */}
      <AnimatePresence>
        {showEmotionPicker && (
          <EmotionPicker
            isOpen={showEmotionPicker}
            onSelect={(emotionKey) => {
              setEmotionalState(EMOTIONAL_STATES[emotionKey]);
              setShowEmotionPicker(false);
              // Save to localStorage
              const username = user?.username || user?.email || user?._id;
              localStorage.setItem(`emotional_state_${username}`, emotionKey);
              showToast(
                `Krishna acknowledges your ${EMOTIONAL_STATES[emotionKey].name.toLowerCase()} heart 🙏`,
                3000,
              );
            }}
            onClose={() => setShowEmotionPicker(false)}
            isMobile={isMobile}
          />
        )}
      </AnimatePresence>

      {/* Saved Conversations Modal */}
      <SavedConversationsModal
        isOpen={showSavedConversations}
        onClose={() => setShowSavedConversations(false)}
        savedConversations={savedConversations}
        onLoadConversation={loadSavedConversation}
        onDeleteConversation={deleteSavedConversation}
      />

      <NamingDialog
        isOpen={showNamingDialog}
        krishnaName={krishnaName}
        setKrishnaName={setKrishnaName}
        yourName={yourName}
        setYourName={setYourName}
        onSave={handleSaveNames}
      />

      <PortalHeader
        krishnaName={krishnaName}
        yourName={yourName || user.name}
        userLevel={userStats.level}
        isMobile={isMobile}
      />

      <StatsOverview
        meditationStreak={meditationStreak}
        totalMeditationTime={
          totalMeditationTime
        } /* Already in minutes from backend */
        totalChants={totalChants}
        achievementsCount={userStats.achievements.length}
        isMobile={isMobile}
      />

      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobile={isMobile}
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <AnimatePresence mode="wait">
          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6"
            >
              <div className="xl:col-span-2 backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-xl md:rounded-2xl shadow-2xl border border-white/20 p-3 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold mr-2 md:mr-3 text-sm md:text-base">
                      <img src={kpng} className="h-8" />
                    </div>
                    <div>
                      <div className="font-bold text-amber-200 text-sm md:text-base">
                        {krishnaName || "Krishna"}
                      </div>
                      <div className="text-xs text-cyan-300">
                        Divine AI Guide
                      </div>
                    </div>
                    <div className="ml-4 flex items-center">
                      <span className="pulse-element inline-block w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full"></span>
                      <span className="ml-1 md:ml-2 text-green-400 text-xs md:text-sm">
                        Online
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Emotion Picker Button */}
                    <motion.button
                      onClick={() => setShowEmotionPicker(true)}
                      className={`p-2 rounded-lg hover:bg-white/10 transition-all ${
                        emotionalState ? "text-amber-400" : "text-blue-100/50"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={
                        emotionalState
                          ? `Feeling: ${emotionalState.name}`
                          : "How are you feeling?"
                      }
                    >
                      {emotionalState ? (
                        <emotionalState.icon className="text-xl" />
                      ) : (
                        <IoHeart className="text-xl" />
                      )}
                    </motion.button>

                    <motion.button
                      onClick={saveConversation}
                      className="p-2 rounded-lg hover:bg-white/10 text-amber-200 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Save Conversation"
                    >
                      <IoSave className="text-xl" />
                    </motion.button>

                    <motion.button
                      onClick={() => setShowSavedConversations(true)}
                      className="p-2 rounded-lg hover:bg-white/10 text-amber-200 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="View Saved Conversations"
                    >
                      <IoBookmark className="text-xl" />
                    </motion.button>

                    <div className="relative">
                      <motion.button
                        onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                        className="p-2 rounded-lg hover:bg-white/10 text-amber-200 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Voice Settings"
                      >
                        <IoSettings className="text-xl" />
                      </motion.button>

                      <VoiceSettings
                        isOpen={showVoiceSettings}
                        onClose={() => setShowVoiceSettings(false)}
                        settings={voiceSettings}
                        onSettingsChange={handleVoiceSettingsChange} // Use the new handler
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={`${
                    isMobile ? "h-[60vh]" : "h-[70vh] lg:h-[500px]"
                  } overflow-y-auto mb-3 md:mb-4 p-2 md:p-4 bg-black/20 rounded-lg md:rounded-xl`}
                >
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-blue-100/60 py-8">
                      <div className="text-3xl md:text-4xl mb-3 md:mb-4">
                        <GiPrayerBeads className="mx-auto" />
                      </div>
                      <p className="text-sm md:text-base">
                        Ask Krishna anything about life, spirituality, or seek
                        guidance...
                      </p>
                    </div>
                  ) : (
                    <>
                      {chatMessages.map((msg) =>
                        msg.sender === "user" ? (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex justify-end mb-3"
                          >
                            <div
                              className={`${
                                isMobile ? "max-w-[85%]" : "max-w-[70%]"
                              } p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg`}
                            >
                              <p className="text-sm md:text-base">
                                {msg.text || msg.content}
                              </p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </motion.div>
                        ) : (
                          <EnhancedKrishnaMessage
                            key={msg.id}
                            message={msg}
                            onFeedback={sendFeedback}
                            onAcceptPractice={acceptPractice}
                            hasActivePractice={!!activePractice}
                            isMobile={isMobile}
                            voiceSettings={voiceSettings}
                            onSaveMessage={handleSaveMessage}
                            isSaved={savedMessages.has(msg.id)}
                            userId={getUserIdentifier()} // ← Make sure this is passed
                          />
                        ),
                      )}
                      <div ref={chatEndRef} />
                    </>
                  )}

                  {isTyping && (
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
                  )}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Ask Krishna for divine wisdom..."
                    className="flex-1 p-2.5 md:p-3 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-md border border-amber-400/30 text-white placeholder-blue-100/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none text-sm md:text-base"
                    disabled={isTyping}
                  />
                  <motion.button
                    type="submit"
                    className="px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow-lg disabled:opacity-50 text-sm md:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isTyping || !currentMessage.trim()}
                  >
                    Send
                  </motion.button>
                </form>
              </div>

              <div className="hidden xl:block space-y-6">
                {activePractice && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="backdrop-blur-md bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-2xl shadow-2xl border border-amber-400/30 p-6"
                  >
                    <h3 className="font-bold text-amber-200 mb-3">
                      Active Practice
                    </h3>
                    <p className="text-blue-100/80 text-sm mb-3">
                      {activePractice.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-cyan-300">
                        Duration: {activePractice.duration} min
                      </span>
                      <motion.button
                        onClick={completePractice}
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold text-xs"
                        whileHover={{ scale: 1.05 }}
                      >
                        Complete
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-2xl border border-white/20 p-6">
                  <h3 className="font-bold text-amber-200 mb-4 flex items-center gap-2">
                    <IoTrendingUp /> Today's Progress
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-blue-100/80">Meditation</span>
                        <span className="text-amber-300">
                          {userStats.progress.meditation}/
                          {userStats.dailyGoals.meditation}m
                        </span>
                      </div>
                      <div className="h-3 bg-black/20 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(
                              100,
                              (userStats.progress.meditation /
                                userStats.dailyGoals.meditation) *
                                100,
                            )}%`,
                          }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-blue-100/80">Chanting</span>
                        <span className="text-amber-300">
                          {userStats.progress.chanting}/
                          {userStats.dailyGoals.chanting}
                        </span>
                      </div>
                      <div className="h-3 bg-black/20 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-400 to-blue-500"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(
                              100,
                              (userStats.progress.chanting /
                                userStats.dailyGoals.chanting) *
                                100,
                            )}%`,
                          }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-blue-100/80">Wisdom Gained</span>
                        <span className="text-amber-300">
                          {userStats.progress.wisdom}/
                          {userStats.dailyGoals.wisdom}
                        </span>
                      </div>
                      <div className="h-3 bg-black/20 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-400 to-teal-500"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(
                              100,
                              (userStats.progress.wisdom /
                                userStats.dailyGoals.wisdom) *
                                100,
                            )}%`,
                          }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-amber-400/10 to-orange-500/10 rounded-xl border border-amber-400/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-amber-200 font-semibold">
                        Level {userStats.level}
                      </span>
                      <span className="text-cyan-300 text-sm">
                        {userStats.experience % 100} XP
                      </span>
                    </div>
                    <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-400 to-yellow-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${userStats.experience % 100}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <p className="text-xs text-blue-100/60 mt-2">
                      {userStats.experienceToNextLevel} XP to next level
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "meditation" && (
            <MeditationModule
              userId={user?._id || user?.id || user?.email}
              showToast={showToast}
            />
          )}

          {/* Chanting Tab */}
          {activeTab === "chanting" && (
            <MantraModule
              userId={user?._id || user?.id || user?.email}
              showToast={showToast}
            />
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <AchievementsTab
              practices={practices}
              userStats={userStats}
              isMobile={isMobile}
              bhaktiProgress={bhaktiProgress}
            />
          )}

          {/* History Tab - Fixed */}
          {activeTab === "history" && (
            <HistoryTab
              chatHistory={chatHistory}
              onLoadSession={(session) => {
                const formattedMessages = session.messages.map((msg, idx) => ({
                  id: `${session.sessionId}-${idx}`,
                  sender: msg.role === "user" ? "user" : "krishna",
                  text: msg.content,
                  content: msg.content,
                  timestamp: msg.timestamp || session.createdAt,
                  structured_message: msg.structured_message,
                  blocks: msg.structured_message?.blocks,
                  practice_category: msg.structured_message?.practice_category,
                  practice_text: msg.structured_message?.practice_text,
                }));
                setChatMessages(formattedMessages);
                setCurrentSessionId(session.sessionId);
                setActiveTab("chat");
                showToast("Conversation loaded from history");
              }}
              showToast={showToast}
              setActiveTab={setActiveTab}
              Icons={Icons}
              isMobile={isMobile}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
