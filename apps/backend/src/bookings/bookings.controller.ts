import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth/auth.guard';
import { BookingQueryDto, BookingStatusDto, CreateBookingDto } from './dto/booking.dto';
import { BookingsService } from './bookings.service';
@Controller('bookings')
export class BookingsController {
  constructor(private readonly service: BookingsService) {}
  @Post() create(@Body() dto: CreateBookingDto) {
    return this.service.create(dto);
  }
}
@UseGuards(AuthGuard)
@Controller('admin/bookings')
export class AdminBookingsController {
  constructor(private readonly service: BookingsService) {}
  @Get() list(@Query() q: BookingQueryDto) {
    return this.service.list(q);
  }
  @Get(':id') one(@Param('id') id: string) {
    return this.service.one(id);
  }
  @Patch(':id/status') change(@Param('id') id: string, @Body() dto: BookingStatusDto) {
    return this.service.change(id, dto.status);
  }
}
