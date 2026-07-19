import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { ApiError } from './ApiError';

export type CloudinaryFolder = 'alyasmin/plants' | 'alyasmin/gallery' | 'alyasmin/content' | 'alyasmin/categories';

/**
 * Uploads a single image buffer to Cloudinary via an upload_stream (no temp
 * file on disk). Returns just the two fields our schemas ever store —
 * see the image upload flow in architecture.md.
 */
export function uploadImageBuffer(
  buffer: Buffer,
  folder: CloudinaryFolder
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result?: UploadApiResponse) => {
        if (error || !result) {
          reject(ApiError.internal('Image upload to Cloudinary failed'));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

export async function uploadMultipleImageBuffers(
  files: Express.Multer.File[],
  folder: CloudinaryFolder
): Promise<{ url: string; publicId: string; order: number }[]> {
  const uploads = await Promise.all(files.map((file) => uploadImageBuffer(file.buffer, folder)));
  return uploads.map((img, index) => ({ ...img, order: index }));
}

/**
 * Deletes a Cloudinary asset by publicId. Per the architecture's delete
 * flow, this is always called BEFORE removing the corresponding MongoDB
 * reference — if this throws, the DB reference is left intact rather
 * than silently orphaning the Cloudinary asset.
 */
export async function deleteCloudinaryImage(publicId: string): Promise<void> {
  if (!publicId || publicId === 'placeholder') {
    // Seed/dev placeholders were never actually uploaded — nothing to delete.
    return;
  }
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    throw ApiError.internal('Failed to delete image from Cloudinary');
  }
}

export async function deleteMultipleCloudinaryImages(publicIds: string[]): Promise<void> {
  await Promise.all(publicIds.map((id) => deleteCloudinaryImage(id)));
}
