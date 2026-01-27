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

  // Function to fetch Hindu Tithi for a given date
  const fetchTithi = async (date) => {
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const [year, month, day] = dateStr.split("-");

      // Using a free Panchang API for Hindu Tithi
      // Alternative: You can use https://api.vedicastroapi.com/ or similar services
      const response = await fetch(
        `https://panchang.api-dev.in/panchang?date=${day}&month=${month}&year=${year}&lat=28.6139&lon=77.2090&tz=5.5`,
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.tithi) {
          return {
            tithi: data.tithi.name || "N/A",
            paksha: data.paksha || "",
            date: dateStr,
          };
        }
      }
    } catch (error) {
      // Fallback: Calculate basic lunar phase
      // This is a simplified calculation
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
    }
    return null;
  };

  // Fetch Tithi data for the visible month
  useEffect(() => {
    const fetchMonthTithi = async () => {
      const start = startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 0 });
      const end = addDays(start, 41); // 6 weeks

      const tithiMap = {};
      let currentDay = start;

      // Fetch for all days in the calendar view
      while (currentDay <= end) {
        const dateKey = format(currentDay, "yyyy-MM-dd");
        const tithi = await fetchTithi(currentDay);
        if (tithi) {
          tithiMap[dateKey] = tithi;
        }
        currentDay = addDays(currentDay, 1);
      }

      setTithiData(tithiMap);
    };

    fetchMonthTithi();
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
      <div key="header" className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((dayName, index) => (
          <div
            key={dayName}
            className="flex items-center justify-center h-8 text-xs font-semibold rounded-lg backdrop-blur-md bg-white/10 border border-amber-400/20 text-amber-300"
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
          "group flex flex-col items-center justify-center h-16 cursor-pointer text-sm font-medium rounded-lg transition-all duration-300 relative overflow-visible border backdrop-blur-md";

        if (!isCurrentMonth) {
          dayClasses += " bg-white/5 border-white/10 text-blue-100/30";
        } else if (isToday) {
          dayClasses +=
            " bg-gradient-to-br from-amber-400 to-orange-500 text-indigo-900 border-amber-400 shadow-lg shadow-amber-500/30 font-bold";
        } else if (isHoveredEvent) {
          dayClasses +=
            " bg-gradient-to-br from-pink-400/40 to-rose-400/40 text-white border-pink-400/70 scale-110 shadow-2xl shadow-pink-500/40 ring-4 ring-pink-400/30 z-50";
        } else if (isEkadashi) {
          dayClasses +=
            " bg-gradient-to-br from-yellow-400/30 to-amber-500/30 text-white border-yellow-400/60 hover:scale-110 hover:shadow-2xl hover:border-yellow-300/80 shadow-xl shadow-yellow-500/30 ring-2 ring-yellow-400/20 animate-pulse";
        } else if (eventForDay) {
          dayClasses +=
            " bg-gradient-to-br from-cyan-400/30 to-blue-400/30 text-white border-cyan-400/50 hover:scale-105 hover:shadow-xl hover:border-cyan-400/70 shadow-lg shadow-cyan-500/20";
        } else if (isClosest) {
          dayClasses +=
            " bg-gradient-to-br from-purple-400/20 to-indigo-400/20 text-purple-300 border-purple-400/30 animate-pulse shadow-lg";
        } else if (hasTithi) {
          dayClasses +=
            " bg-gradient-to-br from-orange-400/15 to-pink-400/15 border-orange-400/25 text-blue-100 hover:bg-orange-400/25 hover:scale-105 hover:border-orange-400/40";
        } else {
          dayClasses +=
            " bg-white/10 border-white/20 text-blue-100 hover:bg-white/20 hover:scale-105 hover:border-amber-400/30";
        }

        days.push(
          <motion.div
            key={currentDate.toString()}
            whileHover={{
              scale: isCurrentMonth ? (isEkadashi ? 1.1 : 1.05) : 1,
            }}
            whileTap={{ scale: 0.95 }}
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
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/10 to-amber-400/10 rounded-lg" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 animate-pulse" />
                <div className="absolute top-1 right-1 text-xs">🌟</div>
              </>
            )}

            {/* Event Indicator - Enhanced */}
            {eventForDay && !isEkadashi && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 animate-pulse" />
            )}

            {/* Date Number */}
            <span
              className={`relative z-10 ${eventForDay || isEkadashi ? "font-bold text-lg" : "text-sm"}`}
            >
              {currentDate.getDate()}
            </span>

            {/* Tithi Indicator Dot */}
            {hasTithi && !isEkadashi && (
              <div className="absolute bottom-1 w-1 h-1 rounded-full bg-orange-400" />
            )}
          </motion.div>,
        );
        day = addDays(day, 1);
      }

      weeks.push(
        <div key={w} className="grid grid-cols-7 gap-1">
          {days}
        </div>,
      );
    }

    return weeks;
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-hidden py-20">
      {/* Animated Mandala Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          animation: "float 30s linear infinite",
        }}
      />

      {/* Floating Elements - optimized for performance */}
      <div className="absolute inset-0">
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

      {/* Mouse Glow Effect */}
      <div
        className="pointer-events-none absolute w-[600px] h-[600px]"
        style={{
          background: `radial-gradient(circle at center, rgba(251, 191, 36, 0.12) 0%, transparent 50%)`,
          transform: `translate3d(${mousePosition.x - 300}px, ${
            mousePosition.y - 300
          }px, 0)`,
          transition: "transform 150ms ease-out",
          willChange: "transform",
        }}
      />

      <div className="relative z-10 container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* Sacred Badge */}
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 rounded-full px-5 py-2.5 shadow-lg mb-8">
            <span className="text-amber-300 animate-pulse text-lg">✦</span>
            <span className="text-amber-100 font-medium tracking-wide text-sm">
              Divine Festival calender
            </span>
            <span className="text-amber-300 animate-pulse text-lg">✦</span>
          </div>

          <h1 className="text-3xl md::text-7xl font-bold mb-2 md:mb-4">
            <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
              Sacred Festival Calendar
            </span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto">
            Never miss a divine celebration with Krishnova
          </p>
        </motion.div>
        <div className="flex flex-wrap w-full px-4 md:px-8 gap-8 justify-center">
          {/* Main Events Container - Now First and Larger */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-[55%] order-1"
          >
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-amber-500/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition duration-1000" />

              <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 rounded-3xl border-2 border-amber-400/30 shadow-2xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent flex items-center gap-3">
                    <span className="text-3xl">🎊</span>
                    Sacred Events
                  </h2>
                  <div className="px-4 py-2 bg-amber-500/20 rounded-full border border-amber-400/40 backdrop-blur-md">
                    <span className="text-amber-200 font-semibold text-sm">
                      {events.length} Events
                    </span>
                  </div>
                </div>

                {/* Next Event Countdown - Enhanced */}
                {closestEvent && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <div className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-amber-500/25 to-orange-600/25 rounded-2xl p-6 border-2 border-amber-400/40 shadow-xl">
                      {/* Animated Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
                            backgroundSize: "20px 20px",
                            animation: "float 20s linear infinite",
                          }}
                        />
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="inline-flex items-center gap-2 bg-amber-900/30 px-3 py-1 rounded-full mb-3">
                              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                              <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider">
                                Featured Event
                              </span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                              {closestEvent.name}
                            </h3>
                            <p className="text-blue-100/90 text-base mb-3 leading-relaxed">
                              {closestEvent.description}
                            </p>
                            <div className="flex items-center gap-2 text-cyan-300">
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
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="font-medium">
                                {format(
                                  parseISO(closestEvent.date),
                                  "EEEE, MMMM do, yyyy",
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/20">
                          <p className="text-sm text-amber-200/80 mb-2 font-medium">
                            Time Remaining
                          </p>
                          <motion.div
                            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent font-mono"
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {countdown}
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* All Events List - Enhanced */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-amber-300 flex items-center gap-2">
                      <span className="text-2xl">📅</span>
                      Upcoming Celebrations
                    </h3>
                  </div>
                  <p className="text-xs text-blue-100/60 italic mb-3 flex items-center gap-2">
                    <span>💡</span>
                    Hover over events to highlight them on the calendar
                  </p>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-custom">
                    {events.length === 0 ? (
                      <div className="text-center py-12 backdrop-blur-md bg-white/5 rounded-2xl border border-white/20">
                        <div className="text-6xl mb-4">🕉️</div>
                        <p className="text-blue-100/60 text-lg">
                          No events available. Stay tuned for divine
                          celebrations!
                        </p>
                      </div>
                    ) : events
                        .filter((event) => {
                          const eventDate = parseISO(event.date);
                          const now = new Date();
                          // Only show today's events and future events
                          return isSameDay(eventDate, now) || eventDate > now;
                        })
                        .sort((a, b) => parseISO(a.date) - parseISO(b.date))
                        .length === 0 ? (
                      <div className="text-center py-12 backdrop-blur-md bg-white/5 rounded-2xl border border-white/20">
                        <div className="text-6xl mb-4">🕉️</div>
                        <p className="text-blue-100/60 text-lg">
                          No upcoming events scheduled. Stay tuned for divine
                          celebrations!
                        </p>
                      </div>
                    ) : (
                      events
                        .filter((event) => {
                          const eventDate = parseISO(event.date);
                          const now = new Date();
                          // Only show today's events and future events
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
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              whileHover={{ scale: 1.02, x: 5 }}
                              onMouseEnter={() => setHoveredEvent(event)}
                              onMouseLeave={() => setHoveredEvent(null)}
                              className={`group relative p-5 backdrop-blur-xl rounded-2xl border-2 cursor-default transition-all duration-300 ${
                                isToday
                                  ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50 shadow-lg shadow-green-500/20"
                                  : "bg-white/10 border-amber-400/30 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-500/20"
                              }`}
                            >
                              {/* Status Badge */}
                              <div className="absolute top-3 right-3">
                                {isToday ? (
                                  <span className="px-3 py-1 bg-green-500/30 border border-green-400/50 rounded-full text-xs font-bold text-green-300 animate-pulse">
                                    TODAY
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 bg-amber-500/30 border border-amber-400/50 rounded-full text-xs font-semibold text-amber-300">
                                    UPCOMING
                                  </span>
                                )}
                              </div>

                              <div className="pr-24">
                                <h4 className="text-xl font-bold text-amber-300 mb-2 group-hover:text-amber-200 transition-colors">
                                  {event.name}
                                </h4>
                                <p className="text-sm text-blue-100/80 mb-3 leading-relaxed">
                                  {event.description}
                                </p>

                                <div className="flex flex-wrap gap-3 items-center">
                                  <div className="flex items-center gap-2 text-cyan-300">
                                    <svg
                                      className="w-4 h-4"
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
                                    <span className="text-sm font-medium">
                                      {format(eventDate, "MMM dd, yyyy")}
                                    </span>
                                  </div>

                                  {event.location && (
                                    <div className="flex items-center gap-2 text-purple-300">
                                      <svg
                                        className="w-4 h-4"
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
                                      <span className="text-sm">
                                        {event.location}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {!isToday && (
                                  <div className="mt-3 pt-3 border-t border-white/10">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-amber-400/70">
                                        In:
                                      </span>
                                      <span className="text-sm font-mono font-semibold text-amber-200 bg-amber-900/20 px-3 py-1 rounded-lg">
                                        {days}d {hours}h
                                      </span>
                                    </div>
                                  </div>
                                )}
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

          {/* Compact Calendar Container - Now Smaller and Secondary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-[40%] order-2"
          >
            <div className="relative group sticky top-24">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-purple-400/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition duration-1000" />

              <div
                ref={calendarRef}
                onMouseMove={handleMouseMove}
                className="relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 shadow-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-amber-300 flex items-center gap-2">
                    <span className="text-2xl">📆</span>
                    Calendar
                  </h3>
                </div>

                {/* Calendar Navigation - Compact */}
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={() => changeMonth(-1)}
                    className="p-2 rounded-xl bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400/30 text-amber-200 font-semibold hover:from-amber-400/30 hover:to-orange-500/30 transition-all duration-300"
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

                  <h3 className="text-lg font-bold text-amber-300">
                    {format(viewMonth, "MMMM yyyy")}
                  </h3>

                  <button
                    onClick={() => changeMonth(1)}
                    className="p-2 rounded-xl bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400/30 text-amber-200 font-semibold hover:from-amber-400/30 hover:to-orange-500/30 transition-all duration-300"
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

                {/* Compact Calendar Grid */}
                <div className="space-y-2">{renderCalendar()}</div>

                {/* Floating Tooltip - Renders outside grid */}
                <AnimatePresence>
                  {hoveredDay && (hoveredDay.tithi || hoveredDay.event) && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="mt-3 p-3 bg-gradient-to-br from-indigo-900/95 to-purple-900/95 border-2 border-amber-400/60 rounded-xl shadow-2xl backdrop-blur-xl"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">📅</span>
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
                          {hoveredDay.tithi.tithi
                            ?.toLowerCase()
                            .includes("ekadashi") && (
                            <p className="text-xs text-yellow-300 mt-1 font-semibold">
                              ⚡ Fasting Day (Ekadashi)
                            </p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Calendar Legend */}
                <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                  <p className="text-xs font-semibold text-amber-300/80 mb-3">
                    Legend
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-gradient-to-br from-amber-400 to-orange-500"></div>
                      <span className="text-blue-100/70">Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-gradient-to-br from-yellow-400/30 to-amber-500/30 border-2 border-yellow-400/60 shadow-xl shadow-yellow-500/30 relative">
                        <span className="absolute -top-1 -right-1 text-[8px]">
                          🌟
                        </span>
                      </div>
                      <span className="text-blue-100/70">Ekadashi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-gradient-to-br from-cyan-400/30 to-blue-400/30 border border-cyan-400/50 shadow-lg shadow-cyan-500/20"></div>
                      <span className="text-blue-100/70">Event Day</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-gradient-to-br from-orange-400/15 to-pink-400/15 border border-orange-400/25"></div>
                      <span className="text-blue-100/70">Tithi</span>
                    </div>
                  </div>
                  <div className="pt-2 mt-2 border-t border-white/10">
                    <p className="text-xs text-blue-100/60 italic">
                      💡 Hover over any day to see Tithi details
                    </p>
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
          transition={{ delay: 1 }}
          className="text-center mt-12"
        >
          <div className="flex items-center justify-center space-x-2 text-amber-200/60 text-sm">
            <span>🪔</span>
            <span className="italic">
              "Utsavānāṃ ca sarveṣāṃ kartā bhartā prabhuḥ sākṣī" - Celebrate the
              divine with Krishnova
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

        /* Custom Scrollbar */
        .scrollbar-custom::-webkit-scrollbar {
          width: 8px;
        }

        .scrollbar-custom::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #fbbf24, #f59e0b);
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #f59e0b, #f97316);
        }
      `}</style>
    </section>
  );
};

export default Festival;
