import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GiMeditation,
  GiLotusFlower,
  GiPeaceDove,
  GiFlute,
} from "react-icons/gi";
import {
  IoEye,
  IoEyeOff,
  IoMusicalNotes,
  IoImage,
  IoCloudUpload,
  IoCheckmark,
  IoArrowForward,
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

  const [errors, setErrors] = useState({});
  const [previewPlaying, setPreviewPlaying] = useState(null);
  const audioPreviewRef = useRef(null);

  // Music options
  const musicOptions = {
    background: [
      {
        id: "calm-instrumental-1",
        name: "Peaceful Flute Melody",
        url: "/test/audio/meditation/calm-flute.mp3",
      },
      {
        id: "calm-instrumental-2",
        name: "Sitar Serenity",
        url: "/test/audio/meditation/sitar-calm.mp3",
      },
      {
        id: "calm-instrumental-3",
        name: "Nature Sounds with Tabla",
        url: "/test/audio/meditation/nature-tabla.mp3",
      },
    ],
    chanting: [
      {
        id: "chanting-1",
        name: "Om Meditation Chant",
        url: "/test/audio/meditation/om-chant.mp3",
      },
      {
        id: "chanting-2",
        name: "Hare Krishna Mantra",
        url: "/test/audio/meditation/hare-krishna.mp3",
      },
      {
        id: "chanting-3",
        name: "Gayatri Mantra",
        url: "/test/audio/meditation/gayatri.mp3",
      },
    ],
  };

  // Pre-designed images
  const meditationImages = [
    {
      id: "krishna-1",
      name: "Krishna with Flute",
      url: "/test/images/meditation/krishna-flute.png",
    },
    {
      id: "radha-krishna",
      name: "Radha Krishna",
      url: "/test/images/meditation/radha-krishna.png",
    },
    {
      id: "krishna-meditation",
      name: "Krishna Meditation",
      url: "/test/images/meditation/krishna-meditation.png",
    },
    {
      id: "lotus",
      name: "Sacred Lotus",
      url: "/test/images/meditation/lotus.png",
    },
    {
      id: "om",
      name: "Om Symbol",
      url: "/test/images/meditation/om-symbol.png",
    },
    {
      id: "yantra",
      name: "Sri Yantra",
      url: "/test/images/meditation/sri-yantra.png",
    },
  ];

  const validateStep = () => {
    const newErrors = {};

    if (step === 2 && !config.selectedMusic) {
      newErrors.music = "Please select a music track";
    }

    if (step === 3 && config.eyesOpen && !config.selectedImage && !config.customImage) {
      newErrors.image = "Please select or upload an image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step === 3 || (step === 2 && !config.eyesOpen)) {
        handleStart();
      } else {
        setStep(step + 1);
      }
    }
  };

  const handleStart = () => {
    if (validateStep()) {
      onStart(config);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setConfig({ ...config, customImage: file, selectedImage: "" });
      setErrors({ ...errors, image: "" });
    }
  };

  const handlePreview = (musicUrl) => {
    if (!audioPreviewRef.current) {
      audioPreviewRef.current = new Audio();
    }

    if (previewPlaying === musicUrl) {
      // Stop preview
      audioPreviewRef.current.pause();
      audioPreviewRef.current.currentTime = 0;
      setPreviewPlaying(null);
    } else {
      // Play new preview
      audioPreviewRef.current.pause();
      audioPreviewRef.current.src = musicUrl;
      audioPreviewRef.current.volume = 0.5;
      audioPreviewRef.current.play().catch((err) => {
        console.error("Audio preview failed:", err);
      });
      setPreviewPlaying(musicUrl);

      // Auto-stop after 15 seconds
      setTimeout(() => {
        if (audioPreviewRef.current && !audioPreviewRef.current.paused) {
          audioPreviewRef.current.pause();
          audioPreviewRef.current.currentTime = 0;
          setPreviewPlaying(null);
        }
      }, 15000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl">
              <GiMeditation className="text-3xl text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-200 mb-2">
            Customize Your Meditation
          </h1>
          <p className="text-blue-100/80">
            How would you like to meditate today?
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    s === step
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white scale-110"
                      : s < step
                      ? "bg-green-500 text-white"
                      : "bg-white/20 text-blue-100/50"
                  }`}
                >
                  {s < step ? <IoCheckmark /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 rounded ${
                      s < step ? "bg-green-500" : "bg-white/20"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Eyes Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-amber-200 mb-6 flex items-center gap-2">
                <IoEye className="text-3xl" />
                Choose Your Eye Position
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  onClick={() => setConfig({ ...config, eyesOpen: true })}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    config.eyesOpen
                      ? "border-amber-400 bg-gradient-to-br from-amber-400/20 to-orange-500/20"
                      : "border-white/20 bg-white/5 hover:border-amber-400/50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IoEye className="text-4xl text-amber-300 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-amber-200 mb-2">
                    Eyes Open
                  </h3>
                  <p className="text-blue-100/80 text-sm">
                    Focus on divine imagery
                  </p>
                  {config.eyesOpen && (
                    <div className="mt-3 text-green-400 flex items-center justify-center gap-1">
                      <IoCheckmark /> Selected
                    </div>
                  )}
                </motion.button>

                <motion.button
                  onClick={() => setConfig({ ...config, eyesOpen: false })}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    !config.eyesOpen
                      ? "border-amber-400 bg-gradient-to-br from-amber-400/20 to-orange-500/20"
                      : "border-white/20 bg-white/5 hover:border-amber-400/50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IoEyeOff className="text-4xl text-purple-300 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-amber-200 mb-2">
                    Eyes Closed
                  </h3>
                  <p className="text-blue-100/80 text-sm">
                    Inner visualization
                  </p>
                  {!config.eyesOpen && (
                    <div className="mt-3 text-green-400 flex items-center justify-center gap-1">
                      <IoCheckmark /> Selected
                    </div>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Music Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-amber-200 mb-6 flex items-center gap-2">
                <IoMusicalNotes className="text-3xl" />
                Select Your Music
              </h2>

              {/* Music Type Selector */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.button
                  onClick={() =>
                    setConfig({ ...config, musicType: "background", selectedMusic: "" })
                  }
                  className={`p-4 rounded-xl border-2 transition-all ${
                    config.musicType === "background"
                      ? "border-amber-400 bg-gradient-to-br from-amber-400/20 to-orange-500/20"
                      : "border-white/20 bg-white/5"
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <GiFlute className="text-3xl text-amber-300 mx-auto mb-2" />
                  <p className="text-amber-200 font-semibold">
                    Background Music
                  </p>
                  <p className="text-xs text-blue-100/60 mt-1">
                    Instrumental & Calm
                  </p>
                </motion.button>

                <motion.button
                  onClick={() =>
                    setConfig({ ...config, musicType: "chanting", selectedMusic: "" })
                  }
                  className={`p-4 rounded-xl border-2 transition-all ${
                    config.musicType === "chanting"
                      ? "border-amber-400 bg-gradient-to-br from-amber-400/20 to-orange-500/20"
                      : "border-white/20 bg-white/5"
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <GiLotusFlower className="text-3xl text-purple-300 mx-auto mb-2" />
                  <p className="text-amber-200 font-semibold">Chanting Music</p>
                  <p className="text-xs text-blue-100/60 mt-1">
                    Mantras & Devotional
                  </p>
                </motion.button>
              </div>

              {/* Music Options */}
              <div className="space-y-3">
                {musicOptions[config.musicType].map((music) => (
                  <motion.div
                    key={music.id}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      config.selectedMusic === music.url
                        ? "border-green-400 bg-gradient-to-r from-green-400/20 to-emerald-500/20"
                        : "border-white/20 bg-white/5 hover:border-amber-400/50"
                    }`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={() =>
                          setConfig({ ...config, selectedMusic: music.url })
                        }
                        className="flex items-center gap-3 flex-1 text-left"
                      >
                        <IoMusicalNotes className="text-2xl text-amber-300 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-amber-200 font-semibold">
                            {music.name}
                          </p>
                        </div>
                        {config.selectedMusic === music.url && (
                          <IoCheckmark className="text-2xl text-green-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      {/* Preview Button */}
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(music.url);
                        }}
                        className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                          previewPlaying === music.url
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-purple-500 hover:bg-purple-600"
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title={previewPlaying === music.url ? "Stop Preview" : "Play Preview"}
                      >
                        {previewPlaying === music.url ? (
                          <IoStop className="text-xl text-white" />
                        ) : (
                          <IoPlay className="text-xl text-white" />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {errors.music && (
                <p className="text-red-400 text-sm mt-2">{errors.music}</p>
              )}
            </motion.div>
          )}

          {/* Step 3: Image Selection (if eyes open) */}
          {step === 3 && config.eyesOpen && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-amber-200 mb-6 flex items-center gap-2">
                <IoImage className="text-3xl" />
                Choose Your Meditation Image
              </h2>

              {/* Image Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {meditationImages.map((image) => (
                  <motion.button
                    key={image.id}
                    onClick={() =>
                      setConfig({
                        ...config,
                        selectedImage: image.url,
                        customImage: null,
                      })
                    }
                    className={`relative aspect-square rounded-xl overflow-hidden border-4 transition-all ${
                      config.selectedImage === image.url
                        ? "border-green-400 shadow-lg shadow-green-400/50"
                        : "border-white/20 hover:border-amber-400/50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                      <p className="text-white text-xs font-semibold">
                        {image.name}
                      </p>
                    </div>
                    {config.selectedImage === image.url && (
                      <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <IoCheckmark className="text-white" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Custom Upload */}
              <div className="border-2 border-dashed border-white/30 rounded-xl p-6 text-center hover:border-amber-400/50 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer block"
                >
                  <IoCloudUpload className="text-5xl text-amber-300 mx-auto mb-3" />
                  <p className="text-amber-200 font-semibold mb-1">
                    Upload Custom Image
                  </p>
                  <p className="text-blue-100/60 text-sm">
                    {config.customImage
                      ? config.customImage.name
                      : "Upload your own image"}
                  </p>
                </label>
              </div>

              {errors.image && (
                <p className="text-red-400 text-sm mt-2">{errors.image}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <motion.button
            onClick={() => (step === 1 ? onBack() : setStep(step - 1))}
            className="px-6 py-3 bg-white/10 text-blue-100 rounded-full font-semibold hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back
          </motion.button>

          <motion.button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-bold shadow-lg hover:shadow-amber-400/50 transition-all flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {step === 3 || (step === 2 && !config.eyesOpen)
              ? "Start Meditation"
              : "Continue"}
            <IoArrowForward />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MeditationSetup;
