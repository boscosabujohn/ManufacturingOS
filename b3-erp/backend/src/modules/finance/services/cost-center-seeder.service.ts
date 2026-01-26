import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CostCenter } from '../entities/cost-accounting.entity';

interface CostCenterSeed {
  costCenterCode: string;
  costCenterName: string;
  department: string;
  description: string;
  isProfitCenter: boolean;
  location?: string;
}

const DEFAULT_COST_CENTERS: CostCenterSeed[] = [
  {
    costCenterCode: 'CC-ADMIN',
    costCenterName: 'Administration',
    department: 'Administration',
    description: 'Administrative overhead cost center - includes general administration, HR, finance, and legal departments',
    isProfitCenter: false,
    location: 'Head Office',
  },
  {
    costCenterCode: 'CC-SALES',
    costCenterName: 'Sales & Marketing',
    department: 'Sales',
    description: 'Sales and Marketing cost center - includes sales team, marketing, customer relations, and business development',
    isProfitCenter: true,
    location: 'Head Office',
  },
  {
    costCenterCode: 'CC-PROD',
    costCenterName: 'Production',
    department: 'Production',
    description: 'Production cost center - includes manufacturing, assembly, and production operations',
    isProfitCenter: true,
    location: 'Factory',
  },
  {
    costCenterCode: 'CC-QC',
    costCenterName: 'Quality Control',
    department: 'Quality',
    description: 'Quality Control cost center - includes quality assurance, testing, and inspection activities',
    isProfitCenter: false,
    location: 'Factory',
  },
  {
    costCenterCode: 'CC-MAINT',
    costCenterName: 'Maintenance',
    department: 'Maintenance',
    description: 'Maintenance cost center - includes equipment maintenance, facility upkeep, and repairs',
    isProfitCenter: false,
    location: 'Factory',
  },
  {
    costCenterCode: 'CC-IT',
    costCenterName: 'Information Technology',
    department: 'IT',
    description: 'IT cost center - includes software development, infrastructure, support, and IT operations',
    isProfitCenter: false,
    location: 'Head Office',
  },
  {
    costCenterCode: 'CC-HR',
    costCenterName: 'Human Resources',
    department: 'HR',
    description: 'Human Resources cost center - includes recruitment, training, payroll, and employee welfare',
    isProfitCenter: false,
    location: 'Head Office',
  },
  {
    costCenterCode: 'CC-FIN',
    costCenterName: 'Finance & Accounts',
    department: 'Finance',
    description: 'Finance cost center - includes accounting, treasury, and financial planning',
    isProfitCenter: false,
    location: 'Head Office',
  },
  {
    costCenterCode: 'CC-PROC',
    costCenterName: 'Procurement',
    department: 'Procurement',
    description: 'Procurement cost center - includes purchasing, vendor management, and supply chain',
    isProfitCenter: false,
    location: 'Head Office',
  },
  {
    costCenterCode: 'CC-WH',
    costCenterName: 'Warehouse',
    department: 'Warehouse',
    description: 'Warehouse cost center - includes inventory storage, logistics, and material handling',
    isProfitCenter: false,
    location: 'Warehouse',
  },
  {
    costCenterCode: 'CC-RND',
    costCenterName: 'Research & Development',
    department: 'R&D',
    description: 'R&D cost center - includes product development, research, and innovation activities',
    isProfitCenter: false,
    location: 'Head Office',
  },
];

@Injectable()
export class CostCenterSeederService implements OnModuleInit {
  private readonly logger = new Logger(CostCenterSeederService.name);

  constructor(
    @InjectRepository(CostCenter)
    private readonly costCenterRepository: Repository<CostCenter>,
  ) {}

  /**
   * Automatically seeds cost centers on module initialization
   * This is idempotent - only creates records that don't exist
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('CostCenterSeederService initializing...');
    try {
      const existingCount = await this.costCenterRepository.count();
      if (existingCount === 0) {
        this.logger.log('No cost centers found. Seeding default cost centers...');
        await this.seed();
      } else {
        this.logger.log(`Cost centers already has ${existingCount} records. Skipping auto-seed.`);
      }
    } catch (error) {
      this.logger.error(`Failed to auto-seed cost centers: ${error.message}`);
    }
  }

  /**
   * Seeds the database with default cost centers
   * This method is idempotent - it will only create records that don't exist
   */
  async seed(): Promise<{
    created: number;
    skipped: number;
    errors: number;
  }> {
    this.logger.log('Starting Cost Center seeding process...');

    const result = {
      created: 0,
      skipped: 0,
      errors: 0,
    };

    try {
      for (const ccData of DEFAULT_COST_CENTERS) {
        try {
          // Check if cost center code already exists
          const existingCC = await this.costCenterRepository.findOne({
            where: { costCenterCode: ccData.costCenterCode },
          });

          if (existingCC) {
            this.logger.debug(`Cost center ${ccData.costCenterCode} already exists. Skipping...`);
            result.skipped++;
            continue;
          }

          // Create cost center
          const costCenter = this.costCenterRepository.create({
            costCenterCode: ccData.costCenterCode,
            costCenterName: ccData.costCenterName,
            department: ccData.department,
            description: ccData.description,
            isProfitCenter: ccData.isProfitCenter,
            location: ccData.location,
            isActive: true,
            createdBy: 'SYSTEM',
          });

          await this.costCenterRepository.save(costCenter);
          result.created++;
          this.logger.debug(`Created cost center: ${ccData.costCenterCode} - ${ccData.costCenterName}`);
        } catch (error) {
          this.logger.error(`Error creating cost center ${ccData.costCenterCode}: ${error.message}`);
          result.errors++;
        }
      }

      this.logger.log(
        `Cost Center seeding completed. Created: ${result.created}, Skipped: ${result.skipped}, Errors: ${result.errors}`,
      );
    } catch (error) {
      this.logger.error(`Cost Center seeding failed: ${error.message}`);
      throw error;
    }

    return result;
  }

  /**
   * Seeds only missing cost centers
   */
  async seedMissing(): Promise<{
    created: number;
    skipped: number;
    errors: number;
  }> {
    this.logger.log('Seeding missing Cost Centers...');

    const result = {
      created: 0,
      skipped: 0,
      errors: 0,
    };

    // Get all existing cost center codes
    const existingCCs = await this.costCenterRepository.find({
      select: ['costCenterCode'],
    });
    const existingCodes = new Set(existingCCs.map((cc) => cc.costCenterCode));

    for (const ccData of DEFAULT_COST_CENTERS) {
      if (existingCodes.has(ccData.costCenterCode)) {
        result.skipped++;
        continue;
      }

      try {
        const costCenter = this.costCenterRepository.create({
          costCenterCode: ccData.costCenterCode,
          costCenterName: ccData.costCenterName,
          department: ccData.department,
          description: ccData.description,
          isProfitCenter: ccData.isProfitCenter,
          location: ccData.location,
          isActive: true,
          createdBy: 'SYSTEM',
        });

        await this.costCenterRepository.save(costCenter);
        result.created++;
        this.logger.debug(`Created missing cost center: ${ccData.costCenterCode}`);
      } catch (error) {
        this.logger.error(`Error creating cost center ${ccData.costCenterCode}: ${error.message}`);
        result.errors++;
      }
    }

    this.logger.log(
      `Missing Cost Center seeding completed. Created: ${result.created}, Skipped: ${result.skipped}, Errors: ${result.errors}`,
    );

    return result;
  }

  /**
   * Gets statistics about the seeded cost centers
   */
  async getStats(): Promise<{
    total: number;
    profitCenters: number;
    costCenters: number;
    byDepartment: Record<string, number>;
    byLocation: Record<string, number>;
  }> {
    const costCenters = await this.costCenterRepository.find();

    const byDepartment: Record<string, number> = {};
    const byLocation: Record<string, number> = {};
    let profitCenters = 0;

    costCenters.forEach((cc) => {
      if (cc.isProfitCenter) profitCenters++;
      if (cc.department) {
        byDepartment[cc.department] = (byDepartment[cc.department] || 0) + 1;
      }
      if (cc.location) {
        byLocation[cc.location] = (byLocation[cc.location] || 0) + 1;
      }
    });

    return {
      total: costCenters.length,
      profitCenters,
      costCenters: costCenters.length - profitCenters,
      byDepartment,
      byLocation,
    };
  }

  /**
   * Gets cost center by code
   */
  async getCostCenterByCode(costCenterCode: string): Promise<CostCenter | null> {
    return this.costCenterRepository.findOne({
      where: { costCenterCode, isActive: true },
    });
  }

  /**
   * Gets all cost centers by department
   */
  async getCostCentersByDepartment(department: string): Promise<CostCenter[]> {
    return this.costCenterRepository.find({
      where: { department, isActive: true },
      order: { costCenterCode: 'ASC' },
    });
  }

  /**
   * Gets all profit centers
   */
  async getProfitCenters(): Promise<CostCenter[]> {
    return this.costCenterRepository.find({
      where: { isProfitCenter: true, isActive: true },
      order: { costCenterCode: 'ASC' },
    });
  }
}
