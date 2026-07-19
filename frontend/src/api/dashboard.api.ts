import { axiosClient } from './axiosClient';

export interface DashboardStats {
  plants: number;
  categories: number;
  galleryImages: number;
  newMessages: number;
  totalMessages: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await axiosClient.get('/dashboard/stats');
  return data.data as DashboardStats;
}
