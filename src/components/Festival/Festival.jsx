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

  const baseUrl = useApi();
  const calendarRef = useRef(null);

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
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        // Mock data for demonstration
        setEvents([
          {
            id: 1,
            name: "Krishna Janmashtami",
            date: "2024-08-26",
            description: "Birth celebration of Lord Krishna",
          },
          {
            id: 2,
            name: "Radha Ashtami",
            date: "2024-09-11",
            description: "Birth celebration of Radha Rani",
          },
          {
            id: 3,
            name: "Govardhan Puja",
            date: "2024-11-02",
            description: "Celebrating Krishna lifting Govardhan Hill",
          },
        ]);
      }
    };
    fetchEvents();
  }, [baseUrl]);

  useEffect(() => {
    const futureEvents = events
      .map((e) => ({ ...e, dateObj: parseISO(e.date) }))
      .filter((e) => e.dateObj > new Date())
      .sort((a, b) => a.dateObj - b.dateObj);

    if (futureEvents.length) {
      setClosestEvent(futureEvents[0]);
      updateCountdown(futureEvents[0].dateObj);

      const interval = setInterval(() => {
        updateCountdown(futureEvents[0].dateObj);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [events]);

  const updateCountdown = (targetDate) => {
    const diff = differenceInSeconds(targetDate, new Date());
    if (diff <= 0) {
      setCountdown("🎉 Happening Now!");
      confetti({
        colors: ["#fbbf24", "#f59e0b", "#f97316", "#fb923c"],
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
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
      <div
        key="header"
        className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-3"
      >
        {weekDays.map((dayName, index) => (
          <div
            key={dayName}
            className="flex items-center justify-center h-8 sm:h-10 text-xs font-semibold rounded-lg backdrop-blur-md bg-white/10 border border-amber-400/20 text-amber-300"
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
          isSameDay(parseISO(e.date), currentDate)
        );
        const isClosest =
          closestEvent && isSameDay(currentDate, parseISO(closestEvent.date));

        let dayClasses =
          "flex items-center justify-center h-10 sm:h-12 md:h-14 cursor-pointer text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-300 relative overflow-hidden border backdrop-blur-md";
        let dayStyle = {};

        if (!isCurrentMonth) {
          dayClasses += " bg-white/5 border-white/10 text-blue-100/30";
        } else if (isToday) {
          dayClasses +=
            " bg-gradient-to-br from-amber-400 to-orange-500 text-indigo-900 border-amber-400 shadow-lg shadow-amber-500/30 font-bold";
        } else if (eventForDay) {
          dayClasses +=
            " bg-gradient-to-br from-cyan-400/20 to-blue-400/20 text-cyan-300 border-cyan-400/30 hover:scale-105 hover:shadow-lg hover:border-cyan-400/50";
        } else if (isClosest) {
          dayClasses +=
            " bg-gradient-to-br from-purple-400/20 to-indigo-400/20 text-purple-300 border-purple-400/30 animate-pulse shadow-lg";
        } else {
          dayClasses +=
            " bg-white/10 border-white/20 text-blue-100 hover:bg-white/20 hover:scale-105 hover:border-amber-400/30";
        }

        days.push(
          <motion.div
            key={currentDate.toString()}
            whileHover={{ scale: isCurrentMonth ? 1.05 : 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => eventForDay && setModalEvent(eventForDay)}
            className={dayClasses}
            style={dayStyle}
          >
            {eventForDay && (
              <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
            <span>{currentDate.getDate()}</span>
          </motion.div>
        );
        day = addDays(day, 1);
      }

      weeks.push(
        <div key={w} className="grid grid-cols-7 gap-1 sm:gap-2">
          {days}
        </div>
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
              left: `${(i * 20) + 10}%`,
              top: `${(i * 18) + 5}%`,
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

        {/* Main Calendar Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-purple-400/20 to-amber-400/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition duration-1000" />

            <div
              ref={calendarRef}
              onMouseMove={handleMouseMove}
              className="relative backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 shadow-2xl p-4 md:p-8"
            >
              {/* Next Event Countdown */}
              {closestEvent && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="backdrop-blur-md bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-2xl p-6 border border-amber-400/30">
                    <h2 className="text-2xl font-bold text-amber-300 mb-2">
                      🎉 Next Sacred Event: {closestEvent.name}
                    </h2>
                    <p className="text-blue-100/80 mb-4">
                      {closestEvent.description} —{" "}
                      {format(parseISO(closestEvent.date), "MMMM do, yyyy")}
                    </p>
                    <motion.div
                      className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {countdown}
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Calendar Navigation */}
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => changeMonth(-1)}
                  className="px-4 hidden md:inline-block py-2 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400/30 text-amber-200 font-semibold hover:from-amber-400/30 hover:to-orange-500/30 transition-all duration-300"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => changeMonth(-1)}
                  className="px-4 md:hidden py-2 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400/30 text-amber-200 font-semibold hover:from-amber-400/30 hover:to-orange-500/30 transition-all duration-300"
                >
                  ←
                </button>

                <h3 className="text-2xl font-bold text-amber-300">
                  {format(viewMonth, "MMMM yyyy")}
                </h3>

                <button
                  onClick={() => changeMonth(1)}
                  className="px-4 py-2 hidden md:inline-block rounded-full bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400/30 text-amber-200 font-semibold hover:from-amber-400/30 hover:to-orange-500/30 transition-all duration-300"
                >
                  Next →
                </button>
                <button
                  onClick={() => changeMonth(1)}
                  className="px-4 md:hidden py-2 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400/30 text-amber-200 font-semibold hover:from-amber-400/30 hover:to-orange-500/30 transition-all duration-300"
                >
                  →
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-2">{renderCalendar()}</div>

              {/* Events List */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-amber-300 mb-4">
                  Upcoming Sacred Events
                </h3>
                <div className="space-y-3">
                  {events.length === 0 ? (
                    <div className="text-center py-8 backdrop-blur-md bg-white/5 rounded-xl border border-white/20">
                      <div className="text-4xl mb-2">🕉️</div>
                      <p className="text-blue-100/60">
                        No events scheduled yet. Stay tuned for divine
                        celebrations!
                      </p>
                    </div>
                  ) : (
                    events.map((event, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        onClick={() => setModalEvent(event)}
                        className="p-4 backdrop-blur-md bg-white/10 rounded-xl border border-white/20 hover:border-amber-400/30 cursor-pointer transition-all duration-300"
                      >
                        <h4 className="text-lg font-semibold text-amber-300">
                          {event.name}
                        </h4>
                        <p className="text-sm text-blue-100/70 mt-1">
                          {event.description} —{" "}
                          {format(parseISO(event.date), "MMMM do, yyyy")}
                        </p>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

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

      {/* Event Modal */}
      <AnimatePresence>
        {modalEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-6"
            onClick={() => setModalEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-3xl p-8 max-w-md w-full border-2 border-amber-400/50 shadow-2xl"
            >
              <h2 className="text-3xl font-bold text-amber-300 mb-4">
                {modalEvent.name}
              </h2>
              <p className="text-blue-100/80 mb-4">{modalEvent.description}</p>
              <p className="text-cyan-300 mb-6">
                📅 {format(parseISO(modalEvent.date), "EEEE, MMMM do, yyyy")}
              </p>
              <button
                onClick={() => setModalEvent(null)}
                className="w-full px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 font-bold rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
      `}</style>
    </section>
  );
};

export default Festival;
