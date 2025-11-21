import { Module } from '@nestjs/common';
import { TicketManagementService } from './services/ticket-management.service';
import { SLATrackingService } from './services/sla-tracking.service';

@Module({
  controllers: [],
  providers: [
    TicketManagementService,
    SLATrackingService,
  ],
  exports: [
    TicketManagementService,
    SLATrackingService,
  ],
})
export class SupportModule {}
