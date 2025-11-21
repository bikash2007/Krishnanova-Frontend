// components/KrishnaVoiceElevenLabs.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { IoVolumeHigh, IoPause } from "react-icons/io5";
import axios from "axios";

const KrishnaVoiceElevenLabs = ({
  text,
  messageId,
  userId,
  voiceSettings = {},
  className = "",
  autoPlay = false,
  isProactive = false, // Add this prop to identify proactive messages
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [hasPlayed, setHasPlayed] = useState(false); // Track if this message has auto-played
  const audioRef = useRef(null);
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Updated autoPlay effect - only auto-play once per message
  useEffect(() => {
    // Only auto-play if:
    // 1. autoPlay prop is true (which means it's a proactive message and autoSpeak is enabled)
    // 2. We have text to speak
    // 3. We haven't already auto-played this message
    if (autoPlay && text && !hasPlayed) {
      const timer = setTimeout(() => {
        handleSpeak();
        setHasPlayed(true); // Mark as played to prevent repeated auto-play
      }, 500); // Small delay to ensure smooth UI
      return () => clearTimeout(timer);
    }
  }, [text, autoPlay, hasPlayed]);

  const handleSpeak = async () => {
    if (!text) return;

    if (isPlaying) {
      handleStop();
      return;
    }

    // If we have cached audio and using ElevenLabs, replay it
    if (
      audioUrl &&
      audioRef.current &&
      voiceSettings?.provider === "elevenlabs"
    ) {
      audioRef.current.currentTime = 0; // Reset to start
      audioRef.current.play();
      return;
    }

    // Only use browser TTS if explicitly selected
    if (voiceSettings?.provider === "browser") {
      return fallbackToBrowserTTS(text);
    }

    setIsLoading(true);

    try {
      // Determine the actual provider to use
      let actualProvider = voiceSettings?.provider || "elevenlabs";

      // If quality is set to high, force ElevenLabs
      if (voiceSettings?.quality === "high") {
        actualProvider = "elevenlabs";
      }

      // Never send "browser" to the API - use it only as fallback
      if (actualProvider === "browser") {
        setIsLoading(false);
        return fallbackToBrowserTTS(text);
      }

      const response = await axios.post(
        `${baseUrl}/krishna/wisdom-portal/synthesize-speech`,
        {
          text: text,
          messageId: messageId,
          userId: userId,
          isProactive: isProactive, // Send this to backend for analytics
          voiceSettings: {
            provider: actualProvider,
            quality: voiceSettings?.quality || "high",
            voiceStyle: voiceSettings?.voiceStyle || "divine",
            rate: voiceSettings?.rate || 0.85,
            volume: voiceSettings?.volume || 1.0,
            // ElevenLabs specific settings
            stability: getStabilityForStyle(voiceSettings?.voiceStyle),
            similarity_boost: getSimilarityForStyle(voiceSettings?.voiceStyle),
            style: getStyleValue(voiceSettings?.voiceStyle),
          },
        }
      );

      if (response.data.success) {
        if (response.data.audio) {
          // ElevenLabs or Google audio received
          if (!audioRef.current) {
            audioRef.current = new Audio();
          }

          audioRef.current.src = response.data.audio;
          audioRef.current.volume = voiceSettings?.volume || 1.0;
          audioRef.current.playbackRate = voiceSettings?.rate || 0.85;

          audioRef.current.onplay = () => {
            setIsPlaying(true);
            setIsLoading(false);
          };

          audioRef.current.onended = () => {
            setIsPlaying(false);
          };

          audioRef.current.onerror = (e) => {
            console.error("Audio playback error:", e);
            setIsPlaying(false);
            setIsLoading(false);
            // Fallback to browser TTS on error
            fallbackToBrowserTTS(response.data.processedText || text);
          };

          setAudioUrl(response.data.audio);
          await audioRef.current.play();
          return;
        } else if (response.data.processedText) {
          // API wants us to use browser TTS (as fallback)
          setIsLoading(false);
          return fallbackToBrowserTTS(response.data.processedText);
        }
      }
    } catch (error) {
      console.error("TTS API error:", error);
      setIsLoading(false);
      // On API error, fallback to browser TTS
      fallbackToBrowserTTS(text);
    }
  };

  // Voice style configurations for ElevenLabs
  const getStabilityForStyle = (style) => {
    switch (style) {
      case "divine":
        return 0.75;
      case "gentle":
        return 0.85;
      case "wise":
        return 0.7;
      default:
        return 0.75;
    }
  };

  const getSimilarityForStyle = (style) => {
    switch (style) {
      case "divine":
        return 0.75;
      case "gentle":
        return 0.8;
      case "wise":
        return 0.7;
      default:
        return 0.75;
    }
  };

  const getStyleValue = (style) => {
    switch (style) {
      case "divine":
        return 0.5;
      case "gentle":
        return 0.3;
      case "wise":
        return 0.7;
      default:
        return 0.5;
    }
  };

  const fallbackToBrowserTTS = (processedText = text) => {
    if (!window.speechSynthesis) {
      console.log("Browser TTS not supported");
      setIsLoading(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Enhanced text processing for Krishna-like speech
    let krishnaText = processedText;

    const pronunciations = {
      Krishna: "Kreesh-naa",
      Arjuna: "Ar-joo-naa",
      Bhagavad: "Bhaa-ga-vad",
      Gita: "Gee-taa",
      dharma: "dhar-maa",
      karma: "kar-maa",
      yoga: "yo-gaa",
      bhakti: "bhak-tee",
      moksha: "mok-shaa",
      samsara: "sam-saa-raa",
      atman: "aat-man",
      brahman: "brah-man",
      guru: "goo-roo",
      mantra: "man-traa",
      prana: "praa-naa",
      chakra: "chak-raa",
    };

    Object.keys(pronunciations).forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      krishnaText = krishnaText.replace(regex, pronunciations[word]);
    });

    const utterance = new SpeechSynthesisUtterance(krishnaText);

    // Wait for voices to load if needed
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = null;

      if (voiceSettings?.voiceStyle === "gentle") {
        selectedVoice =
          voices.find(
            (v) =>
              v.lang.includes("en-IN") &&
              v.name.toLowerCase().includes("female")
          ) || voices.find((v) => v.lang.includes("en-IN"));
      } else {
        selectedVoice =
          voices.find(
            (v) =>
              v.lang.includes("en-IN") && v.name.toLowerCase().includes("male")
          ) ||
          voices.find((v) => v.lang.includes("hi-IN")) ||
          voices.find(
            (v) =>
              v.lang.includes("en-GB") && v.name.toLowerCase().includes("male")
          );
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    };

    // Try to set voice immediately
    setVoice();

    // Also listen for voices changed event
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }

    // Apply voice style parameters
    switch (voiceSettings?.voiceStyle) {
      case "gentle":
        utterance.rate = voiceSettings?.rate || 0.9;
        utterance.pitch = 1.0;
        break;
      case "wise":
        utterance.rate = voiceSettings?.rate || 0.8;
        utterance.pitch = 0.85;
        break;
      case "divine":
      default:
        utterance.rate = voiceSettings?.rate || 0.85;
        utterance.pitch = 0.9;
        break;
    }

    utterance.volume = voiceSettings?.volume || 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (err) => {
      console.error("Browser TTS error:", err);
      setIsPlaying(false);
      setIsLoading(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  // Visual indicator for proactive messages
  const buttonTitle = isProactive
    ? isPlaying
      ? "Stop Krishna's check-in message"
      : "Listen to Krishna's check-in"
    : isPlaying
    ? "Stop Krishna's divine voice"
    : "Listen to Krishna's message";

  return (
    <motion.button
      onClick={isPlaying ? handleStop : handleSpeak}
      disabled={isLoading}
      className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${
        isPlaying
          ? "text-amber-400 animate-pulse"
          : isProactive && !hasPlayed && autoPlay
          ? "text-amber-300" // Different color for pending auto-play
          : "text-blue-100/50 hover:text-amber-400"
      } ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={buttonTitle}
    >
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full"
        />
      ) : isPlaying ? (
        <IoPause className="text-lg" />
      ) : (
        <IoVolumeHigh className="text-lg" />
      )}
    </motion.button>
  );
};

export default KrishnaVoiceElevenLabs;
