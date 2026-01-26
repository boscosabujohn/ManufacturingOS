import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentTerms, PaymentTermsStatus } from '../entities/payment-terms.entity';

@Injectable()
export class PaymentTermsSeederService implements OnModuleInit {
  private readonly logger = new Logger(PaymentTermsSeederService.name);

  constructor(
    @InjectRepository(PaymentTerms)
    private readonly paymentTermsRepository: Repository<PaymentTerms>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedPaymentTerms();
  }

  async seedPaymentTerms(): Promise<void> {
    this.logger.log('Seeding payment terms...');

    const paymentTerms = [
      {
        code: 'IMMEDIATE',
        name: 'Immediate',
        description: 'Payment due immediately upon invoice',
        dueDays: 0,
        discountPercent: 0,
        discountDays: 0,
        advancePercent: 0,
        balancePercent: 100,
        balanceCondition: 'On Invoice',
        sortOrder: 1,
        status: PaymentTermsStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'NET15',
        name: 'Net 15 Days',
        description: 'Payment due within 15 days of invoice date',
        dueDays: 15,
        discountPercent: 0,
        discountDays: 0,
        advancePercent: 0,
        balancePercent: 100,
        balanceCondition: null,
        sortOrder: 2,
        status: PaymentTermsStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'NET30',
        name: 'Net 30 Days',
        description: 'Payment due within 30 days of invoice date',
        dueDays: 30,
        discountPercent: 0,
        discountDays: 0,
        advancePercent: 0,
        balancePercent: 100,
        balanceCondition: null,
        sortOrder: 3,
        status: PaymentTermsStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'NET45',
        name: 'Net 45 Days',
        description: 'Payment due within 45 days of invoice date',
        dueDays: 45,
        discountPercent: 0,
        discountDays: 0,
        advancePercent: 0,
        balancePercent: 100,
        balanceCondition: null,
        sortOrder: 4,
        status: PaymentTermsStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'NET60',
        name: 'Net 60 Days',
        description: 'Payment due within 60 days of invoice date',
        dueDays: 60,
        discountPercent: 0,
        discountDays: 0,
        advancePercent: 0,
        balancePercent: 100,
        balanceCondition: null,
        sortOrder: 5,
        status: PaymentTermsStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'COD',
        name: 'Cash on Delivery',
        description: 'Payment collected upon delivery of goods',
        dueDays: 0,
        discountPercent: 0,
        discountDays: 0,
        advancePercent: 0,
        balancePercent: 100,
        balanceCondition: 'On Delivery',
        sortOrder: 6,
        status: PaymentTermsStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'ADVANCE',
        name: '100% Advance',
        description: 'Full payment required before order processing',
        dueDays: 0,
        discountPercent: 0,
        discountDays: 0,
        advancePercent: 100,
        balancePercent: 0,
        balanceCondition: null,
        sortOrder: 7,
        status: PaymentTermsStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'ADV50_DEL50',
        name: '50% Advance, 50% Delivery',
        description: '50% payment advance, remaining 50% on delivery',
        dueDays: 0,
        discountPercent: 0,
        discountDays: 0,
        advancePercent: 50,
        balancePercent: 50,
        balanceCondition: 'On Delivery',
        sortOrder: 8,
        status: PaymentTermsStatus.ACTIVE,
        isSystem: true,
      },
    ];

    for (const term of paymentTerms) {
      try {
        const existing = await this.paymentTermsRepository.findOne({
          where: { code: term.code },
        });
        if (!existing) {
          await this.paymentTermsRepository.save(term);
          this.logger.log(`Created payment term: ${term.name}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed payment term ${term.name}: ${error.message}`);
      }
    }

    this.logger.log('Payment terms seeding completed');
  }
}
