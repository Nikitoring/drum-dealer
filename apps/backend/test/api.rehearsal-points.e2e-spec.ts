import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { createTestContext, id, otherId, point, TestContext } from './test-app';

describe('Rehearsal points API', () => {
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

  it('returns health, categories, a rehearsal point and its slots', async () => {
    context.prisma.category.findMany.mockResolvedValue([{ id, name: 'Ударные', slug: 'udarnye' }]);
    context.prisma.rehearsalPoint.findUnique.mockResolvedValue(point);
    context.prisma.timeSlot.findMany.mockResolvedValue([{ id: otherId, status: 'AVAILABLE' }]);
    await request(context.app.getHttpServer()).get('/api/health').expect(200, { status: 'ok' });
    await request(context.app.getHttpServer())
      .get('/api/categories')
      .expect(200, [{ id, name: 'Ударные', slug: 'udarnye' }]);
    await request(context.app.getHttpServer()).get('/api/rehearsal-points/point').expect(200);
    await request(context.app.getHttpServer())
      .get('/api/rehearsal-points/point/slots?from=2025-01-01T00:00:00Z')
      .expect(200);
  });

  it('creates a booking and rejects invalid or unavailable requests', async () => {
    context.prisma.timeSlot.updateMany.mockResolvedValue({ count: 1 });
    context.prisma.rehearsalBooking.create.mockResolvedValue({
      id,
      status: 'PENDING',
      timeSlotId: otherId,
    });
    const body = {
      timeSlotId: otherId,
      customerName: 'Иван',
      customerPhone: '+79990000000',
      personalDataConsent: true,
    };
    await request(context.app.getHttpServer()).post('/api/bookings').send(body).expect(201);
    expectError(
      await request(context.app.getHttpServer())
        .post('/api/bookings')
        .send({ ...body, personalDataConsent: false }),
      400,
      'PERSONAL_DATA_CONSENT_REQUIRED',
    );
    expectError(
      await request(context.app.getHttpServer())
        .post('/api/bookings')
        .send({ ...body, website: 'bot' }),
      400,
      'PERSONAL_DATA_CONSENT_REQUIRED',
    );
    context.prisma.timeSlot.updateMany.mockResolvedValue({ count: 0 });
    expectError(
      await request(context.app.getHttpServer()).post('/api/bookings').send(body),
      409,
      'SLOT_UNAVAILABLE',
    );
  });

  it('creates a rehearsal point and time slot, including point images', async () => {
    context.prisma.rehearsalPoint.create.mockResolvedValue(point);
    await request(context.app.getHttpServer())
      .post('/api/admin/rehearsal-points')
      .set(auth())
      .send({ name: 'Точка', slug: 'point', address: 'Москва' })
      .expect(201);
    context.prisma.rehearsalPoint.findUnique.mockResolvedValue(point);
    context.prisma.rehearsalPoint.update.mockResolvedValue({ ...point, name: 'Новая точка' });
    await request(context.app.getHttpServer())
      .patch(`/api/admin/rehearsal-points/${id}`)
      .set(auth())
      .send({ name: 'Новая точка' })
      .expect(200);
    context.prisma.timeSlot.create.mockResolvedValue({ id: otherId, status: 'AVAILABLE' });
    await request(context.app.getHttpServer())
      .post(`/api/admin/rehearsal-points/${id}/time-slots`)
      .set(auth())
      .send({ startAt: '2025-01-01T10:00:00Z' })
      .expect(201);
    expectError(
      await request(context.app.getHttpServer())
        .post(`/api/admin/rehearsal-points/${id}/time-slots`)
        .set(auth())
        .send({}),
      400,
    );
    context.prisma.rehearsalPointImage.count.mockResolvedValue(0);
    context.prisma.rehearsalPointImage.create.mockResolvedValue({ id: otherId, type: 'POINT' });
    await request(context.app.getHttpServer())
      .post(`/api/admin/rehearsal-points/${id}/images`)
      .set(auth())
      .field('type', 'POINT')
      .attach('file', Buffer.from('image'), 'x.jpg')
      .expect(201);
    expectError(
      await request(context.app.getHttpServer())
        .post(`/api/admin/rehearsal-points/${id}/images`)
        .set(auth())
        .field('type', 'POINT'),
      400,
      'FILE_REQUIRED',
    );
  });
});
