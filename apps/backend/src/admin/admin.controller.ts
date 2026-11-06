import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IsDateString, IsEmail, IsIn, IsOptional, IsString } from 'class-validator';
import { AuthGuard } from '../common/auth/auth.guard';
import { AuthService } from '../common/auth/auth.service';
import { PrismaService } from '../common/prisma/prisma.service';
class LoginDto {
  @IsEmail() email!: string;
  @IsString() password!: string;
}

class ScheduleQueryDto {
  @IsOptional() @IsDateString() from?: string;
  @IsOptional() @IsDateString() to?: string;
}

class CreateScheduleSlotDto {
  @IsString() rehearsalPointId!: string;
  @IsDateString() startAt!: string;
  @IsOptional() @IsDateString() endAt?: string;
}

class ScheduleSlotStatusDto {
  @IsIn(['AVAILABLE', 'BLOCKED']) status!: 'AVAILABLE' | 'BLOCKED';
}
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('login') login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me() {
    return { authenticated: true };
  }
}
@UseGuards(AuthGuard)
@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly prisma: PrismaService) {}
  @Get() async dashboard() {
    const [products, availableProducts, bookings, pendingBookings, latest] =
      await this.prisma.$transaction([
        this.prisma.product.count(),
        this.prisma.product.count({ where: { status: 'AVAILABLE' } }),
        this.prisma.rehearsalBooking.count(),
        this.prisma.rehearsalBooking.count({ where: { status: 'PENDING' } }),
        this.prisma.rehearsalBooking.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { timeSlot: true },
        }),
      ]);
    return {
      products,
      availableProducts,
      bookings,
      pendingBookings,
      latestBookings: latest,
    };
  }
}

@UseGuards(AuthGuard)
@Controller('admin/schedule')
export class AdminScheduleController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async schedule(@Query() query: ScheduleQueryDto) {
    const where = {
      ...(query.from || query.to
        ? {
            startAt: {
              ...(query.from && { gte: new Date(query.from) }),
              ...(query.to && { lt: new Date(query.to) }),
            },
          }
        : {}),
    };
    const points = await this.prisma.rehearsalPoint.findMany({
      orderBy: { name: 'asc' },
      include: {
        slots: {
          where,
          orderBy: { startAt: 'asc' },
          include: { bookings: { select: { id: true, status: true, customerName: true } } },
        },
      },
    });

    return {
      data: points.map(({ slots, ...point }) => ({ point, slots })),
      range: { from: query.from ?? null, to: query.to ?? null },
    };
  }

  @Post('slots')
  async createSlot(@Body() dto: CreateScheduleSlotDto) {
    const endAt = dto.endAt
      ? new Date(dto.endAt)
      : new Date(new Date(dto.startAt).getTime() + 90 * 60 * 1000);

    try {
      return await this.prisma.timeSlot.create({
        data: {
          rehearsalPointId: dto.rehearsalPointId,
          startAt: new Date(dto.startAt),
          endAt,
        },
      });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') {
        throw new ConflictException('SLOT_EXISTS');
      }
      throw error;
    }
  }

  @Patch('slots/:id/status')
  async updateSlotStatus(@Param('id') id: string, @Body() dto: ScheduleSlotStatusDto) {
    const slot = await this.prisma.timeSlot.findUnique({ where: { id } });
    if (!slot) throw new NotFoundException();
    if (!['AVAILABLE', 'BLOCKED'].includes(slot.status))
      throw new ConflictException('INVALID_STATUS_TRANSITION');
    return this.prisma.timeSlot.update({ where: { id }, data: { status: dto.status } });
  }
}
