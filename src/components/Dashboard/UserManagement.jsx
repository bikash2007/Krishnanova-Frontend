import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
// REMOVE THIS LINE: import AdminSidebar from "../components/AdminSidebar/AdminSidebar"; // AdminLayout now provides the sidebar

const API_URL = import.meta.env.VITE_API_URL || "https://krishnanova-backend.onrender.com/api";

export default function UserManagement() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    if (
      window.confirm(
        `Are you sure you want to change this user's role to ${newRole}?`
      )
    ) {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `${API_URL}/admin/users/${userId}/role`,
          { role: newRole },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchUsers(); // Re-fetch users to update table
      } catch (err) {
        console.error("Failed to change user role:", err);
        setError(err.response?.data?.message || "Failed to change role.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers(); // Re-fetch users to update table
      } catch (err) {
        console.error("Failed to delete user:", err);
        setError(err.response?.data?.message || "Failed to delete user.");
      } finally {
        setLoading(false);
      }
    }
  };

  // The loading and access denied states should still be handled within the component
  // as they are specific to its data fetching and authorization requirements.
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
    // The outer div with `min-h-screen`, `bg-[#f9fbfd]`, and `flex` is removed.
    // The AdminSidebar import and usage is removed.
    // The content now directly fills the <Outlet /> in AdminLayout.
    <>
      <motion.h1
        className="text-4xl font-bold text-[#0f1f2e] mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        User Management
      </motion.h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#01abfd]"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(
                (
                  userItem // Renamed to userItem to avoid conflict with `user` from useAuth
                ) => (
                  <motion.tr
                    key={userItem._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0f1f2e]">
                      {userItem.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userItem.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {userItem.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {userItem.role === "user" ? (
                        <button
                          onClick={() =>
                            handleChangeRole(userItem._id, "admin")
                          }
                          className="text-[#2e8b57] hover:text-[#1e5737] mr-4"
                        >
                          Make Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => handleChangeRole(userItem._id, "user")}
                          className="text-[#01abfd] hover:text-[#0189d1] mr-4"
                        >
                          Make User
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(userItem._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
