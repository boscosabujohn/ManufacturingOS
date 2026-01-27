import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeadStatusEntity, LeadStatusState } from '../entities/lead-status.entity';

@Injectable()
export class LeadStatusSeederService implements OnModuleInit {
  private readonly logger = new Logger(LeadStatusSeederService.name);

  constructor(
    @InjectRepository(LeadStatusEntity)
    private readonly leadStatusRepository: Repository<LeadStatusEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedLeadStatuses();
  }

  async seedLeadStatuses(): Promise<void> {
    this.logger.log('Seeding lead statuses...');

    const leadStatuses = [
      {
        code: 'NEW',
        name: 'New',
        description: 'Newly created lead, not yet contacted',
        color: '#3B82F6',
        sequenceOrder: 1,
        isFinal: false,
        isWon: false,
        isLost: false,
        status: LeadStatusState.ACTIVE,
        isSystem: true,
      },
      {
        code: 'CONTACTED',
        name: 'Contacted',
        description: 'Initial contact has been made with the lead',
        color: '#8B5CF6',
        sequenceOrder: 2,
        isFinal: false,
        isWon: false,
        isLost: false,
        status: LeadStatusState.ACTIVE,
        isSystem: true,
      },
      {
        code: 'QUALIFIED',
        name: 'Qualified',
        description: 'Lead has been qualified as a potential opportunity',
        color: '#10B981',
        sequenceOrder: 3,
        isFinal: false,
        isWon: false,
        isLost: false,
        status: LeadStatusState.ACTIVE,
        isSystem: true,
      },
      {
        code: 'PROPOSAL',
        name: 'Proposal Sent',
        description: 'A proposal or quote has been sent to the lead',
        color: '#F59E0B',
        sequenceOrder: 4,
        isFinal: false,
        isWon: false,
        isLost: false,
        status: LeadStatusState.ACTIVE,
        isSystem: true,
      },
      {
        code: 'NEGOTIATION',
        name: 'Negotiation',
        description: 'In active negotiation with the lead',
        color: '#EF4444',
        sequenceOrder: 5,
        isFinal: false,
        isWon: false,
        isLost: false,
        status: LeadStatusState.ACTIVE,
        isSystem: true,
      },
      {
        code: 'WON',
        name: 'Won',
        description: 'Lead has been converted to a customer',
        color: '#22C55E',
        sequenceOrder: 6,
        isFinal: true,
        isWon: true,
        isLost: false,
        status: LeadStatusState.ACTIVE,
        isSystem: true,
      },
      {
        code: 'LOST',
        name: 'Lost',
        description: 'Lead has been lost or disqualified',
        color: '#6B7280',
        sequenceOrder: 7,
        isFinal: true,
        isWon: false,
        isLost: true,
        status: LeadStatusState.ACTIVE,
        isSystem: true,
      },
    ];

    for (const leadStatus of leadStatuses) {
      try {
        const existing = await this.leadStatusRepository.findOne({
          where: { code: leadStatus.code },
        });
        if (!existing) {
          await this.leadStatusRepository.save(leadStatus);
          this.logger.log(`Created lead status: ${leadStatus.name}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed lead status ${leadStatus.name}: ${error.message}`);
      }
    }

    this.logger.log('Lead statuses seeding completed');
  }
}
