import { Schema, model, Document, Types } from 'mongoose';
import {
  LocalizedText,
  localizedTextSchema,
  OrderedImageRef,
  orderedImageRefSchema,
} from './subSchemas';

export type Availability = 'in_stock' | 'low_stock' | 'out_of_stock';
export type WaterNeed = 'low' | 'medium' | 'high';
export type SunlightNeed = 'full_sun' | 'partial_shade' | 'full_shade';

export interface IPlant {
  name: LocalizedText;
  scientificName?: string;
  slug: string;
  description: LocalizedText;
  category: Types.ObjectId;
  price?: number;
  availability: Availability;
  images: OrderedImageRef[];
  care: {
    water: WaterNeed;
    sunlight: SunlightNeed;
  };
  featured: boolean;
  isHidden: boolean;
}

export interface IPlantDocument extends IPlant, Document {}

const plantSchema = new Schema<IPlantDocument>(
  {
    name: { type: localizedTextSchema, required: true },
    scientificName: { type: String, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'],
    },
    description: { type: localizedTextSchema, required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: false, // absent = "price on request", per architecture
    },
    availability: {
      type: String,
      enum: ['in_stock', 'low_stock', 'out_of_stock'],
      default: 'in_stock',
      required: true,
    },
    images: {
      type: [orderedImageRefSchema],
      default: [],
    },
    care: {
      water: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true,
      },
      sunlight: {
        type: String,
        enum: ['full_sun', 'partial_shade', 'full_shade'],
        required: true,
      },
    },
    featured: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Supports the catalog search/filter/sort requirements without needing a
// separate text-search service for a single-nursery catalog of this scale.
plantSchema.index({ 'name.he': 'text', 'name.ar': 'text', scientificName: 'text' });
plantSchema.index({ category: 1, isHidden: 1 });
plantSchema.index({ featured: 1, isHidden: 1 });

export const Plant = model<IPlantDocument>('Plant', plantSchema);
