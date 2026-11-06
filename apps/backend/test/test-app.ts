import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { StorageService } from '../src/common/storage/storage.service';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { AuthService } from '../src/common/auth/auth.service';

export const id = '11111111-1111-4111-8111-111111111111';
export const otherId = '22222222-2222-4222-8222-222222222222';
export const point = { id, name: 'Точка', slug: 'point', address: 'Москва', images: [] };
export const product = {
  id,
  name: 'Барабан',
  slug: 'drum',
  categoryId: otherId,
  category: 'Ударные',
  price: '1000.00',
  condition: 'NEW',
  status: 'AVAILABLE',
  images: [],
};

export type TestContext = {
  app: INestApplication;
  prisma: any;
  storage: any;
  authService: AuthService;
  token: string;
};

const resolvedMock = (value: any) => (jest.fn() as any).mockResolvedValue(value);

export function prismaMock() {
  const model = () => ({
    count: resolvedMock(0),
    findMany: resolvedMock([]),
    findUnique: resolvedMock(null),
    findFirst: resolvedMock(null),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  });
  const prisma: any = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn((arg: any) => (Array.isArray(arg) ? Promise.all(arg) : arg(prisma))),
  };
  for (const name of [
    'admin',
    'category',
    'product',
    'productImage',
    'rehearsalPoint',
    'rehearsalPointImage',
    'timeSlot',
    'rehearsalBooking',
  ])
    prisma[name] = model();
  return prisma;
}

export async function createTestContext(): Promise<TestContext> {
  const prisma = prismaMock();
  const storage = {
    upload: resolvedMock('https://storage/image.png'),
    remove: jest.fn(),
  };
  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(PrismaService)
    .useValue(prisma)
    .overrideProvider(StorageService)
    .useValue(storage)
    .compile();
  const app = module.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.init();
  const authService = module.get(AuthService);

  return {
    app,
    prisma,
    storage,
    authService,
    token: authService.sign({ sub: id, email: 'admin@example.com' }),
  };
}
