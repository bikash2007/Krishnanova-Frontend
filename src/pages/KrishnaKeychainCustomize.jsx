import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  lazy,
  Suspense,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import GoogleAuth from "../components/GoogleAuth";
import {
  FaOm,
  FaCrown,
  FaStar,
  FaFire,
  FaMusic,
  FaScroll,
  FaPray,
  FaTheaterMasks,
  FaFilm,
  FaEye,
  FaEyeSlash,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { GiPrayerBeads, GiLotus, GiCandleLight } from "react-icons/gi";
import { IoSparkles, IoDiamond, IoWater, IoEarOutline } from "react-icons/io5";

// Audio imports
import bellsound from "../Audio/bell.mp3";
import omChant from "../Audio/om-chant.mp3";
import sacredfire from "../Audio/sacred-fire.mp3";
import celebration from "../Audio/celebration.mp3";
import bgm from "../Audio/bgm.mp3";
import water from "../Audio/water.mp3";
import steptransition from "../Audio/step-transition.mp3";
// import vedicFire from "../Media/VedicFire.mp4";

// Krishna Names Data
const krishnaNames = [
  {
    name: "Govinda",
    meaning: "Protector of Cows, Earth's Guardian",
    sanskrit: "गोविन्द",
    pronunciation: "Go-vin-da",
    story: "The divine cowherd who protects all beings",
    energy: "protection",
  },
  {
    name: "Ladoo Gopal",
    meaning: "Sweet Child of Krishna, Beloved by All",
    sanskrit: "लड्डू गोपाल",
    pronunciation: "La-doo Go-pal",
    story: "The playful child who steals hearts",
    energy: "joy",
  },
  {
    name: "Radha Ramana",
    meaning: "Beloved of Radha, Divine Love",
    sanskrit: "राधा रमण",
    pronunciation: "Ra-dha Ra-ma-na",
    story: "The eternal lover, embodiment of pure devotion",
    energy: "love",
  },
  {
    name: "Kanaiya",
    meaning: "The Mischievous One, Playful Spirit",
    sanskrit: "कन्हैया",
    pronunciation: "Kan-hai-ya",
    story: "The beloved trickster of Vrindavan",
    energy: "playfulness",
  },
  {
    name: "Kanha",
    meaning: "Dark-complexioned, Beautiful One",
    sanskrit: "कान्हा",
    pronunciation: "Kan-ha",
    story: "The dark beauty who enchants all",
    energy: "beauty",
  },
  {
    name: "Hari",
    meaning: "Remover of Sorrows, Divine Healer",
    sanskrit: "हरि",
    pronunciation: "Ha-ri",
    story: "The one who takes away all pain",
    energy: "healing",
  },
  {
    name: "Banke Bihari",
    meaning: "Bent in Three Places, Charming Form",
    sanskrit: "बांके बिहारी",
    pronunciation: "Ban-ke Bi-ha-ri",
    story: "The enchanting one with the curved flute",
    energy: "charm",
  },
  {
    name: "Shyam",
    meaning: "Dark Beauty, Enchanting Presence",
    sanskrit: "श्याम",
    pronunciation: "Shyam",
    story: "The dark lord who captivates souls",
    energy: "mystique",
  },
  {
    name: "Keshav",
    meaning: "Long-haired One, Slayer of Keshi",
    sanskrit: "केशव",
    pronunciation: "Ke-shav",
    story: "The victorious protector",
    energy: "victory",
  },
  {
    name: "Madhusudan",
    meaning: "Destroyer of Madhu Demon",
    sanskrit: "मधुसूदन",
    pronunciation: "Ma-dhu-su-dan",
    story: "The destroyer of evil forces",
    energy: "strength",
  },
  {
    name: "Vasudeva",
    meaning: "Son of Vasudeva, Divine Child",
    sanskrit: "वासुदेव",
    pronunciation: "Va-su-de-va",
    story: "The divine child born to save the world",
    energy: "divinity",
  },
  {
    name: "Jagannath",
    meaning: "Lord of the Universe, Universal Master",
    sanskrit: "जगन्नाथ",
    pronunciation: "Ja-gan-nath",
    story: "The lord of all creation",
    energy: "cosmic",
  },
];

// Audio files mapping
const AUDIO_FILES = {
  backgroundChant: bgm,
  bellSound: bellsound,
  om: omChant,
  waterSound: water,
  fireSound: sacredfire,
  celebration: celebration,
  stepTransition: steptransition,
};

// Mantras data
const MANTRAS = {
  preparation: {
    sanskrit: "ॐ गणेशाय नमः",
    english: "Om, Salutations to Lord Ganesha",
    meaning: "Invoking the remover of obstacles",
  },
  invocation: {
    sanskrit: "ॐ सर्वमङ्गल मांगल्ये शिवे सर्वार्थसाधिके",
    english:
      "Om, Auspiciousness of all that is auspicious, the benevolent, fulfiller of all desires",
    meaning: "Calling upon divine blessings",
  },
  purification: {
    sanskrit: "ॐ अपवित्रः पवित्रो वा सर्वावस्थां गतोऽपि वा",
    english: "Pure or impure, whatever state one is in",
    meaning: "Divine purification mantra",
  },
  nameSelection: {
    sanskrit: "ॐ नाम रूपं च जगती",
    english: "Om, Form and name manifest in the world",
    meaning: "The power of sacred naming",
  },
  whisperName: {
    sanskrit: "ॐ तत् सत् नाम धारण",
    english: "Om, That is true, holding the name",
    meaning: "Binding the sacred name",
  },
  blessing: {
    sanskrit: "ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः",
    english: "Om, May all be happy, may all be free from illness",
    meaning: "Universal blessing mantra",
  },
};

// Optimized Particle System Component
const ParticleSystem = ({ type = "divine", intensity = 20 }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: Math.min(intensity, 20) }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10,
      })),
    [intensity],
  );

  const getParticleSymbol = () => {
    const symbols = {
      divine: [<IoSparkles />, <FaStar />],
      fire: [<FaFire />, <IoSparkles />],
      water: [<IoWater />, <IoDiamond />],
      celebration: [<IoSparkles />, <FaStar />, <GiLotus />],
    };
    const typeSymbols = symbols[type] || symbols.divine;
    return typeSymbols[Math.floor(Math.random() * typeSymbols.length)];
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-lg opacity-70"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            willChange: "transform",
          }}
          animate={{
            y: [-20, -100],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          {getParticleSymbol()}
        </motion.div>
      ))}
    </div>
  );
};

// Enhanced Background Component with better video visibility
const CinematicBackground = ({ step, showVideo }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (showVideo) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [showVideo]);

  return (
    <div className="fixed inset-0 z-0">
      {/* Base gradient - warmer tones */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-950 via-red-950 to-amber-950" />

      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            {/* <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src={vedicFire}
              loop
              muted
              playsInline
              preload="metadata"
            /> */}
            {/* Subtle overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fire glow effect */}
      {showVideo && (
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-orange-600/20 via-red-600/10 to-transparent blur-3xl" />
        </div>
      )}

      <ParticleSystem
        type={step === "ceremony" ? "fire" : "divine"}
        intensity={showVideo ? 25 : 15}
      />

      {/* Ambient light sources */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-red-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  );
};

// Loading Component
const SacredLoader = ({ text = "Loading sacred elements..." }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center space-y-4"
  >
    <div className="relative w-16 h-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-full h-full border-4 border-orange-300 border-t-orange-600 rounded-full"
      />
      <div className="absolute inset-0 flex items-center justify-center text-2xl">
        <FaOm />
      </div>
    </div>
    <p className="text-orange-200 font-medium">{text}</p>
  </motion.div>
);

// Enhanced Audio Hook with ambient sounds
const useAudioManager = () => {
  const audioRefs = useRef({});
  const backgroundAudioRef = useRef(null);
  const ambientAudioRef = useRef(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [currentAmbient, setCurrentAmbient] = useState(null);

  useEffect(() => {
    // Preload all audio files
    Object.entries(AUDIO_FILES).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = "auto";
      audioRefs.current[key] = audio;
    });

    // Setup background chant
    if (audioRefs.current.backgroundChant) {
      audioRefs.current.backgroundChant.loop = true;
      audioRefs.current.backgroundChant.volume = 0.15;
      backgroundAudioRef.current = audioRefs.current.backgroundChant;
    }

    // Setup ambient sounds
    if (audioRefs.current.fireSound) {
      audioRefs.current.fireSound.loop = true;
      audioRefs.current.fireSound.volume = 0.3;
    }
    if (audioRefs.current.waterSound) {
      audioRefs.current.waterSound.loop = true;
      audioRefs.current.waterSound.volume = 0.3;
    }

    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = "";
        }
      });
    };
  }, []);

  const playSound = useCallback(
    (soundKey, options = {}) => {
      if (!isSoundEnabled) return;

      const sound = audioRefs.current[soundKey];
      if (sound) {
        sound.currentTime = 0;
        sound.volume = options.volume || 0.5;
        sound.play().catch(console.error);
      }
    },
    [isSoundEnabled],
  );

  const playAmbientSound = useCallback(
    (soundKey) => {
      if (!isSoundEnabled) return;

      // Stop current ambient sound
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
        ambientAudioRef.current.currentTime = 0;
      }

      // Play new ambient sound
      const sound = audioRefs.current[soundKey];
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(console.error);
        ambientAudioRef.current = sound;
        setCurrentAmbient(soundKey);
      }
    },
    [isSoundEnabled],
  );

  const stopAmbientSound = useCallback(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
      ambientAudioRef.current.currentTime = 0;
      ambientAudioRef.current = null;
      setCurrentAmbient(null);
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    ambientAudioRef.current = null;
    setCurrentAmbient(null);
  }, []);

  return {
    playSound,
    playAmbientSound,
    stopAmbientSound,
    stopAllSounds,
    isSoundEnabled,
    setIsSoundEnabled,
    backgroundAudioRef,
    currentAmbient,
  };
};

// Main Component
export default function KrishnaKeychainCustomize() {
  const navigate = useNavigate();
  const { user, setUser, setAuthContext, clearAuthContext } = useAuth();

  // State management
  const [currentStep, setCurrentStep] = useState(user ? "welcome" : "auth");
  const [ceremonyStep, setCeremonyStep] = useState(0);
  const [selectedName, setSelectedName] = useState("");
  const [customName, setCustomName] = useState("");
  const [finalKrishnaName, setFinalKrishnaName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showNameMeaning, setShowNameMeaning] = useState(null);
  const [showMantra, setShowMantra] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authData, setAuthData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Audio management
  const {
    playSound,
    playAmbientSound,
    stopAmbientSound,
    stopAllSounds,
    isSoundEnabled,
    setIsSoundEnabled,
    backgroundAudioRef,
    currentAmbient,
  } = useAudioManager();

  // Ceremony steps
  const ceremonySteps = useMemo(
    () => [
      "preparation",
      "invocation",
      "purification",
      "videoBlessing",
      "nameSelection",
      "whisperName",
      "blessing",
      "celebration",
    ],
    [],
  );

  // Enhanced ceremony step effect with ambient sounds
  useEffect(() => {
    if (currentStep === "ceremony") {
      const currentStepName = ceremonySteps[ceremonyStep];

      // Play ambient sounds based on step
      switch (currentStepName) {
        case "invocation":
        case "videoBlessing":
          playAmbientSound("fireSound");
          break;
        case "purification":
          playAmbientSound("waterSound");
          break;
        default:
          stopAmbientSound();
          break;
      }
    } else {
      stopAmbientSound();
    }
  }, [
    ceremonyStep,
    currentStep,
    ceremonySteps,
    playAmbientSound,
    stopAmbientSound,
  ]);

  // Text-to-speech
  const speakMantra = useCallback(
    (text, lang = "hi-IN") => {
      if (!isSoundEnabled || !window.speechSynthesis) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.7;
      utterance.pitch = 1.1;
      utterance.volume = 0.7;

      window.speechSynthesis.speak(utterance);
    },
    [isSoundEnabled],
  );

  // Auth context effect
  useEffect(() => {
    setAuthContext("krishna-customize");
    return () => clearAuthContext();
  }, [setAuthContext, clearAuthContext]);

  // User check effect
  useEffect(() => {
    if (user && currentStep === "auth") {
      setCurrentStep("welcome");
    }
  }, [user, currentStep]);

  // Authentication handlers
  const handleGoogleLoginSuccess = useCallback(
    (result) => {
      playSound("bellSound");
      setCurrentStep("welcome");
    },
    [playSound],
  );

  const handleGoogleLoginError = useCallback((error) => {
    setErrors({ general: error || "Google login failed" });
  }, []);

  const handleAuthChange = useCallback((e) => {
    const { name, value } = e.target;
    setAuthData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const validateAuth = useCallback(() => {
    const newErrors = {};
    if (authMode === "signup") {
      if (!authData.name.trim()) newErrors.name = "Name is required";
      if (!authData.username.trim())
        newErrors.username = "Username is required";
      if (!authData.confirmPassword)
        newErrors.confirmPassword = "Confirm password is required";
      if (authData.password !== authData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    if (!authData.email) newErrors.email = "Email is required";
    if (!authData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [authMode, authData]);

  const handleAuthSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateAuth()) return;

      setLoading(true);
      try {
        const endpoint = authMode === "login" ? "/auth/login" : "/auth/signup";
        let payload;

        if (authMode === "login") {
          payload = { identifier: authData.email, password: authData.password };
        } else {
          const formData = new FormData();
          Object.keys(authData).forEach((key) => {
            if (authData[key]) formData.append(key, authData[key]);
          });
          payload = formData;
        }

        const response = await axios.post(
          import.meta.env.VITE_API_URL + "/api" + endpoint,
          payload,
          authMode === "signup"
            ? { headers: { "Content-Type": "multipart/form-data" } }
            : {},
        );

        const { token, ...userData } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        if (userData.avatar)
          localStorage.setItem("userAvatar", userData.avatar);

        setUser(userData);
        playSound("bellSound");
        setCurrentStep("welcome");
      } catch (error) {
        setErrors({
          general: error.response?.data?.message || `${authMode} failed`,
        });
      } finally {
        setLoading(false);
      }
    },
    [authMode, authData, validateAuth, setUser, playSound],
  );

  // Ceremony control functions
  const startCeremony = useCallback(() => {
    setCurrentStep("ceremony");
    setCeremonyStep(0);
    setShowVideo(true);

    if (backgroundAudioRef.current && isSoundEnabled) {
      backgroundAudioRef.current.play().catch(console.error);
    }
    playSound("bellSound");
  }, [playSound, isSoundEnabled, backgroundAudioRef]);

  const nextCeremonyStep = useCallback(() => {
    if (ceremonyStep < ceremonySteps.length - 1) {
      playSound("stepTransition", { volume: 0.3 });
      setCeremonyStep((prev) => prev + 1);
    }
  }, [ceremonyStep, ceremonySteps.length, playSound]);

  const prevCeremonyStep = useCallback(() => {
    if (ceremonyStep > 0) {
      playSound("stepTransition", { volume: 0.3 });
      setCeremonyStep((prev) => prev - 1);
    } else {
      setCurrentStep("welcome");
      setShowVideo(false);
      stopAllSounds();
    }
  }, [ceremonyStep, playSound, stopAllSounds]);

  const handleNameSelection = useCallback(
    (name) => {
      setSelectedName(name);
      setCustomName("");
      setShowNameMeaning(name);
      playSound("bellSound", { volume: 0.4 });
      setTimeout(() => setShowNameMeaning(null), 3000);
    },
    [playSound],
  );

  const handleCustomNameChange = useCallback((e) => {
    setCustomName(e.target.value);
    setSelectedName("");
  }, []);

  const confirmName = useCallback(() => {
    const name = customName.trim() || selectedName;
    if (name) {
      setFinalKrishnaName(name);
      playSound("bellSound");
      nextCeremonyStep();
    }
  }, [customName, selectedName, playSound, nextCeremonyStep]);

  const playMantra = useCallback(
    (step) => {
      const mantra = MANTRAS[step];
      if (mantra) {
        setShowMantra(step);
        playSound("om", { volume: 0.4 });
        speakMantra(mantra.sanskrit);
        // Increased duration to 10 seconds
        setTimeout(() => setShowMantra(false), 10000);
      }
    },
    [playSound, speakMantra],
  );

  const completeNamakaran = useCallback(async () => {
    if (!finalKrishnaName) return;

    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrors({ general: "Please login to complete the ceremony" });
        setLoading(false);
        return;
      }

      // Save the Krishna name to user's keychain
      await axios.post(
        import.meta.env.VITE_API_URL + "/api/auth/user/save-keychain-name",
        { krishnaName: finalKrishnaName },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Also update the wisdom portal Krishna name
      try {
        await axios.post(
          import.meta.env.VITE_API_URL + "/api/krishna/wisdom-portal/names",
          {
            krishnaName: finalKrishnaName,
            spiritualName: user?.name || "Devotee",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } catch (portalError) {
        // Ignore wisdom portal update errors - keychain name is saved
        console.log("Wisdom portal name update optional:", portalError.message);
      }

      playSound("celebration");

      // Update local user state if needed
      if (user) {
        const updatedUser = {
          ...user,
          krishnaKeychain: { name: finalKrishnaName, createdAt: new Date() },
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }

      clearAuthContext();
      stopAllSounds();

      // Navigate to wisdom portal after celebration
      setTimeout(() => {
        navigate("/wishdomportal", {
          state: {
            product: "Krishna Keychain",
            customization: { name: finalKrishnaName },
            ceremonyCompleted: true,
          },
        });
      }, 2000);
    } catch (error) {
      console.error("Ceremony completion error:", error);
      setErrors({
        general:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to complete ceremony. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [
    finalKrishnaName,
    playSound,
    clearAuthContext,
    navigate,
    stopAllSounds,
    user,
    setUser,
  ]);

  // Ceremony step renderer with enhanced audio
  const renderCeremonyStep = () => {
    const currentStepName = ceremonySteps[ceremonyStep];

    const stepVariants = {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -30 },
    };

    switch (currentStepName) {
      case "preparation":
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl mb-6 filter drop-shadow-[0_0_30px_rgba(251,146,60,0.5)]"
            >
              <FaOm />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-200 drop-shadow-lg">
              Sacred Preparation
            </h2>

            <p className="text-xl text-orange-100 max-w-3xl mx-auto backdrop-blur-sm bg-black/30 p-6 rounded-2xl border border-orange-900/30">
              Welcome to the sacred Namakaran ceremony for your divine Krishna
              keychain. We will perform the sacred naming ritual with pure
              intentions and divine blessings.
            </p>

            <div className="space-y-6">
              {!showMantra && (
                <motion.button
                  onClick={() => playMantra("preparation")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-10 py-4 rounded-xl font-semibold shadow-lg hover:shadow-orange-500/25 flex items-center justify-center mx-auto gap-3"
                >
                  <span className="text-2xl">
                    <FaMusic />
                  </span>
                  <span>Play Sacred Mantra</span>
                </motion.button>
              )}

              <AnimatePresence mode="wait">
                {showMantra === "preparation" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="backdrop-blur-lg bg-orange-950/50 p-8 rounded-2xl border border-orange-800/30 max-w-2xl mx-auto"
                  >
                    <motion.p
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-orange-200 font-bold text-3xl mb-3"
                    >
                      {MANTRAS.preparation.sanskrit}
                    </motion.p>
                    <p className="text-orange-300 text-xl italic mb-2">
                      {MANTRAS.preparation.english}
                    </p>
                    <p className="text-orange-400 text-lg">
                      {MANTRAS.preparation.meaning}
                    </p>
                    <motion.div className="mt-4 h-1 bg-orange-800/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 10, ease: "linear" }}
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={nextCeremonyStep}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-xl hover:shadow-orange-500/30"
            >
              Begin Sacred Ceremony →
            </motion.button>
          </motion.div>
        );

      case "invocation":
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-200 drop-shadow-lg">
              Divine Invocation
            </h2>

            <div className="relative mx-auto w-40 h-40">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full h-full bg-gradient-to-r from-orange-500/40 to-red-500/40 rounded-full blur-2xl"
              />
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center text-6xl filter drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]"
              >
                <FaFire />
              </motion.div>
            </div>

            {/* Fire sound indicator */}
            {currentAmbient === "fireSound" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 text-orange-300"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 bg-orange-400 rounded-full"
                />
                <span className="text-sm">Sacred fire burning</span>
              </motion.div>
            )}

            <p className="text-xl text-orange-100 max-w-3xl mx-auto backdrop-blur-sm bg-black/30 p-6 rounded-2xl border border-orange-900/30">
              We invoke the blessings of Lord Ganesha and seek divine grace for
              this sacred ceremony.
            </p>

            <div className="space-y-6">
              {!showMantra && (
                <motion.button
                  onClick={() => playMantra("invocation")}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-10 py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center mx-auto gap-3"
                >
                  <span className="text-2xl">
                    <FaMusic />
                  </span>
                  <span>Recite Invocation Mantra</span>
                </motion.button>
              )}

              <AnimatePresence mode="wait">
                {showMantra === "invocation" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="backdrop-blur-lg bg-red-950/50 p-8 rounded-2xl border border-red-800/30 max-w-2xl mx-auto"
                  >
                    <motion.p
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-red-200 font-bold text-3xl mb-3"
                    >
                      {MANTRAS.invocation.sanskrit}
                    </motion.p>
                    <p className="text-red-300 text-xl italic mb-2">
                      {MANTRAS.invocation.english}
                    </p>
                    <p className="text-red-400 text-lg">
                      {MANTRAS.invocation.meaning}
                    </p>
                    <motion.div className="mt-4 h-1 bg-red-800/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 10, ease: "linear" }}
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
              <motion.button
                onClick={prevCeremonyStep}
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto bg-black/40 backdrop-blur-sm text-orange-200 px-6 py-3 rounded-xl border border-orange-800/30"
              >
                ← Back
              </motion.button>
              <motion.button
                onClick={nextCeremonyStep}
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg"
              >
                Accept Blessings →
              </motion.button>
            </div>
          </motion.div>
        );

      case "purification":
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-200 drop-shadow-lg">
              Sacred Purification
            </h2>

            <div className="relative mx-auto w-48 h-32">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                  }}
                  className="absolute text-4xl filter drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: "50%",
                  }}
                >
                  <IoWater />
                </motion.div>
              ))}
            </div>

            {/* Water sound indicator */}
            {currentAmbient === "waterSound" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 text-blue-300"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 bg-blue-400 rounded-full"
                />
                <span className="text-sm">Sacred water flowing</span>
              </motion.div>
            )}

            <p className="text-xl text-blue-100 max-w-3xl mx-auto backdrop-blur-sm bg-black/30 p-6 rounded-2xl border border-blue-900/30">
              We purify our intentions and prepare our hearts to welcome the
              divine Krishna.
            </p>

            <div className="space-y-6">
              {!showMantra && (
                <motion.button
                  onClick={() => playMantra("purification")}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center mx-auto gap-3"
                >
                  <span className="text-2xl">
                    <FaMusic />
                  </span>
                  <span>Chant Purification Mantra</span>
                </motion.button>
              )}

              <AnimatePresence mode="wait">
                {showMantra === "purification" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="backdrop-blur-lg bg-blue-950/50 p-8 rounded-2xl border border-blue-800/30 max-w-2xl mx-auto"
                  >
                    <motion.p
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-blue-200 font-bold text-3xl mb-3"
                    >
                      {MANTRAS.purification.sanskrit}
                    </motion.p>
                    <p className="text-blue-300 text-xl italic mb-2">
                      {MANTRAS.purification.english}
                    </p>
                    <p className="text-blue-400 text-lg">
                      {MANTRAS.purification.meaning}
                    </p>
                    <motion.div className="mt-4 h-1 bg-blue-800/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 10, ease: "linear" }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
              <motion.button
                onClick={prevCeremonyStep}
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto bg-black/40 backdrop-blur-sm text-blue-200 px-6 py-3 rounded-xl border border-blue-800/30"
              >
                ← Back
              </motion.button>
              <motion.button
                onClick={nextCeremonyStep}
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg"
              >
                Complete Purification →
              </motion.button>
            </div>
          </motion.div>
        );

      case "videoBlessing":
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-200 drop-shadow-lg">
              Divine Transfer Ceremony
            </h2>

            <p className="text-xl text-purple-100 max-w-3xl mx-auto backdrop-blur-sm bg-black/30 p-6 rounded-2xl border border-purple-900/30">
              Witness the sacred moment as Krishna is lovingly transferred to
              you.
            </p>

            {/* Fire sound indicator for video blessing */}
            {currentAmbient === "fireSound" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 text-orange-300"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 bg-orange-400 rounded-full"
                />
                <span className="text-sm">Sacred fire witnessing</span>
              </motion.div>
            )}

            <div className="relative backdrop-blur-lg bg-purple-950/30 rounded-2xl p-8 mx-auto max-w-3xl border border-purple-800/30">
              <div className="aspect-video bg-black/40 rounded-xl flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-center"
                >
                  <div className="text-6xl mb-4 filter drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                    <GiLotus />
                  </div>
                  <div className="text-4xl my-4 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                    <FaPray />
                  </div>
                  <div className="text-6xl filter drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                    <FaCrown />
                  </div>
                  <p className="text-purple-200 text-lg mt-4">
                    Sacred Transfer in Progress...
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
              <motion.button
                onClick={prevCeremonyStep}
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto bg-black/40 backdrop-blur-sm text-purple-200 px-6 py-3 rounded-xl border border-purple-800/30"
              >
                ← Back
              </motion.button>
              <motion.button
                onClick={nextCeremonyStep}
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg"
              >
                Receive Your Krishna →
              </motion.button>
            </div>
          </motion.div>
        );

      case "nameSelection":
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4 filter drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                <FaScroll />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-200 drop-shadow-lg">
                Choose the Sacred Name
              </h2>
              <p className="text-xl text-indigo-100 max-w-3xl mx-auto backdrop-blur-sm bg-black/30 p-6 rounded-2xl border border-indigo-900/30">
                Select a divine name for your Krishna, based on ancient
                scriptures and traditions.
              </p>
            </div>

            <div className="space-y-6">
              {!showMantra && (
                <motion.button
                  onClick={() => playMantra("nameSelection")}
                  whileHover={{ scale: 1.05 }}
                  className="mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-3"
                >
                  <span className="text-2xl">
                    <FaMusic />
                  </span>
                  <span>Chant Name Selection Mantra</span>
                </motion.button>
              )}

              <AnimatePresence mode="wait">
                {showMantra === "nameSelection" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="backdrop-blur-lg bg-indigo-950/50 p-8 rounded-2xl text-center border border-indigo-800/30 max-w-2xl mx-auto"
                  >
                    <motion.p
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-indigo-200 font-bold text-3xl mb-3"
                    >
                      {MANTRAS.nameSelection.sanskrit}
                    </motion.p>
                    <p className="text-indigo-300 text-xl italic mb-2">
                      {MANTRAS.nameSelection.english}
                    </p>
                    <p className="text-indigo-400 text-lg">
                      {MANTRAS.nameSelection.meaning}
                    </p>
                    <motion.div className="mt-4 h-1 bg-indigo-800/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 10, ease: "linear" }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="backdrop-blur-lg bg-black/30 p-6 rounded-2xl border border-indigo-800/30">
              <label className="block text-xl font-bold text-indigo-200 mb-4">
                Create Your Own Sacred Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={handleCustomNameChange}
                className="w-full px-6 py-4 text-lg rounded-xl bg-black/40 backdrop-blur-sm border border-indigo-700/50 focus:border-indigo-500 focus:outline-none transition-all text-indigo-100 placeholder-indigo-300/60"
                placeholder="Enter a special name for your Krishna..."
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-indigo-800/30"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-black/40 backdrop-blur-sm text-indigo-300">
                  Or choose from sacred names
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {krishnaNames.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNameSelection(item.name)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl text-left transition-all ${
                    selectedName === item.name
                      ? "bg-indigo-600/40 border-2 border-indigo-400 shadow-lg shadow-indigo-500/20"
                      : "bg-black/30 border border-indigo-800/30 hover:bg-indigo-900/30"
                  }`}
                >
                  <div className="font-bold text-lg text-indigo-100">
                    {item.name}
                  </div>
                  <div className="text-sm text-indigo-300">{item.sanskrit}</div>
                  <div className="text-xs text-indigo-200/70 mt-1">
                    {item.meaning}
                  </div>
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {showNameMeaning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                  onClick={() => setShowNameMeaning(null)}
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    className="bg-indigo-950/90 backdrop-blur-lg rounded-2xl p-6 max-w-md border border-indigo-700/50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-5xl mb-3 text-center filter drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                      <IoSparkles />
                    </div>
                    <h3 className="text-2xl font-bold text-indigo-100 mb-2">
                      {showNameMeaning}
                    </h3>
                    <p className="text-indigo-300 mb-2">
                      {
                        krishnaNames.find(
                          (item) => item.name === showNameMeaning,
                        )?.sanskrit
                      }
                    </p>
                    <p className="text-indigo-200 mb-3">
                      {
                        krishnaNames.find(
                          (item) => item.name === showNameMeaning,
                        )?.meaning
                      }
                    </p>
                    <p className="text-indigo-400 text-sm italic">
                      {
                        krishnaNames.find(
                          (item) => item.name === showNameMeaning,
                        )?.story
                      }
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
              <motion.button
                onClick={prevCeremonyStep}
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto bg-black/40 backdrop-blur-sm text-indigo-200 px-6 py-3 rounded-xl border border-indigo-800/30"
              >
                ← Back
              </motion.button>
              {(selectedName || customName.trim()) && (
                <motion.button
                  onClick={confirmName}
                  whileHover={{ scale: 1.05 }}
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg"
                >
                  Confirm Sacred Name →
                </motion.button>
              )}
            </div>
          </motion.div>
        );

      case "whisperName":
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center space-y-8"
          >
            <div className="text-6xl mb-4 filter drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]">
              <IoEarOutline />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-200 drop-shadow-lg">
              Whispering the Sacred Name
            </h2>

            <p className="text-xl text-green-100 max-w-3xl mx-auto backdrop-blur-sm bg-black/30 p-6 rounded-2xl border border-green-900/30">
              Following ancient tradition, we now whisper the chosen name into
              the divine consciousness.
            </p>

            <div className="backdrop-blur-lg bg-green-950/40 p-10 rounded-2xl max-w-2xl mx-auto border border-green-800/30">
              <div className="text-6xl mb-4 filter drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                <FaOm />
              </div>
              <h3 className="text-3xl font-bold text-green-100 mb-2">
                {finalKrishnaName}
              </h3>
              <p className="text-green-300 italic">
                Sacred name chosen with divine love
              </p>
            </div>

            <div className="space-y-6">
              {!showMantra && (
                <motion.button
                  onClick={() => playMantra("whisperName")}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center mx-auto gap-3"
                >
                  <span className="text-2xl">
                    <FaMusic />
                  </span>
                  <span>Whisper Sacred Name</span>
                </motion.button>
              )}

              <AnimatePresence mode="wait">
                {showMantra === "whisperName" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="backdrop-blur-lg bg-green-950/50 p-8 rounded-2xl border border-green-800/30 max-w-2xl mx-auto"
                  >
                    <motion.p
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-green-200 font-bold text-2xl mb-3"
                    >
                      {finalKrishnaName}, {finalKrishnaName}, {finalKrishnaName}
                      , {finalKrishnaName}
                    </motion.p>
                    <p className="text-green-300 text-xl italic mb-2">
                      {MANTRAS.whisperName.english}
                    </p>
                    <p className="text-green-400 text-lg">
                      {MANTRAS.whisperName.meaning}
                    </p>
                    <motion.div className="mt-4 h-1 bg-green-800/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 10, ease: "linear" }}
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
              <motion.button
                onClick={prevCeremonyStep}
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto bg-black/40 backdrop-blur-sm text-green-200 px-6 py-3 rounded-xl border border-green-800/30"
              >
                ← Back
              </motion.button>
              <motion.button
                onClick={nextCeremonyStep}
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg"
              >
                Complete Whispering →
              </motion.button>
            </div>
          </motion.div>
        );

      case "blessing":
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center space-y-8"
          >
            <div className="text-6xl mb-4 filter drop-shadow-[0_0_20px_rgba(251,146,60,0.5)]">
              <FaPray />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-200 drop-shadow-lg">
              Divine Blessings
            </h2>

            <p className="text-xl text-amber-100 max-w-3xl mx-auto backdrop-blur-sm bg-black/30 p-6 rounded-2xl border border-amber-900/30">
              Receive the final blessings for your newly named Krishna.
            </p>

            <div className="relative mx-auto w-64 h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-3xl filter drop-shadow-[0_0_15px_rgba(251,146,60,0.6)]"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `rotate(${
                        i * 45
                      }deg) translateX(100px) translateY(-15px)`,
                    }}
                  >
                    <IoSparkles />
                  </div>
                ))}
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2 filter drop-shadow-[0_0_30px_rgba(251,146,60,0.5)]">
                    <FaCrown />
                  </div>
                  <div className="text-2xl font-bold text-amber-100">
                    {finalKrishnaName}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {!showMantra && (
                <motion.button
                  onClick={() => playMantra("blessing")}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-10 py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center mx-auto gap-3"
                >
                  <span className="text-2xl">
                    <FaMusic />
                  </span>
                  <span>Recite Blessing Mantra</span>
                </motion.button>
              )}

              <AnimatePresence mode="wait">
                {showMantra === "blessing" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="backdrop-blur-lg bg-amber-950/50 p-8 rounded-2xl border border-amber-800/30 max-w-2xl mx-auto"
                  >
                    <motion.p
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-amber-200 font-bold text-3xl mb-3"
                    >
                      {MANTRAS.blessing.sanskrit}
                    </motion.p>
                    <p className="text-amber-300 text-xl italic mb-2">
                      {MANTRAS.blessing.english}
                    </p>
                    <p className="text-amber-400 text-lg">
                      {MANTRAS.blessing.meaning}
                    </p>
                    <motion.div className="mt-4 h-1 bg-amber-800/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 10, ease: "linear" }}
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
              <motion.button
                onClick={prevCeremonyStep}
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto bg-black/40 backdrop-blur-sm text-amber-200 px-6 py-3 rounded-xl border border-amber-800/30"
              >
                ← Back
              </motion.button>
              <motion.button
                onClick={nextCeremonyStep}
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg"
              >
                Accept Blessings →
              </motion.button>
            </div>
          </motion.div>
        );

      case "celebration":
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-center space-y-8"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl mb-4 filter drop-shadow-[0_0_30px_rgba(236,72,153,0.5)]"
            >
              <IoSparkles />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-200 drop-shadow-lg">
              Namakaran Complete!
            </h2>

            <p className="text-xl text-pink-100 max-w-3xl mx-auto backdrop-blur-sm bg-black/30 p-6 rounded-2xl border border-pink-900/30">
              The sacred Namakaran ceremony is complete! Your Krishna keychain
              has been blessed with the divine name.
            </p>

            <div className="relative mx-auto w-64 h-64">
              <ParticleSystem type="celebration" intensity={30} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="backdrop-blur-lg bg-pink-950/40 rounded-full p-12 text-center border border-pink-800/30">
                  <div className="text-6xl mb-2 filter drop-shadow-[0_0_30px_rgba(236,72,153,0.5)]">
                    <GiCandleLight />
                  </div>
                  <div className="text-3xl font-bold text-pink-100">
                    {finalKrishnaName}
                  </div>
                  <p className="text-pink-300 text-sm mt-1">
                    Your Divine Krishna
                  </p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-lg bg-purple-950/40 p-6 rounded-2xl max-w-2xl mx-auto border border-purple-800/30">
              <p className="text-purple-200 font-bold text-xl mb-1">
                "कृष्णं वन्दे जगद्गुरुम्"
              </p>
              <p className="text-purple-300 italic">
                I bow to Krishna, the teacher of the universe
              </p>
            </div>

            {/* Error display */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/50 border border-red-700/50 text-red-200 px-4 py-3 rounded-xl text-center max-w-md mx-auto backdrop-blur-sm"
              >
                <p className="font-medium">{errors.general}</p>
                <button
                  onClick={() => setErrors({})}
                  className="text-red-300 hover:text-red-100 text-sm mt-2 underline"
                >
                  Dismiss
                </button>
              </motion.div>
            )}

            <motion.button
              onClick={completeNamakaran}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              className="w-full max-w-md mx-auto block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-5 rounded-2xl font-bold text-lg sm:text-xl shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                  />
                  Completing Sacred Journey...
                </span>
              ) : (
                "Complete Sacred Journey →"
              )}
            </motion.button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <GoogleOAuthProvider
      clientId={
        import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id"
      }
    >
      <div className="min-h-screen relative overflow-hidden">
        <CinematicBackground step={currentStep} showVideo={showVideo} />

        <div className="relative z-10 container mx-auto px-4 py-8 mt-16">
          <AnimatePresence mode="wait">
            {/* Authentication Step */}
            {currentStep === "auth" && (
              <motion.div
                key="auth"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6 }}
                className="max-w-lg mx-auto"
              >
                <div className="backdrop-blur-xl bg-black/40 rounded-2xl shadow-xl border border-orange-800/30 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-600/80 to-red-600/80 backdrop-blur-sm p-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="text-5xl mb-4 filter drop-shadow-[0_0_30px_rgba(251,146,60,0.5)]"
                    >
                      <FaOm />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-orange-100 mb-2">
                      Begin Your Sacred Journey
                    </h1>
                    <p className="text-orange-200">
                      {authMode === "login"
                        ? "Welcome back, devotee"
                        : "Join our divine community"}
                    </p>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-orange-950/40 to-red-950/40 backdrop-blur-sm">
                    <div className="text-center space-y-3">
                      <div className="text-2xl filter drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]">
                        <FaTheaterMasks />
                      </div>
                      <h3 className="font-bold text-orange-200 text-lg">
                        Ancient Vedic Tradition
                      </h3>
                      <p className="text-orange-300 text-sm">
                        Experience the sacred Namakaran Sanskar - a
                        5000-year-old ceremony
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="p-6 space-y-4">
                    {errors.general && (
                      <div className="bg-red-900/40 border border-red-700/50 text-red-200 px-4 py-2 rounded-lg text-sm">
                        {errors.general}
                      </div>
                    )}

                    {authMode === "signup" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-orange-200 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={authData.name}
                            onChange={handleAuthChange}
                            className="w-full px-4 py-3 rounded-lg bg-black/40 backdrop-blur-sm border border-orange-800/50 focus:border-orange-500 focus:outline-none transition-all text-orange-100 placeholder-orange-400/60"
                            placeholder="Enter your name"
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-400">
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-orange-200 mb-1">
                            Username
                          </label>
                          <input
                            type="text"
                            name="username"
                            value={authData.username}
                            onChange={handleAuthChange}
                            className="w-full px-4 py-3 rounded-lg bg-black/40 backdrop-blur-sm border border-orange-800/50 focus:border-orange-500 focus:outline-none transition-all text-orange-100 placeholder-orange-400/60"
                            placeholder="Choose a username"
                          />
                          {errors.username && (
                            <p className="mt-1 text-sm text-red-400">
                              {errors.username}
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-orange-200 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={authData.email}
                        onChange={handleAuthChange}
                        className="w-full px-4 py-3 rounded-lg bg-black/40 backdrop-blur-sm border border-orange-800/50 focus:border-orange-500 focus:outline-none transition-all text-orange-100 placeholder-orange-400/60"
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-orange-200 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={authData.password}
                          onChange={handleAuthChange}
                          className="w-full px-4 py-3 pr-12 rounded-lg bg-black/40 backdrop-blur-sm border border-orange-800/50 focus:border-orange-500 focus:outline-none transition-all text-orange-100 placeholder-orange-400/60"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-300"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {authMode === "signup" && (
                      <div>
                        <label className="block text-sm font-medium text-orange-200 mb-1">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={authData.confirmPassword}
                          onChange={handleAuthChange}
                          className="w-full px-4 py-3 rounded-lg bg-black/40 backdrop-blur-sm border border-orange-800/50 focus:border-orange-500 focus:outline-none transition-all text-orange-100 placeholder-orange-400/60"
                          placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-bold shadow-lg disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          Processing...
                        </span>
                      ) : authMode === "login" ? (
                        "Enter Sacred Journey"
                      ) : (
                        "Begin Divine Experience"
                      )}
                    </motion.button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-orange-800/50"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-black/40 backdrop-blur-sm text-orange-300">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <GoogleAuth
                        onSuccess={handleGoogleLoginSuccess}
                        onError={handleGoogleLoginError}
                        preventRedirect={true}
                      />
                    </div>

                    <p className="text-center text-sm text-orange-300">
                      {authMode === "login"
                        ? "New to our sacred community? "
                        : "Already blessed with an account? "}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode(
                            authMode === "login" ? "signup" : "login",
                          );
                          playSound("bellSound", { volume: 0.3 });
                        }}
                        className="text-orange-200 hover:text-orange-100 font-semibold"
                      >
                        {authMode === "login" ? "Join Now" : "Sign in"}
                      </button>
                    </p>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Welcome Step */}
            {currentStep === "welcome" && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto text-center space-y-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-7xl mb-6 filter drop-shadow-[0_0_40px_rgba(251,146,60,0.5)]"
                >
                  <GiCandleLight />
                </motion.div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-200 drop-shadow-lg mb-6">
                  Welcome to the Sacred Namakaran
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-orange-100 leading-relaxed backdrop-blur-sm bg-black/30 p-4 sm:p-6 rounded-2xl border border-orange-900/30">
                  Namaste,{" "}
                  <span className="text-orange-300 font-semibold">
                    {user?.name}
                  </span>
                  ! You are about to experience the ancient Hindu tradition of
                  <strong className="text-orange-300">
                    {" "}
                    Namakaran Sanskar
                  </strong>{" "}
                  - the sacred naming ceremony for your divine Krishna keychain.
                </p>

                <div className="backdrop-blur-lg bg-orange-950/40 p-8 rounded-2xl border border-orange-800/30">
                  <h2 className="text-2xl font-bold text-orange-200 mb-4">
                    What Awaits You:
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6 text-left">
                    {[
                      { icon: <FaFire />, text: "Sacred Fire Ceremony" },
                      { icon: <IoWater />, text: "Purification Ritual" },
                      { icon: <GiPrayerBeads />, text: "Vedic Name Selection" },
                      { icon: <FaFilm />, text: "Divine Transfer Video" },
                      { icon: <IoEarOutline />, text: "Sacred Whispering" },
                      { icon: <IoSparkles />, text: "Divine Blessings" },
                    ].map((item) => (
                      <div
                        key={item.text}
                        className="flex items-center space-x-3 bg-black/30 p-3 rounded-lg border border-orange-800/30"
                      >
                        <span className="text-2xl filter drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]">
                          {item.icon}
                        </span>
                        <span className="font-medium text-orange-100">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <blockquote className="backdrop-blur-lg bg-blue-950/40 p-6 rounded-2xl border border-blue-800/30">
                  <p className="text-blue-200 font-bold text-xl italic mb-2">
                    "नामकरणं दशमे पक्षे द्वादशे वा शुभे तिथौ।"
                  </p>
                  <p className="text-blue-300">
                    - The naming ceremony should be performed on an auspicious
                    day with pure intentions
                  </p>
                </blockquote>

                <motion.button
                  onClick={startCeremony}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 sm:px-12 py-4 sm:py-6 rounded-2xl font-bold text-lg sm:text-xl shadow-xl hover:shadow-orange-500/30"
                >
                  Begin Sacred Namakaran Ceremony →
                </motion.button>
              </motion.div>
            )}

            {/* Ceremony Steps */}
            {currentStep === "ceremony" && (
              <motion.div
                key="ceremony"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-5xl mx-auto"
              >
                {/* Progress indicator */}
                <div className="mb-8">
                  <div className="flex justify-center space-x-2 mb-4">
                    {ceremonySteps.map((_, index) => (
                      <motion.div
                        key={index}
                        animate={{
                          scale: index === ceremonyStep ? 1.2 : 1,
                          backgroundColor:
                            index <= ceremonyStep ? "#ea580c" : "#78716c",
                        }}
                        className="w-3 h-3 rounded-full transition-all"
                      />
                    ))}
                  </div>
                  <p className="text-center text-orange-200 font-medium">
                    Step {ceremonyStep + 1} of {ceremonySteps.length}
                  </p>
                </div>

                {/* Main content */}
                <motion.div
                  key={ceremonyStep}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="backdrop-blur-xl bg-black/40 rounded-2xl shadow-xl border border-orange-800/30 p-4 sm:p-8 md:p-12"
                >
                  {renderCeremonyStep()}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sound controls */}
        <motion.button
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all ${
            isSoundEnabled
              ? "bg-green-600/80 hover:bg-green-700/80 border border-green-500/50"
              : "bg-red-600/80 hover:bg-red-700/80 border border-red-500/50"
          } text-white text-xl backdrop-blur-sm`}
          title={isSoundEnabled ? "Mute sounds" : "Unmute sounds"}
        >
          {isSoundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
        </motion.button>
      </div>
    </GoogleOAuthProvider>
  );
}
