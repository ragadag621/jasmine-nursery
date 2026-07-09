import type { LocalizedText } from './plant.types';

export interface Category {
  _id: string;
  name: LocalizedText;
  slug: string;
  description?: LocalizedText;
  image?: {
    url: string;
    publicId: string;
  };
  createdAt: string;
  updatedAt: string;
}
