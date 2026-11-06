import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductDetail } from '@/components/product-detail';

const { useProduct, useRelatedProducts } = vi.hoisted(() => ({
  useProduct: vi.fn(),
  useRelatedProducts: vi.fn(),
}));
vi.mock('@/hooks/use-products', () => ({ useProduct, useRelatedProducts }));
vi.mock('next/image', () => ({ default: (props: Record<string, unknown>) => <img {...props} /> }));
vi.mock('next/link', () => ({
  default: ({ children, ...props }: Record<string, unknown>) => <a {...props}>{children}</a>,
}));

const product = {
  id: 'p1',
  slug: 'pearl-kit',
  name: 'Pearl Export',
  brand: 'Pearl',
  category: 'Барабаны',
  categoryId: 'c1',
  condition: 'USED' as const,
  status: 'AVAILABLE' as const,
  price: '120000',
  description: 'Комплект из Японии',
  specifications: { Размер: '22' },
  images: [
    { id: 'i1', url: '/kit.jpg' },
    { id: 'i2', url: '/kit-2.jpg' },
  ],
};

describe('products / карточка товара', () => {
  beforeEach(() => {
    useProduct.mockReturnValue({ data: product, isPending: false, isError: false });
    useRelatedProducts.mockReturnValue({ data: { data: [] } });
  });

  it('показывает карточку, характеристики и ссылку для заявки на покупку', () => {
    render(<ProductDetail slug="pearl-kit" />);
    expect(screen.getByRole('heading', { name: 'Pearl Export' })).toBeInTheDocument();
    expect(screen.getByText('120 000 ₽')).toBeInTheDocument();
    expect(screen.getByText('Комплект из Японии')).toBeInTheDocument();
    expect(screen.getByText('Размер')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /связаться с продавцом/i })).toHaveAttribute(
      'href',
      '/contacts',
    );
  });

  it('переключает фотографии товара', async () => {
    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(<ProductDetail slug="pearl-kit" />);
    expect(screen.getByAltText('Pearl Export, фотография 1')).toHaveAttribute('src', '/kit.jpg');
    await user.click(screen.getByRole('button', { name: 'Следующее фото' }));
    expect(screen.getByAltText('Pearl Export, фотография 2')).toHaveAttribute('src', '/kit-2.jpg');
  });
});
