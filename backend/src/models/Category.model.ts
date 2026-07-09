import { Schema, model, Document } from 'mongoose';
import { LocalizedText, localizedTextSchema, optionalLocalizedTextSchema, OptionalLocalizedText, ImageRef, imageRefSchema } from './subSchemas';

export interface ICategory {
  name: LocalizedText;
  slug: string;
  description?: OptionalLocalizedText;
  image?: ImageRef;
}

export interface ICategoryDocument extends ICategory, Document {}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: localizedTextSchema, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'],
    },
    description: { type: optionalLocalizedTextSchema, required: false },
    image: { type: imageRefSchema, required: false },
  },
  { timestamps: true }
);

export const Category = model<ICategoryDocument>('Category', categorySchema);
