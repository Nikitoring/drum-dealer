export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token =
    typeof window !== 'undefined' ? window.localStorage.getItem('drum-dealer-admin-token') : null;
  const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? `API error (${response.status})`);
  }
  return response.json() as Promise<T>;
}
