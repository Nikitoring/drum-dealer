import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../common/auth/auth.guard';
import {
  CreateRehearsalPointDto,
  CreateSlotDto,
  SlotQueryDto,
  UpdateRehearsalPointDto,
} from './dto/rehearsal-point.dto';
import { RehearsalPointsService } from './rehearsal-points.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { StorageService } from '../common/storage/storage.service';
@Controller('rehearsal-points')
export class RehearsalPointsController {
  constructor(private readonly service: RehearsalPointsService) {}
  @Get() list() {
    return this.service.list();
  }
  @Get(':slug') one(@Param('slug') slug: string) {
    return this.service.bySlug(slug);
  }
  @Get(':slug/slots') slots(@Param('slug') slug: string, @Query() q: SlotQueryDto) {
    return this.service.slots(slug, q);
  }
}
@UseGuards(AuthGuard)
@Controller('admin/rehearsal-points')
export class AdminRehearsalPointsController {
  constructor(
    private readonly service: RehearsalPointsService,
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}
  @Get() list() {
    return this.service.list();
  }
  @Get(':id') one(@Param('id') id: string) {
    return this.service.adminById(id);
  }
  @Post() create(@Body() dto: CreateRehearsalPointDto) {
    return this.service.create(dto);
  }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateRehearsalPointDto) {
    return this.service.update(id, dto);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
  @Post(':id/time-slots') slot(@Param('id') id: string, @Body() dto: CreateSlotDto) {
    return this.service.createSlot(id, dto);
  }
  @Post(':id/images')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: Number(process.env.MAX_IMAGE_SIZE_BYTES ?? 5242880) },
    }),
  )
  async image(
    @Param('id') id: string,
    @Body('type') type: 'POINT' | 'EQUIPMENT',
    @UploadedFile() file: { mimetype: string; buffer: Buffer },
  ) {
    if (!file) throw new BadRequestException('FILE_REQUIRED');
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.mimetype))
      throw new BadRequestException('UNSUPPORTED_IMAGE_TYPE');
    await this.service.adminById(id);
    const imageType = type === 'EQUIPMENT' ? 'EQUIPMENT' : 'POINT';
    const position = await this.prisma.rehearsalPointImage.count({
      where: { rehearsalPointId: id, type: imageType },
    });
    if (position >= 10) throw new BadRequestException('IMAGE_LIMIT_REACHED');
    const url = await this.storage.upload(file.buffer, file.mimetype, 'rehearsal-points');
    return this.prisma.rehearsalPointImage.create({
      data: { rehearsalPointId: id, type: imageType, position, url },
    });
  }
  @Delete(':id/images/:imageId') async deleteImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ) {
    const image = await this.prisma.rehearsalPointImage.findFirst({
      where: { id: imageId, rehearsalPointId: id },
    });
    if (!image) throw new BadRequestException('IMAGE_NOT_FOUND');
    await this.storage.remove(image.url);
    await this.prisma.rehearsalPointImage.delete({ where: { id: imageId } });
    return { success: true };
  }
}
@UseGuards(AuthGuard)
@Controller('admin/time-slots')
export class AdminSlotsController {
  constructor(private readonly service: RehearsalPointsService) {}
  @Get() slots(@Query() q: SlotQueryDto) {
    return this.service.slotsByPoint(q);
  }
  @Patch(':id/status') status(
    @Param('id') id: string,
    @Body('status') status: 'AVAILABLE' | 'BLOCKED',
  ) {
    return this.service.setStatus(id, status);
  }
}
