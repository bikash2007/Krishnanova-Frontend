import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../../Context/baseUrl";
import Navigation from "../Navigation/Navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaEdit,
  FaTrash,
  FaComment,
  FaImage,
  FaTimes,
  FaGlobe,
  FaClock,
  FaUsers,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPray,
  FaCrown,
  FaFeatherAlt,
} from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

// Floating Sacred Elements
const FloatingSacredElements = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          animation: "float 30s linear infinite",
        }}
      />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #fbbf24 1px, transparent 1px),
            linear-gradient(to bottom, #fbbf24 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
};

// User Badge Component
const UserBadge = ({ user, size = "md" }) => {
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  };

  if (user?.role === "admin") {
    return (
      <div
        className={`inline-flex items-center space-x-1 bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 font-bold rounded-full ${sizeClasses[size]}`}
      >
        <FaCrown size={size === "sm" ? 8 : 10} />
        <span className="hidden sm:inline">ADMIN</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center space-x-1 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 text-cyan-300 border border-cyan-400/30 font-semibold rounded-full ${sizeClasses[size]}`}
    >
      <FaPray size={size === "sm" ? 8 : 10} />
      <span className="hidden sm:inline">DEVOTEE</span>
    </div>
  );
};

// Avatar Component
const Avatar = ({ user, size = "w-10 h-10", baseUrl }) => {
  const getAvatarUrl = () => {
    if (!user?.avatar)
      return `https://ui-avatars.com/api/?name=${
        user?.name || "U"
      }&background=fbbf24&color=1e3a8a`;
    if (user.avatar.startsWith("http")) return user.avatar;
    return baseUrl + user.avatar;
  };

  return (
    <div
      className={`${size} rounded-full overflow-hidden border-2 border-amber-400/30 flex-shrink-0`}
    >
      <img
        src={getAvatarUrl()}
        alt={user?.name || "User"}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = `https://ui-avatars.com/api/?name=${
            user?.name || "U"
          }&background=fbbf24&color=1e3a8a`;
        }}
      />
    </div>
  );
};

// Tab Navigation
const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "posts", label: "Sacred Posts", icon: FaFeatherAlt },
    { id: "events", label: "Divine Events", icon: FaCalendarAlt },
  ];

  return (
    <div className="mb-6 sm:mb-8 px-4">
      <div className="flex justify-center">
        <div className="backdrop-blur-md bg-white/10 rounded-full p-1 border border-white/20 w-full sm:w-auto">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base ${
                    isActive
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900"
                      : "text-blue-100 hover:text-amber-300"
                  }`}
                >
                  <Icon size={16} className="sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">
                    {tab.id === "posts" ? "Posts" : "Events"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Post Card Component
const PostCard = ({ post, user, onLike, baseUrl, index }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const isLiked = user && post.likes?.includes(user._id);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = Math.floor((now - postDate) / (1000 * 60 * 60));
    if (diff < 1) return "Just now";
    if (diff < 24) return `${diff}h ago`;
    return `${Math.floor(diff / 24)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 shadow-xl overflow-hidden hover:border-amber-400/30 transition-all duration-300"
    >
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Avatar
              user={post.author}
              baseUrl={baseUrl}
              size="w-8 h-8 sm:w-10 sm:h-10"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <h3 className="font-bold text-amber-300 text-sm sm:text-base truncate">
                  {post.author?.name || "Anonymous"}
                </h3>
                <UserBadge user={post.author} size="sm" />
              </div>
              <div className="flex items-center space-x-2 text-blue-100/60 text-xs sm:text-sm">
                <FaClock size={10} />
                <span>{formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          <h2 className="text-base sm:text-lg font-bold text-blue-100 mb-2">
            {post.title}
          </h2>
          <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed">
            {showFullContent || post.content.length <= 150
              ? post.content
              : `${post.content.substring(0, 150)}...`}
          </p>
          {post.content.length > 150 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-amber-300 hover:text-amber-200 text-sm mt-2"
            >
              {showFullContent ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* Image */}
        {post.image && (
          <div className="mt-4 -mx-4 sm:-mx-6">
            <img
              src={
                post.image.startsWith("http")
                  ? post.image
                  : baseUrl + post.image
              }
              alt="Post"
              className="w-full h-48 sm:h-64 object-cover"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-4 sm:space-x-6 mt-4 pt-4 border-t border-white/10">
          <button
            onClick={() => onLike(post._id)}
            disabled={!user}
            className={`flex items-center space-x-1 sm:space-x-2 text-sm ${
              isLiked ? "text-red-500" : "text-blue-100/60"
            }`}
          >
            {isLiked ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
            <span>{post.likes?.length || 0}</span>
          </button>
          <button className="flex items-center space-x-1 sm:space-x-2 text-blue-100/60 text-sm">
            <FaComment size={14} />
            <span>{post.comments?.length || 0}</span>
          </button>
          <button className="flex items-center space-x-1 sm:space-x-2 text-blue-100/60 text-sm">
            <FaShareAlt size={14} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const EventCard = ({ event, user, baseUrl, index }) => {
  const [status, setStatus] = useState("upcoming");

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const start = new Date(event.dateTime);
      // Fallback to duration or default 1 hour if endDateTime missing (for old events)
      const end = event.endDateTime
        ? new Date(event.endDateTime)
        : new Date(start.getTime() + (event.duration || 60) * 60000);

      if (now > end) {
        setStatus("ended");
      } else if (now >= start) {
        setStatus("ongoing");
      } else {
        setStatus("upcoming");
      }
    };

    checkStatus();
    const timer = setInterval(checkStatus, 60000); // Update every minute
    return () => clearInterval(timer);
  }, [event]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getButtonConfig = () => {
    switch (status) {
      case "ended":
        return {
          text: "Event Ended",
          classes: "bg-gray-600/50 text-gray-400 cursor-not-allowed border border-gray-600",
          disabled: true,
        };
      case "ongoing":
        return {
          text: "Join Live Event 🔴",
          classes: "bg-gradient-to-r from-green-400 to-cyan-400 text-indigo-900 animate-pulse hover:shadow-green-500/30",
          disabled: false,
        };
      default:
        return {
          text: "Join Event",
          classes: "bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 hover:shadow-amber-500/30",
          disabled: false,
        };
    }
  };

  const btnConfig = getButtonConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 shadow-xl overflow-hidden hover:border-amber-400/30 transition-all duration-300"
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Avatar
              user={event.organizer}
              baseUrl={baseUrl}
              size="w-8 h-8 sm:w-10 sm:h-10"
            />
            <div>
              <h4 className="font-semibold text-amber-300 text-sm sm:text-base">
                {event.organizer?.name}
              </h4>
              <p className="text-xs text-blue-100/60">Event Organizer</p>
            </div>
          </div>
          {status === "ongoing" && (
             <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs font-bold rounded-full border border-red-500/30 animate-pulse">
               LIVE
             </span>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-blue-100 mb-2">
          {event.title}
        </h3>
        <p className="text-blue-100/80 text-sm mb-4">{event.description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 text-blue-100/70">
            <FaCalendarAlt size={12} />
            <span>{formatDate(event.dateTime)}</span>
          </div>
          <div className="flex items-center space-x-2 text-blue-100/70">
            <FaClock size={12} />
            <span>
              {event.duration ? `${event.duration} mins` : "Duration N/A"} •{" "}
              {status === "upcoming" ? "Starts soon" : status === "ongoing" ? "Happening now" : "Ended"}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-blue-100/70">
            <FaMapMarkerAlt size={12} />
            <span className="truncate">{event.location?.city || "Online"}</span>
          </div>
          <div className="flex items-center space-x-2 text-blue-100/70">
            <FaUsers size={12} />
            <span>{event.participants?.length || 0} participants</span>
          </div>
        </div>

        <button
          disabled={btnConfig.disabled}
          className={`w-full mt-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${btnConfig.classes}`}
        >
          {btnConfig.text}
        </button>
      </div>
    </motion.div>
  );
};

// Main Component
export default function CommunityBlog() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const baseUrl = useApi();
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      // Handle pagination structure
      const res = await axios.get(`${API}/blog?page=1&limit=20`); // Initial load
      setPosts(res.data.posts || []); 
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    }
  }, []);

  // Fetch events
  const fetchEvents = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/community-events`);
      setEvents(res.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
      await Promise.all([fetchPosts(), fetchEvents()]);
      setDataLoading(false);
    };
    loadData();
  }, [fetchPosts, fetchEvents]);

  // Handle like
  const handleLike = async (postId) => {
    if (!user) return navigate("/login");

    const originalPosts = [...posts];
    
    // Optimistic Update
    setPosts(prevPosts => 
      prevPosts.map(p => {
        if (p._id === postId) {
          const isLiked = p.likes.includes(user._id);
          return {
            ...p,
            likes: isLiked 
              ? p.likes.filter(id => id !== user._id)
              : [...p.likes, user._id]
          };
        }
        return p;
      })
    );

    try {
      await axios.post(
        `${API}/blog/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // No need to fetchPosts() if successful, as we're already updated
    } catch (error) {
      console.error("Error liking post:", error);
      setPosts(originalPosts); // Revert on failure
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      <Navigation />
      <FloatingSacredElements />

      <div className="relative z-10 max-w-4xl mx-auto pt-20 sm:pt-24 pb-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 px-4">
          <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 rounded-full px-3 sm:px-5 py-1.5 sm:py-2.5 mb-4 sm:mb-6">
            <span className="text-amber-300 animate-pulse text-sm sm:text-lg">
              ✦
            </span>
            <span className="text-amber-100 font-medium text-xs sm:text-sm">
              कृष्णोवा समुदाय
            </span>
            <span className="text-amber-300 animate-pulse text-sm sm:text-lg">
              ✦
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
              Krishna Community
            </span>
          </h1>
          <p className="text-blue-100/80 text-sm sm:text-lg px-4">
            {activeTab === "posts"
              ? "Share divine wisdom"
              : "Join sacred gatherings"}
          </p>
        </div>

        {/* Tabs */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content */}
        <div className="px-4">
          <AnimatePresence mode="wait">
            {activeTab === "posts" ? (
              <motion.div
                key="posts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 sm:space-y-6"
              >
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      user={user}
                      onLike={handleLike}
                      baseUrl={baseUrl}
                      index={index}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-amber-300 text-lg">No posts yet</p>
                    <p className="text-blue-100/60 mt-2">
                      Be the first to share wisdom!
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="events"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 sm:space-y-6"
              >
                {events.length > 0 ? (
                  events.map((event, index) => (
                    <EventCard
                      key={event._id}
                      event={event}
                      user={user}
                      baseUrl={baseUrl}
                      index={index}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-amber-300 text-lg">
                      No events scheduled
                    </p>
                    <p className="text-blue-100/60 mt-2">
                      Check back soon for divine gatherings!
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
