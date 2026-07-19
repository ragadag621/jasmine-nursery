import multer from 'multer';
import { Request } from 'express';
import { ApiError } from '../utils/ApiError';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB, per architecture doc
const MAX_FILES_PER_UPLOAD = 10;

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(ApiError.badRequest(`Unsupported image type: ${file.mimetype}. Use JPG, PNG, or WebP.`));
    return;
  }
  cb(null, true);
}

/**
 * Memory storage — files never touch disk. The buffer is streamed
 * straight to Cloudinary in the controller (see utils/cloudinaryUpload.ts).
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: MAX_FILES_PER_UPLOAD },
  fileFilter,
});

/** Single image field, e.g. a category's cover image or a gallery cover. */
export const uploadSingleImage = upload.single('image');

/** Multiple images under one field, e.g. a plant's image gallery. */
export const uploadMultipleImages = upload.array('images', MAX_FILES_PER_UPLOAD);
