import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoSave, IoClose } from "react-icons/io5";
import { GiScrollUnfurled } from "react-icons/gi";

const VerseEditor = ({ verse = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    chapter: verse?.chapter || 1,
    verse_number: verse?.verse_number || 1,
    sanskrit: verse?.sanskrit || "",
    transliteration: verse?.transliteration || "",
    translation: verse?.translation || "",
    explanation: verse?.explanation || "",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (formData.chapter < 1 || formData.chapter > 18) {
      newErrors.chapter = "Chapter must be between 1 and 18";
    }
    if (formData.verse_number < 1) {
      newErrors.verse_number = "Verse number must be positive";
    }
    if (!formData.sanskrit.trim()) {
      newErrors.sanskrit = "Sanskrit text is required";
    }
    if (!formData.translation.trim()) {
      newErrors.translation = "Translation is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const url = verse
        ? `${import.meta.env.VITE_API_URL}/admin/gita/update/${verse.id}`
        : `${import.meta.env.VITE_API_URL}/admin/gita/add`;

      const response = await fetch(url, {
        method: verse ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        onSave(data);
      } else {
        const error = await response.json();
        alert(error.message || "Failed to save verse");
      }
    } catch (error) {
      alert("Network error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-amber-200 flex items-center gap-2">
          <GiScrollUnfurled className="text-3xl" />
          {verse ? "Edit Verse" : "Add New Verse"}
        </h2>
        <button
          onClick={onCancel}
          className="text-blue-100/60 hover:text-amber-200 transition-colors"
        >
          <IoClose className="text-3xl" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Chapter & Verse Number */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-amber-200 font-semibold mb-2 block">
              Chapter *
            </label>
            <input
              type="number"
              min="1"
              max="18"
              value={formData.chapter}
              onChange={(e) =>
                setFormData({ ...formData, chapter: parseInt(e.target.value) })
              }
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-amber-400/30 text-amber-200 focus:outline-none focus:border-amber-400"
            />
            {errors.chapter && (
              <p className="text-red-400 text-sm mt-1">{errors.chapter}</p>
            )}
          </div>

          <div>
            <label className="text-amber-200 font-semibold mb-2 block">
              Verse Number *
            </label>
            <input
              type="number"
              min="1"
              value={formData.verse_number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  verse_number: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-amber-400/30 text-amber-200 focus:outline-none focus:border-amber-400"
            />
            {errors.verse_number && (
              <p className="text-red-400 text-sm mt-1">{errors.verse_number}</p>
            )}
          </div>
        </div>

        {/* Sanskrit */}
        <div>
          <label className="text-amber-200 font-semibold mb-2 block">
            Sanskrit Text *
          </label>
          <textarea
            value={formData.sanskrit}
            onChange={(e) =>
              setFormData({ ...formData, sanskrit: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-amber-400/30 text-amber-200 focus:outline-none focus:border-amber-400 font-serif"
            placeholder="Enter Sanskrit verse in Devanagari script"
          />
          {errors.sanskrit && (
            <p className="text-red-400 text-sm mt-1">{errors.sanskrit}</p>
          )}
        </div>

        {/* Transliteration */}
        <div>
          <label className="text-amber-200 font-semibold mb-2 block">
            Transliteration
          </label>
          <textarea
            value={formData.transliteration}
            onChange={(e) =>
              setFormData({ ...formData, transliteration: e.target.value })
            }
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-amber-400/30 text-amber-200 focus:outline-none focus:border-amber-400"
            placeholder="Enter transliteration in Roman script"
          />
        </div>

        {/* Translation */}
        <div>
          <label className="text-amber-200 font-semibold mb-2 block">
            Translation *
          </label>
          <textarea
            value={formData.translation}
            onChange={(e) =>
              setFormData({ ...formData, translation: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-amber-400/30 text-amber-200 focus:outline-none focus:border-amber-400"
            placeholder="Enter English translation"
          />
          {errors.translation && (
            <p className="text-red-400 text-sm mt-1">{errors.translation}</p>
          )}
        </div>

        {/* Explanation */}
        <div>
          <label className="text-amber-200 font-semibold mb-2 block">
            Explanation
          </label>
          <textarea
            value={formData.explanation}
            onChange={(e) =>
              setFormData({ ...formData, explanation: e.target.value })
            }
            rows={5}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-amber-400/30 text-amber-200 focus:outline-none focus:border-amber-400"
            placeholder="Enter detailed explanation"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <motion.button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-white/10 text-blue-100 rounded-xl font-semibold hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>

          <motion.button
            type="submit"
            disabled={saving}
            className={`flex-1 py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 ${
              saving
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:shadow-amber-400/50"
            }`}
            whileHover={!saving ? { scale: 1.02 } : {}}
            whileTap={!saving ? { scale: 0.98 } : {}}
          >
            {saving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Saving...
              </>
            ) : (
              <>
                <IoSave />
                {verse ? "Update Verse" : "Add Verse"}
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default VerseEditor;
