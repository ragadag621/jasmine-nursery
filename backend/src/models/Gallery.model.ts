import { Schema, model, Document } from 'mongoose';
import { LocalizedText, localizedTextSchema, OrderedImageRef, orderedImageRefSchema } from './subSchemas';

export interface IGallery {
  title: LocalizedText;
  images: OrderedImageRef[];
  category: string;
}

export interface IGalleryDocument extends IGallery, Document {}

const gallerySchema = new Schema<IGalleryDocument>(
  {
    title: { type: localizedTextSchema, required: true },
    images: {
      type: [orderedImageRefSchema],
      default: [],
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

gallerySchema.index({ category: 1 });

export const Gallery = model<IGalleryDocument>('Gallery', gallerySchema);
