import { IsInt, IsOptional, Max, Min } from "class-validator";
import { Type } from "class-transformer";
export class PageQueryDto { @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1; @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) pageSize = 20; }
export function pagination(query: PageQueryDto) {
  const page = Math.max(1, Number(query.page) || 1); const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 20));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}
export function pageMeta(page: number, pageSize: number, total: number) { return { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }; }
