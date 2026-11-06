import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../common/auth/auth.guard";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/category.dto";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  list() {
    return this.service.list();
  }
}

@UseGuards(AuthGuard)
@Controller("admin/categories")
export class AdminCategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }
}
