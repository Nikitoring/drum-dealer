import { Module } from '@nestjs/common';
import { ProductsController, AdminProductsController } from './products.controller';
import { ProductsService } from './products.service';
@Module({
  controllers: [ProductsController, AdminProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
