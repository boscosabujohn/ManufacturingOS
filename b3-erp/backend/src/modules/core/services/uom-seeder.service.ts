import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitOfMeasure, UOMType } from '../entities/uom.entity';

@Injectable()
export class UomSeederService implements OnModuleInit {
  private readonly logger = new Logger(UomSeederService.name);

  constructor(
    @InjectRepository(UnitOfMeasure)
    private readonly uomRepository: Repository<UnitOfMeasure>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedUOMs();
  }

  async seedUOMs(): Promise<void> {
    this.logger.log('Seeding units of measure...');

    const uoms = [
      {
        uomCode: 'PCS',
        uomName: 'Pieces',
        uomType: UOMType.QUANTITY,
        symbol: 'pcs',
        description: 'Individual countable units',
        allowFractional: false,
        decimalPlaces: 0,
        conversionFactor: 1,
        isActive: true,
      },
      {
        uomCode: 'KG',
        uomName: 'Kilograms',
        uomType: UOMType.WEIGHT,
        symbol: 'kg',
        description: 'Metric unit of mass equal to 1000 grams',
        allowFractional: true,
        decimalPlaces: 3,
        conversionFactor: 1,
        isActive: true,
      },
      {
        uomCode: 'GM',
        uomName: 'Grams',
        uomType: UOMType.WEIGHT,
        symbol: 'g',
        description: 'Metric unit of mass',
        allowFractional: true,
        decimalPlaces: 2,
        conversionFactor: 0.001, // 1 gram = 0.001 kg
        isActive: true,
      },
      {
        uomCode: 'MTR',
        uomName: 'Meters',
        uomType: UOMType.LENGTH,
        symbol: 'm',
        description: 'Base metric unit of length',
        allowFractional: true,
        decimalPlaces: 3,
        conversionFactor: 1,
        isActive: true,
      },
      {
        uomCode: 'CM',
        uomName: 'Centimeters',
        uomType: UOMType.LENGTH,
        symbol: 'cm',
        description: 'One hundredth of a meter',
        allowFractional: true,
        decimalPlaces: 2,
        conversionFactor: 0.01, // 1 cm = 0.01 m
        isActive: true,
      },
      {
        uomCode: 'MM',
        uomName: 'Millimeters',
        uomType: UOMType.LENGTH,
        symbol: 'mm',
        description: 'One thousandth of a meter',
        allowFractional: true,
        decimalPlaces: 2,
        conversionFactor: 0.001, // 1 mm = 0.001 m
        isActive: true,
      },
      {
        uomCode: 'LTR',
        uomName: 'Liters',
        uomType: UOMType.VOLUME,
        symbol: 'L',
        description: 'Metric unit of volume',
        allowFractional: true,
        decimalPlaces: 3,
        conversionFactor: 1,
        isActive: true,
      },
      {
        uomCode: 'SQM',
        uomName: 'Square Meters',
        uomType: UOMType.AREA,
        symbol: 'm²',
        description: 'Metric unit of area',
        allowFractional: true,
        decimalPlaces: 4,
        conversionFactor: 1,
        isActive: true,
      },
      {
        uomCode: 'BOX',
        uomName: 'Box',
        uomType: UOMType.QUANTITY,
        symbol: 'box',
        description: 'Standard packaging box unit',
        allowFractional: false,
        decimalPlaces: 0,
        conversionFactor: 1,
        isActive: true,
      },
      {
        uomCode: 'SET',
        uomName: 'Set',
        uomType: UOMType.QUANTITY,
        symbol: 'set',
        description: 'A complete set of items',
        allowFractional: false,
        decimalPlaces: 0,
        conversionFactor: 1,
        isActive: true,
      },
      {
        uomCode: 'DOZ',
        uomName: 'Dozen',
        uomType: UOMType.QUANTITY,
        symbol: 'doz',
        description: 'Group of twelve items',
        allowFractional: false,
        decimalPlaces: 0,
        conversionFactor: 12, // 1 dozen = 12 pieces
        isActive: true,
      },
    ];

    for (const uom of uoms) {
      try {
        const existing = await this.uomRepository.findOne({
          where: { uomCode: uom.uomCode },
        });
        if (!existing) {
          await this.uomRepository.save(uom);
          this.logger.log(`Created UOM: ${uom.uomName} (${uom.uomCode})`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed UOM ${uom.uomName}: ${error.message}`);
      }
    }

    this.logger.log('Units of measure seeding completed');
  }
}
