import React, { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../../Context/baseUrl";
import Navigation from "../Navigation/NavigationGSAP";
import axios from "axios";
import { gsap } from "gsap";
import Modal from "../UI/Modal";
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
  FaBook,
  FaOm,
  FaHandsHelping,
  FaPlus,
  FaPen,
  FaUpload,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";

// Sanga System Imports
import {
  SangaProvider,
  useSanga,
  DevoteeLevelCard,
  LevelProgressMini,
  SpiritualHotspotMap,
  LilaStoryCard,
  RasaFilterBar,
  VibrationMatcher,
  VibrationSelector,
  DevoteeEventCard,
} from "./SangaSystem";

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

// Enhanced Tab Navigation with Sanga tabs
const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "lilas", label: "Modern Lilas", icon: FaBook, emoji: "📖" },
    { id: "events", label: "Sacred Events", icon: FaCalendarAlt, emoji: "🎉" },
    { id: "sanga", label: "My Sanga", icon: FaHandsHelping, emoji: "🙏" },
    { id: "hotspots", label: "Hotspots", icon: FaMapMarkerAlt, emoji: "📍" },
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
                    {tab.emoji || tab.label.split(" ")[0]}
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

// ==================== CREATE LILA MODAL ====================
const CreateLilaModal = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedRasas, setSelectedRasas] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const RASAS = [
    { id: "shanta", name: "Shanta", emoji: "🕊️", meaning: "Peace" },
    { id: "dasya", name: "Dasya", emoji: "🙏", meaning: "Service" },
    { id: "sakhya", name: "Sakhya", emoji: "🤝", meaning: "Friendship" },
    { id: "vatsalya", name: "Vatsalya", emoji: "💛", meaning: "Parental Love" },
    { id: "madhurya", name: "Madhurya", emoji: "💕", meaning: "Sweet Love" },
    { id: "karuna", name: "Karuna", emoji: "💙", meaning: "Compassion" },
    { id: "adbhuta", name: "Adbhuta", emoji: "✨", meaning: "Wonder" },
    { id: "vira", name: "Vira", emoji: "⚔️", meaning: "Heroic" },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRasaToggle = (rasaId) => {
    setSelectedRasas((prev) =>
      prev.includes(rasaId)
        ? prev.filter((r) => r !== rasaId)
        : prev.length < 3
          ? [...prev, rasaId]
          : prev,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);
      if (selectedRasas.length > 0) {
        formData.append("rasas", JSON.stringify(selectedRasas));
      }

      await axios.post(`${API}/blog`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset form
      setTitle("");
      setContent("");
      setImage(null);
      setImagePreview(null);
      setSelectedRasas([]);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create lila");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Mobile drag handle */}
      <div className="sm:hidden flex justify-center pt-2 pb-1">
        <div className="w-12 h-1.5 bg-white/30 rounded-full" />
      </div>

      {/* Header - Sticky */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <FaPen className="text-indigo-900" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-amber-300 truncate">
                Share Your Lila
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/60">
                Share your divine story
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
          >
            <FaTimes className="text-blue-100/60 text-lg" />
          </button>
        </div>
      </div>

      {/* Form - Scrollable */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-amber-300 mb-2">
            Title of Your Lila
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., The Day Krishna Answered My Prayer..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-blue-100 placeholder-blue-100/40 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-amber-300 mb-2">
            Your Divine Story
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience of Krishna's grace in your life..."
            rows={4}
            className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-blue-100 placeholder-blue-100/40 focus:outline-none focus:border-amber-400/50 text-sm resize-none"
          />
        </div>

        {/* Rasa Selection */}
        <div>
          <label className="block text-sm font-medium text-amber-300 mb-2">
            Spiritual Rasa (up to 3)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {RASAS.map((rasa) => (
              <button
                key={rasa.id}
                type="button"
                onClick={() => handleRasaToggle(rasa.id)}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                  selectedRasas.includes(rasa.id)
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900"
                    : "bg-white/10 text-blue-100/70 active:bg-white/20"
                }`}
              >
                <span className="text-sm">{rasa.emoji}</span>
                <span>{rasa.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-amber-300 mb-2">
            Add Image (optional)
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-32 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-full"
              >
                <FaTimes className="text-white" size={10} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 border-2 border-dashed border-white/20 rounded-xl active:border-amber-400/40 transition-colors flex items-center justify-center gap-2"
            >
              <FaImage className="text-xl text-blue-100/40" />
              <span className="text-blue-100/60 text-sm">Upload image</span>
            </button>
          )}
        </div>
      </form>

      {/* Submit Button - Sticky at bottom */}
      <div className="sticky bottom-0 p-4 bg-gradient-to-t from-indigo-900 via-indigo-900/95 to-transparent pt-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 rounded-xl font-bold text-base shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" />
              Sharing...
            </>
          ) : (
            <>
              <FaFeatherAlt />
              Share Lila
            </>
          )}
        </button>
      </div>
    </Modal>
  );
};

// ==================== CREATE EVENT MODAL ====================
const CreateEventModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "kirtan",
    city: "",
    address: "",
    dateTime: "",
    duration: "60",
    maxParticipants: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const EVENT_TYPES = [
    { id: "kirtan", label: "Kirtan", emoji: "🎵" },
    { id: "satsang", label: "Satsang", emoji: "🙏" },
    { id: "prasadam", label: "Prasadam Distribution", emoji: "🍲" },
    { id: "study", label: "Scripture Study", emoji: "📖" },
    { id: "festival", label: "Festival", emoji: "🎉" },
    { id: "seva", label: "Seva (Service)", emoji: "🤲" },
    { id: "meditation", label: "Meditation", emoji: "🧘" },
    { id: "other", label: "Other", emoji: "✨" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.dateTime
    ) {
      setError("Title, description, and date/time are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("eventType", formData.eventType);
      submitData.append("city", formData.city);
      submitData.append("address", formData.address);
      submitData.append("dateTime", formData.dateTime);
      submitData.append("duration", formData.duration);
      if (formData.maxParticipants) {
        submitData.append("maxParticipants", formData.maxParticipants);
      }
      if (image) submitData.append("image", image);

      await axios.post(`${API}/community-events`, submitData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        eventType: "kirtan",
        city: "",
        address: "",
        dateTime: "",
        duration: "60",
        maxParticipants: "",
      });
      setImage(null);
      setImagePreview(null);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Mobile drag handle */}
      <div className="sm:hidden flex justify-center pt-2 pb-1">
        <div className="w-12 h-1.5 bg-white/30 rounded-full" />
      </div>

      {/* Header - Sticky */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <FaCalendarAlt className="text-indigo-900" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-amber-300 truncate">
                Create Event
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/60">
                Organize a gathering
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
          >
            <FaTimes className="text-blue-100/60 text-lg" />
          </button>
        </div>
      </div>

      {/* Form - Scrollable */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {error && (
          <div className="p-2.5 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-amber-300 mb-1.5">
            Event Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Sunday Kirtan Mela"
            className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-blue-100 placeholder-blue-100/40 focus:outline-none focus:border-amber-400/50 text-sm"
          />
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-amber-300 mb-1.5">
            Event Type
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {EVENT_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, eventType: type.id }))
                }
                className={`px-1.5 py-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-0.5 ${
                  formData.eventType === type.id
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900"
                    : "bg-white/10 text-blue-100/70 active:bg-white/20"
                }`}
              >
                <span className="text-base">{type.emoji}</span>
                <span className="truncate w-full text-center text-[10px]">
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-amber-300 mb-1.5">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your event..."
            rows={2}
            className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-blue-100 placeholder-blue-100/40 focus:outline-none focus:border-amber-400/50 resize-none text-sm"
          />
        </div>

        {/* Date & Duration - Side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-amber-300 mb-1.5">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              className="w-full px-2 py-2.5 bg-white/10 border border-white/20 rounded-xl text-blue-100 focus:outline-none focus:border-amber-400/50 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-300 mb-1.5">
              Duration
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-2 py-2.5 bg-white/10 border border-white/20 rounded-xl text-blue-100 focus:outline-none focus:border-amber-400/50 text-sm"
            >
              <option value="30">30 min</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hrs</option>
              <option value="120">2 hours</option>
              <option value="180">3 hours</option>
              <option value="240">4+ hours</option>
            </select>
          </div>
        </div>

        {/* City & Max Participants */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-amber-300 mb-1.5">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Mumbai, NYC..."
              className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-blue-100 placeholder-blue-100/40 focus:outline-none focus:border-amber-400/50 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-300 mb-1.5">
              Max People
            </label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              placeholder="Unlimited"
              className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-blue-100 placeholder-blue-100/40 focus:outline-none focus:border-amber-400/50 text-sm"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-amber-300 mb-1.5">
            Address (optional)
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full venue address or 'Online'"
            className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-blue-100 placeholder-blue-100/40 focus:outline-none focus:border-amber-400/50 text-sm"
          />
        </div>

        {/* Image Upload - Compact */}
        <div>
          <label className="block text-sm font-medium text-amber-300 mb-1.5">
            Image (optional)
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-24 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="absolute top-1.5 right-1.5 p-1.5 bg-red-500/80 rounded-full"
              >
                <FaTimes className="text-white" size={10} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl active:border-amber-400/40 transition-colors flex items-center justify-center gap-2"
            >
              <FaImage className="text-lg text-blue-100/40" />
              <span className="text-blue-100/60 text-sm">Upload image</span>
            </button>
          )}
        </div>
      </form>

      {/* Submit Button - Sticky at bottom */}
      <div className="sticky bottom-0 p-4 bg-gradient-to-t from-indigo-900 via-indigo-900/95 to-transparent pt-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 rounded-xl font-bold text-base shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <FaCalendarAlt />
              Create Event
            </>
          )}
        </button>
      </div>
    </Modal>
  );
};

// ==================== FLOATING ACTION BUTTON ====================
const FloatingCreateButton = ({
  activeTab,
  onCreateLila,
  onCreateEvent,
  isLoggedIn,
}) => {
  if (!isLoggedIn) return null;

  // Show specific button based on active tab
  if (activeTab === "lilas") {
    return (
      <button
        onClick={onCreateLila}
        className="fixed bottom-20 sm:bottom-8 right-4 sm:right-6 w-14 h-14 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-xl shadow-amber-500/40 flex items-center justify-center z-[90] active:scale-90 transition-transform duration-150"
        style={{ touchAction: "manipulation" }}
      >
        <FaPen className="text-indigo-900 text-xl" />
      </button>
    );
  }

  if (activeTab === "events") {
    return (
      <button
        onClick={onCreateEvent}
        className="fixed bottom-20 sm:bottom-8 right-4 sm:right-6 w-14 h-14 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-xl shadow-amber-500/40 flex items-center justify-center z-[90] active:scale-90 transition-transform duration-150"
        style={{ touchAction: "manipulation" }}
      >
        <FaPlus className="text-indigo-900 text-xl" />
      </button>
    );
  }

  return null;
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
    <div
      className="animate-fadeInUp backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 shadow-xl overflow-hidden hover:border-amber-400/30 transition-all duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
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
    </div>
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
          classes:
            "bg-gray-600/50 text-gray-400 cursor-not-allowed border border-gray-600",
          disabled: true,
        };
      case "ongoing":
        return {
          text: "Join Live Event 🔴",
          classes:
            "bg-gradient-to-r from-green-400 to-cyan-400 text-indigo-900 animate-pulse hover:shadow-green-500/30",
          disabled: false,
        };
      default:
        return {
          text: "Join Event",
          classes:
            "bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 hover:shadow-amber-500/30",
          disabled: false,
        };
    }
  };

  const btnConfig = getButtonConfig();

  return (
    <div
      className="animate-fadeInUp backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 shadow-xl overflow-hidden hover:border-amber-400/30 transition-all duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
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
              {status === "upcoming"
                ? "Starts soon"
                : status === "ongoing"
                  ? "Happening now"
                  : "Ended"}
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
    </div>
  );
};

// Inner Community Content Component (uses Sanga context)
function CommunityContent() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const baseUrl = useApi();
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("lilas");
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedRasas, setSelectedRasas] = useState([]);

  // Modal states
  const [showCreateLila, setShowCreateLila] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  // Access Sanga context
  const { addSpiritualPoints, devoteeData, canAccessEvent } = useSanga();

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
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p._id === postId) {
          const isLiked = p.likes.includes(user._id);
          return {
            ...p,
            likes: isLiked
              ? p.likes.filter((id) => id !== user._id)
              : [...p.likes, user._id],
          };
        }
        return p;
      }),
    );

    try {
      await axios.post(
        `${API}/blog/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
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
              Krishna Sanga
            </span>
          </h1>
          <p className="text-blue-100/80 text-sm sm:text-lg px-4">
            {activeTab === "lilas"
              ? "Share and discover modern divine stories"
              : activeTab === "events"
                ? "Join sacred gatherings based on your level"
                : activeTab === "sanga"
                  ? "Find souls on your spiritual wavelength"
                  : "Connect with devotees at sacred locations"}
          </p>
        </div>

        {/* Level Progress - Shows on all tabs */}
        <div className="px-4 mb-6">
          <DevoteeLevelCard showProgress={true} />
        </div>

        {/* Tabs */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content */}
        <div className="px-4">
          {/* Tab content with CSS transitions */}
          <div className="transition-opacity duration-300">
            {/* LILAS TAB - Modern Divine Stories */}
            {activeTab === "lilas" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Rasa Filter */}
                <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 p-4">
                  <h3 className="text-sm font-semibold text-amber-300 mb-3 flex items-center gap-2">
                    <FaBook />
                    Filter by Spiritual Rasa
                  </h3>
                  <RasaFilterBar
                    selectedRasas={selectedRasas}
                    onToggleRasa={(rasa) => {
                      setSelectedRasas((prev) =>
                        prev.includes(rasa)
                          ? prev.filter((r) => r !== rasa)
                          : [...prev, rasa],
                      );
                    }}
                    compact={true}
                  />
                </div>

                {/* Stories as Lilas */}
                {posts.length > 0 ? (
                  posts
                    .filter((post) => {
                      if (selectedRasas.length === 0) return true;
                      const storyRasas = post.rasas || ["shanta"];
                      return selectedRasas.some((r) => storyRasas.includes(r));
                    })
                    .map((post, index) => (
                      <LilaStoryCard
                        key={post._id}
                        story={post}
                        user={user}
                        onLike={handleLike}
                        baseUrl={baseUrl}
                        index={index}
                      />
                    ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📖</div>
                    <p className="text-amber-300 text-lg">
                      No Lilas shared yet
                    </p>
                    <p className="text-blue-100/60 mt-2">
                      Be the first to share your divine story!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* EVENTS TAB - Devotee Level Based */}
            {activeTab === "events" && (
              <div className="space-y-6 animate-fadeIn">
                {events.length > 0 ? (
                  <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                    {events.map((event, index) => (
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
                    <p className="text-amber-300 text-lg">
                      No events scheduled
                    </p>
                    <p className="text-blue-100/60 mt-2">
                      Check back soon for divine gatherings!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* SANGA TAB - Vibration Matching */}
            {activeTab === "sanga" && (
              <div className="animate-fadeIn">
                <VibrationMatcher
                  onConnect={(devotee) => {
                    console.log("Connect with:", devotee);
                    // Would navigate to chat or connection page
                  }}
                />
              </div>
            )}

            {/* HOTSPOTS TAB - Sacred Locations Map */}
            {activeTab === "hotspots" && (
              <div className="animate-fadeIn">
                <SpiritualHotspotMap compact={false} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Create Button */}
      <FloatingCreateButton
        activeTab={activeTab}
        onCreateLila={() =>
          user ? setShowCreateLila(true) : navigate("/login")
        }
        onCreateEvent={() =>
          user ? setShowCreateEvent(true) : navigate("/login")
        }
        isLoggedIn={!!user}
      />

      {/* Create Lila Modal */}
      <CreateLilaModal
        isOpen={showCreateLila}
        onClose={() => setShowCreateLila(false)}
        onSuccess={() => {
          fetchPosts();
          addSpiritualPoints("sharing_story");
        }}
      />

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateEvent}
        onClose={() => setShowCreateEvent(false)}
        onSuccess={() => {
          fetchEvents();
          addSpiritualPoints("attending_event");
        }}
      />
    </div>
  );
}

// Main Export - Wrapped with SangaProvider
export default function CommunityBlog() {
  return (
    <SangaProvider>
      <CommunityContent />
    </SangaProvider>
  );
}
