import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  IoCloudUpload,
  IoCheckmark,
  IoClose,
  IoWarning,
  IoDownload,
} from "react-icons/io5";
import { GiWhiteBook } from "react-icons/gi";

const BulkUpload = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile);
        setResult(null);
        setErrors([]);
      } else {
        alert("Please upload a CSV or Excel file");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setResult(null);
    setErrors([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/gita/upload-bulk`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        if (data.errors && data.errors.length > 0) {
          setErrors(data.errors);
        }
        if (onUploadComplete) {
          onUploadComplete(data);
        }
      } else {
        setErrors([{ row: 0, error: data.message || "Upload failed" }]);
      }
    } catch (error) {
      setErrors([{ row: 0, error: "Network error: " + error.message }]);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `chapter_number,verse_number,sanskrit,transliteration,translation,explanation
1,1,धृतराष्ट्र उवाच धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।,dhṛtarāṣṭra uvāca dharma-kṣetre kuru-kṣetre samavetā yuyutsavaḥ,"Dhritarashtra said: O Sanjaya, after my sons and the sons of Pandu assembled in the place of pilgrimage at Kurukshetra, desiring to fight, what did they do?","King Dhritarashtra inquires from his secretary Sanjaya about the events at Kurukshetra..."
1,2,मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय।,māmakāḥ pāṇḍavāścaiva kimakurvata sañjaya,"What did my people and the sons of Pandu do, O Sanjaya?","The blind king asks about the actions of both armies..."`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gita_verses_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-amber-200 flex items-center gap-2">
          <IoCloudUpload className="text-3xl" />
          Bulk Upload Verses
        </h2>
        <motion.button
          onClick={downloadTemplate}
          className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <IoDownload />
          Download Template
        </motion.button>
      </div>

      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-xl p-4 border border-blue-400/30">
          <h3 className="text-amber-200 font-semibold mb-2">Instructions:</h3>
          <ul className="text-blue-100/80 text-sm space-y-1 list-disc list-inside">
            <li>Download the template CSV file</li>
            <li>Fill in all verses with required fields</li>
            <li>Chapter must be 1-18, verse numbers must be sequential</li>
            <li>Sanskrit and Translation are required</li>
            <li>Upload the completed CSV or Excel file</li>
          </ul>
        </div>

        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            file
              ? "border-green-400 bg-green-400/10"
              : "border-white/30 hover:border-amber-400/50"
          }`}
        >
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer block">
            {file ? (
              <div>
                <IoCheckmark className="text-6xl text-green-400 mx-auto mb-3" />
                <p className="text-green-300 font-semibold mb-1">{file.name}</p>
                <p className="text-blue-100/60 text-sm">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <IoCloudUpload className="text-6xl text-amber-300 mx-auto mb-3" />
                <p className="text-amber-200 font-semibold mb-1">
                  Click to upload CSV or Excel file
                </p>
                <p className="text-blue-100/60 text-sm">
                  Supports .csv, .xlsx, .xls files
                </p>
              </div>
            )}
          </label>
        </div>

        {/* Upload Button */}
        {file && (
          <motion.button
            onClick={handleUpload}
            disabled={uploading}
            className={`w-full py-3 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 ${
              uploading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:shadow-amber-400/50"
            }`}
            whileHover={!uploading ? { scale: 1.02 } : {}}
            whileTap={!uploading ? { scale: 0.98 } : {}}
          >
            {uploading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
                Uploading...
              </>
            ) : (
              <>
                <IoCloudUpload className="text-2xl" />
                Upload Verses
              </>
            )}
          </motion.button>
        )}

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-6 border ${
              errors.length > 0
                ? "bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-400/30"
                : "bg-gradient-to-r from-green-400/20 to-emerald-500/20 border-green-400/30"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              {errors.length > 0 ? (
                <IoWarning className="text-4xl text-yellow-400" />
              ) : (
                <IoCheckmark className="text-4xl text-green-400" />
              )}
              <div>
                <h3 className="text-xl font-bold text-amber-200">
                  {errors.length > 0 ? "Upload Completed with Warnings" : "Upload Successful!"}
                </h3>
                <p className="text-blue-100/80">
                  {result.imported} verses imported successfully
                </p>
              </div>
            </div>

            {errors.length > 0 && (
              <div className="mt-4">
                <h4 className="text-amber-200 font-semibold mb-2">Errors:</h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {errors.map((err, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 rounded-lg p-3 flex items-start gap-2"
                    >
                      <IoClose className="text-red-400 text-xl flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-300 font-semibold text-sm">
                          Row {err.row}
                        </p>
                        <p className="text-blue-100/80 text-sm">{err.error}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BulkUpload;
