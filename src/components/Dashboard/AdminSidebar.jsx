import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChartBar,
  FaBox,
  FaCalendarAlt,
  FaUsers,
  FaBook,
  FaClipboardList,
  FaHome,
} from "react-icons/fa";
import { GiBookCover } from "react-icons/gi";

export default function AdminSidebar({ isOpen, onToggle }) {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaChartBar /> },
    { name: "Products", path: "/admin/products", icon: <FaBox /> },
    { name: "Events", path: "/admin/events", icon: <FaCalendarAlt /> },
    { name: "Users", path: "/admin/users", icon: <FaUsers /> },
    { name: "Blogs", path: "/admin/blogs", icon: <GiBookCover /> },
    { name: "Orders", path: "/admin/orders", icon: <FaClipboardList /> },
    { name: "Gita Manager", path: "/admin/gita", icon: <FaBook /> },
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-6 left-4 z-50 p-3 rounded-xl bg-gradient-to-r from-[#0f1f2e] to-[#1a2f3e] text-white shadow-lg hover:shadow-xl transition-all duration-300 border border-[#01abfd]/30"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-5  flex-col justify-between">
          <span
            className={`w-6 h-0.5 bg-[#01abfd] block transition-all duration-300 origin-left ${
              isOpen ? "rotate-45 translate-x-px" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-[#01abfd] block transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-[#01abfd] block transition-all duration-300 origin-left ${
              isOpen ? "-rotate-45 translate-x-px" : ""
            }`}
          />
        </div>
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-72 h-full bg-gradient-to-b from-[#0f1f2e] via-[#0d1a26] to-[#0a1520] text-white p-6 shadow-2xl z-40 flex flex-col border-r border-[#01abfd]/10 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          navItems={navItems}
          location={location}
          onToggle={onToggle}
          isMobile
        />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 bg-gradient-to-b from-[#0f1f2e] via-[#0d1a26] to-[#0a1520] text-white p-6 fixed z-30 h-screen shadow-2xl border-r border-[#01abfd]/10">
        <SidebarContent navItems={navItems} location={location} />
      </div>
    </>
  );
}

function SidebarContent({ navItems, location, onToggle, isMobile = false }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#01abfd]/30 to-transparent mb-6" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto mt-24">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={() => isMobile && onToggle?.()}
                className={`flex items-center p-3 rounded-xl transition-all duration-300 group ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-[#01abfd] to-[#0189d1] text-white font-semibold shadow-lg shadow-[#01abfd]/25"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  className={`mr-3 text-xl transition-transform duration-300 ${
                    location.pathname === item.path
                      ? "scale-110"
                      : "group-hover:scale-110"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
                {location.pathname === item.path && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-white" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#01abfd]/30 to-transparent my-6" />

      {/* Back to Site */}
      <div className="mt-auto">
        <Link
          to="/"
          className="flex items-center p-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-300 group"
        >
          <span className="mr-3 text-xl group-hover:scale-110 transition-transform duration-300">
            <FaHome />
          </span>
          <span className="font-medium">Back to Site</span>
        </Link>
      </div>
    </div>
  );
}
