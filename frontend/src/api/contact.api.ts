import { axiosClient } from './axiosClient';
import type { ContactFormInput, ContactMessage, ContactStatus } from '@/types/contact.types';

export async function submitContactForm(input: ContactFormInput): Promise<void> {
  await axiosClient.post('/contact', input);
}

export interface ContactListResponse {
  messages: ContactMessage[];
  meta: { total: number; page: number; pages: number };
}

export async function fetchContactMessages(params: {
  status?: ContactStatus;
  page?: number;
  limit?: number;
}): Promise<ContactListResponse> {
  const { data } = await axiosClient.get('/contact', { params });
  return { messages: data.data as ContactMessage[], meta: data.meta };
}

export async function updateContactStatus(id: string, status: ContactStatus): Promise<ContactMessage> {
  const { data } = await axiosClient.patch(`/contact/${id}/status`, { status });
  return data.data as ContactMessage;
}

export async function deleteContactMessage(id: string): Promise<void> {
  await axiosClient.delete(`/contact/${id}`);
}
