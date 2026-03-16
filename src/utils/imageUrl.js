/**
 * Image URL normalizer for Krishnova frontend.
 *
 * The backend may return:
 *   - Full correct URL:  https://krishnanova-backend.onrender.com/api/uploads/products/file.png
 *   - Localhost URL:      http://localhost:5000/api/uploads/products/file.png
 *   - Relative path:     /uploads/products/file.png  or  /api/uploads/products/file.png
 *
 * This utility normalizes any of these to the correct production URL.
 */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://krishnanova-backend.onrender.com/api";

// Backend base URL (without /api suffix)
const BACKEND_BASE = API_URL.replace(/\/api\/?$/, "");

/**
 * Normalize any image/media URL to point to the correct backend domain.
 * @param {string|null} url - The image URL from the API response
 * @returns {string|null} - Corrected full URL, or null if input is falsy
 */
export function normalizeImageUrl(url) {
  if (!url) return null;

  // Already a valid non-localhost full URL — return as-is
  if (
    (url.startsWith("http://") || url.startsWith("https://")) &&
    !url.includes("localhost") &&
    !url.includes("127.0.0.1")
  ) {
    return url;
  }

  // Localhost URL — extract the relative path
  const localhostMatch = url.match(
    /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(\/.*)/i,
  );
  if (localhostMatch) {
    url = localhostMatch[1]; // e.g. /api/uploads/products/file.png
  }

  // Relative path — construct full URL using backend base
  const cleanPath = url.replace(/^\/+/, "");
  if (cleanPath.startsWith("api/")) {
    return `${BACKEND_BASE}/${cleanPath}`;
  }
  return `${BACKEND_BASE}/api/${cleanPath}`;
}

export default normalizeImageUrl;
