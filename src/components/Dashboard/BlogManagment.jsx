// AdminBlogPanel.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaTrash,
  FaBlog,
  FaUser,
  FaClock,
  FaImage,
  FaSearch,
} from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

// Helper function - Backend now returns full URLs
const getFullUrl = (url) => {
  return url || null;
};

// Generate fallback avatar URL
const getFallbackAvatar = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=01abfd&color=fff&size=128`;
};

// Transform post data - Backend now sends full URLs already
const transformPostData = (post) => {
  return post; // No transformation needed - backend sends full URLs
};

export default function BlogManagment() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  // Filter posts based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = posts.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.author?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchTerm, posts]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API}/blog`, { timeout: 30000 });
      // Handle different response structures
      const data = res.data;
      let postsData = [];
      if (Array.isArray(data)) {
        postsData = data;
      } else if (data && Array.isArray(data.posts)) {
        postsData = data.posts;
      } else if (data && Array.isArray(data.data)) {
        postsData = data.data;
      } else {
        console.error("Unexpected API response structure:", data);
      }

      // Transform posts to have full URLs
      const transformedPosts = postsData.map(transformPostData);

      setPosts(transformedPosts);
      setFilteredPosts(transformedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      if (err.code === "ECONNABORTED") {
        setError(
          "Request timed out. The server is taking too long to respond. Please try again.",
        );
      } else {
        setError(err.response?.data?.message || "Failed to load blog posts");
      }
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleAdminDelete = async (id) => {
    if (!window.confirm("Admin: Delete this blog post?")) return;

    setLoading(true);
    try {
      await axios.delete(`${API}/blog/${id}/admin`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        timeout: 30000,
      });
      await fetchPosts();
      showSuccess("Blog post deleted successfully!");
    } catch (err) {
      console.error("Error deleting post:", err);
      if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else {
        setError(err.response?.data?.message || "Failed to delete blog post");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin")
    return (
      <div className="p-8 text-center">
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 max-w-md mx-auto backdrop-blur-sm">
          <FaBlog className="text-red-400 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-red-300 mb-2">
            Access Denied
          </h3>
          <p className="text-red-200">Admins only!</p>
        </div>
      </div>
    );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#01abfd] shadow-lg"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-[#01abfd] opacity-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#01abfd] to-[#10b981] bg-clip-text text-transparent mb-2">
            Community Blogs
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Manage all community blog posts
          </p>
        </div>
        <div className="flex items-center gap-3 bg-gradient-to-r from-[#01abfd] to-[#10b981] px-4 py-2 rounded-xl shadow-lg">
          <FaBlog className="text-white" />
          <span className="text-white font-semibold">
            {posts.length} Total Posts
          </span>
        </div>
      </motion.div>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-900/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl backdrop-blur-sm"
        >
          {successMessage}
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl backdrop-blur-sm"
        >
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right text-red-400 hover:text-red-300"
          >
            ×
          </button>
        </motion.div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search posts by title, content, or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[#1e2139] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#01abfd] focus:border-transparent transition-all"
        />
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 && !error ? (
        <div className="text-center py-16 bg-[#1e2139] rounded-xl border border-gray-700">
          <FaBlog className="text-6xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">
            {searchTerm ? "No posts found" : "No blog posts yet"}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "Blog posts will appear here once created"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-[#1e2139] to-[#23263a] rounded-2xl shadow-xl border border-gray-700/50 p-5 hover:shadow-2xl hover:border-gray-600/50 transition-all duration-300"
            >
              {/* Author Info */}
              <div className="flex items-center mb-3">
                <img
                  src={
                    post.author?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || "User")}&background=01abfd&color=fff&size=128`
                  }
                  alt={post.author?.name || "User"}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#01abfd] mr-3"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || "User")}&background=01abfd&color=fff&size=128`;
                  }}
                />
                <div className="flex-1">
                  <div className="font-bold text-[#01abfd] flex items-center">
                    <FaUser className="mr-1 text-sm" />
                    {post.author?.name || "Unknown Author"}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center">
                    <FaClock className="mr-1" />
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <button
                  onClick={() => handleAdminDelete(post._id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all"
                  title="Delete Post"
                >
                  <FaTrash />
                </button>
              </div>

              {/* Post Title */}
              <h3 className="font-bold text-lg text-white mb-2">
                {post.title}
              </h3>

              {/* Post Content */}
              <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                {post.content}
              </p>

              {/* Post Image */}
              {post.image && (
                <div className="relative rounded-lg overflow-hidden mb-2">
                  <FaImage className="absolute top-2 right-2 text-white/70 z-10" />
                  <img
                    src={post.image}
                    alt="blog"
                    className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Results Counter */}
      {!loading && filteredPosts.length > 0 && (
        <div className="text-center text-gray-400 text-sm">
          Showing {filteredPosts.length} of {posts.length} posts
        </div>
      )}
    </div>
  );
}
