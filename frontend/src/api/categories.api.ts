import { axiosClient } from './axiosClient';
import type { Category } from '@/types/category.types';
import type { CategoryFormValues } from '@/components/admin/CategoryForm';

export function buildCategoryFormData(values: CategoryFormValues, file: File | null): FormData {
  const formData = new FormData();
  formData.append('name', JSON.stringify({ he: values.nameHe, ar: values.nameAr }));
  formData.append('slug', values.slug);
  if (values.descriptionHe || values.descriptionAr) {
    formData.append('description', JSON.stringify({ he: values.descriptionHe, ar: values.descriptionAr }));
  }
  if (file) formData.append('image', file);
  return formData;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await axiosClient.get('/categories');
  return data.data as Category[];
}

export async function createCategory(formData: FormData): Promise<Category> {
  const { data } = await axiosClient.post('/categories', formData);
  return data.data as Category;
}

export async function updateCategory(id: string, formData: FormData): Promise<Category> {
  const { data } = await axiosClient.put(`/categories/${id}`, formData);
  return data.data as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  await axiosClient.delete(`/categories/${id}`);
}
