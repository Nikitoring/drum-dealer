import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { createTestContext, id, otherId, product, TestContext } from './test-app';

describe('Products API', () => {
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

  it('lists products with filters and maps decimals', async () => {
    context.prisma.product.findMany.mockResolvedValue([
      {
        ...product,
        category: { id: otherId, name: 'Ударные' },
        price: { toString: () => '1000.00' },
      },
    ]);
    context.prisma.product.count.mockResolvedValue(1);
    const res = await request(context.app.getHttpServer()).get(
      '/api/products?page=1&pageSize=1&sort=price_asc&q=барабан',
    );
    expect(res.status).toBe(200);
    expect(res.body.data[0]).toEqual(
      expect.objectContaining({ slug: 'drum', price: '1000.00', category: 'Ударные' }),
    );
    expect(res.body.meta).toEqual({ page: 1, pageSize: 1, total: 1, totalPages: 1 });
  });

  it('returns a product or 404', async () => {
    context.prisma.product.findFirst.mockResolvedValue({
      ...product,
      category: { id: otherId, name: 'Ударные' },
      price: { toString: () => '1000' },
    });
    await request(context.app.getHttpServer()).get('/api/products/drum').expect(200);
    context.prisma.product.findFirst.mockResolvedValue(null);
    expectError(await request(context.app.getHttpServer()).get('/api/products/missing'), 404);
  });

  it('creates and updates a product, including validation and not found errors', async () => {
    context.prisma.category.findUnique.mockResolvedValue({ id: otherId, name: 'Ударные' });
    context.prisma.product.create.mockResolvedValue({
      ...product,
      category: { id: otherId, name: 'Ударные' },
      price: { toString: () => '1000' },
    });
    const payload = {
      ...product,
      categoryId: otherId,
      price: '1000',
      condition: 'NEW',
      status: 'AVAILABLE',
    };
    await request(context.app.getHttpServer())
      .post('/api/admin/products')
      .set(auth())
      .send(payload)
      .expect(201);
    context.prisma.product.findUnique.mockResolvedValue({
      ...product,
      category: { id: otherId, name: 'Ударные' },
      price: { toString: () => '1000' },
      images: [],
    });
    context.prisma.product.update.mockResolvedValue({
      ...product,
      name: 'Новый барабан',
      category: { id: otherId, name: 'Ударные' },
      price: { toString: () => '1200' },
      images: [],
    });
    await request(context.app.getHttpServer())
      .patch(`/api/admin/products/${id}`)
      .set(auth())
      .send({ name: 'Новый барабан' })
      .expect(200);
    expectError(
      await request(context.app.getHttpServer())
        .post('/api/admin/products')
        .set(auth())
        .send({ name: 'bad' }),
      400,
    );
    context.prisma.category.findUnique.mockResolvedValue(null);
    expectError(
      await request(context.app.getHttpServer())
        .post('/api/admin/products')
        .set(auth())
        .send(payload),
      404,
      'CATEGORY_NOT_FOUND',
    );
  });

  it('handles product images and image-position errors', async () => {
    context.prisma.product.findUnique.mockResolvedValue({
      ...product,
      category: { id: otherId, name: 'Ударные' },
      price: { toString: () => '1000' },
      images: [],
    });
    context.prisma.productImage.count.mockResolvedValue(0);
    context.prisma.productImage.create.mockResolvedValue({
      id: otherId,
      url: 'https://storage/image.png',
      position: 0,
    });
    await request(context.app.getHttpServer())
      .post(`/api/admin/products/${id}/images`)
      .set(auth())
      .attach('file', Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), 'x.png')
      .expect(201);
    context.prisma.productImage.findFirst.mockResolvedValue({
      id: otherId,
      productId: id,
      url: 'old',
    });
    context.prisma.productImage.update.mockResolvedValue({ id: otherId, position: 2 });
    await request(context.app.getHttpServer())
      .patch(`/api/admin/products/${id}/images/${otherId}`)
      .set(auth())
      .send({ position: 2 })
      .expect(200);
    expectError(
      await request(context.app.getHttpServer())
        .post(`/api/admin/products/${id}/images`)
        .set(auth())
        .attach('file', Buffer.from('no'), 'x.txt'),
      400,
      'UNSUPPORTED_IMAGE_TYPE',
    );
    context.prisma.productImage.findFirst.mockResolvedValue(null);
    expectError(
      await request(context.app.getHttpServer())
        .patch(`/api/admin/products/${id}/images/${id}`)
        .set(auth())
        .send({ position: 2 }),
      404,
    );
  });
});
