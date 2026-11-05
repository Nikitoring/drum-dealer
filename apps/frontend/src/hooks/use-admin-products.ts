import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product-service';
import type { AdminProductFilters, CreateProductInput, UpdateProductInput } from '@/types/api';

export function useAdminProducts(filters: AdminProductFilters) {
  return useInfiniteQuery({
    queryKey: ['admin-products', filters],
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) => productService.adminList(filters, pageParam, signal),
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
  });
}

export function useAdminProduct(id: string) {
  return useQuery({
    queryKey: ['admin-product', id],
    queryFn: ({ signal }) => productService.adminById(id, signal),
    enabled: Boolean(id),
  });
}

const invalidateProducts = (queryClient: ReturnType<typeof useQueryClient>) => {
  void queryClient.invalidateQueries({ queryKey: ['admin-products'] });
  void queryClient.invalidateQueries({ queryKey: ['products'] });
};

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProductInput) => productService.create(input),
    onSuccess: () => invalidateProducts(queryClient),
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProductInput) => productService.update(id, input),
    onSuccess: (product) => {
      queryClient.setQueryData(['admin-product', id], product);
      invalidateProducts(queryClient);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.remove(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ['admin-product', id] });
      invalidateProducts(queryClient);
    },
  });
}

export function useUploadProductImage(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => productService.uploadImage(id, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-product', id] }),
  });
}

export function useDeleteProductImage(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (imageId: string) => productService.removeImage(id, imageId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-product', id] }),
  });
}

export function useUpdateProductImagePosition(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ imageId, position }: { imageId: string; position: number }) =>
      productService.updateImagePosition(id, imageId, position),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-product', id] }),
  });
}
