import { Schema } from 'mongoose';

/**
 * Bilingual text field used throughout the app (Hebrew + Arabic), per the
 * approved architecture. `_id: false` since this is always a subdocument,
 * never queried/referenced independently.
 */
export interface LocalizedText {
  he: string;
  ar: string;
}

export const localizedTextSchema = new Schema<LocalizedText>(
  {
    he: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
  },
  { _id: false }
);

/**
 * Optional bilingual text — same shape, but neither field required.
 * Used for fields like Category.description where content may not
 * exist yet in both languages.
 */
export interface OptionalLocalizedText {
  he?: string;
  ar?: string;
}

export const optionalLocalizedTextSchema = new Schema<OptionalLocalizedText>(
  {
    he: { type: String, trim: true, default: '' },
    ar: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

/**
 * Every image reference in the app stores the Cloudinary secure URL plus
 * its publicId (required for issuing delete/replace calls to Cloudinary
 * later — see the image upload flow in the architecture doc).
 */
export interface ImageRef {
  url: string;
  publicId: string;
}

export const imageRefSchema = new Schema<ImageRef>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

/**
 * An ordered image reference — used for multi-image galleries (Plant.images,
 * Gallery.images) where display order matters and is admin-controlled.
 */
export interface OrderedImageRef extends ImageRef {
  order: number;
}

export const orderedImageRefSchema = new Schema<OrderedImageRef>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);
