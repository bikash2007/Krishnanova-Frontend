import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiPrayerBeads, GiLotusFlower } from "react-icons/gi";
import {
  IoStop,
  IoTime,
  IoTrophy,
  IoSparkles,
  IoHeart,
  IoEye,
  IoEyeOff,
} from "react-icons/io5";
import confetti from "canvas-confetti";

const ChantingSession = ({ config, onComplete, onStop }) => {
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [showGazePrompt, setShowGazePrompt] = useState(true);
  const [gazeTime, setGazeTime] = useState(5); // 5 seconds gaze
  const [visualizationMode, setVisualizationMode] = useState("gaze"); // gaze, eyes-closed, eyes-open
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const timerRef = useRef(null);
  const gazeTimerRef = useRef(null);
  const audioRef = useRef(null);

  const TARGET_COUNT = 108; // One mala

  useEffect(() => {
    // Start main timer
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

  useEffect(() => {
    // Gaze timer
    if (showGazePrompt && gazeTime > 0) {
      gazeTimerRef.current = setInterval(() => {
        setGazeTime((prev) => {
          if (prev <= 1) {
            setShowGazePrompt(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (gazeTimerRef.current) {
        clearInterval(gazeTimerRef.current);
      }
    };
  }, [showGazePrompt, gazeTime]);

  useEffect(() => {
    // Check if completed 108
    if (count === TARGET_COUNT && isActive) {
      handleCompletion();
    }
  }, [count]);

  const handleClick = () => {
    if (count < TARGET_COUNT) {
      setCount(count + 1);
      
      // Play click sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }

      // Haptic feedback (mobile)
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  };

  const handleCompletion = () => {
    setIsActive(false);
    setShowCompletionModal(true);

    // Massive confetti celebration
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#FFB700", "#FF6B35", "#6B46C1", "#02C39A"],
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#FFB700", "#FF6B35", "#6B46C1", "#02C39A"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Call onComplete callback
    if (onComplete) {
      onComplete({
        count: count,
        duration: time,
        mantra: config.mantra,
        deity: config.deity,
      });
    }
  };

  const handleStop = () => {
    setIsActive(false);
    if (count < TARGET_COUNT) {
      // Partial completion
      if (onComplete) {
        onComplete({
          count: count,
          duration: time,
          mantra: config.mantra,
          deity: config.deity,
          completed: false,
        });
      }
    }
    if (onStop) onStop();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getDeityImage = () => {
    const images = {
      krishna: "/images/deities/krishna.jpg",
      radha: "/images/deities/radha.jpg",
      "radha-krishna": "/images/deities/radha-krishna.jpg",
    };
    return images[config.deity] || images.krishna;
  };

  const getDeityEmoji = () => {
    const emojis = {
      krishna: "🦚",
      radha: "🌺",
      "radha-krishna": "💑",
    };
    return emojis[config.deity] || "🦚";
  };

  const progressPercentage = (count / TARGET_COUNT) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Click sound */}
      <audio ref={audioRef} src="/audio/click.mp3" />

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
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Gaze Prompt */}
        <AnimatePresence>
          {showGazePrompt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            >
              <div className="backdrop-blur-md bg-gradient-to-br from-white/20 to-white/10 rounded-3xl p-8 md:p-12 border border-white/30 shadow-2xl max-w-2xl text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl mb-6"
                >
                  {getDeityEmoji()}
                </motion.div>
                <h2 className="text-3xl font-bold text-amber-200 mb-4">
                  Gaze at the Divine Form
                </h2>
                <p className="text-xl text-blue-100/90 mb-6">
                  Focus your eyes and mind on the deity for a few moments...
                </p>
                <div className="text-6xl font-bold text-white mb-4">
                  {gazeTime}
                </div>
                <p className="text-blue-100/70">
                  Then you may close your eyes and visualize, or continue gazing
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Deity Image */}
        {!showGazePrompt && (
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
                  src={getDeityImage()}
                  alt="Deity"
                  className="w-48 h-48 md:w-64 md:h-64 object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `<div class="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center text-9xl bg-gradient-to-br from-amber-400/20 to-orange-500/20">${getDeityEmoji()}</div>`;
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Mantra Display */}
        {!showGazePrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl mb-6 max-w-2xl"
          >
            <p className="text-2xl md:text-3xl text-amber-200 font-bold text-center italic">
              "{config.mantra}"
            </p>
          </motion.div>
        )}

        {/* Counter Display */}
        {!showGazePrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="text-center mb-4">
              <motion.div
                animate={{
                  scale: count > 0 ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
                className="text-7xl md:text-9xl font-bold text-amber-200 mb-2"
              >
                {count}
              </motion.div>
              <p className="text-2xl text-blue-100/80">/ {TARGET_COUNT}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-64 md:w-96 h-4 bg-white/20 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
              />
            </div>

            <p className="text-center text-cyan-300 text-lg">
              {Math.round(progressPercentage)}% Complete
            </p>
          </motion.div>
        )}

        {/* Click Button */}
        {!showGazePrompt && (
          <motion.button
            onClick={handleClick}
            disabled={count >= TARGET_COUNT}
            className={`w-32 h-32 md:w-40 md:h-40 rounded-full font-bold text-2xl md:text-3xl shadow-2xl mb-6 ${
              count >= TARGET_COUNT
                ? "bg-green-500 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:shadow-amber-400/50"
            }`}
            whileHover={count < TARGET_COUNT ? { scale: 1.1 } : {}}
            whileTap={count < TARGET_COUNT ? { scale: 0.9 } : {}}
          >
            {count >= TARGET_COUNT ? (
              <div>
                <IoCheckmark className="text-5xl mx-auto" />
                <p className="text-sm">Complete!</p>
              </div>
            ) : (
              <div>
                <GiPrayerBeads className="text-5xl mx-auto mb-2" />
                <p className="text-lg">Chant</p>
              </div>
            )}
          </motion.button>
        )}

        {/* Timer */}
        {!showGazePrompt && (
          <div className="flex items-center gap-2 text-blue-100/80 text-lg mb-6">
            <IoTime className="text-2xl text-amber-300" />
            <p>{formatTime(time)}</p>
          </div>
        )}

        {/* Stop Button */}
        {!showGazePrompt && (
          <motion.button
            onClick={handleStop}
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full font-bold shadow-lg hover:shadow-red-500/50 transition-all flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoStop />
            End Session
          </motion.button>
        )}
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="backdrop-blur-md bg-gradient-to-br from-white/20 to-white/10 rounded-3xl p-8 md:p-12 border border-white/30 shadow-2xl max-w-2xl w-full text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-block mb-6"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl">
                  <IoTrophy className="text-5xl text-white" />
                </div>
              </motion.div>

              <h2 className="text-4xl font-bold text-amber-200 mb-4">
                🙏 One Mala Complete! 🙏
              </h2>

              <p className="text-2xl text-amber-100 mb-6">
                You have chanted {TARGET_COUNT} times!
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="backdrop-blur-md bg-white/10 rounded-xl p-4">
                  <GiPrayerBeads className="text-4xl text-amber-300 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-white">{count}</p>
                  <p className="text-sm text-blue-100/80">Mantras Chanted</p>
                </div>
                <div className="backdrop-blur-md bg-white/10 rounded-xl p-4">
                  <IoTime className="text-4xl text-purple-300 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-white">
                    {formatTime(time)}
                  </p>
                  <p className="text-sm text-blue-100/80">Time Spent</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-xl p-6 mb-6 border border-amber-400/30">
                <IoHeart className="text-5xl text-rose-400 mx-auto mb-3" />
                <p className="text-xl text-amber-100 font-semibold">
                  Your devotion is beautiful! Krishna is pleased with your
                  sincere chanting. May divine grace always be with you! 🌺
                </p>
              </div>

              <motion.button
                onClick={() => {
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

export default ChantingSession;
