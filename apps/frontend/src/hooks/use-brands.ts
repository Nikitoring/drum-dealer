import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product-service';
import type { Brand } from '@/types/api';

export const brandsQueryKey = ['brands'];

export function useBrands() {
  return useQuery({
    queryKey: brandsQueryKey,
    queryFn: ({ signal }) => productService.brands(signal),
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => productService.createBrand(name),
    onSuccess: (brand) => {
      queryClient.setQueryData<Brand[]>(brandsQueryKey, (brands = []) =>
        [...brands, brand].sort((left, right) => left.name.localeCompare(right.name, 'ru')),
      );
    },
  });
}
