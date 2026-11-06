import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BookingStatus, TimeSlotStatus } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { pagination, pageMeta } from '../common/pagination';
import { BookingQueryDto, CreateBookingDto } from './dto/booking.dto';
@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}
  create(dto: CreateBookingDto) {
    if (!dto.personalDataConsent || dto.website)
      throw new BadRequestException('PERSONAL_DATA_CONSENT_REQUIRED');
    return this.prisma.$transaction(async (tx) => {
      const changed = await tx.timeSlot.updateMany({
        where: { id: dto.timeSlotId, status: TimeSlotStatus.AVAILABLE },
        data: { status: TimeSlotStatus.PENDING },
      });
      if (changed.count !== 1) throw new ConflictException('SLOT_UNAVAILABLE');
      const b = await tx.rehearsalBooking.create({
        data: {
          timeSlotId: dto.timeSlotId,
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          customerEmail: dto.customerEmail,
          comment: dto.comment,
          personalDataConsent: true,
        },
      });
      return { data: { id: b.id, status: b.status, timeSlotId: b.timeSlotId } };
    });
  }
  async list(q: BookingQueryDto) {
    const p = pagination(q);
    const where: any = {
      ...(q.status && { status: q.status }),
      ...(q.rehearsalPointId && { timeSlot: { rehearsalPointId: q.rehearsalPointId } }),
      ...(q.from || q.to
        ? {
            timeSlot: {
              ...(q.rehearsalPointId && { rehearsalPointId: q.rehearsalPointId }),
              startAt: {
                ...(q.from && { gte: new Date(q.from) }),
                ...(q.to && { lt: new Date(q.to) }),
              },
            },
          }
        : {}),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.rehearsalBooking.findMany({
        where,
        include: { timeSlot: { include: { rehearsalPoint: true } } },
        orderBy: { createdAt: 'desc' },
        skip: p.skip,
        take: p.take,
      }),
      this.prisma.rehearsalBooking.count({ where }),
    ]);
    return { data, meta: pageMeta(p.page, p.pageSize, total) };
  }
  async one(id: string) {
    const b = await this.prisma.rehearsalBooking.findUnique({
      where: { id },
      include: { timeSlot: { include: { rehearsalPoint: true } } },
    });
    if (!b) throw new NotFoundException();
    return b;
  }
  change(id: string, status: BookingStatus) {
    return this.prisma.$transaction(async (tx) => {
      const b = await tx.rehearsalBooking.findUnique({ where: { id } });
      if (!b) throw new NotFoundException();
      const transitions: any = {
        PENDING: { CONFIRMED: TimeSlotStatus.BOOKED, REJECTED: TimeSlotStatus.AVAILABLE },
        CONFIRMED: { CANCELLED: TimeSlotStatus.AVAILABLE },
      };
      const next = transitions[b.status]?.[status];
      if (!next) throw new ConflictException('INVALID_STATUS_TRANSITION');
      await tx.rehearsalBooking.update({ where: { id }, data: { status } });
      await tx.timeSlot.update({ where: { id: b.timeSlotId }, data: { status: next } });
      return this.one(id);
    });
  }
}
