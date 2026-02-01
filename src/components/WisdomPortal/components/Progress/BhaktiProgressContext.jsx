import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useAuth } from "../../../../Context/AuthContext";

const API = import.meta.env.VITE_API_URL;

// Create context
const BhaktiProgressContext = createContext(null);

// Hook to use context
export const useBhaktiProgress = () => {
  const context = useContext(BhaktiProgressContext);
  if (!context) {
    throw new Error(
      "useBhaktiProgress must be used within a BhaktiProgressProvider",
    );
  }
  return context;
};

// Provider component
export const BhaktiProgressProvider = ({ children }) => {
  const { user } = useAuth();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [bhaktiPillars, setBhaktiPillars] = useState({});
  const [totalProgress, setTotalProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(null);
  const [nextStage, setNextStage] = useState(null);
  const [lilaMap, setLilaMap] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [config, setConfig] = useState(null);

  // Get auth header
  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // Fetch configuration (can be cached)
  const fetchConfig = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/bhakti/config`);
      if (res.data.success) {
        setConfig(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch bhakti config:", error);
    }
  }, []);

  // Fetch user's bhakti progress
  const fetchProgress = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API}/bhakti/progress`, {
        headers: getAuthHeader(),
      });

      if (res.data.success) {
        setBhaktiPillars(res.data.bhaktiPillars);
        setTotalProgress(res.data.totalProgress);
        setCurrentStage(res.data.currentStage);
        setNextStage(res.data.nextStage);
        setLilaMap(res.data.lilaMap);
        setRecentActivities(res.data.recentActivities || []);
      }
    } catch (error) {
      console.error("Failed to fetch bhakti progress:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, getAuthHeader]);

  // Add a spiritual activity
  const addActivity = useCallback(
    async (pillar, activity) => {
      if (!user) return { success: false, message: "Not logged in" };

      try {
        const res = await axios.post(
          `${API}/bhakti/add-activity`,
          { pillar, activity },
          { headers: getAuthHeader() },
        );

        if (res.data.success) {
          // Update local state
          setBhaktiPillars((prev) => ({
            ...prev,
            [pillar]: {
              ...prev[pillar],
              progress: res.data.pillarProgress,
            },
          }));
          setTotalProgress(res.data.totalProgress);
          setCurrentStage(res.data.currentStage);

          // If new location unlocked, update lila map
          if (res.data.locationUnlocked) {
            setLilaMap((prev) => ({
              ...prev,
              currentLocation: res.data.newLocation,
              unlockedLocations: [
                ...(prev?.unlockedLocations || []),
                res.data.newLocation.id,
              ],
            }));
          }

          return {
            success: true,
            pointsEarned: res.data.pointsEarned,
            milestoneUp: res.data.milestoneUp,
            newMilestone: res.data.newMilestone,
            locationUnlocked: res.data.locationUnlocked,
            newLocation: res.data.newLocation,
          };
        }

        return { success: false, message: "Failed to add activity" };
      } catch (error) {
        console.error("Failed to add activity:", error);
        return {
          success: false,
          message: error.response?.data?.message || "Server error",
        };
      }
    },
    [user, getAuthHeader],
  );

  // Daily check-in (Smaranam - remembrance)
  const dailyCheckIn = useCallback(async () => {
    if (!user) return { success: false, message: "Not logged in" };

    try {
      const res = await axios.post(
        `${API}/bhakti/daily-check-in`,
        {},
        {
          headers: getAuthHeader(),
        },
      );

      if (res.data.success) {
        if (!res.data.alreadyCheckedIn) {
          // Refresh progress
          fetchProgress();
        }
        return res.data;
      }

      return { success: false };
    } catch (error) {
      console.error("Daily check-in error:", error);
      return { success: false, message: "Server error" };
    }
  }, [user, getAuthHeader, fetchProgress]);

  // Get detailed lila map data
  const fetchLilaMap = useCallback(async () => {
    if (!user) return null;

    try {
      const res = await axios.get(`${API}/bhakti/lila-map`, {
        headers: getAuthHeader(),
      });

      if (res.data.success) {
        setLilaMap(res.data);
        return res.data;
      }

      return null;
    } catch (error) {
      console.error("Failed to fetch lila map:", error);
      return null;
    }
  }, [user, getAuthHeader]);

  // Get pillar details
  const getPillarDetails = useCallback(
    async (pillarKey) => {
      if (!user) return null;

      try {
        const res = await axios.get(`${API}/bhakti/pillar/${pillarKey}`, {
          headers: getAuthHeader(),
        });

        if (res.data.success) {
          return res.data;
        }

        return null;
      } catch (error) {
        console.error("Failed to fetch pillar details:", error);
        return null;
      }
    },
    [user, getAuthHeader],
  );

  // Get leaderboard
  const getLeaderboard = useCallback(async (limit = 10) => {
    try {
      const res = await axios.get(`${API}/bhakti/leaderboard?limit=${limit}`);

      if (res.data.success) {
        return res.data.leaderboard;
      }

      return [];
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      return [];
    }
  }, []);

  // Initialize on mount and when user changes
  useEffect(() => {
    fetchConfig();
    fetchProgress();

    // Daily check-in on app open
    if (user) {
      dailyCheckIn();
    }
  }, [user, fetchConfig, fetchProgress, dailyCheckIn]);

  // Helper functions for UI
  const getProgressPercent = useCallback(
    (pillarKey) => {
      const pillar = bhaktiPillars[pillarKey];
      if (!pillar || !pillar.nextMilestone) return 100;

      const current = pillar.progress;
      const prevThreshold = pillar.currentMilestone?.threshold || 0;
      const nextThreshold = pillar.nextMilestone.threshold;
      const range = nextThreshold - prevThreshold;
      const progress = current - prevThreshold;

      return Math.min(100, (progress / range) * 100);
    },
    [bhaktiPillars],
  );

  const getStageProgressPercent = useCallback(() => {
    if (!nextStage) return 100;
    const prevThreshold = currentStage?.threshold || 0;
    const range = nextStage.threshold - prevThreshold;
    const progress = totalProgress - prevThreshold;
    return Math.min(100, (progress / range) * 100);
  }, [totalProgress, currentStage, nextStage]);

  const value = {
    // State
    isLoading,
    bhaktiPillars,
    totalProgress,
    currentStage,
    nextStage,
    lilaMap,
    recentActivities,
    config,

    // Actions
    addActivity,
    dailyCheckIn,
    fetchProgress,
    fetchLilaMap,
    getPillarDetails,
    getLeaderboard,

    // Helpers
    getProgressPercent,
    getStageProgressPercent,
  };

  return (
    <BhaktiProgressContext.Provider value={value}>
      {children}
    </BhaktiProgressContext.Provider>
  );
};

export default BhaktiProgressContext;
