import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { IoSettings, IoClose, IoLanguage } from "react-icons/io5";
import { MdAutoAwesome } from "react-icons/md";

/**
 * VoiceSettings - Voice configuration modal for Krishna's voice
 */
const VoiceSettings = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [availableVoices, setAvailableVoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen) {
      loadVoiceOptions();
    }
  }, [isOpen]);

  const loadVoiceOptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/krishna/wisdom-portal/voice-options`
      );
      if (response.data.success) {
        setAvailableVoices(response.data.voices);
      }
    } catch (error) {
      console.error("Failed to load voice options:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute top-16 right-0 z-50 backdrop-blur-md bg-gradient-to-br from-white/20 to-white/10 rounded-xl p-4 shadow-2xl border border-white/30 w-80"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-amber-200 font-semibold flex items-center gap-2">
          <IoSettings className="text-lg" /> Voice Settings
        </h3>
        <button
          onClick={onClose}
          className="text-blue-100/60 hover:text-amber-200 transition-colors"
        >
          <IoClose className="text-xl" />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-blue-100/80 mb-1 flex items-center gap-1">
              <IoLanguage /> Voice Provider
            </label>
            <select
              value={settings.provider || "auto"}
              onChange={(e) =>
                onSettingsChange({ ...settings, provider: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-amber-400/30 text-amber-200 text-sm"
            >
              <option value="auto">Auto (Best Available)</option>
              <option value="elevenlabs">ElevenLabs (Premium)</option>
              <option value="google">Google Cloud</option>
              <option value="browser">Browser (Basic)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-blue-100/80 block mb-1">
              Speed: {settings.rate || 0.95}x
            </label>
            <input
              type="range"
              min="0.7"
              max="1.2"
              step="0.05"
              value={settings.rate || 0.95}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  rate: parseFloat(e.target.value),
                })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="text-xs text-blue-100/80 block mb-1">
              Volume: {Math.round((settings.volume || 1) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.volume || 1}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  volume: parseFloat(e.target.value),
                })
              }
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoSpeak"
              checked={settings.autoSpeak || false}
              onChange={(e) =>
                onSettingsChange({ ...settings, autoSpeak: e.target.checked })
              }
              className="rounded"
            />
            <label
              htmlFor="autoSpeak"
              className="text-sm text-blue-100/80 flex items-center gap-1"
            >
              <MdAutoAwesome /> Auto-speak Krishna's messages
            </label>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default VoiceSettings;
