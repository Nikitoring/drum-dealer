import { expect, test } from '@playwright/test';

const product = {
  slug: 'pearl-kit',
  name: 'Pearl Export',
  brand: 'Pearl',
  category: 'Барабаны',
  categoryId: 'c1',
  condition: 'USED',
  status: 'AVAILABLE',
  price: '120000',
  description: 'Комплект из Японии',
  specifications: { Размер: '22' },
  images: [{ id: 'i1', url: '/design/03-drum-kit.webp' }],
};

test.beforeEach(async ({ page }) => {
  await page.route('**/api/products/pearl-kit', (route) => route.fulfill({ json: product }));
  await page.route('**/api/products?*', (route) =>
    route.fulfill({ json: { data: [], meta: { page: 1, pageSize: 4, total: 0, totalPages: 0 } } }),
  );
});

test('просматривает карточку товара и переходит к заявке на покупку', async ({ page }) => {
  await page.goto('/catalog/pearl-kit');
  await expect(page.getByRole('heading', { name: 'Pearl Export' })).toBeVisible();
  await expect(page.getByText('120 000 ₽')).toBeVisible();
  await page.getByRole('link', { name: /связаться с продавцом/i }).click();
  await expect(page).toHaveURL('/contacts');
  await expect(page.getByRole('heading', { name: 'Контакты' })).toBeVisible();
});
