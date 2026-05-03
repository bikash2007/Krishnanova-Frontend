import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import kpng from "../Media/k.webp";
const laugh = `${import.meta.env.BASE_URL}audio/Audio/laugh.mp3`;
import { useApi } from "../Context/baseUrl";
import {
  FaGamepad,
  FaChartBar,
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
} from "react-icons/fa";
import { GiLotus } from "react-icons/gi";
import {
  IoStatsChart,
  IoTrophy,
  IoClose,
  IoTime,
  IoMenu,
} from "react-icons/io5";

// ── Static Data ──────────────────────────────────────────────
const LESSONS = [
  "Do your duty, but don't concern yourself with the results.",
  "Calmness, gentleness, silence, self-restraint — these are virtues.",
  "Change is the law of the universe.",
  "A person is made by their faith.",
  "You are what you believe in.",
  "Be fearless and pure.",
  "You came empty handed, you will leave empty handed.",
  "The soul is neither born, and nor does it die.",
  "Set thy heart upon thy work, but never on its reward.",
];

const TEASES = [
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

const NEAR_MISS_TEASES = [
  "So close!",
  "Almost caught me!",
  "Your devotion grows stronger!",
  "Nearly blessed!",
  "Krishna feels your presence!",
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ── Component ────────────────────────────────────────────────
const FloatingKrishna = () => {
  const navigate = useNavigate();
  const baseUrl = useApi();
  const { user, loading: authLoading } = useAuth();
  const isAuthenticated = !!user;

  // Core game state
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
  const [totalCatches, setTotalCatches] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);

  // Mobile / touch
  const [isMobile, setIsMobile] = useState(false);
  const lastInteractionRef = useRef(0);

  // UI controls
  const [gameEnabled, setGameEnabled] = useState(
    () => localStorage.getItem("krishna_game_enabled") === "true",
  );
  const [showHUD, setShowHUD] = useState(
    () => localStorage.getItem("krishna_hud_visible") !== "false",
  );
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [menuTab, setMenuTab] = useState("stats");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);

  // Refs
  const audioRef = useRef(null);
  const moveTimerRef = useRef(null);
  const scrollTimerRef = useRef(null);
  const difficultyTimerRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const justFledRef = useRef(false);
  const userId = useRef(
    user?.id ||
      user?._id ||
      localStorage.getItem("krishna_user_id") ||
      `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  );

  // ── Derived values ──
  const catchChance = useMemo(() => {
    if (!gameEnabled) return 0;
    const base = 0.012;
    const diffMult = Math.max(0.1, 1 - difficulty * 0.08);
    const missMult = Math.max(0.3, 1 - consecutiveMisses * 0.02);
    return Math.min(0.25, base * diffMult * missMult);
  }, [difficulty, consecutiveMisses, gameEnabled]);

  const timeUntilNext = useMemo(() => {
    if (!nextAttemptTime) return null;
    const diff = nextAttemptTime - new Date();
    if (diff <= 0) return null;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  }, [nextAttemptTime]);

  // ── Auth headers ──
  const getHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    const h = { "Content-Type": "application/json" };
    if (token) h["Authorization"] = `Bearer ${token}`;
    return h;
  }, []);

  // ── Mobile detection ──
  useEffect(() => {
    const check = () =>
      setIsMobile(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          window.innerWidth <= 768,
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Track mouse position globally (PC only)
  useEffect(() => {
    if (isMobile) return;
    const onMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isMobile]);

  // Update userId when user logs in
  useEffect(() => {
    if (user?.id || user?._id) userId.current = user.id || user._id;
  }, [user]);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem("krishna_game_enabled", String(gameEnabled));
  }, [gameEnabled]);
  useEffect(() => {
    localStorage.setItem("krishna_hud_visible", String(showHUD));
  }, [showHUD]);

  // ── API calls ──
  const fetchKeychain = useCallback(async () => {
    if (!gameEnabled) return;
    try {
      const res = await fetch(
        `${baseUrl}/api/krishna/keychain/${userId.current}`,
        { headers: getHeaders() },
      );
      const data = await res.json();
      setUserKeychain(data.success && data.hasKeychain ? data.keychain : null);
    } catch {
      setUserKeychain(null);
    }
  }, [gameEnabled, baseUrl, getHeaders]);

  const fetchStats = useCallback(async () => {
    if (!gameEnabled) return;
    try {
      const res = await fetch(
        `${baseUrl}/api/krishna/stats/${userId.current}`,
        { headers: getHeaders() },
      );
      const data = await res.json();
      if (data.success) {
        setTotalCatches(data.stats.totalCatches || 0);
      }
    } catch {
      // silently fail
    }
  }, [gameEnabled, baseUrl, getHeaders]);

  const fetchLeaderboard = useCallback(async () => {
    if (!isAuthenticated || !gameEnabled) return;
    try {
      setMenuLoading(true);
      const res = await fetch(`${baseUrl}/api/krishna/leaderboard`, {
        headers: getHeaders(),
      });
      const data = await res.json();
      setLeaderboardData(data.success ? data.leaderboard || [] : []);
    } catch {
      setLeaderboardData([]);
    } finally {
      setMenuLoading(false);
    }
  }, [isAuthenticated, gameEnabled, baseUrl, getHeaders]);

  const checkAttemptStatus = useCallback(async () => {
    if (!gameEnabled) return;
    try {
      const res = await fetch(`${baseUrl}/api/krishna/check-attempt`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ userId: userId.current }),
      });
      const data = await res.json();
      setCanAttempt(data.canAttempt);
      if (!data.canAttempt && data.nextAttemptTime)
        setNextAttemptTime(new Date(data.nextAttemptTime));
      if (data.hasKeychain) setUserKeychain({ name: data.keychainName });
    } catch {
      // silently fail — game still works offline
    }
  }, [gameEnabled, baseUrl, getHeaders]);

  const recordCatch = useCallback(async () => {
    if (!gameEnabled) return false;
    try {
      setIsLoading(true);
      const res = await fetch(`${baseUrl}/api/krishna/catch`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          userId: userId.current,
          difficulty,
          consecutiveMisses,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCanAttempt(false);
        setNextAttemptTime(new Date(data.nextAttemptTime));
        setUserKeychain({ name: data.keychainAwarded.name });
        setTotalCatches(data.totalCatches || 0);
        return data.keychainAwarded;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, consecutiveMisses, gameEnabled, baseUrl, getHeaders]);

  // ── Init on game enable ──
  useEffect(() => {
    if (!authLoading && gameEnabled) {
      localStorage.setItem("krishna_user_id", userId.current);
      fetchKeychain();
      fetchStats();
      setSessionStartTime(new Date());
      checkAttemptStatus();
    }
  }, [authLoading, gameEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cooldown countdown refresh ──
  useEffect(() => {
    if (!nextAttemptTime) return;
    const interval = setInterval(() => {
      if (new Date() >= nextAttemptTime) {
        setCanAttempt(true);
        setNextAttemptTime(null);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [nextAttemptTime]);

  // ── Scroll detection ──
  useEffect(() => {
    const onScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => setIsScrolling(false), 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimerRef.current);
    };
  }, []);

  // ── Movement ──
  const moveKrishna = useCallback(() => {
    if (isScrolling || !canAttempt || !gameStarted || !gameEnabled) return;
    const buf = isMobile ? 15 : 5;
    const topMin = isMobile ? 25 : buf;
    const topMax = isMobile ? 75 : 100 - buf;
    const leftMax = 100 - buf * 2 - (isMobile ? 5 : 0);

    // On PC, avoid spawning near cursor
    const { x: mx, y: my } = mousePosRef.current;
    const cxPct = (mx / (window.innerWidth || 1)) * 100;
    const cyPct = (my / (window.innerHeight || 1)) * 100;

    let newTop,
      newLeft,
      tries = 0;
    do {
      newTop = topMin + Math.random() * (topMax - topMin);
      newLeft = buf + Math.random() * leftMax;
      tries++;
    } while (
      !isMobile &&
      tries < 8 &&
      Math.sqrt((newLeft - cxPct) ** 2 + (newTop - cyPct) ** 2) < 18
    );

    setPosition({ top: `${newTop}%`, left: `${newLeft}%` });
  }, [isScrolling, canAttempt, gameStarted, gameEnabled, isMobile]);

  // Flee FROM cursor — fast directional escape (PC only)
  const fleeFromCursor = useCallback(() => {
    if (isScrolling || !canAttempt || !gameStarted || !gameEnabled) return;
    const { x: mx, y: my } = mousePosRef.current;
    const cxPct = (mx / (window.innerWidth || 1)) * 100;
    const cyPct = (my / (window.innerHeight || 1)) * 100;

    // Pick random angle, flee 25-60% screen distance from cursor
    const angle = Math.random() * Math.PI * 2;
    const fleeDistance = 25 + Math.random() * 35;
    let newLeft = cxPct + Math.cos(angle) * fleeDistance;
    let newTop = cyPct + Math.sin(angle) * fleeDistance;

    // Clamp to viewport
    newLeft = Math.max(5, Math.min(95, newLeft));
    newTop = Math.max(5, Math.min(95, newTop));

    // Ensure minimum distance from cursor
    const dist = Math.sqrt((newLeft - cxPct) ** 2 + (newTop - cyPct) ** 2);
    if (dist < 20) {
      newLeft = cxPct < 50 ? 65 + Math.random() * 25 : 10 + Math.random() * 25;
      newTop = cyPct < 50 ? 65 + Math.random() * 25 : 10 + Math.random() * 25;
    }

    justFledRef.current = true;
    setPosition({ top: `${newTop}%`, left: `${newLeft}%` });
  }, [isScrolling, canAttempt, gameStarted, gameEnabled]);

  // Auto-move interval
  useEffect(() => {
    if (!isScrolling && canAttempt && gameStarted && gameEnabled) {
      const speed = Math.max(
        isMobile ? 1800 : 1200,
        (isMobile ? 4500 : 3500) - difficulty * 250,
      );
      moveTimerRef.current = setInterval(moveKrishna, speed);
    }
    return () => clearInterval(moveTimerRef.current);
  }, [
    moveKrishna,
    isScrolling,
    canAttempt,
    difficulty,
    gameStarted,
    gameEnabled,
    isMobile,
  ]);

  // Difficulty ramp
  useEffect(() => {
    if (gameStarted && canAttempt && gameEnabled) {
      difficultyTimerRef.current = setInterval(() => {
        setDifficulty((d) => Math.min(8, d + 0.1));
      }, 30000);
    }
    return () => clearInterval(difficultyTimerRef.current);
  }, [gameStarted, canAttempt, gameEnabled]);

  // Proximity safety: flee if Krishna randomly appears under cursor (PC)
  useEffect(() => {
    if (isMobile || !gameStarted || !gameEnabled || !canAttempt) return;
    if (justFledRef.current) {
      justFledRef.current = false;
      return;
    }
    const raf = requestAnimationFrame(() => {
      const { x: mx, y: my } = mousePosRef.current;
      if (mx === 0 && my === 0) return;
      const kx = (parseFloat(position.left) / 100) * window.innerWidth;
      const ky = (parseFloat(position.top) / 100) * window.innerHeight;
      const dist = Math.sqrt((kx - mx) ** 2 + (ky - my) ** 2);
      if (dist < 100) {
        justFledRef.current = true;
        fleeFromCursor();
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [
    position,
    isMobile,
    gameStarted,
    gameEnabled,
    canAttempt,
    fleeFromCursor,
  ]);

  // ── Haptic ──
  const haptic = useCallback((type) => {
    if (!("vibrate" in navigator)) return;
    const patterns = {
      light: [10],
      success: [50, 100, 50, 100, 100],
      miss: [15],
    };
    navigator.vibrate(patterns[type] || [10]);
  }, []);

  // ── Game controls ──
  const enableGame = useCallback(() => {
    setGameEnabled(true);
    setShowHUD(true);
  }, []);

  const disableGame = useCallback(() => {
    setGameEnabled(false);
    setShowHUD(false);
    setGameStarted(false);
    setMenuExpanded(false);
    clearInterval(moveTimerRef.current);
    clearInterval(difficultyTimerRef.current);
  }, []);

  const startGame = useCallback(() => {
    if (!canAttempt || !gameEnabled) return;
    setGameStarted(true);
    setDifficulty(1);
    setConsecutiveMisses(0);
    setAttempts(0);
    setTease("Here I am! Try to catch me!");
    setSessionStartTime(new Date());
    moveKrishna();
  }, [canAttempt, gameEnabled, moveKrishna]);

  // ── Main catch handler ──
  const handleCatchAttempt = useCallback(
    async (e) => {
      if (!canAttempt || isLoading || !gameStarted || !gameEnabled) return;

      // Debounce (80ms — snappy on PC, prevents double-fire on mobile)
      const now = Date.now();
      if (now - lastInteractionRef.current < 80) return;
      lastInteractionRef.current = now;

      // Play sound
      if (audioRef.current?.paused) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }

      setAttempts((a) => a + 1);
      haptic("light");

      const roll = Math.random();
      const isLucky = roll < catchChance;
      const isNearMiss = !isLucky && roll < catchChance * 2;

      if (isLucky) {
        haptic("success");
        const keychain = await recordCatch();
        if (keychain) {
          const lesson = pick(LESSONS);
          setSuccessMessage(
            `Krishna has blessed you with the "${keychain.name}"! ${keychain.rarity === "rare" ? "RARE DIVINE BLESSING!" : ""}\n\n"${lesson}"`,
          );
          setTease("Divine blessing received!");
          setConsecutiveMisses(0);
          setDifficulty(1);
          setGameStarted(false);
          if (isAuthenticated) fetchLeaderboard();
        }
      } else {
        haptic("miss");
        setConsecutiveMisses((m) => m + 1);
        setTease(isNearMiss ? pick(NEAR_MISS_TEASES) : pick(TEASES));
        // PC: directional flee from cursor; Mobile: random move
        isMobile ? moveKrishna() : fleeFromCursor();
      }
    },
    [
      canAttempt,
      isLoading,
      gameStarted,
      gameEnabled,
      catchChance,
      recordCatch,
      moveKrishna,
      fleeFromCursor,
      isMobile,
      isAuthenticated,
      fetchLeaderboard,
      haptic,
    ],
  );

  // ── Krishna style ──
  const krishnaStyle = useMemo(
    () => ({
      top: position.top,
      left: position.left,
      opacity: isScrolling ? 0.4 : canAttempt && gameEnabled ? 1 : 0.5,
      pointerEvents:
        isScrolling || !canAttempt || !gameEnabled ? "none" : "auto",
      filter: canAttempt && gameEnabled ? "none" : "grayscale(70%)",
      transition:
        "top 0.15s cubic-bezier(0,0.7,0.3,1), left 0.15s cubic-bezier(0,0.7,0.3,1), opacity 0.3s ease",
      zIndex: 30,
      display: gameEnabled ? "block" : "none",
    }),
    [position, isScrolling, canAttempt, gameEnabled],
  );

  // ── Rank icons ──
  const getRankIcon = useCallback((rank) => {
    if (rank === 0) return <FaCrown className="w-2 h-2 text-yellow-400" />;
    if (rank === 1) return <FaMedal className="w-2 h-2 text-gray-400" />;
    if (rank === 2) return <FaAward className="w-2 h-2 text-orange-400" />;
    return <span className="font-bold text-xs">#{rank + 1}</span>;
  }, []);

  // ── Post-login redirect ──
  useEffect(() => {
    const shouldOpen = localStorage.getItem(
      "krishna_open_dashboard_after_login",
    );
    if (
      shouldOpen === "true" &&
      isAuthenticated &&
      gameEnabled &&
      !authLoading
    ) {
      localStorage.removeItem("krishna_open_dashboard_after_login");
      localStorage.removeItem("krishna_redirect_after_login");
      fetchKeychain();
      checkAttemptStatus();
      fetchLeaderboard();
    }
  }, [isAuthenticated, gameEnabled, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  if (authLoading) return null;

  return (
    <div className="krishna-game-container">
      <audio ref={audioRef} src={laugh} preload="auto" />

      {/* ── Game Toggle ── */}
      <div className="fixed top-20 right-3 sm:top-24 sm:right-4 z-40">
        {!gameEnabled ? (
          <button
            onClick={enableGame}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold p-2 sm:py-2 sm:px-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 text-sm flex items-center space-x-0 sm:space-x-2"
            title="Krishna Game"
          >
            <FaGamepad className="w-4 h-4" />
            <span className="hidden sm:inline">Krishna Game</span>
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row items-center space-y-1.5 sm:space-y-0 sm:space-x-2">
            <button
              onClick={() => {
                setShowHUD((v) => !v);
                if (showHUD) setMenuExpanded(false);
              }}
              className={`inline-flex items-center justify-center leading-none p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${
                showHUD
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-600 hover:bg-gray-700 text-gray-200"
              }`}
              title={showHUD ? "Hide HUD" : "Show HUD"}
            >
              {showHUD ? (
                <FaEyeSlash className="w-4 h-4" />
              ) : (
                <IoMenu className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={disableGame}
              className="inline-flex items-center justify-center leading-none bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
              title="Close Game"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ── Compact HUD ── */}
      {gameEnabled && showHUD && (
        <div className="fixed top-32 right-3 sm:top-36 sm:right-4 z-30 bg-black/80 backdrop-blur-sm text-white rounded-lg shadow-xl border border-gray-600 w-56 sm:max-w-xs">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-yellow-300 font-semibold flex items-center text-sm">
                <FaGem className="w-3 h-3 mr-1" />
                Krishna
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-300 min-w-0 max-w-[140px] truncate">
                  {isAuthenticated
                    ? `✓ ${user?.username || user?.name || "User"}`
                    : "Guest"}
                </span>
                <button
                  onClick={() => setShowHUD(false)}
                  className="inline-flex items-center justify-center leading-none text-gray-400 hover:text-white p-1 rounded hover:bg-gray-700"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Difficulty:</span>
                <span className="text-red-300">{difficulty.toFixed(1)}/8</span>
              </div>
              <div className="flex justify-between">
                <span>Chance:</span>
                <span className="text-green-300">
                  {(catchChance * 100).toFixed(1)}%
                </span>
              </div>
              {consecutiveMisses > 0 && (
                <div className="flex justify-between">
                  <span>Misses:</span>
                  <span className="text-orange-300">{consecutiveMisses}</span>
                </div>
              )}
            </div>

            {userKeychain && (
              <div className="mt-2 p-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded border border-yellow-500/30">
                <div className="text-xs text-yellow-200 text-center flex items-center justify-center">
                  <FaCrown className="w-3 h-3 mr-1" />
                  {userKeychain.name}
                </div>
              </div>
            )}

            {!canAttempt && timeUntilNext && (
              <div className="mt-2 p-2 bg-red-600/20 rounded border border-red-500/30">
                <div className="text-xs text-red-200 text-center flex items-center justify-center">
                  <FaClock className="w-3 h-3 mr-1" />
                  Next: {timeUntilNext}
                </div>
              </div>
            )}

            <div className="mt-3 space-y-2">
              {canAttempt && !gameStarted && (
                <button
                  onClick={startGame}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded text-sm flex items-center justify-center"
                >
                  <FaPlay className="w-3 h-3 mr-1" />
                  Start Game
                </button>
              )}
              <button
                onClick={() => {
                  setMenuExpanded((v) => !v);
                  if (!menuExpanded && isAuthenticated) fetchLeaderboard();
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded text-sm flex items-center justify-center"
              >
                <FaChartBar className="w-3 h-3 mr-1" />
                Menu
                {menuExpanded ? (
                  <FaChevronUp className="w-3 h-3 ml-1" />
                ) : (
                  <FaChevronDown className="w-3 h-3 ml-1" />
                )}
              </button>
            </div>
          </div>

          {/* ── Expanded Menu ── */}
          {menuExpanded && (
            <div className="border-t border-gray-600">
              <div className="flex border-b border-gray-600">
                <button
                  onClick={() => setMenuTab("stats")}
                  className={`flex-1 py-2 px-3 text-xs font-semibold flex items-center justify-center ${
                    menuTab === "stats"
                      ? "bg-yellow-600 text-white"
                      : "bg-purple-700/50 text-purple-200 hover:bg-purple-600/50"
                  }`}
                >
                  <IoStatsChart className="w-3 h-3 mr-1" />
                  Stats
                </button>
                <button
                  onClick={() => {
                    setMenuTab("leaderboard");
                    if (isAuthenticated) fetchLeaderboard();
                  }}
                  className={`flex-1 py-2 px-3 text-xs font-semibold flex items-center justify-center ${
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

              <div className="p-3 max-h-60 overflow-y-auto">
                {menuTab === "stats" && (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Catches:</span>
                      <span className="text-yellow-400 font-bold">
                        {totalCatches}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Session Attempts:</span>
                      <span className="text-blue-400 font-bold">
                        {attempts}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Consecutive Misses:</span>
                      <span className="text-orange-400 font-bold">
                        {consecutiveMisses}
                      </span>
                    </div>
                    {sessionStartTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Session Time:</span>
                        <span className="text-green-400 font-bold">
                          {Math.floor((new Date() - sessionStartTime) / 60000)}m
                        </span>
                      </div>
                    )}
                    {!isAuthenticated && (
                      <button
                        onClick={() => {
                          localStorage.setItem(
                            "krishna_redirect_after_login",
                            window.location.pathname,
                          );
                          localStorage.setItem(
                            "krishna_open_dashboard_after_login",
                            "true",
                          );
                          navigate("/login");
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded text-xs flex items-center justify-center mt-2"
                      >
                        Login for Full Stats
                      </button>
                    )}
                  </div>
                )}

                {menuTab === "leaderboard" && (
                  <div className="space-y-2">
                    {!isAuthenticated ? (
                      <div className="text-center py-4">
                        <p className="text-xs text-gray-300 mb-2">
                          Login to view leaderboard
                        </p>
                        <button
                          onClick={() => navigate("/login")}
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
                            className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs"
                            disabled={menuLoading}
                          >
                            <FaSync
                              className={`w-2 h-2 ${menuLoading ? "animate-spin" : ""}`}
                            />
                          </button>
                        </div>
                        {menuLoading ? (
                          <div className="text-center py-4">
                            <FaSync className="w-4 h-4 animate-spin mx-auto mb-1 text-purple-400" />
                            <p className="text-xs text-purple-200">
                              Loading...
                            </p>
                          </div>
                        ) : leaderboardData.length > 0 ? (
                          <div className="space-y-1">
                            {leaderboardData.slice(0, 5).map((entry, i) => (
                              <div
                                key={i}
                                className={`p-2 rounded border text-xs ${
                                  i === 0
                                    ? "bg-yellow-600/20 border-yellow-400/30"
                                    : i === 1
                                      ? "bg-gray-400/20 border-gray-300/30"
                                      : i === 2
                                        ? "bg-orange-600/20 border-orange-400/30"
                                        : "bg-purple-600/20 border-purple-400/30"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-1 min-w-0 flex-1">
                                    {getRankIcon(i)}
                                    <div className="min-w-0">
                                      <div className="font-semibold truncate max-w-[140px]">
                                        {entry.username || "Anonymous"}
                                      </div>
                                      <div className="opacity-70 flex items-center">
                                        <FaGem className="w-1 h-1 mr-1" />
                                        {entry.keychainName}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-yellow-300 font-bold">
                                      {entry.totalCatches || 0}x
                                    </div>
                                    <span className="opacity-70">
                                      {entry.daysSinceCatch === 0
                                        ? "Today"
                                        : `${entry.daysSinceCatch}d`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <FaGem className="w-6 h-6 mx-auto mb-1 text-purple-400" />
                            <p className="text-xs text-purple-200">
                              No blessed devotees yet!
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-600 p-2">
                <button
                  onClick={() => setMenuExpanded(false)}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-1 px-2 rounded text-xs flex items-center justify-center"
                >
                  <FaChevronUp className="w-3 h-3 mr-1" />
                  Close Menu
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Krishna Character ── */}
      {gameEnabled && (
        <div
          // PC: onMouseEnter + onMouseMove give smooth hover-based catching
          onMouseEnter={
            !isMobile && gameStarted && canAttempt
              ? handleCatchAttempt
              : undefined
          }
          onMouseMove={
            !isMobile && gameStarted && canAttempt
              ? handleCatchAttempt
              : undefined
          }
          // Mobile: tap-based catching
          onClick={isMobile ? handleCatchAttempt : undefined}
          onTouchStart={
            isMobile
              ? (e) => {
                  e.preventDefault();
                  handleCatchAttempt(e);
                }
              : undefined
          }
          className={`fixed cursor-pointer text-center select-none touch-manipulation ${
            isLoading ? "animate-pulse" : ""
          } ${gameStarted ? "animate-bounce" : ""}`}
          style={krishnaStyle}
        >
          {/* Larger hit area via padding */}
          <div className={`relative ${isMobile ? "p-4 -m-4" : "p-2 -m-2"}`}>
            <img
              src={kpng}
              alt="Lord Krishna"
              className={`${isMobile ? "w-20" : "w-16"} mx-auto drop-shadow-lg ${
                !canAttempt ? "grayscale" : ""
              } ${isLoading ? "animate-spin" : ""}`}
              draggable="false"
            />

            {gameStarted && canAttempt && (
              <div
                className={`absolute inset-0 bg-gradient-to-r from-yellow-400 via-transparent to-blue-400 rounded-full opacity-30 animate-pulse ${
                  isMobile ? "scale-125" : ""
                }`}
              />
            )}

            {isLoading && (
              <div className="absolute inset-0 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          <div
            className={`font-semibold mt-1 px-2 py-1 rounded-full ${
              isMobile ? "text-sm" : "text-xs"
            } ${
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

      {/* ── Success Modal ── */}
      {successMessage && (
        <div
          onClick={() => setSuccessMessage(null)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-yellow-50 via-white to-orange-50 shadow-2xl p-6 rounded-xl max-w-md w-full text-center space-y-4 border-4 border-yellow-300"
          >
            <div className="text-4xl animate-bounce">
              <GiLotus className="inline text-orange-500" />
            </div>
            <p className="text-base font-medium text-gray-800 leading-relaxed whitespace-pre-line">
              {successMessage}
            </p>
            {!canAttempt && timeUntilNext && (
              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-3 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-700 font-semibold flex items-center justify-center">
                  <IoTime className="w-4 h-4 mr-1" />
                  Next blessing in: {timeUntilNext}
                </p>
              </div>
            )}
            <button
              onClick={() => setSuccessMessage(null)}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full shadow-lg hover:from-yellow-500 hover:to-orange-500 font-semibold flex items-center justify-center mx-auto"
            >
              <FaGem className="w-4 h-4 mr-2" />
              Blessed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingKrishna;
