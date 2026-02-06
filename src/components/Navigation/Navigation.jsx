import { useState, useRef, useEffect, useCallback, memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import {
  FaShoppingBag,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaShoppingCart,
} from "react-icons/fa";
import { useApi } from "../../Context/baseUrl";
import { useCart } from "../../Context/CartContext";
import logo from "../../Media/krishnovalogo.png";

// Section nav items
const sectionNavItems = [
  { id: "home", label: "Home" },
  { id: "wisdom", label: "Wisdom Portal" },
  { id: "products", label: "Products" },
  { id: "community", label: "Community" },
  { id: "festival", label: "Festivals" },
  { id: "contact", label: "Contact" },
];

// Utility function to get avatar URL
function getUserAvatarUrl(user, baseUrl) {
  if (!user?.avatar) return null;
  if (user.isGoogleUser && user.avatar.startsWith("http")) return user.avatar;
  if (user.avatar.startsWith("http")) return user.avatar;
  return baseUrl + user.avatar;
}

export default function Navigation() {
  const { cart } = useCart();
  const { user, logout, isAdmin, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = useApi();

  // Scroll direction detection for nav hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      const scrollThreshold = 5; // Minimum scroll to trigger hide/show

      // Don't hide nav if mobile menu is open
      if (menuOpen) {
        setNavVisible(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      // Always show nav at the top of the page
      if (currentScrollY < 80) {
        setNavVisible(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      // Scrolling down - hide nav
      if (currentScrollY > lastScrollY + scrollThreshold) {
        setNavVisible(false);
        lastScrollYRef.current = currentScrollY;
      }
      // Scrolling up - show nav
      else if (currentScrollY < lastScrollY - scrollThreshold) {
        setNavVisible(true);
        lastScrollYRef.current = currentScrollY;
      }
    };

    // Throttle scroll events for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [menuOpen]);

  // Memoized scroll handler to prevent recreation
  const scrollToSection = useCallback(
    (id) => {
      setMenuOpen(false);
      if (location.pathname === "/") {
        const section = document.getElementById(id);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        navigate("/", { state: { scrollToId: id } });
      }
    },
    [location.pathname, navigate],
  );

  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  const getInitial = useCallback(() => {
    if (user?.name) return user.name[0].toUpperCase();
    if (user?.username) return user.username[0].toUpperCase();
    return "U";
  }, [user?.name, user?.username]);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 w-full z-50 backdrop-blur-xl py-3 md:py-4 shadow-lg border-b bg-gradient-to-r from-indigo-900/95 via-purple-900/95 to-blue-900/95 nav-glow-hover transition-all duration-300 ease-out ${
          navVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
        style={{
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
        }}
      >
        {/* OPTIMIZATION: Replaced JS mouse tracking with CSS hover effect */}
        {/* This gradient now uses CSS and only activates on hover, not every mouse move */}

        <div className="mx-auto flex justify-between items-center px-4 sm:px-6 md:px-12 relative z-10">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-3 hover:scale-105 active:scale-95 transition-transform"
          >
            <img
              src={logo}
              className="h-5 flex lg:h-8 mr-3 lg:mr-1 "
              alt="Krishnova"
            />
            {/* <span className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent hidden sm:block">
              Krishnova
            </span> */}
          </button>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex space-x-4 xl:space-x-6">
            {sectionNavItems.map((item, index) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="relative text-blue-100 font-medium hover:text-amber-300 hover:scale-110 hover:-translate-y-0.5 transition-all duration-200 ease-out px-3 py-2 rounded-lg group/nav"
                  style={{ transform: "translateZ(0)" }}
                >
                  {item.label}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 group-hover/nav:w-full ease-out transition-all duration-200" />
                </button>
              </li>
            ))}
          </ul>

          {/* Right Side: Cart + BUY + Auth */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 items-center">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 md:p-3 rounded-full backdrop-blur-md bg-white/10 border border-amber-400/30 hover:bg-amber-400/20 hover:border-amber-400/50 transition-all duration-300 group"
            >
              <FaShoppingCart className="text-amber-300 text-xl md:text-lg group-hover:scale-110 transition-transform" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </Link>

            {/* BUY Button */}
            <Link
              to="/productpage"
              className="group relative px-4 md:px-6 py-2 overflow-hidden rounded-full shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 text-indigo-900 font-bold flex items-center gap-2">
                <FaShoppingBag size={14} />
                <span>BUY</span>
              </span>
            </Link>

            {/* Login Button */}
            {!loading && !user && (
              <Link
                to="/login"
                className="px-4 py-2 rounded-full backdrop-blur-md bg-white/10 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 font-medium"
              >
                Login
              </Link>
            )}

            {/* User Avatar/Dropdown */}
            {!loading && user && (
              <div className="relative">
                <button
                  className="flex items-center gap-2 focus:outline-none group/avatar p-1 hover:scale-105 active:scale-95 transition-transform"
                  onClick={() => setUserDropdown((v) => !v)}
                  onBlur={() => setTimeout(() => setUserDropdown(false), 150)}
                >
                  {user.avatar ? (
                    <img
                      src={getUserAvatarUrl(user, baseUrl)}
                      alt={user.name}
                      className="w-9 h-9 object-cover rounded-full border-2 border-amber-400/50 shadow-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name || "U",
                        )}&background=fbbf24&color=1e3a8a`;
                      }}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-indigo-900 font-bold border-2 border-amber-400/50 shadow-lg">
                      {getInitial()}
                    </div>
                  )}

                  <span className="hidden sm:inline text-amber-300 font-semibold">
                    {user.name?.split(" ")[0]}
                  </span>

                  <svg
                    className={`w-4 h-4 text-amber-300 transition-transform duration-200 ${userDropdown ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-48 backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-xl shadow-2xl border border-white/20 py-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-white/10 transition-all duration-200"
                      onClick={() => setUserDropdown(false)}
                    >
                      <FaUser size={14} />
                      <span>Profile</span>
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-white/10 transition-all duration-200"
                      onClick={() => setUserDropdown(false)}
                    >
                      <FaShoppingBag size={14} />
                      <span>My Orders</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-amber-300 hover:bg-white/10 transition-all duration-200"
                        onClick={() => setUserDropdown(false)}
                      >
                        <FaCog size={14} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-400 hover:bg-white/10 transition-all duration-200"
                    >
                      <FaSignOutAlt size={14} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden text-amber-300 p-2 hover:scale-110 active:scale-90 transition-transform"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 backdrop-blur-xl bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-blue-900/95 shadow-2xl border-b border-white/10 lg:hidden">
          <div className="px-4 py-6 space-y-2">
            {sectionNavItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left px-4 py-3 text-blue-100 font-medium hover:text-amber-300 hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
