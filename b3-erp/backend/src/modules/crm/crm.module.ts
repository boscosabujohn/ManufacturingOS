import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { Lead } from './entities/lead.entity';
import { Interaction } from './entities/interaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, Interaction])],
  controllers: [InteractionsController, LeadsController],
  providers: [InteractionsService, LeadsService],
  exports: [InteractionsService, LeadsService],
})
export class CrmModule {}
