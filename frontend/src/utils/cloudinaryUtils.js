/**
 * Build a proxied download URL via the backend's /api/download endpoint.
 *
 * Using the HTML `download` attribute on a cross-origin Cloudinary URL is
 * silently ignored by browsers.  Using Cloudinary's `fl_attachment` flag in
 * the URL path causes HTTP 400 for raw (PDF) resources because Cloudinary
 * treats the dot in the filename as a format specifier.
 *
 * Instead, we route the request through the backend which fetches the file
 * from Cloudinary and streams it back with:
 *   Content-Disposition: attachment; filename="<original_name>"
 * so every browser downloads the file with the correct name.
 */
export function buildDownloadUrl(fileUrl, fileName) {
  if (!fileUrl) return null;
  const base = import.meta.env.VITE_API_URL || '';
  return `${base}/api/download?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(fileName || 'document')}`;
}
