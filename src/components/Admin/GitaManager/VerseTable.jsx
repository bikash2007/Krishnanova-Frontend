import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoSearch, IoAdd, IoTrash, IoCreate } from "react-icons/io5";
import { GiWhiteBook } from "react-icons/gi";

const VerseTable = ({ onEdit, onRefresh }) => {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchChapter, setSearchChapter] = useState("");
  const [searchVerse, setSearchVerse] = useState("");

  useEffect(() => {
    fetchVerses();
  }, [page, searchChapter, searchVerse]);

  const fetchVerses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (searchChapter) params.append("chapter", searchChapter);
      if (searchVerse) params.append("verse", searchVerse);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/gita/all?${params}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setVerses(data.verses || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch verses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this verse?")) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/gita/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        fetchVerses();
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      alert("Failed to delete verse");
    }
  };

  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-amber-200 flex items-center gap-2">
          <GiWhiteBook className="text-3xl" />
          Manage Verses
        </h2>
      </div>

      {/* Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-amber-200 text-sm mb-2 block">Chapter</label>
          <input
            type="number"
            min="1"
            max="18"
            placeholder="Filter by chapter"
            value={searchChapter}
            onChange={(e) => {
              setSearchChapter(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-amber-400/30 text-amber-200 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="text-amber-200 text-sm mb-2 block">Verse</label>
          <input
            type="number"
            min="1"
            placeholder="Filter by verse"
            value={searchVerse}
            onChange={(e) => {
              setSearchVerse(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-amber-400/30 text-amber-200 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setSearchChapter("");
              setSearchVerse("");
              setPage(1);
            }}
            className="w-full px-4 py-2 bg-white/10 text-blue-100 rounded-lg hover:bg-white/20 transition-all"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full mx-auto"
          />
        </div>
      ) : verses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-blue-100/60">No verses found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 text-amber-200 font-semibold">
                  Ch.
                </th>
                <th className="text-left py-3 px-4 text-amber-200 font-semibold">
                  Verse
                </th>
                <th className="text-left py-3 px-4 text-amber-200 font-semibold">
                  Sanskrit
                </th>
                <th className="text-left py-3 px-4 text-amber-200 font-semibold">
                  Translation
                </th>
                <th className="text-right py-3 px-4 text-amber-200 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {verses.map((verse) => (
                <tr
                  key={verse.id}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-4 text-amber-200 font-bold">
                    {verse.chapter}
                  </td>
                  <td className="py-3 px-4 text-blue-100">{verse.verse_number}</td>
                  <td className="py-3 px-4 text-blue-100/80 max-w-xs truncate font-serif">
                    {verse.sanskrit}
                  </td>
                  <td className="py-3 px-4 text-blue-100/80 max-w-md truncate">
                    {verse.translation}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button
                        onClick={() => onEdit(verse)}
                        className="p-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Edit"
                      >
                        <IoCreate />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(verse.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete"
                      >
                        <IoTrash />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg ${
              page === 1
                ? "bg-white/5 text-blue-100/30 cursor-not-allowed"
                : "bg-white/10 text-blue-100 hover:bg-white/20"
            }`}
          >
            Previous
          </button>

          <span className="text-blue-100/80">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg ${
              page === totalPages
                ? "bg-white/5 text-blue-100/30 cursor-not-allowed"
                : "bg-white/10 text-blue-100 hover:bg-white/20"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default VerseTable;
