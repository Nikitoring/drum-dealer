import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { pagination, pageMeta } from "../common/pagination";
import { CreateProductDto, ProductQueryDto, UpdateProductDto } from "./dto/product.dto";
import { StorageService } from "../common/storage/storage.service";
@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService, private readonly storage: StorageService) {}
  private map(p: any) { return { ...p, price: p.price.toString() }; }
  async list(query: ProductQueryDto, publicOnly = true) { const p = pagination(query); const where: any = { ...(publicOnly ? { status: { not: "HIDDEN" } } : {}), ...(!publicOnly && query.status && { status: query.status }), ...(query.category && { category: query.category }), ...(query.brand && { brand: query.brand }), ...(query.condition && { condition: query.condition }), ...(query.q && { name: { contains: query.q, mode: "insensitive" } }) }; const orderBy: any = query.sort === "price_asc" ? { price: "asc" } : query.sort === "price_desc" ? { price: "desc" } : query.sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" }; const [data, total] = await this.prisma.$transaction([this.prisma.product.findMany({ where, include: { images: { orderBy: { position: "asc" } } }, orderBy, skip: p.skip, take: p.take }), this.prisma.product.count({ where })]); return { data: data.map(this.map), meta: pageMeta(p.page, p.pageSize, total) }; }
  async bySlug(slug: string) { const p = await this.prisma.product.findFirst({ where: { slug, status: { not: "HIDDEN" } }, include: { images: { orderBy: { position: "asc" } } } }); if (!p) throw new NotFoundException(); return this.map(p); }
  async adminById(id: string) { const p = await this.prisma.product.findUnique({ where: { id }, include: { images: { orderBy: { position: "asc" } } } }); if (!p) throw new NotFoundException(); return this.map(p); }
  async create(dto: CreateProductDto) { try { return this.map(await this.prisma.product.create({ data: { ...dto, price: dto.price, specifications: dto.specifications as any } })); } catch (e) { if ((e as any).code === "P2002") throw new ConflictException("SLUG_EXISTS"); throw e; } }
  async update(id: string, dto: UpdateProductDto) { await this.adminById(id); return this.map(await this.prisma.product.update({ where: { id }, data: { ...dto, price: dto.price, specifications: dto.specifications as any } })); }
  async remove(id: string) { const product = await this.adminById(id); for (const image of product.images) await this.storage.remove(image.url); await this.prisma.product.delete({ where: { id } }); return { success: true }; }
}
