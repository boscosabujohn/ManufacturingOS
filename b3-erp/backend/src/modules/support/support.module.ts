import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AIResponsesService } from './services/ai-responses.service';
import { BacklogService } from './services/backlog.service';
import { ChannelRoutingService } from './services/channel-routing.service';
import { CSATService } from './services/csat.service';
import { ITILService } from './services/itil.service';
import { KnowledgeBaseService } from './services/knowledge-base.service';
import { SLATrackingService } from './services/sla-tracking.service';
import { SupportManagementService } from './services/support-management.service';
import { SupportSeederService } from './services/support-seeder.service';
import { SupportSettingsService } from './services/support-settings.service';
import { TicketManagementService } from './services/ticket-management.service';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [
    AIResponsesService,
    BacklogService,
    ChannelRoutingService,
    CSATService,
    ITILService,
    KnowledgeBaseService,
    SLATrackingService,
    SupportSeederService,
    SupportSettingsService,
    TicketManagementService,
    SupportManagementService,
  ],
  exports: [
    AIResponsesService,
    BacklogService,
    ChannelRoutingService,
    CSATService,
    ITILService,
    KnowledgeBaseService,
    SLATrackingService,
    SupportSettingsService,
    TicketManagementService,
    SupportManagementService,
  ],
})
export class SupportModule {}
