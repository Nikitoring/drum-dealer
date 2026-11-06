import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { pagination, pageMeta } from "../common/pagination";
import { CreateProductDto, ProductQueryDto, UpdateProductDto } from "./dto/product.dto";
import { StorageService } from "../common/storage/storage.service";
@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService, private readonly storage: StorageService) {}
  private map(p: any) { const { category, ...product } = p; return { ...product, categoryId: category.id, category: category.name, price: p.price.toString() }; }
  private readonly include = { category: true, images: { orderBy: { position: "asc" as const } } };
  async list(query: ProductQueryDto, publicOnly = true) { const p = pagination(query); const where: any = { ...(publicOnly ? { status: { not: "HIDDEN" } } : {}), ...(!publicOnly && query.status && { status: query.status }), ...(query.category && { category: { name: query.category } }), ...(query.brand && { brand: query.brand }), ...(query.condition && { condition: query.condition }), ...(query.q && { name: { contains: query.q, mode: "insensitive" } }) }; const orderBy: any = query.sort === "price_asc" ? { price: "asc" } : query.sort === "price_desc" ? { price: "desc" } : query.sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" }; const [data, total] = await this.prisma.$transaction([this.prisma.product.findMany({ where, include: this.include, orderBy, skip: p.skip, take: p.take }), this.prisma.product.count({ where })]); return { data: data.map(this.map), meta: pageMeta(p.page, p.pageSize, total) }; }
  async bySlug(slug: string) { const p = await this.prisma.product.findFirst({ where: { slug, status: { not: "HIDDEN" } }, include: this.include }); if (!p) throw new NotFoundException(); return this.map(p); }
  async adminById(id: string) { const p = await this.prisma.product.findUnique({ where: { id }, include: this.include }); if (!p) throw new NotFoundException(); return this.map(p); }
  async create(dto: CreateProductDto) { await this.category(dto.categoryId); try { return this.map(await this.prisma.product.create({ data: { ...dto, price: dto.price, specifications: dto.specifications as any }, include: this.include })); } catch (e) { if ((e as any).code === "P2002") throw new ConflictException("SLUG_EXISTS"); throw e; } }
  async update(id: string, dto: UpdateProductDto) { await this.adminById(id); if (dto.categoryId) await this.category(dto.categoryId); return this.map(await this.prisma.product.update({ where: { id }, data: { ...dto, price: dto.price, specifications: dto.specifications as any }, include: this.include })); }
  private async category(id: string) { const category = await this.prisma.category.findUnique({ where: { id } }); if (!category) throw new NotFoundException("CATEGORY_NOT_FOUND"); return category; }
  async remove(id: string) { const product = await this.adminById(id); for (const image of product.images) await this.storage.remove(image.url); await this.prisma.product.delete({ where: { id } }); return { success: true }; }
}
