import { useState, useRef, useEffect, useCallback, memo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { gsap } from "gsap";
import {
  FaShoppingBag,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaShoppingCart,
} from "react-icons/fa";
import { useApi } from "../../Context/baseUrl";
import { useCart } from "../../Context/CartContext";
const logo = `${import.meta.env.BASE_URL}krishnova.webp`;

// Section nav items
const sectionNavItems = [
  { id: "home", label: "Home" },
  { id: "wisdom", label: "Talk to Krishna" },
  { id: "products", label: "Spiritual Anchors" },
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

function Navigation() {
  const { cart } = useCart();
  const { user, logout, isAdmin, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const navRef = useRef(null);
  const navItemsRef = useRef([]);
  const mobileMenuRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = useApi();

  // Scroll direction detection for nav hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      const scrollThreshold = 5;

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

  // GSAP animations on mount
  useEffect(() => {
    if (navItemsRef.current.length > 0) {
      gsap.fromTo(
        navItemsRef.current,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
        },
      );
    }
  }, []);

  // Animate mobile menu
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (menuOpen) {
        gsap.fromTo(
          mobileMenuRef.current,
          { opacity: 0, y: -20, display: "none" },
          {
            opacity: 1,
            y: 0,
            display: "block",
            duration: 0.3,
            ease: "power2.out",
          },
        );
        // Animate menu items
        const items =
          mobileMenuRef.current.querySelectorAll(".mobile-nav-item");
        gsap.fromTo(
          items,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out",
          },
        );
      } else {
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            if (mobileMenuRef.current) {
              mobileMenuRef.current.style.display = "none";
            }
          },
        });
      }
    }
  }, [menuOpen]);

  // Animate dropdown
  useEffect(() => {
    if (dropdownRef.current) {
      if (userDropdown) {
        gsap.fromTo(
          dropdownRef.current,
          { opacity: 0, y: -10, scale: 0.95, display: "none" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            display: "block",
            duration: 0.2,
            ease: "power2.out",
          },
        );
      } else {
        gsap.to(dropdownRef.current, {
          opacity: 0,
          y: -10,
          scale: 0.95,
          duration: 0.15,
          ease: "power2.in",
          onComplete: () => {
            if (dropdownRef.current) {
              dropdownRef.current.style.display = "none";
            }
          },
        });
      }
    }
  }, [userDropdown]);

  // Memoized scroll handler - uses GSAP smooth scroll
  const scrollToSection = useCallback(
    (id) => {
      setMenuOpen(false);
      if (location.pathname === "/") {
        const section = document.getElementById(id);
        if (section) {
          gsap.to(window, {
            duration: 0.8,
            scrollTo: { y: section, offsetY: 70 },
            ease: "power2.inOut",
          });
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

  // Button hover animation using GSAP
  const handleButtonHover = (e, scale = 1.05) => {
    gsap.to(e.currentTarget, { scale, duration: 0.2, ease: "power2.out" });
  };

  const handleButtonLeave = (e) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: "power2.out" });
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 w-full z-[10000] backdrop-blur-xl py-3 md:py-4 shadow-lg border-b bg-gradient-to-r from-indigo-900/95 via-purple-900/95 to-blue-900/95 transition-transform duration-300 ease-out ${
          navVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          willChange: "transform",
        }}
      >
        <div className="mx-auto flex justify-between items-center px-4 sm:px-6 md:px-12 relative z-10">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
            onMouseEnter={(e) => handleButtonHover(e)}
            onMouseLeave={handleButtonLeave}
          >
            <img
              src={logo}
              className="h-5 flex lg:h-8 mr-3 lg:mr-1"
              alt="Krishnova"
            />
          </button>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex space-x-4 xl:space-x-6">
            {sectionNavItems.map((item, index) => (
              <li key={item.id}>
                <button
                  ref={(el) => (navItemsRef.current[index] = el)}
                  onClick={() => scrollToSection(item.id)}
                  className="relative text-blue-100 font-medium hover:text-amber-300 transition-colors duration-200 px-3 py-2 rounded-lg group/nav"
                  onMouseEnter={(e) => handleButtonHover(e, 1.08)}
                  onMouseLeave={handleButtonLeave}
                >
                  {item.label}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 group-hover/nav:w-full transition-all duration-200" />
                </button>
              </li>
            ))}
          </ul>

          {/* Right Side: Cart + BUY + Auth */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 items-center">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 md:p-3 rounded-full backdrop-blur-md bg-white/10 border border-amber-400/30 hover:bg-amber-400/20 hover:border-amber-400/50 transition-all duration-200 group"
            >
              <FaShoppingCart className="text-amber-300 text-xl md:text-lg group-hover:scale-110 transition-transform duration-200" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-500 text-indigo-900 text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </Link>

            {/* BUY Button */}
            <Link
              to="/productpage"
              className="group relative px-4 md:px-6 py-2 overflow-hidden rounded-full shadow-lg hover:-translate-y-0.5 transition-transform duration-200"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 text-indigo-900 font-bold flex items-center gap-2">
                <FaShoppingBag size={14} />
                <span>BUY</span>
              </span>
            </Link>

            {/* Login Button */}
            {!loading && !user && (
              <Link
                to="/login"
                className="px-4 py-2 rounded-full backdrop-blur-md bg-white/10 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-200 font-medium"
              >
                Login
              </Link>
            )}

            {/* User Avatar/Dropdown */}
            {!loading && user && (
              <div className="relative">
                <button
                  className="flex items-center gap-2 focus:outline-none group/avatar p-1"
                  onClick={() => setUserDropdown((v) => !v)}
                  onBlur={() => setTimeout(() => setUserDropdown(false), 150)}
                  onMouseEnter={(e) => handleButtonHover(e)}
                  onMouseLeave={handleButtonLeave}
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

                {/* Dropdown - controlled by GSAP */}
                <div
                  ref={dropdownRef}
                  style={{ display: "none" }}
                  className="absolute right-0 mt-2 w-48 backdrop-blur-2xl  bg-gradient-to-br from-violet-950/80 to-cyan-950/80 rounded-xl shadow-2xl border border-white/20 py-2 z-50"
                >
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-white/10 transition-colors duration-200"
                    onClick={() => setUserDropdown(false)}
                  >
                    <FaUser size={14} />
                    <span>Profile</span>
                  </Link>

                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-white/10 transition-colors duration-200"
                    onClick={() => setUserDropdown(false)}
                  >
                    <FaShoppingBag size={14} />
                    <span>My Orders</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-amber-300 hover:bg-white/10 transition-colors duration-200"
                      onClick={() => setUserDropdown(false)}
                    >
                      <FaCog size={14} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-400 hover:bg-white/10 transition-colors duration-200"
                  >
                    <FaSignOutAlt size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden text-amber-300 p-2 hover:scale-110 transition-transform duration-200"
              onMouseEnter={(e) => handleButtonHover(e, 1.1)}
              onMouseLeave={handleButtonLeave}
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

      {/* Mobile Menu - controlled by GSAP */}
      <div
        ref={mobileMenuRef}
        style={{ display: "none" }}
        className="fixed top-16 left-0 right-0 z-40 backdrop-blur-xl bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-blue-900/95 shadow-2xl border-b border-white/10 lg:hidden"
      >
        <div className="px-4 py-6 space-y-2">
          {sectionNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="mobile-nav-item block w-full text-left px-4 py-3 text-blue-100 font-medium hover:text-amber-300 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default memo(Navigation);
