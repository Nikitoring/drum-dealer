import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { createTestContext, id, otherId, point, product, TestContext } from './test-app';

describe('Admin API', () => {
  let context: TestContext;

  beforeAll(async () => {
    context = await createTestContext();
  });

  afterAll(() => context.app.close());

  const auth = () => ({ Authorization: `Bearer ${context.token}` });
  const expectError = (res: request.Response, status: number, message?: string) => {
    expect(res.status).toBe(status);
    expect(res.body).toEqual(expect.objectContaining({ statusCode: status }));
    if (message) expect(res.body.message).toContain(message);
  };

  it('rejects missing and invalid JWT and accepts a valid JWT', async () => {
    expectError(await request(context.app.getHttpServer()).get('/api/admin/auth/me'), 401);
    expectError(
      await request(context.app.getHttpServer())
        .get('/api/admin/auth/me')
        .set('Authorization', 'Bearer bad'),
      401,
    );
    await request(context.app.getHttpServer())
      .get('/api/admin/auth/me')
      .set(auth())
      .expect(200, { authenticated: true });
  });

  it('logs in with valid credentials and rejects wrong credentials', async () => {
    context.prisma.admin.findUnique.mockResolvedValue({
      id,
      email: 'admin@example.com',
      passwordHash: context.authService.hashPassword('secret'),
    });
    await request(context.app.getHttpServer())
      .post('/api/admin/auth/login')
      .send({ email: 'admin@example.com', password: 'secret' })
      .expect(201);
    expectError(
      await request(context.app.getHttpServer())
        .post('/api/admin/auth/login')
        .send({ email: 'admin@example.com', password: 'wrong' }),
      401,
      'Неверный email',
    );
  });

  it('serves dashboard, admin lists and schedule', async () => {
    context.prisma.product.count.mockResolvedValueOnce(2).mockResolvedValueOnce(1);
    context.prisma.rehearsalBooking.count.mockResolvedValueOnce(3).mockResolvedValueOnce(1);
    context.prisma.rehearsalBooking.findMany.mockResolvedValue([]);
    context.prisma.rehearsalPoint.findMany.mockResolvedValue([]);
    context.prisma.product.findMany.mockResolvedValue([]);
    await request(context.app.getHttpServer()).get('/api/admin/dashboard').set(auth()).expect(200);
    await request(context.app.getHttpServer())
      .get('/api/admin/products?pageSize=100')
      .set(auth())
      .expect(200);
    await request(context.app.getHttpServer())
      .get('/api/admin/rehearsal-points')
      .set(auth())
      .expect(200);
    await request(context.app.getHttpServer()).get('/api/admin/bookings').set(auth()).expect(200);
    await request(context.app.getHttpServer()).get('/api/admin/time-slots').set(auth()).expect(200);
    await request(context.app.getHttpServer()).get('/api/admin/schedule').set(auth()).expect(200);
  });

  it('creates a category and reports duplicate names', async () => {
    context.prisma.category.create.mockResolvedValue({ id, name: 'Новая', slug: 'новая' });
    await request(context.app.getHttpServer())
      .post('/api/admin/categories')
      .set(auth())
      .send({ name: ' Новая ' })
      .expect(201);
    context.prisma.category.create.mockRejectedValue({ code: 'P2002' });
    expectError(
      await request(context.app.getHttpServer())
        .post('/api/admin/categories')
        .set(auth())
        .send({ name: 'Новая' }),
      409,
      'CATEGORY_EXISTS',
    );
  });

  it('changes slot and booking statuses, including invalid transitions', async () => {
    context.prisma.timeSlot.findUnique.mockResolvedValue({ id, status: 'AVAILABLE' });
    context.prisma.timeSlot.update.mockResolvedValue({ id, status: 'BLOCKED' });
    await request(context.app.getHttpServer())
      .patch(`/api/admin/time-slots/${id}/status`)
      .set(auth())
      .send({ status: 'BLOCKED' })
      .expect(200);
    context.prisma.rehearsalBooking.findUnique.mockResolvedValue({
      id,
      status: 'PENDING',
      timeSlotId: otherId,
    });
    context.prisma.rehearsalBooking.update.mockResolvedValue({ id, status: 'CONFIRMED' });
    context.prisma.timeSlot.update.mockResolvedValue({ id: otherId, status: 'BOOKED' });
    await request(context.app.getHttpServer())
      .patch(`/api/admin/bookings/${id}/status`)
      .set(auth())
      .send({ status: 'CONFIRMED' })
      .expect(200);
    context.prisma.rehearsalBooking.findUnique.mockResolvedValue({
      id,
      status: 'CONFIRMED',
      timeSlotId: otherId,
    });
    expectError(
      await request(context.app.getHttpServer())
        .patch(`/api/admin/bookings/${id}/status`)
        .set(auth())
        .send({ status: 'REJECTED' }),
      409,
      'INVALID_STATUS_TRANSITION',
    );
  });

  it('serves admin details, legacy schedule and DELETE routes', async () => {
    context.prisma.product.findUnique.mockResolvedValue({
      ...product,
      category: { id: otherId, name: 'Ударные' },
      price: { toString: () => '1000' },
      images: [],
    });
    context.prisma.rehearsalPoint.findUnique.mockResolvedValue(point);
    context.prisma.rehearsalBooking.findUnique.mockResolvedValue({
      id,
      timeSlot: { rehearsalPoint: point },
    });
    context.prisma.timeSlot.findUnique.mockResolvedValue({ id, status: 'AVAILABLE' });
    context.prisma.timeSlot.create.mockResolvedValue({ id: otherId, status: 'AVAILABLE' });
    context.prisma.timeSlot.update.mockResolvedValue({ id, status: 'AVAILABLE' });
    context.prisma.product.delete.mockResolvedValue({});
    context.prisma.rehearsalPoint.delete.mockResolvedValue({});
    context.prisma.productImage.findFirst.mockResolvedValue({
      id: otherId,
      productId: id,
      url: 'old',
    });
    context.prisma.productImage.delete.mockResolvedValue({});
    context.prisma.rehearsalPointImage.findFirst.mockResolvedValue({
      id: otherId,
      rehearsalPointId: id,
      url: 'old',
    });
    context.prisma.rehearsalPointImage.delete.mockResolvedValue({});
    await request(context.app.getHttpServer())
      .get(`/api/admin/products/${id}`)
      .set(auth())
      .expect(200);
    await request(context.app.getHttpServer())
      .get(`/api/admin/rehearsal-points/${id}`)
      .set(auth())
      .expect(200);
    await request(context.app.getHttpServer())
      .get(`/api/admin/bookings/${id}`)
      .set(auth())
      .expect(200);
    await request(context.app.getHttpServer())
      .post('/api/admin/schedule/slots')
      .set(auth())
      .send({ rehearsalPointId: id, startAt: '2025-01-01T10:00:00Z' })
      .expect(201);
    await request(context.app.getHttpServer())
      .patch(`/api/admin/schedule/slots/${id}/status`)
      .set(auth())
      .send({ status: 'AVAILABLE' })
      .expect(200);
    await request(context.app.getHttpServer())
      .delete(`/api/admin/products/${id}/images/${otherId}`)
      .set(auth())
      .expect(200);
    await request(context.app.getHttpServer())
      .delete(`/api/admin/rehearsal-points/${id}/images/${otherId}`)
      .set(auth())
      .expect(200);
    await request(context.app.getHttpServer())
      .delete(`/api/admin/products/${id}`)
      .set(auth())
      .expect(200);
    await request(context.app.getHttpServer())
      .delete(`/api/admin/rehearsal-points/${id}`)
      .set(auth())
      .expect(200);
  });
});
