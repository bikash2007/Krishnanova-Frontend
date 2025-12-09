import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Star } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "../../Context/CartContext";

const CarouselSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

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

    // GSAP success animation
    const notification = document.querySelector(".success-notification");
    if (notification) {
      gsap.fromTo(
        notification,
        {
          scale: 0,
          rotation: -180,
          opacity: 0,
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        }
      );
    }

    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Throttle ref for mouse events
  const throttleRef = useRef(false);

  // Mouse parallax effect - throttled for performance
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (throttleRef.current) return;
      throttleRef.current = true;
      
      requestAnimationFrame(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setMousePosition({
            x: (e.clientX - rect.left - rect.width / 2) / 50,
            y: (e.clientY - rect.top - rect.height / 2) / 50,
          });
        }
        setTimeout(() => {
          throttleRef.current = false;
        }, 50);
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Responsive display products calculation
  const displayProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];

    const items = [];
    const getVisibleCount = () => {
      if (typeof window === "undefined") return 7;
      if (window.innerWidth < 640) return 3;
      if (window.innerWidth < 1024) return 5;
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
  }, [products, currentIndex]);

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
            images: ["/api/placeholder/400/400"],
          },
          {
            _id: "demo-2",
            title: "Peacock Feather Pendant",
            desc: "Handcrafted pendant with authentic peacock feather, symbol of Krishna's grace",
            price: 2499,
            originalPrice: 3499,
            images: ["/api/placeholder/400/400"],
          },
          {
            _id: "demo-3",
            title: "Sacred Flute Keychain",
            desc: "Miniature flute keychain carrying the melody of Krishna's divine music",
            price: 599,
            originalPrice: 899,
            images: ["/api/placeholder/400/400"],
          },
          {
            _id: "demo-4",
            title: "Bhagavad Gita - Premium Edition",
            desc: "Gold-embossed edition with Sanskrit verses and detailed commentary",
            price: 3999,
            originalPrice: 5999,
            images: ["/api/placeholder/400/400"],
          },
          {
            _id: "demo-5",
            title: "Radha Krishna Locket",
            desc: "Pure silver locket depicting eternal love of Radha and Krishna",
            price: 4599,
            originalPrice: 6999,
            images: ["/api/placeholder/400/400"],
          },
          {
            _id: "demo-6",
            title: "Vrindavan Incense Collection",
            desc: "Sacred fragrances from the holy land of Vrindavan",
            price: 799,
            originalPrice: 1199,
            images: ["/api/placeholder/400/400"],
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
    [currentIndex, isTransitioning, products.length]
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

  // 3D transform calculator
  const getCoverflowTransform = useCallback((position) => {
    const isCurrent = position === 0;
    const absPos = Math.abs(position);

    if (isCurrent) {
      return {
        x: 0,
        rotateY: 0,
        scale: 1.1,
        opacity: 1,
        zIndex: 100,
        blur: 0,
      };
    }

    const getSpacing = () => {
      if (typeof window === "undefined") return 160;
      if (window.innerWidth < 640) return 80;
      if (window.innerWidth < 1024) return 120;
      return 160;
    };

    const rotateY = position > 0 ? -45 : 45;
    const translateX = position * getSpacing();
    const scaleValue = Math.max(0.7, 1 - absPos * 0.15);
    const opacityValue = Math.max(0.5, 1 - absPos * 0.2);

    return {
      x: translateX,
      rotateY: rotateY,
      scale: scaleValue,
      opacity: opacityValue,
      zIndex: 100 - absPos * 10,
      blur: absPos * 2,
    };
  }, []);

  const getImageUrl = useCallback(
    (product) => {
      if (!product?.images?.length) return "/api/placeholder/400/400";
      const imagePath = product.images[0];
      return typeof imagePath === "string" && imagePath.startsWith("http")
        ? imagePath
        : `${baseUrl.replace("/api", "")}${imagePath}`;
    },
    [baseUrl]
  );

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
        <div className="text-center px-4">
          <div className="relative mb-6">
            {/* Animated Krishna Chakra Loader */}
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-amber-400/30 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-2 border-4 border-t-amber-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-purple-400/30 rounded-full animate-spin-reverse-slow"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🦚</span>
              </div>
            </div>
          </div>
          <p className="font-semibold text-lg text-amber-200 animate-pulse">
            Loading Divine Collection...
          </p>
          <p className="text-sm text-amber-200/60 mt-2">
            कृष्णम् वन्दे जगद्गुरुम्
          </p>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">🪈</div>
          <h2 className="text-2xl font-bold text-amber-200">
            Divine Collection Coming Soon
          </h2>
          <p className="text-amber-200/60 mt-2">Stay blessed</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Lotus Petals */}
        <div className="absolute top-1/4 left-1/4 animate-float-slow opacity-10">
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            className="text-pink-300"
          >
            <path d="M50 20 Q30 40 50 60 Q70 40 50 20" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-1/4 right-1/4 animate-float-slow animation-delay-2000 opacity-10">
          <svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            className="text-purple-300"
          >
            <path d="M50 20 Q30 40 50 60 Q70 40 50 20" fill="currentColor" />
          </svg>
        </div>

        {/* Mandala Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-[600px] h-[600px] border border-amber-400/20 rounded-full animate-spin-very-slow"></div>
            <div className="absolute inset-8 border border-amber-400/20 rounded-full animate-spin-reverse-slow"></div>
            <div className="absolute inset-16 border border-amber-400/20 rounded-full animate-spin-slow"></div>
          </div>
        </div>

        {/* Gradient Orbs */}
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-amber-400/10 to-transparent rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-purple-400/10 to-transparent rounded-full blur-3xl"
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
          }}
        ></div>
      </div>

      <div className="relative h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10">
        {/* Navigation Buttons */}
        <motion.button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-4 lg:left-8 z-50 p-3 rounded-full backdrop-blur-md bg-white/10 border border-amber-400/30 shadow-lg transition-all duration-200 group disabled:opacity-50 hover:bg-amber-400/20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-5 h-5 text-amber-200" />
        </motion.button>

        <motion.button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-4 lg:right-8 z-50 p-3 rounded-full backdrop-blur-md bg-white/10 border border-amber-400/30 shadow-lg transition-all duration-200 group disabled:opacity-50 hover:bg-amber-400/20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-5 h-5 text-amber-200" />
        </motion.button>

        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Product Info */}
          <div className="w-full lg:w-2/5 text-center lg:text-left order-2 lg:order-1 px-4 lg:px-0 lg:pr-8 z-40">
            <AnimatePresence mode="wait">
              {currentProduct && (
                <motion.div
                  key={`info-${currentProduct._id}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-6"
                >
                  {/* Sacred Badge */}
                  <motion.div
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 rounded-full px-4 py-2"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="text-sm font-medium text-amber-200 tracking-wider">
                      KRISHNA'S BLESSING
                    </span>
                    <span className="text-amber-300">✦</span>
                  </motion.div>

                  <motion.h1
                    className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {currentProduct.title}
                  </motion.h1>

                  <motion.p
                    className="text-base lg:text-lg leading-relaxed text-blue-100/80 max-w-md mx-auto lg:mx-0"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {currentProduct.desc}
                  </motion.p>

                  {/* Price Section */}
                  <motion.div
                    className="flex items-center justify-center lg:justify-start gap-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg text-amber-300">$</span>
                      <span className="text-3xl lg:text-4xl font-bold text-amber-300">
                        {currentProduct.price}
                      </span>
                    </div>
                    {currentProduct.originalPrice &&
                      currentProduct.originalPrice !== currentProduct.price && (
                        <>
                          <span className="text-xl line-through text-blue-200/40">
                            ${currentProduct.originalPrice}
                          </span>
                          <span className="px-2 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-xs text-green-300 font-semibold">
                            {Math.round(
                              ((currentProduct.originalPrice -
                                currentProduct.price) /
                                currentProduct.originalPrice) *
                                100
                            )}
                            % OFF
                          </span>
                        </>
                      )}
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    className="flex flex-wrap gap-4 justify-center lg:justify-start"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      to={`/product/${currentProduct._id}`}
                      className="group relative px-8 py-4 overflow-hidden rounded-full shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <span className="relative z-10 text-indigo-900 font-bold tracking-wide flex items-center gap-2">
                        View Divine Product
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </span>
                    </Link>

                    <button className="group px-6 py-4 border-2 border-amber-400/50 text-amber-200 rounded-full font-semibold backdrop-blur-md bg-white/5 hover:bg-amber-400/10 hover:border-amber-400 transform hover:-translate-y-1 transition-all duration-300">
                      <span
                        onClick={() => handleAddToCart(currentProduct)}
                        className="flex items-center gap-2"
                      >
                        <Star className="w-4 h-4" />
                        Add to Wishlist
                      </span>
                    </button>
                  </motion.div>

                  {/* Trust Badges */}
                  <motion.div
                    className="md:flex items-center hidden justify-center lg:justify-start gap-6 pt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="text-center">
                      <p className="text-2xl">🪔</p>
                      <p className="text-xs text-amber-200/60">Blessed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl">📿</p>
                      <p className="text-xs text-amber-200/60">Sacred</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl">🦚</p>
                      <p className="text-xs text-amber-200/60">Divine</p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3D Coverflow Display */}
          <div className="w-full lg:w-3/5 relative order-1 lg:order-2">
            <div
              className="relative w-full flex items-center justify-center"
              style={{
                height: "400px",
                perspective: "1200px",
                perspectiveOrigin: "center center",
              }}
            >
              <AnimatePresence>
                {displayProducts.map((item) => {
                  const transform = getCoverflowTransform(item.position);
                  const isCurrent = item.position === 0;
                  const imageUrl = getImageUrl(item);

                  const getCardSize = () => {
                    if (typeof window === "undefined")
                      return { width: 280, height: 280 };
                    if (window.innerWidth < 640)
                      return { width: 180, height: 180 };
                    if (window.innerWidth < 1024)
                      return { width: 220, height: 220 };
                    return { width: 280, height: 280 };
                  };

                  const cardSize = getCardSize();

                  return (
                    <motion.div
                      key={item.key}
                      className="absolute flex items-center justify-center cursor-pointer"
                      style={{
                        width: `${cardSize.width}px`,
                        height: `${cardSize.height}px`,
                        transformStyle: "preserve-3d",
                        zIndex: transform.zIndex,
                      }}
                      initial={{
                        x: item.position * 200,
                        rotateY: item.position * 60,
                        scale: 0.5,
                        opacity: 0,
                      }}
                      animate={{
                        x: transform.x,
                        rotateY: transform.rotateY,
                        scale: transform.scale,
                        opacity: transform.opacity,
                        filter: `blur(${transform.blur}px)`,
                      }}
                      exit={{
                        scale: 0.3,
                        opacity: 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      onClick={() => {
                        if (!isCurrent) {
                          goToSlide(
                            (currentIndex + item.position + products.length) %
                              products.length
                          );
                        }
                      }}
                      whileHover={
                        isCurrent
                          ? { scale: 1.15, rotateY: 0 }
                          : { scale: transform.scale * 1.05 }
                      }
                    >
                      <div className="relative w-full h-full">
                        {/* Divine Glow for current item */}
                        {isCurrent && (
                          <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/30 via-purple-400/30 to-amber-400/30 rounded-2xl blur-xl animate-pulse"></div>
                        )}

                        {/* Product Card */}
                        <div
                          className={`relative w-full h-full rounded-xl border-2 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300 ${
                            isCurrent
                              ? "bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-blue-900/90 border-amber-400/50"
                              : "bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border-white/20"
                          }`}
                        >
                          {/* Card Header */}
                          {isCurrent && (
                            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-amber-400/20 to-transparent flex items-center justify-center">
                              <span className="text-xs text-amber-200 font-medium">
                                ✨ Divine Selection ✨
                              </span>
                            </div>
                          )}

                          {/* Product Image */}
                          <div className="p-4 h-full flex items-center justify-center">
                            <motion.img
                              src={imageUrl}
                              alt={item.title}
                              className="w-full h-full object-contain rounded-lg"
                              style={{
                                maxWidth: `${cardSize.width - 40}px`,
                                maxHeight: `${cardSize.height - 60}px`,
                              }}
                              onError={(e) => {
                                e.target.src = "/api/placeholder/400/400";
                              }}
                              animate={
                                isCurrent
                                  ? {
                                      scale: [1, 1.02, 1],
                                    }
                                  : {}
                              }
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                          </div>

                          {/* Card Footer - Only for current */}
                          {isCurrent && (
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-indigo-900/90 to-transparent flex items-end justify-center pb-3">
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-3 h-3 text-amber-400 fill-amber-400"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Reflection Effect */}
                        {isCurrent && (
                          <div
                            className="absolute top-full left-0 w-full h-20 opacity-20 pointer-events-none"
                            style={{
                              background: `linear-gradient(to bottom, ${colorTheme.primary}40 0%, transparent 100%)`,
                              transform: "scaleY(-1) translateY(-20px)",
                              filter: "blur(4px)",
                            }}
                          />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-40">
          <div className="flex gap-2">
            {products.map((_, index) => (
              <motion.button
                key={`dot-${index}`}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                    : "w-2 h-2 rounded-full bg-amber-400/30 hover:bg-amber-400/50"
                }`}
                whileHover={{ scale: 1.2 }}
                animate={{
                  scale: index === currentIndex ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: index === currentIndex ? Infinity : 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Sanskrit Quote */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center mt-4 pt-10">
          <p className="text-xs hidden md:block text-amber-200/40 font-sanskrit mt-5">
            bhaktyā mām abhijānāti yāvān yaśh chāsmi tattvataḥ tato māṁ tattvato
            jñātvā viśhate tad-anantaram
          </p>
        </div>
      </div>
    </section>
  );
};

export default CarouselSlider;
