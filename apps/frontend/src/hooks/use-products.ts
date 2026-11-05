import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product-service';
import type { ProductFilters } from '@/types/api';

export function useProducts(filters: ProductFilters) {
  return useInfiniteQuery({
    queryKey: ['products', filters],
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) => productService.list(filters, pageParam, signal),
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: ({ signal }) => productService.bySlug(slug, signal),
  });
}

export function useRelatedProducts(category?: string) {
  return useQuery({
    queryKey: ['products', 'related', category],
    enabled: Boolean(category),
    queryFn: ({ signal }) => productService.related(category!, signal),
  });
}
