import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiPrayerBeads } from "react-icons/gi";
import {
  IoStop,
  IoTime,
  IoTrophy,
  IoHeart,
  IoCheckmark,
} from "react-icons/io5";
import confetti from "canvas-confetti";

const ChantingSession = ({ config, onComplete, onStop }) => {
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const TARGET_COUNT = 108;
  const remaining = TARGET_COUNT - count;
  const malasCompleted = Math.floor(count / TARGET_COUNT);

  const getDeityEmoji = () => {
    const emojis = { krishna: "🦚", radha: "🌺", "radha-krishna": "💑" };
    return emojis[config.deity] || "🦚";
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  useEffect(() => {
    if (count === TARGET_COUNT && isActive) handleCompletion();
  }, [count]);

  const handleClick = () => {
    if (count < TARGET_COUNT) {
      setCount(count + 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      if (navigator.vibrate) navigator.vibrate(30);
    }
  };

  const handleCompletion = () => {
    setIsActive(false);
    setShowCompletionModal(true);
    const end = Date.now() + 2000;
    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#FFB700", "#FF6B35", "#6B46C1"],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#FFB700", "#FF6B35", "#6B46C1"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    onComplete?.({
      count,
      duration: time,
      mantra: config.mantra,
      deity: config.deity,
    });
  };

  const handleStop = () => {
    setIsActive(false);
    onComplete?.({
      count,
      duration: time,
      mantra: config.mantra,
      deity: config.deity,
      completed: false,
    });
    onStop?.();
  };

  const formatTime = (s) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-[70vh] max-h-[95vh] bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950 flex flex-col overflow-hidden">
      <audio ref={audioRef} src="/audio/click.mp3" />

      {/* Header */}
      <div className="bg-black/20 px-4 py-2.5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <IoTime className="text-amber-400" />
          <span>{formatTime(time)}</span>
        </div>
        <div className="text-2xl">{getDeityEmoji()}</div>
        <button
          onClick={handleStop}
          className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 text-sm font-medium active:bg-red-500/30 flex items-center gap-1.5"
        >
          <IoStop className="text-sm" />
          End
        </button>
      </div>

      {/* Mantra Display */}
      <div className="px-5 py-3 bg-gradient-to-r from-amber-500/5 via-orange-500/10 to-amber-500/5 border-b border-amber-400/10">
        <p className="text-sm sm:text-base text-amber-200 font-medium text-center leading-relaxed line-clamp-2">
          {config.mantra}
        </p>
      </div>

      {/* Main Chanting Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
        {/* Count Display */}
        <motion.div
          key={count}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className="text-7xl sm:text-8xl font-bold text-amber-300 mb-1"
          style={{ textShadow: "0 0 50px rgba(251,191,36,0.4)" }}
        >
          {count}
        </motion.div>

        {/* Progress Info */}
        <div className="text-center mb-5">
          <p className="text-white/40 text-xs mb-1">
            {remaining > 0 ? `${remaining} to complete mala` : "Mala complete!"}
          </p>
          {malasCompleted > 0 && (
            <p className="text-cyan-300 text-xs font-medium">
              📿 {malasCompleted} mala{malasCompleted > 1 ? "s" : ""} done
            </p>
          )}
        </div>

        {/* Giant Chant Button */}
        <motion.button
          onClick={handleClick}
          disabled={count >= TARGET_COUNT}
          className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full font-bold text-lg shadow-2xl flex flex-col items-center justify-center gap-1.5 active:scale-90 transition-transform ${
            count >= TARGET_COUNT
              ? "bg-green-500 text-white"
              : "bg-gradient-to-br from-amber-400 via-orange-500 to-amber-500 text-indigo-950"
          }`}
          whileTap={{ scale: 0.9 }}
          style={
            count < TARGET_COUNT
              ? {
                  boxShadow:
                    "0 15px 50px rgba(251,191,36,0.4), inset 0 2px 0 rgba(255,255,255,0.3)",
                }
              : {}
          }
        >
          {count >= TARGET_COUNT ? (
            <>
              <IoCheckmark className="text-4xl" />
              <span className="text-base">Complete!</span>
            </>
          ) : (
            <>
              <span className="text-4xl">🙏</span>
              <span className="text-base font-bold">Tap to Chant</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pb-5">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(count / TARGET_COUNT) * 100}%` }}
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
          />
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-white/40">
          <span>0</span>
          <span>{Math.round((count / TARGET_COUNT) * 100)}%</span>
          <span>{TARGET_COUNT}</span>
        </div>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-6 sm:p-8 border border-amber-400/30 shadow-2xl max-w-sm w-full text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring" }}
                className="mb-5"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl">
                  <IoTrophy className="text-4xl text-white" />
                </div>
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-2">
                🙏 Mala Complete!
              </h2>
              <p className="text-amber-200 text-lg mb-5">
                {TARGET_COUNT} mantras chanted
              </p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-white/10 rounded-xl p-3">
                  <GiPrayerBeads className="text-2xl text-amber-300 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">{count}</p>
                  <p className="text-xs text-white/60">Chants</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <IoTime className="text-2xl text-purple-300 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">
                    {formatTime(time)}
                  </p>
                  <p className="text-xs text-white/60">Duration</p>
                </div>
              </div>

              <div className="bg-amber-400/10 rounded-xl p-4 mb-5 border border-amber-400/20">
                <IoHeart className="text-3xl text-rose-400 mx-auto mb-2" />
                <p className="text-amber-100 text-sm">
                  Divine blessings upon you! 🌺
                </p>
              </div>

              <motion.button
                onClick={() => {
                  setShowCompletionModal(false);
                  onStop?.();
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-950 font-bold text-lg active:scale-[0.98]"
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

export default ChantingSession;
