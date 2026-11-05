import { IsNumberString, IsOptional, IsString } from "class-validator";
import { PartialType } from "@nestjs/swagger";
import { PageQueryDto } from "../../common/pagination";
export class RehearsalPointQueryDto extends PageQueryDto {}
export class CreateRehearsalPointDto { @IsString() name!: string; @IsString() slug!: string; @IsString() address!: string; @IsOptional() @IsString() description?: string; @IsOptional() @IsString() equipment?: string; @IsOptional() @IsString() contactPhone?: string; @IsOptional() @IsNumberString() pricePerHour?: string; }
export class UpdateRehearsalPointDto extends PartialType(CreateRehearsalPointDto) {}
export class CreateSlotDto { @IsString() startAt!: string; }
export class SlotQueryDto { @IsOptional() @IsString() rehearsalPointId?: string; @IsOptional() @IsString() from?: string; @IsOptional() @IsString() to?: string; }
