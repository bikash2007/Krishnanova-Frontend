import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiLotusFlower } from "react-icons/gi";
import { FaCrown, FaStar, FaPray, FaDove } from "react-icons/fa";
import { IoLeaf, IoSparkles } from "react-icons/io5";
import {
  IoStop,
  IoTrophy,
  IoHeart,
  IoVolumeHigh,
  IoVolumeMute,
} from "react-icons/io5";
import confetti from "canvas-confetti";
import useLockBodyScroll from "../../../../utils/useLockBodyScroll";

const MeditationSession = ({ config, onComplete, onStop }) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [milestonesReached, setMilestonesReached] = useState([]);
  const [showMilestone, setShowMilestone] = useState(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const bellSoundRef = useRef(null);
  const startTimeRef = useRef(null);

  useLockBodyScroll(showCompletionModal);

  useEffect(() => {
    if (isActive) {
      if (!startTimeRef.current)
        startTimeRef.current = Date.now() - time * 1000;
      timerRef.current = setInterval(() => {
        setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else {
      if (startTimeRef.current) startTimeRef.current = null;
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  useEffect(() => {
    const minutes = Math.floor(time / 60);
    [5, 10, 20, 30].forEach((m) => {
      if (minutes === m && !milestonesReached.includes(m)) {
        setMilestonesReached([...milestonesReached, m]);
        setShowMilestone(m);
        setTimeout(() => setShowMilestone(null), 4000);
        if (!bellSoundRef.current)
          bellSoundRef.current = new Audio("/test/audio/bell.mp3");
        bellSoundRef.current.volume = 0.4;
        bellSoundRef.current.play().catch(() => {});
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#FFB700", "#FF6B35", "#6B46C1"],
        });
      }
    });
  }, [time, milestonesReached]);

  useEffect(() => {
    if (config.selectedMusic && audioRef.current) {
      audioRef.current.src = config.selectedMusic;
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => {});
    }
    return () => audioRef.current?.pause();
  }, [config.selectedMusic]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(
    () => () => {
      document.body.style.overflow = "auto";
    },
    [],
  );

  const formatTime = (s) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleStop = () => {
    setIsActive(false);
    audioRef.current?.pause();
    document.body.style.overflow = "hidden";
    setShowCompletionModal(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFB700", "#FF6B35", "#6B46C1"],
    });
    onComplete?.({ duration: time, config });
  };

  const messages = [
    "Your dedication to inner peace is inspiring!",
    "Krishna is pleased with your devotion!",
    "The divine light within you grows brighter!",
    "Peace and clarity are your companions now!",
    "You are cultivating the garden of your soul!",
    "Your spiritual journey is beautiful!",
  ];

  // Select random message once when modal opens
  const completionMessage = useMemo(() => {
    return messages[Math.floor(Math.random() * messages.length)];
  }, [showCompletionModal]);

  const getAchievementLevel = (s) => {
    const m = Math.floor(s / 60);
    if (m >= 30)
      return {
        level: "Master",
        color: "from-purple-400 to-indigo-500",
        icon: <FaCrown />,
      };
    if (m >= 20)
      return {
        level: "Advanced",
        color: "from-blue-400 to-cyan-500",
        icon: <FaStar />,
      };
    if (m >= 10)
      return {
        level: "Seeker",
        color: "from-green-400 to-emerald-500",
        icon: <IoLeaf />,
      };
    if (m >= 5)
      return {
        level: "Beginner",
        color: "from-amber-400 to-orange-500",
        icon: <IoLeaf />,
      };
    return {
      level: "Novice",
      color: "from-pink-400 to-rose-500",
      icon: <IoSparkles />,
    };
  };

  const imageUrl = config.customImage
    ? URL.createObjectURL(config.customImage)
    : config.selectedImage;

  return (
    <div className="h-screen relative overflow-hidden">
      <audio ref={audioRef} />

      {/* Fullscreen Background Image */}
      {config.eyesOpen && imageUrl ? (
        <div className="absolute inset-0">
          <img
            src={imageUrl}
            alt="Meditation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
          {/* Animated orbs for eyes-closed mode */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/20 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/20 blur-3xl"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Bar - Timer & Volume */}
        <div className="flex-shrink-0 px-4 pt-4 flex items-center justify-between">
          <div className="backdrop-blur-md bg-white/10 rounded-full px-4 py-2 border border-white/20">
            <span className="text-2xl font-mono font-bold text-white">
              {formatTime(time)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setVolume(volume > 0 ? 0 : 0.6)}
              className="p-3 rounded-full backdrop-blur-md bg-white/10 border border-white/20"
              whileTap={{ scale: 0.9 }}
            >
              {volume > 0 ? (
                <IoVolumeHigh className="text-xl text-white" />
              ) : (
                <IoVolumeMute className="text-xl text-white/50" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Center - Breathing Circle */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-500/30 backdrop-blur-sm border-4 border-cyan-400/50 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
              <GiLotusFlower className="text-6xl md:text-7xl text-cyan-300" />
            </div>
            {/* Outer ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/40"
              style={{ margin: "-12px" }}
            />
          </motion.div>

          {/* Breathing Text */}
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="mt-8 text-xl text-cyan-200 font-medium"
          >
            Breathe in... Breathe out...
          </motion.p>

          {/* Minutes Counter */}
          <div className="mt-6 text-center">
            <p className="text-4xl md:text-5xl font-bold text-white">
              {Math.floor(time / 60)}
            </p>
            <p className="text-sm text-white/60 uppercase tracking-wider">
              minutes
            </p>
          </div>
        </div>

        {/* Bottom - End Button */}
        <div className="flex-shrink-0 px-6 pb-8">
          <motion.button
            onClick={handleStop}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-red-500/30 flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <IoStop className="text-xl" /> End Meditation
          </motion.button>
        </div>
      </div>

      {/* Milestone Notification */}
      <AnimatePresence>
        {showMilestone && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-20 left-4 right-4 z-50"
          >
            <div className="backdrop-blur-md bg-gradient-to-r from-amber-400/30 to-orange-500/30 rounded-2xl p-4 border-2 border-amber-400 text-center">
              <IoTrophy className="text-3xl text-amber-300 mx-auto mb-1" />
              <p className="text-lg font-bold text-amber-200">
                {showMilestone} Minutes!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-6 overflow-hidden overscroll-contain"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="backdrop-blur-md bg-gradient-to-br from-white/20 to-white/10 rounded-3xl p-6 border border-white/30 shadow-2xl w-full max-w-sm text-center"
            >
              {/* Achievement Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mb-4"
              >
                <div
                  className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${getAchievementLevel(time).color} flex items-center justify-center shadow-2xl`}
                >
                  <span className="text-4xl">
                    {getAchievementLevel(time).icon}
                  </span>
                </div>
              </motion.div>

              <h2 className="text-2xl font-bold text-amber-200 mb-1">
                Session Complete!
              </h2>
              <p className="text-blue-100/70 text-sm mb-4">
                {getAchievementLevel(time).level} Level
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-2xl font-bold text-white">
                    {formatTime(time)}
                  </p>
                  <p className="text-xs text-blue-100/60">Duration</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-2xl font-bold text-white">
                    {Math.floor(time / 60)}
                  </p>
                  <p className="text-xs text-blue-100/60">Minutes</p>
                </div>
              </div>

              {/* Message */}
              <div className="bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-xl p-4 mb-5 border border-amber-400/30">
                <IoHeart className="text-2xl text-rose-400 mx-auto mb-2" />
                <p className="text-sm text-amber-100">{completionMessage}</p>
              </div>

              {/* Close Button */}
              <motion.button
                onClick={() => {
                  document.body.style.overflow = "auto";
                  setShowCompletionModal(false);
                  onStop?.();
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl font-bold text-lg shadow-lg"
                whileTap={{ scale: 0.98 }}
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
