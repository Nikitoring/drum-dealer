import { expect, test } from '@playwright/test';

test('создаёт заявку на свободный слот', async ({ page }) => {
  await page.route('**/api/rehearsal-points/kovry', (route) => route.fulfill({ json: { id: 'point-1', slug: 'kovry', name: 'Ковры', address: 'Москва', description: 'Комната', images: [] } }));
  await page.route('**/api/rehearsal-points/kovry/slots**', (route) => route.fulfill({ json: [{ id: 'slot-1', startAt: '2099-05-12T10:00:00Z', endAt: '2099-05-12T11:00:00Z', status: 'AVAILABLE' }] }));
  await page.route('**/api/bookings', (route) => route.fulfill({ status: 201, json: { data: { id: 'b1', status: 'PENDING', timeSlotId: 'slot-1' } } }));
  await page.goto('/kovry/kovry');
  await expect(page.getByRole('heading', { name: 'Ковры' })).toBeVisible();
  await page.getByRole('button', { name: /10:00/ }).click();
  await page.getByRole('button', { name: /Записаться/ }).click();
  await page.getByLabelText('Ваше имя').fill('Иван');
  await page.getByLabelText('Телефон').fill('+79990000000');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Отправить заявку' }).click();
  await expect(page.getByRole('status')).toContainText('Заявка отправлена');
});
