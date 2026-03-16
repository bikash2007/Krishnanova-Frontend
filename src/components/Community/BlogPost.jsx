import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { useApi } from "../../Context/baseUrl";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShareAlt,
  FaArrowLeft,
  FaCrown,
  FaPray,
  FaCalendarAlt,
  FaEye,
  FaBookmark,
  FaRegBookmark,
  FaQuoteLeft,
  FaGem,
  FaFeatherAlt,
  FaInfinity,
  FaUserFriends,
  FaGlobe,
  FaDotCircle,
  FaReply,
  FaEdit,
  FaTrash,
  FaPaperPlane,
  FaAward,
  FaThumbsUp,
  FaRegThumbsUp,
  FaSun,
} from "react-icons/fa";
import {
  GiFeather,
  GiFlute,
  GiCandleLight,
  GiPrayerBeads,
} from "react-icons/gi";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const API = import.meta.env.VITE_API_URL;

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

// Floating Particles Component - Krishna Themed (Disabled for performance)
const FloatingParticles = ({ showParticles = false }) => {
  return null;
};

// Enhanced Avatar Component - Krishna Themed - FIXED
const Avatar = ({ user, size = "w-16 h-16", baseUrl, artistic = true }) => {
  const [imageError, setImageError] = useState(false);

  const getAvatarUrl = () => {
    if (!user?.avatar || imageError) {
      // Generate UI Avatars fallback
      const name = user?.name || "User";
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name,
      )}&background=fbbf24&color=1e3a8a&size=128`;
    }

    if (user.avatar.startsWith("http")) {
      return user.avatar;
    }

    return `${baseUrl}${user.avatar.startsWith("/") ? "" : "/"}${user.avatar}`;
  };

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.1, rotate: artistic ? 3 : 0 }}
        className={`${
          artistic
            ? "p-[2px] bg-gradient-to-tr from-[#d946ef] via-fuchsia-500 to-purple-500 rounded-full"
            : ""
        }`}
      >
        <img
          src={getAvatarUrl()}
          alt={user?.name || "User"}
          className={`${size} rounded-full object-cover border-2 ${
            artistic
              ? "border-indigo-950 shadow-xl"
              : "border-white/20 shadow-md"
          }`}
          onError={(e) => {
            setImageError(true);
            const name = user?.name || "User";
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              name,
            )}&background=fbbf24&color=1e3a8a&size=128`;
          }}
        />
      </motion.div>
      {artistic && (
        <div className="absolute -top-1 -right-1 w-5 h-5 text-fuchsia-400 text-xs">
          ✦
        </div>
      )}
    </div>
  );
};

// User Badge Component - Krishna Themed
const UserBadge = ({ user, size = "md" }) => {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  if (user?.role === "admin") {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`flex items-center space-x-2 bg-gradient-to-r from-[#d946ef] to-[#63297D] text-white font-bold rounded-full shadow-lg shadow-fuchsia-500/20 ${sizeClasses[size]}`}
      >
        <FaCrown size={size === "sm" ? 10 : size === "md" ? 12 : 14} />
        <span>DIVINE ADMIN</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`flex items-center space-x-2 bg-cyan-500/15 text-cyan-200 border border-cyan-400/25 font-bold rounded-full ${sizeClasses[size]}`}
    >
      <FaPray size={size === "sm" ? 10 : size === "md" ? 12 : 14} />
      <span>DEVOTEE</span>
    </motion.div>
  );
};

// Comment Component - Krishna Themed
const CommentItem = ({
  comment,
  baseUrl,
  user,
  onReply,
  onLike,
  onEdit,
  onDelete,
  level = 0,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isLiked, setIsLiked] = useState(
    user && comment.likes?.includes(user._id),
  );
  const [likesCount, setLikesCount] = useState(comment.likes?.length || 0);
  const commentRef = useRef(null);

  useEffect(() => {
    if (commentRef.current) {
      gsap.fromTo(
        commentRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
        },
      );
    }
  }, []);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60));

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    await onReply(comment._id, replyContent);
    setReplyContent("");
    setShowReplyForm(false);
  };

  const handleLike = async () => {
    const result = await onLike(comment._id);
    if (result) {
      setIsLiked(result.liked);
      setLikesCount(result.likes);

      // GSAP heart animation
      gsap.fromTo(
        ".like-heart",
        { scale: 1 },
        {
          scale: 1.5,
          duration: 0.3,
          ease: "back.out(2)",
          yoyo: true,
          repeat: 1,
        },
      );
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    await onEdit(comment._id, editContent);
    setIsEditing(false);
  };

  const isOwner = user && comment.author?._id === user._id;
  const canReply = level < 2;

  return (
    <motion.div
      ref={commentRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${level > 0 ? "ml-4 sm:ml-8 mt-3 sm:mt-4" : "mb-4 sm:mb-6"}`}
    >
      <div className="backdrop-blur-xl bg-white/[0.06] rounded-xl sm:rounded-2xl shadow-lg border border-white/[0.1] hover:border-fuchsia-400/30 transition-all duration-300 p-3 sm:p-4">
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Avatar
              user={comment.author}
              size="w-8 h-8 sm:w-10 sm:h-10"
              baseUrl={baseUrl}
              artistic={false}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <h5 className="font-semibold text-white text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                  {comment.author?.name || "Anonymous Devotee"}
                </h5>
                <UserBadge user={comment.author} size="sm" />
              </div>
              <span className="text-slate-400 text-[10px] sm:text-xs">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>
          </div>

          {isOwner && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-fuchsia-200/50 hover:text-fuchsia-300 transition-colors duration-200"
              >
                <FaEdit size={12} />
              </button>
              <button
                onClick={() => onDelete(comment._id)}
                className="text-fuchsia-200/50 hover:text-red-400 transition-colors duration-200"
              >
                <FaTrash size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Comment Content */}
        <div className="mb-2 sm:mb-3">
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 sm:p-3 backdrop-blur-md bg-white/[0.06] border border-white/[0.12] rounded-xl text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-fuchsia-400/40 focus:border-fuchsia-400/30 outline-none resize-none text-sm"
                rows="3"
              />
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={handleEdit}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#d946ef] to-[#63297D] text-white rounded-lg font-medium hover:from-fuchsia-500 hover:to-purple-600 transition-all duration-200 text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save
                </motion.button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 text-fuchsia-200 rounded-lg font-medium hover:bg-white/20 transition-all duration-200 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p
              className={`text-xs sm:text-sm leading-relaxed ${comment.isDeleted ? "italic text-slate-500" : "text-slate-300"}`}
            >
              {comment.content}
            </p>
          )}
        </div>

        {/* Comment Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              disabled={!user}
              className={`like-heart flex items-center space-x-1 text-xs sm:text-sm transition-colors duration-200 ${
                isLiked
                  ? "text-fuchsia-400"
                  : "text-slate-400 hover:text-fuchsia-400"
              } disabled:opacity-50`}
            >
              {isLiked ? <FaThumbsUp size={12} /> : <FaRegThumbsUp size={12} />}
              <span>{likesCount}</span>
            </motion.button>

            {canReply && user && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center space-x-1 text-xs sm:text-sm text-slate-400 hover:text-cyan-300 transition-colors duration-200"
              >
                <FaReply size={10} />
                <span>Reply</span>
              </button>
            )}
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-fuchsia-400/20"
          >
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Avatar
                user={user}
                size="w-7 h-7 sm:w-8 sm:h-8"
                baseUrl={baseUrl}
                artistic={false}
              />
              <div className="flex-1">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Share your divine thoughts..."
                  className="w-full p-2 sm:p-3 backdrop-blur-md bg-white/[0.06] border border-white/[0.12] rounded-xl text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-fuchsia-400/40 focus:border-fuchsia-400/30 outline-none resize-none text-sm"
                  rows="2"
                />
                <div className="flex items-center justify-end space-x-2 mt-2">
                  <button
                    onClick={() => setShowReplyForm(false)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-fuchsia-200/60 hover:text-fuchsia-200 font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleReply}
                    disabled={!replyContent.trim()}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#d946ef] to-[#63297D] text-white rounded-lg font-medium hover:from-fuchsia-500 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1 sm:space-x-2 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPaperPlane size={10} />
                    <span>Reply</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              baseUrl={baseUrl}
              user={user}
              onReply={onReply}
              onLike={onLike}
              onEdit={onEdit}
              onDelete={onDelete}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Comment Form Component - Krishna Themed
const CommentForm = ({ user, baseUrl, onSubmit }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current && user) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      );
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || content.length > 500) return;

    setIsSubmitting(true);
    await onSubmit(content);
    setContent("");
    setIsSubmitting(false);
  };

  if (!user) {
    return (
      <div className="backdrop-blur-xl bg-white/[0.06] rounded-2xl shadow-lg border border-white/[0.1] p-6 text-center">
        <p className="text-slate-300 mb-4">
          Please log in to join the divine discussion
        </p>
        <Link
          to="/login"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#d946ef] to-[#63297D] text-white rounded-full font-semibold hover:from-fuchsia-500 hover:to-purple-600 transition-all duration-200 shadow-xl"
        >
          <span>Sign In to Comment</span>
        </Link>
      </div>
    );
  }

  return (
    <motion.form
      ref={formRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="backdrop-blur-xl bg-white/[0.06] rounded-xl sm:rounded-2xl shadow-lg border border-white/[0.1] hover:border-fuchsia-400/30 transition-all duration-300 p-4 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <Avatar
          user={user}
          size="w-10 h-10 sm:w-12 sm:h-12"
          baseUrl={baseUrl}
          artistic={false}
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your divine wisdom..."
            maxLength={500}
            className="w-full p-3 sm:p-4 backdrop-blur-md bg-white/5 border border-fuchsia-400/30 rounded-xl text-blue-100 placeholder-blue-100/50 focus:ring-2 focus:ring-fuchsia-400/50 focus:border-transparent outline-none resize-none text-sm sm:text-base"
            rows="3"
          />
          <div className="flex items-center justify-between mt-3 sm:mt-4">
            <span
              className={`text-xs sm:text-sm ${
                content.length > 450 ? "text-fuchsia-400" : "text-slate-400"
              }`}
            >
              {content.length}/500{" "}
              <span className="hidden sm:inline">characters</span>
            </span>
            <motion.button
              type="submit"
              disabled={!content.trim() || isSubmitting || content.length > 500}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#d946ef] to-[#63297D] text-white rounded-full font-semibold hover:from-fuchsia-500 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1 sm:space-x-2 shadow-xl text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <FaPaperPlane size={12} className="sm:w-[14px] sm:h-[14px]" />
              )}
              <span>{isSubmitting ? "Posting..." : "Post Comment"}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.form>
  );
};

// Related Posts Component - Krishna Themed
const RelatedPost = ({ post, baseUrl, index }) => {
  const postRef = useRef(null);

  useEffect(() => {
    if (postRef.current) {
      gsap.fromTo(
        postRef.current,
        { opacity: 0, x: 50, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: postRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none reverse",
          },
        },
      );
    }
  }, [index]);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return postDate.toLocaleDateString();
  };

  return (
    <motion.div
      ref={postRef}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group"
    >
      <Link to={`/blog/${post._id}`}>
        <div className="backdrop-blur-xl bg-white/[0.06] rounded-2xl shadow-lg border border-white/[0.1] hover:border-fuchsia-400/30 transition-all duration-300 overflow-hidden">
          {post.image && (
            <div className="relative overflow-hidden h-32">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          )}

          <div className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Avatar
                user={post.author}
                size="w-6 h-6"
                baseUrl={baseUrl}
                artistic={false}
              />
              <span className="text-xs text-slate-300">
                {post.author?.name || "Anonymous"}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                {formatTimeAgo(post.createdAt)}
              </span>
            </div>

            <h4 className="font-semibold text-white text-sm mb-2 line-clamp-2 group-hover:text-fuchsia-300 transition-colors duration-200">
              {post.title}
            </h4>

            <p className="text-slate-400 text-xs line-clamp-2">
              {post.content.substring(0, 80)}...
            </p>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-1 text-fuchsia-400">
                <FaHeart size={10} />
                <span className="text-xs">{post.likes?.length || 0}</span>
              </div>
              <span className="text-xs text-fuchsia-300 font-medium">
                Read more →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUrl = useApi();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Edit/Delete state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const editFileInputRef = useRef(null);

  // Refs for GSAP
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const statsRef = useRef(null);

  // SEO Implementation
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Krishnova Community Blog`;

      const metaDescription = document.querySelector(
        'meta[name="description"]',
      );
      const description = `${post.content.substring(
        0,
        150,
      )}... Read more spiritual wisdom from the Krishnova community.`;

      if (metaDescription) {
        metaDescription.content = description;
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = description;
        document.head.appendChild(meta);
      }

      // Open Graph tags
      const ogTags = [
        { property: "og:title", content: `${post.title} | Krishnova` },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: window.location.href },
        {
          property: "og:image",
          content: post.image || "",
        },
        {
          property: "article:author",
          content: post.author?.name || "Anonymous",
        },
        { property: "article:published_time", content: post.createdAt },
      ];

      ogTags.forEach((tag) => {
        let element = document.querySelector(
          `meta[property="${tag.property}"]`,
        );
        if (!element) {
          element = document.createElement("meta");
          element.setAttribute("property", tag.property);
          document.head.appendChild(element);
        }
        element.content = tag.content;
      });

      // Structured data
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: description,
        image: post.image || "",
        datePublished: post.createdAt,
        dateModified: post.updatedAt || post.createdAt,
        author: {
          "@type": "Person",
          name: post.author?.name || "Anonymous",
        },
        publisher: {
          "@type": "Organization",
          name: "Krishnova",
          logo: {
            "@type": "ImageObject",
            url: `${window.location.origin}/logo.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": window.location.href,
        },
      };

      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(structuredData);
    }

    return () => {
      document.title = "Krishnova - Authentic Krishna Spiritual Products";
    };
  }, [post, baseUrl]);

  // GSAP Animations
  useEffect(() => {
    if (!loading && post && mainRef.current) {
      // Clear existing ScrollTriggers
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      const ctx = gsap.context(() => {
        // Hero parallax
        gsap.to(".hero-bg-pattern", {
          yPercent: -30,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        // Title animation
        gsap.fromTo(
          ".post-title",
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
          },
        );

        // Content fade in
        gsap.fromTo(
          ".post-content",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.3,
            ease: "power3.out",
          },
        );

        // Stats counter animation
        if (statsRef.current) {
          gsap.fromTo(
            ".stat-item",
            { scale: 0, rotation: -180 },
            {
              scale: 1,
              rotation: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "back.out(1.7)",
            },
          );
        }

        // Floating elements
        gsap.to(".floating-element", {
          y: -20,
          duration: 2,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
          stagger: 0.2,
        });
      }, mainRef);

      return () => {
        ctx.revert();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }
  }, [loading, post]);

  // Smooth scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    fetchPost();
    fetchComments();
    fetchRelatedPosts();
  }, [id]);

  const fetchPost = async () => {
    try {
      // Use the new single post route
      const res = await axios.get(`${API}/blog/${id}`);
      const foundPost = res.data;

      if (!foundPost) {
        navigate("/communityblog");
        return;
      }

      // Transform post to have full URLs
      const transformedPost = transformPostData(foundPost);
      setPost(transformedPost);
      setLikesCount(transformedPost.likes?.length || 0);
      setIsLiked(user && transformedPost.likes?.includes(user._id));
    } catch (error) {
      console.error("Error fetching post:", error);
      navigate("/communityblog");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API}/comments/post/${id}`);
      const commentsData = res.data || [];
      // Transform comment author avatars to full URLs
      const transformedComments = commentsData.map((comment) => ({
        ...comment,
        user: comment.user
          ? {
              ...comment.user,
              avatar: getFullUrl(comment.user.avatar),
            }
          : null,
      }));
      setComments(transformedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      // We still use the main list for related posts, but handle the new structure
      const res = await axios.get(`${API}/blog?limit=4`);
      const postsArray = res.data.posts || [];

      const related = postsArray
        .filter((p) => p._id !== id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(transformPostData); // Transform URLs
      setRelatedPosts(related);
    } catch (error) {
      console.error("Error fetching related posts:", error);
      setRelatedPosts([]);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate("/login?redirect=" + window.location.pathname);
      return;
    }

    try {
      await axios.post(
        `${API}/blog/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

      // GSAP like animation
      gsap.fromTo(
        ".like-button",
        { scale: 1 },
        {
          scale: 1.2,
          duration: 0.3,
          ease: "back.out(2)",
          yoyo: true,
          repeat: 1,
        },
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.content.substring(0, 100) + "...",
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);

      // Show toast notification
      gsap.fromTo(
        ".share-toast",
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          onComplete: () => {
            gsap.to(".share-toast", {
              opacity: 0,
              y: -50,
              delay: 2,
              duration: 0.5,
            });
          },
        },
      );
    }
  };

  const handleCommentSubmit = async (content) => {
    try {
      await axios.post(
        `${API}/comments`,
        { postId: id, content },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleCommentReply = async (parentCommentId, content) => {
    try {
      await axios.post(
        `${API}/comments`,
        { postId: id, content, parentComment: parentCommentId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      fetchComments();
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const handleCommentLike = async (commentId) => {
    if (!user) return null;

    try {
      const res = await axios.post(
        `${API}/comments/${commentId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      fetchComments();
      return res.data;
    } catch (error) {
      console.error("Error liking comment:", error);
      return null;
    }
  };

  const handleCommentEdit = async (commentId, content) => {
    try {
      await axios.put(
        `${API}/comments/${commentId}`,
        { content },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      fetchComments();
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await axios.delete(`${API}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const isPostOwner =
    user &&
    post &&
    (post.author?._id === user._id ||
      post.author?.id === user._id ||
      post.author === user._id ||
      user.role === "admin");

  const openEditModal = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditImagePreview(post.image || null);
    setEditImage(null);
    setShowEditModal(true);
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      await axios.delete(`${API}/blog/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate("/communityblog");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEditPost = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim()) return;
    setIsEditSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("content", editContent);
      if (editImage) formData.append("image", editImage);

      const res = await axios.put(`${API}/blog/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setPost(res.data);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error editing post:", error);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return postDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{
          background:
            "radial-gradient(circle at center, #5b21b6 0%, #2e1065 50%, #170726 100%)",
        }}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-fuchsia-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-300 text-sm">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div
        className="min-h-screen"
        style={{
          background:
            "radial-gradient(circle at center, #5b21b6 0%, #2e1065 50%, #170726 100%)",
        }}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Post not found
            </h2>
            <Link
              to="/communityblog"
              className="text-fuchsia-400 hover:text-fuchsia-300 font-medium"
            >
              ← Back to Community
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mainRef}
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at center, #5b21b6 0%, #2e1065 50%, #170726 100%)",
      }}
    >
      {/* Floating Particles */}
      <FloatingParticles />

      {/* Background Patterns */}
      <div className="hero-bg-pattern fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* Dynamic Background Elements */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-fuchsia-500/[0.06] to-purple-500/[0.04] rounded-full blur-[100px] -z-10" />

      <div className="container max-w-4xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16 relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4 sm:mb-8"
        >
          <Link
            to="/communityblog"
            className="inline-flex items-center space-x-2 text-slate-300 hover:text-fuchsia-400 transition-colors duration-200 group"
          >
            <motion.div whileHover={{ x: -5 }} transition={{ duration: 0.2 }}>
              <FaArrowLeft />
            </motion.div>
            <span className="font-medium">Back to Divine Community</span>
          </Link>
        </motion.div>

        {/* Main Post Card */}
        <motion.article
          ref={heroRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mb-12"
        >
          {/* Artistic Background */}
          <div className="absolute inset-0 bg-white/[0.04] backdrop-blur-xl rounded-2xl sm:rounded-3xl"></div>

          {/* Floating Decorative Elements */}
          <div className="floating-element absolute -top-3 -right-3 w-6 h-6 text-fuchsia-400/40">
            <GiFeather />
          </div>

          <div className="floating-element absolute -bottom-3 -left-3 w-5 h-5 text-cyan-400/30">
            <GiFlute />
          </div>

          <div className="relative border border-white/[0.1] rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/20 backdrop-blur-sm overflow-hidden hover:border-fuchsia-400/20 transition-all duration-300">
            {/* Post Header */}
            <div className="p-4 sm:p-8 pb-4 sm:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Avatar
                    user={post.author}
                    baseUrl={baseUrl}
                    size="w-12 h-12 sm:w-16 sm:h-16"
                    artistic={true}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-2">
                      <h4 className="font-bold text-white text-base sm:text-lg truncate max-w-[150px] sm:max-w-none">
                        {post.author?.name || "Divine Devotee"}
                      </h4>
                      <UserBadge user={post.author} size="sm" />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:space-x-3 text-slate-400 text-xs sm:text-sm">
                      <div className="flex items-center space-x-1">
                        <FaCalendarAlt size={10} />
                        <span>{formatTimeAgo(post.createdAt)}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center space-x-1">
                        <FaGlobe size={10} />
                        <span>Public Post</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trending Badge */}
                {likesCount > 20 && (
                  <div className="flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#d946ef] to-[#63297D] text-white text-xs sm:text-sm font-bold rounded-full shadow-lg shadow-fuchsia-500/20 self-start sm:self-auto">
                    <FaSun size={10} />
                    <span>DIVINE TRENDING</span>
                  </div>
                )}

                {/* Owner actions */}
                {isPostOwner && (
                  <div className="flex items-center gap-1 self-start">
                    <button
                      onClick={openEditModal}
                      title="Edit story"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-fuchsia-300/70 hover:text-fuchsia-300 hover:bg-fuchsia-400/10 transition-colors text-sm"
                    >
                      <FaEdit size={13} />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={handleDeletePost}
                      title="Delete story"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-colors text-sm"
                    >
                      <FaTrash size={13} />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Sacred Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center space-x-2 sm:space-x-3 bg-fuchsia-500/10 backdrop-blur-xl border border-fuchsia-400/20 rounded-full px-3 sm:px-5 py-2 sm:py-2.5 shadow-lg shadow-fuchsia-500/5 mb-4 sm:mb-6"
              >
                <span className="text-fuchsia-400 text-sm sm:text-base">✦</span>
                <span className="text-fuchsia-200 font-medium tracking-wide text-xs sm:text-sm">
                  कृष्णं वन्दे जगद्गुरुम्
                </span>
                <span className="text-fuchsia-400 text-sm sm:text-base">✦</span>
              </motion.div>

              {/* Post Title */}
              <motion.h1 className="post-title text-xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                {post.title}
              </motion.h1>

              {/* Engagement Stats */}
              <div
                ref={statsRef}
                className="flex flex-wrap items-center gap-3 sm:gap-6 mb-4 sm:mb-6"
              >
                <div className="stat-item flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    {[...Array(Math.min(3, likesCount))].map((_, i) => (
                      <div
                        key={i}
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white shadow-lg ${
                          i === 0
                            ? "bg-gradient-to-r from-[#d946ef] to-[#63297D]"
                            : i === 1
                              ? "bg-gradient-to-r from-purple-400 to-blue-500"
                              : "bg-gradient-to-r from-cyan-400 to-teal-500"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">
                    {likesCount}{" "}
                    <span className="hidden sm:inline">divine</span> likes
                  </span>
                </div>

                <div className="stat-item flex items-center space-x-1 text-slate-300">
                  <FaEye size={12} className="text-cyan-400/60" />
                  <span className="text-xs sm:text-sm">
                    {Math.floor(Math.random() * 200) + 50} views
                  </span>
                </div>

                <div className="stat-item flex items-center space-x-1 text-slate-300">
                  <FaComment size={12} className="text-purple-400/60" />
                  <span className="text-xs sm:text-sm">
                    {comments.length} comments
                  </span>
                </div>
              </div>
            </div>

            {/* Post Image */}
            {post.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="relative mx-4 sm:mx-8 mb-6 sm:mb-8 overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full max-h-[600px] object-contain bg-black/20"
                />
              </motion.div>
            )}

            {/* Post Content */}
            <div ref={contentRef} className="px-4 sm:px-8 pb-6 sm:pb-8">
              <motion.div className="post-content relative">
                <FaQuoteLeft className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 text-fuchsia-400/15 text-xl sm:text-2xl" />
                <div className="text-slate-200 text-[15px] sm:text-lg leading-relaxed pl-6 sm:pl-8 pr-2 sm:pr-4">
                  <p className="whitespace-pre-wrap">{post.content}</p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/[0.08]"
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLike}
                    className={`like-button flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all duration-200 ${
                      isLiked
                        ? "text-rose-400 bg-rose-500/15"
                        : "text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                    }`}
                  >
                    <motion.div
                      animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {isLiked ? (
                        <FaHeart size={16} className="sm:w-5 sm:h-5" />
                      ) : (
                        <FaRegHeart size={16} className="sm:w-5 sm:h-5" />
                      )}
                    </motion.div>
                    <span className="font-semibold text-sm sm:text-base">
                      {likesCount}
                    </span>
                  </motion.button>

                  <button className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all duration-200">
                    <FaComment size={14} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="font-medium text-sm sm:text-base">
                      {comments.length}
                    </span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 transition-all duration-200"
                  >
                    <FaShareAlt size={14} className="sm:w-4 sm:h-4" />
                    <span className="font-semibold text-sm sm:text-base hidden sm:inline">
                      Share
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2 sm:p-3 rounded-xl transition-all duration-200 ${
                    isBookmarked
                      ? "text-fuchsia-400 bg-fuchsia-400/15"
                      : "text-slate-400 hover:text-fuchsia-400 hover:bg-fuchsia-400/10"
                  }`}
                >
                  {isBookmarked ? (
                    <FaBookmark size={16} className="sm:w-[18px] sm:h-[18px]" />
                  ) : (
                    <FaRegBookmark
                      size={16}
                      className="sm:w-[18px] sm:h-[18px]"
                    />
                  )}
                </button>
              </motion.div>
            </div>
          </div>
        </motion.article>

        {/* Share Toast Notification */}
        <motion.div className="share-toast fixed bottom-8 right-8 bg-gradient-to-r from-[#d946ef] to-[#63297D] text-white px-6 py-3 rounded-full shadow-2xl opacity-0 pointer-events-none">
          Link copied to clipboard!
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-8">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-[#d946ef] to-[#63297D] rounded-xl flex items-center justify-center flex-shrink-0">
              <FaComment className="text-white text-xs sm:text-sm" />
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-white">
              Discussion ({comments.length})
            </h3>
          </div>

          {/* Comment Form */}
          <div className="mb-8">
            <CommentForm
              user={user}
              baseUrl={baseUrl}
              onSubmit={handleCommentSubmit}
            />
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {commentsLoading ? (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-fuchsia-400 border-t-transparent rounded-full mx-auto"
                />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-14 backdrop-blur-xl bg-white/[0.04] rounded-2xl shadow-lg border border-white/[0.08]">
                <FaComment className="text-slate-500 text-3xl mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">
                  No comments yet
                </h4>
                <p className="text-slate-400">
                  Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {comments.map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                    baseUrl={baseUrl}
                    user={user}
                    onReply={handleCommentReply}
                    onLike={handleCommentLike}
                    onEdit={handleCommentEdit}
                    onDelete={handleCommentDelete}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-16"
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaInfinity className="text-white text-xs sm:text-sm" />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-white">
                Continue Your Spiritual Journey
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <RelatedPost
                  key={relatedPost._id}
                  post={relatedPost}
                  baseUrl={baseUrl}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Back to Community CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-10 sm:mt-16"
        >
          <Link
            to="/communityblog"
            className="inline-flex items-center px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#d946ef] to-[#63297D] text-white rounded-full font-bold text-sm sm:text-lg shadow-xl shadow-fuchsia-500/20 transition-all duration-300 hover:scale-105 hover:shadow-fuchsia-500/30 group"
          >
            <FaUserFriends className="mr-2 sm:mr-3 text-lg sm:text-xl" />
            <span className="hidden sm:inline">Explore More Wisdom</span>
            <span className="sm:hidden">Explore More</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="ml-2 sm:ml-3"
            >
              <FaArrowLeft className="rotate-180" />
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Edit Post Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#1e1040] border border-fuchsia-400/20 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FaEdit className="text-fuchsia-400" size={16} />
                Edit Story
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <FaGem size={14} className="rotate-45" />
              </button>
            </div>

            <form onSubmit={handleEditPost} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  maxLength={200}
                  className="w-full px-3 py-2.5 bg-white/[0.06] border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-400/50 text-sm"
                  placeholder="Story title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Content
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  maxLength={2000}
                  rows={6}
                  className="w-full px-3 py-2.5 bg-white/[0.06] border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-400/50 text-sm resize-none"
                  placeholder="Share your story..."
                />
                <p className="text-right text-xs text-slate-500 mt-1">
                  {editContent.length}/2000
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Image
                </label>
                {editImagePreview ? (
                  <div className="relative">
                    <img
                      src={editImagePreview}
                      alt="Preview"
                      className="w-full max-h-48 object-contain rounded-xl bg-black/20"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditImage(null);
                        setEditImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors"
                    >
                      <FaFeatherAlt
                        size={10}
                        className="text-white rotate-45"
                      />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 bg-white/[0.06] border border-white/20 rounded-xl text-slate-400 hover:text-fuchsia-300 hover:border-fuchsia-400/30 transition-colors text-sm w-full justify-center"
                  >
                    <FaGlobe size={12} />
                    <span>Add image</span>
                  </button>
                )}
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setEditImage(file);
                      setEditImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 bg-white/10 text-slate-300 rounded-xl font-medium hover:bg-white/20 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isEditSubmitting || !editTitle.trim() || !editContent.trim()
                  }
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#d946ef] to-[#63297D] text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                >
                  {isEditSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FaEdit size={13} />
                  )}
                  <span>{isEditSubmitting ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BlogPost;
