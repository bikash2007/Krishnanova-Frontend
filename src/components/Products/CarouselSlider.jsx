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
  ShoppingCart,
  Heart,
  Eye,
  Check,
  Flame,
  BadgeCheck,
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
  const [originalCount, setOriginalCount] = useState(0);
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
        // Fetch only the 3 latest products
        const response = await axios.get(`${baseUrl}/products?limit=3&sort=latest`);
        if (!isMounted) return;

        let fetchedProducts = response.data;

        if (!Array.isArray(fetchedProducts) || fetchedProducts.length === 0) {
          throw new Error("No products available");
        }

        // Slice to max 3 just to be safe
        fetchedProducts = fetchedProducts.slice(0, 3);
        const origCount = fetchedProducts.length;

        // Duplicate to ensure enough slides for the coverflow carousel
        const original = [...fetchedProducts];
        while (fetchedProducts.length < 8) {
          fetchedProducts = [...fetchedProducts, ...original];
        }

        if (isMounted) setOriginalCount(origCount);
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

  const productBenefits = useMemo(() => {
    if (!currentProduct) return [];

    const parsed = String(currentProduct.desc || "")
      .split(/[\n,.;|]+/)
      .map((part) => part.trim())
      .filter((part) => part.length >= 10)
      .slice(0, 4);

    if (parsed.length >= 3) return parsed;

    return [
      "Handpicked devotional quality",
      "Portable everyday spiritual companion",
      "Gift-ready and easy to carry",
      "Ideal for prayer, satsang, and events",
    ];
  }, [currentProduct]);

  if (loading) {
    return (
      <section className="md:min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-violet-50/30 relative overflow-hidden">
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
          <p className="font-semibold text-lg sm:text-xl text-slate-800">
            Loading Divine Collection...
          </p>
          <p className="text-sm text-slate-500 mt-3 tracking-wider">
            कृष्णम् वन्दे जगद्गुरुम्
          </p>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-violet-50/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="text-center px-6 relative z-10">
          <GiFlute className="text-6xl sm:text-7xl mb-6 text-amber-500 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent mb-3">
            Divine Collection Coming Soon
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Stay blessed • हरे कृष्ण
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {[
              <GiCandleLight key={0} />,
              <GiPrayerBeads key={1} />,
              <GiFeather key={2} />,
            ].map((icon, i) => (
              <span key={i} className="text-2xl text-amber-500">
                {icon}
              </span>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      ref={containerRef}
      className="relative md:min-h-[100dvh] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-violet-50/30"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-5 py-2.5 bg-white text-[#2f0f74] rounded-full border border-violet-200 shadow-xl flex items-center gap-2 backdrop-blur">
          <ShoppingBag className="w-5 h-5" />
          <span className="font-medium">Added to cart!</span>
        </div>
      )}

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_34%_50%,rgba(139,92,246,0.08),transparent_42%)]" />
      </div>

      <div className="relative md:min-h-[100dvh] px-4 sm:px-6 lg:px-10 py-10 lg:py-12 z-10">
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3 rounded-full bg-white/90 border border-violet-300 shadow-lg transition-all duration-300 group disabled:opacity-40 hover:bg-white hover:border-violet-400 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-violet-700 group-hover:text-violet-900 transition-colors" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-50 p-2.5 sm:p-3 rounded-full bg-white/90 border border-violet-300 shadow-lg transition-all duration-300 group disabled:opacity-40 hover:bg-white hover:border-violet-400 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-violet-700 group-hover:text-violet-900 transition-colors" />
        </button>

        <div className="w-full lg:max-w-7xl mx-auto lg:grid lg:grid-cols-12 lg:items-center gap-8 sm:gap-12 lg:gap-6 xl:gap-10">
          {/* Product Content */}
          <motion.div
            className="lg:col-span-5 text-center lg:text-left order-2 lg:order-1 lg:pr-8 relative z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            {currentProduct && (
              <div
                key={`info-${currentProduct._id}`}
                className="space-y-5 lg:space-y-6"
              >
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-200 text-violet-700 bg-violet-50 text-xs font-medium tracking-wide backdrop-blur-sm">
                    <BadgeCheck className="w-3.5 h-3.5 text-violet-500" />
                    Best Seller
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.35rem] font-extrabold text-slate-950 leading-[1.07] tracking-tight max-w-xl mx-auto lg:mx-0 drop-shadow-sm">
                  {currentProduct.shortTitle || currentProduct.title}
                </h1>

                <ul className="space-y-2.5 text-sm sm:text-base font-medium text-slate-700 max-w-md mx-auto lg:mx-0 leading-relaxed">
                  {productBenefits.slice(0, 3).map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2.5 text-left"
                    >
                      <Check className="w-4 h-4 mt-1 text-violet-500 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-[#00A97E] rounded-full"></div>
                  <span className="text-[#00A97E] font-bold text-sm tracking-widest">IN STOCK</span>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col items-center lg:items-start p-3 bg-violet-50/40 rounded-2xl border border-violet-100/50">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
                      <span className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-[#6D28D9] tracking-tight">
                        ${currentProduct.price}
                      </span>
                      {currentProduct.originalPrice &&
                        currentProduct.originalPrice !== currentProduct.price && (
                          <>
                            <span className="text-xl sm:text-2xl font-medium line-through text-slate-400">
                              ${currentProduct.originalPrice}
                            </span>
                            <span className="px-3.5 py-1 bg-[#F43F5E] rounded-full text-sm text-white font-bold shadow-sm">
                              Save {Math.round(
                                ((currentProduct.originalPrice -
                                  currentProduct.price) /
                                  currentProduct.originalPrice) *
                                  100,
                              )}%
                            </span>
                          </>
                        )}
                    </div>
                    <div className="text-slate-400 text-[13px] font-medium mt-1">Price inclusive of all taxes</div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm text-slate-600">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm backdrop-blur-sm font-semibold">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-slate-800">4.8</span> <span className="text-slate-600">(1200 reviews)</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-orange-200 bg-orange-50 shadow-sm backdrop-blur-sm font-semibold text-orange-700">
                      <Flame className="w-4 h-4 text-orange-600" />
                      300+ sold today
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3.5 justify-center lg:justify-start pb-4 sm:pb-6 md:pb-0 w-full max-w-sm sm:max-w-md mx-auto lg:mx-0">
                  <motion.div
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full"
                  >
                    <button
                      onClick={() => handleAddToCart(currentProduct)}
                      className="w-full inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-[14px] bg-[#5B21B6] text-white font-bold text-base transition-all duration-300 shadow-md hover:bg-[#4C1D95]"
                    >
                      <ShoppingCart className="w-5 h-5 fill-transparent" />
                      Add to Cart
                    </button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full"
                  >
                    <Link
                      to={`/product/${currentProduct._id}`}
                      className="w-full inline-flex items-center justify-center px-6 sm:px-7 py-3.5 sm:py-4 rounded-[14px] bg-[#2E1065] text-white font-bold text-base transition-all duration-300 shadow-md hover:bg-[#1e084b]"
                    >
                      View Details — ${currentProduct.price}
                    </Link>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Product Display */}
          <motion.div
            className="lg:col-span-7 relative order-1 lg:order-2 mb-2 sm:mb-0 lg:translate-x-8 xl:translate-x-14 z-20"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.14 }}
          >
            <div
              className="relative w-full flex items-center justify-center"
              style={{
                height:
                  windowWidth < 480
                    ? "320px"
                    : windowWidth < 640
                      ? "370px"
                      : windowWidth < 1024
                        ? "450px"
                        : "520px",
                perspective: windowWidth < 640 ? "1000px" : "1700px",
                perspectiveOrigin: "center center",
              }}
            >
              <motion.div
                className="relative w-[235px] h-[295px] sm:w-[290px] sm:h-[360px] md:w-[340px] md:h-[420px] lg:w-[390px] lg:h-[490px]"
                animate={{ y: [0, -5, 0], rotate: [0, -0.8, 0] }}
                transition={{
                  duration: 6.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{ scale: 1.05, rotate: 1.4, y: -5 }}
              >
                <div className="absolute inset-x-8 -bottom-4 h-8 rounded-[50%] bg-[#3a148b]/30 blur-md" />

                <div className="relative w-full h-full rounded-[1.7rem] border border-violet-200 bg-white shadow-[0_45px_70px_-36px_rgba(67,19,142,0.45)] overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border border-violet-200 bg-white/95 text-violet-700">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </div>

                  <div className="h-full w-full p-5 sm:p-7 flex items-center justify-center">
                    <img
                      src={getImageUrl(currentProduct)}
                      alt={currentProduct?.title || "Product"}
                      className="w-full h-full object-contain drop-shadow-[0_22px_32px_rgba(67,19,142,0.26)]"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = placeholderImg;
                      }}
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-violet-100/50 to-transparent flex items-end justify-between px-4 pb-2.5">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 text-amber-300 fill-amber-300"
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-violet-700/90 font-medium">
                      Handcrafted finish
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Sanskrit Quote */}
        {/* <div className="absolute bottom-10 md:bottom-14 left-1/2 transform -translate-x-1/2 text-center w-full px-4 z-20">
          <p className="text-[10px] sm:text-xs text-violet-200/70 font-sanskrit italic tracking-wide whitespace-nowrap">
            bhaktyā mām abhijānāti yāvān yaśh chāsmi tattvataḥ
          </p>
        </div> */}

        {/* Indicators — show only original product count */}
        <div className="absolute bottom-4 md:bottom-7 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-30">
          <div className="flex gap-2">
            {Array.from({ length: originalCount || products.length }).map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => goToSlide(index)}
                className={`appearance-none p-0 m-0 border-0 min-w-0 min-h-0 leading-none text-[0px] shrink-0 touch-manipulation transition-all duration-300 md:hover:scale-125 ${
                  index === (currentIndex % (originalCount || products.length))
                    ? "w-7 h-2 rounded-full bg-violet-600"
                    : "w-2 h-2 rounded-full bg-slate-300 md:hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CarouselSlider;
