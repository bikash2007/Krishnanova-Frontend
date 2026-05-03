import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import GoogleAuth from "../components/GoogleAuth";
import {
  FaOm,
  FaLock,
  FaShieldAlt,
  FaUser,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { GiFeather, GiFlute, GiCandleLight } from "react-icons/gi";
import { IoSparkles } from "react-icons/io5";
import gsap from "gsap";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Refs for GSAP animations
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const inputRefs = useRef([]);
  const buttonRef = useRef(null);

  // SEO Implementation
  useEffect(() => {
    document.title = "Login | Krishnova - Divine Krishna Spiritual Products";

    const metaDescription = document.querySelector('meta[name="description"]');
    const description =
      "Sign in to your Krishnova account to access exclusive spiritual products, track orders, and join our divine community.";

    if (metaDescription) {
      metaDescription.content = description;
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    return () => {
      document.title = "Krishnova - Authentic Krishna Spiritual Products";
    };
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Container entrance
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.8, rotationY: -30 },
        {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 1,
          ease: "power3.out",
        },
      );

      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.3,
          ease: "back.out(1.7)",
        },
      );

      // Form fields stagger animation
      gsap.fromTo(
        inputRefs.current,
        { opacity: 0, x: -50, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.5,
          ease: "power3.out",
        },
      );

      // Button entrance
      gsap.fromTo(
        buttonRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.8,
          ease: "power3.out",
        },
      );

      // Floating animation for decorative elements
      gsap.to(".floating-element", {
        y: -20,
        duration: 2,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
      });

      // Rotating animation for sacred symbols
      gsap.to(".rotating-element", {
        rotation: 360,
        duration: 20,
        ease: "none",
        repeat: -1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });

    // Input animation on change
    gsap.to(e.target, {
      scale: 1.02,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier)
      newErrors.identifier = "Username or Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      // Shake animation on error
      gsap.to(formRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: "power2.inOut",
      });
      return;
    }

    setLoading(true);

    // Button loading animation
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.2,
    });

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/auth/login",
        formData,
      );
      const { token, ...userData } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      if (userData.avatar) localStorage.setItem("userAvatar", userData.avatar);
      if (setUser) setUser(userData);

      // Success animation
      gsap.to(containerRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          if (userData.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        },
      });
    } catch (error) {
      setErrors({ general: error.response?.data?.message || "Login failed" });
      // Error shake
      gsap.to(formRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: "power2.inOut",
      });
    } finally {
      setLoading(false);
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.2,
      });
    }
  };

  const handleGoogleLoginSuccess = (result) => {
    // Success animation before redirect
    gsap.to(containerRef.current, {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        if (result.isAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/profile");
        }
      },
    });
  };

  const handleGoogleLoginError = (msg) => {
    setErrors({ general: msg || "Google login failed" });
  };

  return (
    <GoogleOAuthProvider
      clientId={
        import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id"
      }
    >
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Patterns */}
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

        {/* Floating Krishna Elements */}
        <div className="floating-element absolute top-20 left-10 text-6xl opacity-20 animate-spin-slow text-amber-300">
          <GiFeather />
        </div>

        <div className="floating-element absolute bottom-20 right-10 text-6xl opacity-20 animate-bounce-slow text-amber-300">
          <GiFlute />
        </div>

        <div className="floating-element absolute top-40 right-20 text-5xl opacity-15 animate-pulse text-amber-300">
          <GiCandleLight />
        </div>

        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 blur-3xl animate-pulse" />

        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 blur-3xl animate-pulse" />

        <div ref={containerRef} className="relative w-full max-w-md z-10">
          <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 mt-20 rounded-3xl shadow-2xl border border-white/20 hover:border-amber-400/50 transition-all duration-300 overflow-hidden">
            {/* Header with Sacred Badge */}
            <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 p-8 text-center relative">
              {/* Animated Pattern */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              <div
                ref={titleRef}
                className="text-5xl mb-4 relative z-10 flex justify-center text-white"
              >
                <FaOm />
              </div>

              {/* Sacred Badge */}
              <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-5 py-2.5 shadow-lg mb-4">
                <span className="text-white animate-pulse text-lg">✦</span>
                <span className="text-white font-medium tracking-wide text-sm">
                  कृष्णं वन्दे जगद्गुरुम्
                </span>
                <span className="text-white animate-pulse text-lg">✦</span>
              </div>

              <h1 className="text-3xl font-bold text-white mb-2 relative z-10">
                Welcome Back, Devotee
              </h1>
              <p className="text-white/90 relative z-10">
                Sign in to your divine journey
              </p>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="p-8 space-y-6"
            >
              {errors.general && (
                <div className="bg-red-400/20 backdrop-blur-sm border border-red-400/30 text-red-300 px-4 py-3 rounded-xl text-sm">
                  {errors.general}
                </div>
              )}

              {/* Identifier Field */}
              <div ref={(el) => (inputRefs.current[0] = el)}>
                <label className="block text-sm font-medium text-amber-200 mb-2">
                  Username or Email
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-12 rounded-xl border-2 transition-all duration-300 backdrop-blur-md bg-white/10 text-white placeholder-blue-100/50 ${
                      errors.identifier
                        ? "border-red-400/50 focus:border-red-400"
                        : "border-amber-400/30 focus:border-amber-400"
                    } focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:bg-white/15`}
                    placeholder="Enter your username or email"
                  />
                  <span className="absolute left-4 top-3.5 text-amber-300 text-xl group-focus-within:scale-110 transition-transform">
                    <FaUser />
                  </span>
                </div>
                {errors.identifier && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.identifier}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div ref={(el) => (inputRefs.current[1] = el)}>
                <label className="block text-sm font-medium text-amber-200 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pl-12 pr-12 rounded-xl border-2 transition-all duration-300 backdrop-blur-md bg-white/10 text-white placeholder-blue-100/50 ${
                      errors.password
                        ? "border-red-400/50 focus:border-red-400"
                        : "border-amber-400/30 focus:border-amber-400"
                    } focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:bg-white/15`}
                    placeholder="Enter your password"
                  />
                  <span className="absolute left-4 top-3.5 text-amber-300 text-xl group-focus-within:scale-110 transition-transform">
                    <FaLock />
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-amber-300 hover:text-amber-400 transition-colors"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-amber-400/30 bg-white/10 text-amber-400 focus:ring-amber-400/50"
                  />
                  <span className="text-sm text-blue-100/80">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-cyan-300 hover:text-cyan-400 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                ref={buttonRef}
                type="submit"
                disabled={loading}
                className="group relative w-full px-8 py-4 overflow-hidden rounded-full shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                <span className="relative text-white font-bold text-lg flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Connecting to Divine...
                    </>
                  ) : (
                    <>
                      <GiCandleLight className="mr-2 inline" />
                      Sign In to Krishna's Realm
                    </>
                  )}
                </span>
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-amber-400/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-amber-200/80">
                    Or continue with divine connection
                  </span>
                </div>
              </div>

              {/* Google Login */}
              <div className="flex justify-center">
                <GoogleAuth
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                  preventRedirect={false}
                />
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-blue-100/80">
                New to the divine journey?{" "}
                <Link
                  to="/signup"
                  className="text-amber-300 hover:text-amber-400 font-semibold transition-colors"
                >
                  Create Sacred Account
                </Link>
              </p>

              {/* Trust Badges */}
              <div className="flex justify-center space-x-4 pt-4">
                <div className="text-xs text-cyan-300/60 flex items-center space-x-1 hover:scale-110 transition-transform">
                  <FaLock />
                  <span>Secure</span>
                </div>
                <div className="text-xs text-cyan-300/60 flex items-center space-x-1 hover:scale-110 transition-transform">
                  <FaShieldAlt />
                  <span>Protected</span>
                </div>
                <div className="text-xs text-cyan-300/60 flex items-center space-x-1 hover:scale-110 transition-transform">
                  <IoSparkles />
                  <span>Blessed</span>
                </div>
              </div>
            </form>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-4 -right-4 text-4xl text-amber-400/30 rotating-element">
            ॐ
          </div>
          <div
            className="absolute -top-4 -left-4 text-4xl text-cyan-400/30 rotating-element"
            style={{ animationDelay: "2s" }}
          >
            ✦
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
