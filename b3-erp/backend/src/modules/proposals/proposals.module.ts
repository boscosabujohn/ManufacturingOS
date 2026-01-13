import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposal } from './entities/proposal.entity';
import { ProposalTemplate } from './entities/proposal-template.entity';
import { ProposalService } from './services/proposal.service';
import { ProposalController } from './controllers/proposal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal, ProposalTemplate])],
  controllers: [ProposalController],
  providers: [ProposalService],
  exports: [ProposalService],
})
export class ProposalsModule {}
