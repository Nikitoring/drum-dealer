import { Module } from '@nestjs/common';
import {
  AdminAuthController,
  AdminScheduleController,
  DashboardController,
} from './admin.controller';
@Module({ controllers: [AdminAuthController, AdminScheduleController, DashboardController] })
export class AdminModule {}
