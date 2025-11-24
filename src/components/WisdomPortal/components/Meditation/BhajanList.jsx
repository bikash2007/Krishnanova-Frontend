import React, { useState } from "react";
import { motion } from "framer-motion";
import { GiFlute, GiPrayerBeads, GiLotusFlower } from "react-icons/gi";
import { IoMusicalNotes, IoPlay, IoPause, IoHeart, IoHeartOutline } from "react-icons/io5";

const BhajanList = () => {
  const [favorites, setFavorites] = useState(new Set());
  const [currentPlaying, setCurrentPlaying] = useState(null);

  const bhajans = [
    {
      id: "bhajan-1",
      title: "Hare Krishna Maha Mantra",
      artist: "ISKCON Devotees",
      category: "Krishna",
      youtubeId: "dQw4w9WgXcQ", // Replace with actual YouTube IDs
      mood: "Devotional",
    },
    {
      id: "bhajan-2",
      title: "Govinda Bolo Hari Gopal Bolo",
      artist: "Jagjit Singh",
      category: "Krishna",
      youtubeId: "dQw4w9WgXcQ",
      mood: "Joyful",
    },
    {
      id: "bhajan-3",
      title: "Achyutam Keshavam",
      artist: "Coke Studio",
      category: "Krishna",
      youtubeId: "dQw4w9WgXcQ",
      mood: "Peaceful",
    },
    {
      id: "bhajan-4",
      title: "Radhe Radhe Govinda",
      artist: "Anup Jalota",
      category: "Radha-Krishna",
      youtubeId: "dQw4w9WgXcQ",
      mood: "Devotional",
    },
    {
      id: "bhajan-5",
      title: "Shri Krishna Govind Hare Murari",
      artist: "Jagjit Singh",
      category: "Krishna",
      youtubeId: "dQw4w9WgXcQ",
      mood: "Meditative",
    },
    {
      id: "bhajan-6",
      title: "Radha Krishna Bhajan",
      artist: "Anuradha Paudwal",
      category: "Radha-Krishna",
      youtubeId: "dQw4w9WgXcQ",
      mood: "Joyful",
    },
  ];

  const categories = ["All", "Krishna", "Radha-Krishna"];
  const moods = ["All", "Devotional", "Peaceful", "Joyful", "Meditative"];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMood, setSelectedMood] = useState("All");

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const filteredBhajans = bhajans.filter((bhajan) => {
    const categoryMatch =
      selectedCategory === "All" || bhajan.category === selectedCategory;
    const moodMatch = selectedMood === "All" || bhajan.mood === selectedMood;
    return categoryMatch && moodMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl">
              <GiFlute className="text-4xl text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-bold text-amber-200 mb-3">
            Sacred Bhajans & Kirtans
          </h1>
          <p className="text-blue-100/80 text-lg">
            Immerse yourself in divine melodies
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Category Filter */}
          <div>
            <label className="text-amber-200 font-semibold mb-2 block">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                      : "bg-white/10 text-blue-100 hover:bg-white/20"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Mood Filter */}
          <div>
            <label className="text-amber-200 font-semibold mb-2 block">
              Mood
            </label>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <motion.button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    selectedMood === mood
                      ? "bg-gradient-to-r from-purple-400 to-indigo-500 text-white"
                      : "bg-white/10 text-blue-100 hover:bg-white/20"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {mood}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Bhajan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBhajans.map((bhajan, index) => (
            <motion.div
              key={bhajan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl overflow-hidden border border-white/20 shadow-2xl hover:border-amber-400/50 transition-all"
            >
              {/* YouTube Embed */}
              <div className="aspect-video bg-black/50">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${bhajan.youtubeId}`}
                  title={bhajan.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-amber-200 mb-1">
                      {bhajan.title}
                    </h3>
                    <p className="text-sm text-blue-100/70">{bhajan.artist}</p>
                  </div>
                  <motion.button
                    onClick={() => toggleFavorite(bhajan.id)}
                    className="text-2xl"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {favorites.has(bhajan.id) ? (
                      <IoHeart className="text-rose-400" />
                    ) : (
                      <IoHeartOutline className="text-blue-100/50" />
                    )}
                  </motion.button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-purple-400/20 to-blue-500/20 text-purple-200 border border-purple-400/30">
                    {bhajan.category}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-500/20 text-amber-200 border border-amber-400/30">
                    {bhajan.mood}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBhajans.length === 0 && (
          <div className="text-center py-12">
            <GiLotusFlower className="text-6xl text-blue-100/40 mx-auto mb-4" />
            <p className="text-blue-100/60 text-lg">
              No bhajans found for this selection
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BhajanList;
