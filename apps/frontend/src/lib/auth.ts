import { apiRequest } from '@/lib/api';

const TOKEN_KEY = 'drum-dealer-admin-token';

export type Admin = { id: string; email: string };

export type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  admin: Admin;
};

export function getAdminToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export async function validateAdminToken() {
  await apiRequest<{ authenticated: true }>('/admin/auth/me');
}

export function loginAdmin(email: string, password: string) {
  return apiRequest<LoginResponse>('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}
