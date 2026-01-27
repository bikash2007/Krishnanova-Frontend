import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import placeholderImg from "../../Media/placeholder.png";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [wishlist, setWishlist] = useState(() => new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid, cards, mandala
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();
  const baseApi = import.meta.env.VITE_API_URL;
  const mainRef = useRef(null);
  const productsRef = useRef([]);

  // SEO Implementation for US Market
  useEffect(() => {
    document.title =
      "Divine Krishna Collection | Krishnova - Authentic Spiritual Products from Nepal";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content =
        "Discover authentic Krishna devotional items handcrafted in Nepal. Free US shipping on orders over $99. Blessed spiritual artifacts, meditation tools, and sacred jewelry.";
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Discover authentic Krishna devotional items handcrafted in Nepal. Free US shipping on orders over $99. Blessed spiritual artifacts, meditation tools, and sacred jewelry.";
      document.head.appendChild(meta);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Store",
      name: "Krishnova",
      description: "Authentic Krishna-themed spiritual products from Nepal",
      url: window.location.href,
      address: {
        "@type": "PostalAddress",
        addressCountry: "US",
      },
      priceRange: "$$$",
      currenciesAccepted: "USD",
      paymentAccepted: "Credit Card, PayPal, Apple Pay, Google Pay",
      potentialAction: {
        "@type": "SearchAction",
        target: `${window.location.origin}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // GSAP Smooth Scrolling & Animations
  useEffect(() => {
    if (!loading && mainRef.current) {
      // Smooth scroll behavior
      gsap.to(window, {
        scrollTo: { y: 0, autoKill: false },
        duration: 0.5,
        ease: "power2.inOut",
      });

      // Parallax effect for hero section
      gsap.to(".hero-bg-pattern", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Animate products on scroll
      productsRef.current.forEach((el, index) => {
        if (el) {
          gsap.fromTo(
            el,
            {
              opacity: 0,
              y: 50,
              scale: 0.9,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              delay: index * 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top bottom-=100",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      });
    }
  }, [loading, viewMode]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${baseApi}/products`);
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [baseApi]);

  const addToWishlist = (id) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getMediaUrl = (mediaPath) => {
    if (!mediaPath) return placeholderImg;
    return `${baseApi.replace("/api", "")}${mediaPath}`;
  };

  const firstImage = (p) => {
    if (Array.isArray(p.images) && p.images.length) return p.images[0];
    if (typeof p.images === "string") return p.images;
    return null;
  };

  const calcDiscount = (p) => {
    const op = Number(p?.originalPrice);
    const pr = Number(p?.price);
    if (!op || !pr || op <= pr) return 0;
    return Math.round(100 * (1 - pr / op));
  };

  const formatPrice = (n, currency = "USD") => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(n);
    } catch {
      return `$${n}`;
    }
  };

  const availableFilters = useMemo(() => {
    const set = new Set([
      "all",
      "blessed",
      "handmade",
      "meditation",
      "jewelry",
      "decor",
    ]);
    products.forEach((p) => {
      if (p.badge) set.add(String(p.badge).toLowerCase());
      (p.tags || []).forEach((t) => set.add(String(t).toLowerCase()));
    });
    return [...set];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (activeFilter !== "all") {
      list = list.filter((p) => {
        const tags = (p.tags || []).map((t) => String(t).toLowerCase());
        const badge = String(p.badge || "").toLowerCase();
        if (activeFilter === "sale") return calcDiscount(p) >= 20;
        return tags.includes(activeFilter) || badge === activeFilter;
      });
    }
    switch (sortBy) {
      case "priceLow":
        list.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "priceHigh":
        list.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "rating":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "new":
        list.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
        break;
      default:
        break;
    }
    return list;
  }, [products, activeFilter, sortBy]);

  const Skeleton = () => (
    <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-2xl p-6 border border-white/20 animate-pulse">
      <div className="h-56 rounded-xl bg-amber-200/20 mb-5" />
      <div className="h-5 rounded bg-amber-200/20 mb-3 w-3/4" />
      <div className="h-4 rounded bg-blue-100/20 mb-6 w-5/6" />
      <div className="h-10 rounded-xl bg-amber-400/20" />
    </div>
  );

  // Custom animations
  const floatAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const pulseGlow = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(251, 191, 36, 0.3)",
        "0 0 40px rgba(251, 191, 36, 0.5)",
        "0 0 20px rgba(251, 191, 36, 0.3)",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div ref={mainRef} className="min-h-screen relative">
      {/* Hero Section with Krishna Theme */}
      <section className="hero-section relative pt-20 pb-10 overflow-hidden">
        {/* Background Patterns */}
        <div className="hero-bg-pattern absolute inset-0">
          {/* Mandala Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
              linear-gradient(to right, #fbbf24 1px, transparent 1px),
              linear-gradient(to bottom, #fbbf24 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Floating Orbs */}
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Sacred Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 rounded-full px-5 py-2.5 shadow-lg mb-6"
            >
              <span className="text-amber-300 animate-pulse text-lg">✦</span>
              <span className="text-amber-100 font-medium tracking-wide text-sm">
                Handcrafted in Nepal • Shipped from USA
              </span>
              <span className="text-amber-300 animate-pulse text-lg">✦</span>
            </motion.div>

            <motion.h1
              className="font-bold text-3xl lg:text-4xl mb-4 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Authentic Krishna Collection
            </motion.h1>

            <motion.p
              className="text-base lg:text-lg leading-relaxed mb-6 text-blue-100/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Experience the divine energy of{" "}
              <span className="font-semibold text-amber-200">
                authentic Himalayan spirituality
              </span>{" "}
              delivered to your doorstep
            </motion.p>

            {/* Trust Badges for US Market */}
            <motion.div
              className="flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {[
                "🦚 Authentic & Blessed",
                "📦 Free US Shipping $99+",
                "🔒 Secure Checkout",
                "⭐ 5-Star Reviews",
                "🌿 Eco-Friendly",
              ].map((t, i) => (
                <motion.span
                  key={i}
                  className="px-4 py-2 rounded-full backdrop-blur-md bg-white/5 border border-amber-400/30 text-sm font-medium text-amber-200 shadow-lg"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(251, 191, 36, 0.1)",
                    borderColor: "rgba(251, 191, 36, 0.5)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  {t}
                </motion.span>
              ))}
            </motion.div>

            {/* Special US Market Notice */}
            <motion.div
              className="mt-6 inline-flex items-center gap-2 text-cyan-300 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <span>🚚</span>
              <span>
                Fast 2-5 day delivery across USA • Express shipping available
              </span>
            </motion.div>
          </div>

          {/* Filter Bar with Glassmorphism */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="sticky top-16 z-20">
              {/* Mobile Filter Toggle */}
              <div className="md:hidden mb-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-lg"
                >
                  <span className="font-semibold text-amber-200">
                    Filters & Sort
                  </span>
                  <motion.span
                    className="text-amber-200"
                    animate={{ rotate: showFilters ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    ↓
                  </motion.span>
                </button>
              </div>

              {/* Filter Content */}
              <AnimatePresence>
                {(showFilters || window.innerWidth >= 768) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-2xl px-6 py-4">
                      {/* View Mode Switcher */}
                      <div className="flex gap-2">
                        {[
                          { mode: "grid", icon: "⊞", label: "Grid" },
                          { mode: "cards", icon: "▭", label: "Cards" },
                          { mode: "mandala", icon: "☸", label: "Sacred" },
                        ].map((v) => (
                          <motion.button
                            key={v.mode}
                            onClick={() => setViewMode(v.mode)}
                            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                              viewMode === v.mode
                                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                                : "bg-white/5 text-amber-200 border border-amber-400/30"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="mr-1">{v.icon}</span>
                            {v.label}
                          </motion.button>
                        ))}
                      </div>

                      {/* Filters */}
                      <div className="flex flex-wrap gap-2">
                        {availableFilters.map((f) => {
                          const active = activeFilter === f;
                          return (
                            <motion.button
                              key={f}
                              onClick={() => setActiveFilter(f)}
                              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                                active
                                  ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-amber-400"
                                  : "bg-white/5 text-amber-200 border-amber-400/30"
                              }`}
                              whileHover={{
                                scale: 1.05,
                                backgroundColor: active
                                  ? undefined
                                  : "rgba(251, 191, 36, 0.1)",
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {f === "all"
                                ? "All"
                                : f
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (m) => m.toUpperCase())}
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Sort */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-blue-100/80">
                          Sort:
                        </span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="border text-sm rounded-lg px-3 py-2 bg-white/5 backdrop-blur-md text-amber-200 border-amber-400/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                          style={{ minWidth: "140px" }}
                        >
                          <option value="featured">Featured</option>
                          <option value="new">New Arrivals</option>
                          <option value="rating">Customer Favorites</option>
                          <option value="priceLow">Price: Low to High</option>
                          <option value="priceHigh">Price: High to Low</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section with Different View Modes */}
      <section className="relative pb-20 px-6">
        {/* Background Pattern */}
        {/* <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, #fbbf24 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        /> */}

        <div className="relative z-10 max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              className="text-center py-20 text-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2 text-amber-200">
                No products found
              </h3>
              <p className="text-blue-100/80">
                Try adjusting your filters or check back soon for new arrivals!
              </p>
            </motion.div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : viewMode === "cards"
                    ? "space-y-6"
                    : "relative min-h-[600px]"
              }
            >
              {viewMode === "mandala" ? (
                // Mandala View - Circular Layout
                <div className="relative w-full h-[800px] flex items-center justify-center">
                  <motion.div
                    className="absolute w-96 h-96 rounded-full border-2 border-amber-400/20"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 60,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className="absolute w-64 h-64 rounded-full border-2 border-cyan-400/20"
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 45,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  {filteredProducts.slice(0, 8).map((p, index) => {
                    const angle = (index * 360) / 8;
                    const radius = 250;
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;

                    return (
                      <motion.div
                        key={p._id}
                        className="absolute"
                        style={{
                          transform: `translate(${x}px, ${y}px)`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                      >
                        <ProductCardMandala
                          product={p}
                          formatPrice={formatPrice}
                        />
                      </motion.div>
                    );
                  })}
                  <motion.div
                    className="text-6xl text-amber-300"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    ॐ
                  </motion.div>
                </div>
              ) : (
                filteredProducts.map((p, index) => {
                  const discount = calcDiscount(p);
                  const inWishlist = wishlist.has(p._id);

                  if (viewMode === "cards") {
                    // Horizontal Card View
                    return (
                      <motion.div
                        key={p._id}
                        ref={(el) => (productsRef.current[index] = el)}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-2xl border border-white/20 hover:border-amber-400/50 transition-all duration-300 overflow-hidden cursor-pointer"
                        whileHover={{ scale: 1.01 }}
                        onClick={() => navigate(`/product/${p._id}`)}
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 relative aspect-[4/3] p-6 bg-gradient-to-br from-amber-400/10 to-orange-500/10">
                            {discount > 0 && (
                              <motion.span
                                className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-amber-400 to-orange-500 z-10"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 }}
                              >
                                Save {discount}%
                              </motion.span>
                            )}
                            <motion.img
                              src={
                                firstImage(p)
                                  ? getMediaUrl(firstImage(p))
                                  : placeholderImg
                              }
                              alt={p.title}
                              className="w-full h-full object-contain"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.4 }}
                            />
                          </div>
                          <div className="md:w-2/3 p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                                  {p.title}
                                </h3>
                                <p className="text-amber-200/80 text-xs italic mb-2">
                                  Handcrafted with devotion in Nepal
                                </p>
                              </div>
                              <motion.button
                                onClick={() => addToWishlist(p._id)}
                                className="text-2xl"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <span
                                  className={
                                    inWishlist
                                      ? "text-amber-400"
                                      : "text-amber-200/50"
                                  }
                                >
                                  {inWishlist ? "♥" : "♡"}
                                </span>
                              </motion.button>
                            </div>
                            <p className="text-blue-100/80 mb-4 line-clamp-2">
                              {p.desc}
                            </p>
                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-lg ${
                                      i < Math.round(p.rating || 0)
                                        ? "text-amber-400"
                                        : "text-amber-400/30"
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-blue-100/60 text-sm">
                                ({p.numReviews || 0} verified reviews)
                              </span>
                            </div>
                            <div className="flex items-baseline gap-3 mb-6">
                              <span className="text-xl font-bold text-amber-300">
                                {formatPrice(p.price)}
                              </span>
                              {p.originalPrice && (
                                <span className="text-base line-through text-blue-100/50">
                                  {formatPrice(p.originalPrice)}
                                </span>
                              )}
                              {discount > 0 && (
                                <span className="text-green-400 text-sm font-semibold">
                                  You save{" "}
                                  {formatPrice(p.originalPrice - p.price)}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-3">
                              <motion.button
                                className="group relative px-8 py-3 overflow-hidden rounded-full shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/product/${p._id}?buy=1`);
                                }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                                <span className="relative text-white font-semibold flex items-center gap-2">
                                  <span>🛒</span> Add to Cart
                                </span>
                              </motion.button>
                              <motion.button
                                className="px-8 py-3 border-2 border-amber-400/50 text-amber-200 rounded-full font-semibold backdrop-blur-md bg-white/5 hover:bg-amber-400/10 hover:border-amber-400 transition-all duration-300"
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/product/${p._id}`);
                                }}
                              >
                                View Details
                              </motion.button>
                            </div>
                            {/* US Market Trust Indicators */}
                            <div className="flex gap-4 mt-4 text-xs text-cyan-300">
                              <span>✓ Free Returns</span>
                              <span>✓ Secure Payment</span>
                              <span>✓ Fast Shipping</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  // Grid View (Default)
                  return (
                    <motion.div
                      key={p._id}
                      ref={(el) => (productsRef.current[index] = el)}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      onHoverStart={() => setHovered(p._id)}
                      onHoverEnd={() => setHovered(null)}
                      className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-2xl border border-white/20 hover:border-amber-400/50 transition-all duration-300 group cursor-pointer overflow-hidden"
                      whileHover={{
                        y: -4,
                        scale: 1.01,
                      }}
                      onClick={() => navigate(`/product/${p._id}`)}
                    >
                      {/* Divine Aura Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-amber-400/0 via-amber-400/5 to-amber-400/0"
                        animate={{
                          opacity: hovered === p._id ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Product Image Area */}
                      <div className="relative aspect-[4/3] p-6 bg-gradient-to-br from-amber-400/10 to-orange-500/10">
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                          {discount > 0 && (
                            <motion.span
                              className="px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-amber-400 to-orange-500"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                            >
                              {discount}% OFF
                            </motion.span>
                          )}
                          {p.badge && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-gradient-to-r from-purple-400/20 to-blue-400/20 backdrop-blur-md border border-purple-400/30 text-purple-200">
                              {p.badge}
                            </span>
                          )}
                          {p.new && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-400/20 to-blue-400/20 backdrop-blur-md border border-cyan-400/30 text-cyan-200">
                              NEW
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToWishlist(p._id);
                          }}
                          className="absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-md bg-white/10 border border-amber-400/30 flex items-center justify-center z-10"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <motion.span
                            className={
                              inWishlist
                                ? "text-amber-400"
                                : "text-amber-200/50"
                            }
                            animate={{ scale: inWishlist ? [1, 1.3, 1] : 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {inWishlist ? "♥" : "♡"}
                          </motion.span>
                        </motion.button>

                        {/* Product Image with Hover Effect */}
                        <motion.img
                          src={
                            firstImage(p)
                              ? getMediaUrl(firstImage(p))
                              : placeholderImg
                          }
                          alt={p.title}
                          className="w-full h-full object-contain"
                          animate={{
                            scale: hovered === p._id ? 1.05 : 1,
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          loading="lazy"
                        />

                        {/* Floating Elements on Hover */}
                        {hovered === p._id && (
                          <>
                            <motion.div
                              className="absolute top-2 left-2 text-2xl"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              🦚
                            </motion.div>
                            <motion.div
                              className="absolute bottom-2 right-2 text-2xl"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              🪈
                            </motion.div>
                          </>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="px-4 pb-4">
                        <h3 className="text-base font-bold mb-1 line-clamp-2 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                          {p.title}
                        </h3>
                        <p className="text-amber-200/80 text-xs italic mb-1">
                          Authentic Himalayan Craft
                        </p>
                        <p className="text-xs line-clamp-2 mb-2 leading-relaxed text-blue-100/80">
                          {p.desc}
                        </p>

                        {/* Rating with US Market Focus */}
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-xs ${
                                  i < Math.round(p.rating || 0)
                                    ? "text-amber-400"
                                    : "text-amber-400/30"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-blue-100/60">
                            ({p.numReviews || 0})
                          </span>
                        </div>

                        {/* Price & CTAs */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-amber-300">
                              {formatPrice(p.price)}
                            </span>
                            {p.originalPrice && (
                              <span className="text-xs line-through text-blue-100/50">
                                {formatPrice(p.originalPrice)}
                              </span>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <motion.button
                              className="group relative flex-1 px-3 py-1.5 overflow-hidden rounded-lg shadow-lg transform transition-all duration-300"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/product/${p._id}?buy=1`);
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                              <span className="relative text-white text-xs font-semibold">
                                Add to Cart
                              </span>
                            </motion.button>
                            <motion.button
                              className="flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-400/50 text-amber-200 backdrop-blur-md bg-white/5 hover:bg-amber-400/10 hover:border-amber-400 transition-all duration-300"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/product/${p._id}`);
                              }}
                            >
                              View
                            </motion.button>
                          </div>

                          {/* Quick US Market Trust Badge */}
                          {p.price > 99 && (
                            <div className="text-center text-[10px] text-cyan-300">
                              ✓ Free US Shipping
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </section>

      {/* US Market Trust Section */}
      <section className="relative pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {[
              {
                icon: "🚚",
                title: "Free US Shipping",
                desc: "Orders over $99",
                detail: "2-5 business days",
              },
              {
                icon: "🪔",
                title: "Authentic & Blessed",
                desc: "Direct from Nepal",
                detail: "Certified genuine",
              },
              {
                icon: "📿",
                title: "Easy Returns",
                desc: "30-day guarantee",
                detail: "No questions asked",
              },
              {
                icon: "🔒",
                title: "Secure Payment",
                desc: "All cards accepted",
                detail: "PayPal, Apple Pay",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 text-center border border-white/20 hover:border-amber-400/50 transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                }}
                {...floatAnimation}
              >
                <motion.div
                  className="text-3xl mb-2"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {f.icon}
                </motion.div>
                <div className="font-bold text-base mb-1 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                  {f.title}
                </div>
                <div className="text-sm leading-relaxed text-blue-100/80 mb-1">
                  {f.desc}
                </div>
                <div className="text-xs text-cyan-300">{f.detail}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* US Customer Testimonial */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-amber-200/80 italic text-lg mb-2">
              "The quality and authenticity of these spiritual items are
              unmatched. Fast shipping to California and beautiful packaging!"
            </p>
            <p className="text-blue-100/60 text-sm">
              - Sarah M., Verified US Customer ⭐⭐⭐⭐⭐
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Mandala View Product Card Component
function ProductCardMandala({ product, formatPrice }) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="w-32 h-32 rounded-full backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-amber-400/50 transition-all duration-300 flex flex-col items-center justify-center p-4 cursor-pointer group"
      whileHover={{ scale: 1.1, rotate: 5 }}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="text-xs font-bold text-amber-200 text-center mb-1 line-clamp-1">
        {product.title}
      </div>
      <div className="text-lg font-bold text-amber-300">
        {formatPrice(product.price)}
      </div>
      <div className="text-xs text-blue-100/60">⭐ {product.rating || 0}</div>
    </motion.div>
  );
}
