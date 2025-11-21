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
          {/* Voice Quality (Primary Setting) */}
          <div>
            <label className="text-xs text-blue-100/80 block mb-1 flex items-center gap-1">
              <IoLanguage /> Voice Quality
            </label>
            <select
              value={settings.quality || "high"}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  quality: e.target.value,
                  provider:
                    e.target.value === "high" ? "elevenlabs" : "browser",
                })
              }
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-amber-400/30 text-amber-200 text-sm"
            >
              <option value="high">High Quality (ElevenLabs)</option>
              <option value="medium">Medium Quality (Browser)</option>
            </select>
          </div>

          {/* Voice Style (affects ElevenLabs parameters) */}
          <div>
            <label className="text-xs text-blue-100/80 block mb-1 flex items-center gap-1">
              <MdAutoAwesome /> Voice Style
            </label>
            <select
              value={settings.voiceStyle || "divine"}
              onChange={(e) =>
                onSettingsChange({ ...settings, voiceStyle: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-amber-400/30 text-amber-200 text-sm"
            >
              <option value="divine">Divine Krishna (Balanced)</option>
              <option value="gentle">Gentle Guide (Soft)</option>
              <option value="wise">Wise Teacher (Authoritative)</option>
            </select>
          </div>

          {/* Advanced Provider Selection */}
          <div>
            <label className="text-xs text-blue-100/80 block mb-1">
              Advanced Provider
            </label>
            <select
              value={settings.provider || "elevenlabs"}
              onChange={(e) =>
                onSettingsChange({ ...settings, provider: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-amber-400/30 text-amber-200 text-sm"
            >
              <option value="elevenlabs">ElevenLabs (Premium)</option>
              <option value="google">Google Cloud</option>
              <option value="browser">Browser (Basic)</option>
              <option value="auto">Auto (Best Available)</option>
            </select>
          </div>

          {/* Speed Control */}
          <div>
            <label className="text-xs text-blue-100/80 block mb-1">
              Speed: {settings.rate || 0.85}x
            </label>
            <input
              type="range"
              min="0.7"
              max="1.2"
              step="0.05"
              value={settings.rate || 0.85}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  rate: parseFloat(e.target.value),
                })
              }
              className="w-full accent-amber-400"
            />
          </div>

          {/* Volume Control */}
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
              className="w-full accent-amber-400"
            />
          </div>

          {/* Auto-speak Toggle - UPDATED */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoSpeakProactive"
                checked={settings.autoSpeak !== false}
                onChange={(e) =>
                  onSettingsChange({ ...settings, autoSpeak: e.target.checked })
                }
                className="rounded accent-amber-400"
              />
              <label
                htmlFor="autoSpeakProactive"
                className="text-sm text-blue-100/80 flex items-center gap-1"
              >
                <MdAutoAwesome /> Auto-speak proactive messages
              </label>
            </div>
            <p className="text-xs text-blue-100/50 ml-6">
              When enabled, Krishna will automatically speak when checking on
              you during periods of inactivity
            </p>
          </div>

          {/* TTS Behavior Info - NEW */}
          <div className="p-3 bg-gradient-to-r from-blue-400/10 to-purple-500/10 rounded-lg border border-blue-400/30">
            <p className="text-xs text-blue-100/80 mb-2">
              <strong className="text-amber-200">Voice Behavior:</strong>
            </p>
            <ul className="text-xs text-blue-100/60 space-y-1 ml-2">
              <li>• Regular responses: Click speaker icon to play</li>
              <li>
                • Proactive messages:{" "}
                {settings.autoSpeak !== false ? "Auto-plays" : "Manual play"}
              </li>
              <li>• All messages can be replayed manually</li>
            </ul>
          </div>

          {/* Current Provider Display */}
          <div className="mt-4 p-3 bg-gradient-to-r from-amber-400/10 to-orange-500/10 rounded-lg border border-amber-400/30">
            <p className="text-xs text-amber-200">
              Current:{" "}
              {settings.provider === "elevenlabs"
                ? "ElevenLabs Premium"
                : settings.provider === "google"
                ? "Google Cloud"
                : settings.provider === "auto"
                ? "Auto-detect"
                : "Browser TTS"}
            </p>
            <p className="text-xs text-blue-100/60 mt-1">
              Style: {settings.voiceStyle || "Divine"} • Speed:{" "}
              {settings.rate || 0.85}x • Volume:{" "}
              {Math.round((settings.volume || 1) * 100)}%
            </p>
          </div>

          {/* Save Settings Button - OPTIONAL */}
          <motion.button
            onClick={() => {
              // Save settings to localStorage
              localStorage.setItem(
                "krishnaVoiceSettings",
                JSON.stringify(settings)
              );
              onClose();
            }}
            className="w-full px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg font-semibold text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Save Settings
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};
