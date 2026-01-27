import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import axios from "axios";
import placeholderImg from "../../Media/placeholder.png";
import { useAuth } from "../../Context/AuthContext";
import { useCart } from "../../Context/CartContext";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const testimonials = [
  {
    name: "Sarah Mitchell",
    rating: 5,
    comment:
      "This sacred item has brought incredible peace to my daily meditation practice. The divine energy is truly palpable.",
    location: "California, USA",
    verified: true,
  },
  {
    name: "Michael Chen",
    rating: 5,
    comment:
      "Amazing quality and the spiritual connection is real. The craftsmanship from Nepal is extraordinary.",
    location: "New York, USA",
    verified: true,
  },
  {
    name: "Emily Johnson",
    rating: 5,
    comment:
      "Beautiful authentic piece! Fast shipping and excellent packaging. Highly recommend Krishnova.",
    location: "Texas, USA",
    verified: true,
  },
];

export default function SingleProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;
  const { user } = useAuth();
  const { addToCart } = useCart();

  // Refs for GSAP animations
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const infoRef = useRef(null);
  const featuresRef = useRef([]);
  const benefitsRef = useRef([]);
  const stepsRef = useRef([]);

  const [product, setProduct] = useState(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [mediaList, setMediaList] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageZoom, setImageZoom] = useState(false);
  const [selectedTab, setSelectedTab] = useState("description");

  // Review state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Add smooth scrolling CSS
  useEffect(() => {
    // Add smooth scroll behavior to html
    document.documentElement.style.scrollBehavior = "smooth";

    // Optional: Add custom smooth scrolling with Lenis or custom implementation
    const smoothScroll = () => {
      document.documentElement.style.scrollBehavior = "smooth";
      document.body.style.scrollBehavior = "smooth";
    };

    smoothScroll();

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.scrollBehavior = "auto";
    };
  }, []);

  // Dynamic SEO Implementation
  useEffect(() => {
    if (product) {
      // Set dynamic title with product name
      document.title = `${product.title} | Krishnova - Authentic Krishna Spiritual Products`;

      // Update meta description
      const metaDescription = document.querySelector(
        'meta[name="description"]',
      );
      const description = `Buy authentic ${product.title} - ${
        product.desc || product.fullDescription
      }. Handcrafted in Nepal, blessed by priests. Free US shipping on orders over $99. ⭐ ${
        product.rating || 5
      }/5 rating.`;

      if (metaDescription) {
        metaDescription.content = description;
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = description;
        document.head.appendChild(meta);
      }

      // Add Open Graph tags for social sharing
      const ogTags = [
        { property: "og:title", content: `${product.title} | Krishnova` },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: window.location.href },
        { property: "og:image", content: getMediaUrl(mediaList[0]?.src) },
        { property: "product:price:amount", content: product.price },
        { property: "product:price:currency", content: "USD" },
      ];

      ogTags.forEach((tag) => {
        let element = document.querySelector(
          `meta[property="${tag.property}"]`,
        );
        if (!element) {
          element = document.createElement("meta");
          element.setAttribute("property", tag.property);
          document.head.appendChild(element);
        }
        element.content = tag.content;
      });

      // Structured data for rich snippets
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.fullDescription || product.desc,
        image: mediaList.map((m) => getMediaUrl(m.src)),
        brand: {
          "@type": "Brand",
          name: "Krishnova",
        },
        offers: {
          "@type": "Offer",
          url: window.location.href,
          priceCurrency: "USD",
          price: product.price,
          priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: "Krishnova",
          },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: {
              "@type": "MonetaryAmount",
              value: product.price >= 99 ? "0" : "9.99",
              currency: "USD",
            },
            shippingDestination: {
              "@type": "DefinedRegion",
              addressCountry: "US",
            },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: {
                "@type": "QuantitativeValue",
                minValue: 0,
                maxValue: 1,
                unitCode: "DAY",
              },
              transitTime: {
                "@type": "QuantitativeValue",
                minValue: 2,
                maxValue: 5,
                unitCode: "DAY",
              },
            },
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating || 5,
          reviewCount: product.numReviews || product.reviews?.length || 1,
        },
        review:
          product.reviews?.map((review) => ({
            "@type": "Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: review.rating,
            },
            author: {
              "@type": "Person",
              name: review.name,
            },
            reviewBody: review.comment,
          })) || [],
      };

      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(structuredData);
    }

    return () => {
      // Cleanup
      document.title = "Krishnova - Authentic Krishna Spiritual Products";
    };
  }, [product, mediaList]);

  // GSAP Animations - Fixed version without ScrollTo
  useEffect(() => {
    if (!loading && product && mainRef.current) {
      // Clear any existing ScrollTriggers
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Create context for cleanup
      const ctx = gsap.context(() => {
        // Hero section parallax - simplified
        if (heroRef.current) {
          gsap.fromTo(
            ".hero-bg-pattern",
            { y: 0 },
            {
              y: -100,
              ease: "none",
              scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        // Product image entrance
        if (imageRef.current) {
          gsap.fromTo(
            imageRef.current,
            {
              opacity: 0,
              scale: 0.8,
              rotationY: -45,
            },
            {
              opacity: 1,
              scale: 1,
              rotationY: 0,
              duration: 1.2,
              ease: "power3.out",
              clearProps: "all",
            },
          );
        }

        // Product info stagger animation
        const infoItems = document.querySelectorAll(".product-info-item");
        if (infoItems.length > 0) {
          gsap.fromTo(
            infoItems,
            {
              opacity: 0,
              x: 50,
              skewY: 2,
            },
            {
              opacity: 1,
              x: 0,
              skewY: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
              clearProps: "all",
            },
          );
        }

        // Features animation
        featuresRef.current.forEach((el, index) => {
          if (el) {
            ScrollTrigger.create({
              trigger: el,
              start: "top bottom-=100",
              onEnter: () => {
                gsap.fromTo(
                  el,
                  {
                    opacity: 0,
                    x: -50,
                    scale: 0.9,
                  },
                  {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: "power3.out",
                    clearProps: "all",
                  },
                );
              },
              once: true,
            });
          }
        });

        // Benefits floating animation - simplified
        benefitsRef.current.forEach((el, index) => {
          if (el) {
            gsap.to(el, {
              y: -5,
              duration: 2,
              ease: "power1.inOut",
              repeat: -1,
              yoyo: true,
              delay: index * 0.2,
            });
          }
        });

        // Steps timeline animation
        const stepsSection = document.querySelector(".steps-section");
        if (stepsSection && stepsRef.current.length > 0) {
          ScrollTrigger.create({
            trigger: stepsSection,
            start: "top center",
            onEnter: () => {
              stepsRef.current.forEach((el, index) => {
                if (el) {
                  gsap.fromTo(
                    el,
                    {
                      opacity: 0,
                      y: 50,
                      scale: 0.8,
                    },
                    {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      duration: 0.5,
                      delay: index * 0.15,
                      ease: "back.out(1.7)",
                      clearProps: "all",
                    },
                  );
                }
              });
            },
            once: true,
          });
        }

        // Text animation for title - simplified
        const titleElement = document.querySelector(".product-title");
        if (titleElement && product.title) {
          titleElement.textContent = product.title;
          gsap.fromTo(
            titleElement,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
          );
        }
      }, mainRef);

      // Cleanup function
      return () => {
        ctx.revert();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }
  }, [loading, product]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}/products/${id}`);
        setProduct(res.data);
        const images = res.data.images || [];
        const videos = res.data.videos || [];
        setMediaList([
          ...images.map((img) => ({ type: "image", src: img })),
          ...videos.map((vid) => ({ type: "video", src: vid })),
        ]);
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id, baseUrl, reviewSuccess]);

  const getMediaUrl = (mediaPath) => {
    if (!mediaPath) return placeholderImg;
    return `${baseUrl.replace("/api", "")}${mediaPath}`;
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
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
        },
      );
    }

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/checkout");
  };

  // Review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${baseUrl}/products/${id}/reviews`,
        { rating: reviewRating, comment: reviewComment },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setReviewSuccess(true);
      setReviewRating(0);
      setReviewComment("");
      setTimeout(() => setReviewSuccess(false), 2000);
    } catch (err) {
      setReviewError(
        err.response?.data?.message ||
          "Failed to submit review. You may have already reviewed this product.",
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Star rating component
  const StarRating = ({
    rating,
    setRating,
    editable = false,
    size = "text-sm",
  }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.span
          key={star}
          className={`${size} cursor-pointer transition-all duration-200 ${
            star <= rating ? "text-amber-400" : "text-amber-400/30"
          } ${editable ? "hover:text-amber-300" : ""}`}
          onClick={editable ? () => setRating(star) : undefined}
          whileHover={editable ? { scale: 1.2 } : {}}
          whileTap={editable ? { scale: 0.9 } : {}}
        >
          ★
        </motion.span>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <motion.div
            className="w-24 h-24 mx-auto mb-6"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity },
            }}
          >
            <div className="w-full h-full rounded-full border-4 border-amber-400/30 border-t-amber-400 animate-spin" />
          </motion.div>
          <p className="text-amber-200 text-lg animate-pulse">
            Loading divine wisdom...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-6xl mb-6"
          >
            🔍
          </motion.div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
            Product not found
          </h2>
          <p className="text-blue-100/80 mb-8">
            The sacred item you're looking for doesn't exist in our divine
            collection.
          </p>
          <motion.button
            onClick={() => navigate(-1)}
            className="group relative px-8 py-4 overflow-hidden rounded-full shadow-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
            <span className="relative text-white font-semibold">
              Return to Collection
            </span>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div ref={mainRef} className="min-h-screen relative">
      {/* Hero Product Section */}
      <section ref={heroRef} className="relative pt-20 pb-16 overflow-hidden">
        {/* Background Patterns */}
        <div className="hero-bg-pattern absolute inset-0 pointer-events-none">
          {/* <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          /> */}
          {/* <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
              linear-gradient(to right, #fbbf24 1px, transparent 1px),
              linear-gradient(to bottom, #fbbf24 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          /> */}
        </div>

        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 blur-3xl pointer-events-none"
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

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-amber-200 hover:text-amber-300 font-semibold mb-8 group"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -8 }}
          >
            <span className="text-xl group-hover:-translate-x-2 transition-transform">
              ←
            </span>
            <span>Back to Divine Collection</span>
          </motion.button>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Product Media */}
            <motion.div
              ref={imageRef}
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Sacred Badge */}
              <motion.div
                className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 rounded-full px-5 py-2.5 shadow-lg">
                  <span className="text-amber-300 animate-pulse text-lg">
                    ✦
                  </span>
                  <span className="text-amber-100 font-medium tracking-wide text-sm">
                    Blessed & Authentic
                  </span>
                  <span className="text-amber-300 animate-pulse text-lg">
                    ✦
                  </span>
                </div>
              </motion.div>

              {/* Main Product Display */}
              <motion.div
                className="aspect-square backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-3xl overflow-hidden shadow-2xl border border-white/20 hover:border-amber-400/50 transition-all duration-300 flex items-center justify-center relative group cursor-zoom-in"
                whileHover={{ scale: 1.02 }}
                onClick={() => setImageZoom(!imageZoom)}
              >
                {mediaList.length > 0 ? (
                  mediaList[activeMediaIndex].type === "image" ? (
                    <motion.img
                      src={getMediaUrl(mediaList[activeMediaIndex].src)}
                      alt={product.title}
                      className="w-full h-full object-contain p-8"
                      animate={{
                        scale: imageZoom ? 1.5 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <video
                      src={getMediaUrl(mediaList[activeMediaIndex].src)}
                      controls
                      className="w-full h-full object-contain p-8"
                    />
                  )
                ) : (
                  <img
                    src={placeholderImg}
                    alt="placeholder"
                    className="w-full h-full object-contain p-8 opacity-80"
                  />
                )}

                {/* Divine Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-400/10 via-transparent to-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                {/* Floating Krishna Elements */}
                <motion.div
                  className="absolute top-4 left-4 text-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  🦚
                </motion.div>
                <motion.div
                  className="absolute bottom-4 right-4 text-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🪈
                </motion.div>
              </motion.div>

              {/* Media Thumbnails */}
              <div className="flex gap-3 mt-6 justify-center overflow-x-auto pb-2">
                {mediaList.map((media, index) => (
                  <motion.button
                    key={index}
                    className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all backdrop-blur-md ${
                      activeMediaIndex === index
                        ? "border-amber-400 scale-110 shadow-lg shadow-amber-400/30"
                        : "border-white/20 hover:border-amber-400/50 bg-white/5"
                    }`}
                    onClick={() => setActiveMediaIndex(index)}
                    whileHover={{
                      scale: activeMediaIndex === index ? 1.1 : 1.05,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {media.type === "image" ? (
                      <img
                        src={getMediaUrl(media.src)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center">
                        <span className="text-2xl">▶️</span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <div ref={infoRef} className="space-y-8">
              <div className="product-info-item">
                <motion.span
                  className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md border border-purple-400/30 text-purple-200 rounded-full text-sm font-semibold mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  🕉️ KRISHNOVA EXCLUSIVE
                </motion.span>

                <h1 className="product-title text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent leading-tight mb-4">
                  {product.title}
                </h1>

                <p className="text-amber-200/80 text-sm italic mb-4">
                  कृष्णं वन्दे जगद्गुरुम् • Handcrafted with devotion in Nepal
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <StarRating rating={product.rating || 5} size="text-xl" />
                  <span className="text-cyan-300 font-medium">
                    ({product.numReviews || product.reviews?.length || 0}{" "}
                    verified reviews)
                  </span>
                  <div className="h-6 w-px bg-amber-400/30"></div>
                  {product.inStock ? (
                    <span className="text-sm text-green-400 font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      In Stock • Ships from USA
                    </span>
                  ) : (
                    <span className="text-sm text-red-400 font-semibold">
                      Out of Stock
                    </span>
                  )}
                </div>

                <p className="text-lg text-blue-100/80 leading-relaxed">
                  {product.fullDescription || product.desc}
                </p>
              </div>

              {/* Pricing */}
              <div className="product-info-item">
                <div className="flex flex-wrap items-center gap-6 py-6 border-y border-amber-400/20">
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-bold text-amber-300">
                      ${product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <>
                        <span className="text-xl text-blue-100/50 line-through">
                          ${product.originalPrice}
                        </span>
                        <motion.span
                          className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Save ${product.originalPrice - product.price}
                        </motion.span>
                      </>
                    )}
                  </div>
                </div>

                {/* Free Shipping Badge */}
                {product.price >= 99 && (
                  <motion.div
                    className="mt-4 inline-flex items-center gap-2 text-cyan-300 text-sm font-semibold"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <span className="text-lg">🚚</span>
                    <span>FREE US SHIPPING on this item!</span>
                  </motion.div>
                )}
              </div>

              {/* Tabs for Description/Features/Shipping */}
              <div className="product-info-item">
                <div className="flex gap-4 mb-6 border-b border-amber-400/20">
                  {["description", "features", "shipping"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`pb-3 px-4 font-semibold capitalize transition-all ${
                        selectedTab === tab
                          ? "text-amber-300 border-b-2 border-amber-400"
                          : "text-blue-100/60 hover:text-amber-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-blue-100/80"
                  >
                    {selectedTab === "description" && (
                      <div className="space-y-4">
                        <p>{product.fullDescription || product.desc}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {["Handmade", "Blessed", "Authentic", "Sacred"].map(
                            (tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 rounded-full text-xs text-amber-200"
                              >
                                {tag}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                    {selectedTab === "features" && (
                      <ul className="space-y-3">
                        {(
                          product.features || [
                            "Handcrafted by skilled artisans in Nepal",
                            "Blessed by authentic Hindu priests",
                            "Made from premium quality materials",
                            "Includes certificate of authenticity",
                            "Sacred mantras inscribed",
                          ]
                        ).map((feature, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <span className="text-amber-400 mt-1">✦</span>
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    )}
                    {selectedTab === "shipping" && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <span className="text-green-400">✓</span>
                          <div>
                            <p className="font-semibold text-amber-200">
                              Fast US Shipping
                            </p>
                            <p className="text-sm">
                              2-5 business days via USPS/UPS
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-green-400">✓</span>
                          <div>
                            <p className="font-semibold text-amber-200">
                              Free Shipping
                            </p>
                            <p className="text-sm">On all orders over $99</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-green-400">✓</span>
                          <div>
                            <p className="font-semibold text-amber-200">
                              Secure Packaging
                            </p>
                            <p className="text-sm">
                              Each item carefully wrapped with divine care
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Quantity and Actions */}
              <div className="product-info-item space-y-6">
                <div className="flex items-center gap-6">
                  <span className="font-semibold text-amber-200">
                    Quantity:
                  </span>
                  <div className="flex items-center backdrop-blur-md bg-white/5 border border-amber-400/30 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-6 py-3 hover:bg-amber-400/10 transition-colors text-amber-200 font-bold text-xl"
                    >
                      −
                    </button>
                    <span className="px-8 py-3 font-bold border-x border-amber-400/30 text-amber-300 text-xl min-w-[80px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-6 py-3 hover:bg-amber-400/10 transition-colors text-amber-200 font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-lg text-cyan-300 font-semibold">
                    Total: ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    onClick={handleBuyNow}
                    className="group relative flex-1 px-8 py-4 overflow-hidden rounded-full shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                    <span className="relative text-white font-bold text-lg flex items-center justify-center gap-2">
                      <span>🛒</span> Buy Now - $
                      {(product.price * quantity).toFixed(2)}
                    </span>
                  </motion.button>
                  <motion.button
                    onClick={handleAddToCart}
                    className="flex-1 px-8 py-4 border-2 border-amber-400/50 text-amber-200 rounded-full font-bold text-lg backdrop-blur-md bg-white/5 hover:bg-amber-400/10 hover:border-amber-400 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add to Sacred Cart
                  </motion.button>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-amber-400/20">
                  {[
                    {
                      icon: "✓",
                      text: "Free Returns",
                      color: "text-green-400",
                    },
                    {
                      icon: "🔒",
                      text: "Secure Checkout",
                      color: "text-cyan-400",
                    },
                    {
                      icon: "🪔",
                      text: "Blessed Items",
                      color: "text-amber-400",
                    },
                    { icon: "📿", text: "Authentic", color: "text-purple-400" },
                  ].map((badge, index) => (
                    <motion.div
                      key={index}
                      className={`flex items-center gap-2 ${badge.color} font-semibold text-sm`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                    >
                      <span className="text-lg">{badge.icon}</span>
                      <span>{badge.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features and Benefits Section */}
      <section className="py-24 relative">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, #fbbf24 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-6">
              Sacred Features & Divine Benefits
            </h2>
            <p className="text-cyan-300 max-w-3xl mx-auto text-xl">
              Discover the transformative power that makes this spiritual
              companion truly special
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-amber-200 mb-8 flex items-center gap-3">
                <span>✨</span>
                Divine Features:
              </h3>
              {(
                product.features || [
                  "Handcrafted by skilled Nepalese artisans",
                  "Blessed in sacred temples by Hindu priests",
                  "Made from ethically sourced materials",
                  "Includes certificate of authenticity",
                  "Sacred mantras and symbols inscribed",
                ]
              ).map((feature, index) => (
                <motion.div
                  key={index}
                  ref={(el) => (featuresRef.current[index] = el)}
                  className="flex items-start gap-4 p-6 backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 hover:border-amber-400/50 transition-all duration-300"
                  whileHover={{ scale: 1.02, x: 10 }}
                >
                  <span className="text-green-400 text-2xl mt-1 flex-shrink-0">
                    ✓
                  </span>
                  <span className="text-blue-100/80 font-medium text-lg leading-relaxed">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="relative">
              <div className="backdrop-blur-md bg-gradient-to-br from-amber-400/10 to-orange-500/10 rounded-3xl p-10 border border-amber-400/30 shadow-2xl">
                <h3 className="text-2xl font-bold text-amber-200 mb-8 flex items-center gap-3">
                  <span>🌟</span>
                  Spiritual Benefits:
                </h3>
                <ul className="space-y-6">
                  {(
                    product.benefits || [
                      "Enhances daily meditation and prayer practice",
                      "Creates sacred space in your home",
                      "Connects you with divine Krishna consciousness",
                      "Brings peace and spiritual protection",
                      "Strengthens devotional practice",
                    ]
                  ).map((benefit, index) => (
                    <motion.li
                      key={index}
                      ref={(el) => (benefitsRef.current[index] = el)}
                      className="flex items-start gap-4"
                    >
                      <span className="text-cyan-400 mt-1 text-2xl flex-shrink-0">
                        ✨
                      </span>
                      <span className="leading-relaxed text-lg font-medium text-blue-100/80">
                        {benefit}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="steps-section py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-6">
              Your Spiritual Journey
            </h2>
            <p className="text-cyan-300 max-w-3xl mx-auto text-xl">
              Experience the divine connection through authentic Himalayan
              spirituality
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Order Your Sacred Item",
                desc: "Choose from our blessed collection",
                icon: "🛒",
                color: "from-amber-400 to-orange-500",
              },
              {
                step: "2",
                title: "Fast US Delivery",
                desc: "Receive in 2-5 business days",
                icon: "📦",
                color: "from-orange-500 to-amber-500",
              },
              {
                step: "3",
                title: "Unbox with Reverence",
                desc: "Each item carefully blessed & packed",
                icon: "🎁",
                color: "from-amber-500 to-yellow-500",
              },
              {
                step: "4",
                title: "Experience Divine Energy",
                desc: "Feel the sacred presence daily",
                icon: "✨",
                color: "from-yellow-500 to-amber-400",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                ref={(el) => (stepsRef.current[index] = el)}
                className="text-center relative"
              >
                <div className="relative mb-8">
                  <motion.div
                    className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-xl border-4 border-white/20`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {step.step}
                  </motion.div>
                  <motion.div
                    className="absolute -top-3 -right-3 text-3xl"
                    animate={{
                      y: [0, -5, 0],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  >
                    {step.icon}
                  </motion.div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-amber-400/50 to-transparent"></div>
                  )}
                </div>
                <h3 className="font-bold text-amber-200 text-xl mb-3">
                  {step.title}
                </h3>
                <p className="text-blue-100/80 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, #fbbf24 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-6">
              Sacred Testimonials
            </h2>
            <p className="text-cyan-300 max-w-3xl mx-auto text-xl">
              Hear from our blessed community members across America
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-white/20 hover:border-amber-400/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={testimonial.rating} size="text-lg" />
                  {testimonial.verified && (
                    <span className="text-green-400 text-sm font-semibold">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-blue-100/80 leading-relaxed mb-6 text-lg italic">
                  "{testimonial.comment}"
                </p>
                <div className="border-t border-amber-400/20 pt-4">
                  <p className="font-bold text-amber-200">{testimonial.name}</p>
                  <p className="text-cyan-300 text-sm">
                    {testimonial.location}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-12 text-center">
            Community Reviews
          </h3>

          {/* List reviews */}
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-6 mb-16">
              {product.reviews.map((review, idx) => (
                <motion.div
                  key={idx}
                  className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl shadow-lg p-8 border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <span className="font-bold text-amber-200 text-lg">
                      {review.name}
                    </span>
                    <StarRating rating={review.rating} size="text-lg" />
                    <span className="text-blue-100/60 text-sm sm:ml-auto">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-blue-100/80 leading-relaxed text-lg">
                    {review.comment}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-blue-100/60 text-center mb-16 text-lg backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
              No reviews yet. Be the first to share your divine experience!
            </div>
          )}

          {/* Leave a review */}
          {user ? (
            <motion.form
              onSubmit={handleReviewSubmit}
              className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-white/20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h4 className="text-2xl font-bold mb-6 text-amber-200 flex items-center gap-3">
                <span>✍️</span>
                Share Your Sacred Experience
              </h4>
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                <span className="font-semibold text-amber-200 text-lg">
                  Your Rating:
                </span>
                <StarRating
                  rating={reviewRating}
                  setRating={setReviewRating}
                  editable
                  size="text-2xl"
                />
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full backdrop-blur-md bg-white/5 border border-amber-400/30 rounded-xl p-4 mb-6 text-blue-100 placeholder-blue-100/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all resize-none"
                placeholder="Share your thoughts about this sacred item..."
                rows="4"
                required
              />
              <motion.button
                type="submit"
                className="group relative px-8 py-4 overflow-hidden rounded-full shadow-2xl disabled:opacity-50"
                disabled={reviewSubmitting || !reviewRating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                <span className="relative text-white font-bold">
                  {reviewSubmitting ? "Sharing..." : "Share Review"}
                </span>
              </motion.button>
              {reviewError && (
                <motion.div
                  className="mt-4 text-red-400 font-semibold bg-red-400/10 border border-red-400/30 rounded-lg p-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {reviewError}
                </motion.div>
              )}
              {reviewSuccess && (
                <motion.div
                  className="mt-4 text-green-400 font-semibold bg-green-400/10 border border-green-400/30 rounded-lg p-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  Thank you! Your review has been shared with our divine
                  community.
                </motion.div>
              )}
            </motion.form>
          ) : (
            <div className="text-center">
              <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-white/20">
                <p className="text-blue-100/80 text-lg mb-4">
                  Please login to share your divine experience with our
                  community
                </p>
                <motion.button
                  onClick={() => navigate("/login")}
                  className="group relative px-8 py-3 overflow-hidden rounded-full shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                  <span className="relative text-white font-semibold">
                    Login to Review
                  </span>
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="success-notification fixed top-24 right-6 backdrop-blur-md bg-gradient-to-br from-green-500/90 to-green-600/90 text-white px-8 py-4 rounded-xl shadow-2xl z-50 border border-green-400/50 max-w-sm"
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
          >
            <div className="flex items-center gap-3">
              <motion.span
                className="text-2xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.5 }}
              >
                ✓
              </motion.span>
              <span className="font-semibold">
                Added to sacred cart successfully!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
