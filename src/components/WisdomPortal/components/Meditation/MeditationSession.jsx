import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiMeditation, GiLotusFlower } from "react-icons/gi";
import {
  IoStop,
  IoTime,
  IoTrophy,
  IoSparkles,
  IoHeart,
  IoVolumeHigh,
} from "react-icons/io5";
import confetti from "canvas-confetti";

const MeditationSession = ({ config, onComplete, onStop }) => {
  const [time, setTime] = useState(0); // in seconds
  const [isActive, setIsActive] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [milestonesReached, setMilestonesReached] = useState([]);
  const [showMilestone, setShowMilestone] = useState(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const bellSoundRef = useRef(null);

  useEffect(() => {
    // Start timer
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive]);

  // Milestone tracking
  useEffect(() => {
    const minutes = Math.floor(time / 60);
    const milestones = [5, 10, 20, 30];
    
    milestones.forEach((milestone) => {
      if (minutes === milestone && !milestonesReached.includes(milestone)) {
        setMilestonesReached([...milestonesReached, milestone]);
        
        // Show milestone notification
        setShowMilestone(milestone);
        setTimeout(() => setShowMilestone(null), 4000);
        
        // Play bell sound
        if (!bellSoundRef.current) {
          bellSoundRef.current = new Audio("/test/audio/bell.mp3");
        }
        bellSoundRef.current.volume = 0.4;
        bellSoundRef.current.play().catch((err) => {
          console.error("Bell sound failed:", err);
        });

        // Trigger confetti
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#FFB700", "#FF6B35", "#6B46C1", "#02C39A"],
        });
      }
    });
  }, [time, milestonesReached]);

  useEffect(() => {
    // Play music
    if (config.selectedMusic && audioRef.current) {
      audioRef.current.src = config.selectedMusic;
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.play().catch((err) => {
        console.error("Audio playback failed:", err);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [config.selectedMusic]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Cleanup: Restore scroll on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStop = () => {
    setIsActive(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    // Lock body scroll when modal opens
    document.body.style.overflow = 'hidden';
    
    setShowCompletionModal(true);

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFB700", "#FF6B35", "#6B46C1", "#02C39A"],
    });

    // Call onComplete callback
    if (onComplete) {
      onComplete({
        duration: time,
        config,
      });
    }
  };

  const motivationalMessages = [
    "Your dedication to inner peace is inspiring! 🙏",
    "You've taken another step on the path to enlightenment! ✨",
    "Krishna is pleased with your devotion! 💫",
    "Your mind is becoming clearer with each session! 🧘",
    "The divine light within you grows brighter! 🌟",
    "You are cultivating the garden of your soul! 🌸",
    "Peace and clarity are your companions now! 🕊️",
    "Your spiritual journey is beautiful! 🌺",
  ];

  const getRandomMessage = () => {
    return motivationalMessages[
      Math.floor(Math.random() * motivationalMessages.length)
    ];
  };

  const getAchievementLevel = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes >= 30) return { level: "Master", color: "from-purple-400 to-indigo-500" };
    if (minutes >= 20) return { level: "Advanced", color: "from-blue-400 to-cyan-500" };
    if (minutes >= 10) return { level: "Intermediate", color: "from-green-400 to-emerald-500" };
    if (minutes >= 5) return { level: "Beginner", color: "from-amber-400 to-orange-500" };
    return { level: "Novice", color: "from-pink-400 to-rose-500" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Background Audio */}
      <audio ref={audioRef} />

      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-purple-400/30 to-blue-500/30 blur-3xl"
        />
        
        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            className="absolute w-2 h-2 rounded-full bg-amber-300"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Image Display (if eyes open) */}
        {config.eyesOpen && (config.selectedImage || config.customImage) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255, 183, 0, 0.3)",
                    "0 0 60px rgba(255, 183, 0, 0.6)",
                    "0 0 20px rgba(255, 183, 0, 0.3)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="rounded-2xl overflow-hidden border-4 border-amber-400/50"
              >
                <img
                  src={
                    config.customImage
                      ? URL.createObjectURL(config.customImage)
                      : config.selectedImage
                  }
                  alt="Meditation focus"
                  className="w-64 h-64 md:w-96 md:h-96 object-cover"
                />
              </motion.div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
              >
                <GiLotusFlower className="text-2xl text-white" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Timer Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl mb-6"
        >
          <div className="text-center">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-6xl md:text-8xl font-bold text-amber-200 mb-4 font-mono"
            >
              {formatTime(time)}
            </motion.div>
            <div className="flex items-center justify-center gap-2 text-blue-100/80 text-lg md:text-xl">
              <IoTime className="text-2xl text-amber-300" />
              <p>Time in Meditation</p>
            </div>
          </div>
        </motion.div>

        {/* Goal Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <p className="text-xl md:text-2xl text-amber-200 font-semibold mb-2">
            We have now meditated for
          </p>
          <p className="text-3xl md:text-4xl text-white font-bold">
            {Math.floor(time / 60)} minute{Math.floor(time / 60) !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Breathing Animation Circle */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-8"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-500/30 border-4 border-cyan-400/50 flex items-center justify-center backdrop-blur-sm">
            <GiLotusFlower className="text-5xl md:text-6xl text-cyan-300" />
          </div>
        </motion.div>

        {/* Breathing Reminder */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-center mb-6 text-cyan-300 text-lg"
        >
          <p>Breathe in... Breathe out...</p>
        </motion.div>

        {/* Volume Control */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-8 max-w-xs mx-auto"
        >
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <IoVolumeHigh className="text-2xl text-amber-300 flex-shrink-0" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={(e) => setVolume(e.target.value / 100)}
                className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, rgb(251, 191, 36) 0%, rgb(251, 191, 36) ${volume * 100}%, rgba(255, 255, 255, 0.2) ${volume * 100}%, rgba(255, 255, 255, 0.2) 100%)`,
                }}
              />
              <span className="text-amber-200 font-semibold text-sm w-12 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Milestone Notification */}
        <AnimatePresence>
          {showMilestone && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              className="mb-8"
            >
              <div className="backdrop-blur-md bg-gradient-to-r from-amber-400/30 to-orange-500/30 rounded-2xl p-6 border-2 border-amber-400 shadow-2xl max-w-md mx-auto">
                <div className="text-center">
                  <IoTrophy className="text-5xl text-amber-300 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-amber-200 mb-2">
                    Milestone Reached! 🎉
                  </h3>
                  <p className="text-white text-xl font-semibold">
                    {showMilestone} Minutes of Meditation
                  </p>
                  <p className="text-blue-100/80 text-sm mt-2">
                    Keep going! You're doing amazing! 🙏
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stop Button */}
        <motion.button
          onClick={handleStop}
          className="px-8 md:px-12 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full font-bold text-lg md:text-xl shadow-2xl hover:shadow-red-500/50 transition-all flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <IoStop className="text-2xl" />
          End Meditation
        </motion.button>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                document.body.style.overflow = 'auto';
                setShowCompletionModal(false);
                if (onStop) onStop();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="backdrop-blur-md bg-gradient-to-br from-white/20 to-white/10 rounded-3xl p-8 md:p-12 border border-white/30 shadow-2xl max-w-2xl w-full text-center max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Trophy Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-block mb-6"
              >
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getAchievementLevel(time).color} flex items-center justify-center shadow-2xl`}>
                  <IoTrophy className="text-5xl text-white" />
                </div>
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold text-amber-200 mb-4">
                Meditation Complete! 🙏
              </h2>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="backdrop-blur-md bg-white/10 rounded-xl p-4">
                  <IoTime className="text-3xl text-amber-300 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {formatTime(time)}
                  </p>
                  <p className="text-sm text-blue-100/80">Time Meditated</p>
                </div>
                <div className="backdrop-blur-md bg-white/10 rounded-xl p-4">
                  <IoSparkles className="text-3xl text-purple-300 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {getAchievementLevel(time).level}
                  </p>
                  <p className="text-sm text-blue-100/80">Achievement</p>
                </div>
              </div>

              {/* Motivational Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-xl p-6 mb-6 border border-amber-400/30"
              >
                <IoHeart className="text-4xl text-rose-400 mx-auto mb-3" />
                <p className="text-lg md:text-xl text-amber-100 font-semibold">
                  {getRandomMessage()}
                </p>
              </motion.div>

              {/* Close Button */}
              <motion.button
                onClick={() => {
                  document.body.style.overflow = 'auto';
                  setShowCompletionModal(false);
                  if (onStop) onStop();
                }}
                className="px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-amber-400/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MeditationSession;
