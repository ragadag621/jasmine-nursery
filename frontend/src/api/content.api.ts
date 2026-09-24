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

export async function uploadSiteLogo(file: File): Promise<SiteContent> {
  const formData = new FormData();
  formData.append('logo', file);

  const { data } = await axiosClient.post('/content/logo', formData);
  return data.data as SiteContent;
}

export async function deleteSiteLogo(): Promise<SiteContent> {
  const { data } = await axiosClient.delete('/content/logo');
  return data.data as SiteContent;
}
