import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../../Context/baseUrl";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCrown,
  FaPray,
  FaFire,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaBook,
  FaOm,
  FaGlobe,
  FaEye,
  FaClock,
  FaUsers,
  FaPen,
  FaLandmark,
  FaTicketAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaHandshake,
  FaShareAlt,
  FaCommentDots,
} from "react-icons/fa";
import { GiMeditation } from "react-icons/gi";
import { IoSparkles } from "react-icons/io5";

// Import Sanga components for the preview
import {
  SangaProvider,
  LevelProgressMini,
  RasaTag,
  DevoteeInlineBadge,
} from "./SangaSystem";

// Helper function - Backend now returns full URLs
const getFullUrl = (url) => {
  return url || null;
};

// Generate fallback avatar URL
const getFallbackAvatar = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=random&size=128`;
};

// Transform post data - Backend now sends full URLs already
const transformPostData = (post) => {
  return post; // No transformation needed - backend sends full URLs
};

// Avatar component with Krishnova theme
const Avatar = ({ user, size = "w-12 h-12", baseUrl, showOnline = false }) => {
  const [imageError, setImageError] = useState(false);

  const getAvatarUrl = () => {
    if (imageError || !user?.avatar) return null;
    if (user.avatar.startsWith("http")) return user.avatar;
    return `${baseUrl}${user.avatar.startsWith("/") ? "" : "/"}${user.avatar}`;
  };

  const avatarUrl = getAvatarUrl();
  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="relative">
      <motion.div whileHover={{ scale: 1.05 }}>
        {avatarUrl && !imageError ? (
          <img
            src={avatarUrl}
            alt={user?.name || "User"}
            className={`${size} rounded-full object-cover border-2 border-fuchsia-400/30`}
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className={`${size} rounded-full border-2 border-fuchsia-400/30 flex items-center justify-center bg-gradient-to-br from-[#d946ef] to-[#63297D] text-white font-bold`}
          >
            {initial}
          </div>
        )}
      </motion.div>
      {showOnline && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-indigo-900 rounded-full" />
      )}
    </div>
  );
};

// User Badge with Krishnova theme
const UserBadge = ({ user, size = "sm" }) => {
  const isAdmin = user?.role === "admin";
  return (
    <div
      className={`inline-flex items-center space-x-1 ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      } rounded-full ${
        isAdmin
          ? "bg-gradient-to-r from-[#d946ef] to-[#63297D] text-white"
          : "bg-cyan-500/15 text-cyan-200 border border-cyan-400/25"
      } font-semibold`}
    >
      <span>
        {isAdmin ? (
          <FaCrown className="inline" />
        ) : (
          <FaPray className="inline" />
        )}
      </span>
      <span>{isAdmin ? "ADMIN" : "DEVOTEE"}</span>
    </div>
  );
};

// Countdown Timer Component
const CountdownTimer = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();

      if (difference <= 0) {
        setIsComplete(true);
        if (onComplete) onComplete();
        return {};
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (isComplete) return null;

  return (
    <div className="flex items-center gap-2 text-xs">
      {timeLeft.days > 0 && (
        <div className="flex items-center gap-1">
          <span className="px-2 py-1 bg-fuchsia-400/20 rounded text-fuchsia-300 font-bold">
            {timeLeft.days}d
          </span>
        </div>
      )}
      <div className="flex items-center gap-1">
        <span className="px-2 py-1 bg-fuchsia-400/20 rounded text-fuchsia-300 font-bold">
          {String(timeLeft.hours || 0).padStart(2, "0")}h
        </span>
        <span className="px-2 py-1 bg-fuchsia-400/20 rounded text-fuchsia-300 font-bold">
          {String(timeLeft.minutes || 0).padStart(2, "0")}m
        </span>
        <span className="px-2 py-1 bg-fuchsia-400/20 rounded text-fuchsia-300 font-bold">
          {String(timeLeft.seconds || 0).padStart(2, "0")}s
        </span>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon, value, label, gradient, delay }) => (
  <div>
    <div className="bg-white/[0.06] rounded-2xl shadow-xl shadow-black/10 p-4 md:p-6 border border-white/[0.1] hover:border-fuchsia-400/20 transition-all duration-300 text-center">
      <div
        className={`w-10 h-10 md:w-14 md:h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl md:text-2xl shadow-lg`}
      >
        {icon}
      </div>
      <div className="text-xl md:text-2xl font-bold text-white mb-1">
        {value}
      </div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  </div>
);

// Social Post Card Component
const SocialPostCard = ({ post, baseUrl, index }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const d = new Date(date);
    const diff = Math.floor((now - d) / (1000 * 60));
    if (diff < 1) return "now";
    if (diff < 60) return `${diff}m`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return `${Math.floor(diff / 1440)}d`;
  };

  const truncate = (text, max = 120) =>
    text.length <= max ? text : text.slice(0, max) + "...";

  return (
    <div className="group">
      <div className="backdrop-blur-xl bg-white/[0.06] rounded-2xl shadow-xl shadow-black/10 border border-white/[0.1] hover:border-fuchsia-400/20 transition-all duration-300 overflow-hidden">
        <div className="p-5 sm:p-6">
          {/* Author Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar
                user={post.author}
                baseUrl={baseUrl}
                size="w-11 h-11"
                showOnline
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-white">
                    {post.author?.name || "Anonymous Devotee"}
                  </h4>
                  <DevoteeInlineBadge
                    level={post.author?.devoteeLevel}
                    points={post.author?.spiritualPoints}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{formatTimeAgo(post.createdAt)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FaGlobe className="inline text-[10px]" /> Public
                  </span>
                </div>
              </div>
            </div>
            {/* Rasa Tags for Story */}
            {post.rasas?.length > 0 && (
              <div className="flex gap-1">
                {post.rasas.slice(0, 2).map((rasa) => (
                  <RasaTag key={rasa} rasaId={rasa} size="xs" />
                ))}
              </div>
            )}
            {(post.likes?.length || 0) > 10 && !post.rasas?.length && (
              <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white">
                <FaFire className="inline" /> Trending
              </span>
            )}
          </div>

          {/* Post Content */}
          <Link to={`/blog/${post._id}`}>
            <h3 className="font-bold text-xl mb-3 text-white hover:text-fuchsia-300 transition-colors cursor-pointer">
              {post.title}
            </h3>
          </Link>

          <p className="text-slate-300 text-sm mb-4 leading-relaxed">
            {showFullText ? post.content : truncate(post.content, 100)}
            {post.content.length > 100 && (
              <button
                onClick={() => setShowFullText(!showFullText)}
                className="text-fuchsia-400 hover:text-fuchsia-300 ml-1 font-medium"
              >
                {showFullText ? "Show less" : "Read more"}
              </button>
            )}
          </p>

          {/* Post Image */}
          {post.image && (
            <Link to={`/blog/${post._id}`}>
              <div className="relative overflow-hidden rounded-xl mb-4 group/image cursor-pointer border border-white/10">
                <img
                  src={
                    post.image.startsWith("http")
                      ? post.image
                      : baseUrl + post.image
                  }
                  alt="Post"
                  className="w-full h-48 object-cover group-hover/image:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="px-4 py-2 bg-gradient-to-r from-[#d946ef] to-[#63297D] rounded-full text-white font-bold text-sm flex items-center gap-2">
                    <FaEye className="inline" />
                    <span>Read Full Post</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Engagement Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors duration-200 ${
                  isLiked
                    ? "text-rose-400 bg-rose-500/10"
                    : "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                }`}
              >
                <span>
                  {isLiked ? (
                    <FaHeart className="inline" />
                  ) : (
                    <FaRegHeart className="inline" />
                  )}
                </span>
                <span className="text-sm font-medium">
                  {post.likes?.length || 0}
                </span>
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors duration-200">
                <FaCommentDots className="inline" />
                <span className="text-sm font-medium">
                  {post.comments?.length || 0}
                </span>
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors duration-200">
                <FaShareAlt className="inline" />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
            <button className="text-slate-400 hover:text-fuchsia-400 transition-colors duration-200 p-1.5 rounded-lg hover:bg-fuchsia-400/10">
              <FaStar className="inline" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Event Card with Krishnova theme
const EventCard = ({ event, baseUrl, index }) => {
  const [eventStatus, setEventStatus] = useState("upcoming");
  const [showTimer, setShowTimer] = useState(true);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const typeConfig = {
    meditation: {
      icon: <GiMeditation />,
      gradient: "from-purple-400 to-indigo-500",
    },
    prayer: { icon: <FaPray />, gradient: "from-[#d946ef] to-[#63297D]" },
    discourse: { icon: <FaBook />, gradient: "from-cyan-400 to-blue-500" },
    festival: {
      icon: <IoSparkles />,
      gradient: "from-fuchsia-400 to-purple-500",
    },
    community_service: {
      icon: <FaHandshake />,
      gradient: "from-green-400 to-cyan-500",
    },
    other: { icon: <FaCalendarAlt />, gradient: "from-purple-400 to-pink-500" },
  };

  const config = typeConfig[event.eventType] || typeConfig.other;

  useEffect(() => {
    const checkEventStatus = () => {
      const now = new Date();
      const eventDate = new Date(event.dateTime);
      let eventEndDate;
      if (event.endDateTime) {
        eventEndDate = new Date(event.endDateTime);
      } else {
        eventEndDate = new Date(eventDate);
        eventEndDate.setHours(23, 59, 59, 999);
      }

      if (now >= eventDate && now <= eventEndDate) {
        setEventStatus("ongoing");
        setShowTimer(false);
      } else if (now > eventEndDate) {
        setEventStatus("ended");
        setShowTimer(false);
      } else {
        setEventStatus("upcoming");
        const hoursUntilEvent = (eventDate - now) / (1000 * 60 * 60);
        setShowTimer(hoursUntilEvent <= 48);
      }
    };

    checkEventStatus();
    const interval = setInterval(checkEventStatus, 60000);

    return () => clearInterval(interval);
  }, [event.dateTime, event.endDateTime]);

  const getStatusBadge = () => {
    switch (eventStatus) {
      case "ongoing":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-green-400 to-cyan-400 text-indigo-900">
            <span className="w-2 h-2 bg-red-500 rounded-full inline-block mr-1"></span>{" "}
            ONGOING
          </span>
        );
      case "upcoming":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-500 text-white">
            UPCOMING
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group">
      <div className="bg-white/[0.06] rounded-2xl shadow-xl shadow-black/10 border border-white/[0.1] hover:border-fuchsia-400/20 transition-all duration-300 overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-2xl shadow-lg`}
              >
                {config.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-white">
                    {event.organizer?.name}
                  </h4>
                  <UserBadge user={event.organizer} size="sm" />
                </div>
                <p className="text-xs text-slate-400">Event Organizer</p>
              </div>
            </div>
            {getStatusBadge()}
          </div>

          <h3 className="font-bold text-lg mb-3 text-white">{event.title}</h3>

          {showTimer && eventStatus === "upcoming" && (
            <div className="mb-3 p-2 bg-gradient-to-r from-fuchsia-400/10 to-purple-400/10 rounded-lg border border-fuchsia-400/30">
              <div className="flex items-center justify-between">
                <span className="text-xs text-fuchsia-300 font-semibold">
                  <FaClock className="inline mr-1" /> Registration closes in:
                </span>
                <CountdownTimer
                  targetDate={event.dateTime}
                  onComplete={() => setEventStatus("ongoing")}
                />
              </div>
            </div>
          )}

          <div className="space-y-2.5 mb-4">
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <FaCalendarAlt className="text-fuchsia-400/70" />
              <span>{formatDate(event.dateTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <FaMapMarkerAlt className="text-cyan-400/70" />
              <span>{event.location?.city}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <FaUsers className="text-purple-400/70" />
              <span>{event.participants?.length || 0} devotees joined</span>
            </div>
          </div>

          {event.image && (
            <div className="relative overflow-hidden rounded-xl mb-4 border border-white/10">
              <img
                src={
                  event.image.startsWith("http")
                    ? event.image
                    : baseUrl + event.image
                }
                alt="Event"
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent" />
            </div>
          )}

          <Link to="/communityblog">
            <button
              className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                eventStatus === "ongoing"
                  ? "bg-gradient-to-r from-green-400 to-cyan-400 text-indigo-900 hover:shadow-green-500/30"
                  : "bg-gradient-to-r from-[#d946ef] to-[#63297D] text-white hover:shadow-fuchsia-500/30"
              }`}
              disabled={eventStatus === "ended"}
            >
              {eventStatus === "ongoing" ? (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                  <span>Join Live Event</span>
                  <span>→</span>
                </>
              ) : (
                <>
                  <FaTicketAlt className="inline" />
                  <span>Register for Event</span>
                  <span>→</span>
                </>
              )}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Main Community Component
const Community = () => {
  const [topPosts, setTopPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    members: 0,
    posts: 0,
    cities: 0,
    events: 0,
  });
  const baseUrl = useApi();

  useEffect(() => {
    document.title = "Sacred Community Hub | Krishnova";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content =
        "Join Krishnova's divine community. Connect with devotees, share spiritual stories, and participate in sacred events worldwide.";
    }
  }, []);

  useEffect(() => {
    const filterEvents = () => {
      const now = new Date();
      const filtered = events.filter((event) => {
        const eventDate = new Date(event.dateTime);
        if (event.endDateTime) {
          return new Date(event.endDateTime) >= now;
        }
        const fallbackEnd = new Date(eventDate);
        fallbackEnd.setHours(23, 59, 59, 999);
        return fallbackEnd >= now;
      });

      filtered.sort((a, b) => {
        const now = new Date();
        const aDate = new Date(a.dateTime);
        const bDate = new Date(b.dateTime);
        const getEndDate = (e) =>
          e.endDateTime
            ? new Date(e.endDateTime)
            : new Date(
                new Date(e.dateTime).getTime() + (e.duration || 60) * 60000,
              );

        const aEnd = getEndDate(a);
        const bEnd = getEndDate(b);

        const aIsOngoing = aDate <= now && aEnd >= now;
        const bIsOngoing = bDate <= now && bEnd >= now;

        if (aIsOngoing && !bIsOngoing) return -1;
        if (!aIsOngoing && bIsOngoing) return 1;
        return aDate - bDate;
      });

      setFilteredEvents(filtered.slice(0, 3));
    };

    if (events.length > 0) {
      filterEvents();
      const interval = setInterval(filterEvents, 60000);
      return () => clearInterval(interval);
    }
  }, [events]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, eventsRes] = await Promise.all([
          axios.get(import.meta.env.VITE_API_URL + "/blog?limit=4"),
          axios
            .get(import.meta.env.VITE_API_URL + "/community-events")
            .catch(() => ({ data: [] })),
        ]);

        const postsData = postsRes.data.posts || [];
        // Transform posts to have full URLs
        const transformedPosts = postsData.map(transformPostData);

        setTopPosts(transformedPosts);
        setEvents(eventsRes.data);
        setStats({
          members: Math.floor(Math.random() * 5000) + 5000,
          posts: postsRes.data.totalPosts || 0,
          cities: 108,
          events: eventsRes.data.length || 24,
        });
      } catch (e) {
        console.error("Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section
      className="relative min-h-screen py-6 overflow-hidden flex"
      style={{
        background:
          "radial-gradient(circle at center, #5b21b6 0%, #2e1065 50%, #170726 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Subtle Background Glow */}
      <div className="absolute top-[-10%] left-[-5%] w-[30vw] h-[30vw] bg-[#d946ef] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30vw] h-[30vw] bg-[#d946ef] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />

      {/* Floating particles removed to prevent automatic animations */}
      <div className="absolute inset-0">
        {/* Particles will only show on user interaction */}
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 bg-fuchsia-500/10 border border-fuchsia-400/20 rounded-full px-5 py-2.5 shadow-lg shadow-fuchsia-500/5 mb-8">
            <span className="text-fuchsia-400 text-base">✦</span>
            <span className="text-fuchsia-200 font-medium tracking-wide text-sm">
              Krishnova community
            </span>
            <span className="text-fuchsia-400 text-base">✦</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4">
            <span className="text-white">Divine Community Hub</span>
          </h1>

          <p className="text-md md:text-xl text-slate-300 max-w-3xl mx-auto">
            Connect with like-minded souls on the path of Krishna consciousness
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <StatsCard
            icon={<FaUsers />}
            value={`${stats.members}+`}
            label="Devotees"
            gradient="from-[#d946ef] to-[#63297D]"
            delay={0}
          />
          <StatsCard
            icon={<FaPen />}
            value={`${stats.posts}+`}
            label="Stories"
            gradient="from-cyan-400 to-blue-500"
            delay={0.1}
          />
          <StatsCard
            icon={<FaLandmark />}
            value={`${stats.cities}`}
            label="Sacred Cities"
            gradient="from-purple-400 to-indigo-500"
            delay={0.2}
          />
          <StatsCard
            icon={<IoSparkles />}
            value={`${stats.events}+`}
            label="Events"
            gradient="from-green-400 to-cyan-500"
            delay={0.3}
          />
        </div>

        {filteredEvents.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center md:justify-between flex-wrap justify-center mb-8">
              <h2 className="text-3xl font-bold text-white">Upcoming Events</h2>
              <Link to="/communityblog">
                <button className="px-3 flex min-w-44 md:px-6 py-3 bg-gradient-to-r from-[#d946ef] to-[#63297D] text-white rounded-full font-bold hover:shadow-lg hover:shadow-fuchsia-500/20 transition-all duration-300">
                  View All Events →
                </button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, i) => (
                <EventCard
                  key={event._id}
                  event={event}
                  baseUrl={baseUrl}
                  index={i}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center md:justify-between flex-wrap justify-center mb-8 gap-2">
            <h2 className="text-3xl font-bold text-white">Community Stories</h2>
            <Link to="/communityblog">
              <button className="px-6 py-3 bg-gradient-to-r from-[#d946ef] to-[#63297D] text-white rounded-full font-bold hover:shadow-lg hover:shadow-fuchsia-500/20 transition-all duration-300">
                View All Stories →
              </button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {loading
              ? [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/20"
                  >
                    <div className="h-40 bg-white/10 rounded-xl" />
                  </div>
                ))
              : topPosts.map((post, i) => (
                  <SocialPostCard
                    key={post._id}
                    post={post}
                    baseUrl={baseUrl}
                    index={i}
                  />
                ))}
          </div>

          <div className="text-center">
            <Link to="/communityblog">
              <button className="group relative px-8 py-4 overflow-hidden rounded-full shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-[#d946ef] to-[#63297D]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 text-white font-bold tracking-wide flex items-center gap-2">
                  <FaOm className="inline" />
                  Join Our Sacred Community
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </span>
              </button>
            </Link>
            <p className="mt-4 text-slate-400">
              Connect with {stats.members}+ souls on the divine path
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
