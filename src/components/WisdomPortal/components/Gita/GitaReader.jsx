import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiScrollUnfurled, GiLotusFlower, GiWhiteBook } from "react-icons/gi";
import {
  IoArrowBack,
  IoArrowForward,
  IoCheckmark,
  IoBookmark,
  IoBookmarkOutline,
  IoVolumeHigh,
  IoHome,
} from "react-icons/io5";
import { MdMenuBook } from "react-icons/md";

const GitaReader = ({ chapter, initialVerse = 1, onBack }) => {
  const [currentVerse, setCurrentVerse] = useState(initialVerse);
  const [verseData, setVerseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [totalVerses, setTotalVerses] = useState(0);

  useEffect(() => {
    fetchVerse();
  }, [chapter, currentVerse]);

  const fetchVerse = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/krishna/gita/${chapter}/${currentVerse}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await response.json();
      setVerseData(data);
      setCompleted(data.completed || false);
      setBookmarked(data.bookmarked || false);

      // Get total verses for this chapter
      if (data.totalVerses) {
        setTotalVerses(data.totalVerses);
      }
    } catch (error) {
      console.error("Failed to fetch verse:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/krishna/gita/progress/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            chapter,
            verse: currentVerse,
          }),
        },
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setCompleted(true);

        // Show toast with bhakti points if available
        if (data.bhaktiPoints) {
          // Dispatch custom event for parent component to show toast
          window.dispatchEvent(
            new CustomEvent("bhaktiPointsEarned", {
              detail: {
                pillar: data.bhaktiPoints.pillar,
                points: data.bhaktiPoints.points,
                description: data.bhaktiPoints.description,
                xpAwarded: data.xpAwarded,
                leveledUp: data.leveledUp,
                newLevel: data.newLevel,
              },
            }),
          );
        }
      }
    } catch (error) {
      console.error("Failed to mark complete:", error);
    }
  };

  const handleNext = () => {
    if (currentVerse < totalVerses) {
      setCurrentVerse(currentVerse + 1);
    }
  };

  const handlePrevious = () => {
    if (currentVerse > 1) {
      setCurrentVerse(currentVerse - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!verseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-amber-200 text-xl mb-4">Verse not found</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-semibold"
          >
            Back to Chapters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-blue-100 rounded-full hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoArrowBack />
            Chapters
          </motion.button>

          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-amber-200">
              Chapter {chapter}
            </h2>
            <p className="text-blue-100/80">
              Verse {currentVerse} of {totalVerses || "..."}
            </p>
          </div>

          <div className="w-24"></div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${((currentVerse - 1) / (totalVerses || 1)) * 100}%`,
            }}
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
          />
        </div>

        {/* Verse Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${chapter}-${currentVerse}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-6 md:p-10 border border-white/20 shadow-2xl mb-6"
          >
            {/* Verse Reference */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full px-4 py-2 border border-amber-400/30">
                <GiScrollUnfurled className="text-amber-300" />
                <span className="text-amber-200 font-semibold text-sm">
                  {chapter}.{currentVerse}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  className="p-2 rounded-lg hover:bg-white/10 text-blue-100/50 hover:text-amber-400 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Listen to pronunciation"
                >
                  <IoVolumeHigh className="text-xl" />
                </motion.button>
                <motion.button
                  onClick={() => setBookmarked(!bookmarked)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={bookmarked ? "Remove bookmark" : "Bookmark verse"}
                >
                  {bookmarked ? (
                    <IoBookmark className="text-xl text-amber-400" />
                  ) : (
                    <IoBookmarkOutline className="text-xl text-blue-100/50" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Sanskrit */}
            <div className="mb-6">
              <h3 className="text-amber-200 text-sm font-semibold mb-3 flex items-center gap-2">
                <GiLotusFlower className="text-amber-300" />
                Sanskrit
              </h3>
              <div className="bg-gradient-to-r from-amber-400/10 to-orange-500/10 rounded-xl p-4 md:p-6 border border-amber-400/20">
                <p className="text-amber-100 text-xl md:text-2xl leading-relaxed font-serif">
                  {verseData.sanskrit}
                </p>
              </div>
            </div>

            {/* Transliteration */}
            {verseData.transliteration && (
              <div className="mb-6">
                <h3 className="text-amber-200 text-sm font-semibold mb-3 flex items-center gap-2">
                  <MdMenuBook className="text-amber-300" />
                  Transliteration
                </h3>
                <div className="border-l-4 border-amber-400/50 pl-4 md:pl-6">
                  <p className="text-blue-100/90 italic text-base md:text-lg leading-relaxed">
                    {verseData.transliteration}
                  </p>
                </div>
              </div>
            )}

            {/* Translation */}
            <div className="mb-6">
              <h3 className="text-amber-200 text-sm font-semibold mb-3 flex items-center gap-2">
                <GiWhiteBook className="text-amber-300" />
                Translation
              </h3>
              <div className="bg-gradient-to-r from-purple-400/10 to-blue-500/10 rounded-xl p-4 md:p-6 border border-purple-400/20">
                <p className="text-blue-100 text-base md:text-lg leading-relaxed">
                  {verseData.translation}
                </p>
              </div>
            </div>

            {/* Explanation */}
            {verseData.explanation && (
              <div className="mb-6">
                <h3 className="text-amber-200 text-sm font-semibold mb-3">
                  Explanation
                </h3>
                <div className="text-blue-100/80 text-sm md:text-base leading-relaxed space-y-3">
                  {verseData.explanation.split("\n").map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Mark Complete Button */}
            {!completed && (
              <motion.button
                onClick={handleMarkComplete}
                className="w-full py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-bold shadow-lg hover:shadow-green-400/50 transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <IoCheckmark className="text-2xl" />
                Mark as Completed
              </motion.button>
            )}

            {completed && (
              <div className="w-full py-3 bg-gradient-to-r from-green-400/20 to-emerald-500/20 text-green-300 rounded-xl font-semibold border border-green-400/30 flex items-center justify-center gap-2">
                <IoCheckmark className="text-2xl" />
                Completed ✓
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <motion.button
            onClick={handlePrevious}
            disabled={currentVerse === 1}
            className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 ${
              currentVerse === 1
                ? "bg-white/5 text-blue-100/30 cursor-not-allowed"
                : "bg-white/10 text-blue-100 hover:bg-white/20"
            }`}
            whileHover={currentVerse > 1 ? { scale: 1.05 } : {}}
            whileTap={currentVerse > 1 ? { scale: 0.95 } : {}}
          >
            <IoArrowBack />
            Previous
          </motion.button>

          <div className="text-blue-100/60 text-sm">
            {currentVerse} / {totalVerses}
          </div>

          <motion.button
            onClick={handleNext}
            disabled={currentVerse === totalVerses}
            className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 ${
              currentVerse === totalVerses
                ? "bg-white/5 text-blue-100/30 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:shadow-amber-400/50"
            }`}
            whileHover={currentVerse < totalVerses ? { scale: 1.05 } : {}}
            whileTap={currentVerse < totalVerses ? { scale: 0.95 } : {}}
          >
            Next
            <IoArrowForward />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default GitaReader;
