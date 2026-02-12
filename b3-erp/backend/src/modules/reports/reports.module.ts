import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ReportsManagementService } from './services/reports-management.service';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [ReportsManagementService],
  exports: [ReportsManagementService],
})
export class ReportsModule {}
