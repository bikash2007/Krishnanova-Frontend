import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaTrashAlt,
  FaUserPlus,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://krishnanova-backend.onrender.com/api";

export default function UserManagement() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      setError("Access Denied. You must be an admin.");
      setLoading(false);
      return;
    }
    if (user && isAdmin) {
      fetchUsers();
    }
  }, [user, isAdmin, authLoading]);

  // Filter users based on search and role filter
  useEffect(() => {
    let filtered = users;

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 30000,
      });
      const userData = response.data || [];
      setUsers(userData);
      setFilteredUsers(userData);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      let errorMessage;
      if (err.code === "ECONNABORTED") {
        errorMessage =
          "Request timed out. The server is taking too long to respond. Please try again.";
      } else {
        errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to load users. Please try again.";
      }
      setError(errorMessage);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleChangeRole = async (userId, newRole) => {
    if (
      window.confirm(
        `Are you sure you want to change this user's role to ${newRole}?`,
      )
    ) {
      const previousUsers = [...users];
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `${API_URL}/admin/users/${userId}/role`,
          { role: newRole },
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 30000,
          },
        );
        await fetchUsers();
        showSuccess(`User role updated to ${newRole} successfully!`);
      } catch (err) {
        console.error("Failed to change user role:", err);
        const errorMessage =
          err.response?.data?.message || "Failed to change role.";
        setError(errorMessage);
        setUsers(previousUsers);
        setFilteredUsers(previousUsers);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      const previousUsers = [...users];
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        });
        await fetchUsers();
        showSuccess("User deleted successfully!");
      } catch (err) {
        console.error("Failed to delete user:", err);
        const errorMessage =
          err.response?.data?.message || "Failed to delete user.";
        setError(errorMessage);
        setUsers(previousUsers);
        setFilteredUsers(previousUsers);
      } finally {
        setLoading(false);
      }
    }
  };

  // The loading and access denied states
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#01abfd] shadow-lg"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-[#01abfd] opacity-20"></div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 max-w-md text-center backdrop-blur-sm">
          <FaShieldAlt className="text-red-400 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-red-300 mb-2">
            Access Denied
          </h3>
          <p className="text-red-200">
            You must be an admin to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#01abfd] to-[#10b981] bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 rounded-xl shadow-lg">
          <FaUserPlus className="text-white text-lg" />
          <span className="text-white font-semibold">
            {users.length} Total Users
          </span>
        </div>
      </motion.div>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-green-900/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl relative backdrop-blur-sm"
          role="alert"
        >
          <span className="block sm:inline">{successMessage}</span>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl relative backdrop-blur-sm"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-2 right-2 text-red-400 hover:text-red-300"
          >
            ×
          </button>
        </motion.div>
      )}

      {/* Search and Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#1e2139] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#01abfd] focus:border-transparent transition-all"
          />
        </div>
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#1e2139] border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#01abfd] focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="user">Users Only</option>
            <option value="admin">Admins Only</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#01abfd] shadow-lg"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-[#01abfd] opacity-20"></div>
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-[#1e2139] rounded-xl shadow-md border border-gray-700 p-12 text-center">
          <FaUser className="text-6xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">
            {searchTerm || roleFilter !== "all"
              ? "No users found"
              : "No users yet"}
          </h3>
          <p className="text-gray-500">
            {searchTerm || roleFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Users will appear here once they sign up"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#1e2139] rounded-xl shadow-md border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gradient-to-r from-[#1a1d2e] to-[#252842]">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <FaUser className="mr-2" />
                    Name
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <FaEnvelope className="mr-2" />
                    Email
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <FaShieldAlt className="mr-2" />
                    Role
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredUsers.map((userItem, index) => (
                <motion.tr
                  key={userItem._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-[#252842] transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-[#01abfd] to-[#10b981] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {userItem.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {userItem.name || "Unknown"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {userItem.email || "No email"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        userItem.role === "admin"
                          ? "bg-purple-900/30 text-purple-300 border border-purple-500/30"
                          : "bg-blue-900/30 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {userItem.role?.toUpperCase() || "USER"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {userItem.role === "user" ? (
                      <button
                        onClick={() => handleChangeRole(userItem._id, "admin")}
                        className="text-green-400 hover:text-green-300 transition-colors px-3 py-1 rounded-lg hover:bg-green-900/20"
                      >
                        Make Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handleChangeRole(userItem._id, "user")}
                        className="text-[#01abfd] hover:text-[#0189d1] transition-colors px-3 py-1 rounded-lg hover:bg-blue-900/20"
                      >
                        Make User
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(userItem._id)}
                      className="text-red-400 hover:text-red-300 transition-colors px-3 py-1 rounded-lg hover:bg-red-900/20"
                    >
                      <FaTrashAlt className="inline mr-1" />
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Results Counter */}
      {!loading && filteredUsers.length > 0 && (
        <div className="text-center text-gray-400 text-sm">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      )}
    </div>
  );
}
