const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// True when real GCS credentials are present (not placeholder values)
const isGCSConfigured =
  process.env.GCS_BUCKET_NAME &&
  process.env.GCS_BUCKET_NAME !== 'your-gcs-bucket-name' &&
  process.env.GCS_PROJECT_ID &&
  process.env.GCS_PROJECT_ID !== 'your-gcp-project-id';

// Build Storage client — only when GCS is configured
let storage, bucket, bucketName;
if (isGCSConfigured) {
  const storageConfig = { projectId: process.env.GCS_PROJECT_ID };
  if (process.env.GCS_KEY_FILE) {
    storageConfig.keyFilename = path.resolve(process.env.GCS_KEY_FILE);
  }
  storage = new Storage(storageConfig);
  bucketName = process.env.GCS_BUCKET_NAME;
  bucket = storage.bucket(bucketName);
}

/**
 * Upload a file — to GCS when configured, otherwise to local disk.
 * @param {Express.Multer.File} file  — Multer file object
 * @param {string} folder             — folder prefix
 * @returns {Promise<{url, gcsPath, fileName, fileType}>}
 */
const uploadToGCS = (file, folder = 'ordinances') => {
  const ext = path.extname(file.originalname).toLowerCase();
  const uniqueName = `${uuidv4()}${ext}`;

  // ── Local fallback ──────────────────────────────────────────────────────────
  if (!isGCSConfigured) {
    const uploadDir = path.join(__dirname, '../../../uploads', folder);
    fs.mkdirSync(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, uniqueName);
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, file.buffer, (err) => {
        if (err) return reject(err);
        resolve({
          url: `/uploads/${folder}/${uniqueName}`,
          gcsPath: null,
          fileName: file.originalname,
          fileType: file.mimetype,
        });
      });
    });
  }

  // ── GCS upload ──────────────────────────────────────────────────────────────
  const gcsPath = `${folder}/${uniqueName}`;
  const blob = bucket.file(gcsPath);

  return new Promise((resolve, reject) => {
    const stream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
      metadata: { originalName: file.originalname },
    });

    stream.on('error', reject);
    stream.on('finish', () => {
      resolve({
        url: `https://storage.googleapis.com/${bucketName}/${gcsPath}`,
        gcsPath,
        fileName: file.originalname,
        fileType: file.mimetype,
      });
    });

    stream.end(file.buffer);
  });
};

/**
 * Delete a file — from GCS or local disk depending on configuration.
 * Silently ignores "not found" errors.
 */
const deleteFromGCS = async (gcsPath) => {
  if (!gcsPath) return;
  if (!isGCSConfigured) {
    // gcsPath is null for local files (url stored instead); nothing to delete here
    return;
  }
  try {
    await bucket.file(gcsPath).delete();
  } catch (err) {
    if (err.code !== 404) {
      console.error('GCS delete error:', err.message);
    }
  }
};

module.exports = { storage, bucket, uploadToGCS, deleteFromGCS, isGCSConfigured };
