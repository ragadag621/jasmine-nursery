import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { ApiError } from './ApiError';

export type CloudinaryFolder =
  | 'alyasmin/plants'
  | 'alyasmin/gallery'
  | 'alyasmin/content'
  | 'alyasmin/categories';

/**
 * Uploads a single image buffer to Cloudinary via an upload_stream
 * (no temporary file on disk).
 *
 * Returns only the fields stored by our application schemas.
 */
export function uploadImageBuffer(
  buffer: Buffer,
  folder: CloudinaryFolder
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result?: UploadApiResponse) => {
        if (error || !result) {
          reject(ApiError.internal('Image upload to Cloudinary failed'));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
}

/**
 * Uploads multiple images to Cloudinary.
 *
 * If one upload fails after other images have already succeeded,
 * all successfully uploaded images from this operation are cleaned up.
 *
 * This prevents partial uploads from becoming orphaned Cloudinary assets
 * when the overall multi-image operation fails.
 */
export async function uploadMultipleImageBuffers(
  files: Express.Multer.File[],
  folder: CloudinaryFolder
): Promise<{ url: string; publicId: string; order: number }[]> {
  const uploadedImages: {
    url: string;
    publicId: string;
  }[] = [];

  try {
    const uploads = await Promise.all(
      files.map(async (file) => {
        const image = await uploadImageBuffer(file.buffer, folder);

        uploadedImages.push(image);

        return image;
      })
    );

    return uploads.map((img, index) => ({
      ...img,
      order: index,
    }));
  } catch (error) {
    // One or more uploads failed.
    // Clean up every image that successfully uploaded as part
    // of this multi-image operation.
    if (uploadedImages.length > 0) {
      try {
        await deleteMultipleCloudinaryImages(
          uploadedImages.map((image) => image.publicId)
        );
      } catch {
        console.error(
          '[cloudinary] Failed to clean up partially uploaded images'
        );
      }
    }

    throw error;
  }
}

/**
 * Deletes a Cloudinary asset by publicId.
 *
 * Database operations are responsible for updating/removing the
 * corresponding MongoDB reference before calling this cleanup function.
 *
 * If Cloudinary deletion fails, the caller keeps the database state
 * consistent and can handle the remaining orphaned asset separately.
 */
export async function deleteCloudinaryImage(
  publicId: string
): Promise<void> {
  if (!publicId || publicId === 'placeholder') {
    // Seed/dev placeholders were never actually uploaded.
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    throw ApiError.internal(
      'Failed to delete image from Cloudinary'
    );
  }
}

/**
 * Deletes multiple Cloudinary assets.
 *
 * All deletion attempts are started concurrently. If one or more
 * deletions fail, the function rejects so the caller can log the
 * cleanup failure and keep the database state untouched.
 */
export async function deleteMultipleCloudinaryImages(
  publicIds: string[]
): Promise<void> {
  await Promise.all(
    publicIds.map((id) => deleteCloudinaryImage(id))
  );
}