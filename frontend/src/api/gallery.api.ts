import { axiosClient } from './axiosClient';
import type { GalleryItem } from '@/types/gallery.types';
import type { GalleryFormValues } from '@/components/admin/GalleryUploader';

export function buildGalleryFormData(values: GalleryFormValues, files: File[]): FormData {
  const formData = new FormData();
  formData.append('title', JSON.stringify({ he: values.titleHe, ar: values.titleAr }));
  formData.append('category', values.category);
  files.forEach((file) => formData.append('images', file));
  return formData;
}

export async function fetchGallery(category?: string): Promise<GalleryItem[]> {
  const { data } = await axiosClient.get('/gallery', { params: category ? { category } : {} });
  return data.data as GalleryItem[];
}

export async function createGalleryItem(formData: FormData): Promise<GalleryItem> {
  const { data } = await axiosClient.post('/gallery', formData);
  return data.data as GalleryItem;
}

export async function updateGalleryItem(id: string, formData: FormData): Promise<GalleryItem> {
  const { data } = await axiosClient.put(`/gallery/${id}`, formData);
  return data.data as GalleryItem;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await axiosClient.delete(`/gallery/${id}`);
}

export async function deleteGalleryImage(itemId: string, imageId: string): Promise<GalleryItem> {
  const { data } = await axiosClient.delete(`/gallery/${itemId}/images/${imageId}`);
  return data.data as GalleryItem;
}
