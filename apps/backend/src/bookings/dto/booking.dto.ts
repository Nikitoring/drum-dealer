import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { BookingStatus } from '@prisma/client';
import { PageQueryDto } from '../../common/pagination';
export class CreateBookingDto {
  @IsUUID() timeSlotId!: string;
  @IsString() customerName!: string;
  @IsString() customerPhone!: string;
  @IsOptional() @IsEmail() customerEmail?: string;
  @IsOptional() @IsString() comment?: string;
  @IsBoolean() personalDataConsent!: boolean;
  @IsOptional() @IsString() website?: string;
}
export class BookingQueryDto extends PageQueryDto {
  @IsOptional() @IsEnum(BookingStatus) status?: BookingStatus;
  @IsOptional() @IsString() rehearsalPointId?: string;
  @IsOptional() @IsString() from?: string;
  @IsOptional() @IsString() to?: string;
}
export class BookingStatusDto {
  @IsEnum(BookingStatus) status!: BookingStatus;
}
