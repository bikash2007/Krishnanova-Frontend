import { Fragment, useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { normalizeImageUrl } from "../../utils/imageUrl";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBoxes,
  FaSearch,
  FaTimes,
  FaGripVertical,
  FaImage,
  FaVideo,
  FaUpload,
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaPalette,
  FaCubes,
  FaWarehouse,
  FaEye,
} from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://krishnanova-backend.onrender.com/api";

const CATEGORIES = [
  "Spiritual Accessories",
  "Sacred Texts",
  "Meditation Items",
  "Puja Items",
];
const STATUS_OPTIONS = [
  {
    value: "active",
    label: "Active",
    color: "text-green-400",
    bg: "bg-green-500/20",
  },
  {
    value: "draft",
    label: "Draft",
    color: "text-yellow-400",
    bg: "bg-yellow-500/20",
  },
  {
    value: "archived",
    label: "Archived",
    color: "text-gray-400",
    bg: "bg-gray-500/20",
  },
];

const emptyForm = {
  title: "",
  shortTitle: "",
  desc: "",
  fullDescription: "",
  price: "",
  originalPrice: "",
  category: "Spiritual Accessories",
  features: [""],
  benefits: [""],
  inStock: true,
  fastShipping: false,
  tags: "",
  status: "active",
  // inventory
  trackInventory: true,
  stock: 0,
  lowStockThreshold: 5,
  allowBackorder: false,
  // variants
  hasVariants: false,
};

const emptyVariant = {
  name: "",
  sku: "",
  price: "",
  originalPrice: "",
  stock: 0,
  color: "",
  size: "",
  material: "",
  isPreOrder: false,
  isActive: true,
};
const emptyColor = { name: "", hex: "#D4AF37", stock: 0 };

// ============================
// COMPONENT
// ============================
export default function ProductManagement() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("products"); // products | inventory
  const [products, setProducts] = useState([]);
  const [inventoryData, setInventoryData] = useState({
    stats: {},
    products: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  // Media state
  const [existingMedia, setExistingMedia] = useState([]); // from DB
  const [newMediaFiles, setNewMediaFiles] = useState([]); // File objects
  const [newMediaPreviews, setNewMediaPreviews] = useState([]); // blob URLs
  const fileInputRef = useRef(null);

  // Colors & Variants
  const [colors, setColors] = useState([]);
  const [variants, setVariants] = useState([]);

  // Inventory quick-edit
  const [editingStock, setEditingStock] = useState(null);

  // Form accordion sections
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    description: true,
    pricing: true,
    media: true,
    features: false,
    colors: false,
    variants: false,
    inventory: true,
    settings: false,
  });

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      fetchProducts();
    }
  }, [user, isAdmin, authLoading]);

  useEffect(() => {
    if (activeTab === "inventory" && user && isAdmin) fetchInventory();
  }, [activeTab]);

  // Auto-clear messages
  useEffect(() => {
    if (error || success) {
      const t = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [error, success]);

  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // ---- API ----
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/products`, authHeaders);
      setProducts(Array.isArray(res.data) ? res.data : res.data.products || []);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/products/inventory/overview`,
        authHeaders,
      );
      setInventoryData(res.data);
    } catch {
      setError("Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  // ---- FORM HELPERS ----
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayField = (index, field, value) => {
    setFormData((p) => {
      const arr = [...p[field]];
      arr[index] = value;
      return { ...p, [field]: arr };
    });
  };
  const addArrayItem = (field) =>
    setFormData((p) => ({ ...p, [field]: [...p[field], ""] }));
  const removeArrayItem = (field, index) =>
    setFormData((p) => ({
      ...p,
      [field]: p[field].filter((_, i) => i !== index),
    }));

  const toggleSection = (key) =>
    setExpandedSections((p) => ({ ...p, [key]: !p[key] }));

  // ---- MEDIA ----
  const handleMediaSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setNewMediaFiles((p) => [...p, ...files]);
    setNewMediaPreviews((p) => [
      ...p,
      ...files.map((f) => ({
        url: URL.createObjectURL(f),
        type: f.type,
        name: f.name,
      })),
    ]);
    e.target.value = "";
  };

  const removeExistingMedia = (index) => {
    setExistingMedia((p) => p.filter((_, i) => i !== index));
  };

  const removeNewMedia = (index) => {
    setNewMediaPreviews((p) => {
      URL.revokeObjectURL(p[index]?.url);
      return p.filter((_, i) => i !== index);
    });
    setNewMediaFiles((p) => p.filter((_, i) => i !== index));
  };

  const moveMedia = (arr, setArr, from, to) => {
    if (to < 0 || to >= arr.length) return;
    setArr((p) => {
      const n = [...p];
      [n[from], n[to]] = [n[to], n[from]];
      return n;
    });
  };

  // ---- COLORS ----
  const addColor = () => setColors((p) => [...p, { ...emptyColor }]);
  const updateColor = (index, field, value) =>
    setColors((p) => {
      const n = [...p];
      n[index] = { ...n[index], [field]: value };
      return n;
    });
  const removeColor = (index) =>
    setColors((p) => p.filter((_, i) => i !== index));

  // ---- VARIANTS ----
  const addVariant = () => setVariants((p) => [...p, { ...emptyVariant }]);
  const updateVariant = (index, field, value) =>
    setVariants((p) => {
      const n = [...p];
      n[index] = { ...n[index], [field]: value };
      return n;
    });
  const removeVariant = (index) =>
    setVariants((p) => p.filter((_, i) => i !== index));

  // ---- OPEN MODALS ----
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setExistingMedia([]);
    setNewMediaFiles([]);
    setNewMediaPreviews([]);
    setColors([]);
    setVariants([]);
    setExpandedSections({
      basic: true,
      description: true,
      pricing: true,
      media: true,
      features: false,
      colors: false,
      variants: false,
      inventory: true,
      settings: false,
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || "",
      shortTitle: product.shortTitle || "",
      desc: product.desc || "",
      fullDescription: product.fullDescription || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      category: product.category || "Spiritual Accessories",
      features: product.features?.length ? [...product.features] : [""],
      benefits: product.benefits?.length ? [...product.benefits] : [""],
      inStock: product.inStock ?? true,
      fastShipping: product.fastShipping || false,
      tags: (product.tags || []).join(", "),
      status: product.status || "active",
      trackInventory: product.inventory?.trackInventory ?? true,
      stock: product.totalStock ?? product.inventory?.stock ?? 0,
      lowStockThreshold: product.inventory?.lowStockThreshold ?? 5,
      allowBackorder: product.inventory?.allowBackorder ?? false,
      hasVariants: product.hasVariants || false,
    });
    setExistingMedia(
      (product.media || []).map((m) => ({
        _id: m._id,
        url: normalizeImageUrl(m.url),
        type: m.type,
        order: m.order,
        alt: m.alt,
      })),
    );
    setNewMediaFiles([]);
    setNewMediaPreviews([]);
    setColors(
      product.colors?.length
        ? product.colors.map((c) => ({
            ...c,
            stock: Number.isFinite(Number(c.stock)) ? Number(c.stock) : 0,
          }))
        : [],
    );
    setVariants(
      product.variants?.length ? product.variants.map((v) => ({ ...v })) : [],
    );
    setExpandedSections({
      basic: true,
      description: false,
      pricing: true,
      media: true,
      features: false,
      colors: product.colors?.length > 0,
      variants: product.hasVariants,
      inventory: true,
      settings: false,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    newMediaPreviews.forEach((p) => URL.revokeObjectURL(p.url));
    setNewMediaFiles([]);
    setNewMediaPreviews([]);
  };

  // ---- SUBMIT ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const data = new FormData();
      // Basic fields
      [
        "title",
        "shortTitle",
        "desc",
        "fullDescription",
        "category",
        "status",
      ].forEach((k) => data.append(k, formData[k]));
      data.append("price", formData.price);
      data.append("originalPrice", formData.originalPrice);
      data.append("inStock", formData.inStock);
      data.append("fastShipping", formData.fastShipping);

      // Arrays
      data.append(
        "features",
        JSON.stringify(formData.features.filter((f) => f.trim())),
      );
      data.append(
        "benefits",
        JSON.stringify(formData.benefits.filter((b) => b.trim())),
      );

      // Tags
      const tagsArr = formData.tags
        ? formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];
      data.append("tags", JSON.stringify(tagsArr));

      // Colors
      const validColors = colors.filter((c) => c.name.trim());
      data.append(
        "colors",
        JSON.stringify(
          validColors.map((c) => ({
            ...c,
            stock: parseInt(c.stock, 10) || 0,
          })),
        ),
      );

      // Variants
      data.append("hasVariants", formData.hasVariants);
      const validVariants = variants.filter((v) => v.name.trim());
      if (formData.hasVariants) {
        data.append(
          "variants",
          JSON.stringify(
            validVariants.map((v) => ({
              ...v,
              price: v.price ? parseFloat(v.price) : null,
              originalPrice: v.originalPrice
                ? parseFloat(v.originalPrice)
                : null,
              stock: parseInt(v.stock, 10) || 0,
            })),
          ),
        );
      }

      // Inventory
      const usesSplitInventory = formData.hasVariants || validColors.length > 0;
      const computedInventoryStock = formData.hasVariants
        ? validVariants
            .filter((v) => v.isActive !== false)
            .reduce((sum, v) => sum + (parseInt(v.stock, 10) || 0), 0)
        : validColors.reduce((sum, c) => sum + (parseInt(c.stock, 10) || 0), 0);
      data.append(
        "inventory",
        JSON.stringify({
          trackInventory: formData.trackInventory,
          stock: usesSplitInventory
            ? computedInventoryStock
            : parseInt(formData.stock, 10) || 0,
          lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
          allowBackorder: formData.allowBackorder,
        }),
      );

      // Existing media (edit mode)
      if (editingProduct) {
        data.append("existingMedia", JSON.stringify(existingMedia));
      }

      // New media files
      newMediaFiles.forEach((file) => data.append("media", file));

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingProduct) {
        await axios.put(
          `${API_URL}/products/${editingProduct._id}`,
          data,
          config,
        );
        setSuccess("Product updated successfully!");
      } else {
        await axios.post(`${API_URL}/products`, data, config);
        setSuccess("Product created successfully!");
      }
      fetchProducts();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  // ---- DELETE ----
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product? This cannot be undone.",
      )
    )
      return;
    try {
      await axios.delete(`${API_URL}/products/${id}`, authHeaders);
      setSuccess("Product deleted.");
      fetchProducts();
    } catch {
      setError("Failed to delete product.");
    }
  };

  // ---- QUICK STOCK UPDATE ----
  const handleQuickStockUpdate = async (
    productId,
    newStock,
    variantId = null,
    useExactStock = false,
  ) => {
    try {
      const parsedStock = Number.isFinite(newStock)
        ? newStock
        : parseInt(newStock, 10);

      if (!Number.isFinite(parsedStock) || parsedStock < 0) {
        setError("Stock must be a valid non-negative number.");
        return;
      }

      await axios.patch(
        `${API_URL}/products/${productId}/inventory`,
        {
          ...(variantId
            ? useExactStock
              ? { variantId, variantStock: parsedStock }
              : { variantId, adjustment: parsedStock }
            : { stock: parsedStock }),
        },
        authHeaders,
      );
      setSuccess("Stock updated.");
      fetchInventory();
      setEditingStock(null);
    } catch {
      setError("Failed to update stock.");
    }
  };

  // ---- FILTER ----
  const filteredProducts = products.filter(
    (p) =>
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const validColorCount = colors.filter((c) => c.name.trim()).length;
  const validVariantCount = variants.filter((v) => v.name.trim()).length;
  const usesSplitInventory = formData.hasVariants || validColorCount > 0;
  const computedInventoryStock = formData.hasVariants
    ? variants
        .filter((v) => v.name.trim() && v.isActive !== false)
        .reduce((sum, v) => sum + (parseInt(v.stock, 10) || 0), 0)
    : colors
        .filter((c) => c.name.trim())
        .reduce((sum, c) => sum + (parseInt(c.stock, 10) || 0), 0);

  // ---- RENDER GUARDS ----
  if (authLoading) return <LoadingSpinner />;
  if (!user || !isAdmin) return <AccessDenied />;

  // ==========================================================
  // RENDER
  // ==========================================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#01abfd] to-[#10b981] bg-clip-text text-transparent">
            Product Management
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            {products.length} products total
          </p>
        </div>
        <motion.button
          onClick={openAddModal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-[#01abfd] to-[#10b981] text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-[#01abfd]/25 flex items-center gap-2 text-sm"
        >
          <FaPlus /> Add Product
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1e2139] p-1 rounded-xl border border-gray-700/50 w-fit">
        {[
          {
            key: "products",
            label: "Products",
            icon: <FaBoxes className="text-xs" />,
          },
          {
            key: "inventory",
            label: "Inventory",
            icon: <FaWarehouse className="text-xs" />,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-[#01abfd] to-[#10b981] text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-[#252842]"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`px-4 py-3 rounded-xl text-sm flex items-center justify-between ${
              error
                ? "bg-red-900/20 border border-red-500/30 text-red-300"
                : "bg-green-900/20 border border-green-500/30 text-green-300"
            }`}
          >
            <span>{error || success}</span>
            <button
              onClick={() => {
                setError(null);
                setSuccess(null);
              }}
              className="ml-4 hover:opacity-70"
            >
              <FaTimes />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRODUCTS TAB */}
      {activeTab === "products" && (
        <>
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-[#1e2139] border border-gray-700/50 rounded-xl pl-11 pr-4 py-2.5 text-white text-sm
              placeholder-gray-500 focus:ring-2 focus:ring-[#01abfd]/50 focus:border-transparent outline-none"
            />
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid gap-4">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <FaBoxes className="mx-auto text-4xl mb-3 opacity-50" />
                  <p>No products found.</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onEdit={() => openEditModal(product)}
                    onDelete={() => handleDelete(product._id)}
                  />
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* INVENTORY TAB */}
      {activeTab === "inventory" && (
        <InventoryView
          data={inventoryData}
          loading={loading}
          editingStock={editingStock}
          setEditingStock={setEditingStock}
          onStockUpdate={handleQuickStockUpdate}
        />
      )}

      {/* PRODUCT MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-[#1e2139] to-[#23263a] rounded-2xl shadow-2xl border border-gray-700/50 w-full max-w-3xl my-8 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
                <h2 className="text-xl font-bold text-white">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Modal Body */}
              <form
                onSubmit={handleSubmit}
                className="px-6 py-5 space-y-4 overflow-y-auto flex-1 min-h-0 custom-scrollbar"
              >
                {/* Basic Info */}
                <Section
                  id="basic"
                  title="Basic Information"
                  icon={<FaBoxes className="text-[#01abfd] text-sm" />}
                  expanded={expandedSections.basic}
                  onToggle={toggleSection}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Title *"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Short Title *"
                      name="shortTitle"
                      value={formData.shortTitle}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Category *"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      options={CATEGORIES}
                    />
                    <Select
                      label="Status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      options={STATUS_OPTIONS.map((s) => s.value)}
                      optionLabels={STATUS_OPTIONS.map((s) => s.label)}
                    />
                  </div>
                  <Input
                    label="Tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="tag1, tag2, tag3"
                  />
                </Section>

                {/* Description */}
                <Section
                  id="description"
                  title="Description"
                  icon={<FaEdit className="text-[#01abfd] text-sm" />}
                  expanded={expandedSections.description}
                  onToggle={toggleSection}
                >
                  <Textarea
                    label="Short Description *"
                    name="desc"
                    value={formData.desc}
                    onChange={handleChange}
                    rows={3}
                    required
                  />
                  <Textarea
                    label="Full Description *"
                    name="fullDescription"
                    value={formData.fullDescription}
                    onChange={handleChange}
                    rows={5}
                    required
                  />
                </Section>

                {/* Pricing */}
                <Section
                  id="pricing"
                  title="Pricing"
                  icon={
                    <span className="text-[#01abfd] text-sm font-bold">$</span>
                  }
                  expanded={expandedSections.pricing}
                  onToggle={toggleSection}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Selling Price *"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                    />
                    <Input
                      label="Compare at Price *"
                      name="originalPrice"
                      type="number"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  {formData.price &&
                    formData.originalPrice &&
                    parseFloat(formData.originalPrice) >
                      parseFloat(formData.price) && (
                      <p className="text-xs text-green-400">
                        {Math.round(
                          (1 -
                            parseFloat(formData.price) /
                              parseFloat(formData.originalPrice)) *
                            100,
                        )}
                        % discount
                      </p>
                    )}
                </Section>

                {/* Media */}
                <Section
                  id="media"
                  title="Media"
                  icon={<FaImage className="text-[#01abfd] text-sm" />}
                  badge={`${existingMedia.length + newMediaFiles.length}`}
                  expanded={expandedSections.media}
                  onToggle={toggleSection}
                >
                  <div className="space-y-3">
                    {/* Existing media grid */}
                    {existingMedia.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-400 mb-2">
                          Current Media
                        </p>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {existingMedia.map((m, i) => (
                            <div
                              key={m._id || i}
                              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-700/50"
                            >
                              {m.type === "video" ? (
                                <video
                                  src={m.url}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <img
                                  src={m.url}
                                  alt={m.alt || ""}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                {i > 0 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      moveMedia(
                                        existingMedia,
                                        setExistingMedia,
                                        i,
                                        i - 1,
                                      )
                                    }
                                    className="p-1 bg-white/20 rounded text-white text-xs hover:bg-white/30"
                                  >
                                    &#8592;
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeExistingMedia(i)}
                                  className="p-1 bg-red-500/80 rounded text-white text-xs hover:bg-red-500"
                                >
                                  <FaTrash />
                                </button>
                                {i < existingMedia.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      moveMedia(
                                        existingMedia,
                                        setExistingMedia,
                                        i,
                                        i + 1,
                                      )
                                    }
                                    className="p-1 bg-white/20 rounded text-white text-xs hover:bg-white/30"
                                  >
                                    &#8594;
                                  </button>
                                )}
                              </div>
                              {i === 0 && (
                                <span className="absolute top-1 left-1 text-[10px] bg-[#01abfd] text-white px-1.5 py-0.5 rounded">
                                  Main
                                </span>
                              )}
                              {m.type === "video" && (
                                <FaVideo className="absolute bottom-1 right-1 text-white text-xs" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New media previews */}
                    {newMediaPreviews.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-400 mb-2">
                          New Uploads
                        </p>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {newMediaPreviews.map((m, i) => (
                            <div
                              key={i}
                              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-dashed border-[#01abfd]/40"
                            >
                              {m.type?.startsWith("video/") ? (
                                <video
                                  src={m.url}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <img
                                  src={m.url}
                                  alt="new"
                                  className="w-full h-full object-cover"
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => removeNewMedia(i)}
                                className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upload button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-600 rounded-xl py-6 flex flex-col items-center gap-2 hover:border-[#01abfd]/50 hover:bg-[#01abfd]/5 transition-all cursor-pointer"
                    >
                      <FaUpload className="text-gray-500 text-lg" />
                      <span className="text-sm text-gray-400">
                        Click to add images or videos
                      </span>
                      <span className="text-xs text-gray-600">
                        JPEG, PNG, WebP, AVIF, MP4, WebM
                      </span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
                      multiple
                      onChange={handleMediaSelect}
                      className="hidden"
                    />
                  </div>
                </Section>

                {/* Features & Benefits */}
                <Section
                  id="features"
                  title="Features & Benefits"
                  icon={<FaCheckCircle className="text-[#01abfd] text-sm" />}
                  expanded={expandedSections.features}
                  onToggle={toggleSection}
                >
                  <ArrayEditor
                    label="Features"
                    items={formData.features}
                    onChange={(i, v) => handleArrayField(i, "features", v)}
                    onAdd={() => addArrayItem("features")}
                    onRemove={(i) => removeArrayItem("features", i)}
                  />
                  <ArrayEditor
                    label="Benefits"
                    items={formData.benefits}
                    onChange={(i, v) => handleArrayField(i, "benefits", v)}
                    onAdd={() => addArrayItem("benefits")}
                    onRemove={(i) => removeArrayItem("benefits", i)}
                  />
                </Section>

                {/* Colors */}
                <Section
                  id="colors"
                  title="Color Options"
                  icon={<FaPalette className="text-[#01abfd] text-sm" />}
                  badge={colors.length > 0 ? colors.length : null}
                  expanded={expandedSections.colors}
                  onToggle={toggleSection}
                >
                  <div className="space-y-3">
                    {colors.map((color, i) => (
                      <div
                        key={i}
                        className="bg-[#0f1419] rounded-lg p-3 border border-gray-700/50 space-y-2"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={color.hex}
                            onChange={(e) =>
                              updateColor(i, "hex", e.target.value)
                            }
                            className="w-8 h-8 rounded-md border-0 cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={color.name}
                            onChange={(e) =>
                              updateColor(i, "name", e.target.value)
                            }
                            placeholder="Color name (e.g., Gold)"
                            className="flex-1 bg-transparent border-none text-white text-sm outline-none placeholder-gray-500"
                          />
                          <span className="text-xs text-gray-500 font-mono">
                            {color.hex}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeColor(i)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            <FaTimes />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <Input
                            label="Color Stock"
                            type="number"
                            min="0"
                            value={color.stock}
                            onChange={(e) =>
                              updateColor(i, "stock", e.target.value)
                            }
                            placeholder="0"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addColor}
                      className="text-[#01abfd] hover:text-[#0189d1] text-sm flex items-center gap-1.5"
                    >
                      <FaPlus className="text-xs" /> Add Color
                    </button>
                  </div>
                </Section>

                {/* Variants */}
                <Section
                  id="variants"
                  title="Variants"
                  icon={<FaCubes className="text-[#01abfd] text-sm" />}
                  badge={variants.length > 0 ? variants.length : null}
                  expanded={expandedSections.variants}
                  onToggle={toggleSection}
                >
                  <label className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                    <input
                      type="checkbox"
                      name="hasVariants"
                      checked={formData.hasVariants}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#01abfd] bg-[#0f1419] border-gray-700 rounded focus:ring-[#01abfd]"
                    />
                    This product has multiple variants (size, material, etc.)
                  </label>
                  {formData.hasVariants && (
                    <div className="space-y-3">
                      {variants.map((v, i) => (
                        <div
                          key={i}
                          className="bg-[#0f1419] rounded-lg p-4 border border-gray-700/50 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400 font-semibold uppercase">
                              Variant {i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeVariant(i)}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              <FaTimes />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <input
                              value={v.name}
                              onChange={(e) =>
                                updateVariant(i, "name", e.target.value)
                              }
                              placeholder="Variant name *"
                              className="bg-[#1e2139] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#01abfd]"
                            />
                            <input
                              value={v.sku}
                              onChange={(e) =>
                                updateVariant(i, "sku", e.target.value)
                              }
                              placeholder="SKU"
                              className="bg-[#1e2139] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#01abfd]"
                            />
                            <input
                              value={v.price}
                              onChange={(e) =>
                                updateVariant(i, "price", e.target.value)
                              }
                              placeholder="Price (override)"
                              type="number"
                              min="0"
                              step="0.01"
                              className="bg-[#1e2139] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#01abfd]"
                            />
                            <input
                              value={v.stock}
                              onChange={(e) =>
                                updateVariant(i, "stock", e.target.value)
                              }
                              placeholder="Stock"
                              type="number"
                              min="0"
                              className="bg-[#1e2139] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#01abfd]"
                            />
                            <input
                              value={v.size}
                              onChange={(e) =>
                                updateVariant(i, "size", e.target.value)
                              }
                              placeholder="Size"
                              className="bg-[#1e2139] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#01abfd]"
                            />
                            <input
                              value={v.color}
                              onChange={(e) =>
                                updateVariant(i, "color", e.target.value)
                              }
                              placeholder="Color"
                              className="bg-[#1e2139] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#01abfd]"
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              value={v.material}
                              onChange={(e) =>
                                updateVariant(i, "material", e.target.value)
                              }
                              placeholder="Material"
                              className="flex-1 bg-[#1e2139] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#01abfd]"
                            />
                            <label className="flex items-center gap-1.5 text-xs text-gray-400 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={v.isActive}
                                onChange={(e) =>
                                  updateVariant(i, "isActive", e.target.checked)
                                }
                                className="w-3.5 h-3.5 text-[#01abfd] bg-[#0f1419] border-gray-700 rounded"
                              />
                              Active
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-amber-300 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={!!v.isPreOrder}
                                onChange={(e) =>
                                  updateVariant(
                                    i,
                                    "isPreOrder",
                                    e.target.checked,
                                  )
                                }
                                className="w-3.5 h-3.5 text-amber-400 bg-[#0f1419] border-gray-700 rounded"
                              />
                              Pre-order
                            </label>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addVariant}
                        className="text-[#01abfd] hover:text-[#0189d1] text-sm flex items-center gap-1.5"
                      >
                        <FaPlus className="text-xs" /> Add Variant
                      </button>
                    </div>
                  )}
                </Section>

                {/* Inventory */}
                <Section
                  id="inventory"
                  title="Inventory"
                  icon={<FaWarehouse className="text-[#01abfd] text-sm" />}
                  expanded={expandedSections.inventory}
                  onToggle={toggleSection}
                >
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      name="trackInventory"
                      checked={formData.trackInventory}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#01abfd] bg-[#0f1419] border-gray-700 rounded focus:ring-[#01abfd]"
                    />
                    Track inventory for this product
                  </label>
                  {formData.trackInventory && !usesSplitInventory && (
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Stock Quantity"
                        name="stock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={handleChange}
                      />
                      <Input
                        label="Low Stock Threshold"
                        name="lowStockThreshold"
                        type="number"
                        min="0"
                        value={formData.lowStockThreshold}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  {formData.trackInventory && usesSplitInventory && (
                    <p className="text-xs text-gray-500">
                      {formData.hasVariants
                        ? `Stock is managed per variant above (${validVariantCount} variant${validVariantCount === 1 ? "" : "s"}). Total stock is auto-calculated: ${computedInventoryStock}.`
                        : `Stock is managed per color above (${validColorCount} color${validColorCount === 1 ? "" : "s"}). Total stock is auto-calculated: ${computedInventoryStock}.`}
                    </p>
                  )}
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      name="allowBackorder"
                      checked={formData.allowBackorder}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#01abfd] bg-[#0f1419] border-gray-700 rounded focus:ring-[#01abfd]"
                    />
                    Allow customers to purchase when out of stock
                  </label>
                </Section>

                {/* Settings */}
                <Section
                  id="settings"
                  title="Shipping & Visibility"
                  icon={<FaEye className="text-[#01abfd] text-sm" />}
                  expanded={expandedSections.settings}
                  onToggle={toggleSection}
                >
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={formData.inStock}
                        onChange={handleChange}
                        className="w-4 h-4 text-[#01abfd] bg-[#0f1419] border-gray-700 rounded focus:ring-[#01abfd]"
                      />
                      In Stock
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        name="fastShipping"
                        checked={formData.fastShipping}
                        onChange={handleChange}
                        className="w-4 h-4 text-[#01abfd] bg-[#0f1419] border-gray-700 rounded focus:ring-[#01abfd]"
                      />
                      Fast Shipping
                    </label>
                  </div>
                </Section>
              </form>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-700/50">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 bg-[#0f1419] border border-gray-700 hover:bg-[#1a1f2e] transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  type="button"
                  disabled={saving}
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#01abfd] to-[#10b981]
                  shadow-lg hover:shadow-[#01abfd]/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                      ? "Update Product"
                      : "Create Product"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ========================================
// SUB-COMPONENTS
// ========================================

// Collapsible Section — must be defined outside ProductManagement
// so React preserves the component identity across re-renders (no scroll reset).
function Section({ id, title, icon, children, badge, expanded, onToggle }) {
  return (
    <div className="border border-gray-700/50 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle(id);
        }}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-[#1a1d2e]/80 hover:bg-[#252842] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          {icon}
          <span className="text-sm font-semibold text-gray-200">{title}</span>
          {badge && (
            <span className="text-xs bg-[#01abfd]/20 text-[#01abfd] px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {expanded ? (
          <FaChevronUp className="text-gray-500 text-xs" />
        ) : (
          <FaChevronDown className="text-gray-500 text-xs" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 py-4 space-y-4 bg-[#0f1419]/40">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#01abfd]" />
        <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-[#01abfd] opacity-20" />
      </div>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center bg-[#1e2139] p-12 rounded-2xl border border-red-500/30">
        <h2 className="text-2xl font-bold text-red-400 mb-2">Access Denied</h2>
        <p className="text-red-300">You must be an admin to view this page.</p>
      </div>
    </div>
  );
}

function Input({ label, className, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-gray-400 mb-1">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full bg-[#0f1419] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm
        placeholder-gray-500 focus:ring-2 focus:ring-[#01abfd]/50 focus:border-transparent outline-none transition-all ${className || ""}`}
      />
    </div>
  );
}

function Textarea({ label, className, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-gray-400 mb-1">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`w-full bg-[#0f1419] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm
        placeholder-gray-500 focus:ring-2 focus:ring-[#01abfd]/50 focus:border-transparent outline-none resize-none transition-all ${className || ""}`}
      />
    </div>
  );
}

function Select({ label, options, optionLabels, className, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-gray-400 mb-1">
          {label}
        </label>
      )}
      <select
        {...props}
        className={`w-full bg-[#0f1419] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm
        focus:ring-2 focus:ring-[#01abfd]/50 focus:border-transparent outline-none transition-all ${className || ""}`}
      >
        {options.map((opt, i) => (
          <option key={opt} value={opt}>
            {optionLabels?.[i] || opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function ArrayEditor({ label, items, onChange, onAdd, onRemove }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-2">
        {label}
      </label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            value={item}
            onChange={(e) => onChange(i, e.target.value)}
            placeholder={`${label} item...`}
            className="flex-1 bg-[#0f1419] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-[#01abfd]"
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="text-red-400 hover:text-red-300 text-sm px-2"
            >
              <FaTimes />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="text-[#01abfd] hover:text-[#0189d1] text-xs flex items-center gap-1 mt-1"
      >
        <FaPlus className="text-[10px]" /> Add {label}
      </button>
    </div>
  );
}

// ---- Product Card ----
function ProductCard({ product, onEdit, onDelete }) {
  const rawThumb = product.media?.[0]?.url || product.images?.[0] || null;
  const thumbnail = normalizeImageUrl(rawThumb);
  const statusConfig =
    STATUS_OPTIONS.find((s) => s.value === product.status) || STATUS_OPTIONS[0];
  const stockDisplay = product.totalStock ?? product.inventory?.stock ?? "N/A";
  const isLow = product.isLowStock;
  const isOut = product.totalStock === 0 && !product.inventory?.allowBackorder;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1e2139] rounded-xl border border-gray-700/50 hover:border-[#01abfd]/30 transition-all overflow-hidden"
    >
      <div className="flex items-center gap-4 p-4">
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-lg bg-[#0f1419] border border-gray-700/50 overflow-hidden flex-shrink-0">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <FaImage />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-white truncate">
              {product.title}
            </h3>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusConfig.bg} ${statusConfig.color}`}
            >
              {statusConfig.label}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="text-green-400 font-semibold">
              ${product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="line-through text-gray-600">
                ${product.originalPrice}
              </span>
            )}
            <span>{product.category}</span>
            <span className="flex items-center gap-1">
              {product.media?.length || 0} <FaImage className="text-[10px]" />
            </span>
          </div>
        </div>

        {/* Stock Badge */}
        <div className="flex-shrink-0 text-center">
          <div
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              isOut
                ? "bg-red-500/20 text-red-400"
                : isLow
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-green-500/20 text-green-400"
            }`}
          >
            {isOut ? (
              <>
                <FaTimesCircle className="inline mr-1" />
                Out
              </>
            ) : isLow ? (
              <>
                <FaExclamationTriangle className="inline mr-1" />
                {stockDisplay}
              </>
            ) : (
              <>
                <FaCheckCircle className="inline mr-1" />
                {stockDisplay}
              </>
            )}
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">stock</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg bg-[#01abfd]/10 text-[#01abfd] hover:bg-[#01abfd]/20 transition-colors"
            title="Edit"
          >
            <FaEdit className="text-sm" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            title="Delete"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      </div>

      {/* Variants row */}
      {product.hasVariants && product.variants?.length > 0 && (
        <div className="px-4 pb-3 flex gap-2 flex-wrap">
          {product.variants.map((v, i) => (
            <span
              key={i}
              className={`text-[10px] px-2 py-0.5 rounded-full border ${
                v.isActive
                  ? "border-gray-600 text-gray-300"
                  : "border-gray-700 text-gray-600 line-through"
              }`}
            >
              {v.name}{" "}
              {v.stock > 0 ? (
                `(${v.stock})`
              ) : (
                <span className="text-red-400">(0)</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Colors row */}
      {product.colors?.length > 0 && (
        <div className="px-4 pb-3 flex gap-1.5 items-center">
          <span className="text-[10px] text-gray-500 mr-1">Colors:</span>
          {product.colors.map((c, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border-2 border-gray-600"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ---- Inventory View ----
function InventoryView({
  data,
  loading,
  editingStock,
  setEditingStock,
  onStockUpdate,
}) {
  const [stockInput, setStockInput] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const { stats = {}, products = [] } = data;

  const getEditKey = (productId, variantId = null) =>
    variantId ? `${productId}:${variantId}` : productId;

  const toggleExpanded = (productId) => {
    setExpandedRows((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const getStatusChipClass = (status) => {
    if (status === "out_of_stock") return "bg-red-500/20 text-red-400";
    if (status === "low_stock") return "bg-yellow-500/20 text-yellow-400";
    if (status === "backorder") return "bg-purple-500/20 text-purple-400";
    return "bg-green-500/20 text-green-400";
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Total Products"
          value={stats.totalProducts || 0}
          icon={<FaBoxes />}
          color="text-[#01abfd]"
        />
        <StatCard
          label="In Stock"
          value={stats.inStock || 0}
          icon={<FaCheckCircle />}
          color="text-green-400"
        />
        <StatCard
          label="Low Stock"
          value={stats.lowStock || 0}
          icon={<FaExclamationTriangle />}
          color="text-yellow-400"
        />
        <StatCard
          label="Out of Stock"
          value={stats.outOfStock || 0}
          icon={<FaTimesCircle />}
          color="text-red-400"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-[#1e2139] rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1a1d2e]">
                <th className="text-left text-xs text-gray-400 font-semibold px-4 py-3 uppercase">
                  Product
                </th>
                <th className="text-left text-xs text-gray-400 font-semibold px-4 py-3 uppercase">
                  Category
                </th>
                <th className="text-center text-xs text-gray-400 font-semibold px-4 py-3 uppercase">
                  Stock
                </th>
                <th className="text-center text-xs text-gray-400 font-semibold px-4 py-3 uppercase">
                  Status
                </th>
                <th className="text-center text-xs text-gray-400 font-semibold px-4 py-3 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {products.map((p) => {
                const rowExpanded = !!expandedRows[p._id];
                const productEditKey = getEditKey(p._id);
                const hasVariantRows =
                  (Array.isArray(p.variants) && p.variants.length > 0) ||
                  !!p.hasVariants;
                const hasColorRows =
                  Array.isArray(p.colorInventory) &&
                  p.colorInventory.length > 0;
                const usesSplitInventory = hasVariantRows || hasColorRows;

                return (
                  <Fragment key={p._id}>
                    <tr
                      key={p._id}
                      className="hover:bg-[#252842]/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#0f1419] overflow-hidden flex-shrink-0">
                            {p.thumbnail ? (
                              <img
                                src={p.thumbnail}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                                <FaImage />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="text-sm text-white font-medium truncate max-w-[200px] block">
                              {p.title}
                            </span>
                            {hasVariantRows && (
                              <span className="text-[10px] text-gray-500">
                                {p.variants?.length || 0} variants
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {p.category}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {!usesSplitInventory &&
                        editingStock === productEditKey ? (
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              min="0"
                              value={stockInput}
                              onChange={(e) => setStockInput(e.target.value)}
                              className="w-16 bg-[#0f1419] border border-[#01abfd] rounded px-2 py-1 text-white text-xs text-center outline-none"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  onStockUpdate(
                                    p._id,
                                    parseInt(stockInput),
                                    null,
                                    true,
                                  );
                                }
                              }}
                            />
                            <button
                              onClick={() =>
                                onStockUpdate(
                                  p._id,
                                  parseInt(stockInput),
                                  null,
                                  true,
                                )
                              }
                              className="text-green-400 hover:text-green-300 text-xs"
                            >
                              <FaCheckCircle />
                            </button>
                            <button
                              onClick={() => setEditingStock(null)}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`text-sm font-semibold ${
                              p.totalStock === 0
                                ? "text-red-400"
                                : p.isLowStock
                                  ? "text-yellow-400"
                                  : "text-green-400"
                            } ${usesSplitInventory ? "" : "cursor-pointer hover:underline"}`}
                            onClick={() => {
                              if (usesSplitInventory) return;
                              setEditingStock(productEditKey);
                              setStockInput(p.totalStock?.toString() || "0");
                            }}
                          >
                            {usesSplitInventory
                              ? `${p.totalStock} (${hasVariantRows ? "variants" : "colors"})`
                              : p.totalStock}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${getStatusChipClass(
                            p.stockStatus,
                          )}`}
                        >
                          {p.stockStatus?.replace("_", " ").toUpperCase() ||
                            "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {usesSplitInventory ? (
                          <button
                            onClick={() => toggleExpanded(p._id)}
                            className="text-[#01abfd] hover:text-[#0189d1] text-xs"
                          >
                            {rowExpanded
                              ? hasVariantRows
                                ? "Hide Variants"
                                : "Hide Colors"
                              : hasVariantRows
                                ? "View Variants"
                                : "View Colors"}
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingStock(productEditKey);
                              setStockInput(p.totalStock?.toString() || "0");
                            }}
                            className="text-[#01abfd] hover:text-[#0189d1] text-xs"
                          >
                            Edit Stock
                          </button>
                        )}
                      </td>
                    </tr>

                    {usesSplitInventory && rowExpanded && (
                      <tr className="bg-[#151829]">
                        <td colSpan={5} className="px-4 py-4">
                          <div className="space-y-3">
                            {p.colorInventory?.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {p.colorInventory.map((c) => (
                                  <div
                                    key={`${p._id}-${c.color}`}
                                    className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border border-gray-700/60 ${getStatusChipClass(
                                      c.stockStatus,
                                    )}`}
                                  >
                                    <span
                                      className="w-3 h-3 rounded-full border border-white/30"
                                      style={{
                                        backgroundColor: c.hex || "#777",
                                      }}
                                    />
                                    <span className="text-[11px] font-medium text-white">
                                      {c.color}
                                    </span>
                                    <span className="text-[10px] text-gray-200/90">
                                      {c.totalStock} in stock
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {hasVariantRows && (
                              <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                                <table className="w-full text-xs">
                                  <thead className="bg-[#1b1f33]">
                                    <tr>
                                      <th className="text-left px-3 py-2 text-gray-400 uppercase">
                                        Variant
                                      </th>
                                      <th className="text-left px-3 py-2 text-gray-400 uppercase">
                                        Color
                                      </th>
                                      <th className="text-left px-3 py-2 text-gray-400 uppercase">
                                        SKU
                                      </th>
                                      <th className="text-center px-3 py-2 text-gray-400 uppercase">
                                        Stock
                                      </th>
                                      <th className="text-center px-3 py-2 text-gray-400 uppercase">
                                        Pre-order
                                      </th>
                                      <th className="text-center px-3 py-2 text-gray-400 uppercase">
                                        Status
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-700/50">
                                    {(p.variants || []).map((v) => {
                                      const variantEditKey = getEditKey(
                                        p._id,
                                        v._id,
                                      );
                                      return (
                                        <tr key={v._id || v.name}>
                                          <td className="px-3 py-2 text-gray-200">
                                            {v.name}
                                          </td>
                                          <td className="px-3 py-2 text-gray-300">
                                            {v.color || "-"}
                                          </td>
                                          <td className="px-3 py-2 text-gray-400">
                                            {v.sku || "-"}
                                          </td>
                                          <td className="px-3 py-2 text-center">
                                            {editingStock === variantEditKey ? (
                                              <div className="flex items-center justify-center gap-1">
                                                <input
                                                  type="number"
                                                  min="0"
                                                  value={stockInput}
                                                  onChange={(e) =>
                                                    setStockInput(
                                                      e.target.value,
                                                    )
                                                  }
                                                  className="w-16 bg-[#0f1419] border border-[#01abfd] rounded px-2 py-1 text-white text-xs text-center outline-none"
                                                  autoFocus
                                                  onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                      onStockUpdate(
                                                        p._id,
                                                        parseInt(stockInput),
                                                        v._id,
                                                        true,
                                                      );
                                                    }
                                                  }}
                                                />
                                                <button
                                                  onClick={() =>
                                                    onStockUpdate(
                                                      p._id,
                                                      parseInt(stockInput),
                                                      v._id,
                                                      true,
                                                    )
                                                  }
                                                  className="text-green-400 hover:text-green-300"
                                                >
                                                  <FaCheckCircle />
                                                </button>
                                                <button
                                                  onClick={() =>
                                                    setEditingStock(null)
                                                  }
                                                  className="text-red-400 hover:text-red-300"
                                                >
                                                  <FaTimes />
                                                </button>
                                              </div>
                                            ) : (
                                              <button
                                                onClick={() => {
                                                  setEditingStock(
                                                    variantEditKey,
                                                  );
                                                  setStockInput(
                                                    v.stock?.toString() || "0",
                                                  );
                                                }}
                                                className="font-semibold text-[#01abfd] hover:underline"
                                              >
                                                {v.stock}
                                              </button>
                                            )}
                                          </td>
                                          <td className="px-3 py-2 text-center">
                                            {v.isPreOrder ? (
                                              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-purple-500/20 text-purple-300">
                                                ENABLED
                                              </span>
                                            ) : (
                                              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-gray-600/30 text-gray-300">
                                                OFF
                                              </span>
                                            )}
                                          </td>
                                          <td className="px-3 py-2 text-center">
                                            <span
                                              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusChipClass(
                                                v.stockStatus,
                                              )}`}
                                            >
                                              {v.stockStatus
                                                ?.replace("_", " ")
                                                .toUpperCase() || "N/A"}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-[#1e2139] rounded-xl border border-gray-700/50 p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-lg ${color}`}>{icon}</span>
        <span className="text-xs text-gray-400 font-medium">{label}</span>
      </div>
      <span className="text-2xl font-bold text-white">{value}</span>
    </div>
  );
}
