import { apiRequest } from '@/lib/api';
import type { Paginated, Product, ProductFilters } from '@/types/api';

const toSearchParams = (filters: ProductFilters, page: number) => {
  const params = new URLSearchParams({ page: String(page), pageSize: String(filters.pageSize ?? 12) });
  if (filters.search?.trim()) params.set('q', filters.search.trim());
  if (filters.category) params.set('category', filters.category);
  if (filters.brand) params.set('brand', filters.brand);
  if (filters.condition) params.set('condition', filters.condition);
  if (filters.sort && filters.sort !== 'default') params.set('sort', filters.sort);
  return params;
};

export const productService = {
  list: (filters: ProductFilters, page: number, signal?: AbortSignal) =>
    apiRequest<Paginated<Product>>(`/products?${toSearchParams(filters, page)}`, { signal }),
  bySlug: (slug: string, signal?: AbortSignal) =>
    apiRequest<Product>(`/products/${encodeURIComponent(slug)}`, { signal }),
  related: (category: string, signal?: AbortSignal) =>
    apiRequest<Paginated<Product>>(`/products?page=1&pageSize=4&category=${encodeURIComponent(category)}`, { signal }),
};
