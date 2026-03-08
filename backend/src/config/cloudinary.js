const cloudinary = require('cloudinary').v2;
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER = process.env.CLOUDINARY_FOLDER || 'barangay-archive';

/**
 * Upload a Multer in-memory buffer to Cloudinary.
 * PDFs are uploaded as resource_type 'raw'; images as 'image'.
 * Returns an object shaped the same as the old uploadToGCS helper so
 * controllers need no other changes.
 *
 * The `gcsPath` field stores "<resource_type>/<public_id>" so we can
 * delete the right resource later without a DB schema change.
 */
const uploadToGCS = (file, folder = 'ordinances') => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isPDF = file.mimetype === 'application/pdf' || ext === '.pdf';
  const resourceType = isPDF ? 'raw' : 'image';

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `${FOLDER}/${folder}`,
        resource_type: resourceType,
        use_filename: false,
        unique_filename: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url:      result.secure_url,
          fileName: file.originalname,
          fileType: file.mimetype,
          // encode resource_type into gcsPath so deleteFromGCS can use it
          gcsPath:  `${resourceType}/${result.public_id}`,
        });
      }
    );
    uploadStream.end(file.buffer);
  });
};

/**
 * Delete a file from Cloudinary using the stored gcsPath
 * (format: "<resource_type>/<public_id>").
 */
const deleteFromGCS = async (gcsPath) => {
  if (!gcsPath) return;
  const slashIdx = gcsPath.indexOf('/');
  if (slashIdx === -1) return;

  const resourceType = gcsPath.substring(0, slashIdx);   // 'raw' or 'image'
  const publicId     = gcsPath.substring(slashIdx + 1);  // rest is public_id

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }
};

module.exports = { uploadToGCS, deleteFromGCS };
