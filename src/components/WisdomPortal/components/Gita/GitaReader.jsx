import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoArrowBack,
  IoArrowForward,
  IoCheckmark,
  IoBookmark,
  IoBookmarkOutline,
  IoChevronDown,
  IoBook,
} from "react-icons/io5";
import BookMode from "./BookMode";

// ── Chapter meta ──
const CHAPTER_META = [
  { ch: 1, title: "Arjuna Vishada Yoga", verses: 47 },
  { ch: 2, title: "Sankhya Yoga", verses: 72 },
  { ch: 3, title: "Karma Yoga", verses: 43 },
  { ch: 4, title: "Jnana Karma Sanyasa Yoga", verses: 42 },
  { ch: 5, title: "Karma Sanyasa Yoga", verses: 29 },
  { ch: 6, title: "Dhyana Yoga", verses: 47 },
  { ch: 7, title: "Jnana Vijnana Yoga", verses: 30 },
  { ch: 8, title: "Aksara Brahma Yoga", verses: 28 },
  { ch: 9, title: "Raja Vidya Raja Guhya Yoga", verses: 34 },
  { ch: 10, title: "Vibhuti Yoga", verses: 42 },
  { ch: 11, title: "Visvarupa Darsana Yoga", verses: 55 },
  { ch: 12, title: "Bhakti Yoga", verses: 20 },
  { ch: 13, title: "Ksetra Ksetrajna Vibhaga Yoga", verses: 35 },
  { ch: 14, title: "Gunatraya Vibhaga Yoga", verses: 27 },
  { ch: 15, title: "Purusottama Yoga", verses: 20 },
  { ch: 16, title: "Daivasura Sampad Vibhaga Yoga", verses: 24 },
  { ch: 17, title: "Sraddhatraya Vibhaga Yoga", verses: 28 },
  { ch: 18, title: "Moksa Sanyasa Yoga", verses: 78 },
];

const TOTAL_GITA_VERSES = 700;

const getChapterTitle = (ch) =>
  CHAPTER_META.find((c) => c.ch === ch)?.title || "";
const getChapterVerseCount = (ch) =>
  CHAPTER_META.find((c) => c.ch === ch)?.verses || 0;

// Cumulative verse number (e.g. Ch2 V1 = verse 48 of 700)
const getCumulativeVerse = (ch, v) => {
  let total = 0;
  for (let i = 0; i < CHAPTER_META.length; i++) {
    if (CHAPTER_META[i].ch === ch) return total + v;
    total += CHAPTER_META[i].verses;
  }
  return total + v;
};

/* ── Refined page-turn animation ──
   Smooth opacity + horizontal slide. No rotateY to avoid
   rendering glitches on iOS Safari & low-end GPUs. */
const pageVariants = {
  enter: (dir) => ({
    opacity: 0,
    x: dir > 0 ? 50 : -50,
    scale: 0.98,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (dir) => ({
    opacity: 0,
    x: dir > 0 ? -50 : 50,
    scale: 0.98,
    transition: { duration: 0.22 },
  }),
};

/* Peaceful purple mystical gradient — Krishna-inspired devotional vibe.
   Matches the spiritual peacock-mystical theme of the website. */
const SACRED_BG =
  "radial-gradient(circle at center, #5b21b6 0%, #2e1065 50%, #170726 100%)";

// ══════════════════════════════════════════
//  SACRED GITA READER — Premium Redesign
// ══════════════════════════════════════════
const GitaReader = ({
  chapter: initialChapter,
  initialVerse = 1,
  onBack,
  onChapterChange,
}) => {
  const [chapter, setChapter] = useState(initialChapter);
  const [currentVerse, setCurrentVerse] = useState(initialVerse);
  const [verseData, setVerseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [totalVerses, setTotalVerses] = useState(
    () => getChapterVerseCount(initialChapter) || 0,
  );
  const [direction, setDirection] = useState(1);
  const [showExplanation, setShowExplanation] = useState(false);
  const [bookModeOpen, setBookModeOpen] = useState(false);

  // Chapter dropdown
  const [chapterDropdownOpen, setChapterDropdownOpen] = useState(false);
  const chapterDropRef = useRef(null);

  // Verse quick-jump input
  const [verseInput, setVerseInput] = useState(String(initialVerse));
  const [isVerseEditing, setIsVerseEditing] = useState(false);
  const verseInputRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        chapterDropRef.current &&
        !chapterDropRef.current.contains(e.target)
      ) {
        setChapterDropdownOpen(false);
      }
    };
    document.addEventListener("pointerdown", handler);
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", handler);
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  // Keep verse input in sync with current verse (unless user is editing)
  useEffect(() => {
    if (!isVerseEditing) setVerseInput(String(currentVerse));
  }, [currentVerse, isVerseEditing]);

  // Update totalVerses when chapter changes
  useEffect(() => {
    const count = getChapterVerseCount(chapter);
    if (count) setTotalVerses(count);
  }, [chapter]);

  // ── Fetch verse ──
  const fetchVerse = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/krishna/gita/${chapter}/${currentVerse}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await res.json();
      setVerseData(data);
      setCompleted(data.completed || false);
      setBookmarked(data.bookmarked || false);
      if (data.totalVerses) setTotalVerses(data.totalVerses);
    } catch {
      setVerseData(null);
    } finally {
      setLoading(false);
    }
  }, [chapter, currentVerse]);

  useEffect(() => {
    fetchVerse();
  }, [fetchVerse]);

  // ── Keyboard navigation ──
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") setChapterDropdownOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // ── Navigation ──
  const goNext = useCallback(() => {
    if (currentVerse < totalVerses) {
      setDirection(1);
      setShowExplanation(false);
      setCurrentVerse((v) => v + 1);
    }
  }, [currentVerse, totalVerses]);

  const goPrev = useCallback(() => {
    if (currentVerse > 1) {
      setDirection(-1);
      setShowExplanation(false);
      setCurrentVerse((v) => v - 1);
    }
  }, [currentVerse]);

  const jumpToVerse = useCallback(
    (v) => {
      const num = parseInt(v, 10);
      if (isNaN(num) || num < 1 || num > totalVerses) return;
      setDirection(num > currentVerse ? 1 : -1);
      setShowExplanation(false);
      setCurrentVerse(num);
    },
    [currentVerse, totalVerses],
  );

  const switchChapter = useCallback(
    (newCh) => {
      setDirection(newCh > chapter ? 1 : -1);
      setChapter(newCh);
      setCurrentVerse(1);
      setTotalVerses(getChapterVerseCount(newCh));
      setShowExplanation(false);
      setChapterDropdownOpen(false);
      setVerseData(null);
      if (onChapterChange) onChapterChange(newCh);
    },
    [chapter, onChapterChange],
  );

  // Handle verse input submit
  const handleVerseInputSubmit = (e) => {
    e.preventDefault();
    jumpToVerse(verseInput);
    verseInputRef.current?.blur();
  };

  const handleVerseInputCommit = () => {
    const num = parseInt(verseInput, 10);
    if (isNaN(num) || num < 1 || num > totalVerses) {
      setVerseInput(String(currentVerse));
      return;
    }
    jumpToVerse(num);
  };

  // ── Mark complete ──
  const handleMarkComplete = useCallback(async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/krishna/gita/progress/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ chapter, verse: currentVerse }),
        },
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setCompleted(true);
        if (data.bhaktiPoints) {
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
    } catch {
      /* silent */
    }
  }, [chapter, currentVerse]);

  const cumulativeVerse = getCumulativeVerse(chapter, currentVerse);

  // ════════════════════════════
  //  LOADING STATE
  // ════════════════════════════
  if (loading && !verseData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: SACRED_BG }}
      >
        <div className="text-center">
          {/* Warm gold spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-11 h-11 border-2 border-amber-400/20 border-t-amber-300/70 rounded-full mx-auto mb-4"
          />
          <p className="text-amber-200/50 text-sm font-serif italic tracking-wide">
            Opening sacred verse…
          </p>
        </div>
      </div>
    );
  }

  // ════════════════════════════
  //  VERSE NOT FOUND
  // ════════════════════════════
  if (!verseData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: SACRED_BG }}
      >
        <div className="text-center">
          <p className="text-amber-100/80 text-xl font-serif mb-5">
            Verse not found
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200/90 font-serif font-medium text-sm hover:bg-amber-500/25 hover:border-amber-400/45 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 backdrop-blur-sm"
          >
            Return to Chapters
          </button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════
  //  MAIN VERSE VIEW — Premium Redesign
  // ══════════════════════════════════════════
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: SACRED_BG }}
    >
      {/* ═══ TOOLBAR ═══
          Frosted glass header — stays pinned below site nav.
          Warm-dark glass with subtle gold accents. */}
      <header
        className="gita-toolbar sticky z-40"
        style={{ top: "calc(70px + env(safe-area-inset-top))" }}
      >
        <div className="max-w-[820px] mx-auto px-3 sm:px-5 py-2.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Left group: Back + Chapter selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
            <button
              onClick={onBack}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/[0.10] hover:shadow-lg hover:shadow-purple-500/10 transition-all flex-shrink-0 backdrop-blur-sm"
              title="Back to Chapters"
            >
              <IoArrowBack className="w-5 h-5" />
            </button>

            {/* Chapter dropdown */}
            <div
              className="relative flex-1 min-w-0 sm:flex-initial"
              ref={chapterDropRef}
            >
              <button
                onClick={() => setChapterDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-3.5 py-2 text-sm w-full sm:w-auto rounded-lg bg-white/[0.10] border border-white/[0.15] text-white/95 hover:border-amber-300/40 hover:bg-white/[0.15] hover:shadow-lg hover:shadow-purple-500/10 transition-all cursor-pointer backdrop-blur-sm"
              >
                <span className="font-serif font-bold truncate min-w-0">
                  Ch. {chapter}: {getChapterTitle(chapter)}
                </span>
                <IoChevronDown
                  className={`w-3.5 h-3.5 flex-shrink-0 text-amber-300/60 transition-transform duration-200 ${chapterDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {chapterDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 rounded-xl max-h-80 overflow-y-auto gita-scroll z-50 border border-white/[0.08]"
                    style={{
                      background: "rgba(76, 29, 149, 0.95)",
                      backdropFilter: "blur(24px)",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
                    }}
                  >
                    {CHAPTER_META.map((c) => (
                      <button
                        key={c.ch}
                        onClick={() => switchChapter(c.ch)}
                        className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-all font-serif text-sm border-b border-white/[0.04] ${
                          c.ch === chapter
                            ? "bg-amber-400/[0.08] text-amber-300"
                            : "text-white/70 hover:bg-white/[0.04] hover:text-white/90"
                        }`}
                      >
                        <span className="w-7 h-7 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400/80 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {c.ch}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold">
                            {c.title}
                          </div>
                          <div className="text-white/30 text-xs">
                            {c.verses} verses
                          </div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right group: Verse jump + Book mode + Theme toggle */}
          <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
            <form
              onSubmit={handleVerseInputSubmit}
              className="flex items-center gap-1.5"
            >
              <span className="text-amber-300/60 text-xs font-serif font-semibold">
                Verse
              </span>
              <input
                ref={verseInputRef}
                type="number"
                min={1}
                max={totalVerses}
                value={verseInput}
                onChange={(e) => setVerseInput(e.target.value)}
                inputMode="numeric"
                onFocus={() => setIsVerseEditing(true)}
                onBlur={() => {
                  setIsVerseEditing(false);
                  handleVerseInputCommit();
                }}
                className="gita-verse-input w-16 text-center text-sm font-semibold py-1.5 px-1"
              />
              <button
                type="submit"
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/[0.10] hover:shadow-lg hover:shadow-purple-500/10 transition-all backdrop-blur-sm"
                title="Go to verse"
              >
                <IoArrowForward className="w-4 h-4" />
              </button>
            </form>

            <button
              onClick={() => setBookModeOpen(true)}
              className="gita-book-mode-btn"
              title="Read full chapter as a book"
            >
              <IoBook className="w-4 h-4" />
              <span className="hidden sm:inline">Book Mode</span>
            </button>
          </div>
        </div>
      </header>

      {/* ═══ VERSE CONTENT ═══
          Centered single-column, max-width 720px for optimal
          reading comfort. items-start on mobile prevents vertical
          centering that causes overflow on small screens. */}
      <main className="flex-1 flex items-start sm:items-center justify-center px-3 sm:px-6 pt-6 pb-20 sm:pb-8">
        <div className="w-full max-w-[720px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.article
              key={`${chapter}-${currentVerse}`}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative"
              style={{ perspective: 1200 }}
            >
              {/* ── Sacred verse card ──
                  Multi-layer depth: dark base with gold edge glow.
                  No heavy backdrop-blur to stay performant on mobile. */}
              <div
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(124,58,237,0.35) 50%, rgba(109,40,217,0.30) 100%)",
                  boxShadow:
                    "0 0 0 1px rgba(167,139,250,0.3), 0 8px 32px rgba(0,0,0,0.4), 0 0 60px -10px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                  border: "1px solid rgba(167,139,250,0.2)",
                }}
              >
                {/* Bookmark — positioned top right */}
                <button
                  onClick={() => setBookmarked((b) => !b)}
                  className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/[0.08] border border-white/[0.15] hover:bg-amber-400/20 hover:border-amber-400/30 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200 group"
                  title={bookmarked ? "Remove bookmark" : "Bookmark this verse"}
                >
                  {bookmarked ? (
                    <IoBookmark className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  ) : (
                    <IoBookmarkOutline className="w-5 h-5 text-white/30 group-hover:text-amber-400 transition-all" />
                  )}
                </button>

                {/* ── CHAPTER & VERSE HEADER ──
                    Hierarchical: small chapter label → large verse number → ornament.
                    Centered and grounded, not floating. */}
                <header className="relative z-10 text-center pt-5 sm:pt-6 pb-1">
                  {/* Chapter label — small, muted, tracking-widest for elegance */}
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.3 }}
                    className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-amber-300/60 font-medium mb-2"
                  >
                    Chapter {chapter} · {getChapterTitle(chapter)}
                  </motion.p>

                  {/* Verse number — hero-sized, refined serif */}
                  <motion.h2
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.12, duration: 0.35 }}
                    className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-white mb-3"
                  >
                    Verse{" "}
                    <span className="font-bold text-amber-300">
                      {currentVerse}
                    </span>
                  </motion.h2>

                  {/* Ornamental divider — gold star flanked by lines */}
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="h-px w-10 sm:w-12 bg-gradient-to-r from-transparent to-amber-300/50" />
                    <span className="text-amber-300/70 text-xs select-none">
                      ✦
                    </span>
                    <div className="h-px w-10 sm:w-12 bg-gradient-to-l from-transparent to-amber-300/50" />
                  </div>
                </header>

                {/* ── SANSKRIT VERSE ──
                    Sacred illuminated manuscript style with golden glow.
                    Premium depth with layered shadows and elegant Devanagari typography.
                    Centered for ceremonial presentation. */}
                <motion.section
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mx-4 sm:mx-8 mt-5 mb-5 sm:mb-6"
                  aria-label="Sanskrit verse"
                >
                  <div
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(251,191,36,0.18) 0%, rgba(245,158,11,0.12) 50%, rgba(217,119,6,0.08) 100%)",
                      boxShadow:
                        "0 0 0 1.5px rgba(251,191,36,0.35), 0 8px 24px rgba(0,0,0,0.2), 0 0 40px -10px rgba(251,191,36,0.25), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(251,191,36,0.1)",
                    }}
                  >
                    {/* Sacred header with ornamental border */}
                    <div className="flex items-center justify-center gap-3 pt-4 pb-2 px-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/30 to-amber-400/20" />
                      <span className="text-[10px] tracking-[0.25em] uppercase text-amber-200/80 font-bold drop-shadow-sm">
                        संस्कृत • Sanskrit
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-400/30 to-amber-400/20" />
                    </div>

                    {/* Sanskrit text with enhanced readability */}
                    <div className="px-5 sm:px-8 pb-5 sm:pb-6">
                      <p
                        className="text-[1.35rem] sm:text-[1.65rem] leading-[2] sm:leading-[2.1] text-center text-amber-50/95 tracking-wide font-semibold drop-shadow-sm"
                        style={{
                          fontFamily:
                            "'Noto Serif Devanagari', 'Noto Serif', serif",
                          textShadow: "0 1px 2px rgba(0,0,0,0.15)",
                        }}
                      >
                        {verseData.sanskrit}
                      </p>
                    </div>
                  </div>
                </motion.section>

                {/* ── TRANSLITERATION ──
                    Romanized pronunciation guide with subtle styling.
                    Centered for easy reference below Sanskrit. */}
                {verseData.transliteration && (
                  <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.35 }}
                    className="mx-4 sm:mx-8 mb-4 sm:mb-5"
                    aria-label="Transliteration"
                  >
                    <div className="text-center px-3 sm:px-6">
                      <span className="text-[9px] tracking-[0.22em] uppercase text-purple-200/50 font-semibold mb-2 inline-block">
                        Pronunciation
                      </span>
                      <p className="text-[0.9rem] sm:text-[0.95rem] text-purple-100/60 italic leading-[1.7] tracking-wide font-light max-w-[560px] mx-auto">
                        {verseData.transliteration}
                      </p>
                    </div>
                  </motion.section>
                )}

                {/* ── OM DIVIDER ──
                    Minimal sacred separator. Static (no animate-pulse)
                    for visual calm. */}
                <div
                  className="flex items-center justify-center py-2 sm:py-3"
                  aria-hidden="true"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-px w-10 sm:w-14 bg-gradient-to-r from-transparent to-amber-300/40" />
                    <span className="text-lg sm:text-xl text-amber-300/60 select-none">
                      ॐ
                    </span>
                    <div className="h-px w-10 sm:w-14 bg-gradient-to-l from-transparent to-amber-300/40" />
                  </div>
                </div>

                {/* ── TRANSLATION ──
                    Modern reading experience with left-aligned text.
                    Premium frost glass card with optimal readability.
                    Left-aligned for natural reading flow. */}
                <motion.section
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="mx-4 sm:mx-8 mb-5 sm:mb-6"
                  aria-label="English translation"
                >
                  <div
                    className="relative rounded-2xl p-5 sm:p-6"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(167,139,250,0.10) 50%, rgba(139,92,246,0.08) 100%)",
                      boxShadow:
                        "0 0 0 1.5px rgba(167,139,250,0.25), 0 6px 20px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(167,139,250,0.1)",
                    }}
                  >
                    {/* Section header - centered */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="h-px w-8 bg-gradient-to-r from-transparent via-emerald-400/30 to-emerald-400/20" />
                      <span className="text-[10px] tracking-[0.22em] uppercase text-emerald-200/70 font-bold">
                        Translation
                      </span>
                      <div className="h-px w-8 bg-gradient-to-l from-transparent via-emerald-400/30 to-emerald-400/20" />
                    </div>

                    {/* Translation text - left aligned for readability */}
                    <div className="max-w-[600px] mx-auto">
                      <p
                        className="text-[1rem] sm:text-[1.1rem] text-white/95 leading-[1.85] sm:leading-[2] text-left font-normal tracking-wide"
                        style={{
                          fontFamily: "'Playfair Display', 'Georgia', serif",
                          textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        }}
                      >
                        {verseData.translation}
                      </p>
                    </div>
                  </div>
                </motion.section>

                {/* ── COMMENTARY TOGGLE ──
                    In-depth explanation with smooth accordion animation.
                    Left-aligned text for comfortable reading. */}
                {verseData.explanation && (
                  <div className="mx-4 sm:mx-8 mb-5">
                    <button
                      onClick={() => setShowExplanation((v) => !v)}
                      className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white/[0.06] border border-white/[0.15] hover:bg-amber-400/[0.15] hover:border-amber-400/[0.30] hover:shadow-lg hover:shadow-amber-500/15 transition-all duration-250 group cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm text-white/65 font-semibold tracking-wide group-hover:text-amber-200/90 transition-colors">
                        {showExplanation
                          ? "Hide Commentary"
                          : "Read Commentary"}
                      </span>
                      <IoChevronDown
                        className={`w-4 h-4 text-amber-300/60 group-hover:text-amber-300/80 transition-all duration-300 ${showExplanation ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {showExplanation && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div
                            className="mt-4 p-5 sm:p-7 rounded-2xl border border-amber-400/[0.20]"
                            style={{
                              background:
                                "linear-gradient(145deg, rgba(251,191,36,0.08) 0%, rgba(245,158,11,0.05) 50%, rgba(217,119,6,0.03) 100%)",
                              boxShadow:
                                "0 6px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(251,191,36,0.08)",
                            }}
                          >
                            {/* Commentary header */}
                            <div className="flex items-center gap-2.5 mb-5">
                              <div className="h-0.5 w-3 bg-amber-400/40 rounded-full" />
                              <span className="text-[10px] tracking-[0.24em] uppercase text-amber-200/80 font-bold">
                                Commentary
                              </span>
                              <div className="h-px flex-1 bg-gradient-to-r from-amber-400/30 to-transparent" />
                            </div>

                            {/* Commentary paragraphs - left aligned */}
                            <div className="text-white/80 text-[0.95rem] sm:text-[1.02rem] font-serif leading-[1.9] sm:leading-[2] space-y-4 max-w-[600px] text-left">
                              {verseData.explanation
                                .split("\n")
                                .filter(Boolean)
                                .map((para, idx) => (
                                  <p key={idx} className="text-left">
                                    {para}
                                  </p>
                                ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* ── MARK AS READ ──
                    Pill-shaped action button with emerald completion state.
                    Gentle hover lift via whileHover for tactile feel. */}
                <div className="flex justify-center pb-5 sm:pb-6 pt-1">
                  {completed ? (
                    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 shadow-lg shadow-emerald-500/20">
                      <div className="w-5 h-5 rounded-full bg-emerald-400/80 flex items-center justify-center">
                        <IoCheckmark className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-emerald-200/90 text-sm font-medium">
                        Completed
                      </span>
                    </div>
                  ) : (
                    <motion.button
                      onClick={handleMarkComplete}
                      className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.08] border border-white/[0.15] hover:bg-emerald-500/[0.15] hover:border-emerald-400/30 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 cursor-pointer"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="w-5 h-5 rounded-full border border-white/15 group-hover:border-emerald-400/50 flex items-center justify-center group-hover:bg-emerald-400/10 transition-all duration-300">
                        <IoCheckmark className="w-3.5 h-3.5 text-white/25 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <span className="text-white/70 text-sm font-medium group-hover:text-emerald-200/90 transition-colors">
                        Mark as Read
                      </span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.article>
          </AnimatePresence>

          {/* ═══ NAVIGATION BAR ═══
              Premium navigation with rounded glass buttons.
              Clear visual hierarchy with progress tracking.
              Smooth hover states and micro-interactions.
              Fixed positioning for mobile visibility. */}
          <motion.nav
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.35 }}
            className="flex items-center justify-between mt-6 sm:mt-7 px-2 mb-6 sm:mb-8"
            aria-label="Verse navigation"
          >
            {/* Previous button - rounded premium style */}
            <button
              onClick={goPrev}
              disabled={currentVerse === 1}
              className={`group flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full transition-all duration-200 font-medium ${
                currentVerse === 1
                  ? "text-white/25 cursor-not-allowed bg-white/[0.03] border border-white/[0.08]"
                  : "text-white/75 hover:text-amber-200 bg-white/[0.08] border border-white/[0.15] hover:bg-white/[0.12] hover:border-amber-400/[0.25] hover:shadow-lg hover:shadow-purple-500/15 cursor-pointer active:scale-95"
              }`}
            >
              <IoArrowBack
                className={`w-4 h-4 sm:w-[18px] sm:h-[18px] transition-transform duration-200 ${
                  currentVerse > 1 ? "group-hover:-translate-x-1" : ""
                }`}
              />
              <span className="text-sm sm:inline tracking-wide">Previous</span>
            </button>

            {/* Progress indicator — elegant center display */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                <span className="text-amber-200/85 font-bold tabular-nums text-base sm:text-lg">
                  {cumulativeVerse}
                </span>
                <span className="text-white/35 font-light">/</span>
                <span className="text-white/55 font-medium">
                  {TOTAL_GITA_VERSES}
                </span>
              </div>
              {/* Enhanced progress bar with glow */}
              <div className="w-28 sm:w-36 h-1 bg-white/[0.12] rounded-full overflow-hidden shadow-inner border border-white/[0.08]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(cumulativeVerse / TOTAL_GITA_VERSES) * 100}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    boxShadow: "0 0 8px rgba(251, 191, 36, 0.4)",
                  }}
                />
              </div>
            </div>

            {/* Next button - rounded premium style */}
            <button
              onClick={goNext}
              disabled={currentVerse >= totalVerses}
              className={`group flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full transition-all duration-200 font-medium ${
                currentVerse >= totalVerses
                  ? "text-white/25 cursor-not-allowed bg-white/[0.03] border border-white/[0.08]"
                  : "text-white/75 hover:text-amber-200 bg-white/[0.08] border border-white/[0.15] hover:bg-white/[0.12] hover:border-amber-400/[0.25] hover:shadow-lg hover:shadow-purple-500/15 cursor-pointer active:scale-95"
              }`}
            >
              <span className="text-sm sm:inline tracking-wide">Next</span>
              <IoArrowForward
                className={`w-4 h-4 sm:w-[18px] sm:h-[18px] transition-transform duration-200 ${
                  currentVerse < totalVerses ? "group-hover:translate-x-1" : ""
                }`}
              />
            </button>
          </motion.nav>
        </div>
      </main>

      {/* ═══ BOOK MODE MODAL ═══ */}
      <AnimatePresence>
        {bookModeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BookMode
              chapter={chapter}
              onClose={() => setBookModeOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { CHAPTER_META, TOTAL_GITA_VERSES };
export default GitaReader;
