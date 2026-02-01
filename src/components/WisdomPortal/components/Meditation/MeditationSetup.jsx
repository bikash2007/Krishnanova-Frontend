import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiLotusFlower, GiFlute } from "react-icons/gi";
import {
  IoEye,
  IoEyeOff,
  IoMusicalNotes,
  IoCheckmark,
  IoArrowForward,
  IoArrowBack,
  IoPlay,
  IoStop,
} from "react-icons/io5";

const MeditationSetup = ({ onStart, onBack }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    eyesOpen: true,
    musicType: "background",
    selectedMusic: "",
    selectedImage: "",
    customImage: null,
  });

  const [previewPlaying, setPreviewPlaying] = useState(null);
  const audioPreviewRef = useRef(null);

  const musicOptions = {
    background: [
      {
        id: "1",
        name: "🎵 Peaceful Flute",
        url: "/test/audio/meditation/calm-flute.mp3",
      },
      {
        id: "2",
        name: "🎸 Sitar Serenity",
        url: "/test/audio/meditation/sitar-calm.mp3",
      },
      {
        id: "3",
        name: "🍃 Nature Tabla",
        url: "/test/audio/meditation/nature-tabla.mp3",
      },
    ],
    chanting: [
      {
        id: "4",
        name: "🕉️ Om Chant",
        url: "/test/audio/meditation/om-chant.mp3",
      },
      {
        id: "5",
        name: "🙏 Hare Krishna",
        url: "/test/audio/meditation/hare-krishna.mp3",
      },
      {
        id: "6",
        name: "✨ Gayatri Mantra",
        url: "/test/audio/meditation/gayatri.mp3",
      },
    ],
  };

  const meditationImages = [
    {
      id: "1",
      emoji: "🪈",
      name: "Krishna Flute",
      url: "/test/images/meditation/krishna-flute.png",
    },
    {
      id: "2",
      emoji: "💕",
      name: "Radha Krishna",
      url: "/test/images/meditation/radha-krishna.png",
    },
    {
      id: "3",
      emoji: "🧘",
      name: "Meditation",
      url: "/test/images/meditation/krishna-meditation.png",
    },
    {
      id: "4",
      emoji: "🪷",
      name: "Sacred Lotus",
      url: "/test/images/meditation/lotus.png",
    },
    {
      id: "5",
      emoji: "🕉️",
      name: "Om Symbol",
      url: "/test/images/meditation/om-symbol.png",
    },
    {
      id: "6",
      emoji: "✡️",
      name: "Sri Yantra",
      url: "/test/images/meditation/sri-yantra.png",
    },
  ];

  const totalSteps = config.eyesOpen ? 3 : 2;

  const handleNext = () => {
    if (step === 2 && !config.selectedMusic) return;
    if (step === 3 && !config.selectedImage && !config.customImage) return;

    if (step === totalSteps) {
      if (audioPreviewRef.current) audioPreviewRef.current.pause();
      onStart(config);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (audioPreviewRef.current) audioPreviewRef.current.pause();
    setPreviewPlaying(null);
    if (step === 1) onBack();
    else setStep(step - 1);
  };

  const handlePreview = (musicUrl) => {
    if (!audioPreviewRef.current) audioPreviewRef.current = new Audio();
    if (previewPlaying === musicUrl) {
      audioPreviewRef.current.pause();
      setPreviewPlaying(null);
    } else {
      audioPreviewRef.current.pause();
      audioPreviewRef.current.src = musicUrl;
      audioPreviewRef.current.volume = 0.5;
      audioPreviewRef.current.play().catch(() => {});
      setPreviewPlaying(musicUrl);
    }
  };

  const stepTitles = ["Meditation Style", "Choose Music", "Visualization"];

  return (
    <div className="min-h-[60vh] max-h-[90vh] bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <motion.button
            onClick={handleBack}
            className="p-2 rounded-full bg-white/10 text-white"
            whileTap={{ scale: 0.9 }}
          >
            <IoArrowBack className="text-lg" />
          </motion.button>
          <h2 className="text-base font-bold text-amber-200">
            {stepTitles[step - 1]}
          </h2>
          <div className="w-9" />
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2">
          {[...Array(totalSteps)].map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${
                i < step ? "bg-amber-400" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Eyes Open/Closed */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="h-full flex flex-col justify-center px-6"
            >
              <p className="text-center text-blue-100/70 mb-6">
                How would you like to meditate?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  onClick={() => setConfig({ ...config, eyesOpen: true })}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center ${
                    config.eyesOpen
                      ? "border-amber-400 bg-gradient-to-br from-amber-400/20 to-orange-500/20"
                      : "border-white/20 bg-white/5"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <IoEye className="text-5xl text-amber-300 mb-3" />
                  <span className="text-amber-200 font-bold text-lg">
                    Eyes Open
                  </span>
                  <span className="text-blue-100/60 text-xs mt-1">
                    Visual focus
                  </span>
                  {config.eyesOpen && (
                    <IoCheckmark className="text-green-400 text-2xl mt-2" />
                  )}
                </motion.button>

                <motion.button
                  onClick={() => setConfig({ ...config, eyesOpen: false })}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center ${
                    !config.eyesOpen
                      ? "border-purple-400 bg-gradient-to-br from-purple-400/20 to-indigo-500/20"
                      : "border-white/20 bg-white/5"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <IoEyeOff className="text-5xl text-purple-300 mb-3" />
                  <span className="text-amber-200 font-bold text-lg">
                    Eyes Closed
                  </span>
                  <span className="text-blue-100/60 text-xs mt-1">
                    Inner journey
                  </span>
                  {!config.eyesOpen && (
                    <IoCheckmark className="text-green-400 text-2xl mt-2" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Music Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="h-full flex flex-col px-4 py-2"
            >
              {/* Music Type Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() =>
                    setConfig({
                      ...config,
                      musicType: "background",
                      selectedMusic: "",
                    })
                  }
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    config.musicType === "background"
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                      : "bg-white/10 text-blue-100"
                  }`}
                >
                  <GiFlute className="text-lg" /> Instrumental
                </button>
                <button
                  onClick={() =>
                    setConfig({
                      ...config,
                      musicType: "chanting",
                      selectedMusic: "",
                    })
                  }
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    config.musicType === "chanting"
                      ? "bg-gradient-to-r from-purple-400 to-indigo-500 text-white"
                      : "bg-white/10 text-blue-100"
                  }`}
                >
                  <GiLotusFlower className="text-lg" /> Chanting
                </button>
              </div>

              {/* Music Options */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {musicOptions[config.musicType].map((music) => (
                  <motion.button
                    key={music.id}
                    onClick={() =>
                      setConfig({ ...config, selectedMusic: music.url })
                    }
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                      config.selectedMusic === music.url
                        ? "border-green-400 bg-gradient-to-r from-green-400/20 to-emerald-500/20"
                        : "border-white/20 bg-white/5"
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {music.name.split(" ")[0]}
                      </span>
                      <span className="text-amber-200 font-semibold">
                        {music.name.slice(3)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {config.selectedMusic === music.url && (
                        <IoCheckmark className="text-xl text-green-400" />
                      )}
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(music.url);
                        }}
                        className={`p-2 rounded-lg ${
                          previewPlaying === music.url
                            ? "bg-red-500"
                            : "bg-purple-500/50"
                        }`}
                        whileTap={{ scale: 0.9 }}
                      >
                        {previewPlaying === music.url ? (
                          <IoStop className="text-white" />
                        ) : (
                          <IoPlay className="text-white" />
                        )}
                      </motion.button>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Image Selection */}
          {step === 3 && config.eyesOpen && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="h-full flex flex-col px-4 py-2"
            >
              <p className="text-center text-blue-100/70 mb-4">
                Choose your visualization
              </p>

              {/* Image Grid */}
              <div className="flex-1 grid grid-cols-2 gap-3 content-start overflow-y-auto pb-4">
                {meditationImages.map((img) => (
                  <motion.button
                    key={img.id}
                    onClick={() =>
                      setConfig({
                        ...config,
                        selectedImage: img.url,
                        customImage: null,
                      })
                    }
                    className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-3 transition-all ${
                      config.selectedImage === img.url
                        ? "border-green-400 shadow-lg shadow-green-400/40 ring-2 ring-green-400/50"
                        : "border-white/20"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Background Image */}
                    <img
                      src={img.url}
                      alt={img.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    {/* Fallback with emoji */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 items-center justify-center hidden">
                      <span className="text-5xl">{img.emoji}</span>
                    </div>
                    {/* Overlay with name */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                      <span className="text-xs text-white font-semibold drop-shadow-lg">
                        {img.name}
                      </span>
                    </div>
                    {/* Selected checkmark */}
                    {config.selectedImage === img.url && (
                      <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                        <IoCheckmark className="text-white text-lg" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Continue Button - Fixed at Bottom */}
      <div className="flex-shrink-0 px-4 pb-6 pt-3">
        <motion.button
          onClick={handleNext}
          disabled={
            (step === 2 && !config.selectedMusic) ||
            (step === 3 && !config.selectedImage && !config.customImage)
          }
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            (step === 2 && !config.selectedMusic) ||
            (step === 3 && !config.selectedImage)
              ? "bg-white/20 text-white/50"
              : "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-xl shadow-amber-500/30"
          }`}
          whileTap={{ scale: 0.98 }}
        >
          {step === totalSteps ? "Start Meditation" : "Continue"}
          <IoArrowForward className="text-xl" />
        </motion.button>
      </div>
    </div>
  );
};

export default MeditationSetup;
