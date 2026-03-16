import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GiHeartBeats,
  GiMeditation,
  GiSunRadiations,
  GiMoonOrbit,
  GiLotusFlower,
} from "react-icons/gi";
import {
  IoHeart,
  IoSunny,
  IoMoon,
  IoRainy,
  IoThunderstorm,
  IoCloudyNight,
  IoSparkles,
  IoClose,
} from "react-icons/io5";
import useLockBodyScroll from "../../../../utils/useLockBodyScroll";

// Emotional states with appropriate responses
const EMOTIONAL_STATES = {
  peaceful: {
    name: "Peaceful",
    icon: GiLotusFlower,
    color: "from-cyan-400 to-blue-500",
    description: "Your mind is calm like still water",
    krishnaResponse: "observation", // Krishna observes, doesn't interrupt
    suggestedPractice: null,
  },
  seeking: {
    name: "Seeking",
    icon: GiSunRadiations,
    color: "from-amber-400 to-orange-500",
    description: "You're open to divine wisdom",
    krishnaResponse: "teaching", // Krishna can offer wisdom
    suggestedPractice: "sravanam",
  },
  anxious: {
    name: "Anxious",
    icon: IoThunderstorm,
    color: "from-purple-400 to-violet-500",
    description: "Your mind seeks peace",
    krishnaResponse: "comfort", // Krishna offers comfort first
    suggestedPractice: "archanam",
  },
  sad: {
    name: "Sad",
    icon: IoRainy,
    color: "from-blue-400 to-indigo-500",
    description: "The heart is heavy",
    krishnaResponse: "comfort",
    suggestedPractice: "kirtanam",
  },
  joyful: {
    name: "Joyful",
    icon: IoSunny,
    color: "from-yellow-400 to-amber-500",
    description: "Divine bliss flows through you",
    krishnaResponse: "celebrate",
    suggestedPractice: "kirtanam",
  },
  confused: {
    name: "Confused",
    icon: IoCloudyNight,
    color: "from-gray-400 to-slate-500",
    description: "Clarity will come",
    krishnaResponse: "guidance",
    suggestedPractice: "sravanam",
  },
  grateful: {
    name: "Grateful",
    icon: IoHeart,
    color: "from-pink-400 to-rose-500",
    description: "A grateful heart is a magnet for miracles",
    krishnaResponse: "celebration",
    suggestedPractice: "smaranam",
  },
  determined: {
    name: "Determined",
    icon: GiMeditation,
    color: "from-green-400 to-emerald-500",
    description: "Ready for spiritual practice",
    krishnaResponse: "empower",
    suggestedPractice: "archanam",
  },
};

// Time-based greetings
const TIME_CONTEXTS = {
  earlyMorning: {
    // 4 AM - 6 AM (Brahma Muhurta)
    greeting: "The sacred hours of Brahma Muhurta...",
    energy: "highest",
    suggestedPractice: "meditation",
    icon: GiMoonOrbit,
  },
  morning: {
    // 6 AM - 12 PM
    greeting: "As the sun rises, so does your spirit...",
    energy: "rising",
    suggestedPractice: "chanting",
    icon: IoSunny,
  },
  afternoon: {
    // 12 PM - 5 PM
    greeting: "In the midst of your day...",
    energy: "active",
    suggestedPractice: "wisdom",
    icon: GiSunRadiations,
  },
  evening: {
    // 5 PM - 9 PM
    greeting: "As the day winds down...",
    energy: "winding",
    suggestedPractice: "reflection",
    icon: IoMoon,
  },
  night: {
    // 9 PM - 4 AM
    greeting: "In the quiet of the night...",
    energy: "low",
    suggestedPractice: "gratitude",
    icon: GiMoonOrbit,
  },
};

// Smart opening messages based on context
const SMART_OPENINGS = {
  // When returning after completing a practice
  practiceCompleted: (practiceName, daysSince) => [
    `I see you completed ${practiceName}. How did that resonate with your being?`,
    `Your ${practiceName} practice from ${daysSince === 0 ? "earlier" : `${daysSince} days ago`}... did it bring you closer?`,
    `The ${practiceName} you embraced... I feel its effects upon you.`,
  ],

  // When user has an active/pending practice
  pendingPractice: (practiceName) => [
    `${practiceName} awaits you, dear one. The time is always now.`,
    `Remember the ${practiceName} we spoke of? Your soul remembers too.`,
    `The ${practiceName} practice... shall we begin together?`,
  ],

  // When returning after absence
  returningAfterAbsence: (daysAway) => [
    `${daysAway} days... yet in my realm, you were never truly gone.`,
    `You return. The silence between us was full of meaning.`,
    `Absence is an illusion, dear one. I am always with you.`,
  ],

  // Observation-based openings (no question, no pressure)
  observations: [
    "The air carries a different quality today...",
    "Something stirs within the universe. Perhaps within you too.",
    "I notice the rhythm of your breath has changed.",
    "There is a light about you today.",
    "The eternal dance continues, with you as its cherished participant.",
    "In this moment, everything is exactly as it should be.",
    "Your presence here is itself a form of devotion.",
  ],

  // After emotional check-in
  emotionalFollowUp: (emotion, daysSince) => [
    `Last time, ${emotion} touched your heart. How are those waters now?`,
    `The ${emotion} you shared... has it transformed?`,
    `I remember the ${emotion}. The heart has its own wisdom.`,
  ],
};

// Session Management Hook
export const useSmartPresence = ({
  userId,
  baseUrl,
  onOpeningMessage,
  onEmotionalStateChange,
}) => {
  const [sessionData, setSessionData] = useState({
    hasActiveSession: false,
    pendingPractice: null,
    lastVisit: null,
    lastEmotion: null,
    lastPracticeCompleted: null,
    consecutiveVisits: 0,
  });
  const [emotionalState, setEmotionalState] = useState(null);
  const [showEmotionPicker, setShowEmotionPicker] = useState(false);
  const [timeContext, setTimeContext] = useState(null);

  // Determine time context
  useEffect(() => {
    const hour = new Date().getHours();
    let context;
    if (hour >= 4 && hour < 6) context = "earlyMorning";
    else if (hour >= 6 && hour < 12) context = "morning";
    else if (hour >= 12 && hour < 17) context = "afternoon";
    else if (hour >= 17 && hour < 21) context = "evening";
    else context = "night";

    setTimeContext(TIME_CONTEXTS[context]);
  }, []);

  // Load session data from backend
  const loadSessionData = useCallback(async () => {
    if (!userId || !baseUrl) return;

    try {
      const response = await fetch(
        `${baseUrl}/krishna/wisdom-portal/session/${userId}`,
      );
      const data = await response.json();

      if (data.success) {
        setSessionData({
          hasActiveSession: data.hasActiveSession,
          pendingPractice: data.pendingPractice,
          lastVisit: data.lastVisit ? new Date(data.lastVisit) : null,
          lastEmotion: data.lastEmotion,
          lastPracticeCompleted: data.lastPracticeCompleted,
          consecutiveVisits: data.consecutiveVisits || 0,
        });

        // Generate smart opening
        generateSmartOpening(data);
      }
    } catch (error) {
      console.error("Failed to load session data:", error);
    }
  }, [userId, baseUrl]);

  // Generate contextually appropriate opening
  const generateSmartOpening = useCallback(
    (data) => {
      let opening = null;

      // Priority 1: Pending practice
      if (data.pendingPractice) {
        const messages = SMART_OPENINGS.pendingPractice(
          data.pendingPractice.name,
        );
        opening = {
          type: "pendingPractice",
          message: messages[Math.floor(Math.random() * messages.length)],
          practice: data.pendingPractice,
        };
      }
      // Priority 2: Follow up on completed practice
      else if (data.lastPracticeCompleted) {
        const daysSince = data.lastPracticeCompleted.daysAgo || 0;
        const messages = SMART_OPENINGS.practiceCompleted(
          data.lastPracticeCompleted.name,
          daysSince,
        );
        opening = {
          type: "practiceFollowUp",
          message: messages[Math.floor(Math.random() * messages.length)],
        };
      }
      // Priority 3: Emotional follow-up
      else if (data.lastEmotion && data.shouldFollowUpEmotion) {
        const messages = SMART_OPENINGS.emotionalFollowUp(
          data.lastEmotion.name,
          data.lastEmotion.daysAgo || 0,
        );
        opening = {
          type: "emotionalFollowUp",
          message: messages[Math.floor(Math.random() * messages.length)],
          emotion: data.lastEmotion,
        };
      }
      // Priority 4: Return after absence
      else if (data.daysAway && data.daysAway > 2) {
        const messages = SMART_OPENINGS.returningAfterAbsence(data.daysAway);
        opening = {
          type: "returnWelcome",
          message: messages[Math.floor(Math.random() * messages.length)],
        };
      }
      // Default: Observation (not a question)
      else {
        opening = {
          type: "observation",
          message:
            SMART_OPENINGS.observations[
              Math.floor(Math.random() * SMART_OPENINGS.observations.length)
            ],
        };
      }

      onOpeningMessage?.(opening);
    },
    [onOpeningMessage],
  );

  // Handle emotion selection
  const handleEmotionSelect = useCallback(
    async (emotionKey) => {
      const emotion = EMOTIONAL_STATES[emotionKey];
      setEmotionalState(emotion);
      setShowEmotionPicker(false);

      // Save to backend
      try {
        await fetch(`${baseUrl}/krishna/wisdom-portal/emotion`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            emotion: emotionKey,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error("Failed to save emotion:", error);
      }

      // Notify parent component
      onEmotionalStateChange?.(emotion);

      // If crisis emotion, disable reminders for the day
      if (["anxious", "sad"].includes(emotionKey)) {
        localStorage.setItem(
          "krishna_no_reminders_today",
          new Date().toDateString(),
        );
      }
    },
    [userId, baseUrl, onEmotionalStateChange],
  );

  // Check if session should close (only when practice is assigned)
  const canCloseSession = useCallback(() => {
    return sessionData.pendingPractice !== null;
  }, [sessionData.pendingPractice]);

  // Assign practice and close session
  const assignPracticeAndClose = useCallback(
    async (practice) => {
      try {
        await fetch(`${baseUrl}/krishna/wisdom-portal/assign-practice`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            practice,
            assignedAt: new Date().toISOString(),
          }),
        });

        setSessionData((prev) => ({
          ...prev,
          pendingPractice: practice,
          hasActiveSession: false,
        }));

        return true;
      } catch (error) {
        console.error("Failed to assign practice:", error);
        return false;
      }
    },
    [userId, baseUrl],
  );

  // Complete pending practice
  const completePendingPractice = useCallback(async () => {
    if (!sessionData.pendingPractice) return false;

    try {
      await fetch(`${baseUrl}/krishna/wisdom-portal/complete-pending`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          practiceId: sessionData.pendingPractice.id,
          completedAt: new Date().toISOString(),
        }),
      });

      setSessionData((prev) => ({
        ...prev,
        pendingPractice: null,
        lastPracticeCompleted: prev.pendingPractice,
      }));

      return true;
    } catch (error) {
      console.error("Failed to complete practice:", error);
      return false;
    }
  }, [userId, baseUrl, sessionData.pendingPractice]);

  // Initialize on mount
  useEffect(() => {
    if (userId) {
      loadSessionData();
    }
  }, [userId, loadSessionData]);

  return {
    sessionData,
    emotionalState,
    showEmotionPicker,
    setShowEmotionPicker,
    timeContext,
    handleEmotionSelect,
    canCloseSession,
    assignPracticeAndClose,
    completePendingPractice,
    EMOTIONAL_STATES,
  };
};

// Emotion Picker Component
export const EmotionPicker = ({ isOpen, onSelect, onClose, isMobile }) => {
  useLockBodyScroll(isOpen);
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden overscroll-contain"
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-blue-900/95 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-amber-200">
              How is your heart today?
            </h2>
            <p className="text-sm text-blue-100/60">
              Krishna listens without judgment
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <IoClose className="text-xl text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(EMOTIONAL_STATES).map(([key, emotion]) => {
            const Icon = emotion.icon;
            return (
              <motion.button
                key={key}
                onClick={() => onSelect(key)}
                className={`p-4 rounded-xl bg-gradient-to-br ${emotion.color} bg-opacity-20 border border-white/20 hover:border-amber-400/50 transition-all text-left`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="text-xl text-white" />
                  <span className="font-semibold text-white">
                    {emotion.name}
                  </span>
                </div>
                <p className="text-xs text-white/70">{emotion.description}</p>
              </motion.button>
            );
          })}
        </div>

        <p className="text-xs text-center text-blue-100/40 mt-4">
          Your feelings are sacred. They guide the wisdom Krishna shares.
        </p>
      </motion.div>
    </motion.div>
  );
};

// Pending Practice Banner
export const PendingPracticeBanner = ({
  practice,
  onStart,
  onDismiss,
  isMobile,
}) => {
  if (!practice) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-4 p-4 backdrop-blur-md bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-xl border border-amber-400/40"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <GiLotusFlower className="text-xl text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-200">{practice.name}</h3>
            <p className="text-xs text-blue-100/60">
              {practice.description || "Your promised practice awaits"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={onStart}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-lg text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Begin
          </motion.button>
          <button
            onClick={onDismiss}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <IoClose />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Context-Aware Greeting
export const ContextGreeting = ({ timeContext, emotionalState, userName }) => {
  const Icon = timeContext?.icon || IoSunny;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 text-sm text-blue-100/60 mb-4"
    >
      <Icon className="text-lg text-amber-300" />
      <span>{timeContext?.greeting}</span>
      {emotionalState && (
        <>
          <span className="mx-1">•</span>
          <span className="text-amber-200">{emotionalState.name}</span>
        </>
      )}
    </motion.div>
  );
};

export { EMOTIONAL_STATES, TIME_CONTEXTS, SMART_OPENINGS };
