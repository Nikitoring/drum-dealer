import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateBrandDto } from './dto/brand.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.brand.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    });
  }

  async create(dto: CreateBrandDto) {
    const name = dto.name.trim();
    const slug = this.toSlug(name);
    if (!name || !slug) throw new ConflictException('INVALID_BRAND_NAME');

    try {
      return await this.prisma.brand.create({
        data: { name, slug },
        select: { id: true, name: true, slug: true },
      });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') {
        throw new ConflictException('BRAND_EXISTS');
      }
      throw error;
    }
  }

  private toSlug(value: string) {
    return value
      .toLocaleLowerCase('ru')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
      .replace(/^-+|-+$/g, '');
  }
}
