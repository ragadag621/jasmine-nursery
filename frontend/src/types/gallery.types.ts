import type { LocalizedText } from './plant.types';

export interface GalleryImage {
  _id: string;
  url: string;
  publicId: string;
  order: number;
}

export interface GalleryItem {
  _id: string;
  title: LocalizedText;
  images: GalleryImage[];
  category: string;
  createdAt: string;
  updatedAt: string;
}