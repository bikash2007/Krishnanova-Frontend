import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "../../../Context/AuthContext";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// Devotee Levels based on spiritual progression
export const DEVOTEE_LEVELS = {
  SHRAVAKA: {
    id: "shravaka",
    name: "Shravaka",
    sanskrit: "श्रावक",
    meaning: "Listener",
    minPoints: 0,
    icon: "🌱",
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
    icon: "🪔",
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
    icon: "📿",
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
    icon: "🦚",
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
    icon: "💙",
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
    icon: "✨",
    color: "from-yellow-300 to-amber-400",
    description: "Master of spiritual rasas, tasting divine nectar",
    eventAccess: ["all"],
    badges: ["Vrindavan Resident", "Eternal Companion"],
  },
};

// Emotional Rasas for story tagging
export const EMOTIONAL_RASAS = {
  SHANTA: {
    id: "shanta",
    name: "Shanta",
    meaning: "Peace",
    emoji: "🕊️",
    color: "from-blue-300 to-cyan-400",
    description: "Stories of inner peace and tranquility",
  },
  DASYA: {
    id: "dasya",
    name: "Dasya",
    meaning: "Service",
    emoji: "🙏",
    color: "from-amber-300 to-orange-400",
    description: "Stories of humble service and dedication",
  },
  SAKHYA: {
    id: "sakhya",
    name: "Sakhya",
    meaning: "Friendship",
    emoji: "🤝",
    color: "from-green-300 to-emerald-400",
    description: "Stories of divine friendship and camaraderie",
  },
  VATSALYA: {
    id: "vatsalya",
    name: "Vatsalya",
    meaning: "Parental Love",
    emoji: "💛",
    color: "from-yellow-300 to-amber-400",
    description: "Stories of nurturing divine love",
  },
  MADHURYA: {
    id: "madhurya",
    name: "Madhurya",
    meaning: "Sweet Love",
    emoji: "💕",
    color: "from-pink-300 to-rose-400",
    description: "Stories of the sweetest divine love",
  },
  KARUNA: {
    id: "karuna",
    name: "Karuna",
    meaning: "Compassion",
    emoji: "💙",
    color: "from-indigo-300 to-purple-400",
    description: "Stories of divine compassion and grace",
  },
  ADBHUTA: {
    id: "adbhuta",
    name: "Adbhuta",
    meaning: "Wonder",
    emoji: "✨",
    color: "from-purple-300 to-pink-400",
    description: "Stories of miracles and divine wonder",
  },
  VIRA: {
    id: "vira",
    name: "Vira",
    meaning: "Heroic",
    emoji: "⚔️",
    color: "from-red-300 to-orange-400",
    description: "Stories of spiritual courage and victory",
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
    icon: "🏛️",
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
    icon: "🌟",
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
    icon: "👑",
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
    icon: "🛕",
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
    icon: "🌸",
    activeDevotees: 0,
    color: "#ec4899",
  },
  {
    id: "new_vrindavan",
    name: "New Vrindavan",
    country: "USA",
    coordinates: { lat: 39.8667, lng: -80.6833 },
    significance: "America's spiritual village",
    icon: "🌄",
    activeDevotees: 0,
    color: "#10b981",
  },
  {
    id: "bhaktivedanta_manor",
    name: "Bhaktivedanta Manor",
    country: "UK",
    coordinates: { lat: 51.7167, lng: -0.3667 },
    significance: "ISKCON UK center",
    icon: "🏰",
    activeDevotees: 0,
    color: "#06b6d4",
  },
  {
    id: "radhadesh",
    name: "Radhadesh",
    country: "Belgium",
    coordinates: { lat: 50.3167, lng: 5.0667 },
    significance: "European spiritual retreat",
    icon: "⛰️",
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
            console.log("🎉 Leveled up to:", res.data.devoteeLevel);
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
