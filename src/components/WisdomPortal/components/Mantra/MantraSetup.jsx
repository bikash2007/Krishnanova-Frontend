import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiPrayerBeads, GiFeather, GiLotusFlower } from "react-icons/gi";
import { IoCheckmark, IoArrowForward, IoArrowBack } from "react-icons/io5";
import { FaOm, FaPray, FaHeart } from "react-icons/fa";

const MantraSetup = ({ onStart, onBack }) => {
  const [step, setStep] = useState(1); // 1: mantra type, 2: select mantra, 3: deity
  const [config, setConfig] = useState({
    hasPersonalMantra: false,
    mantra: "",
    deity: "krishna",
  });

  const generalMantras = [
    {
      id: "hare-krishna",
      name: "Hare Krishna Maha Mantra",
      text: "Hare Krishna Hare Krishna, Krishna Krishna Hare Hare, Hare Rama Hare Rama, Rama Rama Hare Hare",
    },
    { id: "om-namah", name: "Om Namah Shivaya", text: "Om Namah Shivaya" },
    {
      id: "gayatri",
      name: "Gayatri Mantra",
      text: "Om Bhur Bhuvah Svah, Tat Savitur Varenyam",
    },
    { id: "om", name: "Om", text: "Om" },
  ];

  const deities = [
    { id: "krishna", name: "Krishna", icon: <GiFeather /> },
    { id: "radha", name: "Radha", icon: <GiLotusFlower /> },
    { id: "radha-krishna", name: "Radha-Krishna", icon: <FaHeart /> },
  ];

  const canProceed = () => {
    if (step === 1) return true;
    if (step === 2) return config.mantra.trim() !== "";
    if (step === 3) return config.deity !== "";
    return false;
  };

  const handleNext = () => {
    if (step === 1 && config.hasPersonalMantra) {
      setStep(2);
    } else if (step === 1 && !config.hasPersonalMantra) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      onStart(config);
    }
  };

  const handleBack = () => {
    if (step === 1) onBack();
    else setStep(step - 1);
  };

  return (
    <div className="min-h-[calc(var(--app-height)*0.6)] max-h-[calc(var(--app-height)*0.9)] bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-black/20 px-4 py-3 flex items-center justify-between border-b border-white/10">
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 active:bg-white/20"
        >
          <IoArrowBack className="text-lg" />
        </button>
        <p className="text-amber-400 text-xs font-medium uppercase tracking-widest">
          Step {step} of 3
        </p>
        <div className="w-9" />
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-2">
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= step ? "bg-amber-400" : "bg-white/20"}`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Mantra Type */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col px-5 py-3"
            >
              <h2 className="text-xl font-bold text-white mb-2">Mantra Type</h2>
              <p className="text-white/50 text-sm mb-6">
                Do you have a personal mantra from your Guru?
              </p>

              <div className="flex-1 space-y-4">
                <motion.button
                  onClick={() =>
                    setConfig({
                      ...config,
                      hasPersonalMantra: false,
                      mantra: "",
                    })
                  }
                  className={`w-full p-5 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${
                    !config.hasPersonalMantra
                      ? "bg-amber-400/15 border-amber-400 ring-2 ring-amber-400/30"
                      : "bg-white/5 border-white/10"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${!config.hasPersonalMantra ? "bg-amber-400/30" : "bg-white/10"}`}
                    >
                      <FaOm className="text-amber-300" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-lg">
                        General Mantra
                      </p>
                      <p className="text-white/50 text-sm">
                        Choose from sacred mantras
                      </p>
                    </div>
                    {!config.hasPersonalMantra && (
                      <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center">
                        <IoCheckmark className="text-indigo-950" />
                      </div>
                    )}
                  </div>
                </motion.button>

                <motion.button
                  onClick={() =>
                    setConfig({
                      ...config,
                      hasPersonalMantra: true,
                      mantra: "",
                    })
                  }
                  className={`w-full p-5 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${
                    config.hasPersonalMantra
                      ? "bg-amber-400/15 border-amber-400 ring-2 ring-amber-400/30"
                      : "bg-white/5 border-white/10"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${config.hasPersonalMantra ? "bg-amber-400/30" : "bg-white/10"}`}
                    >
                      <FaPray className="text-amber-300 text-2xl" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-lg">
                        Personal Mantra
                      </p>
                      <p className="text-white/50 text-sm">
                        Given by your Guru
                      </p>
                    </div>
                    {config.hasPersonalMantra && (
                      <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center">
                        <IoCheckmark className="text-indigo-950" />
                      </div>
                    )}
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Select/Enter Mantra */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col px-5 py-4 overflow-hidden"
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                {config.hasPersonalMantra ? "Enter Mantra" : "Select Mantra"}
              </h2>
              <p className="text-white/50 text-sm mb-4">
                {config.hasPersonalMantra
                  ? "Type your personal mantra below"
                  : "Choose a sacred mantra"}
              </p>

              {config.hasPersonalMantra ? (
                <div className="flex-1">
                  <input
                    type="text"
                    value={config.mantra}
                    onChange={(e) =>
                      setConfig({ ...config, mantra: e.target.value })
                    }
                    placeholder="Enter your mantra..."
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border-2 border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-amber-400 text-lg"
                    autoFocus
                  />
                  <p className="text-white/40 text-xs mt-3 text-center">
                    This will remain private
                  </p>
                </div>
              ) : (
                <div className="flex-1 space-y-3 overflow-y-auto -mx-1 px-1 pb-2">
                  {generalMantras.map((mantra, index) => (
                    <motion.button
                      key={mantra.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() =>
                        setConfig({ ...config, mantra: mantra.text })
                      }
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${
                        config.mantra === mantra.text
                          ? "bg-amber-400/15 border-amber-400 ring-2 ring-amber-400/30"
                          : "bg-white/5 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${config.mantra === mantra.text ? "bg-amber-400/30" : "bg-white/10"}`}
                        >
                          <GiPrayerBeads className="text-amber-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white">
                            {mantra.name}
                          </p>
                          <p className="text-white/40 text-xs truncate mt-0.5">
                            {mantra.text}
                          </p>
                        </div>
                        {config.mantra === mantra.text && (
                          <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
                            <IoCheckmark className="text-indigo-950 text-sm" />
                          </div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Choose Deity */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 flex flex-col px-5 py-4"
            >
              <h2 className="text-2xl font-bold text-white mb-2">
                Choose Deity
              </h2>
              <p className="text-white/50 text-sm mb-6">
                For visualization during chanting
              </p>

              <div className="flex-1 grid grid-cols-3 gap-3">
                {deities.map((deity) => (
                  <motion.button
                    key={deity.id}
                    onClick={() => setConfig({ ...config, deity: deity.id })}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                      config.deity === deity.id
                        ? "bg-amber-400/15 border-amber-400 ring-2 ring-amber-400/30"
                        : "bg-white/5 border-transparent"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-5xl sm:text-6xl mb-3">
                      {deity.icon}
                    </div>
                    <p
                      className={`font-semibold text-sm ${config.deity === deity.id ? "text-amber-200" : "text-white"}`}
                    >
                      {deity.name}
                    </p>
                    {config.deity === deity.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center"
                      >
                        <IoCheckmark className="text-indigo-950 text-xs" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="px-5 pb-8 pt-4">
        <motion.button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-950 font-bold text-lg disabled:opacity-40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          whileTap={{ scale: canProceed() ? 0.98 : 1 }}
          style={{ boxShadow: "0 10px 40px rgba(251,191,36,0.3)" }}
        >
          <span>{step === 3 ? "Start Chanting" : "Continue"}</span>
          <IoArrowForward className="text-xl" />
        </motion.button>
      </div>
    </div>
  );
};

export default MantraSetup;
