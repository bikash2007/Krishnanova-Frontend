import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import kpng from "../Media/k.png";
import laugh from "../Audio/laugh.mp3";
import { useApi } from "../Context/baseUrl";
// Import icons (you'll need to install these packages)
import {
  FaGamepad,
  FaChartBar,
  FaTrophy,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaPlay,
  FaCrown,
  FaMedal,
  FaAward,
  FaGem,
  FaClock,
  FaSync,
  FaChevronDown,
  FaChevronUp,
  FaBars,
} from "react-icons/fa";
import {
  IoGameController,
  IoStatsChart,
  IoTrophy,
  IoClose,
  IoPlay,
  IoTime,
  IoMenu,
} from "react-icons/io5";

const lessons = [
  "Do your duty, but don't concern yourself with the results.",
  "Calmness, gentleness, silence, self-restraint — these are virtues.",
  "Change is the law of the universe.",
  "A person is made by their faith.",
  "You are what you believe in.",
  "Be fearless and pure",
  "You came empty handed, you will leave empty handed.",
  "The soul is neither born, and nor does it die.",
  "Set thy heart upon thy work, but never on its reward.",
];

const teases = [
  "Too slow, devotee!",
  "You thought you had me?",
  "Try harder, mortal!",
  "Missed again!",
  "Catch me if you can!",
  "Not today!",
  "Almost there!",
  "Lightning fast!",
  "Divine speed!",
  "Om! Try again!",
];

const LuckyKrishna = () => {
  const navigate = useNavigate();
  const baseUrl = useApi();
  const { user, loading: authLoading } = useAuth();

  // Derived auth state from context
  const isAuthenticated = !!user;
  const currentUser = user;

  // **Core Game State**
  const [position, setPosition] = useState({ top: "50%", left: "50%" });
  const [successMessage, setSuccessMessage] = useState(null);
  const [tease, setTease] = useState("Catch Me If You Can");
  const [isScrolling, setIsScrolling] = useState(false);
  const [canAttempt, setCanAttempt] = useState(true);
  const [nextAttemptTime, setNextAttemptTime] = useState(null);
  const [difficulty, setDifficulty] = useState(1);
  const [consecutiveMisses, setConsecutiveMisses] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userKeychain, setUserKeychain] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);

  // **Mobile & Touch States**
  const [isMobile, setIsMobile] = useState(false);
  const [tapFeedback, setTapFeedback] = useState(null);
  const [practiceBonus, setPracticeBonus] = useState(0);
  const [showTapHint, setShowTapHint] = useState(true);
  const [nearMissStreak, setNearMissStreak] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  // **UI Control States**
  const [gameEnabled, setGameEnabled] = useState(() => {
    const saved = localStorage.getItem("krishna_game_enabled");
    return saved === "true";
  });

  const [showCompactHUD, setShowCompactHUD] = useState(() => {
    const saved = localStorage.getItem("krishna_hud_visible");
    return saved !== "false";
  });

  // **Menu States - Updated**
  const [showMenuExpanded, setShowMenuExpanded] = useState(false);
  const [menuTab, setMenuTab] = useState("stats");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState(null);

  // **Dashboard State - Simplified**
  const [showDashboard, setShowDashboard] = useState(false);

  // **Refs**
  const audioRef = useRef(null);
  const moveIntervalRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const difficultyIntervalRef = useRef(null);

  // Use authenticated user ID or generate guest ID
  const userId = useRef(
    user?.id ||
      user?._id ||
      localStorage.getItem("krishna_user_id") ||
      `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  );

  // Update userId when user changes
  useEffect(() => {
    if (user?.id || user?._id) {
      userId.current = user.id || user._id;
    }
  }, [user]);

  // **Mobile Detection**
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isTouchDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // **Load Practice Bonus from localStorage**
  useEffect(() => {
    const savedBonus = localStorage.getItem("krishna_practice_bonus");
    const lastPracticeDate = localStorage.getItem("krishna_last_practice_date");
    const today = new Date().toDateString();

    if (savedBonus && lastPracticeDate === today) {
      setPracticeBonus(parseFloat(savedBonus));
    } else {
      // Reset bonus if it's a new day
      localStorage.setItem("krishna_practice_bonus", "0");
      localStorage.setItem("krishna_last_practice_date", today);
      setPracticeBonus(0);
    }
  }, []);

  // **Persist preferences**
  useEffect(() => {
    localStorage.setItem("krishna_game_enabled", String(gameEnabled));
  }, [gameEnabled]);

  useEffect(() => {
    localStorage.setItem("krishna_hud_visible", String(showCompactHUD));
  }, [showCompactHUD]);

  // **Initialize**
  useEffect(() => {
    if (!authLoading) {
      localStorage.setItem("krishna_user_id", userId.current);

      if (gameEnabled) {
        fetchUserKeychain();
        setSessionStartTime(new Date());
        checkAttemptStatus();
      }
    }
  }, [authLoading, gameEnabled]);

  // **Game Control Functions**
  const enableGame = useCallback(() => {
    setGameEnabled(true);
    setShowCompactHUD(true);
    fetchUserKeychain();
    setSessionStartTime(new Date());
    checkAttemptStatus();
  }, []);

  const disableGame = useCallback(() => {
    setGameEnabled(false);
    setShowCompactHUD(false);
    setGameStarted(false);
    setShowDashboard(false);
    setShowMenuExpanded(false);

    // Clear intervals
    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    if (difficultyIntervalRef.current)
      clearInterval(difficultyIntervalRef.current);
  }, []);

  const toggleHUD = useCallback(() => {
    setShowCompactHUD((prev) => !prev);
    // Close expanded menu when hiding HUD
    if (showCompactHUD) {
      setShowMenuExpanded(false);
    }
  }, [showCompactHUD]);

  const redirectToLogin = useCallback(() => {
    localStorage.setItem(
      "krishna_redirect_after_login",
      window.location.pathname,
    );
    localStorage.setItem("krishna_open_dashboard_after_login", "true");
    navigate("/login");
  }, [navigate]);

  // **API Helper - Get Headers with Auth Token**
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }, []);

  // **API Functions with Better Error Handling**
  const fetchUserKeychain = useCallback(async () => {
    if (!gameEnabled) return;

    try {
      console.log("[Krishna] Fetching keychain for user:", userId.current);
      const headers = getAuthHeaders();
      const response = await fetch(
        `${baseUrl}/api/krishna/keychain/${userId.current}`,
        { headers },
      );
      const data = await response.json();

      console.log("[Krishna] Keychain response:", data);

      if (data.success && data.hasKeychain) {
        setUserKeychain(data.keychain);
      } else {
        setUserKeychain(null);
      }
    } catch (error) {
      console.error("Failed to fetch keychain:", error);
      setUserKeychain(null);
    }
  }, [gameEnabled, baseUrl, getAuthHeaders]);

  const fetchLeaderboard = useCallback(async () => {
    if (!isAuthenticated || !gameEnabled) {
      console.log(
        "[Krishna] Skipping leaderboard fetch - not authenticated or game disabled",
      );
      return;
    }

    try {
      console.log("[Krishna] Fetching leaderboard...");
      setMenuLoading(true);
      setMenuError(null);

      const headers = getAuthHeaders();
      console.log("[Krishna] Using headers:", headers);

      const response = await fetch(`${baseUrl}/api/krishna/leaderboard`, {
        headers,
      });
      console.log("[Krishna] Leaderboard response status:", response.status);

      const data = await response.json();
      console.log("[Krishna] Leaderboard data:", data);

      if (data.success && data.leaderboard) {
        setLeaderboardData(data.leaderboard);
        console.log("[Krishna] Set leaderboard data:", data.leaderboard);
      } else {
        console.warn("[Krishna] Invalid leaderboard response:", data);
        setLeaderboardData([]);
        setMenuError("Invalid response from server");
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      setLeaderboardData([]);
      setMenuError(error.message || "Failed to load leaderboard");
    } finally {
      setMenuLoading(false);
    }
  }, [isAuthenticated, gameEnabled, baseUrl, getAuthHeaders]);

  const checkAttemptStatus = useCallback(async () => {
    if (!gameEnabled) return;

    try {
      console.log("[Krishna] Checking attempt status...");
      const headers = getAuthHeaders();
      const response = await fetch(`${baseUrl}/api/krishna/check-attempt`, {
        method: "POST",
        headers,
        body: JSON.stringify({ userId: userId.current }),
      });

      const data = await response.json();
      console.log("[Krishna] Attempt status response:", data);

      setCanAttempt(data.canAttempt);

      if (!data.canAttempt) {
        setNextAttemptTime(new Date(data.nextAttemptTime));
      }

      if (data.hasKeychain) {
        setUserKeychain({ name: data.keychainName });
      }
    } catch (error) {
      console.error("Failed to check attempt status:", error);
    }
  }, [gameEnabled, baseUrl, getAuthHeaders]);

  const recordCatch = useCallback(async () => {
    if (!gameEnabled) return false;

    try {
      setIsLoading(true);
      const headers = getAuthHeaders();
      const response = await fetch(`${baseUrl}/api/krishna/catch`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId: userId.current,
          difficulty: difficulty,
          consecutiveMisses: consecutiveMisses,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCanAttempt(false);
        setNextAttemptTime(new Date(data.nextAttemptTime));
        setUserKeychain({ name: data.keychainAwarded.name });
        return data.keychainAwarded;
      }
      return false;
    } catch (error) {
      console.error("Failed to record catch:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, consecutiveMisses, gameEnabled, baseUrl, getAuthHeaders]);

  // **Function to add practice bonus (called from other components)**
  const addPracticeBonus = useCallback(
    (bonusType) => {
      const bonusValues = {
        meditation: 0.15, // 15% bonus for meditation
        gita_reading: 0.1, // 10% bonus for Gita reading
        mantra_chanting: 0.12, // 12% bonus for mantra
        daily_wisdom: 0.05, // 5% bonus for reading daily wisdom
        community_post: 0.08, // 8% bonus for community engagement
      };

      const bonus = bonusValues[bonusType] || 0.05;
      const newBonus = Math.min(practiceBonus + bonus, 0.5); // Cap at 50% bonus

      setPracticeBonus(newBonus);
      localStorage.setItem("krishna_practice_bonus", String(newBonus));
      localStorage.setItem(
        "krishna_last_practice_date",
        new Date().toDateString(),
      );

      return newBonus;
    },
    [practiceBonus],
  );

  // Expose addPracticeBonus globally for other components
  useEffect(() => {
    window.addKrishnaPracticeBonus = addPracticeBonus;
    return () => {
      delete window.addKrishnaPracticeBonus;
    };
  }, [addPracticeBonus]);

  // **Game Logic Functions**
  const calculateCatchChance = useMemo(() => {
    if (!gameEnabled) return 0;

    const baseLuck = 0.012;
    const difficultyMultiplier = Math.max(0.1, 1 - difficulty * 0.08);
    const missedPenalty = Math.max(0.3, 1 - consecutiveMisses * 0.02);

    // Practice bonus increases catch chance
    const practiceMultiplier = 1 + practiceBonus;

    // Near-miss streak bonus (encouragement after close calls)
    const nearMissBonus = nearMissStreak * 0.005;

    return Math.min(
      0.25,
      baseLuck * difficultyMultiplier * missedPenalty * practiceMultiplier +
        nearMissBonus,
    );
  }, [
    difficulty,
    consecutiveMisses,
    gameEnabled,
    practiceBonus,
    nearMissStreak,
  ]);

  const moveKrishna = useCallback(() => {
    if (isScrolling || !canAttempt || !gameStarted || !gameEnabled) return;

    // Slower on mobile for better tap accuracy
    const baseSpeed = isMobile ? 6000 : 5000;
    const speed = Math.max(
      isMobile ? 2500 : 2000,
      baseSpeed - difficulty * 200,
    );

    // Larger edge buffer on mobile for easier tapping
    const mobileBuffer = isMobile ? 15 : 5;
    const edgeBuffer = Math.max(mobileBuffer, 30 - difficulty * 2);

    // Avoid positioning too close to HUD on mobile
    const topMin = isMobile ? 25 : edgeBuffer;
    const topMax = isMobile ? 75 : 100 - edgeBuffer;
    const leftMin = edgeBuffer;
    const leftMax = 100 - edgeBuffer - (isMobile ? 5 : 0);

    setPosition({
      top: `${topMin + Math.random() * (topMax - topMin)}%`,
      left: `${leftMin + Math.random() * (leftMax - leftMin)}%`,
    });

    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
    }
    moveIntervalRef.current = setInterval(moveKrishna, speed);
  }, [isScrolling, canAttempt, difficulty, gameStarted, gameEnabled, isMobile]);

  const playAudio = useCallback(() => {
    if (!audioRef.current || !gameEnabled) return;

    if (audioRef.current.paused) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [gameEnabled]);

  // **Haptic Feedback for Mobile**
  const triggerHaptic = useCallback((type = "light") => {
    if ("vibrate" in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 50, 30],
        success: [50, 100, 50, 100, 100],
        miss: [15],
      };
      navigator.vibrate(patterns[type] || patterns.light);
    }
  }, []);

  // **Tap Feedback Animation**
  const showTapFeedbackAt = useCallback((x, y, isHit) => {
    const id = Date.now();
    setTapFeedback({ id, x, y, isHit });
    setTimeout(() => setTapFeedback(null), 600);
  }, []);

  // **Main Catch Attempt Handler (supports both hover and tap)**
  const handleCatchAttempt = useCallback(
    async (event) => {
      if (!canAttempt || isLoading || !gameStarted || !gameEnabled) return;

      // Prevent double-taps on mobile
      const now = Date.now();
      if (now - lastTapTime < 300) return;
      setLastTapTime(now);

      // Hide tap hint after first interaction
      setShowTapHint(false);

      // Get tap position for feedback
      let tapX = 50,
        tapY = 50;
      if (event) {
        if (event.touches && event.touches[0]) {
          tapX = (event.touches[0].clientX / window.innerWidth) * 100;
          tapY = (event.touches[0].clientY / window.innerHeight) * 100;
        } else if (event.clientX !== undefined) {
          tapX = (event.clientX / window.innerWidth) * 100;
          tapY = (event.clientY / window.innerHeight) * 100;
        }
      }

      playAudio();
      setAttempts((prev) => prev + 1);
      triggerHaptic("light");

      const catchChance = calculateCatchChance;
      const roll = Math.random();
      const isLucky = roll < catchChance;

      // Near miss detection (within 2x of catch chance)
      const isNearMiss = !isLucky && roll < catchChance * 2;

      if (isLucky) {
        triggerHaptic("success");
        showTapFeedbackAt(tapX, tapY, true);
        setNearMissStreak(0);

        const keychainAwarded = await recordCatch();

        if (keychainAwarded) {
          const randomLesson =
            lessons[Math.floor(Math.random() * lessons.length)];
          const rarityText =
            keychainAwarded.rarity === "rare"
              ? "⭐ RARE DIVINE BLESSING! ⭐"
              : "";

          setSuccessMessage(
            Math.random() < 0.6
              ? `✨ Krishna has blessed you with the "${keychainAwarded.name}"! ${rarityText} Your devotion has been rewarded! ✨`
              : `🪷 Krishna blesses you with wisdom: "${randomLesson}" 🪷\n\nYou have also received the "${keychainAwarded.name}"!`,
          );
          setTease("Divine blessing received!");
          setConsecutiveMisses(0);
          setDifficulty(1);
          setGameStarted(false);

          if (isAuthenticated) {
            fetchLeaderboard();
          }
        }
      } else {
        triggerHaptic("miss");
        showTapFeedbackAt(tapX, tapY, false);
        setConsecutiveMisses((prev) => prev + 1);

        // Handle near misses
        if (isNearMiss) {
          setNearMissStreak((prev) => prev + 1);
          const nearMissTeases = [
            "So close! 🙏",
            "Almost caught me!",
            "Your devotion grows stronger!",
            "Nearly blessed!",
            "Krishna feels your presence!",
          ];
          setTease(
            nearMissTeases[Math.floor(Math.random() * nearMissTeases.length)],
          );
        } else {
          setNearMissStreak(0);
          const randomTease = teases[Math.floor(Math.random() * teases.length)];
          setTease(randomTease);
        }

        moveKrishna();
      }
    },
    [
      canAttempt,
      isLoading,
      gameStarted,
      gameEnabled,
      calculateCatchChance,
      recordCatch,
      moveKrishna,
      isAuthenticated,
      fetchLeaderboard,
      triggerHaptic,
      showTapFeedbackAt,
      playAudio,
      lastTapTime,
    ],
  );

  // Keep legacy handleHover for desktop compatibility
  const handleHover = handleCatchAttempt;

  const startGame = useCallback(() => {
    if (!canAttempt || !gameEnabled) return;

    setGameStarted(true);
    setDifficulty(1);
    setConsecutiveMisses(0);
    setAttempts(0);
    setTease("Here I am! Try to catch me!");
    setSessionStartTime(new Date());
    moveKrishna();
  }, [canAttempt, moveKrishna, gameEnabled]);

  const openDashboard = useCallback(() => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    console.log("[Krishna] Opening dashboard...");
    setShowDashboard(true);
    fetchLeaderboard();
  }, [isAuthenticated, fetchLeaderboard, redirectToLogin]);

  // **Menu Control Functions**
  const toggleMenuExpanded = useCallback(() => {
    setShowMenuExpanded((prev) => !prev);
    if (!showMenuExpanded && isAuthenticated) {
      fetchLeaderboard();
    }
  }, [showMenuExpanded, isAuthenticated, fetchLeaderboard]);

  const switchMenuTab = useCallback(
    (tab) => {
      setMenuTab(tab);
      if (tab === "leaderboard" && isAuthenticated) {
        fetchLeaderboard();
      }
    },
    [isAuthenticated, fetchLeaderboard],
  );

  // **Effects**
  useEffect(() => {
    if (gameEnabled && !authLoading) {
      checkAttemptStatus();
    }
  }, [checkAttemptStatus, gameEnabled, authLoading]);

  useEffect(() => {
    if (gameStarted && canAttempt && gameEnabled) {
      difficultyIntervalRef.current = setInterval(() => {
        setDifficulty((prev) => Math.min(8, prev + 0.1));
      }, 30000);
    }

    return () => {
      if (difficultyIntervalRef.current) {
        clearInterval(difficultyIntervalRef.current);
      }
    };
  }, [gameStarted, canAttempt, gameEnabled]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isScrolling && canAttempt && gameStarted && gameEnabled) {
      const speed = Math.max(2000, 5000 - difficulty * 200);
      moveIntervalRef.current = setInterval(moveKrishna, speed);
    } else {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    }

    return () => {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    };
  }, [
    moveKrishna,
    isScrolling,
    canAttempt,
    difficulty,
    gameStarted,
    gameEnabled,
  ]);

  // **Check for redirect after login**
  useEffect(() => {
    const shouldOpenDashboard = localStorage.getItem(
      "krishna_open_dashboard_after_login",
    );

    if (
      shouldOpenDashboard === "true" &&
      isAuthenticated &&
      gameEnabled &&
      !authLoading
    ) {
      localStorage.removeItem("krishna_open_dashboard_after_login");
      localStorage.removeItem("krishna_redirect_after_login");

      fetchUserKeychain();
      checkAttemptStatus();
      setShowDashboard(true);
      fetchLeaderboard();
    }
  }, [
    isAuthenticated,
    gameEnabled,
    authLoading,
    fetchUserKeychain,
    checkAttemptStatus,
    fetchLeaderboard,
  ]);

  // **Utility Functions**
  const getTimeUntilNextAttempt = useMemo(() => {
    if (!nextAttemptTime) return null;

    const now = new Date();
    const diff = nextAttemptTime - now;

    if (diff <= 0) {
      setCanAttempt(true);
      setNextAttemptTime(null);
      return null;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }, [nextAttemptTime]);

  const krishnaStyle = useMemo(
    () => ({
      top: position.top,
      left: position.left,
      opacity: isScrolling ? 0.4 : canAttempt && gameEnabled ? 1 : 0.5,
      pointerEvents:
        isScrolling || !canAttempt || !gameEnabled ? "none" : "auto",
      transform: `translate3d(0, 0, 0) ${
        isLoading ? "scale(1.1)" : "scale(1)"
      }`,
      filter: canAttempt && gameEnabled ? "none" : "grayscale(70%)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      zIndex: 30,
      display: gameEnabled ? "block" : "none",
    }),
    [position, isScrolling, canAttempt, isLoading, gameEnabled],
  );

  // **Update countdown every minute**
  useEffect(() => {
    if (nextAttemptTime) {
      const interval = setInterval(() => {
        setNextAttemptTime((prev) => prev);
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [nextAttemptTime]);

  // Don't render if auth is still loading
  if (authLoading) {
    return null;
  }

  return (
    <div className="krishna-game-container">
      {/* **Audio Element** */}
      <audio ref={audioRef} src={laugh} preload="auto" />

      {/* **Clean Game Toggle - Top Right Corner** */}
      <div className="fixed top-24 right-4 z-40 ">
        {!gameEnabled ? (
          <button
            onClick={enableGame}
            className="bg-gradient-to-r from-purple-600 z-40 to-pink-600 hover:from-purple-700 mt-30  hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 text-sm flex items-center space-x-2"
            title="Play Krishna Game"
          >
            <FaGamepad className="w-4 h-4" />
            <span>Krishna Game</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2  ">
            {/* Toggle HUD Button */}
            <button
              onClick={toggleHUD}
              className={`p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 ${
                showCompactHUD
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-600 hover:bg-gray-700 text-gray-200"
              }`}
              title={showCompactHUD ? "Hide HUD" : "Show HUD"}
            >
              {showCompactHUD ? (
                <FaEyeSlash className="w-4 h-4" />
              ) : (
                <IoMenu className="w-4 h-4" />
              )}
            </button>

            {/* Close Game Button */}
            <button
              onClick={disableGame}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              title="Close Game"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* **Enhanced HUD with Toggle Functionality** */}
      {gameEnabled && showCompactHUD && (
        <div className="fixed top-16 right-4 z-30 mt-12 bg-black/80 backdrop-blur-sm text-white rounded-lg shadow-xl border border-gray-600 max-w-xs animate-in slide-in-from-right duration-300">
          {/* **Main HUD Section** */}
          <div className="p-3">
            {/* **Header with Toggle Close Button** */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-yellow-300 font-semibold flex items-center">
                <FaGem className="w-3 h-3 mr-1" />
                Krishna
              </span>
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-300">
                  {isAuthenticated
                    ? `✓ ${
                        currentUser?.username || currentUser?.name || "User"
                      }`
                    : "Guest"}
                </div>
                <button
                  onClick={toggleHUD}
                  className="text-gray-400 hover:text-white transition-colors duration-200 hover:bg-gray-700 rounded p-1"
                  title="Close HUD"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* **Game Info** */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Difficulty:</span>
                <span className="text-red-300">{difficulty.toFixed(1)}/8</span>
              </div>
              <div className="flex justify-between">
                <span>Chance:</span>
                <span className="text-green-300">
                  {(calculateCatchChance * 100).toFixed(1)}%
                </span>
              </div>
              {consecutiveMisses > 0 && (
                <div className="flex justify-between">
                  <span>Misses:</span>
                  <span className="text-orange-300">{consecutiveMisses}</span>
                </div>
              )}
              {practiceBonus > 0 && (
                <div className="flex justify-between">
                  <span>🙏 Practice:</span>
                  <span className="text-green-300">
                    +{Math.round(practiceBonus * 100)}%
                  </span>
                </div>
              )}
              {nearMissStreak > 0 && (
                <div className="flex justify-between">
                  <span>🔥 Near Miss:</span>
                  <span className="text-orange-300">{nearMissStreak}x</span>
                </div>
              )}
            </div>

            {/* **Keychain Display** */}
            {userKeychain && (
              <div className="mt-2 p-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded border border-yellow-500/30">
                <div className="text-xs text-yellow-200 text-center flex items-center justify-center">
                  <FaCrown className="w-3 h-3 mr-1" />
                  {userKeychain.name}
                </div>
              </div>
            )}

            {/* **Cooldown Display** */}
            {!canAttempt && getTimeUntilNextAttempt && (
              <div className="mt-2 p-2 bg-red-600/20 rounded border border-red-500/30">
                <div className="text-xs text-red-200 text-center flex items-center justify-center">
                  <FaClock className="w-3 h-3 mr-1" />
                  Next: {getTimeUntilNextAttempt}
                </div>
              </div>
            )}

            {/* **Action Buttons** */}
            <div className="mt-3 space-y-2">
              {canAttempt && !gameStarted && (
                <button
                  onClick={startGame}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded text-sm transition-all duration-300 flex items-center justify-center"
                >
                  <FaPlay className="w-3 h-3 mr-1" />
                  Start Game
                </button>
              )}

              <button
                onClick={toggleMenuExpanded}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded text-sm transition-all duration-300 flex items-center justify-center"
              >
                <FaChartBar className="w-3 h-3 mr-1" />
                Menu
                {showMenuExpanded ? (
                  <FaChevronUp className="w-3 h-3 ml-1" />
                ) : (
                  <FaChevronDown className="w-3 h-3 ml-1" />
                )}
              </button>
            </div>
          </div>

          {/* **Expanded Menu Section** */}
          {showMenuExpanded && (
            <div className="border-t border-gray-600 animate-in slide-in-from-top duration-200">
              {/* **Menu Tabs** */}
              <div className="flex border-b border-gray-600">
                <button
                  onClick={() => switchMenuTab("stats")}
                  className={`flex-1 py-2 px-3 text-xs font-semibold transition-all duration-300 flex items-center justify-center ${
                    menuTab === "stats"
                      ? "bg-yellow-600 text-white"
                      : "bg-purple-700/50 text-purple-200 hover:bg-purple-600/50"
                  }`}
                >
                  <IoStatsChart className="w-3 h-3 mr-1" />
                  Stats
                </button>
                <button
                  onClick={() => switchMenuTab("leaderboard")}
                  className={`flex-1 py-2 px-3 text-xs font-semibold transition-all duration-300 flex items-center justify-center ${
                    menuTab === "leaderboard"
                      ? "bg-yellow-600 text-white"
                      : "bg-purple-700/50 text-purple-200 hover:bg-purple-600/50"
                  }`}
                  disabled={!isAuthenticated}
                >
                  <IoTrophy className="w-3 h-3 mr-1" />
                  Leaders
                </button>
              </div>

              {/* **Menu Content** */}
              <div className="p-3 max-h-60 overflow-y-auto">
                {menuTab === "stats" && (
                  <div className="space-y-2">
                    <div className="text-xs">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">Session Attempts:</span>
                        <span className="text-blue-400 font-bold">
                          {attempts}
                        </span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">
                          Consecutive Misses:
                        </span>
                        <span className="text-orange-400 font-bold">
                          {consecutiveMisses}
                        </span>
                      </div>
                      {sessionStartTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Session Time:</span>
                          <span className="text-green-400 font-bold">
                            {Math.floor(
                              (new Date() - sessionStartTime) / 60000,
                            )}
                            m
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={openDashboard}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded text-xs transition-all duration-300 flex items-center justify-center"
                    >
                      <FaChartBar className="w-3 h-3 mr-1" />
                      {isAuthenticated
                        ? "Full Dashboard"
                        : "Login for Dashboard"}
                    </button>
                  </div>
                )}

                {menuTab === "leaderboard" && (
                  <div className="space-y-2">
                    {!isAuthenticated ? (
                      <div className="text-center py-4">
                        <div className="text-xs text-gray-300 mb-2">
                          Login to view leaderboard
                        </div>
                        <button
                          onClick={redirectToLogin}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs"
                        >
                          Login
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-xs font-bold text-yellow-300">
                            Top Devotees
                          </h4>
                          <button
                            onClick={fetchLeaderboard}
                            className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs flex items-center"
                            disabled={menuLoading}
                          >
                            <FaSync
                              className={`w-2 h-2 ${
                                menuLoading ? "animate-spin" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {menuError && (
                          <div className="bg-red-600/20 border border-red-400 text-red-200 p-2 rounded text-xs">
                            Error: {menuError}
                          </div>
                        )}

                        {menuLoading ? (
                          <div className="text-center py-4">
                            <FaSync className="w-4 h-4 animate-spin mx-auto mb-1 text-purple-400" />
                            <p className="text-xs text-purple-200">
                              Loading...
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {leaderboardData && leaderboardData.length > 0 ? (
                              leaderboardData.slice(0, 5).map((user, index) => {
                                const getRankIcon = (rank) => {
                                  switch (rank) {
                                    case 0:
                                      return (
                                        <FaCrown className="w-2 h-2 text-yellow-400" />
                                      );
                                    case 1:
                                      return (
                                        <FaMedal className="w-2 h-2 text-gray-400" />
                                      );
                                    case 2:
                                      return (
                                        <FaAward className="w-2 h-2 text-orange-400" />
                                      );
                                    default:
                                      return (
                                        <span className="font-bold text-xs">
                                          #{rank + 1}
                                        </span>
                                      );
                                  }
                                };

                                return (
                                  <div
                                    key={index}
                                    className={`p-2 rounded border text-xs ${
                                      index === 0
                                        ? "bg-yellow-600/20 border-yellow-400/30"
                                        : index === 1
                                          ? "bg-gray-400/20 border-gray-300/30"
                                          : index === 2
                                            ? "bg-orange-600/20 border-orange-400/30"
                                            : "bg-purple-600/20 border-purple-400/30"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-1">
                                        {getRankIcon(index)}
                                        <div>
                                          <div className="font-semibold text-xs">
                                            {user.username || "Anonymous"}
                                          </div>
                                          <div className="text-xs opacity-70 flex items-center">
                                            <FaGem className="w-1 h-1 mr-1" />
                                            {user.keychainName}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-xs opacity-70">
                                        {user.daysSinceCatch === 0
                                          ? "Today"
                                          : `${user.daysSinceCatch}d`}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-center py-4">
                                <FaGem className="w-6 h-6 mx-auto mb-1 text-purple-400" />
                                <p className="text-xs text-purple-200">
                                  No blessed devotees yet!
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* **Close Menu Button** */}
              <div className="border-t border-gray-600 p-2">
                <button
                  onClick={() => setShowMenuExpanded(false)}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-1 px-2 rounded text-xs transition-all duration-300 flex items-center justify-center"
                >
                  <FaChevronUp className="w-3 h-3 mr-1" />
                  Close Menu
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* **Tap Feedback Ripple Effect** */}
      {tapFeedback && (
        <div
          key={tapFeedback.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: `${tapFeedback.x}%`,
            top: `${tapFeedback.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className={`rounded-full animate-ping ${
              tapFeedback.isHit
                ? "bg-yellow-400 w-20 h-20"
                : "bg-purple-400 w-12 h-12"
            }`}
            style={{ opacity: 0.6 }}
          />
          <div
            className={`absolute inset-0 flex items-center justify-center text-2xl animate-bounce ${
              tapFeedback.isHit ? "" : "opacity-70"
            }`}
          >
            {tapFeedback.isHit ? "✨" : "💨"}
          </div>
        </div>
      )}

      {/* **Krishna Character - Hover for Desktop, Tap for Mobile** */}
      {gameEnabled && (
        <div
          onMouseEnter={!isMobile ? handleHover : undefined}
          onClick={isMobile ? handleCatchAttempt : undefined}
          onTouchStart={
            isMobile
              ? (e) => {
                  e.preventDefault();
                  handleCatchAttempt(e);
                }
              : undefined
          }
          className={`fixed cursor-pointer text-center transition-all duration-300 select-none touch-manipulation ${
            isLoading ? "animate-pulse" : ""
          } ${gameStarted ? "animate-bounce" : ""}`}
          style={krishnaStyle}
        >
          {/* Larger tap target for mobile */}
          <div className={`relative ${isMobile ? "p-4 -m-4" : ""}`}>
            {/* Tap hint ring for mobile */}
            {isMobile && gameStarted && canAttempt && showTapHint && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 border-2 border-dashed border-yellow-400 rounded-full animate-pulse opacity-50" />
                <span className="absolute -bottom-8 text-xs text-yellow-300 font-semibold whitespace-nowrap">
                  👆 Tap to catch!
                </span>
              </div>
            )}

            <img
              src={kpng}
              alt="Lord Krishna"
              className={`${isMobile ? "w-20" : "w-16"} mx-auto transition-all duration-300 ${
                !canAttempt ? "filter grayscale" : ""
              } ${isLoading ? "animate-spin" : ""} drop-shadow-lg`}
              loading="lazy"
              draggable="false"
            />

            {gameStarted && canAttempt && (
              <div
                className={`absolute inset-0 bg-gradient-to-r from-yellow-400 via-transparent to-blue-400 rounded-full opacity-30 animate-pulse ${isMobile ? "scale-125" : ""}`}
              />
            )}

            {isLoading && (
              <div className="absolute inset-0 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            )}

            {/* Near miss streak indicator */}
            {nearMissStreak > 0 && gameStarted && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                🔥 {nearMissStreak}x close!
              </div>
            )}

            {/* Practice bonus indicator */}
            {practiceBonus > 0 && gameStarted && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                🙏 +{Math.round(practiceBonus * 100)}% blessed
              </div>
            )}
          </div>

          <div
            className={`font-semibold mt-1 px-2 py-1 rounded-full ${isMobile ? "text-sm" : "text-xs"} transition-all duration-300 ${
              canAttempt
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-gray-600 text-gray-300"
            }`}
          >
            {!isScrolling &&
              (canAttempt
                ? gameStarted
                  ? tease
                  : "Start Game!"
                : "Tomorrow!")}
          </div>
        </div>
      )}

      {/* **Success Message Popup** */}
      {successMessage && (
        <div
          onClick={() => setSuccessMessage(null)}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-yellow-50 via-white to-orange-50 shadow-2xl p-6 rounded-xl max-w-md w-full text-center space-y-4 border-4 border-yellow-300 animate-pulse cursor-pointer"
          >
            <div className="text-4xl animate-bounce">🪷</div>
            <p className="text-base font-medium text-gray-800 leading-relaxed whitespace-pre-line">
              {successMessage}
            </p>
            {!canAttempt && getTimeUntilNextAttempt && (
              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-3 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-700 font-semibold flex items-center justify-center">
                  <IoTime className="w-4 h-4 mr-1" />
                  Next blessing in: {getTimeUntilNextAttempt}
                </p>
              </div>
            )}
            <button className="mt-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full shadow-lg hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center mx-auto">
              <FaGem className="w-4 h-4 mr-2" />
              Blessed
            </button>
          </div>
        </div>
      )}

      {/* **Full Dashboard Modal - Simplified for Authenticated Users** */}
      {showDashboard && isAuthenticated && (
        <div
          onClick={() => setShowDashboard(false)}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6 rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto border border-purple-400"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-yellow-300 flex items-center">
                <FaGem className="w-5 h-5 mr-2" />
                Krishna Dashboard
              </h2>
              <button
                onClick={() => setShowDashboard(false)}
                className="text-gray-400 hover:text-white text-xl transition-colors duration-300"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* **Enhanced Stats Section** */}
              <div className="bg-purple-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-yellow-300 mb-3 flex items-center">
                  <FaChartBar className="w-4 h-4 mr-2" />
                  Your Divine Journey
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-purple-700/30 p-3 rounded">
                    <span className="text-gray-300 block">
                      Current Difficulty
                    </span>
                    <div className="text-white font-bold text-lg">
                      {difficulty.toFixed(1)}/8
                    </div>
                  </div>
                  <div className="bg-purple-700/30 p-3 rounded">
                    <span className="text-gray-300 block">Catch Chance</span>
                    <div className="text-green-400 font-bold text-lg">
                      {(calculateCatchChance * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-purple-700/30 p-3 rounded">
                    <span className="text-gray-300 block">
                      Session Attempts
                    </span>
                    <div className="text-blue-400 font-bold text-lg">
                      {attempts}
                    </div>
                  </div>
                  <div className="bg-purple-700/30 p-3 rounded">
                    <span className="text-gray-300 block">
                      Consecutive Misses
                    </span>
                    <div className="text-orange-400 font-bold text-lg">
                      {consecutiveMisses}
                    </div>
                  </div>
                </div>
              </div>

              {/* **Keychain Section** */}
              {userKeychain && (
                <div className="bg-gradient-to-r from-yellow-700/50 to-orange-700/50 p-4 rounded-lg border border-yellow-500/30">
                  <h3 className="text-lg font-bold text-yellow-100 mb-2 flex items-center">
                    <FaCrown className="w-4 h-4 mr-2" />
                    Your Divine Keychain
                  </h3>
                  <div className="text-white font-bold text-lg">
                    {userKeychain.name}
                  </div>
                  {userKeychain.daysSinceCatch !== undefined && (
                    <div className="text-yellow-200 text-sm mt-1">
                      Blessed {userKeychain.daysSinceCatch} days ago
                    </div>
                  )}
                </div>
              )}

              {/* **Cooldown Section** */}
              {!canAttempt && getTimeUntilNextAttempt && (
                <div className="bg-gradient-to-r from-red-700/50 to-pink-700/50 p-4 rounded-lg border border-red-500/30">
                  <h3 className="text-lg font-bold text-red-100 mb-2 flex items-center">
                    <FaClock className="w-4 h-4 mr-2" />
                    Next Divine Blessing
                  </h3>
                  <div className="text-white font-bold text-lg">
                    {getTimeUntilNextAttempt}
                  </div>
                  <div className="text-red-200 text-sm mt-1">
                    Patience, devotee. Krishna will return.
                  </div>
                </div>
              )}

              {/* **Close Dashboard Button** */}
              <div className="pt-2">
                <button
                  onClick={() => setShowDashboard(false)}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  <IoClose className="w-4 h-4 mr-2" />
                  Close Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyKrishna;
