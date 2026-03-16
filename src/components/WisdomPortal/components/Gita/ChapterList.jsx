import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoArrowForward } from "react-icons/io5";

const chapterTitles = [
  {
    chapter: 1,
    title: "Arjuna Vishada Yoga",
    subtitle: "The Yoga of Arjuna's Dejection",
    verses: 47,
  },
  {
    chapter: 2,
    title: "Sankhya Yoga",
    subtitle: "The Yoga of Knowledge",
    verses: 72,
  },
  {
    chapter: 3,
    title: "Karma Yoga",
    subtitle: "The Yoga of Action",
    verses: 43,
  },
  {
    chapter: 4,
    title: "Jnana Karma Sanyasa Yoga",
    subtitle: "The Yoga of Wisdom and Renunciation",
    verses: 42,
  },
  {
    chapter: 5,
    title: "Karma Sanyasa Yoga",
    subtitle: "The Yoga of Renunciation of Action",
    verses: 29,
  },
  {
    chapter: 6,
    title: "Dhyana Yoga",
    subtitle: "The Yoga of Meditation",
    verses: 47,
  },
  {
    chapter: 7,
    title: "Jnana Vijnana Yoga",
    subtitle: "The Yoga of Knowledge and Wisdom",
    verses: 30,
  },
  {
    chapter: 8,
    title: "Aksara Brahma Yoga",
    subtitle: "The Yoga of the Imperishable Brahman",
    verses: 28,
  },
  {
    chapter: 9,
    title: "Raja Vidya Raja Guhya Yoga",
    subtitle: "The Yoga of Royal Knowledge",
    verses: 34,
  },
  {
    chapter: 10,
    title: "Vibhuti Yoga",
    subtitle: "The Yoga of Divine Glories",
    verses: 42,
  },
  {
    chapter: 11,
    title: "Visvarupa Darsana Yoga",
    subtitle: "The Yoga of the Universal Form",
    verses: 55,
  },
  {
    chapter: 12,
    title: "Bhakti Yoga",
    subtitle: "The Yoga of Devotion",
    verses: 20,
  },
  {
    chapter: 13,
    title: "Ksetra Ksetrajna Vibhaga Yoga",
    subtitle: "The Yoga of the Field and Knower",
    verses: 35,
  },
  {
    chapter: 14,
    title: "Gunatraya Vibhaga Yoga",
    subtitle: "The Yoga of the Three Modes",
    verses: 27,
  },
  {
    chapter: 15,
    title: "Purusottama Yoga",
    subtitle: "The Yoga of the Supreme Person",
    verses: 20,
  },
  {
    chapter: 16,
    title: "Daivasura Sampad Vibhaga Yoga",
    subtitle: "The Yoga of Divine and Demoniac Natures",
    verses: 24,
  },
  {
    chapter: 17,
    title: "Sraddhatraya Vibhaga Yoga",
    subtitle: "The Yoga of the Three Types of Faith",
    verses: 28,
  },
  {
    chapter: 18,
    title: "Moksa Sanyasa Yoga",
    subtitle: "The Yoga of Liberation and Renunciation",
    verses: 78,
  },
];

const ChapterList = ({ onSelectChapter }) => {
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    fetchUserProgress();
  }, []);

  const fetchUserProgress = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/krishna/gita/progress`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await response.json();
      setUserProgress(data.chapterProgress || {});
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  const getProgressPct = (ch) => userProgress[ch] || 0;

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "radial-gradient(circle at center, #5b21b6 0%, #2e1065 50%, #170726 100%)",
        }}
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-11 h-11 border-2 border-amber-400/20 border-t-amber-300/70 rounded-full mx-auto mb-4"
          />
          <p className="text-amber-200/50 text-sm font-serif italic tracking-wide">
            Loading sacred texts…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at center, #5b21b6 0%, #2e1065 50%, #170726 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
        {/* ── Header — elegant, minimal, grounded ── */}
        <div className="text-center mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Om symbol — muted gold, not oversized */}
            <div className="text-amber-300/50 mt-10 text-4xl sm:text-5xl mb-3 select-none drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]">
              ॐ
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white/95 mb-2 tracking-wide drop-shadow-lg">
              Śrīmad Bhagavad Gītā
            </h1>

            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-14 sm:w-16 bg-gradient-to-r from-transparent to-amber-400/40" />
              <span className="text-amber-300/60 text-xs tracking-widest drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">
                ✦
              </span>
              <div className="h-px w-14 sm:w-16 bg-gradient-to-l from-transparent to-amber-400/40" />
            </div>

            <p className="text-white/50 font-serif text-sm sm:text-base italic">
              The Song of God — 18 Chapters of Divine Wisdom
            </p>
          </motion.div>
        </div>

        {/* ── Chapters — clean card list with warm accents ── */}
        <div className="space-y-2 sm:space-y-2.5">
          {chapterTitles.map((ch, index) => {
            const progress = getProgressPct(ch.chapter);
            return (
              <motion.button
                key={ch.chapter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.025 }}
                onClick={() => onSelectChapter(ch.chapter)}
                className="w-full group cursor-pointer"
              >
                <div
                  className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border border-white/[0.12] hover:border-amber-400/30 hover:shadow-xl hover:shadow-purple-500/20 transition-all relative overflow-hidden backdrop-blur-sm group-hover:translate-y-[-2px]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(124,58,237,0.15) 100%)",
                    boxShadow:
                      "0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 0 1px rgba(167,139,250,0.15)",
                  }}
                >
                  {/* Progress fill underlay — subtle emerald wash */}
                  {progress > 0 && (
                    <div
                      className="absolute inset-y-0 left-0 bg-emerald-500/[0.08] transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  )}

                  {/* Chapter number — gold circle */}
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full border border-amber-400/30 bg-gradient-to-br from-amber-400/[0.15] to-amber-500/[0.08] flex items-center justify-center shadow-lg shadow-amber-500/20 backdrop-blur-sm">
                    <span className="text-amber-300/90 font-serif font-bold text-xs sm:text-sm group-hover:text-amber-200 transition-colors">
                      {ch.chapter}
                    </span>
                  </div>

                  {/* Title + subtitle */}
                  <div className="relative flex-1 text-left min-w-0">
                    <h3 className="text-white/85 font-serif font-semibold text-sm sm:text-base leading-tight truncate group-hover:text-amber-200 transition-colors">
                      {ch.title}
                    </h3>
                    <p className="text-white/40 text-xs sm:text-sm font-serif truncate mt-0.5">
                      {ch.subtitle}
                    </p>
                  </div>

                  {/* Right meta: progress + verse count + arrow */}
                  <div className="relative flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    {progress > 0 && (
                      <span className="text-emerald-400/70 text-xs font-semibold hidden sm:block">
                        {Math.round(progress)}%
                      </span>
                    )}
                    <span className="text-white/25 text-xs font-serif hidden sm:block">
                      {ch.verses} verses
                    </span>
                    <IoArrowForward className="w-3.5 h-3.5 text-white/20 group-hover:text-amber-400/70 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ── Footer — subtle, reverent ── */}
        <div className="text-center mt-8 sm:mt-10">
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-amber-400/20" />
            <span className="text-amber-400/35 text-xs tracking-widest font-serif">
              ✦ ॐ ✦
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-amber-400/20" />
          </div>
          <p className="mt-3 text-white/25 text-xs font-serif italic tracking-wide">
            700 verses of timeless wisdom
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChapterList;
