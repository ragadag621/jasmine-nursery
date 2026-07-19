import { axiosClient } from './axiosClient';
import type { Testimonial } from '@/types/content.types';

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data } = await axiosClient.get('/testimonials');
  return data.data as Testimonial[];
}

export async function fetchAllTestimonials(): Promise<Testimonial[]> {
  const { data } = await axiosClient.get('/testimonials/all');
  return data.data as Testimonial[];
}

export async function createTestimonial(payload: {
  customerName: string;
  rating: number;
  text: { he: string; ar: string };
  isVisible: boolean;
}): Promise<Testimonial> {
  const { data } = await axiosClient.post('/testimonials', payload);
  return data.data as Testimonial;
}

export async function updateTestimonial(
  id: string,
  payload: Partial<{
    customerName: string;
    rating: number;
    text: { he: string; ar: string };
    isVisible: boolean;
  }>
): Promise<Testimonial> {
  const { data } = await axiosClient.put(`/testimonials/${id}`, payload);
  return data.data as Testimonial;
}

export async function deleteTestimonial(id: string): Promise<void> {
  await axiosClient.delete(`/testimonials/${id}`);
}
