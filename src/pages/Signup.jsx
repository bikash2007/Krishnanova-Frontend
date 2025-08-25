import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../Context/AuthContext";
import Navigation from "../components/Navigation/Navigation";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCamera,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaUpload,
} from "react-icons/fa";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFileChange = (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrors({
        ...errors,
        avatar: "Please select a valid image file (JPEG, PNG, or WebP)",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, avatar: "File size must be less than 5MB" });
      return;
    }

    setProfilePhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrors({ ...errors, avatar: "" });
  };

  const handleFileInputChange = (e) => {
    handleFileChange(e.target.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("username", formData.username.trim());
      data.append("email", formData.email.trim());
      data.append("password", formData.password);

      if (profilePhoto) {
        data.append("avatar", profilePhoto);
      }

      const result = await signup(data);

      if (result.success) {
        navigate("/profile");
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({
        general: "Signup failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    setPreviewUrl(null);
    if (errors.avatar) setErrors({ ...errors, avatar: "" });
  };

  const passwordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-cyan-400";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center p-4 md:p-8">
      <Navigation />

      {/* Background Patterns */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #fbbf24 1px, transparent 1px),
            linear-gradient(to bottom, #fbbf24 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg mx-auto mt-20 relative z-10"
      >
        <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-5xl mb-4"
            >
              🕉️
            </motion.div>
            <motion.h2
              className="text-3xl font-bold text-indigo-900 mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Join Krishnova
            </motion.h2>
            <motion.p
              className="text-indigo-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Begin your spiritual journey today
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* General Error */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-2"
              >
                <FaTimes />
                {errors.general}
              </motion.div>
            )}

            {/* Profile Photo Upload */}
            <div className="space-y-2">
              <label className="block font-semibold text-amber-300 mb-3">
                Profile Photo (Optional)
              </label>

              <div className="flex flex-col items-center space-y-4">
                {/* Photo Preview */}
                {previewUrl ? (
                  <div className="relative group">
                    <img
                      src={previewUrl}
                      alt="Profile Preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-amber-400/30 shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center border-2 border-dashed border-amber-400/30">
                    <FaCamera className="text-amber-400/50 text-2xl" />
                  </div>
                )}

                {/* Drag & Drop Area */}
                <div
                  className={`w-full border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer ${
                    dragActive
                      ? "border-amber-400 bg-amber-400/10"
                      : "border-white/20 hover:border-amber-400/50 hover:bg-white/5"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() =>
                    document.getElementById("avatar-input").click()
                  }
                >
                  <FaUpload className="mx-auto text-2xl text-amber-400/50 mb-2" />
                  <p className="text-sm text-blue-100/80 mb-1">
                    {dragActive
                      ? "Drop your photo here!"
                      : "Click or drag to upload"}
                  </p>
                  <p className="text-xs text-blue-100/50">
                    JPEG, PNG, WebP up to 5MB
                  </p>
                </div>

                <input
                  id="avatar-input"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {errors.avatar && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm flex items-center gap-2"
                >
                  <FaTimes className="text-xs" />
                  {errors.avatar}
                </motion.div>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="block font-semibold text-amber-300">
                Full Name *
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400/50" />
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 backdrop-blur-md bg-white/10 border rounded-xl text-blue-100 placeholder-blue-100/40 focus:border-amber-400/50 focus:bg-white/15 transition-all ${
                    errors.name ? "border-red-500/50" : "border-white/20"
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm flex items-center gap-1"
                >
                  <FaTimes className="text-xs" />
                  {errors.name}
                </motion.div>
              )}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="block font-semibold text-amber-300">
                Username *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400/50 font-mono">
                  @
                </span>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 backdrop-blur-md bg-white/10 border rounded-xl text-blue-100 placeholder-blue-100/40 focus:border-amber-400/50 focus:bg-white/15 transition-all ${
                    errors.username ? "border-red-500/50" : "border-white/20"
                  }`}
                  placeholder="Choose a username"
                />
              </div>
              {errors.username && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm flex items-center gap-1"
                >
                  <FaTimes className="text-xs" />
                  {errors.username}
                </motion.div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block font-semibold text-amber-300">
                Email Address *
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400/50" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 backdrop-blur-md bg-white/10 border rounded-xl text-blue-100 placeholder-blue-100/40 focus:border-amber-400/50 focus:bg-white/15 transition-all ${
                    errors.email ? "border-red-500/50" : "border-white/20"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm flex items-center gap-1"
                >
                  <FaTimes className="text-xs" />
                  {errors.email}
                </motion.div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block font-semibold text-amber-300">
                Password *
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400/50" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 backdrop-blur-md bg-white/10 border rounded-xl text-blue-100 placeholder-blue-100/40 focus:border-amber-400/50 focus:bg-white/15 transition-all ${
                    errors.password ? "border-red-500/50" : "border-white/20"
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400/50 hover:text-amber-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          passwordStrength(formData.password) >= level
                            ? getPasswordStrengthColor(
                                passwordStrength(formData.password)
                              )
                            : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-blue-100/60">
                    Password strength:{" "}
                    <span className="font-medium text-amber-300">
                      {getPasswordStrengthText(
                        passwordStrength(formData.password)
                      )}
                    </span>
                  </p>
                </div>
              )}

              {errors.password && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm flex items-center gap-1"
                >
                  <FaTimes className="text-xs" />
                  {errors.password}
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block font-semibold text-amber-300">
                Confirm Password *
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400/50" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 backdrop-blur-md bg-white/10 border rounded-xl text-blue-100 placeholder-blue-100/40 focus:border-amber-400/50 focus:bg-white/15 transition-all ${
                    errors.confirmPassword
                      ? "border-red-500/50"
                      : "border-white/20"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400/50 hover:text-amber-400"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

                {formData.confirmPassword && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    {formData.password === formData.confirmPassword ? (
                      <FaCheck className="text-green-400 text-sm" />
                    ) : (
                      <FaTimes className="text-red-400 text-sm" />
                    )}
                  </div>
                )}
              </div>
              {errors.confirmPassword && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm flex items-center gap-1"
                >
                  <FaTimes className="text-xs" />
                  {errors.confirmPassword}
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="group relative w-full px-8 py-4 overflow-hidden rounded-full shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <span className="relative z-10 text-indigo-900 font-bold text-lg flex items-center justify-center">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-indigo-900/30 border-t-indigo-900 rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  "Join Krishnova"
                )}
              </span>
            </motion.button>

            {/* Sign In Link */}
            <motion.p
              className="text-center text-blue-100/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Already a devotee?{" "}
              <Link
                to="/login"
                className="text-amber-300 hover:text-amber-200 font-semibold transition-colors hover:underline"
              >
                Sign In
              </Link>
            </motion.p>

            {/* Sacred Quote */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-amber-200/60 text-sm italic">
                "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज"
              </p>
              <p className="text-blue-100/50 text-xs mt-1">
                Surrender unto Me - Bhagavad Gita 18.66
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
