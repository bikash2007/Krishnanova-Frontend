import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
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
  FaMoon,
  FaWalking,
  FaLightbulb,
  FaEdit,
  FaTrash,
  FaTimes,
  FaImage,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import { GiCandleLight } from "react-icons/gi";
import { IoSparkles } from "react-icons/io5";
import { DevoteeInlineBadge } from "./DevoteeLevelBadge";

const API = import.meta.env.VITE_API_URL;

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
      icon: <IoSparkles />,
      label: "Personal Experience",
      color: "text-amber-400",
    },
    teaching: {
      icon: <FaBook />,
      label: "Spiritual Teaching",
      color: "text-cyan-400",
    },
    dream: {
      icon: <FaMoon />,
      label: "Divine Dream",
      color: "text-purple-400",
    },
    miracle: {
      icon: <GiCandleLight />,
      label: "Miracle Story",
      color: "text-yellow-400",
    },
    journey: {
      icon: <FaWalking />,
      label: "Spiritual Journey",
      color: "text-green-400",
    },
    realization: {
      icon: <FaLightbulb />,
      label: "Realization",
      color: "text-pink-400",
    },
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
  onDelete,
  onEdit,
  user,
  index = 0,
}) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editTitle, setEditTitle] = useState(story.title);
  const [editContent, setEditContent] = useState(story.content);
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(story.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const isOwner = user && (
    story.author?._id === user._id ||
    story.author?.id === user._id ||
    story.author === user._id
  );
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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      await axios.delete(`${API}/blog/${story._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onDelete?.(story._id);
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditImage(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim()) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("content", editContent);
      if (editImage) formData.append("image", editImage);

      const res = await axios.put(`${API}/blog/${story._id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onEdit?.(story._id, res.data);
      setShowEditForm(false);
    } catch (error) {
      console.error("Error editing story:", error);
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="flex flex-wrap gap-1 justify-end items-center">
            {storyRasas.slice(0, 2).map((rasa) => (
              <RasaTag key={rasa} rasaId={rasa} size="xs" />
            ))}
            {/* Owner actions */}
            {isOwner && (
              <div className="flex items-center gap-1 ml-1">
                <button
                  onClick={() => setShowEditForm(!showEditForm)}
                  title="Edit story"
                  className="p-1.5 rounded-lg text-amber-300/60 hover:text-amber-300 hover:bg-amber-400/10 transition-colors"
                >
                  <FaEdit size={12} />
                </button>
                <button
                  onClick={handleDelete}
                  title="Delete story"
                  className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Inline Edit Form */}
        {showEditForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleEditSubmit}
            className="mt-4 p-4 bg-white/[0.06] rounded-xl border border-amber-400/20 space-y-3"
          >
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white/[0.08] border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-400/50 text-sm"
              placeholder="Title"
              maxLength={200}
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full px-3 py-2 bg-white/[0.08] border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-400/50 text-sm resize-none"
              rows={4}
              placeholder="Share your story..."
              maxLength={2000}
            />
            {/* Image preview / change */}
            <div>
              {editImagePreview ? (
                <div className="relative">
                  <img
                    src={editImagePreview}
                    alt="Preview"
                    className="w-full max-h-48 object-contain rounded-lg bg-black/20"
                  />
                  <button
                    type="button"
                    onClick={() => { setEditImage(null); setEditImagePreview(null); }}
                    className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors"
                  >
                    <FaTimes className="text-white" size={10} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 bg-white/[0.06] border border-white/20 rounded-lg text-slate-400 hover:text-amber-300 hover:border-amber-400/30 transition-colors text-sm"
                >
                  <FaImage size={12} />
                  <span>Change image</span>
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => { setShowEditForm(false); setEditTitle(story.title); setEditContent(story.content); setEditImage(null); setEditImagePreview(story.image || null); }}
                className="px-3 py-1.5 bg-white/10 text-slate-300 rounded-lg text-sm hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !editTitle.trim() || !editContent.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-indigo-900 font-semibold rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? <FaSpinner className="animate-spin" size={12} /> : <FaCheck size={12} />}
                <span>{isSubmitting ? "Saving..." : "Save"}</span>
              </button>
            </div>
          </motion.form>
        )}

        {/* Title */}
        {!showEditForm && (
          <Link to={`/blog/${story._id}`}>
            <h2 className="text-lg sm:text-xl font-bold text-blue-100 mt-4 mb-2 hover:text-amber-300 transition-colors cursor-pointer">
              {story.title}
            </h2>
          </Link>
        )}

        {/* Content */}
        {!showEditForm && (
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
        )}

        {/* Image */}
        {story.image && !showEditForm && (
          <Link to={`/blog/${story._id}`}>
            <div className="mt-4 -mx-4 sm:-mx-6 relative overflow-hidden group/image">
              <img
                src={
                  story.image.startsWith("http")
                    ? story.image
                    : baseUrl + story.image
                }
                alt={story.title}
                className="w-full max-h-[500px] object-contain bg-black/20 group-hover/image:brightness-95 transition-all duration-300"
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
              <GiCandleLight />
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
          <GiCandleLight className="text-6xl mb-4 mx-auto text-amber-300/40" />
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
