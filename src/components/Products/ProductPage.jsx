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
    <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-xl md:rounded-2xl shadow-lg p-2 md:p-4 border border-white/20 animate-pulse">
      <div className="aspect-square rounded-lg bg-amber-200/20 mb-2" />
      <div className="h-3 md:h-4 rounded bg-amber-200/20 mb-1.5 w-3/4" />
      <div className="h-2.5 md:h-3 rounded bg-blue-100/20 mb-2 w-1/2" />
      <div className="h-6 md:h-8 rounded-lg bg-amber-400/20" />
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
      {/* Compact Hero Section - Daraz Style */}
      <section className="hero-section relative pt-16 pb-4 md:pt-20 md:pb-6 overflow-hidden">
        {/* Subtle Background */}
        <div className="hero-bg-pattern absolute inset-0">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          {/* Compact Header */}
          <div className="text-left md:text-center">
            {/* Title Row */}
            <motion.h1
              className="font-bold text-xl md:text-3xl lg:text-4xl mb-1 md:mb-2 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Krishna Collection
            </motion.h1>

            <motion.p
              className="text-xs md:text-sm text-blue-100/70 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Handcrafted in Nepal • Fast US Shipping
            </motion.p>

            {/* Horizontal Scrollable Trust Badges */}
            <motion.div
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:justify-center md:flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[
                { icon: "🦚", text: "Authentic" },
                { icon: "📦", text: "Free $99+" },
                { icon: "🔒", text: "Secure" },
                { icon: "⭐", text: "5-Star" },
                { icon: "🚚", text: "2-5 Days" },
              ].map((t, i) => (
                <span
                  key={i}
                  className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-amber-400/20 text-[10px] md:text-xs text-amber-200"
                >
                  <span>{t.icon}</span>
                  <span>{t.text}</span>
                </span>
              ))}
            </motion.div>
          </div>

          {/* Compact Filter Bar - Daraz Style */}
          <div className="mt-3 md:mt-6">
            <div className="sticky top-14 z-20">
              {/* Mobile: Inline Filter Row */}
              <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-hide">
                {/* Sort Dropdown - Compact */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-shrink-0 text-[11px] md:text-xs rounded-lg px-2 py-1.5 bg-white/10 text-amber-200 border border-amber-400/30 focus:outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="new">New</option>
                  <option value="rating">Top Rated</option>
                  <option value="priceLow">Price ↑</option>
                  <option value="priceHigh">Price ↓</option>
                </select>

                {/* Filter Pills - Horizontal Scroll */}
                {availableFilters.map((f) => {
                  const active = activeFilter === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] md:text-xs font-medium transition-all border ${
                        active
                          ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-amber-400"
                          : "bg-white/5 text-amber-200/80 border-amber-400/20"
                      }`}
                    >
                      {f === "all"
                        ? "All"
                        : f
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (m) => m.toUpperCase())}
                    </button>
                  );
                })}

                {/* View Mode - Desktop Only */}
                <div className="hidden md:flex gap-1 ml-auto">
                  {[
                    { mode: "grid", icon: "⊞" },
                    { mode: "cards", icon: "▭" },
                    { mode: "mandala", icon: "☸" },
                  ].map((v) => (
                    <button
                      key={v.mode}
                      onClick={() => setViewMode(v.mode)}
                      className={`px-2 py-1 rounded text-sm transition-all ${
                        viewMode === v.mode
                          ? "bg-amber-500 text-white"
                          : "bg-white/5 text-amber-200"
                      }`}
                    >
                      {v.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - Compact Grid */}
      <section className="relative pb-10 md:pb-20 px-3 md:px-6">
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Product Count */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] md:text-xs text-blue-100/60">
              {filteredProducts.length} products
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              className="text-center py-12 text-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-bold mb-1 text-amber-200">
                No products found
              </h3>
              <p className="text-sm text-blue-100/80">
                Try adjusting your filters or check back soon for new arrivals!
              </p>
            </motion.div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4"
                  : viewMode === "cards"
                    ? "space-y-4"
                    : "relative min-h-[400px] md:min-h-[600px]"
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

                  // Grid View (Default) - Daraz Style Compact Cards
                  return (
                    <motion.div
                      key={p._id}
                      ref={(el) => (productsRef.current[index] = el)}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-xl md:rounded-2xl shadow-lg border border-white/15 hover:border-amber-400/40 transition-all duration-200 group cursor-pointer overflow-hidden"
                      whileHover={{ y: -2 }}
                      onClick={() => navigate(`/product/${p._id}`)}
                    >
                      {/* Product Image Area - Compact */}
                      <div className="relative aspect-square bg-gradient-to-br from-amber-400/5 to-orange-500/5">
                        {/* Discount Badge - Top Left */}
                        {discount > 0 && (
                          <span className="absolute top-1.5 left-1.5 md:top-2 md:left-2 px-1.5 md:px-2 py-0.5 rounded text-[9px] md:text-[10px] font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 z-10">
                            -{discount}%
                          </span>
                        )}

                        {/* Wishlist - Top Right */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToWishlist(p._id);
                          }}
                          className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-6 h-6 md:w-7 md:h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center z-10"
                        >
                          <span
                            className={`text-xs md:text-sm ${inWishlist ? "text-rose-400" : "text-white/70"}`}
                          >
                            {inWishlist ? "♥" : "♡"}
                          </span>
                        </button>

                        {/* Product Image */}
                        <img
                          src={
                            firstImage(p)
                              ? getMediaUrl(firstImage(p))
                              : placeholderImg
                          }
                          alt={p.title}
                          className="w-full h-full object-contain p-2 md:p-3 group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>

                      {/* Product Info - Compact */}
                      <div className="p-2 md:p-3">
                        {/* Title */}
                        <h3 className="text-[11px] md:text-sm font-semibold mb-1 line-clamp-2 text-amber-100 leading-tight">
                          {p.title}
                        </h3>

                        {/* Rating - Compact */}
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-[10px] md:text-xs text-amber-400">
                            ★
                          </span>
                          <span className="text-[10px] md:text-xs text-amber-200/70">
                            {p.rating?.toFixed(1) || "0.0"}
                          </span>
                          <span className="text-[9px] md:text-[10px] text-blue-100/40">
                            ({p.numReviews || 0})
                          </span>
                        </div>

                        {/* Price Row */}
                        <div className="flex items-baseline gap-1.5 mb-1.5">
                          <span className="text-sm md:text-base font-bold text-amber-300">
                            {formatPrice(p.price)}
                          </span>
                          {p.originalPrice && (
                            <span className="text-[10px] md:text-xs line-through text-blue-100/40">
                              {formatPrice(p.originalPrice)}
                            </span>
                          )}
                        </div>

                        {/* Free Shipping Badge */}
                        {p.price > 99 && (
                          <div className="text-[9px] md:text-[10px] text-cyan-300/80 mb-1.5">
                            🚚 Free Shipping
                          </div>
                        )}

                        {/* Add to Cart Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${p._id}?buy=1`);
                          }}
                          className="w-full py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 transition-all"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </section>

      {/* Trust Section - Compact */}
      <section className="relative pb-10 md:pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Horizontal Scrollable Trust Badges on Mobile */}
          <div className="flex md:grid md:grid-cols-4 gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { icon: "🚚", title: "Free Shipping", desc: "$99+" },
              { icon: "✓", title: "Authentic", desc: "Nepal" },
              { icon: "↩", title: "30-Day", desc: "Returns" },
              { icon: "🔒", title: "Secure", desc: "Pay" },
            ].map((f, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[120px] md:w-auto backdrop-blur-md bg-gradient-to-br from-white/8 to-white/3 rounded-xl p-3 text-center border border-white/10"
              >
                <div className="text-xl md:text-2xl mb-1">{f.icon}</div>
                <div className="font-semibold text-[11px] md:text-xs text-amber-200">
                  {f.title}
                </div>
                <div className="text-[10px] md:text-[11px] text-blue-100/60">
                  {f.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial - More Compact */}
          <div className="mt-6 text-center">
            <p className="text-amber-200/70 italic text-sm md:text-base mb-1">
              "Fast shipping to California. Beautiful packaging!"
            </p>
            <p className="text-blue-100/50 text-xs">
              - Sarah M., US Customer ⭐⭐⭐⭐⭐
            </p>
          </div>
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
