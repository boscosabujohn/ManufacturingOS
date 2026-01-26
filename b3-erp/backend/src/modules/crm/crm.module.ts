import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { Lead } from './entities/lead.entity';
import { Interaction } from './entities/interaction.entity';
import { LeadSource } from './entities/lead-source.entity';
import { LeadStatusEntity } from './entities/lead-status.entity';
import { LeadSourceSeederService } from './services/lead-source-seeder.service';
import { LeadStatusSeederService } from './services/lead-status-seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Lead,
      Interaction,
      LeadSource,
      LeadStatusEntity,
    ]),
  ],
  controllers: [InteractionsController, LeadsController],
  providers: [
    InteractionsService,
    LeadsService,
    LeadSourceSeederService,
    LeadStatusSeederService,
  ],
  exports: [InteractionsService, LeadsService],
})
export class CrmModule {}
