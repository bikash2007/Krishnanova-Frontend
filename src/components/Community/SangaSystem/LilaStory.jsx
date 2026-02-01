import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { EMOTIONAL_RASAS } from "./SangaContext";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShare,
  FaBookmark,
  FaPlay,
  FaBook,
  FaStar,
  FaFilter,
} from "react-icons/fa";
import { DevoteeInlineBadge } from "./DevoteeLevelBadge";

// Rasa Tag Component
export const RasaTag = ({
  rasaId,
  size = "sm",
  interactive = false,
  selected = false,
  onClick,
}) => {
  const rasa =
    EMOTIONAL_RASAS[rasaId?.toUpperCase()] ||
    Object.values(EMOTIONAL_RASAS).find((r) => r.id === rasaId);

  if (!rasa) return null;

  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-1.5 text-sm",
  };

  return (
    <motion.button
      whileHover={interactive ? { scale: 1.05 } : {}}
      whileTap={interactive ? { scale: 0.95 } : {}}
      onClick={interactive ? onClick : undefined}
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${sizes[size]}
        ${
          selected
            ? `bg-gradient-to-r ${rasa.color} text-white shadow-lg`
            : `bg-gradient-to-r ${rasa.color}/20 text-amber-200 border border-white/10`
        }
        ${interactive ? "cursor-pointer hover:border-amber-400/30" : "cursor-default"}
        transition-all duration-200
      `}
      disabled={!interactive}
    >
      <span>{rasa.emoji}</span>
      <span>{rasa.name}</span>
    </motion.button>
  );
};

// Rasa Filter Bar
export const RasaFilterBar = ({
  selectedRasas,
  onToggleRasa,
  compact = false,
}) => {
  const [showAll, setShowAll] = useState(false);
  const rasas = Object.values(EMOTIONAL_RASAS);
  const displayRasas = compact && !showAll ? rasas.slice(0, 4) : rasas;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {compact && (
        <span className="text-xs text-blue-100/60 flex items-center gap-1">
          <FaFilter size={10} />
          Filter:
        </span>
      )}
      {displayRasas.map((rasa) => (
        <RasaTag
          key={rasa.id}
          rasaId={rasa.id}
          size="sm"
          interactive={true}
          selected={selectedRasas.includes(rasa.id)}
          onClick={() => onToggleRasa(rasa.id)}
        />
      ))}
      {compact && rasas.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-amber-300 hover:text-amber-200 transition-colors"
        >
          {showAll ? "Show less" : `+${rasas.length - 4} more`}
        </button>
      )}
    </div>
  );
};

// Story Type Icon
const StoryTypeIcon = ({ type }) => {
  const config = {
    experience: {
      icon: "✨",
      label: "Personal Experience",
      color: "text-amber-400",
    },
    teaching: {
      icon: "📚",
      label: "Spiritual Teaching",
      color: "text-cyan-400",
    },
    dream: { icon: "🌙", label: "Divine Dream", color: "text-purple-400" },
    miracle: { icon: "🪔", label: "Miracle Story", color: "text-yellow-400" },
    journey: {
      icon: "🚶",
      label: "Spiritual Journey",
      color: "text-green-400",
    },
    realization: { icon: "💡", label: "Realization", color: "text-pink-400" },
  };

  const typeConfig = config[type] || config.experience;

  return (
    <div className={`flex items-center gap-1 text-xs ${typeConfig.color}`}>
      <span>{typeConfig.icon}</span>
      <span className="hidden sm:inline">{typeConfig.label}</span>
    </div>
  );
};

// Lila Story Card - Enhanced Post Card
export const LilaStoryCard = ({
  story,
  baseUrl,
  onLike,
  onBookmark,
  user,
  index = 0,
}) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const isLiked = user && story.likes?.includes(user._id);
  const storyRasas = story.rasas || ["shanta"]; // Default rasa if none set
  const storyType = story.storyType || "experience";

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = Math.floor((now - postDate) / (1000 * 60 * 60));
    if (diff < 1) return "Just now";
    if (diff < 24) return `${diff}h ago`;
    return `${Math.floor(diff / 24)}d ago`;
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(story._id);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 shadow-xl overflow-hidden hover:border-amber-400/30 transition-all duration-300 group"
    >
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Author Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={
                  story.author?.avatar
                    ? story.author.avatar.startsWith("http")
                      ? story.author.avatar
                      : baseUrl + story.author.avatar
                    : `https://ui-avatars.com/api/?name=${story.author?.name || "U"}&background=fbbf24&color=1e3a8a`
                }
                alt={story.author?.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-amber-400/30"
              />
              <div className="absolute -bottom-1 -right-1">
                <DevoteeInlineBadge
                  level={story.author?.devoteeLevel}
                  points={story.author?.spiritualPoints}
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-amber-300 truncate">
                  {story.author?.name || "Anonymous Devotee"}
                </h4>
                <StoryTypeIcon type={storyType} />
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-100/60">
                <span>{formatTimeAgo(story.createdAt)}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FaStar size={10} className="text-amber-400" />
                  {story.author?.spiritualPoints || 0} pts
                </span>
              </div>
            </div>
          </div>

          {/* Story Rasas */}
          <div className="flex flex-wrap gap-1 justify-end">
            {storyRasas.slice(0, 2).map((rasa) => (
              <RasaTag key={rasa} rasaId={rasa} size="xs" />
            ))}
          </div>
        </div>

        {/* Title */}
        <Link to={`/blog/${story._id}`}>
          <h2 className="text-lg sm:text-xl font-bold text-blue-100 mt-4 mb-2 hover:text-amber-300 transition-colors cursor-pointer">
            {story.title}
          </h2>
        </Link>

        {/* Content */}
        <div className="text-blue-100/80 text-sm sm:text-base leading-relaxed">
          {showFullContent || story.content?.length <= 200
            ? story.content
            : `${story.content?.substring(0, 200)}...`}
          {story.content?.length > 200 && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-amber-300 hover:text-amber-200 ml-2 font-medium"
            >
              {showFullContent ? "Show less" : "Read this Lila →"}
            </button>
          )}
        </div>

        {/* Image */}
        {story.image && (
          <Link to={`/blog/${story._id}`}>
            <div className="mt-4 -mx-4 sm:-mx-6 relative overflow-hidden group/image">
              <img
                src={
                  story.image.startsWith("http")
                    ? story.image
                    : baseUrl + story.image
                }
                alt={story.title}
                className="w-full h-48 sm:h-64 object-cover group-hover/image:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-transparent to-transparent" />

              {/* Sacred Quote Overlay */}
              {story.sacredQuote && (
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-amber-100 text-sm italic bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
                    "{story.sacredQuote}"
                  </p>
                </div>
              )}
            </div>
          </Link>
        )}

        {/* Divine Insight Section */}
        {story.divineInsight && (
          <div className="mt-4 p-3 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-xl border border-amber-400/20">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold mb-1">
              <span>🪔</span>
              Divine Insight
            </div>
            <p className="text-sm text-amber-100/80 italic">
              {story.divineInsight}
            </p>
          </div>
        )}

        {/* All Rasas (expanded view) */}
        {storyRasas.length > 2 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {storyRasas.map((rasa) => (
              <RasaTag key={rasa} rasaId={rasa} size="sm" />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => onLike?.(story._id)}
              disabled={!user}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                isLiked ? "text-red-500" : "text-blue-100/60 hover:text-red-500"
              }`}
            >
              {isLiked ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
              <span>{story.likes?.length || 0}</span>
            </button>

            <Link to={`/blog/${story._id}#comments`}>
              <button className="flex items-center gap-1.5 text-sm text-blue-100/60 hover:text-cyan-400 transition-colors">
                <FaComment size={14} />
                <span>{story.comments?.length || 0}</span>
              </button>
            </Link>

            <button className="flex items-center gap-1.5 text-sm text-blue-100/60 hover:text-purple-400 transition-colors">
              <FaShare size={14} />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          <button
            onClick={handleBookmark}
            className={`p-2 rounded-full transition-colors ${
              isBookmarked
                ? "text-amber-400 bg-amber-400/20"
                : "text-blue-100/60 hover:text-amber-400 hover:bg-amber-400/10"
            }`}
          >
            <FaBookmark size={14} />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

// Lila Stories Feed
const LilaStoriesFeed = ({ stories, baseUrl, user, onLike }) => {
  const [selectedRasas, setSelectedRasas] = useState([]);
  const [sortBy, setSortBy] = useState("recent"); // recent, popular, discussed

  const handleToggleRasa = (rasaId) => {
    setSelectedRasas((prev) =>
      prev.includes(rasaId)
        ? prev.filter((r) => r !== rasaId)
        : [...prev, rasaId],
    );
  };

  // Filter and sort stories
  const filteredStories = useMemo(() => {
    let filtered = [...stories];

    // Filter by rasas
    if (selectedRasas.length > 0) {
      filtered = filtered.filter((story) => {
        const storyRasas = story.rasas || ["shanta"];
        return selectedRasas.some((r) => storyRasas.includes(r));
      });
    }

    // Sort
    switch (sortBy) {
      case "popular":
        filtered.sort(
          (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0),
        );
        break;
      case "discussed":
        filtered.sort(
          (a, b) => (b.comments?.length || 0) - (a.comments?.length || 0),
        );
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  }, [stories, selectedRasas, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-amber-300 flex items-center gap-2">
            <FaBook />
            Modern Lilas
          </h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-blue-100 focus:outline-none focus:border-amber-400/50"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Loved</option>
            <option value="discussed">Most Discussed</option>
          </select>
        </div>

        <RasaFilterBar
          selectedRasas={selectedRasas}
          onToggleRasa={handleToggleRasa}
        />
      </div>

      {/* Stories */}
      {filteredStories.length > 0 ? (
        <div className="space-y-6">
          {filteredStories.map((story, index) => (
            <LilaStoryCard
              key={story._id}
              story={story}
              baseUrl={baseUrl}
              user={user}
              onLike={onLike}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🪔</div>
          <p className="text-amber-300 text-lg">No Lilas found</p>
          <p className="text-blue-100/60 mt-2">
            {selectedRasas.length > 0
              ? "Try selecting different rasas"
              : "Be the first to share your divine story!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default LilaStoriesFeed;
