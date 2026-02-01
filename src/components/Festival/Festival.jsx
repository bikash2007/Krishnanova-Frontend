import React, { useEffect, useState, useRef } from "react";
import {
  parseISO,
  differenceInSeconds,
  isSameDay,
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
} from "date-fns";
import confetti from "canvas-confetti";
import { useApi } from "../../Context/baseUrl";
import { motion, AnimatePresence } from "framer-motion";

const Festival = () => {
  const [events, setEvents] = useState([]);
  const [closestEvent, setClosestEvent] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [viewMonth, setViewMonth] = useState(new Date());
  const [modalEvent, setModalEvent] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [tithiData, setTithiData] = useState({});
  const [hoveredDay, setHoveredDay] = useState(null);
  const [hoveredEvent, setHoveredEvent] = useState(null);

  const baseUrl = useApi();
  const calendarRef = useRef(null);

  // Calculate Hindu Tithi locally (no external API - faster & reliable)
  const calculateTithi = (date) => {
    // Lunar phase calculation based on known new moon
    const knownNewMoon = new Date("2024-01-11"); // Known new moon date
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysSinceNewMoon = Math.floor((date - knownNewMoon) / msPerDay);
    const lunarCycle = 29.53; // days
    const dayInCycle =
      ((daysSinceNewMoon % lunarCycle) + lunarCycle) % lunarCycle;

    // Tithi is 1/30th of lunar month
    const tithiNumber = Math.floor((dayInCycle / lunarCycle) * 30) + 1;
    const tithiNames = [
      "Pratipada",
      "Dwitiya",
      "Tritiya",
      "Chaturthi",
      "Panchami",
      "Shashthi",
      "Saptami",
      "Ashtami",
      "Navami",
      "Dashami",
      "Ekadashi",
      "Dwadashi",
      "Trayodashi",
      "Chaturdashi",
      "Purnima/Amavasya",
    ];

    const paksha = tithiNumber <= 15 ? "Shukla" : "Krishna";
    const tithiIndex = tithiNumber <= 15 ? tithiNumber - 1 : tithiNumber - 16;

    return {
      tithi: tithiNames[Math.min(tithiIndex, tithiNames.length - 1)],
      paksha: paksha,
      date: format(date, "yyyy-MM-dd"),
    };
  };

  // Calculate Tithi data for the visible month (synchronous - no API calls)
  useEffect(() => {
    const start = startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 0 });
    const end = addDays(start, 41); // 6 weeks

    const tithiMap = {};
    let currentDay = start;

    // Calculate for all days in the calendar view
    while (currentDay <= end) {
      const dateKey = format(currentDay, "yyyy-MM-dd");
      tithiMap[dateKey] = calculateTithi(currentDay);
      currentDay = addDays(currentDay, 1);
    }

    setTithiData(tithiMap);
  }, [viewMonth]);

  // SEO Implementation
  useEffect(() => {
    document.title = "Sacred Festival Calendar | Krishnova";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content =
        "Discover upcoming Krishna festivals and sacred celebrations with Krishnova's divine calendar. Never miss a holy occasion.";
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/events`);
        const data = await res.json();
        console.log("Fetched events:", data);
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      }
    };
    fetchEvents();
  }, [baseUrl]);

  useEffect(() => {
    if (!events || events.length === 0) return;

    const now = new Date();
    const allEvents = events
      .map((e) => ({ ...e, dateObj: parseISO(e.date) }))
      .sort((a, b) => a.dateObj - b.dateObj);

    // Find the closest event (past or future)
    const closestEventData = allEvents.reduce((closest, event) => {
      const timeDiff = Math.abs(event.dateObj - now);
      const closestDiff = closest ? Math.abs(closest.dateObj - now) : Infinity;
      return timeDiff < closestDiff ? event : closest;
    }, null);

    if (closestEventData) {
      setClosestEvent(closestEventData);
      updateCountdown(closestEventData.dateObj);

      const interval = setInterval(() => {
        updateCountdown(closestEventData.dateObj);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [events]);

  const updateCountdown = (targetDate) => {
    const now = new Date();
    const diff = differenceInSeconds(targetDate, now);

    if (Math.abs(diff) <= 86400) {
      // Within 24 hours
      if (diff <= 0) {
        const hoursPassed = Math.abs(Math.floor(diff / 3600));
        if (hoursPassed < 24) {
          setCountdown("🎉 Happening Today!");
          confetti({
            colors: ["#fbbf24", "#f59e0b", "#f97316", "#fb923c"],
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } else {
          setCountdown("📅 Past Event");
        }
        return;
      }
    } else if (diff < 0) {
      const daysPassed = Math.abs(Math.floor(diff / 86400));
      setCountdown(`${daysPassed} days ago`);
      return;
    }

    const d = Math.floor(diff / (60 * 60 * 24));
    const h = Math.floor((diff / (60 * 60)) % 24);
    const m = Math.floor((diff / 60) % 60);
    const s = Math.floor(diff % 60);

    setCountdown(`${d}d ${h}h ${m}m ${s}s`);
  };

  const changeMonth = (direction) => {
    setViewMonth(addMonths(viewMonth, direction));
  };

  // Mouse tracking
  const handleMouseMove = (e) => {
    if (calendarRef.current) {
      const rect = calendarRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const renderCalendar = () => {
    const start = startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 0 });
    const today = new Date();

    const weeks = [];
    let day = start;

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekDaysMobile = ["S", "M", "T", "W", "T", "F", "S"];

    const weekHeader = (
      <div key="header" className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-3">
        {weekDays.map((dayName, index) => (
          <div
            key={dayName}
            className="flex items-center justify-center h-9 sm:h-10 text-xs sm:text-sm font-semibold rounded-xl bg-white/10 text-amber-300/90"
          >
            <span className="hidden sm:inline">{dayName}</span>
            <span className="sm:hidden">{weekDaysMobile[index]}</span>
          </div>
        ))}
      </div>
    );

    weeks.push(weekHeader);

    for (let w = 0; w < 6; w++) {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const currentDate = day;
        const isCurrentMonth = currentDate.getMonth() === viewMonth.getMonth();
        const isToday = isSameDay(currentDate, today);
        const eventForDay = events.find((e) =>
          isSameDay(parseISO(e.date), currentDate),
        );
        const isClosest =
          closestEvent && isSameDay(currentDate, parseISO(closestEvent.date));
        const dateKey = format(currentDate, "yyyy-MM-dd");
        const hasTithi = tithiData[dateKey];
        const isEkadashi =
          hasTithi &&
          hasTithi.tithi &&
          hasTithi.tithi.toLowerCase().includes("ekadashi");
        const isHoveredEvent =
          hoveredEvent && isSameDay(parseISO(hoveredEvent.date), currentDate);

        let dayClasses =
          "group flex flex-col items-center justify-center min-h-[44px] h-12 sm:h-14 cursor-pointer text-sm sm:text-base font-medium rounded-xl transition-all duration-200 relative overflow-visible active:scale-95";

        if (!isCurrentMonth) {
          dayClasses += " bg-white/5 text-blue-100/25";
        } else if (isToday) {
          dayClasses +=
            " bg-gradient-to-br from-amber-400 to-orange-500 text-indigo-900 shadow-lg shadow-amber-500/40 font-bold ring-2 ring-amber-300/50";
        } else if (isHoveredEvent) {
          dayClasses +=
            " bg-gradient-to-br from-pink-400/50 to-rose-400/50 text-white scale-105 shadow-xl shadow-pink-500/30 ring-2 ring-pink-400/50";
        } else if (isEkadashi) {
          dayClasses +=
            " bg-gradient-to-br from-yellow-400/25 to-amber-500/25 text-white ring-2 ring-yellow-400/40 shadow-lg shadow-yellow-500/20";
        } else if (eventForDay) {
          dayClasses +=
            " bg-gradient-to-br from-cyan-400/25 to-blue-400/25 text-white ring-1 ring-cyan-400/40 shadow-md";
        } else if (isClosest) {
          dayClasses +=
            " bg-gradient-to-br from-purple-400/20 to-indigo-400/20 text-purple-200 ring-1 ring-purple-400/30";
        } else if (hasTithi) {
          dayClasses +=
            " bg-gradient-to-br from-orange-400/10 to-pink-400/10 text-blue-100 hover:bg-orange-400/20 active:bg-orange-400/30";
        } else {
          dayClasses +=
            " bg-white/8 text-blue-100 hover:bg-white/15 active:bg-white/20";
        }

        days.push(
          <motion.div
            key={currentDate.toString()}
            whileTap={{ scale: 0.92 }}
            onClick={() => eventForDay && setModalEvent(eventForDay)}
            onMouseEnter={() =>
              setHoveredDay({
                dateKey: dateKey,
                date: currentDate,
                tithi: hasTithi,
                event: eventForDay,
              })
            }
            onMouseLeave={() => setHoveredDay(null)}
            className={dayClasses}
          >
            {/* Ekadashi Special Indicator */}
            {isEkadashi && (
              <div className="absolute top-0.5 right-0.5 text-[10px] sm:text-xs">
                🌟
              </div>
            )}

            {/* Event Indicator - Enhanced */}
            {eventForDay && !isEkadashi && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}

            {/* Date Number */}
            <span
              className={`relative z-10 ${eventForDay || isEkadashi ? "font-bold" : ""}`}
            >
              {currentDate.getDate()}
            </span>

            {/* Tithi Indicator Dot */}
            {hasTithi && !isEkadashi && !eventForDay && (
              <div className="absolute bottom-1 w-1 h-1 rounded-full bg-orange-400/60" />
            )}
          </motion.div>,
        );
        day = addDays(day, 1);
      }

      weeks.push(
        <div key={w} className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {days}
        </div>,
      );
    }

    return weeks;
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-hidden py-6 sm:py-12 lg:py-20">
      {/* Animated Mandala Background */}
      <div
        className="absolute inset-0 opacity-10 sm:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          animation: "float 30s linear infinite",
        }}
      />

      {/* Floating Elements - Hidden on mobile for performance */}
      <div className="absolute inset-0 hidden sm:block">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${i * 20 + 10}%`,
              top: `${i * 18 + 5}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="text-2xl opacity-20">
              {["🪔", "🌺", "🦚", "✨", "🕉️"][i]}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mouse Glow Effect - Desktop only */}
      <div
        className="pointer-events-none absolute w-[600px] h-[600px] hidden lg:block"
        style={{
          background: `radial-gradient(circle at center, rgba(251, 191, 36, 0.12) 0%, transparent 50%)`,
          transform: `translate3d(${mousePosition.x - 300}px, ${
            mousePosition.y - 300
          }px, 0)`,
          transition: "transform 150ms ease-out",
          willChange: "transform",
        }}
      />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:container lg:mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-10 lg:mb-12"
        >
          {/* Sacred Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 rounded-full px-4 py-2 shadow-lg mb-4 sm:mb-6">
            <span className="text-amber-300 text-sm sm:text-base">✦</span>
            <span className="text-amber-100 font-medium tracking-wide text-xs sm:text-sm">
              Divine Festival Calendar
            </span>
            <span className="text-amber-300 text-sm sm:text-base">✦</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold mb-2 sm:mb-4">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
              Sacred Festivals
            </span>
          </h1>

          <p className="text-sm sm:text-lg lg:text-xl text-blue-100/80 max-w-2xl mx-auto px-4">
            Never miss a divine celebration with Krishnova
          </p>
        </motion.div>
        <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-8">
          {/* Calendar Section - Shows first on mobile for quick glance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-5/12 order-1 lg:order-2"
          >
            <div className="relative">
              {/* Subtle Glow */}
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-50" />

              <div
                ref={calendarRef}
                onMouseMove={handleMouseMove}
                className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/15 shadow-xl p-4 sm:p-5"
              >
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-amber-300 flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">📆</span>
                    <span>Calendar</span>
                  </h3>
                </div>

                {/* Month Navigation */}
                <div className="flex justify-between items-center mb-4 bg-white/5 rounded-xl p-2">
                  <button
                    onClick={() => changeMonth(-1)}
                    className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-amber-400/20 to-orange-500/20 text-amber-200 active:scale-95 transition-transform min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Previous month"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <h3 className="text-base sm:text-lg font-bold text-amber-200">
                    {format(viewMonth, "MMMM yyyy")}
                  </h3>

                  <button
                    onClick={() => changeMonth(1)}
                    className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-amber-400/20 to-orange-500/20 text-amber-200 active:scale-95 transition-transform min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Next month"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="space-y-1.5 sm:space-y-2">
                  {renderCalendar()}
                </div>

                {/* Hover Tooltip */}
                <AnimatePresence>
                  {hoveredDay && (hoveredDay.tithi || hoveredDay.event) && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="mt-4 p-3 sm:p-4 bg-gradient-to-br from-indigo-900/95 to-purple-900/95 border border-amber-400/40 rounded-xl shadow-xl"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base sm:text-lg">📅</span>
                        <span className="text-sm font-bold text-white">
                          {format(hoveredDay.date, "MMMM d, yyyy")}
                        </span>
                      </div>
                      {hoveredDay.event && (
                        <div className="mb-2 pb-2 border-b border-white/20">
                          <p className="text-sm font-bold text-amber-300">
                            🎊 {hoveredDay.event.name}
                          </p>
                          {hoveredDay.event.description && (
                            <p className="text-xs text-blue-100/80 mt-1">
                              {hoveredDay.event.description}
                            </p>
                          )}
                        </div>
                      )}
                      {hoveredDay.tithi && (
                        <div>
                          <p className="text-sm text-cyan-300 font-semibold">
                            🙏 {hoveredDay.tithi.tithi}
                            {hoveredDay.tithi.tithi
                              ?.toLowerCase()
                              .includes("ekadashi") && " ⚡"}
                          </p>
                          <p className="text-xs text-blue-200/80">
                            {hoveredDay.tithi.paksha} Paksha
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Legend - Compact for mobile */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex flex-wrap gap-3 sm:gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-md bg-gradient-to-br from-amber-400 to-orange-500"></div>
                      <span className="text-blue-100/70">Today</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-md bg-yellow-400/30 ring-1 ring-yellow-400/50"></div>
                      <span className="text-blue-100/70">Ekadashi</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-md bg-cyan-400/30 ring-1 ring-cyan-400/50"></div>
                      <span className="text-blue-100/70">Event</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Events Section - Full width cards below calendar on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full lg:w-7/12 order-2 lg:order-1"
          >
            <div className="relative">
              {/* Subtle Glow */}
              <div className="absolute -inset-1 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-50" />

              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-amber-400/20 shadow-xl p-4 sm:p-6">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl sm:text-2xl font-bold text-amber-300 flex items-center gap-2">
                    <span className="text-2xl">🎊</span>
                    <span>Sacred Events</span>
                  </h2>
                  <div className="px-3 py-1.5 bg-amber-500/20 rounded-full border border-amber-400/30">
                    <span className="text-amber-200 font-semibold text-xs sm:text-sm">
                      {events.length} Events
                    </span>
                  </div>
                </div>

                {/* Next Event Countdown - Featured Card */}
                {closestEvent && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5"
                  >
                    <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-xl p-4 sm:p-5 border border-amber-400/30">
                      {/* Featured Badge */}
                      <div className="inline-flex items-center gap-2 bg-amber-900/40 px-3 py-1 rounded-full mb-3">
                        <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider">
                          Featured Event
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                        {closestEvent.name}
                      </h3>
                      <p className="text-blue-100/90 text-sm sm:text-base mb-3 line-clamp-2">
                        {closestEvent.description}
                      </p>

                      <div className="flex items-center gap-2 text-cyan-300 mb-3">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm sm:text-base font-medium">
                          {format(
                            parseISO(closestEvent.date),
                            "EEEE, MMMM do, yyyy",
                          )}
                        </span>
                      </div>

                      {/* Countdown */}
                      <div className="pt-3 border-t border-white/15">
                        <p className="text-xs text-amber-200/80 mb-1.5 font-medium">
                          Time Remaining
                        </p>
                        <motion.div
                          className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent font-mono"
                          animate={{ scale: [1, 1.02, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {countdown}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* All Events List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-amber-300 flex items-center gap-2">
                      <span className="text-xl">📅</span>
                      Upcoming Celebrations
                    </h3>
                  </div>

                  <div className="space-y-3 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1 scrollbar-custom">
                    {events.length === 0 ? (
                      <div className="text-center py-8 bg-white/5 rounded-xl border border-white/10">
                        <div className="text-4xl mb-3">🕉️</div>
                        <p className="text-blue-100/60 text-sm sm:text-base">
                          No events available. Stay tuned!
                        </p>
                      </div>
                    ) : events
                        .filter((event) => {
                          const eventDate = parseISO(event.date);
                          const now = new Date();
                          return isSameDay(eventDate, now) || eventDate > now;
                        })
                        .sort((a, b) => parseISO(a.date) - parseISO(b.date))
                        .length === 0 ? (
                      <div className="text-center py-8 bg-white/5 rounded-xl border border-white/10">
                        <div className="text-4xl mb-3">🕉️</div>
                        <p className="text-blue-100/60 text-sm sm:text-base">
                          No upcoming events. Stay tuned!
                        </p>
                      </div>
                    ) : (
                      events
                        .filter((event) => {
                          const eventDate = parseISO(event.date);
                          const now = new Date();
                          return isSameDay(eventDate, now) || eventDate > now;
                        })
                        .sort((a, b) => parseISO(a.date) - parseISO(b.date))
                        .map((event, i) => {
                          const eventDate = parseISO(event.date);
                          const now = new Date();
                          const timeLeft = differenceInSeconds(eventDate, now);
                          const days = Math.floor(
                            Math.abs(timeLeft) / (3600 * 24),
                          );
                          const hours = Math.floor(
                            (Math.abs(timeLeft) % (3600 * 24)) / 3600,
                          );
                          const isToday = isSameDay(eventDate, now);

                          return (
                            <motion.div
                              key={event._id || i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                              onMouseEnter={() => setHoveredEvent(event)}
                              onMouseLeave={() => setHoveredEvent(null)}
                              className={`relative p-4 rounded-xl border transition-all duration-200 ${
                                isToday
                                  ? "bg-gradient-to-br from-green-500/15 to-emerald-500/15 border-green-400/40"
                                  : "bg-white/5 border-white/10 hover:border-amber-400/30 hover:bg-white/8"
                              }`}
                            >
                              {/* Status Badge */}
                              <div className="absolute top-3 right-3">
                                {isToday ? (
                                  <span className="px-2 py-0.5 bg-green-500/30 border border-green-400/50 rounded-full text-xs font-bold text-green-300 animate-pulse">
                                    TODAY
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-amber-500/25 border border-amber-400/40 rounded-full text-xs font-semibold text-amber-300">
                                    UPCOMING
                                  </span>
                                )}
                              </div>

                              <div className="pr-20">
                                <h4 className="text-base sm:text-lg font-bold text-amber-300 mb-1.5">
                                  {event.name}
                                </h4>
                                <p className="text-xs sm:text-sm text-blue-100/70 mb-2 line-clamp-2">
                                  {event.description}
                                </p>

                                <div className="flex flex-wrap gap-2 sm:gap-3 items-center text-xs sm:text-sm">
                                  <div className="flex items-center gap-1.5 text-cyan-300">
                                    <svg
                                      className="w-3.5 h-3.5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                    <span className="font-medium">
                                      {format(eventDate, "MMM dd, yyyy")}
                                    </span>
                                  </div>

                                  {event.location && (
                                    <div className="flex items-center gap-1.5 text-purple-300">
                                      <svg
                                        className="w-3.5 h-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                      </svg>
                                      <span>{event.location}</span>
                                    </div>
                                  )}

                                  {!isToday && (
                                    <div className="flex items-center gap-1">
                                      <span className="text-amber-400/70">
                                        In:
                                      </span>
                                      <span className="font-mono font-semibold text-amber-200 bg-amber-900/30 px-2 py-0.5 rounded-md">
                                        {days}d {hours}h
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 sm:mt-12"
        >
          <div className="flex items-center justify-center gap-2 text-amber-200/50 text-xs sm:text-sm px-4">
            <span>🪔</span>
            <span className="italic text-center">
              "Celebrate the divine with Krishnova"
            </span>
            <span>🪔</span>
          </div>
        </motion.div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(30px, 30px);
          }
        }

        .scrollbar-custom::-webkit-scrollbar {
          width: 4px;
        }

        .scrollbar-custom::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #fbbf24, #f59e0b);
          border-radius: 10px;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default Festival;
