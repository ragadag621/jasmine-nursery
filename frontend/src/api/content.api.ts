import { axiosClient } from './axiosClient';
import type { SiteContent } from '@/types/content.types';

export async function fetchSiteContent(): Promise<SiteContent> {
  const { data } = await axiosClient.get('/content');
  return data.data as SiteContent;
}

export async function updateSiteContent(formData: FormData): Promise<SiteContent> {
  const { data } = await axiosClient.put('/content', formData);
  return data.data as SiteContent;
}
