import multer from 'multer';
import { Request } from 'express';
import { ApiError } from '../utils/ApiError';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_FILES_PER_UPLOAD = 10;

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(
      ApiError.badRequest(
        `Unsupported image type: ${file.mimetype}. Use JPG, PNG, or WebP.`,
      ),
    );
    return;
  }

  cb(null, true);
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: MAX_FILES_PER_UPLOAD,
  },
  fileFilter,
});

/** Single image field named "image". */
export const uploadSingleImage = upload.single('image');

/** Single hero image field named "heroImage". */
export const uploadSingleHeroImage = upload.single('heroImage');

/** Single logo image field named "logo". */
export const uploadSingleLogo = upload.single('logo');

/** Multiple images under one field named "images". */
export const uploadMultipleImages = upload.array(
  'images',
  MAX_FILES_PER_UPLOAD,
);