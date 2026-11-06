import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('drum-dealer-admin-token', 'e2e-token'));
  await page.route('**/api/admin/auth/me', (route) => route.fulfill({ json: { authenticated: true } }));
  await page.route('**/api/admin/products/p1', (route) => route.fulfill({ json: { id: 'p1', name: 'Старое название', slug: 'old', brand: 'Pearl', category: 'Барабаны', categoryId: 'c1', price: '100', condition: 'USED', status: 'AVAILABLE', description: '', specifications: {}, images: [] } }));
  await page.route('**/api/categories', (route) => route.fulfill({ json: [{ id: 'c1', name: 'Барабаны', slug: 'drums' }] }));
});

test('редактирует товар в панели администратора', async ({ page }) => {
  await page.goto('/admin/products/p1/edit');
  await page.getByLabel('Название').fill('Новое название');
  await page.route('**/api/admin/products/p1', (route) => route.fulfill({ json: { id: 'p1', name: 'Новое название' } }));
  await page.getByRole('button', { name: 'Сохранить' }).click();
  await expect(page).toHaveURL(/\/admin\/products$/);
});

test('создаёт и блокирует слот в расписании', async ({ page }) => {
  await page.route('**/api/admin/schedule?*', (route) => route.fulfill({ json: { data: [{ point: { id: 'point-1', name: 'Точка 1', address: 'Москва' }, slots: [{ id: 'slot-1', startAt: '2099-05-12T10:00:00Z', endAt: '2099-05-12T11:00:00Z', status: 'AVAILABLE', bookings: [] }] }], range: {} } }));
  await page.route('**/api/admin/time-slots', (route) => route.fulfill({ status: 201, json: {} }));
  await page.goto('/admin/schedule');
  await expect(page.getByRole('heading', { name: 'Расписание' })).toBeVisible();
  await page.getByRole('button', { name: '+ Добавить слот' }).click();
  await page.getByRole('button', { name: 'Закрыть' }).click();
});
