import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  FaOm,
  FaGlobe,
  FaHeart,
  FaCrown,
  FaArrowRight,
  FaPlay,
} from "react-icons/fa";
import { GiPrayerBeads, GiCandleLight, GiFeather } from "react-icons/gi";
import { IoLeaf, IoSparkles } from "react-icons/io5";

// Event Level Requirements
const EVENT_LEVELS = {
  public: {
    label: "Open to All",
    icon: <FaGlobe />,
    color: "from-green-400 to-emerald-500",
    textColor: "text-emerald-300",
    description: "Everyone is welcome",
  },
  beginner: {
    label: "Beginner",
    icon: <IoLeaf />,
    color: "from-green-400 to-cyan-500",
    textColor: "text-cyan-300",
    description: "Perfect for those starting their journey",
  },
  intermediate: {
    label: "Intermediate",
    icon: <GiPrayerBeads />,
    color: "from-amber-400 to-orange-500",
    textColor: "text-amber-300",
    description: "For practicing devotees",
  },
  advanced: {
    label: "Advanced",
    icon: <GiCandleLight />,
    color: "from-purple-400 to-indigo-500",
    textColor: "text-purple-300",
    description: "Deep spiritual practices",
  },
  bhakta: {
    label: "Bhakta Only",
    icon: <GiFeather />,
    color: "from-cyan-400 to-blue-500",
    textColor: "text-blue-300",
    description: "Exclusive for dedicated devotees",
  },
  premi: {
    label: "Premi Circle",
    icon: <FaHeart />,
    color: "from-pink-400 to-rose-500",
    textColor: "text-pink-300",
    description: "For those immersed in divine love",
  },
};

// Devotee Event Card — Premium Glassmorphic Design
export const DevoteeEventCard = ({ event, baseUrl, index = 0 }) => {
  const { canAccessEvent, currentLevel } = useSanga();
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
      weekday: "short",
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

    if (diff <= 0) return "Happening Now";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h away`;
    if (hours > 0) return `${hours}h ${Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))}m away`;
    return `${Math.floor(diff / (1000 * 60))}m away`;
  };

  const getStatusConfig = () => {
    switch (status) {
      case "ongoing":
        return {
          label: "LIVE",
          bg: "bg-red-500/30",
          border: "border-red-400/50",
          text: "text-red-300",
          pulse: true,
        };
      case "ended":
        return {
          label: "ENDED",
          bg: "bg-gray-500/20",
          border: "border-gray-400/30",
          text: "text-gray-400",
          pulse: false,
        };
      default:
        return {
          label: getTimeUntil(),
          bg: "bg-amber-500/15",
          border: "border-amber-400/30",
          text: "text-amber-300",
          pulse: false,
        };
    }
  };

  const statusConfig = getStatusConfig();

  // Get image URL
  const getImageUrl = () => {
    if (!event.image) return null;
    if (event.image.startsWith("http")) return event.image;
    return baseUrl + event.image;
  };

  const imageUrl = getImageUrl();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ${
        hasAccess
          ? "hover:shadow-xl hover:shadow-amber-500/10"
          : "opacity-80"
      }`}
    >
      {/* Glassmorphic background */}
      <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-white/[0.08] to-white/[0.03]" />
      <div className="absolute inset-0 border border-white/[0.12] rounded-2xl group-hover:border-amber-400/25 transition-colors" />

      <div className="relative">
        {/* Event Image or Gradient Header */}
        {imageUrl ? (
          <div className="relative h-40 sm:h-44 overflow-hidden">
            <img
              src={imageUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => (e.target.style.display = "none")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/40 to-transparent" />

            {/* Status Badge — overlaid on image */}
            <div className="absolute top-3 left-3">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 ${statusConfig.bg} border ${statusConfig.border} rounded-full backdrop-blur-md`}
              >
                {status === "ongoing" && (
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
                <span className={`text-xs font-bold ${statusConfig.text}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>

            {/* Access Badge — overlaid on image */}
            <div className="absolute top-3 right-3">
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md bg-gradient-to-r ${levelConfig.color} text-white shadow-lg`}
              >
                {hasAccess ? <FaUnlock size={9} /> : <FaLock size={9} />}
                <span className="hidden sm:inline">{levelConfig.label}</span>
              </div>
            </div>

            {/* Event type badge */}
            {event.eventType && (
              <div className="absolute bottom-3 left-3">
                <span className="px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-medium text-blue-100 border border-white/20 capitalize">
                  {event.eventType}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Gradient header when no image */
          <div
            className={`relative h-24 bg-gradient-to-br ${levelConfig.color} opacity-30`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/95 to-transparent" />
            <div className="absolute top-3 left-3">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 ${statusConfig.bg} border ${statusConfig.border} rounded-full backdrop-blur-md`}
              >
                {status === "ongoing" && (
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
                <span className={`text-xs font-bold ${statusConfig.text}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>
            <div className="absolute top-3 right-3">
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r ${levelConfig.color} text-white`}
              >
                {hasAccess ? <FaUnlock size={9} /> : <FaLock size={9} />}
                <span>{levelConfig.label}</span>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Organizer row */}
          <div className="flex items-center gap-2.5">
            <img
              src={
                event.organizer?.avatar
                  ? event.organizer.avatar.startsWith("http")
                    ? event.organizer.avatar
                    : baseUrl + event.organizer.avatar
                  : `https://ui-avatars.com/api/?name=${event.organizer?.name || "E"}&background=fbbf24&color=1e3a8a&size=64`
              }
              alt={event.organizer?.name}
              className="w-8 h-8 rounded-full object-cover border border-amber-400/30 flex-shrink-0"
            />
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm font-medium text-amber-200 truncate">
                {event.organizer?.name || "Krishnova Community"}
              </span>
              {event.organizer?.devoteeLevel && (
                <DevoteeInlineBadge level={event.organizer.devoteeLevel} />
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-blue-50 leading-tight line-clamp-2 group-hover:text-amber-200 transition-colors">
            {event.title}
          </h3>

          {/* Meta info grid */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 text-blue-100/70">
              <FaCalendarAlt size={11} className="text-amber-400 flex-shrink-0" />
              <span className="truncate">{formatDate(event.dateTime)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-100/70">
              <FaClock size={11} className="text-cyan-400 flex-shrink-0" />
              <span>
                {event.duration ? `${event.duration} mins` : "TBA"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-100/70">
              <FaMapMarkerAlt size={11} className="text-emerald-400 flex-shrink-0" />
              <span className="truncate">
                {event.city || event.location?.city || "Online"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-100/70">
              <FaUsers size={11} className="text-purple-400 flex-shrink-0" />
              <span>{event.participants?.length || 0} joined</span>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <p
                className={`text-xs sm:text-sm text-blue-100/60 leading-relaxed ${showDetails ? "" : "line-clamp-2"}`}
              >
                {event.description}
              </p>
              {event.description.length > 100 && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-xs text-amber-400 hover:text-amber-300 mt-1 font-medium"
                >
                  {showDetails ? "Show less" : "Read more →"}
                </button>
              )}
            </div>
          )}

          {/* Locked notice */}
          {!hasAccess && (
            <div className="flex items-center gap-2 p-2.5 bg-white/[0.04] rounded-xl border border-white/10 text-xs">
              <FaLock className="text-amber-400/70 flex-shrink-0" />
              <span className="text-blue-100/60">
                Reach{" "}
                <span className={`font-semibold ${levelConfig.textColor}`}>
                  {levelConfig.label}
                </span>{" "}
                to join
              </span>
            </div>
          )}

          {/* Action button */}
          <button
            disabled={!hasAccess || status === "ended"}
            className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              !hasAccess
                ? "bg-white/[0.06] text-white/30 cursor-not-allowed border border-white/10"
                : status === "ended"
                  ? "bg-white/[0.06] text-white/30 cursor-not-allowed border border-white/10"
                  : status === "ongoing"
                    ? "bg-gradient-to-r from-green-400 to-cyan-400 text-indigo-900 hover:shadow-lg hover:shadow-green-500/20"
                    : "bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98]"
            }`}
          >
            {!hasAccess ? (
              <>
                <FaLock size={12} />
                <span>Locked</span>
              </>
            ) : status === "ended" ? (
              <span>Event Ended</span>
            ) : status === "ongoing" ? (
              <>
                <FaPlay size={11} />
                <span>Join Live</span>
              </>
            ) : (
              <>
                <FaStar size={12} />
                <span>Register</span>
                <FaArrowRight size={10} className="ml-0.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Devotee Events Feed with Level Filtering
const DevoteeEventsFeed = ({ events, baseUrl }) => {
  const { currentLevel, canAccessEvent } = useSanga();
  const [filter, setFilter] = useState("all");
  const [showLevelInfo, setShowLevelInfo] = useState(false);

  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    switch (filter) {
      case "accessible":
        filtered = filtered.filter((e) =>
          canAccessEvent(e.requiredLevel || "public"),
        );
        break;
      case "upcoming": {
        const now = new Date();
        filtered = filtered.filter((e) => new Date(e.dateTime) > now);
        break;
      }
      default:
        break;
    }

    filtered.sort((a, b) => {
      const now = new Date();
      const getStatus = (e) => {
        const start = new Date(e.dateTime);
        const end = e.endDateTime
          ? new Date(e.endDateTime)
          : new Date(start.getTime() + (e.duration || 60) * 60000);
        if (now > end) return 2;
        if (now >= start) return 0;
        return 1;
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
    <div className="space-y-5">
      {/* Header with Filters */}
      <div className="backdrop-blur-md bg-gradient-to-br from-white/[0.08] to-white/[0.03] rounded-2xl border border-white/[0.12] p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-amber-300 flex items-center gap-2">
              <IoSparkles className="text-amber-400" />
              Sacred Events
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/50 mt-0.5">
              {accessibleCount} accessible · {lockedCount} locked
            </p>
          </div>

          <button
            onClick={() => setShowLevelInfo(!showLevelInfo)}
            className="self-start sm:self-auto text-xs text-amber-400/80 hover:text-amber-300 flex items-center gap-1.5 bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/20 transition-colors"
          >
            <FaStar size={10} />
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
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${currentLevel.color} flex items-center justify-center text-xl flex-shrink-0`}
                >
                  {currentLevel.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-amber-300 text-sm">
                    {currentLevel.name}{" "}
                    <span className="font-normal text-blue-100/50">
                      — {currentLevel.meaning}
                    </span>
                  </p>
                  <p className="text-xs text-blue-100/60 mt-0.5">
                    {currentLevel.description}
                  </p>
                  <p className="text-xs text-green-400 mt-1">
                    ✓ Access: {currentLevel.eventAccess?.join(", ")}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { key: "all", label: "All", mobileLabel: "All" },
            {
              key: "accessible",
              label: `Accessible (${accessibleCount})`,
              mobileLabel: `Open (${accessibleCount})`,
            },
            { key: "upcoming", label: "Upcoming", mobileLabel: "Upcoming" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 shadow-lg shadow-amber-500/15"
                  : "bg-white/[0.06] text-blue-100/60 hover:bg-white/10 border border-white/10"
              }`}
            >
              <span className="sm:hidden">{f.mobileLabel}</span>
              <span className="hidden sm:inline">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2">
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
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-400/10 flex items-center justify-center">
            <FaCalendarAlt className="text-2xl text-amber-400/60" />
          </div>
          <p className="text-amber-300 font-semibold">No events found</p>
          <p className="text-sm text-blue-100/50 mt-1 max-w-xs mx-auto">
            {filter === "accessible"
              ? "Continue your spiritual journey to unlock more events"
              : "Check back soon for divine gatherings!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default DevoteeEventsFeed;
