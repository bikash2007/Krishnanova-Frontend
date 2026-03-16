import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  forwardRef,
} from "react";
import { createPortal } from "react-dom";
import HTMLFlipBook from "react-pageflip";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoArrowBack,
  IoArrowForward,
  IoBookmark,
  IoBookmarkOutline,
  IoClose,
  IoChevronDown,
} from "react-icons/io5";

// ── Chapter meta (shared with GitaReader) ──
const CHAPTER_META = [
  {
    ch: 1,
    title: "Arjuna Vishada Yoga",
    subtitle: "The Yoga of Arjuna's Dejection",
    verses: 47,
  },
  {
    ch: 2,
    title: "Sankhya Yoga",
    subtitle: "The Yoga of Knowledge",
    verses: 72,
  },
  { ch: 3, title: "Karma Yoga", subtitle: "The Yoga of Action", verses: 43 },
  {
    ch: 4,
    title: "Jnana Karma Sanyasa Yoga",
    subtitle: "The Yoga of Wisdom and Renunciation",
    verses: 42,
  },
  {
    ch: 5,
    title: "Karma Sanyasa Yoga",
    subtitle: "The Yoga of Renunciation of Action",
    verses: 29,
  },
  {
    ch: 6,
    title: "Dhyana Yoga",
    subtitle: "The Yoga of Meditation",
    verses: 47,
  },
  {
    ch: 7,
    title: "Jnana Vijnana Yoga",
    subtitle: "The Yoga of Knowledge and Wisdom",
    verses: 30,
  },
  {
    ch: 8,
    title: "Aksara Brahma Yoga",
    subtitle: "The Yoga of the Imperishable Brahman",
    verses: 28,
  },
  {
    ch: 9,
    title: "Raja Vidya Raja Guhya Yoga",
    subtitle: "The Yoga of Royal Knowledge",
    verses: 34,
  },
  {
    ch: 10,
    title: "Vibhuti Yoga",
    subtitle: "The Yoga of Divine Glories",
    verses: 42,
  },
  {
    ch: 11,
    title: "Visvarupa Darsana Yoga",
    subtitle: "The Yoga of the Universal Form",
    verses: 55,
  },
  {
    ch: 12,
    title: "Bhakti Yoga",
    subtitle: "The Yoga of Devotion",
    verses: 20,
  },
  {
    ch: 13,
    title: "Ksetra Ksetrajna Vibhaga Yoga",
    subtitle: "The Yoga of the Field and Knower",
    verses: 35,
  },
  {
    ch: 14,
    title: "Gunatraya Vibhaga Yoga",
    subtitle: "The Yoga of the Three Modes",
    verses: 27,
  },
  {
    ch: 15,
    title: "Purusottama Yoga",
    subtitle: "The Yoga of the Supreme Person",
    verses: 20,
  },
  {
    ch: 16,
    title: "Daivasura Sampad Vibhaga Yoga",
    subtitle: "The Yoga of Divine and Demonic Natures",
    verses: 24,
  },
  {
    ch: 17,
    title: "Sraddhatraya Vibhaga Yoga",
    subtitle: "The Yoga of the Three Divisions of Faith",
    verses: 28,
  },
  {
    ch: 18,
    title: "Moksa Sanyasa Yoga",
    subtitle: "The Yoga of Liberation through Renunciation",
    verses: 78,
  },
];

const getChapterInfo = (ch) => CHAPTER_META.find((c) => c.ch === ch) || {};

// ── Individual page component (must be forwardRef for react-pageflip) ──
const BookPage = forwardRef(({ children, pageNumber, className = "" }, ref) => (
  <div ref={ref} className={`book-page ${className}`}>
    {children}
    {pageNumber != null && <div className="book-page-number">{pageNumber}</div>}
  </div>
));
BookPage.displayName = "BookPage";

// ══════════════════════════════════════════
//  BOOK MODE — Fullscreen Flipbook Reader
// ══════════════════════════════════════════
const BookMode = ({ chapter, onClose }) => {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [chapterDropdownOpen, setChapterDropdownOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(chapter);
  const [verseInput, setVerseInput] = useState("1");
  const [isVerseEditing, setIsVerseEditing] = useState(false);
  const flipBookRef = useRef(null);
  const chapterDropRef = useRef(null);

  // ── Responsive detection ──
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Close dropdown on outside click ──
  useEffect(() => {
    const handler = (e) => {
      if (
        chapterDropRef.current &&
        !chapterDropRef.current.contains(e.target)
      ) {
        setChapterDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler, { passive: true });
    document.addEventListener("pointerdown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
      document.removeEventListener("pointerdown", handler);
    };
  }, []);

  // ── Fetch all verses for chapter ──
  const fetchChapterVerses = useCallback(async (ch) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/krishna/gita/${ch}/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await res.json();
      if (data.verses && data.verses.length > 0) {
        setVerses(data.verses);
      } else {
        // Fallback: generate placeholder verses
        const chInfo = getChapterInfo(ch);
        const placeholders = Array.from(
          { length: chInfo.verses || 20 },
          (_, i) => ({
            chapter: ch,
            verse_number: i + 1,
            sanskrit:
              "धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः ।\nमामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ॥",
            transliteration: "dharma-kṣetre kuru-kṣetre samavetā yuyutsavaḥ",
            translation:
              "This verse is being prepared for the sacred digital manuscript. Please check back soon.",
            explanation: "",
          }),
        );
        setVerses(placeholders);
      }
    } catch (err) {
      console.error("[BookMode] Fetch error:", err);
      setError("Failed to load chapter verses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChapterVerses(activeChapter);
  }, [activeChapter, fetchChapterVerses]);

  // ── Build pages ──
  // Title page + one page per verse + closing page
  const pages = useMemo(() => {
    if (!verses.length) return [];
    const chInfo = getChapterInfo(activeChapter);
    const result = [];

    // Title page
    result.push({ type: "title", chInfo, chapter: activeChapter });

    // Verse pages
    verses.forEach((v) => {
      result.push({ type: "verse", verse: v });
    });

    // Closing page
    result.push({
      type: "closing",
      chInfo,
      chapter: activeChapter,
      total: verses.length,
    });

    return result;
  }, [verses, activeChapter]);

  useEffect(() => {
    setTotalPages(pages.length);
  }, [pages]);

  const totalVerses = verses.length;

  // Keep verse input in sync with the currently visible verse page
  useEffect(() => {
    if (isVerseEditing) return;
    if (!totalVerses) {
      setVerseInput("1");
      return;
    }
    if (currentPage <= 0) {
      setVerseInput("1");
      return;
    }
    if (currentPage >= totalVerses + 1) {
      setVerseInput(String(totalVerses));
      return;
    }
    setVerseInput(String(currentPage));
  }, [currentPage, totalVerses, isVerseEditing]);

  // ── Page flip handler ──
  const onFlip = useCallback((e) => {
    setCurrentPage(e.data);
  }, []);

  // ── Keyboard navigation ──
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        flipBookRef.current?.pageFlip()?.flipNext();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        flipBookRef.current?.pageFlip()?.flipPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // ── Prevent body scroll when book mode is open ──
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ── Switch chapter ──
  const switchChapter = useCallback((newCh) => {
    setActiveChapter(newCh);
    setChapterDropdownOpen(false);
    setCurrentPage(0);
    setVerseInput("1");
    // Reset flipbook to first page
    setTimeout(() => {
      flipBookRef.current?.pageFlip()?.turnToPage(0);
    }, 300);
  }, []);

  const jumpToVerse = useCallback(
    (targetVerse) => {
      if (!totalVerses) return;
      const clamped = Math.max(1, Math.min(totalVerses, targetVerse));
      // Page index: 0 = title, 1..N = verse pages, N+1 = closing
      flipBookRef.current?.pageFlip()?.turnToPage(clamped);
    },
    [totalVerses],
  );

  const handleVerseInputCommit = useCallback(() => {
    if (!totalVerses) return;
    const value = parseInt(String(verseInput).trim(), 10);
    if (!Number.isFinite(value)) {
      setVerseInput("1");
      return;
    }
    const clamped = Math.max(1, Math.min(totalVerses, value));
    setVerseInput(String(clamped));
  }, [verseInput, totalVerses]);

  const handleVerseInputSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!totalVerses) return;
      const value = parseInt(String(verseInput).trim(), 10);
      if (!Number.isFinite(value)) return;
      jumpToVerse(value);
    },
    [verseInput, totalVerses, jumpToVerse],
  );

  // ── Flipbook dimensions ──
  const bookDimensions = useMemo(() => {
    if (isMobile) {
      const w = Math.min(window.innerWidth - 24, 420);
      const h = Math.min(window.innerHeight - 140, w * 1.45);
      return { width: w, height: h };
    }
    const maxH = window.innerHeight - 160;
    const h = Math.min(maxH, 650);
    const w = Math.min(h * 0.72, 480);
    return { width: w, height: h };
  }, [isMobile]);

  const renderOverlay = useCallback(
    (node) => createPortal(node, document.body),
    [],
  );

  // ── Loading state ──
  if (loading) {
    return renderOverlay(
      <div
        className="book-mode-overlay safari-viewport-fix"
        style={{ zIndex: 20000 }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-14 h-14 border-2 border-amber-800/40 border-t-amber-500 rounded-full mx-auto mb-5"
            />
            <p className="book-mode-loading-text font-serif italic text-base">
              Opening the sacred scripture…
            </p>
          </div>
        </div>
      </div>,
    );
  }

  if (error) {
    return renderOverlay(
      <div
        className="book-mode-overlay safari-viewport-fix"
        style={{ zIndex: 20000 }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center px-6">
            <p className="gita-heading-text text-xl font-serif mb-4">{error}</p>
            <button
              onClick={onClose}
              className="gita-wood-btn px-6 py-2.5 text-sm"
            >
              Return
            </button>
          </div>
        </div>
      </div>,
    );
  }

  return renderOverlay(
    <div
      className="book-mode-overlay safari-viewport-fix"
      style={{ zIndex: 20000 }}
    >
      {/* ═══ Top bar ═══ */}
      <header
        className="book-mode-header"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 max-w-[1200px] mx-auto">
          {/* Left: Back + Chapter dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="gita-icon-btn px-3 py-2 inline-flex items-center gap-2"
              title="Close book mode"
            >
              <IoClose className="w-5 h-5" />
              <span className="font-serif font-semibold">Exit</span>
            </button>

            {/* Chapter dropdown */}
            <div className="relative" ref={chapterDropRef}>
              <button
                onClick={() => setChapterDropdownOpen((v) => !v)}
                className="gita-chapter-select flex items-center gap-2 px-3 py-1.5 text-sm"
              >
                <span className="font-serif font-bold whitespace-nowrap">
                  Ch. {activeChapter}:{" "}
                  {getChapterInfo(activeChapter).title?.slice(0, 20)}
                  {(getChapterInfo(activeChapter).title?.length || 0) > 20
                    ? "…"
                    : ""}
                </span>
                <IoChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${chapterDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {chapterDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 w-72 gita-dropdown-panel rounded-xl shadow-2xl max-h-72 overflow-y-auto gita-scroll z-50"
                  >
                    {CHAPTER_META.map((c) => (
                      <button
                        key={c.ch}
                        onClick={() => switchChapter(c.ch)}
                        className={`w-full text-left px-4 py-2 flex items-center gap-3 transition-all font-serif text-sm border-b gita-dropdown-item ${
                          c.ch === activeChapter ? "gita-dropdown-active" : ""
                        }`}
                      >
                        <span className="w-6 h-6 rounded-full gita-chapter-num flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {c.ch}
                        </span>
                        <span className="truncate font-semibold">
                          {c.title}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Center: Page indicator */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="book-mode-page-indicator font-serif text-sm font-semibold tabular-nums">
              Page {currentPage + 1} of {totalPages}
            </span>
            <form
              onSubmit={handleVerseInputSubmit}
              className="flex items-center gap-1.5"
            >
              <span className="book-mode-page-indicator font-serif text-xs font-semibold">
                Verse
              </span>
              <input
                type="number"
                min={1}
                max={Math.max(1, totalVerses)}
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
                className="gita-icon-btn p-2"
                title="Go to verse"
              >
                <IoArrowForward className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right: Theme toggle */}
          <div className="flex items-center gap-2">
            <span className="book-mode-page-indicator font-serif text-xs font-semibold tabular-nums sm:hidden">
              {currentPage + 1}/{totalPages}
            </span>
            <form
              onSubmit={handleVerseInputSubmit}
              className="flex items-center gap-1 sm:hidden"
            >
              <input
                type="number"
                min={1}
                max={Math.max(1, totalVerses)}
                value={verseInput}
                onChange={(e) => setVerseInput(e.target.value)}
                inputMode="numeric"
                onFocus={() => setIsVerseEditing(true)}
                onBlur={() => {
                  setIsVerseEditing(false);
                  handleVerseInputCommit();
                }}
                className="gita-verse-input w-14 text-center text-sm font-semibold py-1.5 px-1"
                aria-label="Verse"
              />
              <button type="submit" className="gita-icon-btn p-2" title="Go">
                <IoArrowForward className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ═══ Flipbook area ═══ */}
      <main className="book-mode-content">
        <div className="book-mode-book-wrapper">
          {/* Book spine shadow (desktop only) */}
          {!isMobile && <div className="book-spine-shadow" />}

          <HTMLFlipBook
            ref={flipBookRef}
            width={bookDimensions.width}
            height={bookDimensions.height}
            size={isMobile ? "fixed" : "fixed"}
            minWidth={280}
            maxWidth={520}
            minHeight={400}
            maxHeight={720}
            showCover={true}
            mobileScrollSupport={false}
            onFlip={onFlip}
            className="book-mode-flipbook"
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={600}
            usePortrait={isMobile}
            startZIndex={0}
            autoSize={false}
            maxShadowOpacity={isMobile ? 0.3 : 0.5}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {pages.map((page, idx) => {
              if (page.type === "title") {
                return (
                  <BookPage
                    key={`title-${activeChapter}`}
                    className="book-page-title"
                  >
                    <div className="book-page-inner book-title-inner">
                      {/* Decorative top border */}
                      <div className="book-ornament-top">
                        ✦ ─────── ❖ ─────── ✦
                      </div>

                      <div className="book-title-om">ॐ</div>

                      <h2 className="book-chapter-number">
                        Chapter {page.chapter}
                      </h2>

                      <h1 className="book-chapter-title">
                        {page.chInfo.title}
                      </h1>

                      <p className="book-chapter-subtitle">
                        {page.chInfo.subtitle}
                      </p>

                      <div className="book-title-divider">
                        <div className="book-title-divider-line" />
                        <span className="book-title-divider-symbol">☸</span>
                        <div className="book-title-divider-line" />
                      </div>

                      <p className="book-verse-count">
                        {page.chInfo.verses} Sacred Verses
                      </p>

                      <div className="book-title-lotus">❁</div>

                      {/* Decorative bottom border */}
                      <div className="book-ornament-bottom">
                        ✦ ─────── ❖ ─────── ✦
                      </div>
                    </div>
                  </BookPage>
                );
              }

              if (page.type === "verse") {
                const v = page.verse;
                return (
                  <BookPage
                    key={`v-${v.chapter}-${v.verse_number}`}
                    pageNumber={idx}
                    className="book-page-verse"
                  >
                    <div className="book-page-inner">
                      {/* Verse header */}
                      <div className="book-verse-header">
                        <span className="book-verse-label">
                          Verse {v.verse_number}
                        </span>
                      </div>

                      {/* Sanskrit */}
                      <div className="book-sanskrit-block">
                        {v.sanskrit?.split("\n").map((line, i) => (
                          <p key={i} className="book-sanskrit-line">
                            {line}
                          </p>
                        ))}
                      </div>

                      {/* Transliteration */}
                      {v.transliteration && (
                        <p className="book-transliteration">
                          {v.transliteration}
                        </p>
                      )}

                      {/* Divider */}
                      <div className="book-verse-divider">
                        <div className="book-verse-divider-line" />
                        <span className="book-verse-divider-om">ॐ</span>
                        <div className="book-verse-divider-line" />
                      </div>

                      {/* Translation */}
                      <div className="book-translation-block">
                        <p className="book-translation-text">{v.translation}</p>
                      </div>

                      {/* Commentary hint (if available) */}
                      {v.explanation && (
                        <div className="book-commentary-hint">
                          <p className="book-commentary-text">
                            {v.explanation.length > 200
                              ? v.explanation.slice(0, 200) + "…"
                              : v.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </BookPage>
                );
              }

              if (page.type === "closing") {
                return (
                  <BookPage
                    key={`closing-${activeChapter}`}
                    className="book-page-closing"
                  >
                    <div className="book-page-inner book-closing-inner">
                      <div className="book-ornament-top">
                        ✦ ─────── ❖ ─────── ✦
                      </div>

                      <div className="book-closing-om">ॐ</div>

                      <h2 className="book-closing-title">
                        End of Chapter {page.chapter}
                      </h2>

                      <p className="book-closing-subtitle">
                        {page.chInfo.title}
                      </p>

                      <div className="book-title-divider">
                        <div className="book-title-divider-line" />
                        <span className="book-title-divider-symbol">☸</span>
                        <div className="book-title-divider-line" />
                      </div>

                      <p className="book-closing-stats">
                        {page.total} verses completed
                      </p>

                      <p className="book-closing-blessing">
                        iti śrīmadbhagavadgītāsūpaniṣatsu brahmavidyāyāṃ
                        yogaśāstre
                        <br />
                        śrīkṛṣṇārjunasaṃvāde
                        <br />
                        <em>{page.chInfo.title}</em>
                        <br />
                        nāma {getOrdinalSanskrit(page.chapter)}o'dhyāyaḥ
                      </p>

                      <div className="book-title-lotus">❁</div>

                      <div className="book-ornament-bottom">
                        ✦ ─────── ❖ ─────── ✦
                      </div>
                    </div>
                  </BookPage>
                );
              }

              return null;
            })}
          </HTMLFlipBook>
        </div>
      </main>

      {/* ═══ Bottom navigation ═══ */}
      <footer className="book-mode-footer safe-area-bottom">
        <div className="flex items-center justify-between px-4 sm:px-8 py-2.5 max-w-[1200px] mx-auto">
          <button
            onClick={() => flipBookRef.current?.pageFlip()?.flipPrev()}
            disabled={currentPage === 0}
            className={`gita-wood-btn-nav flex items-center gap-1.5 px-4 py-2 text-sm font-serif font-bold ${
              currentPage === 0 ? "opacity-30 cursor-not-allowed" : ""
            }`}
          >
            <IoArrowBack className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Progress bar */}
          <div className="flex-1 max-w-[200px] sm:max-w-[300px] mx-4">
            <div className="book-progress-track">
              <div
                className="book-progress-fill"
                style={{
                  width: `${totalPages > 1 ? (currentPage / (totalPages - 1)) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <button
            onClick={() => flipBookRef.current?.pageFlip()?.flipNext()}
            disabled={currentPage >= totalPages - 1}
            className={`gita-wood-btn-nav flex items-center gap-1.5 px-4 py-2 text-sm font-serif font-bold ${
              currentPage >= totalPages - 1
                ? "opacity-30 cursor-not-allowed"
                : ""
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <IoArrowForward className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>,
  );
};

// Helper: ordinal suffix for closing page colophon
function getOrdinalSanskrit(n) {
  const ordinals = [
    "",
    "prathama",
    "dvitīya",
    "tṛtīya",
    "caturtha",
    "pañcama",
    "ṣaṣṭha",
    "saptama",
    "aṣṭama",
    "navama",
    "daśama",
    "ekādaśa",
    "dvādaśa",
    "trayodaśa",
    "caturdaśa",
    "pañcadaśa",
    "ṣoḍaśa",
    "saptadaśa",
    "aṣṭādaśa",
  ];
  return ordinals[n] || String(n);
}

export default BookMode;
