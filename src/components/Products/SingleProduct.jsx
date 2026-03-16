import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import placeholderImg from "../../Media/placeholder.png";
import { normalizeImageUrl } from "../../utils/imageUrl";
import { useAuth } from "../../Context/AuthContext";
import { useCart } from "../../Context/CartContext";
import {
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaShareAlt,
  FaPen,
  FaLeaf,
  FaGem,
  FaBoxOpen,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const API =
  import.meta.env.VITE_API_URL ||
  "https://krishnanova-backend.onrender.com/api";

// ── SEO ────────────────────────────────────────────────────────────────────
function useSEO(product, media) {
  useEffect(() => {
    if (!product) return;
    const title = product.title + " | Krishnova";
    const desc =
      (product.desc || "") + " — Authentic divine item from Krishnova.";
    const img = media[0]?.src || "";
    document.title = title;
    const setMeta = (sel, val) => {
      let el = document.querySelector(sel);
      if (!el) {
        el = document.createElement("meta");
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };
    setMeta('meta[name="description"]', desc);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', desc);
    setMeta('meta[property="og:type"]', "product");
    setMeta('meta[property="og:image"]', img);
    const ld = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      description: product.fullDescription || product.desc,
      image: media.map((x) => x.src),
      brand: { "@type": "Brand", name: "Krishnova" },
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: product.price,
        url: window.location.href,
        availability: product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating || 5,
        reviewCount: product.numReviews || product.reviews?.length || 1,
      },
    };
    let s = document.querySelector('script[type="application/ld+json"]');
    if (!s) {
      s = document.createElement("script");
      s.type = "application/ld+json";
      document.head.appendChild(s);
    }
    s.text = JSON.stringify(ld);
    return () => {
      document.title = "Krishnova";
    };
  }, [product, media]);
}

// ── Stars ──────────────────────────────────────────────────────────────────
function Stars({ rating = 0, size = "sm", interactive = false, onSet }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <FaStar
          key={n}
          onClick={interactive ? () => onSet(n) : undefined}
          className={[
            "transition-colors",
            size === "lg" ? "text-xl" : size === "md" ? "text-base" : "text-sm",
            interactive && "cursor-pointer hover:scale-110",
            n <= Math.round(rating) ? "text-amber-500" : "text-stone-200",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      ))}
    </span>
  );
}

// ── Related card ───────────────────────────────────────────────────────────
function RelatedCard({ p }) {
  const thumb = normalizeImageUrl(p.media?.[0]?.url || p.images?.[0]) || null;
  const off =
    p.originalPrice > p.price
      ? Math.round((1 - p.price / p.originalPrice) * 100)
      : 0;
  return (
    <Link to={"/product/" + p._id} className="group flex-shrink-0 w-48 sm:w-56">
      <div className="rounded-2xl overflow-hidden bg-white border border-stone-100/80 shadow-md group-hover:shadow-2xl group-hover:shadow-purple-900/20 group-hover:border-purple-300/60 group-hover:-translate-y-1 transition-all duration-300">
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-purple-50/60 to-violet-50/30 relative">
          {off > 0 && (
            <span className="absolute top-2 left-2 z-10 text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2 py-0.5 rounded-full shadow-sm">
              {off}% off
            </span>
          )}
          <img
            src={thumb || placeholderImg}
            alt={p.shortTitle || p.title}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-108"
            onError={(e) => {
              e.target.src = placeholderImg;
            }}
          />
        </div>
        <div className="px-4 py-3.5 border-t border-stone-100 space-y-1">
          <p className="text-[10px] tracking-widest text-purple-600 font-bold uppercase truncate">
            {p.category}
          </p>
          <p className="text-sm font-semibold text-stone-800 line-clamp-2 leading-snug group-hover:text-purple-700 transition-colors">
            {p.shortTitle || p.title}
          </p>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-base font-bold text-stone-900">
              ${p.price}
            </span>
            {off > 0 && (
              <span className="text-xs text-stone-400 line-through">
                ${p.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Accordion pane ─────────────────────────────────────────────────────────
function Pane({ label, open, onToggle, children, dark = false }) {
  return (
    <div
      className={
        "border-b last:border-b-0 " +
        (dark ? "border-white/10" : "border-stone-100")
      }
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span
          className={
            "text-xs font-bold tracking-[0.2em] uppercase transition-colors " +
            (open
              ? dark
                ? "text-amber-400"
                : "text-purple-700"
              : dark
                ? "text-purple-300/70 group-hover:text-purple-100"
                : "text-stone-500 group-hover:text-stone-800")
          }
        >
          {label}
        </span>
        <span
          className={
            "flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-sm font-light transition-all duration-300 select-none " +
            (open
              ? dark
                ? "border-amber-400 bg-amber-400 text-[#0c0120] rotate-45"
                : "border-purple-600 bg-purple-600 text-white rotate-45"
              : dark
                ? "border-purple-400/40 text-purple-400/60 group-hover:border-purple-300"
                : "border-stone-300 text-stone-400 group-hover:border-stone-500")
          }
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="open"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className={
                "pb-6 text-sm leading-8 " +
                (dark ? "text-purple-200/80" : "text-stone-600")
              }
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Thin gold divider ──────────────────────────────────────────────────────
function GoldDivider({ dark = false }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div
        className={
          "flex-1 h-px bg-gradient-to-r " +
          (dark
            ? "from-transparent via-amber-400/60 to-transparent"
            : "from-transparent via-amber-300 to-transparent")
        }
      />
      <FaGem
        className={
          dark ? "text-amber-400/80 text-[10px]" : "text-amber-400 text-[10px]"
        }
      />
      <div
        className={
          "flex-1 h-px bg-gradient-to-r " +
          (dark
            ? "from-transparent via-amber-400/60 to-transparent"
            : "from-transparent via-amber-300 to-transparent")
        }
      />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function SingleProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [media, setMedia] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);

  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(null);
  const [variant, setVariant] = useState(null);
  const [preOrder, setPreOrder] = useState(false);
  const [toast, setToast] = useState("");
  const [wish, setWish] = useState(false);

  const [zoom, setZoom] = useState(false);
  const [zoomXY, setZoomXY] = useState({ x: 50, y: 50 });

  const [panel, setPanel] = useState("description");
  const [copied, setCopied] = useState(false);

  const [revRating, setRevRating] = useState(0);
  const [revText, setRevText] = useState("");
  const [revBusy, setRevBusy] = useState(false);
  const [revErr, setRevErr] = useState("");
  const [revTick, setRevTick] = useState(false);

  const imgRef = useRef(null);
  const railRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([
      axios.get(API + "/products/" + id),
      axios.get(API + "/products"),
    ])
      .then(([pr, ar]) => {
        if (!alive) return;
        const p = pr.data;
        setProduct(p);
        const list = [];
        if (p.media?.length) {
          p.media.forEach((m) =>
            list.push({
              src: normalizeImageUrl(m.url),
              type: m.type || "image",
              alt: m.alt || p.title,
            }),
          );
        } else {
          (p.images || []).forEach((u) =>
            list.push({
              src: normalizeImageUrl(u),
              type: "image",
              alt: p.title,
            }),
          );
          (p.videos || []).forEach((u) =>
            list.push({
              src: normalizeImageUrl(u),
              type: "video",
              alt: p.title,
            }),
          );
        }
        setMedia(list);
        setActive(0);
        if (p.hasVariants && p.variants?.length) {
          setVariant(p.variants.find((v) => v.isActive) || p.variants[0]);
        }
        if (p.colors?.length) setColor(p.colors[0]);
        setPreOrder(!p.inStock && !!p.inventory?.allowBackorder);
        const all = Array.isArray(ar.data) ? ar.data : ar.data.products || [];
        setRelated(
          all
            .filter((x) => x._id !== id && x.category === p.category)
            .slice(0, 12),
        );
      })
      .catch(() => setProduct(null))
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id, revTick]);

  useSEO(product, media);

  const price = variant?.price ?? product?.price ?? 0;
  const origPrice = variant?.originalPrice ?? product?.originalPrice ?? 0;
  const disc =
    origPrice > price ? Math.round((1 - price / origPrice) * 100) : 0;
  const stock = variant
    ? variant.stock
    : (product?.totalStock ?? product?.inventory?.stock ?? 0);
  const isLow = product?.isLowStock;
  const oos = stock === 0 && !product?.inventory?.allowBackorder;
  const canBuy = !oos || preOrder;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const addCart = () => {
    if (!product || !canBuy) return;
    addToCart(
      {
        ...product,
        price,
        selectedColor: color?.name,
        selectedVariant: variant?.name,
      },
      qty,
    );
    showToast(preOrder ? "Pre-order added to cart!" : "Added to cart!");
  };

  const buyNow = () => {
    addCart();
    navigate("/checkout");
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setRevBusy(true);
    setRevErr("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        API + "/products/" + id + "/reviews",
        { rating: revRating, comment: revText },
        { headers: { Authorization: "Bearer " + token } },
      );
      setRevTick((t) => !t);
      setRevRating(0);
      setRevText("");
    } catch (err) {
      setRevErr(err.response?.data?.message || "Could not submit review.");
    } finally {
      setRevBusy(false);
    }
  };

  const onMouseMove = useCallback((e) => {
    if (!imgRef.current) return;
    const r = imgRef.current.getBoundingClientRect();
    setZoomXY({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }, []);

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const togglePanel = (k) => setPanel((prev) => (prev === k ? null : k));

  // ── Loading state ──────────────────────────────────────────────────────
  if (loading)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "radial-gradient(circle at center, #5b21b6 0%, #2e1065 50%, #170726 100%)",
        }}
      >
        <div className="text-center space-y-5">
          <div className="w-12 h-12 rounded-full border-2 border-purple-700 border-t-purple-300 animate-spin mx-auto" />
          <p className="text-purple-300 text-xs tracking-[0.25em] uppercase">
            Loading
          </p>
        </div>
      </div>
    );

  if (!product)
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6"
        style={{
          background:
            "radial-gradient(circle at center, #5b21b6 0%, #2e1065 50%, #170726 100%)",
        }}
      >
        <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto">
          <FaBoxOpen className="text-purple-200 text-2xl" />
        </div>
        <h2 className="text-2xl font-semibold text-white tracking-tight">
          Item Not Found
        </h2>
        <p className="text-purple-200 text-sm max-w-xs leading-7">
          This divine item may have been moved or is no longer available in our
          collection.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 px-8 py-3 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
          style={{
            background:
              "linear-gradient(135deg, #7c3aed 0%, #4c1d95 60%, #2e1065 100%)",
          }}
        >
          Back to Collection
        </button>
      </div>
    );

  const cur = media[active];
  const avgRating = product.rating || 5;
  const reviewCount = product.numReviews || product.reviews?.length || 0;
  const fmtPrice = (n) => "$" + Number(n).toFixed(2);

  return (
    <div
      className="min-h-screen text-stone-900 pb-8"
      style={{
        background:
          "radial-gradient(circle at center, #5b21b6 0%, #2e1065 50%, #170726 100%)",
      }}
    >
      {/* ── Toast ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-white shadow-xl border border-purple-100 text-stone-800 text-sm font-medium px-5 py-3 rounded-2xl whitespace-nowrap"
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)",
              }}
            >
              <FaCheck className="text-white text-[10px]" />
            </span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sticky header / breadcrumb ──────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/10"
        style={{ background: "rgba(12,4,32,0.82)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <nav className="flex items-center gap-1.5 text-xs text-purple-300/60 min-w-0 flex-1">
            <Link
              to="/"
              className="hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              Home
            </Link>
            <FaChevronRight className="text-[7px] flex-shrink-0 text-purple-500/40" />
            <Link
              to="/products"
              className="hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              Collection
            </Link>
            <FaChevronRight className="text-[7px] flex-shrink-0 text-purple-500/40" />
            <span className="text-purple-100/90 font-medium truncate">
              {product.shortTitle || product.title}
            </span>
          </nav>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setWish((w) => !w)}
              title="Add to wishlist"
              className={
                "w-9 h-9 rounded-lg border flex items-center justify-center transition-all " +
                (wish
                  ? "border-rose-400/60 bg-rose-500/20 text-rose-400"
                  : "border-white/10 text-purple-300/60 hover:border-rose-400/50 hover:text-rose-400")
              }
            >
              <FaHeart className="text-sm" />
            </button>
            <button
              onClick={shareLink}
              title="Share this item"
              className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-purple-300/60 hover:border-amber-400/50 hover:text-amber-400 transition-all"
            >
              {copied ? (
                <FaCheck className="text-sm text-amber-400" />
              ) : (
                <FaShareAlt className="text-sm" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Product hero ───────────────────────────────────────────────── */}
      <section className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10 items-start">
            {/* Gallery ────────────────────────────────────────────────── */}
            <div className="lg:sticky lg:top-20 space-y-4">
              {/* Outer glow ring */}
              <div
                className="relative rounded-3xl"
                style={{
                  filter:
                    "drop-shadow(0 0 40px rgba(124,58,237,0.30)) drop-shadow(0 0 80px rgba(76,29,149,0.18))",
                }}
              >
                {/* Main image viewer */}
                <div
                  className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white via-white to-purple-50/60 border border-purple-100/70 shadow-2xl shadow-purple-900/20"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  {/* Discount badge */}
                  {disc > 0 && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="text-xs font-bold tracking-wider uppercase bg-rose-500 text-white px-3 py-1 rounded-full shadow-sm">
                        {disc}% Off
                      </span>
                    </div>
                  )}

                  {/* Fast ship badge */}
                  {product.fastShip && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full">
                        <FaTruck className="text-[9px]" />
                        Fast Ship
                      </span>
                    </div>
                  )}

                  {cur?.type === "video" ? (
                    <video
                      src={cur.src}
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div
                      ref={imgRef}
                      onMouseEnter={() => setZoom(true)}
                      onMouseLeave={() => setZoom(false)}
                      onMouseMove={onMouseMove}
                      className="w-full h-full overflow-hidden cursor-zoom-in"
                    >
                      <img
                        src={cur?.src || placeholderImg}
                        alt={cur?.alt || product.title}
                        onError={(e) => {
                          e.target.src = placeholderImg;
                        }}
                        className="w-full h-full object-contain transition-transform duration-200"
                        style={
                          zoom
                            ? {
                                transform: "scale(1.75)",
                                transformOrigin: `${zoomXY.x}% ${zoomXY.y}%`,
                              }
                            : {}
                        }
                      />
                    </div>
                  )}

                  {/* Prev / Next arrows */}
                  {media.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActive(
                            (a) => (a - 1 + media.length) % media.length,
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white/90 border border-purple-100 shadow-md flex items-center justify-center text-purple-400 hover:bg-purple-600 hover:border-purple-500 hover:text-white transition-all duration-200"
                      >
                        <FaChevronLeft className="text-xs" />
                      </button>
                      <button
                        onClick={() => setActive((a) => (a + 1) % media.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white/90 border border-purple-100 shadow-md flex items-center justify-center text-purple-400 hover:bg-purple-600 hover:border-purple-500 hover:text-white transition-all duration-200"
                      >
                        <FaChevronRight className="text-xs" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {media.length > 1 && (
                  <div
                    className="flex gap-2.5 overflow-x-auto pb-1"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {media.map((m, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={
                          "flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 bg-white " +
                          (i === active
                            ? "border-violet-500 shadow-lg shadow-violet-500/40 ring-2 ring-amber-300/50 scale-105"
                            : "border-stone-200/70 hover:border-violet-300 opacity-50 hover:opacity-100 hover:scale-105")
                        }
                      >
                        {m.type === "video" ? (
                          <span className="w-full h-full flex items-center justify-center bg-stone-100">
                            <FaPlay className="text-stone-400 text-xs" />
                          </span>
                        ) : (
                          <img
                            src={m.src}
                            alt={m.alt}
                            onError={(e) => {
                              e.target.src = placeholderImg;
                            }}
                            className="w-full h-full object-contain p-2"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* close glow wrapper */}
            </div>

            {/* Product info ───────────────────────────────────────────── */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-purple-900/25 overflow-hidden">
              {/* Rainbow accent bar */}
              <div
                className="h-1 w-full"
                style={{
                  background:
                    "linear-gradient(90deg, #7c3aed 0%, #a855f7 35%, #f59e0b 65%, #ec4899 100%)",
                }}
              />
              <div className="p-4 sm:p-7 lg:p-10 pt-4 sm:pt-6 lg:pt-7 space-y-4 sm:space-y-6">
                {/* Category + verified */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.3em] text-purple-700 uppercase bg-purple-50 border border-purple-100 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] text-stone-400">
                    <MdVerified className="text-purple-500 text-sm" />
                    Authentic &amp; Blessed
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900 leading-tight tracking-tight">
                    {product.title}
                  </h1>
                  {product.shortTitle &&
                    product.shortTitle !== product.title && (
                      <p className="mt-1.5 text-sm text-stone-400 italic">
                        {product.shortTitle}
                      </p>
                    )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Stars rating={avgRating} size="sm" />
                  <span className="text-sm font-semibold text-stone-700">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-stone-300">·</span>
                  <a
                    href="#reviews"
                    className="text-sm text-stone-400 hover:text-purple-600 transition-colors underline underline-offset-2"
                  >
                    {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                  </a>
                </div>

                {/* Tags */}
                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {product.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-semibold tracking-wider uppercase bg-purple-50 border border-purple-100 text-purple-600 px-2.5 py-1 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <GoldDivider />

                {/* Price */}
                <div className="space-y-1 bg-gradient-to-br from-purple-50/70 to-violet-50/40 rounded-2xl p-3 sm:p-4 border border-purple-100/50">
                  <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                    <span
                      className="text-3xl sm:text-4xl font-black tracking-tight"
                      style={{
                        background:
                          "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #6d28d9 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {fmtPrice(price)}
                    </span>
                    {disc > 0 && (
                      <>
                        <span className="text-lg text-stone-400 line-through font-normal">
                          {fmtPrice(origPrice)}
                        </span>
                        <span className="text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 px-3 py-1 rounded-full shadow-sm">
                          Save {disc}%
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-stone-400">
                    Price inclusive of all taxes
                  </p>
                </div>

                {/* Short description */}
                {product.desc && (
                  <p className="text-sm text-stone-500 leading-7">
                    {product.desc}
                  </p>
                )}

                {/* Stock status */}
                <div className="flex items-center gap-2">
                  {oos ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-stone-300 flex-shrink-0" />
                      <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                        Out of Stock
                      </span>
                    </>
                  ) : preOrder ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 animate-pulse" />
                      <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                        Pre-Order Available
                      </span>
                    </>
                  ) : isLow ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 animate-pulse" />
                      <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                        Only {stock} left
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                        In Stock
                      </span>
                    </>
                  )}
                </div>

                {/* Color selector */}
                {product.colors?.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] font-bold tracking-[0.2em] text-stone-500 uppercase">
                        Color
                      </p>
                      {color && (
                        <span className="text-[11px] text-stone-700 font-medium">
                          — {color.name}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setColor(c)}
                          title={c.name}
                          className={
                            "w-8 h-8 rounded-full border-2 transition-all duration-200 shadow-sm " +
                            (color?.name === c.name
                              ? "ring-2 ring-offset-2 ring-purple-500 border-white scale-110"
                              : "border-stone-200 hover:scale-105")
                          }
                          style={{
                            backgroundColor: c.hex || c.value || c.name,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Variant selector */}
                {product.hasVariants && product.variants?.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] font-bold tracking-[0.2em] text-stone-500 uppercase">
                        Variant
                      </p>
                      {variant && (
                        <span className="text-[11px] text-stone-700 font-medium">
                          — {variant.name}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => {
                        const vOos = v.stock === 0;
                        const isSel = variant?.name === v.name;
                        return (
                          <button
                            key={v.name}
                            onClick={() => !vOos && setVariant(v)}
                            disabled={vOos}
                            className={[
                              "px-4 py-2 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-200",
                              isSel
                                ? "border-purple-600 bg-purple-600 text-white shadow-sm"
                                : vOos
                                  ? "border-stone-100 bg-stone-100 text-stone-300 cursor-not-allowed line-through"
                                  : "border-stone-200 bg-white text-stone-600 hover:border-purple-400 hover:text-purple-700",
                            ].join(" ")}
                          >
                            {v.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity + subtotal */}
                <div className="flex items-end gap-4 flex-wrap">
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold tracking-[0.2em] text-stone-500 uppercase">
                      Quantity
                    </p>
                    <div className="inline-flex items-center border border-stone-200 rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center text-stone-500 hover:bg-stone-50 hover:text-purple-600 transition-colors text-lg font-light"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-stone-800">
                        {qty}
                      </span>
                      <button
                        onClick={() =>
                          setQty((q) =>
                            stock > 0 ? Math.min(stock, q + 1) : q + 1,
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center text-stone-500 hover:bg-stone-50 hover:text-purple-600 transition-colors text-lg font-light"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {qty > 1 && (
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold tracking-[0.2em] text-stone-500 uppercase">
                        Subtotal
                      </p>
                      <p className="text-xl font-bold text-stone-900">
                        {fmtPrice(price * qty)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Desktop CTA buttons */}
                <div className="hidden lg:flex flex-col gap-3 pt-2">
                  <button
                    onClick={addCart}
                    disabled={!canBuy}
                    className="relative w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-white font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden group"
                    style={{
                      background:
                        "linear-gradient(135deg, #7c3aed 0%, #5b21b6 50%, #2e1065 100%)",
                      boxShadow: canBuy
                        ? "0 8px 32px rgba(124,58,237,0.45), 0 2px 8px rgba(76,29,149,0.3)"
                        : "none",
                    }}
                  >
                    <span
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #4c1d95 100%)",
                      }}
                    />
                    <FaShoppingCart className="text-base relative z-10" />
                    <span className="relative z-10">
                      {preOrder
                        ? "Pre-Order Now"
                        : oos
                          ? "Out of Stock"
                          : "Add to Cart"}
                    </span>
                  </button>
                  <button
                    onClick={buyNow}
                    disabled={!canBuy}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed border"
                    style={{
                      background:
                        "linear-gradient(135deg, #1e0a3c 0%, #2e1065 100%)",
                      borderColor: "rgba(167,139,250,0.4)",
                      color: "#c4b5fd",
                      boxShadow: canBuy
                        ? "0 4px 16px rgba(76,29,149,0.25)"
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(251,191,36,0.6)";
                      e.currentTarget.style.color = "#fbbf24";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(167,139,250,0.4)";
                      e.currentTarget.style.color = "#c4b5fd";
                    }}
                  >
                    Buy Now — {fmtPrice(price * qty)}
                  </button>
                </div>

                {/* Mobile CTA — shown only on mobile inside the card */}
                <div className="flex flex-col gap-2.5 lg:hidden">
                  <button
                    onClick={addCart}
                    disabled={!canBuy}
                    className="relative w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, #7c3aed 0%, #5b21b6 50%, #2e1065 100%)",
                      boxShadow: canBuy
                        ? "0 6px 24px rgba(124,58,237,0.45)"
                        : "none",
                    }}
                  >
                    <FaShoppingCart className="text-sm" />
                    {preOrder
                      ? "Pre-Order Now"
                      : oos
                        ? "Out of Stock"
                        : "Add to Cart"}
                  </button>
                  <button
                    onClick={buyNow}
                    disabled={!canBuy}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed border"
                    style={{
                      background:
                        "linear-gradient(135deg, #1e0a3c 0%, #2e1065 100%)",
                      borderColor: "rgba(167,139,250,0.4)",
                      color: "#c4b5fd",
                    }}
                  >
                    Buy Now — {fmtPrice(price * qty)}
                  </button>
                </div>

                {/* Trust strip */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      icon: <FaTruck className="text-white text-sm" />,
                      grad: "from-purple-500 to-violet-600",
                      label: "Free Shipping",
                      sub: "On orders $35+",
                    },
                    {
                      icon: <FaUndo className="text-white text-sm" />,
                      grad: "from-violet-500 to-purple-700",
                      label: "30-Day Returns",
                      sub: "Hassle-free",
                    },
                    {
                      icon: <FaShieldAlt className="text-white text-sm" />,
                      grad: "from-indigo-500 to-purple-600",
                      label: "Secure Pay",
                      sub: "SSL encrypted",
                    },
                  ].map(({ icon, grad, label, sub }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center text-center gap-1.5 p-2.5 rounded-xl bg-gradient-to-br from-purple-50/80 to-violet-50/50 border border-purple-100/60"
                    >
                      <div
                        className={
                          "w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br flex-shrink-0 " +
                          grad +
                          " flex items-center justify-center shadow-sm"
                        }
                      >
                        {icon}
                      </div>
                      <p className="text-[9px] sm:text-[10px] font-bold text-stone-700 leading-tight">
                        {label}
                      </p>
                      <p className="hidden sm:block text-[9px] text-stone-400">
                        {sub}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {/* close inner padding div */}
            </div>
          </div>
        </div>
      </section>

      {/* ── Product details accordion ───────────────────────────────────── */}
      <section className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          <div
            className="max-w-3xl mx-auto rounded-3xl p-4 sm:p-8 lg:p-10 border border-white/10 shadow-2xl shadow-purple-950/50"
            style={{
              background:
                "linear-gradient(145deg, rgba(20,8,48,0.92) 0%, rgba(15,5,35,0.95) 100%)",
              backdropFilter: "blur(24px)",
            }}
          >
            <p className="text-[11px] font-bold tracking-[0.3em] text-amber-400/80 uppercase mb-2 text-center">
              Product Details
            </p>
            <GoldDivider dark />
            <div className="mt-8">
              {product.fullDescription && (
                <Pane
                  dark
                  label="Full Description"
                  open={panel === "description"}
                  onToggle={() => togglePanel("description")}
                >
                  <p className="whitespace-pre-line">
                    {product.fullDescription}
                  </p>
                </Pane>
              )}

              {product.features?.length > 0 && (
                <Pane
                  dark
                  label="Features"
                  open={panel === "features"}
                  onToggle={() => togglePanel("features")}
                >
                  <ul className="space-y-2">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <FaCheck className="text-amber-400 text-xs mt-1 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </Pane>
              )}

              {product.benefits?.length > 0 && (
                <Pane
                  dark
                  label="Benefits"
                  open={panel === "benefits"}
                  onToggle={() => togglePanel("benefits")}
                >
                  <ul className="space-y-2">
                    {product.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <FaLeaf className="text-emerald-400 text-xs mt-1 flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </Pane>
              )}

              <Pane
                dark
                label="Shipping & Returns"
                open={panel === "shipping"}
                onToggle={() => togglePanel("shipping")}
              >
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <FaTruck className="text-purple-300 text-sm mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-purple-100 text-sm mb-0.5">
                        Free Standard Shipping
                      </p>
                      <p className="text-purple-300/60 text-xs leading-6">
                        On all orders over $35. Estimated delivery 5–8 business
                        days.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <FaUndo className="text-purple-300 text-sm mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-purple-100 text-sm mb-0.5">
                        30-Day Returns
                      </p>
                      <p className="text-purple-300/60 text-xs leading-6">
                        Return any item within 30 days of delivery for a full
                        refund.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <FaShieldAlt className="text-purple-300 text-sm mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-purple-100 text-sm mb-0.5">
                        Secure Packaging
                      </p>
                      <p className="text-purple-300/60 text-xs leading-6">
                        Every divine item is packaged with care and reverence.
                      </p>
                    </div>
                  </div>
                </div>
              </Pane>

              {product.inventory && (
                <Pane
                  dark
                  label="Availability"
                  open={panel === "availability"}
                  onToggle={() => togglePanel("availability")}
                >
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-300/70">Status</span>
                      <span
                        className={
                          product.inStock
                            ? "text-emerald-400 font-semibold"
                            : "text-stone-400 font-semibold"
                        }
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                    {stock > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-purple-300/70">
                          Units Available
                        </span>
                        <span className="font-semibold text-purple-100">
                          {stock}
                        </span>
                      </div>
                    )}
                    {product.sku && (
                      <div className="flex items-center justify-between">
                        <span className="text-purple-300/70">SKU</span>
                        <span className="font-mono text-xs text-purple-200/80">
                          {product.sku}
                        </span>
                      </div>
                    )}
                  </div>
                </Pane>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ────────────────────────────────────────────────────── */}
      <section
        id="reviews"
        className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
      >
        <div
          className="max-w-7xl mx-auto rounded-3xl shadow-2xl shadow-purple-950/50 p-4 sm:p-8 lg:p-12 border border-white/10"
          style={{
            background:
              "linear-gradient(145deg, rgba(20,8,48,0.92) 0%, rgba(15,5,35,0.95) 100%)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Heading */}
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-[11px] font-bold tracking-[0.3em] text-amber-400/80 uppercase mb-2">
              Devotee Experiences
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Reviews
            </h2>
            <div className="mt-4">
              <GoldDivider dark />
            </div>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-6 xl:gap-16 items-start">
            {/* Rating summary + form */}
            <div className="space-y-6">
              {/* Score card */}
              <div
                className="rounded-2xl border border-white/10 p-7 text-center space-y-3"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <p
                  className="text-7xl font-black leading-none"
                  style={{
                    background:
                      "linear-gradient(135deg, #c4b5fd 0%, #a78bfa 50%, #fbbf24 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {avgRating.toFixed(1)}
                </p>
                <Stars rating={avgRating} size="md" />
                <p className="text-purple-300/60 text-sm">
                  {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                </p>
                <div className="pt-1">
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(avgRating / 5) * 100}%`,
                        background:
                          "linear-gradient(90deg, #7c3aed, #a78bfa, #fbbf24)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit form or login prompt */}
              {user ? (
                <form
                  onSubmit={submitReview}
                  className="rounded-2xl border border-white/10 p-6 space-y-4"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <p className="text-[11px] font-bold tracking-[0.2em] text-amber-400/80 uppercase">
                    Share Your Experience
                  </p>
                  <Stars
                    rating={revRating}
                    size="lg"
                    interactive
                    onSet={setRevRating}
                  />
                  <textarea
                    value={revText}
                    onChange={(e) => setRevText(e.target.value)}
                    required
                    rows={4}
                    placeholder="What did you love about this item?"
                    className="w-full rounded-xl px-4 py-3 text-purple-100 text-sm placeholder-purple-400/40 focus:outline-none resize-none transition border border-white/10 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/20"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  />
                  {revErr && <p className="text-red-500 text-xs">{revErr}</p>}
                  <button
                    type="submit"
                    disabled={revBusy || !revRating}
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                    style={{
                      background:
                        "linear-gradient(135deg, #7c3aed 0%, #4c1d95 60%, #2e1065 100%)",
                    }}
                  >
                    {revBusy ? "Posting..." : "Post Review"}
                  </button>
                </form>
              ) : (
                <div
                  className="rounded-2xl border border-white/10 p-6 text-center space-y-4"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center mx-auto">
                    <FaPen className="text-purple-300 text-sm" />
                  </div>
                  <div>
                    <p className="text-purple-100 text-sm font-semibold">
                      Have this item?
                    </p>
                    <p className="text-purple-300/60 text-xs mt-1 leading-6">
                      Sign in to share your experience with the Krishnova
                      community.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
                    style={{
                      background:
                        "linear-gradient(135deg, #7c3aed 0%, #4c1d95 60%, #2e1065 100%)",
                    }}
                  >
                    Sign In to Review
                  </button>
                </div>
              )}
            </div>

            {/* Review list */}
            <div>
              {product.reviews?.length > 0 ? (
                <div className="space-y-3">
                  {product.reviews.map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="rounded-2xl border border-white/8 hover:border-purple-400/30 transition-all duration-200 p-5 pl-6 relative overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      {/* Left accent bar */}
                      <div
                        className="absolute left-0 inset-y-0 w-0.5 rounded-full"
                        style={{
                          background:
                            "linear-gradient(180deg, #7c3aed, #a78bfa, transparent)",
                        }}
                      />
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-lg"
                            style={{
                              background:
                                "linear-gradient(135deg, #7c3aed, #4c1d95)",
                              boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
                            }}
                          >
                            {(r.name || "A").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-purple-100">
                              {r.name}
                            </p>
                            <Stars rating={r.rating} />
                          </div>
                        </div>
                        <time className="text-purple-400/50 text-xs flex-shrink-0">
                          {new Date(r.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>
                      </div>
                      <p className="text-purple-200/70 text-sm leading-7">
                        {r.comment}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-400/20 flex items-center justify-center">
                    <FaStar className="text-purple-400/60 text-xl" />
                  </div>
                  <p className="text-purple-200/70 text-sm font-medium">
                    No reviews yet
                  </p>
                  <p className="text-purple-300/50 text-xs max-w-xs leading-6">
                    Be the first to share your experience with this divine item.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Related products ───────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-4 sm:pb-10">
          <div
            className="max-w-7xl mx-auto rounded-3xl shadow-2xl shadow-purple-950/50 p-4 sm:p-8 lg:p-10 border border-white/10"
            style={{
              background:
                "linear-gradient(145deg, rgba(20,8,48,0.90) 0%, rgba(15,5,35,0.93) 100%)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="flex items-end justify-between mb-6 sm:mb-10 gap-4">
              <div>
                <p className="text-[11px] font-bold tracking-[0.3em] text-amber-400/80 uppercase mb-2">
                  From Our Collection
                </p>
                <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
                  You May Also Like
                </h2>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() =>
                    railRef.current?.scrollBy({
                      left: -256,
                      behavior: "smooth",
                    })
                  }
                  className="w-10 h-10 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-purple-300 hover:border-amber-400/50 hover:text-amber-400 transition shadow-sm"
                >
                  <FaChevronLeft className="text-xs" />
                </button>
                <button
                  onClick={() =>
                    railRef.current?.scrollBy({ left: 256, behavior: "smooth" })
                  }
                  className="w-10 h-10 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-purple-300 hover:border-amber-400/50 hover:text-amber-400 transition shadow-sm"
                >
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            </div>

            <div
              ref={railRef}
              className="flex gap-4 overflow-x-auto pb-2"
              style={{ scrollbarWidth: "none" }}
            >
              {related.map((p) => (
                <RelatedCard key={p._id} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Mobile sticky CTA bar removed — buttons live inside the product card on mobile */}
    </div>
  );
}
