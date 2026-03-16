import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
  ShoppingBag,
  Heart,
  Eye,
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import { normalizeImageUrl } from "../../utils/imageUrl";
import {
  GiFeather,
  GiFlute,
  GiCandleLight,
  GiPrayerBeads,
} from "react-icons/gi";
import { IoSparkles } from "react-icons/io5";

const CarouselSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const baseUrl = import.meta.env.VITE_API_URL;
  const AUTO_PLAY_INTERVAL = 4000;

  const currentProduct = useMemo(() => {
    return products[currentIndex] || null;
  }, [products, currentIndex]);

  // Krishna-themed color palette
  const colorTheme = {
    primary: "#1e3a8a", // Deep Krishna Blue
    secondary: "#fbbf24", // Golden Yellow
    accent: "#10b981", // Peacock Green
    purple: "#8b5cf6", // Divine Purple
    dark: "#0f172a", // Midnight Blue
    neutral: "#94a3b8", // Soft Gray
    light: "#f8fafc",
    white: "#ffffff",
    success: "#fbbf24", // Golden for price
    gradients: {
      primary: "linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #fbbf24 100%)",
      card: "linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(139, 92, 246, 0.8) 100%)",
      golden: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
      divine: "linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #1e3a8a 100%)",
    },
  };
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Responsive display products calculation
  const displayProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];

    const items = [];
    const getVisibleCount = () => {
      if (windowWidth < 480) return 5;
      if (windowWidth < 640) return 5;
      if (windowWidth < 768) return 5;
      if (windowWidth < 1024) return 7;
      return 7;
    };

    const visibleCount = getVisibleCount();
    const centerOffset = Math.floor(visibleCount / 2);

    for (let i = 0; i < visibleCount; i++) {
      const position = i - centerOffset;
      const index =
        (currentIndex + position + products.length) % products.length;
      const product = products[index];

      if (product) {
        items.push({
          ...product,
          position,
          displayIndex: i,
          key: `coverflow-${product._id}-${position}-${currentIndex}`,
        });
      }
    }

    return items;
  }, [products, currentIndex, windowWidth]);

  // API Fetch
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/products`);
        if (!isMounted) return;

        let fetchedProducts = response.data;

        if (!Array.isArray(fetchedProducts) || fetchedProducts.length === 0) {
          throw new Error("No products available");
        }

        if (fetchedProducts.length < 7) {
          const original = [...fetchedProducts];
          while (fetchedProducts.length < 8) {
            fetchedProducts = [...fetchedProducts, ...original];
          }
        }

        setProducts(fetchedProducts.slice(0, 12));
      } catch (error) {
        console.error("API Error:", error);

        const fallbackProducts = [
          {
            _id: "demo-1",
            title: "Divine Krishna Mala",
            desc: "108 sacred beads blessed with Krishna's divine mantras for spiritual elevation",
            price: 1299,
            originalPrice: 1999,
            images: [
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23312e81'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23a5b4fc' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E",
            ],
          },
          {
            _id: "demo-2",
            title: "Peacock Feather Pendant",
            desc: "Handcrafted pendant with authentic peacock feather, symbol of Krishna's grace",
            price: 2499,
            originalPrice: 3499,
            images: [
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23312e81'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23a5b4fc' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E",
            ],
          },
          {
            _id: "demo-3",
            title: "Sacred Flute Keychain",
            desc: "Miniature flute keychain carrying the melody of Krishna's divine music",
            price: 599,
            originalPrice: 899,
            images: [
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23312e81'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23a5b4fc' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E",
            ],
          },
          {
            _id: "demo-4",
            title: "Bhagavad Gita - Premium Edition",
            desc: "Gold-embossed edition with Sanskrit verses and detailed commentary",
            price: 3999,
            originalPrice: 5999,
            images: [
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23312e81'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23a5b4fc' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E",
            ],
          },
          {
            _id: "demo-5",
            title: "Radha Krishna Locket",
            desc: "Pure silver locket depicting eternal love of Radha and Krishna",
            price: 4599,
            originalPrice: 6999,
            images: [
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23312e81'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23a5b4fc' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E",
            ],
          },
          {
            _id: "demo-6",
            title: "Vrindavan Incense Collection",
            desc: "Sacred fragrances from the holy land of Vrindavan",
            price: 799,
            originalPrice: 1199,
            images: [
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23312e81'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23a5b4fc' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E",
            ],
          },
        ];

        setProducts(fallbackProducts);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [baseUrl]);

  // Navigation functions
  const goToSlide = useCallback(
    (index) => {
      if (
        isTransitioning ||
        index === currentIndex ||
        index < 0 ||
        index >= products.length
      )
        return;

      setIsTransitioning(true);
      setCurrentIndex(index);

      requestAnimationFrame(() => {
        setTimeout(() => setIsTransitioning(false), 500);
      });
    },
    [currentIndex, isTransitioning, products.length],
  );

  const nextSlide = useCallback(() => {
    if (products.length === 0) return;
    const nextIndex = (currentIndex + 1) % products.length;
    goToSlide(nextIndex);
  }, [currentIndex, products.length, goToSlide]);

  const prevSlide = useCallback(() => {
    if (products.length === 0) return;
    const prevIndex =
      currentIndex === 0 ? products.length - 1 : currentIndex - 1;
    goToSlide(prevIndex);
  }, [currentIndex, products.length, goToSlide]);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying || products.length <= 1) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(nextSlide, AUTO_PLAY_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying, products.length, nextSlide]);

  const handleMouseEnter = useCallback(() => setIsAutoPlaying(false), []);
  const handleMouseLeave = useCallback(() => setIsAutoPlaying(true), []);

  // 3D transform calculator with improved mobile responsiveness
  const getCoverflowTransform = useCallback(
    (position) => {
      const isCurrent = position === 0;
      const absPos = Math.abs(position);

      if (isCurrent) {
        return {
          x: 0,
          rotateY: 0,
          scale: windowWidth < 640 ? 1.08 : 1.12,
          opacity: 1,
          zIndex: 100,
          blur: 0,
        };
      }

      const getSpacing = () => {
        if (windowWidth < 480) return 75;
        if (windowWidth < 640) return 90;
        if (windowWidth < 768) return 110;
        if (windowWidth < 1024) return 140;
        return 170;
      };

      const getRotation = () => {
        if (windowWidth < 640) return 45;
        if (windowWidth < 1024) return 45;
        return 50;
      };

      const rotateY = position > 0 ? -getRotation() : getRotation();
      const translateX = position * getSpacing();
      const scaleValue = Math.max(0.65, 1 - absPos * 0.12);
      const opacityValue = Math.max(0.6, 1 - absPos * 0.15);

      return {
        x: translateX,
        rotateY: rotateY,
        scale: scaleValue,
        opacity: opacityValue,
        zIndex: 100 - absPos * 10,
        blur: absPos * 1.5,
      };
    },
    [windowWidth],
  );

  const placeholderImg =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23312e81'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23a5b4fc' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E";

  const getImageUrl = useCallback((product) => {
    // Try media[] first (new format), then legacy images[]
    const url =
      product?.media?.[0]?.url ||
      (Array.isArray(product?.images) && product.images[0]) ||
      null;
    if (!url) return placeholderImg;
    return normalizeImageUrl(url) || placeholderImg;
  }, []);

  if (loading) {
    return (
      <section className="md:min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 relative overflow-hidden">
        <div className="text-center px-4 relative z-10">
          <div className="relative mb-8">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto">
              <div
                className="absolute inset-2 border-4 border-t-amber-400 border-r-amber-400/50 border-b-transparent border-l-transparent rounded-full"
                style={{ animation: "spin 1.5s linear infinite" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <GiFeather className="text-3xl sm:text-4xl text-amber-300" />
              </div>
            </div>
          </div>
          <p className="font-semibold text-lg sm:text-xl text-amber-200">
            Loading Divine Collection...
          </p>
          <p className="text-sm text-amber-200/50 mt-3 tracking-wider">
            कृष्णम् वन्दे जगद्गुरुम्
          </p>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="text-center px-6 relative z-10">
          <GiFlute className="text-6xl sm:text-7xl mb-6 text-amber-300" />
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-3">
            Divine Collection Coming Soon
          </h2>
          <p className="text-amber-200/50 text-sm sm:text-base">
            Stay blessed • हरे कृष्ण
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {[
              <GiCandleLight key={0} />,
              <GiPrayerBeads key={1} />,
              <GiFeather key={2} />,
            ].map((icon, i) => (
              <span key={i} className="text-2xl text-amber-300">
                {icon}
              </span>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative md:min-h-[100dvh] overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-2xl flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          <span className="font-medium">Added to cart!</span>
        </div>
      )}

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs - Static */}
        <div className="absolute -top-20 -right-20 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-amber-400/10 to-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-gradient-to-tr from-purple-500/10 to-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative md:min-h-[100dvh] flex items-center justify-center flex-wrap px-3 sm:px-6 lg:px-8 py-10  lg:py-12 z-10">
        {/* Navigation Buttons - Improved positioning and styling */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3.5 rounded-full bg-white/10 border border-amber-400/40 shadow-xl transition-all duration-300 group disabled:opacity-40 hover:bg-amber-400/25 hover:border-amber-400/60 hover:scale-110 active:scale-90"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-amber-200 group-hover:text-amber-100 transition-colors" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3.5 rounded-full bg-white/10 border border-amber-400/40 shadow-xl transition-all duration-300 group disabled:opacity-40 hover:bg-amber-400/25 hover:border-amber-400/60 hover:scale-110 active:scale-90"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-amber-200 group-hover:text-amber-100 transition-colors" />
        </button>

        <div className="w-full lg:max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-8 lg:gap-12 xl:gap-16">
          {/* Product Info */}
          <div className="w-full lg:w-2/5 text-center lg:text-left order-2 lg:order-1 px-2 sm:px-4 lg:px-0 lg:pr-8 z-40">
            {currentProduct && (
              <div
                key={`info-${currentProduct._id}`}
                className="space-y-3 sm:space-y-5 lg:space-y-6"
              >
                {/* Sacred Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-400/25 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                  <span className="text-xs sm:text-sm font-medium text-amber-200/90 tracking-wider">
                    KRISHNA'S BLESSING
                  </span>
                  <span className="text-amber-300 text-xs sm:text-sm">✦</span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                  {currentProduct.shortTitle || currentProduct.title}
                </h1>

                <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-blue-100/75 max-w-sm sm:max-w-md mx-auto lg:mx-0 line-clamp-3 sm:line-clamp-none">
                  {currentProduct.desc}
                </p>

                {/* Price Section */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-base sm:text-lg text-amber-300">
                      $
                    </span>
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-300">
                      {currentProduct.price}
                    </span>
                  </div>
                  {currentProduct.originalPrice &&
                    currentProduct.originalPrice !== currentProduct.price && (
                      <>
                        <span className="text-base sm:text-lg line-through text-blue-200/40">
                          ${currentProduct.originalPrice}
                        </span>
                        <span className="px-2 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-full text-xs text-green-300 font-semibold">
                          {Math.round(
                            ((currentProduct.originalPrice -
                              currentProduct.price) /
                              currentProduct.originalPrice) *
                              100,
                          )}
                          % OFF
                        </span>
                      </>
                    )}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pb-4 sm:pb-8 md:pb-0">
                  <Link
                    to={`/product/${currentProduct._id}`}
                    className="group relative px-6 sm:px-8 py-3 sm:py-4 overflow-hidden rounded-full shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                    <span className="relative z-10 text-indigo-900 font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Product
                      <span>→</span>
                    </span>
                  </Link>

                  <button
                    onClick={() => handleAddToCart(currentProduct)}
                    className="group px-5 sm:px-6 py-3 sm:py-4 border-2 border-amber-400/40 text-amber-200 rounded-full font-semibold bg-white/5 hover:bg-amber-400/15 hover:border-amber-400/70 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                  >
                    <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
                      <Heart className="w-4 h-4 group-hover:text-red-400 transition-colors" />
                      Add to Cart
                    </span>
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="hidden sm:flex items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-3 sm:pt-4">
                  {[
                    { icon: <GiCandleLight />, label: "Blessed" },
                    { icon: <GiPrayerBeads />, label: "Sacred" },
                    { icon: <GiFeather />, label: "Divine" },
                    { icon: <IoSparkles />, label: "Premium" },
                  ].map((badge, index) => (
                    <div
                      key={badge.label}
                      className="text-center px-3 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:scale-105 hover:bg-amber-400/10 transition-all duration-300"
                    >
                      <div className="text-xl sm:text-2xl text-amber-300 flex justify-center">
                        {badge.icon}
                      </div>
                      <p className="text-xs text-amber-200/60 mt-0.5">
                        {badge.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3D Coverflow Display */}
          <div className="w-full lg:w-3/5 relative order-1 lg:order-2 mb-2 sm:mb-0 -mt-2 sm:mt-0">
            <div
              className="relative w-full flex items-center justify-center"
              style={{
                height:
                  windowWidth < 480
                    ? "300px"
                    : windowWidth < 640
                      ? "340px"
                      : windowWidth < 1024
                        ? "380px"
                        : "420px",
                perspective: windowWidth < 640 ? "1000px" : "1200px",
                perspectiveOrigin: "center center",
              }}
            >
              {displayProducts.map((item) => {
                const transform = getCoverflowTransform(item.position);
                const isCurrent = item.position === 0;
                const imageUrl = getImageUrl(item);

                const getCardSize = () => {
                  if (windowWidth < 480) return { width: 180, height: 200 };
                  if (windowWidth < 640) return { width: 200, height: 220 };
                  if (windowWidth < 768) return { width: 220, height: 240 };
                  if (windowWidth < 1024) return { width: 260, height: 280 };
                  return { width: 300, height: 320 };
                };

                const cardSize = getCardSize();

                return (
                  <div
                    key={item.key}
                    className="absolute flex items-center justify-center cursor-pointer transition-all duration-500 ease-out"
                    style={{
                      width: `${cardSize.width}px`,
                      height: `${cardSize.height}px`,
                      transformStyle: "preserve-3d",
                      zIndex: transform.zIndex,
                      transform: `translateX(${transform.x}px) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
                      opacity: transform.opacity,
                      filter: `blur(${transform.blur}px)`,
                    }}
                    onClick={() => {
                      if (!isCurrent) {
                        goToSlide(
                          (currentIndex + item.position + products.length) %
                            products.length,
                        );
                      }
                    }}
                  >
                    <div className="relative w-full h-full">
                      {/* Divine Glow for current item */}
                      {isCurrent && (
                        <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-amber-400/15 via-purple-400/10 to-amber-400/15 rounded-2xl blur-xl" />
                      )}

                      {/* Product Card */}
                      <div
                        className={`relative w-full h-full rounded-xl sm:rounded-2xl border shadow-xl overflow-hidden transition-all duration-300 ${
                          isCurrent
                            ? "bg-gradient-to-br from-indigo-900/95 via-purple-900/90 to-blue-900/95 border-amber-400/40 shadow-amber-500/10"
                            : "bg-gradient-to-br from-indigo-900/70 to-purple-900/70 border-white/10"
                        }`}
                      >
                        {/* Card Header */}
                        {isCurrent && (
                          <div className="absolute top-0 left-0 right-0 h-8 sm:h-10 bg-gradient-to-b from-amber-400/15 to-transparent flex items-center justify-center z-10">
                            <span className="text-[10px] sm:text-xs text-amber-200/90 font-medium tracking-wide flex items-center gap-1">
                              <IoSparkles /> Divine Selection <IoSparkles />
                            </span>
                          </div>
                        )}

                        {/* Product Image */}
                        <div className="p-2 sm:p-3 lg:p-4 h-full flex items-center justify-center">
                          <img
                            src={imageUrl}
                            alt={item.title}
                            className="w-full h-full object-contain rounded-lg drop-shadow-lg"
                            style={{
                              maxWidth: `${cardSize.width - 24}px`,
                              maxHeight: `${cardSize.height - 40}px`,
                            }}
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23312e81'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23a5b4fc' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        </div>

                        {/* Card Footer - Only for current */}
                        {isCurrent && (
                          <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-14 bg-gradient-to-t from-indigo-950/95 via-indigo-900/80 to-transparent flex items-end justify-center pb-2 sm:pb-3">
                            <div className="flex gap-0.5 sm:gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400"
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Subtle inner glow for non-current cards */}
                        {!isCurrent && (
                          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/30 to-transparent pointer-events-none" />
                        )}
                      </div>

                      {/* Reflection Effect - Hidden on mobile for performance */}
                      {isCurrent && windowWidth >= 768 && (
                        <div
                          className="absolute top-full left-0 w-full h-16 opacity-15 pointer-events-none hidden sm:block"
                          style={{
                            background: `linear-gradient(to bottom, ${colorTheme.primary}40 0%, transparent 100%)`,
                            transform: "scaleY(-1) translateY(-16px)",
                            filter: "blur(4px)",
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-30">
          <div className="flex gap-2">
            {products.map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => goToSlide(index)}
                className={`appearance-none p-0 m-0 border-0 min-w-0 min-h-0 leading-none text-[0px] shrink-0 touch-manipulation transition-all duration-300 md:hover:scale-125 ${
                  index === currentIndex
                    ? "w-8 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                    : "w-2 h-2 rounded-full bg-amber-400/30 md:hover:bg-amber-400/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Sanskrit Quote */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-xs hidden lg:block text-amber-200/40 font-sanskrit">
            bhaktyā mām abhijānāti yāvān yaśh chāsmi tattvataḥ tato māṁ tattvato
            jñātvā viśhate tad-anantaram
          </p>
        </div>
      </div>
    </section>
  );
};

export default CarouselSlider;
