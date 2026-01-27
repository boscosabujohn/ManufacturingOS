import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AdjustmentReason,
  AdjustmentReasonType,
  AdjustmentReasonStatus,
} from '../entities/adjustment-reason.entity';

@Injectable()
export class AdjustmentReasonSeederService implements OnModuleInit {
  private readonly logger = new Logger(AdjustmentReasonSeederService.name);

  constructor(
    @InjectRepository(AdjustmentReason)
    private readonly adjustmentReasonRepository: Repository<AdjustmentReason>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedAdjustmentReasons();
  }

  async seedAdjustmentReasons(): Promise<void> {
    this.logger.log('Seeding adjustment reasons...');

    const adjustmentReasons = [
      {
        code: 'DAMAGE',
        name: 'Damaged Goods',
        description: 'Stock adjustment due to physical damage during handling, storage, or transit',
        reasonType: AdjustmentReasonType.NEGATIVE,
        status: AdjustmentReasonStatus.ACTIVE,
        requiresApproval: true,
        approvalThreshold: 5000,
        sortOrder: 1,
        icon: 'AlertTriangle',
        color: '#EF4444',
        createdBy: 'system',
      },
      {
        code: 'THEFT',
        name: 'Theft/Pilferage',
        description: 'Stock loss due to theft or pilferage. Requires investigation and documentation',
        reasonType: AdjustmentReasonType.NEGATIVE,
        status: AdjustmentReasonStatus.ACTIVE,
        requiresApproval: true,
        approvalThreshold: 1000,
        sortOrder: 2,
        icon: 'ShieldAlert',
        color: '#DC2626',
        createdBy: 'system',
      },
      {
        code: 'EXPIRY',
        name: 'Expired Stock',
        description: 'Stock write-off due to expiration of shelf life or validity period',
        reasonType: AdjustmentReasonType.NEGATIVE,
        status: AdjustmentReasonStatus.ACTIVE,
        requiresApproval: true,
        approvalThreshold: 10000,
        sortOrder: 3,
        icon: 'Clock',
        color: '#F97316',
        createdBy: 'system',
      },
      {
        code: 'COUNT_ADJ',
        name: 'Physical Count Adjustment',
        description: 'Adjustment based on physical inventory count variance. Can be positive or negative',
        reasonType: AdjustmentReasonType.BOTH,
        status: AdjustmentReasonStatus.ACTIVE,
        requiresApproval: true,
        approvalThreshold: 5000,
        sortOrder: 4,
        icon: 'Calculator',
        color: '#3B82F6',
        createdBy: 'system',
      },
      {
        code: 'FOUND',
        name: 'Found Stock',
        description: 'Previously unaccounted stock discovered during audit or reorganization',
        reasonType: AdjustmentReasonType.POSITIVE,
        status: AdjustmentReasonStatus.ACTIVE,
        requiresApproval: true,
        approvalThreshold: 5000,
        sortOrder: 5,
        icon: 'Search',
        color: '#22C55E',
        createdBy: 'system',
      },
      {
        code: 'QUALITY_REJ',
        name: 'Quality Rejection',
        description: 'Stock rejected due to quality inspection failure or non-conformance',
        reasonType: AdjustmentReasonType.NEGATIVE,
        status: AdjustmentReasonStatus.ACTIVE,
        requiresApproval: true,
        approvalThreshold: 5000,
        sortOrder: 6,
        icon: 'XCircle',
        color: '#EF4444',
        createdBy: 'system',
      },
      {
        code: 'SCRAP',
        name: 'Scrapped Material',
        description: 'Material scrapped during production or deemed unsuitable for use',
        reasonType: AdjustmentReasonType.NEGATIVE,
        status: AdjustmentReasonStatus.ACTIVE,
        requiresApproval: true,
        approvalThreshold: 10000,
        sortOrder: 7,
        icon: 'Trash2',
        color: '#6B7280',
        createdBy: 'system',
      },
      {
        code: 'OBSOLETE',
        name: 'Obsolete Stock',
        description: 'Stock no longer usable due to design changes or discontinuation',
        reasonType: AdjustmentReasonType.NEGATIVE,
        status: AdjustmentReasonStatus.ACTIVE,
        requiresApproval: true,
        approvalThreshold: 10000,
        sortOrder: 8,
        icon: 'Archive',
        color: '#9CA3AF',
        createdBy: 'system',
      },
      {
        code: 'SAMPLE',
        name: 'Sample/Testing',
        description: 'Stock consumed for quality testing, sampling, or R&D purposes',
        reasonType: AdjustmentReasonType.NEGATIVE,
        status: AdjustmentReasonStatus.ACTIVE,
        requiresApproval: false,
        approvalThreshold: 0,
        sortOrder: 9,
        icon: 'Flask',
        color: '#8B5CF6',
        createdBy: 'system',
      },
      {
        code: 'CONVERSION',
        name: 'UOM Conversion',
        description: 'Adjustment due to unit of measure conversion or packaging changes',
        reasonType: AdjustmentReasonType.BOTH,
        status: AdjustmentReasonStatus.ACTIVE,
        requiresApproval: false,
        approvalThreshold: 0,
        sortOrder: 10,
        icon: 'RefreshCw',
        color: '#06B6D4',
        createdBy: 'system',
      },
      {
        code: 'TRANSFER_VAR',
        name: 'Transfer Variance',
        description: 'Variance identified during stock transfer between locations',
        reasonType: AdjustmentReasonType.BOTH,
        status: AdjustmentReasonStatus.ACTIVE,
        requiresApproval: true,
        approvalThreshold: 2000,
        sortOrder: 11,
        icon: 'ArrowLeftRight',
        color: '#F59E0B',
        createdBy: 'system',
      },
      {
        code: 'CORRECTION',
        name: 'Data Correction',
        description: 'Correction of data entry errors or system discrepancies',
        reasonType: AdjustmentReasonType.BOTH,
        status: AdjustmentReasonStatus.ACTIVE,
        requiresApproval: true,
        approvalThreshold: 1000,
        sortOrder: 12,
        icon: 'Edit',
        color: '#14B8A6',
        createdBy: 'system',
      },
    ];

    for (const reason of adjustmentReasons) {
      try {
        const existing = await this.adjustmentReasonRepository.findOne({
          where: { code: reason.code },
        });
        if (!existing) {
          await this.adjustmentReasonRepository.save(reason);
          this.logger.log(`Created adjustment reason: ${reason.name}`);
        } else {
          this.logger.log(`Adjustment reason already exists: ${reason.name}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed adjustment reason ${reason.name}: ${error.message}`);
      }
    }

    this.logger.log('Adjustment reasons seeding completed');
  }

  async getReasonByCode(code: string): Promise<AdjustmentReason | null> {
    return this.adjustmentReasonRepository.findOne({
      where: { code },
    });
  }

  async getActiveReasons(): Promise<AdjustmentReason[]> {
    return this.adjustmentReasonRepository.find({
      where: { status: AdjustmentReasonStatus.ACTIVE },
      order: { sortOrder: 'ASC' },
    });
  }

  async getReasonsByType(type: AdjustmentReasonType): Promise<AdjustmentReason[]> {
    return this.adjustmentReasonRepository.find({
      where: [
        { reasonType: type, status: AdjustmentReasonStatus.ACTIVE },
        { reasonType: AdjustmentReasonType.BOTH, status: AdjustmentReasonStatus.ACTIVE },
      ],
      order: { sortOrder: 'ASC' },
    });
  }
}
