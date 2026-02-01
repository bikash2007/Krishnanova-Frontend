import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useSanga } from "./SangaContext";
import { DevoteeInlineBadge } from "./DevoteeLevelBadge";
import {
  FaLock,
  FaUnlock,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaStar,
  FaFilter,
  FaOm,
} from "react-icons/fa";

// Event Level Requirements
const EVENT_LEVELS = {
  public: {
    label: "Open to All",
    icon: "🌍",
    color: "from-green-400 to-emerald-500",
    description: "Everyone is welcome",
  },
  beginner: {
    label: "Beginner Friendly",
    icon: "🌱",
    color: "from-green-400 to-cyan-500",
    description: "Perfect for those starting their journey",
  },
  intermediate: {
    label: "Intermediate",
    icon: "📿",
    color: "from-amber-400 to-orange-500",
    description: "For practicing devotees",
  },
  advanced: {
    label: "Advanced",
    icon: "🪔",
    color: "from-purple-400 to-indigo-500",
    description: "Deep spiritual practices",
  },
  bhakta: {
    label: "Bhakta Only",
    icon: "🦚",
    color: "from-cyan-400 to-blue-500",
    description: "Exclusive for dedicated devotees",
  },
  premi: {
    label: "Premi Circle",
    icon: "💙",
    color: "from-pink-400 to-rose-500",
    description: "For those immersed in divine love",
  },
};

// Devotee Event Card
export const DevoteeEventCard = ({ event, baseUrl, index = 0 }) => {
  const { canAccessEvent, currentLevel, devoteeData } = useSanga();
  const [status, setStatus] = useState("upcoming");
  const [showDetails, setShowDetails] = useState(false);

  const eventLevel = event.requiredLevel || "public";
  const hasAccess = canAccessEvent(eventLevel);
  const levelConfig = EVENT_LEVELS[eventLevel] || EVENT_LEVELS.public;

  // Calculate event status
  React.useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const start = new Date(event.dateTime);
      const end = event.endDateTime
        ? new Date(event.endDateTime)
        : new Date(start.getTime() + (event.duration || 60) * 60000);

      if (now > end) setStatus("ended");
      else if (now >= start) setStatus("ongoing");
      else setStatus("upcoming");
    };

    checkStatus();
    const timer = setInterval(checkStatus, 60000);
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

  const getTimeUntil = () => {
    const now = new Date();
    const start = new Date(event.dateTime);
    const diff = start - now;

    if (diff <= 0) return "Now";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `In ${days}d ${hours % 24}h`;
    if (hours > 0) return `In ${hours}h`;
    return `In ${Math.floor(diff / (1000 * 60))}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border overflow-hidden transition-all duration-300 ${
        hasAccess
          ? "border-white/20 hover:border-amber-400/30"
          : "border-white/10 opacity-75"
      }`}
    >
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {/* Organizer Avatar */}
            <div className="relative">
              <img
                src={
                  event.organizer?.avatar
                    ? event.organizer.avatar.startsWith("http")
                      ? event.organizer.avatar
                      : baseUrl + event.organizer.avatar
                    : `https://ui-avatars.com/api/?name=${event.organizer?.name || "E"}&background=fbbf24&color=1e3a8a`
                }
                alt={event.organizer?.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-400/30"
              />
              {event.organizer?.devoteeLevel && (
                <div className="absolute -bottom-1 -right-1">
                  <DevoteeInlineBadge level={event.organizer.devoteeLevel} />
                </div>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-amber-300">
                {event.organizer?.name}
              </h4>
              <p className="text-xs text-blue-100/60">Event Organizer</p>
            </div>
          </div>

          {/* Access Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${levelConfig.color} ${hasAccess ? "text-white" : "text-white/70"}`}
          >
            {hasAccess ? <FaUnlock size={10} /> : <FaLock size={10} />}
            <span>{levelConfig.label}</span>
          </div>
        </div>

        {/* Event Title */}
        <h3 className="text-lg font-bold text-blue-100 mb-2">{event.title}</h3>

        {/* Status Badge */}
        {status === "ongoing" && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/20 text-red-300 text-xs font-bold rounded-full border border-red-500/30 mb-3 animate-pulse">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            LIVE NOW
          </div>
        )}

        {/* Time Until */}
        {status === "upcoming" && (
          <div className="text-sm text-amber-400 font-medium mb-3">
            ⏰ {getTimeUntil()}
          </div>
        )}

        {/* Event Details */}
        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center gap-2 text-blue-100/70">
            <FaCalendarAlt size={12} className="text-amber-400" />
            <span>{formatDate(event.dateTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-blue-100/70">
            <FaClock size={12} className="text-cyan-400" />
            <span>
              {event.duration ? `${event.duration} mins` : "Duration TBA"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-blue-100/70">
            <FaMapMarkerAlt size={12} className="text-green-400" />
            <span>{event.location?.city || "Online Event"}</span>
          </div>
          <div className="flex items-center gap-2 text-blue-100/70">
            <FaUsers size={12} className="text-purple-400" />
            <span>{event.participants?.length || 0} devotees joined</span>
          </div>
        </div>

        {/* Description (expandable) */}
        {event.description && (
          <div className="mb-4">
            <p
              className={`text-sm text-blue-100/80 ${showDetails ? "" : "line-clamp-2"}`}
            >
              {event.description}
            </p>
            {event.description.length > 100 && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-amber-300 hover:text-amber-200 mt-1"
              >
                {showDetails ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}

        {/* Locked State */}
        {!hasAccess && (
          <div className="p-3 bg-white/5 rounded-xl mb-4 border border-white/10">
            <div className="flex items-center gap-2 text-sm">
              <FaLock className="text-amber-400" />
              <span className="text-blue-100/70">
                Requires{" "}
                <span className="text-amber-300 font-semibold">
                  {levelConfig.label}
                </span>{" "}
                level
              </span>
            </div>
            <p className="text-xs text-blue-100/50 mt-1">
              Continue your spiritual journey to unlock this event
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          disabled={!hasAccess || status === "ended"}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            !hasAccess
              ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
              : status === "ended"
                ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                : status === "ongoing"
                  ? "bg-gradient-to-r from-green-400 to-cyan-400 text-indigo-900 hover:shadow-green-500/30 animate-pulse"
                  : "bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 hover:shadow-amber-500/30"
          }`}
        >
          {!hasAccess ? (
            <>
              <FaLock size={14} />
              <span>Unlock with Progress</span>
            </>
          ) : status === "ended" ? (
            <span>Event Ended</span>
          ) : status === "ongoing" ? (
            <>
              <FaOm size={14} />
              <span>Join Live Satsang</span>
            </>
          ) : (
            <>
              <FaStar size={14} />
              <span>Register for Event</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

// Devotee Events Feed with Level Filtering
const DevoteeEventsFeed = ({ events, baseUrl }) => {
  const { currentLevel, canAccessEvent } = useSanga();
  const [filter, setFilter] = useState("all"); // all, accessible, upcoming
  const [showLevelInfo, setShowLevelInfo] = useState(false);

  // Filter events
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    switch (filter) {
      case "accessible":
        filtered = filtered.filter((e) =>
          canAccessEvent(e.requiredLevel || "public"),
        );
        break;
      case "upcoming":
        const now = new Date();
        filtered = filtered.filter((e) => new Date(e.dateTime) > now);
        break;
      default:
        break;
    }

    // Sort: ongoing first, then upcoming, then ended
    filtered.sort((a, b) => {
      const now = new Date();
      const getStatus = (e) => {
        const start = new Date(e.dateTime);
        const end = e.endDateTime
          ? new Date(e.endDateTime)
          : new Date(start.getTime() + (e.duration || 60) * 60000);
        if (now > end) return 2; // ended
        if (now >= start) return 0; // ongoing
        return 1; // upcoming
      };
      return getStatus(a) - getStatus(b);
    });

    return filtered;
  }, [events, filter, canAccessEvent]);

  const accessibleCount = events.filter((e) =>
    canAccessEvent(e.requiredLevel || "public"),
  ).length;
  const lockedCount = events.length - accessibleCount;

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-amber-300 flex items-center gap-2">
              <FaCalendarAlt />
              Divine Events
            </h2>
            <p className="text-sm text-blue-100/60 mt-1">
              {accessibleCount} accessible • {lockedCount} to unlock
            </p>
          </div>

          <button
            onClick={() => setShowLevelInfo(!showLevelInfo)}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <FaStar size={12} />
            Your Level: {currentLevel.name}
          </button>
        </div>

        {/* Level Info */}
        <AnimatePresence>
          {showLevelInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 p-3 bg-amber-400/10 rounded-xl border border-amber-400/20"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentLevel.color} flex items-center justify-center text-2xl`}
                >
                  {currentLevel.icon}
                </div>
                <div>
                  <p className="font-bold text-amber-300">
                    {currentLevel.name}
                  </p>
                  <p className="text-xs text-blue-100/70">
                    {currentLevel.description}
                  </p>
                  <p className="text-xs text-green-400 mt-1">
                    ✓ Access to: {currentLevel.eventAccess.join(", ")}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {[
            { key: "all", label: "All Events" },
            { key: "accessible", label: `My Level (${accessibleCount})` },
            { key: "upcoming", label: "Upcoming" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900"
                  : "bg-white/10 text-blue-100/70 hover:bg-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredEvents.map((event, index) => (
            <DevoteeEventCard
              key={event._id}
              event={event}
              baseUrl={baseUrl}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-amber-300 text-lg">No events found</p>
          <p className="text-blue-100/60 mt-2">
            {filter === "accessible"
              ? "Continue your journey to unlock more events"
              : "Check back soon for divine gatherings!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default DevoteeEventsFeed;
