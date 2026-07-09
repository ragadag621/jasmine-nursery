import { axiosClient } from './axiosClient';

/**
 * Scaffold only for Phase 1 — endpoints exist on the backend structure
 * (see backend/src/routes) but request/response types and the corresponding
 * AuthContext wiring land in the auth implementation phase.
 *
 * No token handling here by design: the backend sets/clears the httpOnly
 * cookie directly on these responses, so the frontend never sees the JWT.
 */

export interface AdminUser {
  id: string;
  username: string;
  role: 'admin';
}

export async function loginRequest(username: string, password: string): Promise<AdminUser> {
  const { data } = await axiosClient.post('/auth/login', { username, password });
  return data.data as AdminUser;
}

export async function logoutRequest(): Promise<void> {
  await axiosClient.post('/auth/logout');
}

export async function fetchCurrentAdmin(): Promise<AdminUser> {
  const { data } = await axiosClient.get('/auth/me');
  return data.data as AdminUser;
}
