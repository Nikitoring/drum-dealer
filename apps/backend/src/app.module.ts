import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './common/auth/auth.module';
import { ProductsModule } from './products/products.module';
import { RehearsalPointsModule } from './rehearsal-points/rehearsal-points.module';
import { BookingsModule } from './bookings/bookings.module';
import { AdminModule } from './admin/admin.module';
import { StorageModule } from './common/storage/storage.module';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
    }),
    PrismaModule,
    AuthModule,
    StorageModule,
    ProductsModule,
    RehearsalPointsModule,
    BookingsModule,
    AdminModule,
    CategoriesModule,
    BrandsModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
