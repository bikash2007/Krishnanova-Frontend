import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoAdd, IoCloudUpload, IoList } from "react-icons/io5";
import { GiWhiteBook } from "react-icons/gi";
import BulkUpload from "./BulkUpload";
import VerseEditor from "./VerseEditor";
import VerseTable from "./VerseTable";

const GitaManager = () => {
  const [activeTab, setActiveTab] = useState("table"); // table, add, upload
  const [editingVerse, setEditingVerse] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = (result) => {
    setRefreshKey((prev) => prev + 1);
    alert(`Successfully imported ${result.imported} verses!`);
  };

  const handleSaveVerse = (verse) => {
    setEditingVerse(null);
    setActiveTab("table");
    setRefreshKey((prev) => prev + 1);
    alert("Verse saved successfully!");
  };

  const handleEditVerse = (verse) => {
    setEditingVerse(verse);
    setActiveTab("add");
  };

  const handleCancelEdit = () => {
    setEditingVerse(null);
    setActiveTab("table");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#151922] to-[#1a1f2e] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#01abfd] to-[#10b981] flex items-center justify-center shadow-2xl">
              <GiWhiteBook className="text-4xl text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#01abfd] to-[#10b981] bg-clip-text text-transparent mb-3">
            Bhagavad Gita Manager
          </h1>
          <p className="text-gray-400 text-lg">
            Manage all 700 verses of the Bhagavad Gita
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <motion.button
            onClick={() => {
              setActiveTab("table");
              setEditingVerse(null);
            }}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              activeTab === "table"
                ? "bg-gradient-to-r from-[#01abfd] to-[#10b981] text-white shadow-lg shadow-[#01abfd]/25"
                : "bg-[#1e2139] text-gray-300 hover:bg-[#252842] border border-gray-700"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoList />
            View All Verses
          </motion.button>

          <motion.button
            onClick={() => {
              setActiveTab("add");
              setEditingVerse(null);
            }}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              activeTab === "add"
                ? "bg-gradient-to-r from-[#01abfd] to-[#10b981] text-white shadow-lg shadow-[#01abfd]/25"
                : "bg-[#1e2139] text-gray-300 hover:bg-[#252842] border border-gray-700"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoAdd />
            Add Verse
          </motion.button>

          <motion.button
            onClick={() => setActiveTab("upload")}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              activeTab === "upload"
                ? "bg-gradient-to-r from-[#01abfd] to-[#10b981] text-white shadow-lg shadow-[#01abfd]/25"
                : "bg-[#1e2139] text-gray-300 hover:bg-[#252842] border border-gray-700"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoCloudUpload />
            Bulk Upload
          </motion.button>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "table" && (
            <VerseTable
              key={refreshKey}
              onEdit={handleEditVerse}
              onRefresh={() => setRefreshKey((prev) => prev + 1)}
            />
          )}

          {activeTab === "add" && (
            <VerseEditor
              verse={editingVerse}
              onSave={handleSaveVerse}
              onCancel={handleCancelEdit}
            />
          )}

          {activeTab === "upload" && (
            <BulkUpload onUploadComplete={handleUploadComplete} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GitaManager;
