import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../../Context/baseUrl";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

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
            className={`${size} rounded-full object-cover border-2 border-amber-400/30`}
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className={`${size} rounded-full border-2 border-amber-400/30 flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500 text-indigo-900 font-bold`}
          >
            {initial}
          </div>
        )}
      </motion.div>
      {showOnline && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-indigo-900 rounded-full animate-pulse" />
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
          ? "bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900"
          : "bg-gradient-to-r from-cyan-400/20 to-blue-400/20 text-cyan-300 border border-cyan-400/30"
      } font-semibold`}
    >
      <span>{isAdmin ? "👑" : "🙏"}</span>
      <span>{isAdmin ? "ADMIN" : "DEVOTEE"}</span>
    </div>
  );
};

// Event Card with Krishnova theme
const EventCard = ({ event, baseUrl, index }) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const typeConfig = {
    meditation: { icon: "🧘", gradient: "from-purple-400 to-indigo-500" },
    prayer: { icon: "🙏", gradient: "from-amber-400 to-orange-500" },
    discourse: { icon: "📖", gradient: "from-cyan-400 to-blue-500" },
    festival: { icon: "🎉", gradient: "from-yellow-400 to-amber-500" },
    community_service: { icon: "🤝", gradient: "from-green-400 to-cyan-500" },
    other: { icon: "📅", gradient: "from-purple-400 to-pink-500" },
  };

  const config = typeConfig[event.eventType] || typeConfig.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group"
    >
      <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-2xl border border-white/20 hover:border-amber-400/50 transition-all duration-300 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-2xl shadow-lg`}
              >
                {config.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-amber-300">
                    {event.organizer?.name}
                  </h4>
                  <UserBadge user={event.organizer} size="sm" />
                </div>
                <p className="text-xs text-blue-100/60">Event Organizer</p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-green-400 to-cyan-400 text-indigo-900">
              LIVE
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg mb-3 text-blue-100">
            {event.title}
          </h3>

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-blue-100/70 text-sm">
              <span className="text-amber-300">📅</span>
              <span>{formatDate(event.dateTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100/70 text-sm">
              <span className="text-cyan-300">📍</span>
              <span>{event.location?.city}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100/70 text-sm">
              <span className="text-purple-300">👥</span>
              <span>{event.participants?.length || 0} devotees joined</span>
            </div>
          </div>

          {/* Event Image */}
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

          {/* CTA Button */}
          <Link to="/communityblog">
            <button className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 rounded-xl font-bold shadow-lg hover:shadow-amber-500/30 transition-all duration-300 flex items-center justify-center gap-2">
              <span>🎫</span>
              <span>Join Sacred Event</span>
              <span>→</span>
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// Social Post Card with Krishnova theme
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group"
    >
      <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-2xl border border-white/20 hover:border-amber-400/50 transition-all duration-300 overflow-hidden">
        <div className="p-6">
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
                  <h4 className="font-semibold text-amber-300">
                    {post.author?.name || "Anonymous Devotee"}
                  </h4>
                  <UserBadge user={post.author} size="sm" />
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-100/60">
                  <span>{formatTimeAgo(post.createdAt)}</span>
                  <span>•</span>
                  <span>🌍 Public</span>
                </div>
              </div>
            </div>
            {(post.likes?.length || 0) > 10 && (
              <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white">
                🔥 Trending
              </span>
            )}
          </div>

          {/* Post Content */}
          <Link to={`/blog/${post._id}`}>
            <h3 className="font-bold text-xl mb-3 text-blue-100 hover:text-amber-300 transition-colors cursor-pointer">
              {post.title}
            </h3>
          </Link>

          <p className="text-blue-100/80 text-sm mb-4 leading-relaxed">
            {showFullText ? post.content : truncate(post.content, 100)}
            {post.content.length > 100 && (
              <button
                onClick={() => setShowFullText(!showFullText)}
                className="text-amber-300 hover:text-amber-200 ml-1 font-medium"
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
                  <div className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full text-indigo-900 font-bold text-sm flex items-center gap-2">
                    <span>👁️</span>
                    <span>Read Full Post</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Engagement Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-1 transition-colors ${
                  isLiked
                    ? "text-red-500"
                    : "text-blue-100/60 hover:text-red-500"
                }`}
              >
                <span>{isLiked ? "❤️" : "🤍"}</span>
                <span className="text-sm font-medium">
                  {post.likes?.length || 0}
                </span>
              </button>
              <button className="flex items-center gap-1 text-blue-100/60 hover:text-cyan-300 transition-colors">
                <span>💬</span>
                <span className="text-sm font-medium">
                  {post.comments?.length || 0}
                </span>
              </button>
              <button className="flex items-center gap-1 text-blue-100/60 hover:text-purple-300 transition-colors">
                <span>🔄</span>
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
            <button className="text-blue-100/60 hover:text-yellow-400 transition-colors">
              <span>⭐</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Stats Card with Krishnova theme
const StatsCard = ({ icon, value, label, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ scale: 1.05, y: -5 }}
  >
    <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-xl p-6 border border-white/20 hover:border-amber-400/50 transition-all duration-300 text-center">
      <div
        className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg`}
      >
        {icon}
      </div>
      <div className="text-2xl font-bold text-amber-300 mb-1">{value}</div>
      <div className="text-sm text-blue-100/60">{label}</div>
    </div>
  </motion.div>
);

const Community = () => {
  const [topPosts, setTopPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    members: 0,
    posts: 0,
    cities: 0,
    events: 0,
  });
  const baseUrl = useApi();

  // SEO Implementation
  useEffect(() => {
    document.title = "Sacred Community Hub | Krishnova";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content =
        "Join Krishnova's divine community. Connect with devotees, share spiritual stories, and participate in sacred events worldwide.";
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, eventsRes] = await Promise.all([
          axios.get(import.meta.env.VITE_API_URL + "/blog"),
          axios
            .get(import.meta.env.VITE_API_URL + "/community-events")
            .catch(() => ({ data: [] })),
        ]);

        setTopPosts(postsRes.data.slice(0, 4));
        setEvents(eventsRes.data.slice(0, 3));
        setStats({
          members: Math.floor(Math.random() * 5000) + 5000,
          posts: postsRes.data.length,
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
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-hidden py-20">
      {/* Animated Mandala Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Grid Pattern */}
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

      {/* Floating Elements */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="w-2 h-2 bg-amber-400/20 rounded-full blur-sm" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          {/* Sacred Badge */}
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 rounded-full px-5 py-2.5 shadow-lg mb-8">
            <span className="text-amber-300 animate-pulse text-lg">✦</span>
            <span className="text-amber-100 font-medium tracking-wide text-sm">
              कृष्णोवा समुदाय
            </span>
            <span className="text-amber-300 animate-pulse text-lg">✦</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
              Divine Community Hub
            </span>
          </h1>

          <p className="text-xl text-blue-100/80 max-w-3xl mx-auto">
            Connect with like-minded souls on the path of Krishna consciousness
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <StatsCard
            icon="👥"
            value={`${stats.members}+`}
            label="Devotees"
            gradient="from-amber-400 to-orange-500"
            delay={0}
          />
          <StatsCard
            icon="📝"
            value={`${stats.posts}+`}
            label="Stories"
            gradient="from-cyan-400 to-blue-500"
            delay={0.1}
          />
          <StatsCard
            icon="🏛️"
            value={`${stats.cities}`}
            label="Sacred Cities"
            gradient="from-purple-400 to-indigo-500"
            delay={0.2}
          />
          <StatsCard
            icon="🎉"
            value={`${stats.events}+`}
            label="Events"
            gradient="from-green-400 to-cyan-500"
            delay={0.3}
          />
        </div>

        {/* Events Section */}
        {events.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-amber-300">
                Upcoming Sacred Events
              </h2>
              <Link to="/communityblog">
                <button className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 rounded-full font-bold hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300">
                  View All Events →
                </button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <EventCard
                  key={event._id}
                  event={event}
                  baseUrl={baseUrl}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Posts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-amber-300">
              Community Stories
            </h2>
            <Link to="/communityblog">
              <button className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 rounded-full font-bold hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300">
                View All Stories →
              </button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {loading
              ? [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/20 animate-pulse"
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

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Link to="/communityblog">
              <button className="group relative px-8 py-4 overflow-hidden rounded-full shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 text-indigo-900 font-bold tracking-wide flex items-center gap-2">
                  <span>🕉️</span>
                  Join Our Sacred Community
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </span>
              </button>
            </Link>
            <p className="mt-4 text-blue-100/60">
              Connect with {stats.members}+ souls on the divine path
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Community;
