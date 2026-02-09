import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { SalesTerritoryController } from './sales-territory.controller';
import { SalesTerritoryService } from './services/sales-territory.service';
import { Lead } from './entities/lead.entity';
import { Interaction } from './entities/interaction.entity';
import { LeadSource } from './entities/lead-source.entity';
import { LeadStatusEntity } from './entities/lead-status.entity';
import { SalesTerritory } from './entities/sales-territory.entity';
import { LeadSourceSeederService } from './services/lead-source-seeder.service';
import { LeadStatusSeederService } from './services/lead-status-seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Lead,
      Interaction,
      LeadSource,
      LeadStatusEntity,
      SalesTerritory,
    ]),
  ],
  controllers: [InteractionsController, LeadsController, SalesTerritoryController],
  providers: [
    InteractionsService,
    LeadsService,
    SalesTerritoryService,
    LeadSourceSeederService,
    LeadStatusSeederService,
  ],
  exports: [InteractionsService, LeadsService, SalesTerritoryService],
})
export class CrmModule { }
