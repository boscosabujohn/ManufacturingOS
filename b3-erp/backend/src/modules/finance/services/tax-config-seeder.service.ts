import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxMaster, TaxType, TaxCategory } from '../entities/tax.entity';

interface TaxSeed {
  taxCode: string;
  taxName: string;
  taxType: TaxType;
  taxCategory: TaxCategory;
  taxRate: number;
  description: string;
}

// GST (Intrastate - combined rate)
const GST_TAXES: TaxSeed[] = [
  {
    taxCode: 'GST_0',
    taxName: 'GST @ 0%',
    taxType: TaxType.GST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 0,
    description: 'Goods and Services Tax at 0% (Exempted/Nil rated)',
  },
  {
    taxCode: 'GST_5',
    taxName: 'GST @ 5%',
    taxType: TaxType.GST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 5,
    description: 'Goods and Services Tax at 5%',
  },
  {
    taxCode: 'GST_12',
    taxName: 'GST @ 12%',
    taxType: TaxType.GST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 12,
    description: 'Goods and Services Tax at 12%',
  },
  {
    taxCode: 'GST_18',
    taxName: 'GST @ 18%',
    taxType: TaxType.GST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 18,
    description: 'Goods and Services Tax at 18%',
  },
  {
    taxCode: 'GST_28',
    taxName: 'GST @ 28%',
    taxType: TaxType.GST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 28,
    description: 'Goods and Services Tax at 28%',
  },
];

// IGST (Interstate)
const IGST_TAXES: TaxSeed[] = [
  {
    taxCode: 'IGST_0',
    taxName: 'IGST @ 0%',
    taxType: TaxType.IGST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 0,
    description: 'Integrated GST at 0% (Interstate - Exempted/Nil rated)',
  },
  {
    taxCode: 'IGST_5',
    taxName: 'IGST @ 5%',
    taxType: TaxType.IGST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 5,
    description: 'Integrated GST at 5% (Interstate)',
  },
  {
    taxCode: 'IGST_12',
    taxName: 'IGST @ 12%',
    taxType: TaxType.IGST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 12,
    description: 'Integrated GST at 12% (Interstate)',
  },
  {
    taxCode: 'IGST_18',
    taxName: 'IGST @ 18%',
    taxType: TaxType.IGST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 18,
    description: 'Integrated GST at 18% (Interstate)',
  },
  {
    taxCode: 'IGST_28',
    taxName: 'IGST @ 28%',
    taxType: TaxType.IGST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 28,
    description: 'Integrated GST at 28% (Interstate)',
  },
];

// CGST (Central GST - Intrastate)
const CGST_TAXES: TaxSeed[] = [
  {
    taxCode: 'CGST_0',
    taxName: 'CGST @ 0%',
    taxType: TaxType.CGST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 0,
    description: 'Central GST at 0% (Intrastate - Exempted/Nil rated)',
  },
  {
    taxCode: 'CGST_2.5',
    taxName: 'CGST @ 2.5%',
    taxType: TaxType.CGST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 2.5,
    description: 'Central GST at 2.5% (Intrastate - half of 5% GST)',
  },
  {
    taxCode: 'CGST_6',
    taxName: 'CGST @ 6%',
    taxType: TaxType.CGST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 6,
    description: 'Central GST at 6% (Intrastate - half of 12% GST)',
  },
  {
    taxCode: 'CGST_9',
    taxName: 'CGST @ 9%',
    taxType: TaxType.CGST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 9,
    description: 'Central GST at 9% (Intrastate - half of 18% GST)',
  },
  {
    taxCode: 'CGST_14',
    taxName: 'CGST @ 14%',
    taxType: TaxType.CGST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 14,
    description: 'Central GST at 14% (Intrastate - half of 28% GST)',
  },
];

// SGST (State GST - Intrastate)
const SGST_TAXES: TaxSeed[] = [
  {
    taxCode: 'SGST_0',
    taxName: 'SGST @ 0%',
    taxType: TaxType.SGST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 0,
    description: 'State GST at 0% (Intrastate - Exempted/Nil rated)',
  },
  {
    taxCode: 'SGST_2.5',
    taxName: 'SGST @ 2.5%',
    taxType: TaxType.SGST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 2.5,
    description: 'State GST at 2.5% (Intrastate - half of 5% GST)',
  },
  {
    taxCode: 'SGST_6',
    taxName: 'SGST @ 6%',
    taxType: TaxType.SGST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 6,
    description: 'State GST at 6% (Intrastate - half of 12% GST)',
  },
  {
    taxCode: 'SGST_9',
    taxName: 'SGST @ 9%',
    taxType: TaxType.SGST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 9,
    description: 'State GST at 9% (Intrastate - half of 18% GST)',
  },
  {
    taxCode: 'SGST_14',
    taxName: 'SGST @ 14%',
    taxType: TaxType.SGST,
    taxCategory: TaxCategory.OUTPUT_TAX,
    taxRate: 14,
    description: 'State GST at 14% (Intrastate - half of 28% GST)',
  },
];

// TDS (Tax Deducted at Source)
const TDS_TAXES: TaxSeed[] = [
  {
    taxCode: 'TDS_194C',
    taxName: 'TDS u/s 194C @ 2%',
    taxType: TaxType.TDS,
    taxCategory: TaxCategory.WITHHOLDING_TAX,
    taxRate: 2,
    description: 'TDS on payment to contractors u/s 194C (2% for companies, 1% for individuals)',
  },
  {
    taxCode: 'TDS_194C_IND',
    taxName: 'TDS u/s 194C @ 1%',
    taxType: TaxType.TDS,
    taxCategory: TaxCategory.WITHHOLDING_TAX,
    taxRate: 1,
    description: 'TDS on payment to individual/HUF contractors u/s 194C',
  },
  {
    taxCode: 'TDS_194J',
    taxName: 'TDS u/s 194J @ 10%',
    taxType: TaxType.TDS,
    taxCategory: TaxCategory.WITHHOLDING_TAX,
    taxRate: 10,
    description: 'TDS on professional/technical services u/s 194J',
  },
  {
    taxCode: 'TDS_194J_2',
    taxName: 'TDS u/s 194J @ 2%',
    taxType: TaxType.TDS,
    taxCategory: TaxCategory.WITHHOLDING_TAX,
    taxRate: 2,
    description: 'TDS on technical services/royalty for sale of software u/s 194J',
  },
  {
    taxCode: 'TDS_194A',
    taxName: 'TDS u/s 194A @ 10%',
    taxType: TaxType.TDS,
    taxCategory: TaxCategory.WITHHOLDING_TAX,
    taxRate: 10,
    description: 'TDS on interest other than securities u/s 194A',
  },
  {
    taxCode: 'TDS_194H',
    taxName: 'TDS u/s 194H @ 5%',
    taxType: TaxType.TDS,
    taxCategory: TaxCategory.WITHHOLDING_TAX,
    taxRate: 5,
    description: 'TDS on commission or brokerage u/s 194H',
  },
  {
    taxCode: 'TDS_194I_RENT',
    taxName: 'TDS u/s 194I @ 10%',
    taxType: TaxType.TDS,
    taxCategory: TaxCategory.WITHHOLDING_TAX,
    taxRate: 10,
    description: 'TDS on rent of building/land u/s 194I',
  },
  {
    taxCode: 'TDS_194I_PLANT',
    taxName: 'TDS u/s 194I @ 2%',
    taxType: TaxType.TDS,
    taxCategory: TaxCategory.WITHHOLDING_TAX,
    taxRate: 2,
    description: 'TDS on rent of plant/machinery/equipment u/s 194I',
  },
];

// All taxes combined
const ALL_TAXES: TaxSeed[] = [
  ...GST_TAXES,
  ...IGST_TAXES,
  ...CGST_TAXES,
  ...SGST_TAXES,
  ...TDS_TAXES,
];

@Injectable()
export class TaxConfigSeederService implements OnModuleInit {
  private readonly logger = new Logger(TaxConfigSeederService.name);

  constructor(
    @InjectRepository(TaxMaster)
    private readonly taxMasterRepository: Repository<TaxMaster>,
  ) {}

  /**
   * Automatically seeds tax configurations on module initialization
   * This is idempotent - only creates records that don't exist
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('TaxConfigSeederService initializing...');
    try {
      const existingCount = await this.taxMasterRepository.count();
      if (existingCount === 0) {
        this.logger.log('No tax configurations found. Seeding default Indian taxes...');
        await this.seed();
      } else {
        this.logger.log(`Tax configurations already has ${existingCount} records. Skipping auto-seed.`);
      }
    } catch (error) {
      this.logger.error(`Failed to auto-seed tax configurations: ${error.message}`);
    }
  }

  /**
   * Seeds the database with default Indian tax configurations
   * This method is idempotent - it will only create records that don't exist
   */
  async seed(): Promise<{
    created: number;
    skipped: number;
    errors: number;
  }> {
    this.logger.log('Starting Tax Configuration seeding process...');

    const result = {
      created: 0,
      skipped: 0,
      errors: 0,
    };

    const effectiveFrom = new Date('2017-07-01'); // GST implementation date in India

    try {
      for (const taxData of ALL_TAXES) {
        try {
          // Check if tax code already exists
          const existingTax = await this.taxMasterRepository.findOne({
            where: { taxCode: taxData.taxCode },
          });

          if (existingTax) {
            this.logger.debug(`Tax code ${taxData.taxCode} already exists. Skipping...`);
            result.skipped++;
            continue;
          }

          // Create tax master entry
          const taxMaster = this.taxMasterRepository.create({
            taxCode: taxData.taxCode,
            taxName: taxData.taxName,
            taxType: taxData.taxType,
            taxCategory: taxData.taxCategory,
            taxRate: taxData.taxRate,
            effectiveFrom,
            description: taxData.description,
            isActive: true,
            createdBy: 'SYSTEM',
          } as Partial<TaxMaster>);

          await this.taxMasterRepository.save(taxMaster);
          result.created++;
          this.logger.debug(`Created tax: ${taxData.taxCode} - ${taxData.taxName}`);
        } catch (error) {
          this.logger.error(`Error creating tax ${taxData.taxCode}: ${error.message}`);
          result.errors++;
        }
      }

      this.logger.log(
        `Tax Configuration seeding completed. Created: ${result.created}, Skipped: ${result.skipped}, Errors: ${result.errors}`,
      );
    } catch (error) {
      this.logger.error(`Tax Configuration seeding failed: ${error.message}`);
      throw error;
    }

    return result;
  }

  /**
   * Seeds only missing tax configurations
   */
  async seedMissing(): Promise<{
    created: number;
    skipped: number;
    errors: number;
  }> {
    this.logger.log('Seeding missing Tax Configurations...');

    const result = {
      created: 0,
      skipped: 0,
      errors: 0,
    };

    const effectiveFrom = new Date('2017-07-01');

    // Get all existing tax codes
    const existingTaxes = await this.taxMasterRepository.find({
      select: ['taxCode'],
    });
    const existingCodes = new Set(existingTaxes.map((t) => t.taxCode));

    for (const taxData of ALL_TAXES) {
      if (existingCodes.has(taxData.taxCode)) {
        result.skipped++;
        continue;
      }

      try {
        const taxMaster = this.taxMasterRepository.create({
          taxCode: taxData.taxCode,
          taxName: taxData.taxName,
          taxType: taxData.taxType,
          taxCategory: taxData.taxCategory,
          taxRate: taxData.taxRate,
          effectiveFrom,
          description: taxData.description,
          isActive: true,
          createdBy: 'SYSTEM',
        } as Partial<TaxMaster>);

        await this.taxMasterRepository.save(taxMaster);
        result.created++;
        this.logger.debug(`Created missing tax: ${taxData.taxCode}`);
      } catch (error) {
        this.logger.error(`Error creating tax ${taxData.taxCode}: ${error.message}`);
        result.errors++;
      }
    }

    this.logger.log(
      `Missing Tax Configuration seeding completed. Created: ${result.created}, Skipped: ${result.skipped}, Errors: ${result.errors}`,
    );

    return result;
  }

  /**
   * Gets statistics about the seeded tax configurations
   */
  async getStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
  }> {
    const taxes = await this.taxMasterRepository.find();

    const byType: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    taxes.forEach((tax) => {
      byType[tax.taxType] = (byType[tax.taxType] || 0) + 1;
      byCategory[tax.taxCategory] = (byCategory[tax.taxCategory] || 0) + 1;
    });

    return {
      total: taxes.length,
      byType,
      byCategory,
    };
  }

  /**
   * Gets tax by code
   */
  async getTaxByCode(taxCode: string): Promise<TaxMaster | null> {
    return this.taxMasterRepository.findOne({
      where: { taxCode, isActive: true },
    });
  }

  /**
   * Gets all taxes by type
   */
  async getTaxesByType(taxType: TaxType): Promise<TaxMaster[]> {
    return this.taxMasterRepository.find({
      where: { taxType, isActive: true },
      order: { taxRate: 'ASC' },
    });
  }
}
