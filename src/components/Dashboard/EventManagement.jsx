import { useState, useEffect, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { format } from "date-fns";
import { useAuth } from "../../Context/AuthContext";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
  FaPlus,
  FaUser,
  FaSpinner,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "https://krishnanova-backend.onrender.com/api";

const initialEventFormData = {
  name: "",
  date: "",
  description: "",
  location: "Online",
};

// **Performance Optimization: Memoized Event Card**
const EventCard = memo(({ event, onEdit, onDelete, index }) => {
  const formatEventDate = useCallback((dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid Date";
    }
  }, []);

  const isUpcoming = new Date(event.date) > new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }} // Reduced delay for performance
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 group"
    >
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {event.name}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isUpcoming
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {isUpcoming ? "Upcoming" : "Past"}
        </span>
      </div>

      {/* Event Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <FaCalendarAlt className="w-4 h-4 mr-3 text-blue-500" />
          <span className="text-sm">{formatEventDate(event.date)}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <FaMapMarkerAlt className="w-4 h-4 mr-3 text-red-500" />
          <span className="text-sm">{event.location}</span>
        </div>

        {event.createdBy && (
          <div className="flex items-center text-gray-600">
            <FaUser className="w-4 h-4 mr-3 text-green-500" />
            <span className="text-sm">By {event.createdBy.name}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {event.description}
      </p>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onEdit(event)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit event"
        >
          <FaEdit size={14} />
        </button>
        <button
          onClick={() => onDelete(event._id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete event"
        >
          <FaTrash size={14} />
        </button>
      </div>
    </motion.div>
  );
});

// **Performance Optimization: Memoized Loading Component**
const LoadingSpinner = memo(() => (
  <div className="flex justify-center items-center py-12">
    <FaSpinner className="animate-spin text-blue-500 text-2xl mr-3" />
    <span className="text-gray-600">Loading events...</span>
  </div>
));

// **Performance Optimization: Memoized Empty State**
const EmptyState = memo(({ onAddEvent }) => (
  <div className="text-center py-16">
    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
      <FaCalendarAlt className="text-blue-500" size={32} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">No Events Yet</h3>
    <p className="text-gray-600 mb-6">
      Create your first event to get started!
    </p>
    <button
      onClick={onAddEvent}
      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
    >
      <FaPlus className="mr-2" />
      Create First Event
    </button>
  </div>
));

export default function EventManagement() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState(initialEventFormData);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      setError("Access Denied. You must be an admin.");
      setLoading(false);
      return;
    }
    if (user && isAdmin) {
      fetchEvents();
    }
  }, [user, isAdmin, authLoading]);

  // **Performance Optimization: Memoized fetch function**
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const openAddModal = useCallback(() => {
    setEditingEvent(null);
    setFormData(initialEventFormData);
    setShowModal(true);
  }, []);

  // **FIXED: Use event.date instead of undefined 'date'**
  const openEditModal = useCallback((event) => {
    setEditingEvent(event);
    setFormData({
      ...event,
      date: format(new Date(event.date), "yyyy-MM-dd"), // ✅ FIXED
    });
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingEvent(null);
    setFormData(initialEventFormData);
    setError(null);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        if (editingEvent) {
          await axios.put(
            `${API_URL}/events/${editingEvent._id}`,
            formData,
            config
          );
        } else {
          await axios.post(`${API_URL}/events`, formData, config);
        }

        await fetchEvents();
        closeModal();
      } catch (err) {
        console.error("Failed to save event:", err);
        setError(err.response?.data?.message || "Failed to save event.");
      } finally {
        setSubmitting(false);
      }
    },
    [editingEvent, formData, fetchEvents, closeModal]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this event?"))
        return;

      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetchEvents();
      } catch (err) {
        console.error("Failed to delete event:", err);
        setError(err.response?.data?.message || "Failed to delete event.");
      }
    },
    [fetchEvents]
  );

  // **Access Control**
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-2">
            Access Denied
          </h2>
          <p className="text-red-600">
            You must be an admin to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Event Management
            </h1>
            <p className="text-gray-600">Create and manage community events</p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <FaPlus className="mr-2" />
            Add New Event
          </button>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Events Content */}
        {loading ? (
          <LoadingSpinner />
        ) : events.length === 0 ? (
          <EmptyState onAddEvent={openAddModal} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <EventCard
                key={event._id}
                event={event}
                index={index}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {editingEvent ? "Edit Event" : "Create New Event"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows={4}
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50"
                    >
                      {submitting
                        ? "Saving..."
                        : editingEvent
                        ? "Update Event"
                        : "Create Event"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
