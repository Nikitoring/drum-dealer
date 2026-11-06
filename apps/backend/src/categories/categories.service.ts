import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { CreateCategoryDto } from "./dto/category.dto";

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });
  }

  async create(dto: CreateCategoryDto) {
    const name = dto.name.trim();
    const slug = this.toSlug(name);
    if (!name || !slug) throw new ConflictException("INVALID_CATEGORY_NAME");

    try {
      return await this.prisma.category.create({
        data: { name, slug },
        select: { id: true, name: true, slug: true },
      });
    } catch (error) {
      if ((error as { code?: string }).code === "P2002") {
        throw new ConflictException("CATEGORY_EXISTS");
      }
      throw error;
    }
  }

  private toSlug(value: string) {
    return value
      .toLocaleLowerCase("ru")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
      .replace(/^-+|-+$/g, "");
  }
}
