import { useEffect, useMemo, useState } from "react";
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
} from "react-icons/fa";
import { GiFeather } from "react-icons/gi";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [wishlist, setWishlist] = useState(() => new Set());

  const navigate = useNavigate();
  const baseApi = import.meta.env.VITE_API_URL;

  // SEO Implementation
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
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-3 md:p-4 animate-pulse">
      <div className="aspect-square rounded-xl bg-white/[0.06] mb-3" />
      <div className="h-3 md:h-4 rounded bg-white/[0.06] mb-2 w-3/4" />
      <div className="h-2.5 md:h-3 rounded bg-white/[0.06] mb-3 w-1/2" />
      <div className="h-8 md:h-9 rounded-xl bg-white/[0.06]" />
    </div>
  );

  return (
    <div
      className="min-h-screen relative py-4"
      style={{
        background:
          "radial-gradient(circle at center, #5b21b6 0%, #2e1065 50%, #170726 100%)",
      }}
    >
      {/* Hero Section */}
      <section className="relative pt-16 pb-4 md:pt-20 md:pb-6 overflow-hidden">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #e9d5ff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-left md:text-center">
            <h1 className="font-bold text-2xl md:text-4xl lg:text-5xl mb-2 md:mb-3 bg-gradient-to-r from-purple-200 via-fuchsia-200 to-amber-200 bg-clip-text text-transparent tracking-tight">
              Krishna Collection
            </h1>

            <p className="text-xs md:text-sm text-purple-200/60 mb-4 tracking-wide">
              Authentic Spiritual Artifacts &bull; Free Shipping $99+
            </p>

            {/* Trust Badges */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:justify-center md:flex-wrap">
              {[
                {
                  icon: <GiFeather className="text-amber-300" />,
                  text: "Authentic",
                },
                {
                  icon: <FaShippingFast className="text-purple-300" />,
                  text: "Free $99+",
                },
                {
                  icon: <FaLock className="text-emerald-300" />,
                  text: "Secure Pay",
                },
                {
                  icon: <FaStar className="text-amber-300" />,
                  text: "5-Star Rated",
                },
                {
                  icon: <FaUndo className="text-purple-300" />,
                  text: "14-Day Returns",
                },
              ].map((t, i) => (
                <span
                  key={i}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] md:text-xs text-purple-100/80 backdrop-blur-sm"
                >
                  {t.icon}
                  <span>{t.text}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mt-4 md:mt-8">
            <div className="sticky top-14 z-20">
              <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-hide">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-shrink-0 text-[11px] md:text-xs rounded-xl px-3 py-2 bg-white/[0.06] text-purple-100 border border-white/[0.1] focus:outline-none focus:border-purple-400/40 transition-colors"
                >
                  <option value="featured">Featured</option>
                  <option value="new">New Arrivals</option>
                  <option value="rating">Top Rated</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                </select>

                {/* Filter Pills */}
                {availableFilters.map((f) => {
                  const active = activeFilter === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[11px] md:text-xs font-medium transition-all border ${
                        active
                          ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white border-purple-400/50 shadow-lg shadow-purple-500/20"
                          : "bg-white/[0.04] text-purple-200/70 border-white/[0.08] hover:border-purple-400/30 hover:text-purple-100"
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
        </div>
      </section>

      {/* Products Section */}
      <section className="relative pb-12 md:pb-20 px-3 md:px-6">
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Product Count */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] md:text-xs text-purple-300/50 tracking-wide">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-purple-100">
              <FaSearch className="text-4xl mb-4 mx-auto text-purple-400/40" />
              <h3 className="text-lg font-semibold mb-2 text-purple-200">
                No products found
              </h3>
              <p className="text-sm text-purple-300/60">
                Try adjusting your filters or check back soon for new arrivals.
              </p>
              <button
                onClick={() => setActiveFilter("all")}
                className="mt-4 px-5 py-2 rounded-xl text-xs font-medium bg-purple-500/20 text-purple-200 border border-purple-400/30 hover:bg-purple-500/30 transition-colors"
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
              {filteredProducts.map((p) => {
                const discount = calcDiscount(p);
                const inWishlist = wishlist.has(p._id);

                return (
                  <div
                    key={p._id}
                    className="group rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:border-purple-400/30 hover:bg-white/[0.07] transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/product/${p._id}`)}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gradient-to-br from-purple-500/[0.06] to-fuchsia-500/[0.04]">
                      {/* Discount Badge */}
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[9px] md:text-[10px] font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 z-10 shadow-lg shadow-rose-500/20">
                          -{discount}%
                        </span>
                      )}

                      {/* Wishlist */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToWishlist(p._id);
                        }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center z-10 hover:bg-black/40 transition-colors"
                      >
                        <span
                          className={`text-sm ${inWishlist ? "text-rose-400" : "text-white/50"}`}
                        >
                          {inWishlist ? "♥" : "♡"}
                        </span>
                      </button>

                      {/* Image */}
                      <img
                        src={
                          firstImage(p)
                            ? getMediaUrl(firstImage(p))
                            : placeholderImg
                        }
                        alt={p.title}
                        className="w-full h-full object-contain p-3 md:p-4 group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-2.5 md:p-3.5">
                      {/* Title */}
                      <h3 className="text-[11px] md:text-sm font-medium mb-1.5 line-clamp-2 text-purple-50 leading-snug">
                        {p.title}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-1.5">
                        <FaStar className="text-[10px] md:text-xs text-amber-400" />
                        <span className="text-[10px] md:text-xs text-purple-200/60">
                          {p.rating?.toFixed(1) || "0.0"}
                        </span>
                        <span className="text-[9px] md:text-[10px] text-purple-300/30">
                          ({p.numReviews || 0})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-1.5 mb-2.5">
                        <span className="text-sm md:text-base font-bold text-purple-100">
                          {formatPrice(p.price)}
                        </span>
                        {p.originalPrice && (
                          <span className="text-[10px] md:text-xs line-through text-purple-400/40">
                            {formatPrice(p.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Free Shipping Badge */}
                      {p.price > 99 && (
                        <div className="text-[9px] md:text-[10px] text-emerald-300/70 mb-2">
                          <FaTruck className="inline mr-0.5" /> Free Shipping
                        </div>
                      )}

                      {/* Add to Cart */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${p._id}?buy=1`);
                        }}
                        className="w-full py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-semibold bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white hover:from-purple-400 hover:to-fuchsia-400 transition-all shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20"
                      >
                        <FaShoppingCart className="inline mr-1" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex md:grid md:grid-cols-4 gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              {
                icon: <FaTruck className="text-purple-300" />,
                title: "Free Shipping",
                desc: "Orders $99+",
              },
              {
                icon: <GiFeather className="text-amber-300" />,
                title: "Authentic",
                desc: "Blessed Items",
              },
              {
                icon: <FaUndo className="text-purple-300" />,
                title: "14-Day",
                desc: "Easy Returns",
              },
              {
                icon: <FaLock className="text-emerald-300" />,
                title: "Secure",
                desc: "Checkout",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[130px] md:w-auto rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 text-center"
              >
                <div className="text-xl md:text-2xl mb-1.5">{f.icon}</div>
                <div className="font-semibold text-[11px] md:text-xs text-purple-100">
                  {f.title}
                </div>
                <div className="text-[10px] md:text-[11px] text-purple-300/50">
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
