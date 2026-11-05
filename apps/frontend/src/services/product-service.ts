import { apiRequest } from '@/lib/api';
import type {
  AdminProductFilters,
  CreateProductInput,
  Paginated,
  Product,
  ProductFilters,
  UpdateProductInput,
} from '@/types/api';

const toSearchParams = (filters: ProductFilters, page: number) => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(filters.pageSize ?? 12),
  });
  if (filters.search?.trim()) params.set('q', filters.search.trim());
  if (filters.category) params.set('category', filters.category);
  if (filters.brand) params.set('brand', filters.brand);
  if (filters.condition) params.set('condition', filters.condition);
  if (filters.sort && filters.sort !== 'default') params.set('sort', filters.sort);
  return params;
};

const toAdminSearchParams = (filters: AdminProductFilters, page: number) => {
  const params = toSearchParams(filters, page);
  if (filters.status) params.set('status', filters.status);
  return params;
};

export const productService = {
  list: (filters: ProductFilters, page: number, signal?: AbortSignal) =>
    apiRequest<Paginated<Product>>(`/products?${toSearchParams(filters, page)}`, { signal }),
  bySlug: (slug: string, signal?: AbortSignal) =>
    apiRequest<Product>(`/products/${encodeURIComponent(slug)}`, { signal }),
  related: (category: string, signal?: AbortSignal) =>
    apiRequest<Paginated<Product>>(
      `/products?page=1&pageSize=4&category=${encodeURIComponent(category)}`,
      { signal },
    ),
  adminList: (filters: AdminProductFilters, page: number, signal?: AbortSignal) =>
    apiRequest<Paginated<Product>>(`/admin/products?${toAdminSearchParams(filters, page)}`, {
      signal,
    }),
  adminById: (id: string, signal?: AbortSignal) =>
    apiRequest<Product>(`/admin/products/${encodeURIComponent(id)}`, { signal }),
  create: (input: CreateProductInput) =>
    apiRequest<Product>('/admin/products', { method: 'POST', body: JSON.stringify(input) }),
  update: (id: string, input: UpdateProductInput) =>
    apiRequest<Product>(`/admin/products/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    apiRequest<{ success: true }>(`/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
  uploadImage: (id: string, file: File) => {
    const body = new FormData();
    body.append('file', file);
    return apiRequest<{ id: string; url: string; position: number }>(
      `/admin/products/${encodeURIComponent(id)}/images`,
      { method: 'POST', body, headers: {} },
    );
  },
  updateImagePosition: (productId: string, imageId: string, position: number) =>
    apiRequest(
      `/admin/products/${encodeURIComponent(productId)}/images/${encodeURIComponent(imageId)}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ position }),
      },
    ),
  removeImage: (productId: string, imageId: string) =>
    apiRequest<{ success: true }>(
      `/admin/products/${encodeURIComponent(productId)}/images/${encodeURIComponent(imageId)}`,
      { method: 'DELETE' },
    ),
};
