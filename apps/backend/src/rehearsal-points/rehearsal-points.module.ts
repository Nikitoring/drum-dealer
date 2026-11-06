import { Module } from '@nestjs/common';
import {
  AdminRehearsalPointsController,
  AdminSlotsController,
  RehearsalPointsController,
} from './rehearsal-points.controller';
import { RehearsalPointsService } from './rehearsal-points.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { StorageModule } from '../common/storage/storage.module';
@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [RehearsalPointsController, AdminRehearsalPointsController, AdminSlotsController],
  providers: [RehearsalPointsService],
})
export class RehearsalPointsModule {}
