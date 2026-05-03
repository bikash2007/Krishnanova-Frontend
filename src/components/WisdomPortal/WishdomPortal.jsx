import React, { useEffect, useState, useRef, useCallback, Suspense, lazy } from "react";
import { AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import kpng from "../../Media/k.webp";

// Layout Components
import PortalHeader from "./components/Layout/PortalHeader";
import StatsOverview from "./components/Layout/StatsOverview";
import TabNavigation from "./components/Layout/TabNavigation";
import NamingDialog from "./components/Layout/NamingDialog";

// Shared Components
import NotificationToast from "./components/Shared/NotificationToast";
import AchievementNotification from "./components/Shared/AchievementNotification";
import {
  SafeMotionDiv,
  SafeMotionButton,
} from "./components/Shared/SafeMotion";
import {
  EmotionPicker,
  EMOTIONAL_STATES,
} from "./components/Shared/SmartPresence";
import VoiceSettings from "./components/Shared/VoiceSettings";
import SavedConversationsModal from "./components/Shared/SavedConversationsModal";

// Chat Components
import EnhancedKrishnaMessage from "./components/Chat/EnhancedKrishnaMessage";

// Tab Components
const AchievementsTab = lazy(() => import("./components/Progress/AchievementsTab"));
const HistoryTab = lazy(() => import("./components/History/HistoryTab"));
const MeditationModule = lazy(() => import("./components/Meditation/MeditationModule"));
const MantraModule = lazy(() => import("./components/Mantra/MantraModule"));

const TabSkeleton = () => (
  <div className="w-full h-full min-h-[60vh] animate-pulse bg-white/5 rounded-2xl border border-white/10 flex flex-col p-6 mt-4">
    <div className="h-8 bg-white/10 rounded w-1/4 mb-8"></div>
    <div className="flex-1 space-y-4">
      <div className="h-24 bg-white/5 rounded-xl"></div>
      <div className="h-24 bg-white/5 rounded-xl"></div>
      <div className="h-24 bg-white/5 rounded-xl"></div>
    </div>
  </div>
);

// Icons — only those actually used in the main component
import { FaOm } from "react-icons/fa";
import { MdHistory } from "react-icons/md";
import {
  IoFlame,
  IoHeart,
  IoBookmark,
  IoSettings,
  IoTrendingUp,
  IoSave,
  IoAdd,
} from "react-icons/io5";
import { GiPrayerBeads, GiFlute, GiFeather } from "react-icons/gi";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Icons object passed as prop to HistoryTab
const Icons = {
  om: <FaOm />,
  history: <MdHistory />,
  chanting: <GiPrayerBeads />,
  streak: <IoFlame />,
  peacock: <GiFeather />,
};

// Main WishdomPortal Component
export default function WishdomPortal() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "chat",
  );
  const [currentSessionId, setCurrentSessionId] = useState(
    Date.now().toString(),
  );
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

  // Meditation & Chanting stats (used by StatsOverview)
  const [totalMeditationTime, setTotalMeditationTime] = useState(
    user?.wisdomPortal?.stats?.totalMeditationTime || 0,
  );
  const [meditationStreak, setMeditationStreak] = useState(
    user?.wisdomPortal?.stats?.meditationStreak || 0,
  );
  const [meditationDuration, setMeditationDuration] = useState(5);
  const [totalChants, setTotalChants] = useState(
    user?.wisdomPortal?.stats?.totalChants || 0,
  );

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
              // Backend returns objects like { sravanam: { progress: 50, ... } }
              // Extract just the progress numbers
              setBhaktiProgress({
                sravanam:
                  typeof backendProgress.sravanam === "object"
                    ? backendProgress.sravanam?.progress || 0
                    : backendProgress.sravanam || 0,
                kirtanam:
                  typeof backendProgress.kirtanam === "object"
                    ? backendProgress.kirtanam?.progress || 0
                    : backendProgress.kirtanam || 0,
                smaranam:
                  typeof backendProgress.smaranam === "object"
                    ? backendProgress.smaranam?.progress || 0
                    : backendProgress.smaranam || 0,
                archanam:
                  typeof backendProgress.archanam === "object"
                    ? backendProgress.archanam?.progress || 0
                    : backendProgress.archanam || 0,
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
                    "Your return is remembered • +1 Smaraṇam",
                  3000,
                );
              }, 2000);
            }
          }
        } catch (checkInError) {
          console.log("Daily check-in skipped:", checkInError.message);
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

          // Only restore the last session if it's from today;
          // otherwise start a fresh conversation each day
          if (
            activeTab === "chat" &&
            chatMessages.length === 0 &&
            data.chatHistory[0]
          ) {
            const lastSession = data.chatHistory[0];
            const sessionDate = new Date(
              lastSession.updatedAt || lastSession.createdAt,
            );
            const today = new Date();
            const isToday =
              sessionDate.getFullYear() === today.getFullYear() &&
              sessionDate.getMonth() === today.getMonth() &&
              sessionDate.getDate() === today.getDate();

            if (isToday) {
              const formattedMessages = lastSession.messages.map(
                (msg, idx) => ({
                  id: `${lastSession.sessionId}-${idx}`,
                  sender: msg.role === "user" ? "user" : "krishna",
                  text: msg.content,
                  content: msg.content,
                  timestamp: msg.timestamp || lastSession.createdAt,
                  structured_message: msg.structured_message,
                  blocks: msg.structured_message?.blocks,
                  practice_category: msg.structured_message?.practice_category,
                  practice_text: msg.structured_message?.practice_text,
                }),
              );
              setChatMessages(formattedMessages);
              setCurrentSessionId(lastSession.sessionId);
            }
            // If not today, chat stays empty → fresh conversation
          }
        }
      }
    } catch (error) {
      console.error("Error loading portal data:", error);
      if (error.response?.status === 404) {
        setShowNamingDialog(true);
      }
    } finally {
      // Data loading complete
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
          actualDuration: activePractice.duration || 0,
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

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <SafeMotionDiv
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
          <SafeMotionDiv className="floating-element fixed top-20 left-10 text-6xl opacity-20 pointer-events-none">
            <GiFeather />
          </SafeMotionDiv>
          <SafeMotionDiv className="floating-element fixed bottom-20 right-10 text-6xl opacity-20 pointer-events-none">
            <GiFlute />
          </SafeMotionDiv>
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
                `Krishna acknowledges your ${EMOTIONAL_STATES[emotionKey].name.toLowerCase()} heart`,
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

      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
        <AnimatePresence mode="wait">
          {activeTab === "chat" && (
            <SafeMotionDiv
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-3 lg:gap-5"
            >
              <div className="xl:col-span-2 backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl border border-white/20 p-2 sm:p-3 md:p-5">
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div className="flex items-center">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold mr-2 text-xs sm:text-sm md:text-base">
                      <img src={kpng} className="h-6 sm:h-7 md:h-8" />
                    </div>
                    <div>
                      <div className="font-bold text-amber-200 text-xs sm:text-sm md:text-base">
                        {krishnaName || "Krishna"}
                      </div>
                      <div className="text-[10px] sm:text-xs text-cyan-300">
                        Divine AI Guide
                      </div>
                    </div>
                    <div className="ml-2 sm:ml-4 flex items-center">
                      <span className="pulse-element inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-green-400 rounded-full"></span>
                      <span className="ml-1 text-green-400 text-[10px] sm:text-xs md:text-sm">
                        Online
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* New Chat Button */}
                    {chatMessages.length > 0 && (
                      <SafeMotionButton
                        onClick={() => {
                          setChatMessages([]);
                          setCurrentSessionId(Date.now().toString());
                          showToast("New conversation started");
                        }}
                        className="p-2 rounded-lg hover:bg-white/10 text-green-300/70 hover:text-green-300 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Start New Chat"
                      >
                        <IoAdd className="text-xl" />
                      </SafeMotionButton>
                    )}

                    {/* Emotion Picker Button */}
                    <SafeMotionButton
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
                    </SafeMotionButton>

                    <SafeMotionButton
                      onClick={saveConversation}
                      className="p-2 rounded-lg hover:bg-white/10 text-amber-200 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Save Conversation"
                    >
                      <IoSave className="text-xl" />
                    </SafeMotionButton>

                    <SafeMotionButton
                      onClick={() => setShowSavedConversations(true)}
                      className="p-2 rounded-lg hover:bg-white/10 text-amber-200 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="View Saved Conversations"
                    >
                      <IoBookmark className="text-xl" />
                    </SafeMotionButton>

                    <div className="relative">
                      <SafeMotionButton
                        onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                        className="p-2 rounded-lg hover:bg-white/10 text-amber-200 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Voice Settings"
                      >
                        <IoSettings className="text-xl" />
                      </SafeMotionButton>

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
                    isMobile
                      ? "h-[calc(var(--app-height)*0.55)]"
                      : "h-[calc(var(--app-height)-420px)] min-h-[350px] max-h-[600px]"
                  } overflow-y-auto mb-2 md:mb-3 p-2 sm:p-3 md:p-4 bg-black/20 rounded-md sm:rounded-lg md:rounded-xl`}
                >
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-blue-100/60 py-6 md:py-8">
                      <div className="text-2xl sm:text-3xl md:text-4xl mb-2 md:mb-4">
                        <GiPrayerBeads className="mx-auto" />
                      </div>
                      <p className="text-xs sm:text-sm md:text-base">
                        Ask Krishna anything about life, spirituality, or seek
                        guidance...
                      </p>
                    </div>
                  ) : (
                    <>
                      {chatMessages.map((msg) =>
                        msg.sender === "user" ? (
                          <SafeMotionDiv
                            key={msg.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex justify-end mb-2 sm:mb-3"
                          >
                            <div
                              className={`${
                                isMobile ? "max-w-[90%]" : "max-w-[75%]"
                              } p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg`}
                            >
                              <p className="text-xs sm:text-sm md:text-base">
                                {msg.text || msg.content}
                              </p>
                              <p className="text-[10px] sm:text-xs opacity-70 mt-0.5 sm:mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </SafeMotionDiv>
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
                      <div className="bg-gradient-to-r from-purple-400/20 to-blue-500/20 text-blue-100 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl md:rounded-2xl border border-purple-400/30">
                        <SafeMotionDiv
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-xs sm:text-sm md:text-base"
                        >
                          Krishna is typing...
                        </SafeMotionDiv>
                      </div>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex gap-1.5 sm:gap-2"
                >
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Ask Krishna for divine wisdom..."
                    className="flex-1 p-2 sm:p-2.5 md:p-3 rounded-md sm:rounded-lg md:rounded-xl bg-white/10 backdrop-blur-md border border-amber-400/30 text-white placeholder-blue-100/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none text-xs sm:text-sm md:text-base"
                    disabled={isTyping}
                  />
                  <SafeMotionButton
                    type="submit"
                    className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-md sm:rounded-lg md:rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow-lg disabled:opacity-50 text-xs sm:text-sm md:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isTyping || !currentMessage.trim()}
                  >
                    Send
                  </SafeMotionButton>
                </form>
              </div>

              <div className="hidden xl:block space-y-4">
                {activePractice && (
                  <SafeMotionDiv
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="backdrop-blur-md bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-xl shadow-2xl border border-amber-400/30 p-4"
                  >
                    <h3 className="font-bold text-amber-200 mb-2 text-sm">
                      Active Practice
                    </h3>
                    <p className="text-blue-100/80 text-xs mb-2">
                      {activePractice.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-cyan-300">
                        Duration: {activePractice.duration} min
                      </span>
                      <SafeMotionButton
                        onClick={completePractice}
                        className="px-2 py-1 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold text-xs"
                        whileHover={{ scale: 1.05 }}
                      >
                        Complete
                      </SafeMotionButton>
                    </div>
                  </SafeMotionDiv>
                )}

                <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-xl shadow-2xl border border-white/20 p-4">
                  <h3 className="font-bold text-amber-200 mb-3 flex items-center gap-2 text-sm">
                    <IoTrendingUp /> Today's Progress
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-blue-100/80">Meditation</span>
                        <span className="text-amber-300">
                          {userStats.progress.meditation}/
                          {userStats.dailyGoals.meditation}m
                        </span>
                      </div>
                      <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                        <SafeMotionDiv
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
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-blue-100/80">Chanting</span>
                        <span className="text-amber-300">
                          {userStats.progress.chanting}/
                          {userStats.dailyGoals.chanting}
                        </span>
                      </div>
                      <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                        <SafeMotionDiv
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
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-blue-100/80">Wisdom Gained</span>
                        <span className="text-amber-300">
                          {userStats.progress.wisdom}/
                          {userStats.dailyGoals.wisdom}
                        </span>
                      </div>
                      <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                        <SafeMotionDiv
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

                  <div className="mt-4 p-3 bg-gradient-to-r from-amber-400/10 to-orange-500/10 rounded-lg border border-amber-400/30">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-amber-200 font-semibold text-xs">
                        Level {userStats.level}
                      </span>
                      <span className="text-cyan-300 text-xs">
                        {userStats.experience % 100} XP
                      </span>
                    </div>
                    <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                      <SafeMotionDiv
                        className="h-full bg-gradient-to-r from-amber-400 to-yellow-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${userStats.experience % 100}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <p className="text-[10px] text-blue-100/60 mt-1.5">
                      {userStats.experienceToNextLevel} XP to next level
                    </p>
                  </div>
                </div>
              </div>
            </SafeMotionDiv>
          )}

          {activeTab === "meditation" && (
            <Suspense fallback={<TabSkeleton />}>
              <MeditationModule
                userId={user?._id || user?.id || user?.email}
                showToast={showToast}
              />
            </Suspense>
          )}

          {/* Chanting Tab */}
          {activeTab === "chanting" && (
            <Suspense fallback={<TabSkeleton />}>
              <MantraModule
                userId={user?._id || user?.id || user?.email}
                showToast={showToast}
              />
            </Suspense>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <Suspense fallback={<TabSkeleton />}>
              <AchievementsTab
                practices={practices}
                userStats={userStats}
                isMobile={isMobile}
                bhaktiProgress={bhaktiProgress}
              />
            </Suspense>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <Suspense fallback={<TabSkeleton />}>
              <HistoryTab
                chatHistory={chatHistory}
                onContinueSession={(session) => {
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
                  showToast("Continuing conversation — Krishna remembers the context");
                }}
                onDeleteSession={async (sessionId) => {
                  try {
                    const username = getUserIdentifier();
                    await axios.delete(
                      `${baseUrl}/krishna/wisdom-portal/history/${username}/${sessionId}`,
                    );
                    setChatHistory((prev) =>
                      prev.filter((s) => s.sessionId !== sessionId),
                    );
                    showToast("Conversation deleted");
                  } catch (error) {
                    console.error("Error deleting session:", error);
                    showToast("Failed to delete conversation");
                  }
                }}
                isMobile={isMobile}
              />
            </Suspense>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
