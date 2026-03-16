import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "../../../Context/AuthContext";
import axios from "axios";
import {
  FaPray,
  FaHeart,
  FaStar,
  FaCrown,
  FaShieldAlt,
  FaLandmark,
  FaMountain,
  FaDove,
  FaHandsHelping,
} from "react-icons/fa";
import {
  GiCandleLight,
  GiPrayerBeads,
  GiFeather,
  GiLotusFlower,
} from "react-icons/gi";
import { IoSparkles, IoLeaf } from "react-icons/io5";

const API = import.meta.env.VITE_API_URL;

// Devotee Levels based on spiritual progression
export const DEVOTEE_LEVELS = {
  SHRAVAKA: {
    id: "shravaka",
    name: "Shravaka",
    sanskrit: "श्रावक",
    meaning: "Listener",
    minPoints: 0,
    icon: <IoLeaf />,
    color: "from-green-400 to-emerald-500",
    description: "Beginning the journey of listening to divine wisdom",
    eventAccess: ["public", "beginner"],
    badges: ["First Steps"],
  },
  UPASAKA: {
    id: "upasaka",
    name: "Upasaka",
    sanskrit: "उपासक",
    meaning: "Worshipper",
    minPoints: 108,
    icon: <GiCandleLight />,
    color: "from-amber-400 to-orange-500",
    description: "Dedicated to regular practice and worship",
    eventAccess: ["public", "beginner", "intermediate"],
    badges: ["Daily Sadhana", "Mantra Chanter"],
  },
  SADHAKA: {
    id: "sadhaka",
    name: "Sadhaka",
    sanskrit: "साधक",
    meaning: "Practitioner",
    minPoints: 540,
    icon: <GiPrayerBeads />,
    color: "from-purple-400 to-indigo-500",
    description: "Committed spiritual practitioner with regular sadhana",
    eventAccess: ["public", "beginner", "intermediate", "advanced"],
    badges: ["Gita Scholar", "Community Guide"],
  },
  BHAKTA: {
    id: "bhakta",
    name: "Bhakta",
    sanskrit: "भक्त",
    meaning: "Devotee",
    minPoints: 1080,
    icon: <GiFeather />,
    color: "from-cyan-400 to-blue-500",
    description: "True devotee with heart surrendered to Krishna",
    eventAccess: ["public", "beginner", "intermediate", "advanced", "bhakta"],
    badges: ["Temple Keeper", "Wisdom Sharer"],
  },
  PREMI: {
    id: "premi",
    name: "Premi",
    sanskrit: "प्रेमी",
    meaning: "Divine Lover",
    minPoints: 2160,
    icon: <FaHeart />,
    color: "from-pink-400 to-rose-500",
    description: "Immersed in pure divine love for Krishna",
    eventAccess: [
      "public",
      "beginner",
      "intermediate",
      "advanced",
      "bhakta",
      "premi",
    ],
    badges: ["Rasa Dancer", "Krishna Premi"],
  },
  RASIKA: {
    id: "rasika",
    name: "Rasika",
    sanskrit: "रसिक",
    meaning: "Connoisseur of Divine Taste",
    minPoints: 5400,
    icon: <IoSparkles />,
    color: "from-yellow-300 to-amber-400",
    description: "Master of spiritual rasas, tasting divine nectar",
    eventAccess: ["all"],
    badges: ["Vrindavan Resident", "Eternal Companion"],
  },
};

// Bhakti Rasas — the 5 primary relationships with the Divine
export const EMOTIONAL_RASAS = {
  SHANTA: {
    id: "shanta",
    name: "Shanta",
    sanskrit: "शान्त",
    meaning: "Peaceful Neutrality",
    emoji: <FaDove />,
    color: "from-sky-300 to-cyan-500",
    bgColor: "bg-sky-500/15",
    borderColor: "border-sky-400/40",
    textColor: "text-sky-300",
    description: "Serene awe and reverence for the Divine as the all-pervading Absolute.",
    philosophy:
      "Shanta rasa is the foundation — a calm, meditative awareness of God's greatness without personal attachment. The devotee perceives Brahman everywhere, like the sages who see the Lord in silence and stillness.",
    example: "The Four Kumaras, Bhishma on the battlefield",
  },
  DASYA: {
    id: "dasya",
    name: "Dasya",
    sanskrit: "दास्य",
    meaning: "Loving Servitude",
    emoji: <FaPray />,
    color: "from-amber-300 to-orange-500",
    bgColor: "bg-amber-500/15",
    borderColor: "border-amber-400/40",
    textColor: "text-amber-300",
    description: "Devoted service to the Lord as the eternal master and protector.",
    philosophy:
      "Dasya rasa transcends passive peace — the devotee feels personal awe and joyfully serves. Just as Hanuman served Lord Rama with unwavering love, the servant relishes being an instrument of the Divine will.",
    example: "Hanuman, Garuda, Lakshman",
  },
  SAKHYA: {
    id: "sakhya",
    name: "Sakhya",
    sanskrit: "सख्य",
    meaning: "Divine Friendship",
    emoji: <FaHandsHelping />,
    color: "from-emerald-300 to-green-500",
    bgColor: "bg-emerald-500/15",
    borderColor: "border-emerald-400/40",
    textColor: "text-emerald-300",
    description: "Equal companionship and playful intimacy with the Divine.",
    philosophy:
      "In Sakhya rasa, formality dissolves. The devotee and God relate as equals — laughing, teasing, sharing secrets. Krishna's cowherd friends in Vrindavan treated Him as their best friend, unaware of His supreme divinity.",
    example: "Sudama, Arjuna, the cowherd boys of Vrindavan",
  },
  VATSALYA: {
    id: "vatsalya",
    name: "Vatsalya",
    sanskrit: "वात्सल्य",
    meaning: "Parental Love",
    emoji: <FaHeart />,
    color: "from-yellow-300 to-amber-500",
    bgColor: "bg-yellow-500/15",
    borderColor: "border-yellow-400/40",
    textColor: "text-yellow-300",
    description: "Nurturing, protective love as a parent loves the Divine child.",
    philosophy:
      "Vatsalya is the rasa where the devotee becomes the protector. Mother Yashoda sees the Supreme Lord as her little child, feeding Him, scolding Him, and worrying for His safety — turning the cosmic hierarchy upside down through love.",
    example: "Yashoda Ma, Nanda Baba, Devaki",
  },
  MADHURYA: {
    id: "madhurya",
    name: "Madhurya",
    sanskrit: "माधुर्य",
    meaning: "Sweetest Divine Love",
    emoji: <FaHeart />,
    color: "from-pink-300 to-rose-500",
    bgColor: "bg-pink-500/15",
    borderColor: "border-pink-400/40",
    textColor: "text-pink-300",
    description: "The most intimate, all-encompassing love — the soul's complete union with the Divine.",
    philosophy:
      "Madhurya rasa contains all other rasas within it — the beloved serves, befriends, nurtures, and adores the Lord simultaneously. The Gopis of Vrindavan exemplify this — their love for Krishna is the highest expression of bhakti, where the soul longs for nothing but the Divine.",
    example: "Radha Rani, the Gopis of Vrindavan",
  },
};

// Spiritual Hotspots - Sacred locations
export const SPIRITUAL_HOTSPOTS = [
  {
    id: "vrindavan",
    name: "Vrindavan",
    sanskrit: "वृन्दावन",
    country: "India",
    coordinates: { lat: 27.5833, lng: 77.6956 },
    significance: "Krishna's eternal playground",
    icon: <FaLandmark />,
    activeDevotees: 0,
    color: "#fbbf24",
  },
  {
    id: "mathura",
    name: "Mathura",
    sanskrit: "मथुरा",
    country: "India",
    coordinates: { lat: 27.4924, lng: 77.6737 },
    significance: "Krishna's birthplace",
    icon: <FaStar />,
    activeDevotees: 0,
    color: "#f59e0b",
  },
  {
    id: "dwaraka",
    name: "Dwaraka",
    sanskrit: "द्वारका",
    country: "India",
    coordinates: { lat: 22.2376, lng: 68.9674 },
    significance: "Krishna's kingdom",
    icon: <FaCrown />,
    activeDevotees: 0,
    color: "#3b82f6",
  },
  {
    id: "puri",
    name: "Jagannath Puri",
    sanskrit: "जगन्नाथ पुरी",
    country: "India",
    coordinates: { lat: 19.8135, lng: 85.8312 },
    significance: "Lord Jagannath temple",
    icon: <FaLandmark />,
    activeDevotees: 0,
    color: "#8b5cf6",
  },
  {
    id: "mayapur",
    name: "Mayapur",
    sanskrit: "मायापुर",
    country: "India",
    coordinates: { lat: 23.4167, lng: 88.3833 },
    significance: "ISKCON world headquarters",
    icon: <GiLotusFlower />,
    activeDevotees: 0,
    color: "#ec4899",
  },
  {
    id: "new_vrindavan",
    name: "New Vrindavan",
    country: "USA",
    coordinates: { lat: 39.8667, lng: -80.6833 },
    significance: "America's spiritual village",
    icon: <FaMountain />,
    activeDevotees: 0,
    color: "#10b981",
  },
  {
    id: "bhaktivedanta_manor",
    name: "Bhaktivedanta Manor",
    country: "UK",
    coordinates: { lat: 51.7167, lng: -0.3667 },
    significance: "ISKCON UK center",
    icon: <FaLandmark />,
    activeDevotees: 0,
    color: "#06b6d4",
  },
  {
    id: "radhadesh",
    name: "Radhadesh",
    country: "Belgium",
    coordinates: { lat: 50.3167, lng: 5.0667 },
    significance: "European spiritual retreat",
    icon: <FaMountain />,
    activeDevotees: 0,
    color: "#84cc16",
  },
];

const SangaContext = createContext(null);

export const useSanga = () => {
  const context = useContext(SangaContext);
  if (!context) {
    throw new Error("useSanga must be used within a SangaProvider");
  }
  return context;
};

export const SangaProvider = ({ children }) => {
  const { user } = useAuth();

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Devotee progression state - starts with localStorage fallback, then syncs with backend
  const [devoteeData, setDevoteeData] = useState(() => {
    const saved = localStorage.getItem("krishnova_devotee_data");
    return saved
      ? JSON.parse(saved)
      : {
          points: 0,
          level: "SHRAVAKA",
          badges: [],
          joinedEvents: [],
          sharedStories: [],
          vibration: "peaceful",
          favoriteRasas: [],
          currentHotspot: null,
          lastActive: new Date().toISOString(),
        };
  });

  // Community state
  const [communityStats, setCommunityStats] = useState({
    totalDevotees: 0,
    activeNow: 0,
    storiesShared: 0,
    eventsHeld: 0,
  });

  const [hotspotActivity, setHotspotActivity] = useState(SPIRITUAL_HOTSPOTS);
  const [similarSouls, setSimilarSouls] = useState([]);

  // Get auth header
  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // Fetch user's sanga profile from backend
  const fetchSangaProfile = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API}/sanga/profile`, {
        headers: getAuthHeader(),
      });

      if (res.data.success) {
        const profile = res.data.profile;
        setDevoteeData((prev) => ({
          ...prev,
          points: profile.spiritualPoints || 0,
          level: (profile.devoteeLevel || "shravaka").toUpperCase(),
          badges: profile.badges?.map((b) => b.name) || [],
          vibration: profile.currentVibration || "peaceful",
          favoriteRasas: profile.favoriteRasas || [],
          currentHotspot: profile.currentHotspot,
          lastActive: profile.lastActiveAt || new Date().toISOString(),
        }));
      }
    } catch (error) {
      console.error("Failed to fetch sanga profile:", error);
      // Continue with localStorage data as fallback
    } finally {
      setIsLoading(false);
    }
  }, [user, getAuthHeader]);

  // Fetch hotspots with real activity data
  const fetchHotspots = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/sanga/hotspots`);
      if (res.data.success) {
        setHotspotActivity(res.data.hotspots);
      }
    } catch (error) {
      console.error("Failed to fetch hotspots:", error);
      // Keep default hotspots
    }
  }, []);

  // Fetch community stats
  const fetchCommunityStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/sanga/community-stats`);
      if (res.data.success) {
        setCommunityStats(res.data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch community stats:", error);
    }
  }, []);

  // Initialize - fetch data on mount and when user changes
  useEffect(() => {
    fetchSangaProfile();
    fetchHotspots();
    fetchCommunityStats();
  }, [user, fetchSangaProfile, fetchHotspots, fetchCommunityStats]);

  // Heartbeat - keep presence active
  useEffect(() => {
    if (!user) return;

    const sendHeartbeat = async () => {
      try {
        await axios.put(
          `${API}/sanga/heartbeat`,
          {},
          { headers: getAuthHeader() },
        );
      } catch (error) {
        // Silent fail for heartbeat
      }
    };

    // Send heartbeat every 5 minutes
    const interval = setInterval(sendHeartbeat, 5 * 60 * 1000);
    sendHeartbeat(); // Send immediately

    return () => clearInterval(interval);
  }, [user, getAuthHeader]);

  // Save devotee data to localStorage as backup
  useEffect(() => {
    localStorage.setItem("krishnova_devotee_data", JSON.stringify(devoteeData));
  }, [devoteeData]);

  // Calculate current level
  const getCurrentLevel = useCallback(() => {
    const levels = Object.values(DEVOTEE_LEVELS).sort(
      (a, b) => b.minPoints - a.minPoints,
    );
    for (const level of levels) {
      if (devoteeData.points >= level.minPoints) {
        return level;
      }
    }
    return DEVOTEE_LEVELS.SHRAVAKA;
  }, [devoteeData.points]);

  // Add points for spiritual activities - NOW SYNCS TO BACKEND
  const addSpiritualPoints = useCallback(
    async (activity, points = 1) => {
      const pointValues = {
        meditation: 3,
        chanting: 2,
        reading_gita: 5,
        sharing_story: 10,
        attending_event: 15,
        helping_devotee: 8,
        daily_login: 1,
        completing_practice: 5,
      };

      const earnedPoints = pointValues[activity] || points;

      // Optimistic update
      setDevoteeData((prev) => {
        const newPoints = prev.points + earnedPoints;
        const newLevel = Object.values(DEVOTEE_LEVELS)
          .sort((a, b) => b.minPoints - a.minPoints)
          .find((l) => newPoints >= l.minPoints);

        return {
          ...prev,
          points: newPoints,
          level: newLevel?.id.toUpperCase() || prev.level,
          lastActive: new Date().toISOString(),
        };
      });

      // Sync to backend if user is logged in
      if (user) {
        try {
          const res = await axios.post(
            `${API}/sanga/add-points`,
            { activity },
            { headers: getAuthHeader() },
          );

          if (res.data.success && res.data.leveledUp) {
            // Could trigger a level-up animation here
            console.log("Leveled up to:", res.data.devoteeLevel);
          }
        } catch (error) {
          console.error("Failed to sync points:", error);
          // Points are still saved locally
        }
      }

      return earnedPoints;
    },
    [user, getAuthHeader],
  );

  // Check if user can access event
  const canAccessEvent = useCallback(
    (eventLevel) => {
      const currentLevel = getCurrentLevel();
      return (
        currentLevel.eventAccess.includes(eventLevel) ||
        currentLevel.eventAccess.includes("all")
      );
    },
    [getCurrentLevel],
  );

  // Add badge - NOW SYNCS TO BACKEND
  const addBadge = useCallback(
    async (badge) => {
      // Optimistic update
      setDevoteeData((prev) => {
        if (prev.badges.includes(badge)) return prev;
        return {
          ...prev,
          badges: [...prev.badges, badge],
        };
      });

      // Sync to backend
      if (user) {
        try {
          await axios.post(
            `${API}/sanga/add-badge`,
            { badge },
            { headers: getAuthHeader() },
          );
        } catch (error) {
          console.error("Failed to sync badge:", error);
        }
      }
    },
    [user, getAuthHeader],
  );

  // Update vibration/mood - NOW SYNCS TO BACKEND
  const setVibration = useCallback(
    async (vibration) => {
      setDevoteeData((prev) => ({
        ...prev,
        vibration,
      }));

      if (user) {
        try {
          await axios.put(
            `${API}/sanga/vibration`,
            { vibration },
            { headers: getAuthHeader() },
          );
        } catch (error) {
          console.error("Failed to sync vibration:", error);
        }
      }
    },
    [user, getAuthHeader],
  );

  // Set favorite rasas - NOW SYNCS TO BACKEND
  const setFavoriteRasas = useCallback(
    async (rasas) => {
      setDevoteeData((prev) => ({
        ...prev,
        favoriteRasas: rasas,
      }));

      if (user) {
        try {
          await axios.put(
            `${API}/sanga/rasas`,
            { rasas },
            { headers: getAuthHeader() },
          );
        } catch (error) {
          console.error("Failed to sync rasas:", error);
        }
      }
    },
    [user, getAuthHeader],
  );

  // Single-select rasa helper (sends as array[1] for backend compatibility)
  const setSelectedRasa = useCallback(
    async (rasaId) => {
      await setFavoriteRasas(rasaId ? [rasaId] : []);
    },
    [setFavoriteRasas],
  );

  // Get the single selected rasa (first element of favoriteRasas)
  const getSelectedRasa = useCallback(() => {
    return devoteeData.favoriteRasas?.[0] || null;
  }, [devoteeData.favoriteRasas]);

  // Join a hotspot - NOW SYNCS TO BACKEND
  const joinHotspot = useCallback(
    async (hotspotId) => {
      setDevoteeData((prev) => ({
        ...prev,
        currentHotspot: hotspotId,
      }));

      // Optimistic UI update
      setHotspotActivity((prev) =>
        prev.map((h) =>
          h.id === hotspotId
            ? { ...h, activeDevotees: h.activeDevotees + 1 }
            : h,
        ),
      );

      if (user) {
        try {
          await axios.post(
            `${API}/sanga/join-hotspot`,
            { hotspotId },
            { headers: getAuthHeader() },
          );
          // Refresh hotspots to get accurate counts
          fetchHotspots();
        } catch (error) {
          console.error("Failed to join hotspot:", error);
        }
      }
    },
    [user, getAuthHeader, fetchHotspots],
  );

  // Leave hotspot
  const leaveHotspot = useCallback(async () => {
    const currentHotspot = devoteeData.currentHotspot;

    setDevoteeData((prev) => ({
      ...prev,
      currentHotspot: null,
    }));

    // Optimistic UI update
    if (currentHotspot) {
      setHotspotActivity((prev) =>
        prev.map((h) =>
          h.id === currentHotspot
            ? { ...h, activeDevotees: Math.max(0, h.activeDevotees - 1) }
            : h,
        ),
      );
    }

    if (user) {
      try {
        await axios.post(
          `${API}/sanga/leave-hotspot`,
          {},
          { headers: getAuthHeader() },
        );
        fetchHotspots();
      } catch (error) {
        console.error("Failed to leave hotspot:", error);
      }
    }
  }, [user, getAuthHeader, devoteeData.currentHotspot, fetchHotspots]);

  // Get devotees with similar vibration - NOW FETCHES FROM BACKEND
  const getSimilarDevotees = useCallback(async () => {
    if (!user) {
      // Return mock data for non-logged in users
      const mockDevotees = [
        {
          name: "Radha Das",
          vibration: "peaceful",
          level: "SADHAKA",
          avatar: null,
        },
        {
          name: "Krishna Priya",
          vibration: "joyful",
          level: "BHAKTA",
          avatar: null,
        },
        {
          name: "Govinda Gopal",
          vibration: "devoted",
          level: "UPASAKA",
          avatar: null,
        },
      ];
      return mockDevotees.filter((d) => d.vibration === devoteeData.vibration);
    }

    try {
      const res = await axios.get(`${API}/sanga/similar-souls`, {
        headers: getAuthHeader(),
      });

      if (res.data.success) {
        setSimilarSouls(res.data.souls);
        return res.data.souls;
      }
    } catch (error) {
      console.error("Failed to fetch similar souls:", error);
    }

    return [];
  }, [user, getAuthHeader, devoteeData.vibration]);

  // Get next level progress
  const getNextLevelProgress = useCallback(() => {
    const levels = Object.values(DEVOTEE_LEVELS).sort(
      (a, b) => a.minPoints - b.minPoints,
    );
    const currentIdx = levels.findIndex(
      (l) => l.id.toUpperCase() === devoteeData.level,
    );

    if (currentIdx === levels.length - 1) {
      return { current: 100, next: null, pointsNeeded: 0 };
    }

    const current = levels[currentIdx];
    const next = levels[currentIdx + 1];
    const progress =
      ((devoteeData.points - current.minPoints) /
        (next.minPoints - current.minPoints)) *
      100;

    return {
      current: Math.min(progress, 100),
      next,
      pointsNeeded: next.minPoints - devoteeData.points,
    };
  }, [devoteeData.level, devoteeData.points]);

  const value = {
    devoteeData,
    currentLevel: getCurrentLevel(),
    communityStats,
    hotspotActivity,
    similarSouls,
    isLoading,
    DEVOTEE_LEVELS,
    EMOTIONAL_RASAS,
    addSpiritualPoints,
    canAccessEvent,
    addBadge,
    setVibration,
    setFavoriteRasas,
    setSelectedRasa,
    getSelectedRasa,
    joinHotspot,
    leaveHotspot,
    getSimilarDevotees,
    getNextLevelProgress,
    refreshHotspots: fetchHotspots,
    refreshCommunityStats: fetchCommunityStats,
    refreshProfile: fetchSangaProfile,
  };

  return (
    <SangaContext.Provider value={value}>{children}</SangaContext.Provider>
  );
};

export default SangaContext;
