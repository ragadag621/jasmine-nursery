import { axiosClient } from './axiosClient';
import type { Plant } from '@/types/plant.types';
import type { PlantFormValues } from '@/components/admin/PlantForm';

export function buildPlantFormData(values: PlantFormValues, files: File[]): FormData {
  const formData = new FormData();
  formData.append('name', JSON.stringify({ he: values.nameHe, ar: values.nameAr }));
  formData.append('description', JSON.stringify({ he: values.descriptionHe, ar: values.descriptionAr }));
  formData.append('care', JSON.stringify({ water: values.water, sunlight: values.sunlight }));
  formData.append('slug', values.slug);
  formData.append('category', values.category);
  formData.append('availability', values.availability);
  formData.append('featured', String(values.featured));
  if (values.scientificName) formData.append('scientificName', values.scientificName);
  if (values.price) formData.append('price', values.price);
  files.forEach((file) => formData.append('images', file));
  return formData;
}

export interface PlantListParams {
  category?: string;
  search?: string;
  sort?: 'newest' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}

export interface PlantListResponse {
  plants: Plant[];
  meta: { total: number; page: number; pages: number };
}

export async function fetchPlants(params: PlantListParams): Promise<PlantListResponse> {
  const { data } = await axiosClient.get('/plants', { params });
  return { plants: data.data as Plant[], meta: data.meta };
}

export async function fetchPlantsAdmin(params: PlantListParams): Promise<PlantListResponse> {
  const { data } = await axiosClient.get('/plants/admin/all', { params });
  return { plants: data.data as Plant[], meta: data.meta };
}

export async function fetchPlantByIdAdmin(id: string): Promise<Plant> {
  const { data } = await axiosClient.get(`/plants/admin/${id}`);
  return data.data as Plant;
}

export async function fetchPlantBySlug(slug: string): Promise<Plant> {
  const { data } = await axiosClient.get(`/plants/${slug}`);
  return data.data as Plant;
}

export async function createPlant(formData: FormData): Promise<Plant> {
  const { data } = await axiosClient.post('/plants', formData);
  return data.data as Plant;
}

export async function updatePlant(id: string, formData: FormData): Promise<Plant> {
  const { data } = await axiosClient.put(`/plants/${id}`, formData);
  return data.data as Plant;
}

export async function deletePlant(id: string): Promise<void> {
  await axiosClient.delete(`/plants/${id}`);
}

export async function togglePlantVisibility(id: string): Promise<Plant> {
  const { data } = await axiosClient.patch(`/plants/${id}/hide`);
  return data.data as Plant;
}

export async function deletePlantImage(plantId: string, imageId: string): Promise<Plant> {
  const { data } = await axiosClient.delete(`/plants/${plantId}/images/${imageId}`);
  return data.data as Plant;
}
