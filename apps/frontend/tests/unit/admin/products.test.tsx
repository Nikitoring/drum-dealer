import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AdminProductForm } from '@/components/admin/product-form';

const update = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('@/hooks/use-admin-products', () => ({
  useAdminProduct: () => ({ data: { id: 'p1', name: 'Старое название', slug: 'old', brand: 'Pearl', categoryId: 'c1', category: 'Барабаны', price: '100', condition: 'USED', status: 'AVAILABLE', description: '', specifications: {}, images: [] }, isPending: false, isError: false }),
  useCreateProduct: () => ({ mutate: vi.fn(), isPending: false }), useUpdateProduct: () => ({ mutate: update, isPending: false }),
  useUploadProductImage: () => ({ mutate: vi.fn(), isPending: false }), useDeleteProductImage: () => ({ mutate: vi.fn(), isPending: false }),
}));
vi.mock('@/hooks/use-categories', () => ({ useCategories: () => ({ data: [{ id: 'c1', name: 'Барабаны' }] }), useCreateCategory: () => ({ mutate: vi.fn(), isPending: false }) }));

describe('admin / products', () => {
  it('редактирует товар и отправляет PATCH-данные', async () => {
    const user = userEvent.setup();
    render(<AdminProductForm id="p1" />);
    const name = await screen.findByDisplayValue('Старое название');
    await user.clear(name); await user.type(name, 'Новое название');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ name: 'Новое название', price: '100' }), expect.any(Object));
  });
});
