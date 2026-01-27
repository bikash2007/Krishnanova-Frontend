import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://krishnanova-backend.onrender.com/api";

const initialProductFormData = {
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
};

export default function ProductManagement() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(initialProductFormData);
  const [mediaFiles, setMediaFiles] = useState([]); // Images/videos for upload
  const [mediaPreview, setMediaPreview] = useState([]); // Previews for newly selected files

  // For editing: show previously uploaded media
  const [existingMedia, setExistingMedia] = useState({
    images: [],
    videos: [],
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      setError("Access Denied. You must be an admin.");
      setLoading(false);
      return;
    }
    if (user && isAdmin) {
      fetchProducts();
    }
  }, [user, isAdmin, authLoading]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (e, index, field) => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  // Handle multi file (images/videos) upload
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
    setMediaPreview(
      files.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type,
      })),
    );
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(initialProductFormData);
    setMediaFiles([]);
    setMediaPreview([]);
    setExistingMedia({ images: [], videos: [] });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    // Only extract editable fields, not MongoDB fields like _id, __v, createdAt, images, videos
    setFormData({
      title: product.title || "",
      shortTitle: product.shortTitle || "",
      desc: product.desc || "",
      fullDescription: product.fullDescription || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      category: product.category || "Spiritual Accessories",
      features:
        product.features && product.features.length ? product.features : [""],
      benefits:
        product.benefits && product.benefits.length ? product.benefits : [""],
      inStock: product.inStock !== undefined ? product.inStock : true,
      fastShipping: product.fastShipping || false,
    });
    setMediaFiles([]);
    setMediaPreview([]);
    setExistingMedia({
      images: product.images || [],
      videos: product.videos || [],
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData(initialProductFormData);
    setMediaFiles([]);
    setMediaPreview([]);
    setExistingMedia({ images: [], videos: [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    for (const key in formData) {
      if (Array.isArray(formData[key])) {
        const filteredArray = formData[key].filter(
          (item) => item.trim() !== "",
        );
        data.append(key, JSON.stringify(filteredArray));
      } else {
        data.append(key, formData[key]);
      }
    }
    // Multiple media files
    mediaFiles.forEach((file) => data.append("media", file));
    // For edit: preserve existing media if not replaced
    if (
      editingProduct &&
      !mediaFiles.length &&
      (existingMedia.images.length || existingMedia.videos.length)
    ) {
      data.append("images", JSON.stringify(existingMedia.images));
      data.append("videos", JSON.stringify(existingMedia.videos));
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editingProduct) {
        await axios.put(
          `${API_URL}/products/${editingProduct._id}`,
          data,
          config,
        );
      } else {
        await axios.post(`${API_URL}/products`, data, config);
      }
      fetchProducts();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProducts();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete product.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fbfd]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#01abfd]"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <p className="text-red-700 text-xl">
          Access Denied. You must be an admin to view this page.
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.h1
        className="text-4xl font-bold text-[#0f1f2e] mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Product Management
      </motion.h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="mb-6 flex justify-end">
        <motion.button
          onClick={openAddModal}
          className="bg-gradient-to-r from-[#01abfd] to-[#2e8b57] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add New Product
        </motion.button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#01abfd]"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Media
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <motion.tr
                  key={product._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.images && product.images.length > 0 && (
                      <img
                        src={`${API_URL.replace("/api", "")}${
                          product.images[0]
                        }`}
                        alt={product.title}
                        className="h-12 w-12 object-cover rounded-md"
                      />
                    )}
                    {product.videos && product.videos.length > 0 && (
                      <video
                        src={`${API_URL.replace("/api", "")}${
                          product.videos[0]
                        }`}
                        className="h-12 w-12 object-cover rounded-md mt-1"
                        controls
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0f1f2e]">
                    {product.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2e8b57] font-semibold">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-[#01abfd] hover:text-[#0189d1] mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-[#0f1f2e] mb-6">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Title
                  </label>
                  <input
                    type="text"
                    name="shortTitle"
                    value={formData.shortTitle}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="desc"
                    value={formData.desc}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg p-2 h-20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Description
                  </label>
                  <textarea
                    name="fullDescription"
                    value={formData.fullDescription}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg p-2 h-32"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Original Price
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="Spiritual Accessories">
                      Spiritual Accessories
                    </option>
                    <option value="Sacred Texts">Sacred Texts</option>
                    <option value="Meditation Items">Meditation Items</option>
                    <option value="Puja Items">Puja Items</option>
                  </select>
                </div>
                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features
                  </label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) =>
                          handleArrayChange(e, index, "features")
                        }
                        className="flex-1 border border-gray-300 rounded-lg p-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, "features")}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("features")}
                    className="text-[#01abfd] hover:underline text-sm"
                  >
                    Add Feature
                  </button>
                </div>
                {/* Benefits */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Benefits
                  </label>
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) =>
                          handleArrayChange(e, index, "benefits")
                        }
                        className="flex-1 border border-gray-300 rounded-lg p-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, "benefits")}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("benefits")}
                    className="text-[#01abfd] hover:underline text-sm"
                  >
                    Add Benefit
                  </button>
                </div>
                {/* Media Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Media (Images and Videos)
                  </label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleMediaChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {/* Preview new media files */}
                    {mediaPreview.map((media, i) =>
                      media.type.startsWith("image/") ? (
                        <img
                          key={i}
                          src={media.url}
                          alt="preview"
                          className="h-16 w-16 object-cover rounded"
                        />
                      ) : (
                        <video
                          key={i}
                          src={media.url}
                          className="h-16 w-16 object-cover rounded"
                          controls
                        />
                      ),
                    )}
                    {/* Show existing uploaded media (edit mode) */}
                    {!mediaPreview.length &&
                      (existingMedia.images.length > 0 ||
                        existingMedia.videos.length > 0) && (
                        <>
                          {existingMedia.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={`${API_URL.replace("/api", "")}${img}`}
                              alt="existing"
                              className="h-16 w-16 object-cover rounded"
                            />
                          ))}
                          {existingMedia.videos.map((vid, idx) => (
                            <video
                              key={idx}
                              src={`${API_URL.replace("/api", "")}${vid}`}
                              className="h-16 w-16 object-cover rounded"
                              controls
                            />
                          ))}
                        </>
                      )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleFormChange}
                      className="mr-2"
                    />
                    In Stock
                  </label>
                  <label className="flex items-center text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="fastShipping"
                      checked={formData.fastShipping}
                      onChange={handleFormChange}
                      className="mr-2"
                    />
                    Fast Shipping
                  </label>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-[#01abfd] to-[#2e8b57] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading
                      ? "Saving..."
                      : editingProduct
                        ? "Update Product"
                        : "Add Product"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
