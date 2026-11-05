import { IsEnum, IsInt, IsNumberString, IsObject, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";
import { PartialType } from "@nestjs/swagger";
import { ProductCondition, ProductStatus } from "@prisma/client";
import { PageQueryDto } from "../../common/pagination";
export class ProductQueryDto extends PageQueryDto { @IsOptional() @IsString() category?: string; @IsOptional() @IsString() brand?: string; @IsOptional() @IsEnum(ProductCondition) condition?: ProductCondition; @IsOptional() @IsEnum(ProductStatus) status?: ProductStatus; @IsOptional() @IsString() q?: string; @IsOptional() @IsString() sort?: string; }
export class CreateProductDto { @IsString() name!: string; @IsString() slug!: string; @IsOptional() @IsString() brand?: string; @IsString() category!: string; @IsNumberString() price!: string; @IsEnum(ProductCondition) condition!: ProductCondition; @IsEnum(ProductStatus) status!: ProductStatus; @IsOptional() @IsString() description?: string; @IsOptional() @IsObject() specifications?: Record<string, unknown>; }
export class UpdateProductDto extends PartialType(CreateProductDto) {}
export class ImagePositionDto { @IsInt() @Min(0) @Max(10000) position!: number; }
