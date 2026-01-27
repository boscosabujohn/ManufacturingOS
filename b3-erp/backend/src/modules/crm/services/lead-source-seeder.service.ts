import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeadSource, LeadSourceStatus } from '../entities/lead-source.entity';

@Injectable()
export class LeadSourceSeederService implements OnModuleInit {
  private readonly logger = new Logger(LeadSourceSeederService.name);

  constructor(
    @InjectRepository(LeadSource)
    private readonly leadSourceRepository: Repository<LeadSource>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedLeadSources();
  }

  async seedLeadSources(): Promise<void> {
    this.logger.log('Seeding lead sources...');

    const leadSources = [
      {
        code: 'WEBSITE',
        name: 'Website Inquiry',
        description: 'Lead generated from website contact form or inquiry',
        icon: 'Globe',
        color: '#3B82F6',
        sortOrder: 1,
        status: LeadSourceStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'REFERRAL',
        name: 'Customer Referral',
        description: 'Lead referred by an existing customer',
        icon: 'Users',
        color: '#10B981',
        sortOrder: 2,
        status: LeadSourceStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'COLD_CALL',
        name: 'Cold Call',
        description: 'Lead generated through outbound cold calling',
        icon: 'Phone',
        color: '#8B5CF6',
        sortOrder: 3,
        status: LeadSourceStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'TRADE_SHOW',
        name: 'Trade Show',
        description: 'Lead acquired at trade show or exhibition',
        icon: 'Building2',
        color: '#F59E0B',
        sortOrder: 4,
        status: LeadSourceStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'SOCIAL',
        name: 'Social Media',
        description: 'Lead generated from social media platforms',
        icon: 'Share2',
        color: '#EC4899',
        sortOrder: 5,
        status: LeadSourceStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'EMAIL',
        name: 'Email Campaign',
        description: 'Lead generated from email marketing campaigns',
        icon: 'Mail',
        color: '#06B6D4',
        sortOrder: 6,
        status: LeadSourceStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'PARTNER',
        name: 'Partner Referral',
        description: 'Lead referred by a business partner or affiliate',
        icon: 'Handshake',
        color: '#14B8A6',
        sortOrder: 7,
        status: LeadSourceStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'ADVERTISEMENT',
        name: 'Advertisement',
        description: 'Lead generated from paid advertising campaigns',
        icon: 'Megaphone',
        color: '#EF4444',
        sortOrder: 8,
        status: LeadSourceStatus.ACTIVE,
        isSystem: true,
      },
    ];

    for (const source of leadSources) {
      try {
        const existing = await this.leadSourceRepository.findOne({
          where: { code: source.code },
        });
        if (!existing) {
          await this.leadSourceRepository.save(source);
          this.logger.log(`Created lead source: ${source.name}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed lead source ${source.name}: ${error.message}`);
      }
    }

    this.logger.log('Lead sources seeding completed');
  }
}
