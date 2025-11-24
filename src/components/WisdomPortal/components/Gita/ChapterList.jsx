import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GiWhiteBook, GiScrollUnfurled } from "react-icons/gi";
import { IoBook, IoArrowForward, IoTrophy } from "react-icons/io5";

const ChapterList = ({ onSelectChapter }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState({});

  const chapterTitles = [
    { chapter: 1, title: "Arjuna Vishada Yoga", subtitle: "The Yoga of Arjuna's Dejection" },
    { chapter: 2, title: "Sankhya Yoga", subtitle: "The Yoga of Knowledge" },
    { chapter: 3, title: "Karma Yoga", subtitle: "The Yoga of Action" },
    { chapter: 4, title: "Jnana Karma Sanyasa Yoga", subtitle: "The Yoga of Wisdom and Renunciation" },
    { chapter: 5, title: "Karma Sanyasa Yoga", subtitle: "The Yoga of Renunciation of Action" },
    { chapter: 6, title: "Dhyana Yoga", subtitle: "The Yoga of Meditation" },
    { chapter: 7, title: "Jnana Vijnana Yoga", subtitle: "The Yoga of Knowledge and Wisdom" },
    { chapter: 8, title: "Aksara Brahma Yoga", subtitle: "The Yoga of the Imperishable Brahman" },
    { chapter: 9, title: "Raja Vidya Raja Guhya Yoga", subtitle: "The Yoga of Royal Knowledge" },
    { chapter: 10, title: "Vibhuti Yoga", subtitle: "The Yoga of Divine Glories" },
    { chapter: 11, title: "Visvarupa Darsana Yoga", subtitle: "The Yoga of the Universal Form" },
    { chapter: 12, title: "Bhakti Yoga", subtitle: "The Yoga of Devotion" },
    { chapter: 13, title: "Ksetra Ksetrajna Vibhaga Yoga", subtitle: "The Yoga of the Field and Knower" },
    { chapter: 14, title: "Gunatraya Vibhaga Yoga", subtitle: "The Yoga of the Three Modes" },
    { chapter: 15, title: "Purusottama Yoga", subtitle: "The Yoga of the Supreme Person" },
    { chapter: 16, title: "Daivasura Sampad Vibhaga Yoga", subtitle: "The Yoga of Divine and Demoniac Natures" },
    { chapter: 17, title: "Sraddhatraya Vibhaga Yoga", subtitle: "The Yoga of the Three Types of Faith" },
    { chapter: 18, title: "Moksa Sanyasa Yoga", subtitle: "The Yoga of Liberation and Renunciation" },
  ];

  useEffect(() => {
    fetchChapters();
    fetchUserProgress();
  }, []);

  const fetchChapters = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/krishna/gita/chapters`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setChapters(data);
    } catch (error) {
      console.error("Failed to fetch chapters:", error);
      // Use default chapter data
      setChapters(chapterTitles);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/krishna/gita/progress`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setUserProgress(data.chapterProgress || {});
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    }
  };

  const getProgressPercentage = (chapter) => {
    return userProgress[chapter] || 0;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl">
              <GiWhiteBook className="text-4xl text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-amber-200 mb-3">
            Bhagavad Gita
          </h1>
          <p className="text-blue-100/80 text-lg md:text-xl">
            The Song of God - 18 Chapters of Divine Wisdom
          </p>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapterTitles.map((chapter, index) => {
            const progress = getProgressPercentage(chapter.chapter);
            return (
              <motion.div
                key={chapter.chapter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectChapter(chapter.chapter)}
                className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/20 shadow-2xl hover:border-amber-400/50 transition-all cursor-pointer group"
                whileHover={{ scale: 1.02 }}
              >
                {/* Chapter Number */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-bold text-white text-xl shadow-lg">
                    {chapter.chapter}
                  </div>
                  {progress > 0 && (
                    <div className="flex items-center gap-1 text-green-400">
                      <IoTrophy />
                      <span className="text-sm font-semibold">{Math.round(progress)}%</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-amber-200 mb-2 group-hover:text-amber-100 transition-colors">
                  {chapter.title}
                </h3>
                <p className="text-blue-100/70 text-sm mb-4">
                  {chapter.subtitle}
                </p>

                {/* Progress Bar */}
                {progress > 0 && (
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                    />
                  </div>
                )}

                {/* Read Button */}
                <motion.button
                  className="w-full py-2 bg-gradient-to-r from-amber-400/20 to-orange-500/20 text-amber-200 rounded-lg font-semibold flex items-center justify-center gap-2 group-hover:from-amber-400/30 group-hover:to-orange-500/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IoBook />
                  {progress > 0 ? "Continue Reading" : "Start Reading"}
                  <IoArrowForward className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChapterList;
