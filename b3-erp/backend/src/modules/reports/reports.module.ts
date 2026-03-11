import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ReportsManagementService } from './services/reports-management.service';
import { ReportsController } from './reports.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ReportsController],
  providers: [ReportsManagementService],
  exports: [ReportsManagementService],
})
export class ReportsModule { }
