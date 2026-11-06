import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product-service';
import type { Category } from '@/types/api';

export const categoriesQueryKey = ['categories'];

export function useCategories() {
  return useQuery({
    queryKey: categoriesQueryKey,
    queryFn: ({ signal }) => productService.categories(signal),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => productService.createCategory(name),
    onSuccess: (category) => {
      queryClient.setQueryData<Category[]>(categoriesQueryKey, (categories = []) =>
        [...categories, category].sort((left, right) => left.name.localeCompare(right.name, 'ru')),
      );
    },
  });
}
