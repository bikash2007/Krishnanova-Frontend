import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import placeholderImg from "../../Media/placeholder.png";
import { normalizeImageUrl } from "../../utils/imageUrl";
import {
  FaStar,
  FaLock,
  FaTruck,
  FaShippingFast,
  FaSearch,
  FaShoppingCart,
  FaUndo,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
import { GiFeather } from "react-icons/gi";

const TAGLINE_STYLE = {
  blessed: {
    text: "Temple Blessed",
    chip: "from-amber-400/90 to-orange-400/90",
  },
  handmade: {
    text: "Handcrafted",
    chip: "from-fuchsia-400/90 to-purple-500/90",
  },
  meditation: {
    text: "Spiritual Essential",
    chip: "from-emerald-400/90 to-teal-500/90",
  },
  jewelry: {
    text: "Limited Edition",
    chip: "from-rose-400/90 to-pink-500/90",
  },
  decor: {
    text: "Sanctuary Piece",
    chip: "from-indigo-400/90 to-violet-500/90",
  },
  curated: {
    text: "Sacred Selection",
    chip: "from-purple-400/90 to-emerald-400/90",
  },
};

const CATEGORY_STYLE = {
  meditation: {
    title: "Meditation Studio",
    soft: "from-emerald-200/35 via-white/40 to-purple-200/35",
    halo: "bg-emerald-400",
  },
  jewelry: {
    title: "Sacred Jewelry",
    soft: "from-fuchsia-200/35 via-white/40 to-rose-200/35",
    halo: "bg-fuchsia-400",
  },
  decor: {
    title: "Home Altar Decor",
    soft: "from-indigo-200/35 via-white/40 to-violet-200/35",
    halo: "bg-indigo-400",
  },
  handmade: {
    title: "Handcrafted Essentials",
    soft: "from-amber-200/35 via-white/40 to-orange-200/35",
    halo: "bg-amber-400",
  },
  blessed: {
    title: "Blessed Collection",
    soft: "from-sky-200/35 via-white/40 to-emerald-200/35",
    halo: "bg-sky-400",
  },
  curated: {
    title: "Curated Collection",
    soft: "from-purple-200/35 via-white/40 to-emerald-200/35",
    halo: "bg-purple-400",
  },
};

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [wishlist, setWishlist] = useState(() => new Set());
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const navigate = useNavigate();
  const baseApi = import.meta.env.VITE_API_URL;
  const trendingRailRef = useRef(null);

  useEffect(() => {
    document.title =
      "Divine Krishna Collection | Krishnova - Authentic Spiritual Products";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content =
        "Discover authentic Krishna devotional items. Free shipping on orders over $99. Blessed spiritual artifacts, meditation tools, and sacred jewelry.";
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Discover authentic Krishna devotional items. Free shipping on orders over $99. Blessed spiritual artifacts, meditation tools, and sacred jewelry.";
      document.head.appendChild(meta);
    }
  }, []);

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
    return normalizeImageUrl(mediaPath) || placeholderImg;
  };

  const firstImage = (p) => {
    if (Array.isArray(p.images) && p.images.length) return p.images[0];
    if (typeof p.images === "string") return p.images;
    return null;
  };

  const secondImage = (p) => {
    if (Array.isArray(p.images) && p.images.length > 1) return p.images[1];
    return firstImage(p);
  };

  const productTheme = (p) => {
    const badge = String(p?.badge || "").toLowerCase();
    if (TAGLINE_STYLE[badge]) return badge;
    const tagMatch = (p?.tags || [])
      .map((t) => String(t).toLowerCase())
      .find((t) => TAGLINE_STYLE[t]);
    return tagMatch || "curated";
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

  const heroProduct = filteredProducts[0] || null;
  const heroSecondary = filteredProducts[1] || null;
  const trendingProducts = filteredProducts.slice(0, 8);
  const minimalProducts =
    filteredProducts.length > 8
      ? filteredProducts.slice(8, 14)
      : filteredProducts.slice(0, 6);

  const sectionGroups = useMemo(() => {
    const grouped = new Map();
    filteredProducts.forEach((p) => {
      const key = productTheme(p);
      if (!grouped.has(key)) grouped.set(key, []);
      if (grouped.get(key).length < 5) grouped.get(key).push(p);
    });

    return [...grouped.entries()].slice(0, 3).map(([key, items]) => ({
      key,
      label: CATEGORY_STYLE[key]?.title || CATEGORY_STYLE.curated.title,
      style: CATEGORY_STYLE[key] || CATEGORY_STYLE.curated,
      items,
    }));
  }, [filteredProducts]);

  useEffect(() => {
    if (!quickViewProduct) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setQuickViewProduct(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [quickViewProduct]);

  const scrollTrending = (direction) => {
    if (!trendingRailRef.current) return;
    trendingRailRef.current.scrollBy({
      left: direction === "left" ? -360 : 360,
      behavior: "smooth",
    });
  };

  const Skeleton = () => (
    <div className="animate-pulse rounded-2xl border border-violet-100 bg-white p-3 shadow-sm md:p-4">
      <div className="mb-3 aspect-square rounded-xl bg-slate-100" />
      <div className="mb-2 h-3 w-3/4 rounded bg-slate-100 md:h-4" />
      <div className="mb-3 h-2.5 w-1/2 rounded bg-slate-100 md:h-3" />
      <div className="h-8 rounded-xl bg-slate-100 md:h-9" />
    </div>
  );

  const StoryCard = ({
    product,
    className = "",
    feature = false,
    theme = "curated",
  }) => {
    if (!product) return null;
    const discount = calcDiscount(product);
    const style = TAGLINE_STYLE[theme] || TAGLINE_STYLE.curated;
    const inWishlist = wishlist.has(product._id);
    const primaryImage = firstImage(product);
    const altImage = secondImage(product);
    const hasAltImage = Boolean(altImage && altImage !== primaryImage);

    return (
      <article
        className={`group relative flex flex-col overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-[0_18px_42px_-30px_rgba(76,29,149,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-200 ${className}`}
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-100/60 via-transparent to-transparent opacity-70" />
        <div
          className={`relative shrink-0 overflow-hidden ${feature ? "aspect-[16/10]" : "aspect-[4/3]"}`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_STYLE[theme]?.soft || CATEGORY_STYLE.curated.soft} opacity-70`}
          />
          <img
            src={primaryImage ? getMediaUrl(primaryImage) : placeholderImg}
            alt={product.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
            loading="lazy"
            decoding="async"
          />
          {hasAltImage && (
            <img
              src={getMediaUrl(altImage)}
              alt={`${product.title} alternate`}
              className="absolute inset-0 hidden h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block"
              loading="lazy"
              decoding="async"
            />
          )}

          {discount > 0 && (
            <span className="absolute left-4 top-4 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 px-2.5 py-1 text-[11px] font-semibold text-white">
              -{discount}%
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToWishlist(product._id);
            }}
            className="absolute right-4 top-4 h-9 min-w-9 rounded-full border border-violet-200 bg-white/95 px-2 text-[10px] font-semibold text-violet-700 shadow-sm backdrop-blur-sm transition hover:bg-violet-50"
            aria-label="Toggle wishlist"
          >
            {inWishlist ? "Saved" : "Save"}
          </button>

          <div className="absolute inset-x-0 bottom-0 translate-y-3 px-4 pb-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuickViewProduct(product);
              }}
              className="hidden w-full rounded-xl border border-[#301168] bg-[#2E1065]/95 py-2.5 text-xs font-bold text-white shadow-md backdrop-blur-sm transition-all hover:bg-[#2E1065] hover:scale-[1.02] md:block"
            >
              Quick View
            </button>
          </div>
        </div>

        <div className="relative flex flex-col gap-2 p-4 md:p-5">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`rounded-full bg-gradient-to-r ${style.chip} px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white`}
            >
              {style.text}
            </span>
            <span className="text-[11px] text-slate-500">
              {product.numReviews || 0} reviews
            </span>
          </div>

          <h3
            className={`line-clamp-2 font-semibold text-slate-900 ${feature ? "text-base md:text-xl" : "text-sm md:text-base"}`}
          >
            {product.title}
          </h3>

          <div className="flex items-center gap-1.5 text-[11px] text-amber-300">
            <FaStar />
            <span className="text-slate-500">
              {product.rating?.toFixed(1) || "0.0"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-baseline gap-2">
              <span
                className={`font-bold text-violet-700 ${feature ? "text-2xl" : "text-lg"}`}
              >
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product._id}?buy=1`);
              }}
              className="flex-shrink-0 rounded-xl bg-[#5B21B6] px-4 py-2 text-[11px] font-bold text-white shadow-md transition-all hover:bg-[#4C1D95]"
            >
              <FaShoppingCart className="inline w-3 h-3 pb-[1px] mr-1" /> Add
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden py-6 bg-[#13072E]">
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-violet-300/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-44 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl" />

      <section className="relative overflow-hidden pb-6 pt-12 md:pb-8 md:pt-16">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #7c3aed 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="mb-6 text-left md:mb-8 md:text-center">
            <span className="mb-3 inline-block rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-violet-700">
              PREMIUM KRISHNOVA EDIT
            </span>
            <h1 className="mb-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-5xl lg:text-6xl">
              Divine Pieces, Presented Like Art
            </h1>

            <p className="mb-4 max-w-2xl text-sm leading-relaxed text-violet-200 md:mx-auto md:text-base">
              Browse a curated storefront where every product carries story,
              hierarchy, and a premium presence.
            </p>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide md:flex-wrap md:justify-center">
              {[
                {
                  icon: <GiFeather className="text-amber-300" />,
                  text: "Handcrafted",
                },
                {
                  icon: <FaShippingFast className="text-purple-300" />,
                  text: "Priority Ship",
                },
                {
                  icon: <FaLock className="text-emerald-300" />,
                  text: "Protected Pay",
                },
                {
                  icon: <FaStar className="text-amber-300" />,
                  text: "Premium Rated",
                },
                {
                  icon: <FaUndo className="text-purple-300" />,
                  text: "Easy Returns",
                },
              ].map((t, i) => (
                <span
                  key={i}
                  className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border border-violet-100 bg-white/90 px-3 py-1.5 text-[10px] text-slate-700 shadow-sm backdrop-blur-sm md:text-xs"
                >
                  {t.icon}
                  <span>{t.text}</span>
                </span>
              ))}
            </div>
          </div>

          {heroProduct && (
            <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
              <StoryCard
                product={heroProduct}
                feature
                theme={productTheme(heroProduct)}
                className="lg:col-span-8"
              />
              {heroSecondary && (
                <StoryCard
                  product={heroSecondary}
                  theme={productTheme(heroSecondary)}
                  className="lg:col-span-4"
                />
              )}
            </div>
          )}
        </div>
      </section>

      <div className="sticky top-14 z-20 mx-auto max-w-7xl px-4">
        <div className="rounded-2xl border border-violet-900/50 bg-[#1A0B2E]/85 px-3 shadow-lg backdrop-blur-xl">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-hide">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-shrink-0 rounded-xl border border-violet-800 bg-[#2D1656] px-3 py-2 text-[11px] text-violet-100 focus:border-violet-400 focus:outline-none md:text-xs"
            >
              <option value="featured">Featured</option>
              <option value="new">New Arrivals</option>
              <option value="rating">Top Rated</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>

            {availableFilters.map((f) => {
              const active = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`flex-shrink-0 rounded-xl border px-3 py-1.5 text-[11px] font-medium transition-all md:text-xs ${
                    active
                      ? "border-amber-400 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 shadow-md"
                      : "border-violet-800 bg-[#2D1656] text-violet-200 hover:border-violet-600 hover:text-white"
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
          </div>
        </div>
      </div>

      <section className="relative px-3 pb-4 pt-4 md:px-6">
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white md:text-2xl">
                Trending Ritual Picks
              </h2>
              <p className="text-xs text-slate-500 md:text-sm">
                A horizontal rail for effortless discovery
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollTrending("left")}
                className="rounded-full border border-violet-200 bg-white p-2 text-violet-700 transition hover:bg-violet-50"
                aria-label="Scroll left"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() => scrollTrending("right")}
                className="rounded-full border border-violet-200 bg-white p-2 text-violet-700 transition hover:bg-violet-50"
                aria-label="Scroll right"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} />
              ))}
            </div>
          ) : (
            <div
              ref={trendingRailRef}
              className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide"
            >
              {trendingProducts.map((p) => (
                <StoryCard
                  key={p._id}
                  product={p}
                  theme={productTheme(p)}
                  className="w-[260px] flex-shrink-0"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative px-3 pb-8 pt-6 md:px-6 md:pt-8">
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-xl font-semibold text-white md:text-2xl">
              Category Stories
            </h2>
            <span className="text-xs tracking-wider text-violet-300">
              {filteredProducts.length} curated products
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-[#2D1656] bg-[#1A0B2E]/60 py-20 text-center text-violet-200 shadow-lg backdrop-blur-md">
              <FaSearch className="mx-auto mb-4 text-4xl text-[#5B21B6]" />
              <h3 className="mb-2 text-lg font-semibold text-white">
                No products found
              </h3>
              <p className="text-sm text-violet-300">
                Try a different filter to reveal more items.
              </p>
              <button
                onClick={() => setActiveFilter("all")}
                className="mt-6 rounded-xl bg-[#5B21B6] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#4C1D95]"
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {sectionGroups.map((section) => (
                <div
                  key={section.key}
                  className="rounded-3xl border border-[#2D1656] bg-[#1A0B2E]/60 p-4 shadow-lg backdrop-blur-md md:p-6 mb-8"
                >
                  <div className="mb-4 flex items-center gap-2">
                    <span
                      className={`h-3 w-3 rounded-full ${section.style.halo} shadow-[0_0_8px_rgba(255,255,255,0.3)]`}
                    />
                    <h3 className="text-lg font-bold text-white md:text-xl tracking-tight">
                      {section.label}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:auto-rows-[minmax(210px,auto)] md:grid-cols-12">
                    <StoryCard
                      product={section.items[0]}
                      feature
                      theme={section.key}
                      className="md:col-span-7 md:row-span-2"
                    />
                    <StoryCard
                      product={section.items[1]}
                      theme={section.key}
                      className="md:col-span-5"
                    />
                    <StoryCard
                      product={section.items[2]}
                      theme={section.key}
                      className="md:col-span-3"
                    />
                    <StoryCard
                      product={section.items[3]}
                      theme={section.key}
                      className="md:col-span-4"
                    />
                    <StoryCard
                      product={section.items[4]}
                      theme={section.key}
                      className="md:col-span-5"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {!loading && filteredProducts.length > 0 && (
        <section className="relative px-3 pb-10 md:px-6 md:pb-14">
          <div className="relative z-10 mx-auto max-w-7xl">
            <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
              Minimal Picks
            </h2>
            <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {minimalProducts.map((p, idx) => {
                const style =
                  TAGLINE_STYLE[productTheme(p)] || TAGLINE_STYLE.curated;
                return (
                  <article
                    key={p._id}
                    className={`group rounded-2xl border border-violet-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 ${idx % 3 === 0 ? "lg:col-span-2" : ""}`}
                    onClick={() => navigate(`/product/${p._id}`)}
                  >
                    <div className="mb-3 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-white">
                      <img
                        src={
                          firstImage(p)
                            ? getMediaUrl(firstImage(p))
                            : placeholderImg
                        }
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="line-clamp-1 text-sm font-medium text-slate-900">
                        {p.title}
                      </h3>
                      <span
                        className={`flex-shrink-0 rounded-full bg-gradient-to-r ${style.chip} px-2 py-1 text-[10px] font-semibold text-white`}
                      >
                        {style.text}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-semibold text-violet-700">
                        {formatPrice(p.price)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${p._id}?buy=1`);
                        }}
                        className="flex-shrink-0 rounded-xl bg-[#5B21B6] px-4 py-2.5 text-[11px] font-bold text-white shadow-md transition-all hover:bg-[#4C1D95]"
                      >
                        <FaShoppingCart className="inline w-3 h-3 pb-[1px] mr-1" /> Add to cart
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="relative pb-12 md:pb-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-4">
            {[
              {
                icon: <FaTruck className="text-purple-200" />,
                title: "Complimentary Shipping",
                desc: "Orders $99+",
              },
              {
                icon: <GiFeather className="text-amber-300" />,
                title: "Authentic Pieces",
                desc: "Blessed essentials",
              },
              {
                icon: <FaUndo className="text-emerald-300" />,
                title: "Easy Returns",
                desc: "14 days",
              },
              {
                icon: <FaLock className="text-purple-300" />,
                title: "Protected Checkout",
                desc: "Secure payment",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="w-[165px] flex-shrink-0 rounded-2xl border border-[#2D1656] bg-[#1A0B2E]/60 p-4 text-center shadow-lg backdrop-blur-md md:w-auto"
              >
                <div className="mb-2.5 flex justify-center text-2xl md:text-3xl drop-shadow-md">{f.icon}</div>
                <div className="text-[11px] font-bold text-white md:text-xs">
                  {f.title}
                </div>
                <div className="text-[10px] text-violet-300 md:text-[11px] mt-1 font-medium tracking-wide hover:text-white">
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/55 p-3 md:items-center"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="w-full max-w-4xl overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-violet-100 px-4 py-3 md:px-6">
              <p className="text-xs tracking-[0.22em] text-violet-600">
                QUICK VIEW
              </p>
              <button
                onClick={() => setQuickViewProduct(null)}
                className="rounded-full border border-violet-200 bg-white p-2 text-violet-700 transition hover:bg-violet-50"
                aria-label="Close quick view"
              >
                <FaTimes />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:gap-8 md:p-6">
              <div className="relative overflow-hidden rounded-2xl bg-white">
                <img
                  src={
                    firstImage(quickViewProduct)
                      ? getMediaUrl(firstImage(quickViewProduct))
                      : placeholderImg
                  }
                  alt={quickViewProduct.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-slate-900">
                  {quickViewProduct.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Crafted for spiritual rituals and mindful gifting. A premium
                  piece from the Krishnova collection.
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FaStar className="text-amber-500" />
                  {quickViewProduct.rating?.toFixed(1) || "0.0"} (
                  {quickViewProduct.numReviews || 0} reviews)
                </div>
                <div className="text-3xl font-bold text-violet-700">
                  {formatPrice(quickViewProduct.price)}
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    onClick={() => navigate(`/product/${quickViewProduct._id}`)}
                    className="rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-medium text-violet-700 transition hover:bg-violet-50"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/product/${quickViewProduct._id}?buy=1`)
                    }
                    className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 px-4 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-purple-400"
                  >
                    <FaShoppingCart className="inline mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
