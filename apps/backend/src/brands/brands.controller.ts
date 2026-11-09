import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth/auth.guard';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/brand.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly service: BrandsService) {}

  @Get()
  list() {
    return this.service.list();
  }
}

@UseGuards(AuthGuard)
@Controller('admin/brands')
export class AdminBrandsController {
  constructor(private readonly service: BrandsService) {}

  @Post()
  create(@Body() dto: CreateBrandDto) {
    return this.service.create(dto);
  }
}
