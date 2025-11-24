import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  GiPrayerBeads,
  GiLotusFlower,
  GiPeaceDove,
} from "react-icons/gi";
import {
  IoCheckmark,
  IoArrowForward,
  IoText,
  IoImage,
} from "react-icons/io5";
import { FaOm } from "react-icons/fa";

const MantraSetup = ({ onStart, onBack }) => {
  const [config, setConfig] = useState({
    hasPersonalMantra: false,
    mantra: "",
    deity: "krishna",
  });

  const [errors, setErrors] = useState({});

  // General mantras
  const generalMantras = [
    {
      id: "hare-krishna",
      name: "Hare Krishna Maha Mantra",
      text: "Hare Krishna Hare Krishna, Krishna Krishna Hare Hare, Hare Rama Hare Rama, Rama Rama Hare Hare",
      description: "The most powerful mantra for this age",
    },
    {
      id: "om-namah",
      name: "Om Namah Shivaya",
      text: "Om Namah Shivaya",
      description: "Sacred Shiva mantra",
    },
    {
      id: "gayatri",
      name: "Gayatri Mantra",
      text: "Om Bhur Bhuvah Svah, Tat Savitur Varenyam, Bhargo Devasya Dhimahi, Dhiyo Yo Nah Prachodayat",
      description: "Universal prayer for enlightenment",
    },
    {
      id: "om",
      name: "Om",
      text: "Om",
      description: "The primordial sound",
    },
  ];

  // Deity options
  const deities = [
    {
      id: "krishna",
      name: "Krishna",
      image: "/images/deities/krishna.jpg",
      description: "The Supreme Personality of Godhead",
    },
    {
      id: "radha",
      name: "Radha",
      image: "/images/deities/radha.jpg",
      description: "The Divine Feminine Energy",
    },
    {
      id: "radha-krishna",
      name: "Radha-Krishna",
      image: "/images/deities/radha-krishna.jpg",
      description: "The Divine Couple",
    },
  ];

  const validateConfig = () => {
    const newErrors = {};

    if (!config.hasPersonalMantra && !config.mantra) {
      newErrors.mantra = "Please select a mantra";
    }

    if (config.hasPersonalMantra && !config.mantra.trim()) {
      newErrors.mantra = "Please enter your personal mantra";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStart = () => {
    if (validateConfig()) {
      onStart(config);
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
              <GiPrayerBeads className="text-3xl text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-200 mb-2">
            Choose Your Mantra
          </h1>
          <p className="text-blue-100/80">
            Select a sacred mantra for your chanting practice
          </p>
        </div>

        {/* Mantra Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl mb-6"
        >
          <h2 className="text-2xl font-bold text-amber-200 mb-6">
            Do you have a personal mantra?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <motion.button
              onClick={() =>
                setConfig({ ...config, hasPersonalMantra: false, mantra: "" })
              }
              className={`p-6 rounded-xl border-2 transition-all ${
                !config.hasPersonalMantra
                  ? "border-amber-400 bg-gradient-to-br from-amber-400/20 to-orange-500/20"
                  : "border-white/20 bg-white/5 hover:border-amber-400/50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaOm className="text-4xl text-amber-300 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-amber-200 mb-2">
                Use General Mantra
              </h3>
              <p className="text-blue-100/80 text-sm">
                Choose from traditional mantras available to everyone
              </p>
              {!config.hasPersonalMantra && (
                <div className="mt-3 text-green-400 flex items-center justify-center gap-1">
                  <IoCheckmark /> Selected
                </div>
              )}
            </motion.button>

            <motion.button
              onClick={() => setConfig({ ...config, hasPersonalMantra: true, mantra: "" })}
              className={`p-6 rounded-xl border-2 transition-all ${
                config.hasPersonalMantra
                  ? "border-amber-400 bg-gradient-to-br from-amber-400/20 to-orange-500/20"
                  : "border-white/20 bg-white/5 hover:border-amber-400/50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IoText className="text-4xl text-purple-300 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-amber-200 mb-2">
                Personal Mantra
              </h3>
              <p className="text-blue-100/80 text-sm">
                Enter a mantra given to you by your Guru
              </p>
              {config.hasPersonalMantra && (
                <div className="mt-3 text-green-400 flex items-center justify-center gap-1">
                  <IoCheckmark /> Selected
                </div>
              )}
            </motion.button>
          </div>

          {/* Personal Mantra Input */}
          {config.hasPersonalMantra && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6"
            >
              <label className="text-amber-200 font-semibold mb-2 block">
                Enter Your Personal Mantra
              </label>
              <input
                type="text"
                value={config.mantra}
                onChange={(e) => setConfig({ ...config, mantra: e.target.value })}
                placeholder="e.g., Om Namo Bhagavate Vasudevaya"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-amber-400/30 text-amber-200 placeholder-blue-100/40 focus:outline-none focus:border-amber-400 text-lg"
              />
              <p className="text-blue-100/60 text-sm mt-2">
                This mantra will remain private and sacred to your practice
              </p>
            </motion.div>
          )}

          {/* General Mantra Selection */}
          {!config.hasPersonalMantra && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3"
            >
              <label className="text-amber-200 font-semibold mb-2 block">
                Select a Mantra
              </label>
              {generalMantras.map((mantra) => (
                <motion.button
                  key={mantra.id}
                  onClick={() => setConfig({ ...config, mantra: mantra.text })}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    config.mantra === mantra.text
                      ? "border-green-400 bg-gradient-to-r from-green-400/20 to-emerald-500/20"
                      : "border-white/20 bg-white/5 hover:border-amber-400/50"
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-amber-200 font-bold mb-1">
                        {mantra.name}
                      </h3>
                      <p className="text-blue-100/70 text-sm mb-2">
                        {mantra.description}
                      </p>
                      <p className="text-amber-100 italic text-sm">
                        "{mantra.text}"
                      </p>
                    </div>
                    {config.mantra === mantra.text && (
                      <IoCheckmark className="text-3xl text-green-400" />
                    )}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {errors.mantra && (
            <p className="text-red-400 text-sm mt-2">{errors.mantra}</p>
          )}
        </motion.div>

        {/* Deity Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-amber-200 mb-6 flex items-center gap-2">
            <IoImage className="text-3xl" />
            Choose Deity for Visualization
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {deities.map((deity) => (
              <motion.button
                key={deity.id}
                onClick={() => setConfig({ ...config, deity: deity.id })}
                className={`relative rounded-xl overflow-hidden border-4 transition-all ${
                  config.deity === deity.id
                    ? "border-green-400 shadow-lg shadow-green-400/50"
                    : "border-white/20 hover:border-amber-400/50"
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center">
                  <img
                    src={deity.image}
                    alt={deity.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `<div class="text-6xl text-amber-300">${
                        deity.id === "krishna"
                          ? "🦚"
                          : deity.id === "radha"
                          ? "🌺"
                          : "💑"
                      }</div>`;
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-lg mb-1">
                    {deity.name}
                  </h3>
                  <p className="text-blue-100 text-xs">{deity.description}</p>
                </div>
                {config.deity === deity.id && (
                  <div className="absolute top-2 right-2 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                    <IoCheckmark className="text-white text-2xl" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <motion.button
            onClick={onBack}
            className="px-6 py-3 bg-white/10 text-blue-100 rounded-full font-semibold hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back
          </motion.button>

          <motion.button
            onClick={handleStart}
            className="px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-bold shadow-lg hover:shadow-amber-400/50 transition-all flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Chanting
            <IoArrowForward />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MantraSetup;
