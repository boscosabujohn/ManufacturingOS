import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarrantyTypeEntity, WarrantyTypeStatus, WarrantyCoverageType } from '../entities/warranty-type.entity';

@Injectable()
export class WarrantyTypeSeederService implements OnModuleInit {
  private readonly logger = new Logger(WarrantyTypeSeederService.name);

  constructor(
    @InjectRepository(WarrantyTypeEntity)
    private readonly warrantyTypeRepository: Repository<WarrantyTypeEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedWarrantyTypes();
  }

  async seedWarrantyTypes(): Promise<void> {
    this.logger.log('Seeding warranty types...');

    const warrantyTypes = [
      {
        code: 'STANDARD',
        name: 'Standard Warranty',
        description: 'Standard warranty covering parts and labor for manufacturing defects',
        durationMonths: 12,
        coverageType: WarrantyCoverageType.PARTS_LABOR,
        includedServices: ['repair', 'replacement', 'labor'],
        excludedItems: ['consumables', 'wear_parts', 'misuse_damage'],
        deductiblePercentage: 0,
        icon: 'Shield',
        color: '#3B82F6',
        sortOrder: 1,
        isExtendable: true,
        isTransferable: false,
        status: WarrantyTypeStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'EXTENDED',
        name: 'Extended Warranty',
        description: 'Extended warranty with comprehensive parts and labor coverage',
        durationMonths: 24,
        coverageType: WarrantyCoverageType.PARTS_LABOR,
        includedServices: ['repair', 'replacement', 'labor', 'preventive_maintenance'],
        excludedItems: ['consumables', 'misuse_damage'],
        deductiblePercentage: 0,
        icon: 'ShieldPlus',
        color: '#8B5CF6',
        sortOrder: 2,
        isExtendable: true,
        isTransferable: true,
        status: WarrantyTypeStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'PARTS_ONLY',
        name: 'Parts Only',
        description: 'Warranty covering replacement parts only, labor not included',
        durationMonths: 12,
        coverageType: WarrantyCoverageType.PARTS,
        includedServices: ['replacement_parts'],
        excludedItems: ['labor', 'consumables', 'wear_parts', 'misuse_damage'],
        deductiblePercentage: 0,
        icon: 'Package',
        color: '#F59E0B',
        sortOrder: 3,
        isExtendable: false,
        isTransferable: false,
        status: WarrantyTypeStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'COMPREHENSIVE',
        name: 'Comprehensive',
        description: 'All-inclusive comprehensive warranty with full coverage',
        durationMonths: 36,
        coverageType: WarrantyCoverageType.ALL,
        includedServices: ['repair', 'replacement', 'labor', 'preventive_maintenance', 'calibration', 'training'],
        excludedItems: ['misuse_damage', 'natural_disaster'],
        deductiblePercentage: 0,
        icon: 'ShieldCheck',
        color: '#22C55E',
        sortOrder: 4,
        isExtendable: true,
        isTransferable: true,
        status: WarrantyTypeStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'LIMITED',
        name: 'Limited Warranty',
        description: 'Limited warranty covering specific parts only',
        durationMonths: 6,
        coverageType: WarrantyCoverageType.PARTS,
        includedServices: ['replacement_parts'],
        excludedItems: ['labor', 'consumables', 'wear_parts', 'misuse_damage', 'electrical_components'],
        deductiblePercentage: 10,
        icon: 'ShieldAlert',
        color: '#6B7280',
        sortOrder: 5,
        isExtendable: false,
        isTransferable: false,
        status: WarrantyTypeStatus.ACTIVE,
        isSystem: true,
      },
    ];

    for (const warrantyType of warrantyTypes) {
      try {
        const existing = await this.warrantyTypeRepository.findOne({
          where: { code: warrantyType.code },
        });
        if (!existing) {
          await this.warrantyTypeRepository.save(warrantyType);
          this.logger.log(`Created warranty type: ${warrantyType.name}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed warranty type ${warrantyType.name}: ${error.message}`);
      }
    }

    this.logger.log('Warranty types seeding completed');
  }
}
