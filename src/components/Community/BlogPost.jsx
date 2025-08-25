import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { useApi } from "../../Context/baseUrl";
import { useAuth } from "../../Context/AuthContext";
import Navigation from "../Navigation/Navigation";
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

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const API = import.meta.env.VITE_API_URL;

// Floating Particles Component - Krishna Themed
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full opacity-40"
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            scale: [1, Math.random() * 0.5 + 0.5, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
      {/* Krishna Elements */}
      {["🦚", "🪈", "🪔", "📿"].map((emoji, i) => (
        <motion.div
          key={`emoji-${i}`}
          className="absolute text-2xl opacity-20"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: `${20 + i * 20}%`,
            top: `${10 + i * 15}%`,
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
};

// Enhanced Avatar Component - Krishna Themed
const Avatar = ({ user, size = "w-16 h-16", baseUrl, artistic = true }) => {
  const getAvatarUrl = () => {
    if (!user?.avatar) return "/user-avatar.png";
    if (user.avatar.startsWith("http")) return user.avatar;
    return baseUrl + user.avatar;
  };

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.1, rotate: artistic ? 5 : 0 }}
        className={`${
          artistic
            ? "p-1 bg-gradient-to-tr from-amber-400 via-yellow-500 to-orange-500 rounded-full"
            : ""
        }`}
      >
        <img
          src={getAvatarUrl()}
          alt={user?.name || "User"}
          className={`${size} rounded-full object-cover border-4 ${
            artistic
              ? "border-white shadow-2xl ring-4 ring-amber-200/50"
              : "border-white/50 shadow-lg"
          }`}
          onError={(e) => {
            e.target.src = "/user-avatar.png";
          }}
        />
      </motion.div>
      {artistic && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-2 -right-2 w-8 h-8 text-amber-400"
        >
          ✦
        </motion.div>
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
        whileHover={{ scale: 1.1 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(251, 191, 36, 0.5)",
            "0 0 30px rgba(251, 191, 36, 0.8)",
            "0 0 20px rgba(251, 191, 36, 0.5)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`flex items-center space-x-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-white font-bold rounded-full shadow-lg ${sizeClasses[size]}`}
      >
        <FaCrown size={size === "sm" ? 10 : size === "md" ? 12 : 14} />
        <span>DIVINE ADMIN</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`flex items-center space-x-2 bg-gradient-to-r from-purple-500 via-blue-600 to-cyan-500 text-white font-bold rounded-full shadow-lg ${sizeClasses[size]}`}
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
    user && comment.likes?.includes(user._id)
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
        }
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
        }
      );
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    await onEdit(comment._id, editContent);
    setIsEditing(false);
  };

  const isOwner = user && comment.author._id === user._id;
  const canReply = level < 2;

  return (
    <motion.div
      ref={commentRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${level > 0 ? "ml-8 mt-4" : "mb-6"}`}
    >
      <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-2xl border border-white/20 hover:border-amber-400/50 transition-all duration-300 p-4">
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar
              user={comment.author}
              size="w-10 h-10"
              baseUrl={baseUrl}
              artistic={false}
            />
            <div>
              <div className="flex items-center space-x-2">
                <h5 className="font-semibold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent text-sm">
                  {comment.author?.name}
                </h5>
                <UserBadge user={comment.author} size="sm" />
              </div>
              <span className="text-blue-100/60 text-xs">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>
          </div>

          {isOwner && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-amber-200/50 hover:text-amber-300 transition-colors duration-200"
              >
                <FaEdit size={12} />
              </button>
              <button
                onClick={() => onDelete(comment._id)}
                className="text-amber-200/50 hover:text-red-400 transition-colors duration-200"
              >
                <FaTrash size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Comment Content */}
        <div className="mb-3">
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 backdrop-blur-md bg-white/5 border border-amber-400/30 rounded-xl text-blue-100 placeholder-blue-100/50 focus:ring-2 focus:ring-amber-400/50 focus:border-transparent outline-none resize-none"
                rows="3"
              />
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg font-medium hover:from-amber-500 hover:to-orange-600 transition-all duration-200"
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
                  className="px-4 py-2 bg-white/10 text-amber-200 rounded-lg font-medium hover:bg-white/20 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-blue-100/80 text-sm leading-relaxed">
              {comment.content}
            </p>
          )}
        </div>

        {/* Comment Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              disabled={!user}
              className={`like-heart flex items-center space-x-1 text-sm transition-colors duration-200 ${
                isLiked
                  ? "text-amber-400"
                  : "text-amber-200/50 hover:text-amber-300"
              } disabled:opacity-50`}
            >
              {isLiked ? <FaThumbsUp size={14} /> : <FaRegThumbsUp size={14} />}
              <span>{likesCount}</span>
            </motion.button>

            {canReply && user && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center space-x-1 text-sm text-cyan-300/50 hover:text-cyan-300 transition-colors duration-200"
              >
                <FaReply size={12} />
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
            className="mt-4 pt-4 border-t border-amber-400/20"
          >
            <div className="flex space-x-3">
              <Avatar
                user={user}
                size="w-8 h-8"
                baseUrl={baseUrl}
                artistic={false}
              />
              <div className="flex-1">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Share your divine thoughts..."
                  className="w-full p-3 backdrop-blur-md bg-white/5 border border-amber-400/30 rounded-xl text-blue-100 placeholder-blue-100/50 focus:ring-2 focus:ring-amber-400/50 focus:border-transparent outline-none resize-none"
                  rows="2"
                />
                <div className="flex items-center justify-end space-x-2 mt-2">
                  <button
                    onClick={() => setShowReplyForm(false)}
                    className="px-4 py-2 text-amber-200/60 hover:text-amber-200 font-medium"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleReply}
                    disabled={!replyContent.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg font-medium hover:from-amber-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPaperPlane size={12} />
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
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    await onSubmit(content);
    setContent("");
    setIsSubmitting(false);
  };

  if (!user) {
    return (
      <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-2xl border border-white/20 p-6 text-center">
        <p className="text-blue-100/80 mb-4">
          Please log in to join the divine discussion
        </p>
        <Link
          to="/login"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-semibold hover:from-amber-500 hover:to-orange-600 transition-all duration-200 shadow-xl"
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
      className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-2xl border border-white/20 hover:border-amber-400/50 transition-all duration-300 p-6"
    >
      <div className="flex space-x-4">
        <Avatar
          user={user}
          size="w-12 h-12"
          baseUrl={baseUrl}
          artistic={false}
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your divine wisdom..."
            className="w-full p-4 backdrop-blur-md bg-white/5 border border-amber-400/30 rounded-xl text-blue-100 placeholder-blue-100/50 focus:ring-2 focus:ring-amber-400/50 focus:border-transparent outline-none resize-none"
            rows="4"
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-amber-200/60">
              {content.length}/500 characters
            </span>
            <motion.button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-semibold hover:from-amber-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-xl"
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
                <FaPaperPlane size={14} />
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
        }
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
        <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-2xl border border-white/20 hover:border-amber-400/50 transition-all duration-300 overflow-hidden">
          {post.image && (
            <div className="relative overflow-hidden h-32">
              <img
                src={
                  post.image.startsWith("http")
                    ? post.image
                    : baseUrl + post.image
                }
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
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
              <span className="text-xs text-amber-200/60">
                {post.author?.name}
              </span>
              <span className="text-xs text-blue-100/40">•</span>
              <span className="text-xs text-blue-100/40">
                {formatTimeAgo(post.createdAt)}
              </span>
            </div>

            <h4 className="font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent text-sm mb-2 line-clamp-2 group-hover:text-amber-300 transition-colors duration-200">
              {post.title}
            </h4>

            <p className="text-blue-100/60 text-xs line-clamp-2">
              {post.content.substring(0, 80)}...
            </p>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-1 text-amber-400">
                <FaHeart size={10} />
                <span className="text-xs">{post.likes?.length || 0}</span>
              </div>
              <span className="text-xs text-cyan-300 font-medium">
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
        'meta[name="description"]'
      );
      const description = `${post.content.substring(
        0,
        150
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
          content: post.image?.startsWith("http")
            ? post.image
            : baseUrl + post.image,
        },
        { property: "article:author", content: post.author?.name },
        { property: "article:published_time", content: post.createdAt },
      ];

      ogTags.forEach((tag) => {
        let element = document.querySelector(
          `meta[property="${tag.property}"]`
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
        image: post.image?.startsWith("http")
          ? post.image
          : baseUrl + post.image,
        datePublished: post.createdAt,
        dateModified: post.updatedAt || post.createdAt,
        author: {
          "@type": "Person",
          name: post.author?.name,
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
          }
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
          }
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
            }
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
      const res = await axios.get(`${API}/blog`);
      const foundPost = res.data.find((p) => p._id === id);

      if (!foundPost) {
        navigate("/communityblog");
        return;
      }

      setPost(foundPost);
      setLikesCount(foundPost.likes?.length || 0);
      setIsLiked(user && foundPost.likes?.includes(user._id));
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
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      const res = await axios.get(`${API}/blog`);
      const related = res.data
        .filter((p) => p._id !== id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      setRelatedPosts(related);
    } catch (error) {
      console.error("Error fetching related posts:", error);
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
        }
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-amber-200 mb-4">
              Post not found
            </h2>
            <Link
              to="/communityblog"
              className="text-cyan-300 hover:text-cyan-400 font-medium"
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
      className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900"
    >
      <Navigation />

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Background Patterns */}
      <div className="hero-bg-pattern fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
            linear-gradient(to right, #fbbf24 1px, transparent 1px),
            linear-gradient(to bottom, #fbbf24 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Dynamic Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="fixed top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl -z-10"
      />

      <div className="container max-w-4xl mx-auto px-6 pt-24 pb-16 relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/communityblog"
            className="inline-flex items-center space-x-2 text-amber-200 hover:text-amber-300 transition-colors duration-200 group"
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
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-white/5 backdrop-blur-xl rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-yellow-500/10 rounded-3xl"></div>

          {/* Floating Decorative Elements */}
          <motion.div className="floating-element absolute -top-4 -right-4 w-8 h-8 text-amber-400 opacity-60">
            🦚
          </motion.div>

          <motion.div className="floating-element absolute -bottom-4 -left-4 w-6 h-6 text-cyan-400 opacity-40">
            🪈
          </motion.div>

          <div className="relative border border-white/20 rounded-3xl shadow-2xl backdrop-blur-sm overflow-hidden hover:border-amber-400/50 transition-all duration-300">
            {/* Post Header */}
            <div className="p-8 pb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Avatar
                    user={post.author}
                    baseUrl={baseUrl}
                    size="w-16 h-16"
                    artistic={true}
                  />
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent text-lg">
                        {post.author?.name || "Divine Devotee"}
                      </h4>
                      <UserBadge user={post.author} size="md" />
                    </div>
                    <div className="flex items-center space-x-3 text-blue-100/60 text-sm">
                      <FaCalendarAlt size={12} />
                      <span>{formatTimeAgo(post.createdAt)}</span>
                      <FaDotCircle size={4} />
                      <FaGlobe size={12} />
                      <span>Public Post</span>
                    </div>
                  </div>
                </div>

                {/* Trending Badge */}
                {likesCount > 20 && (
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500 text-white text-sm font-bold rounded-full shadow-lg"
                  >
                    <FaSun size={12} />
                    <span>DIVINE TRENDING</span>
                  </motion.div>
                )}
              </div>

              {/* Sacred Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 rounded-full px-5 py-2.5 shadow-lg mb-6"
              >
                <span className="text-amber-300 animate-pulse text-lg">✦</span>
                <span className="text-amber-100 font-medium tracking-wide text-sm">
                  कृष्णं वन्दे जगद्गुरुम्
                </span>
                <span className="text-amber-300 animate-pulse text-lg">✦</span>
              </motion.div>

              {/* Post Title */}
              <motion.h1 className="post-title text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-6 leading-tight">
                {post.title}
              </motion.h1>

              {/* Engagement Stats */}
              <div ref={statsRef} className="flex items-center space-x-6 mb-6">
                <div className="stat-item flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${
                          i === 0
                            ? "bg-gradient-to-r from-amber-400 to-orange-500"
                            : i === 1
                            ? "bg-gradient-to-r from-purple-400 to-blue-500"
                            : "bg-gradient-to-r from-cyan-400 to-teal-500"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-amber-200">
                    {likesCount} divine likes
                  </span>
                </div>

                <div className="stat-item flex items-center space-x-1 text-cyan-300">
                  <FaEye size={14} />
                  <span className="text-sm">
                    {Math.floor(Math.random() * 200) + 50} views
                  </span>
                </div>

                <div className="stat-item flex items-center space-x-1 text-purple-300">
                  <FaComment size={14} />
                  <span className="text-sm">{comments.length} comments</span>
                </div>
              </div>
            </div>

            {/* Post Image */}
            {post.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="relative mx-8 mb-8 overflow-hidden rounded-2xl shadow-2xl"
              >
                <img
                  src={
                    post.image.startsWith("http")
                      ? post.image
                      : baseUrl + post.image
                  }
                  alt={post.title}
                  className="w-full max-h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </motion.div>
            )}

            {/* Post Content */}
            <div ref={contentRef} className="px-8 pb-8">
              <motion.div className="post-content relative">
                <FaQuoteLeft className="absolute -top-4 -left-4 text-amber-200/30 text-3xl" />
                <div className="text-blue-100/80 text-lg leading-relaxed pl-8 pr-4">
                  <p className="whitespace-pre-wrap font-light">
                    {post.content}
                  </p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between mt-8 pt-6 border-t border-amber-400/20"
              >
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLike}
                    className={`like-button flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      isLiked
                        ? "text-amber-400 bg-amber-400/20 hover:bg-amber-400/30"
                        : "text-amber-200/60 hover:text-amber-300 hover:bg-amber-400/10"
                    }`}
                  >
                    <motion.div
                      animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {isLiked ? (
                        <FaHeart size={20} />
                      ) : (
                        <FaRegHeart size={20} />
                      )}
                    </motion.div>
                    <span className="font-semibold">{likesCount}</span>
                  </motion.button>

                  <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-cyan-300/60 hover:text-cyan-300 hover:bg-cyan-400/10 transition-all duration-300">
                    <FaComment size={18} />
                    <span className="font-semibold">{comments.length}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full text-purple-300/60 hover:text-purple-300 hover:bg-purple-400/10 transition-all duration-300"
                  >
                    <FaShareAlt size={16} />
                    <span className="font-semibold">Share</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isBookmarked
                      ? "text-yellow-400 bg-yellow-400/20 hover:bg-yellow-400/30"
                      : "text-yellow-300/60 hover:text-yellow-300 hover:bg-yellow-400/10"
                  }`}
                >
                  {isBookmarked ? (
                    <FaBookmark size={18} />
                  ) : (
                    <FaRegBookmark size={18} />
                  )}
                </button>
              </motion.div>
            </div>
          </div>
        </motion.article>

        {/* Share Toast Notification */}
        <motion.div className="share-toast fixed bottom-8 right-8 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-2xl opacity-0 pointer-events-none">
          Link copied to clipboard! 🎉
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-3 mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center"
            >
              <FaComment className="text-white text-sm" />
            </motion.div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
              Divine Discussion ({comments.length})
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
                  className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto"
                />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12 backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-lg border border-white/20">
                <FaComment className="text-amber-200/40 text-4xl mx-auto mb-4" />
                <h4 className="text-xl font-bold text-amber-200 mb-2">
                  No comments yet
                </h4>
                <p className="text-blue-100/60">
                  Be the first to share your divine thoughts!
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
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center"
              >
                <FaInfinity className="text-white text-sm" />
              </motion.div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent">
                Continue Your Spiritual Journey
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
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
          className="text-center mt-16"
        >
          <Link
            to="/communityblog"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
          >
            <FaUserFriends className="mr-3 text-xl" />
            <span>Explore More Divine Wisdom</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="ml-3"
            >
              <FaArrowLeft className="rotate-180" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPost;
