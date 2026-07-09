import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

/**
 * Cloudinary is the single source of truth for image binaries.
 * MongoDB only ever stores { url, publicId } references — see models.
 *
 * Folder convention (set per-upload-call in later phases):
 *   alyasmin/plants/...
 *   alyasmin/gallery/...
 *   alyasmin/content/...   (hero image, offer images, etc.)
 */
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
