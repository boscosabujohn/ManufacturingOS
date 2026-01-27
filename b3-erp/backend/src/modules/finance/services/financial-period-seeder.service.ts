import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FinancialYear,
  FinancialPeriod,
  PeriodType,
  PeriodStatus,
} from '../entities/financial-period.entity';

interface FinancialYearSeed {
  yearCode: string;
  yearName: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  status: PeriodStatus;
}

const FINANCIAL_YEARS: FinancialYearSeed[] = [
  {
    yearCode: 'FY2024-25',
    yearName: 'Financial Year 2024-2025',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2025-03-31'),
    isCurrent: false,
    status: PeriodStatus.OPEN,
  },
  {
    yearCode: 'FY2025-26',
    yearName: 'Financial Year 2025-2026',
    startDate: new Date('2025-04-01'),
    endDate: new Date('2026-03-31'),
    isCurrent: true, // Current FY is ACTIVE
    status: PeriodStatus.OPEN,
  },
];

const MONTH_NAMES = [
  'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December', 'January', 'February', 'March'
];

@Injectable()
export class FinancialPeriodSeederService implements OnModuleInit {
  private readonly logger = new Logger(FinancialPeriodSeederService.name);

  constructor(
    @InjectRepository(FinancialYear)
    private readonly financialYearRepository: Repository<FinancialYear>,
    @InjectRepository(FinancialPeriod)
    private readonly financialPeriodRepository: Repository<FinancialPeriod>,
  ) {}

  /**
   * Automatically seeds financial periods on module initialization
   * This is idempotent - only creates periods if none exist
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('FinancialPeriodSeederService initializing...');
    try {
      const existingCount = await this.financialYearRepository.count();
      if (existingCount === 0) {
        this.logger.log('No financial years found. Seeding default financial periods...');
        await this.seed();
      } else {
        this.logger.log(`Financial years already has ${existingCount} records. Skipping auto-seed.`);
      }
    } catch (error) {
      this.logger.error(`Failed to auto-seed financial periods: ${error.message}`);
    }
  }

  /**
   * Seeds the database with default financial years and periods
   * This method is idempotent - it will only create records that don't exist
   */
  async seed(): Promise<{
    yearsCreated: number;
    periodsCreated: number;
    skipped: number;
    errors: number;
  }> {
    this.logger.log('Starting Financial Period seeding process...');

    const result = {
      yearsCreated: 0,
      periodsCreated: 0,
      skipped: 0,
      errors: 0,
    };

    try {
      for (const fyData of FINANCIAL_YEARS) {
        try {
          // Check if financial year already exists
          const existingYear = await this.financialYearRepository.findOne({
            where: { yearCode: fyData.yearCode },
          });

          if (existingYear) {
            this.logger.debug(`Financial year ${fyData.yearCode} already exists. Skipping...`);
            result.skipped++;
            continue;
          }

          // Create financial year
          const financialYear = this.financialYearRepository.create({
            yearCode: fyData.yearCode,
            yearName: fyData.yearName,
            startDate: fyData.startDate,
            endDate: fyData.endDate,
            isCurrent: fyData.isCurrent,
            status: fyData.status,
            description: `Indian Financial Year from April to March`,
            createdBy: 'SYSTEM',
          });

          const savedYear = await this.financialYearRepository.save(financialYear);
          result.yearsCreated++;
          this.logger.debug(`Created financial year: ${fyData.yearCode}`);

          // Create monthly periods for this financial year
          const periodsCreated = await this.createMonthlyPeriods(savedYear, fyData);
          result.periodsCreated += periodsCreated;

        } catch (error) {
          this.logger.error(`Error creating financial year ${fyData.yearCode}: ${error.message}`);
          result.errors++;
        }
      }

      this.logger.log(
        `Financial Period seeding completed. Years Created: ${result.yearsCreated}, Periods Created: ${result.periodsCreated}, Skipped: ${result.skipped}, Errors: ${result.errors}`,
      );
    } catch (error) {
      this.logger.error(`Financial Period seeding failed: ${error.message}`);
      throw error;
    }

    return result;
  }

  /**
   * Creates monthly periods for a financial year
   */
  private async createMonthlyPeriods(
    financialYear: FinancialYear,
    fyData: FinancialYearSeed,
  ): Promise<number> {
    let periodsCreated = 0;
    const currentDate = new Date();
    const startYear = fyData.startDate.getFullYear();

    for (let i = 0; i < 12; i++) {
      // Calculate the month (April = 3 in 0-indexed, then May = 4, etc.)
      const monthIndex = (3 + i) % 12; // 3=April, 4=May, ... 11=December, 0=January, 1=February, 2=March
      const year = monthIndex >= 3 ? startYear : startYear + 1; // April-Dec = startYear, Jan-Mar = startYear+1

      const periodNumber = i + 1; // 1-12
      const periodCode = `${financialYear.yearCode}-P${String(periodNumber).padStart(2, '0')}`;
      const periodName = `${MONTH_NAMES[i]} ${year}`;

      // Calculate start and end dates for the month
      const startDate = new Date(year, monthIndex, 1);
      const endDate = new Date(year, monthIndex + 1, 0); // Last day of month

      // Determine if this is the current period
      const isCurrent = fyData.isCurrent &&
        currentDate >= startDate &&
        currentDate <= endDate;

      try {
        // Check if period already exists
        const existingPeriod = await this.financialPeriodRepository.findOne({
          where: { periodCode },
        });

        if (existingPeriod) {
          this.logger.debug(`Period ${periodCode} already exists. Skipping...`);
          continue;
        }

        const period = this.financialPeriodRepository.create({
          financialYearId: financialYear.id,
          periodCode,
          periodName,
          periodType: PeriodType.MONTH,
          periodNumber,
          startDate,
          endDate,
          status: PeriodStatus.OPEN,
          isCurrent,
          description: `Monthly accounting period for ${periodName}`,
          createdBy: 'SYSTEM',
        });

        await this.financialPeriodRepository.save(period);
        periodsCreated++;
        this.logger.debug(`Created period: ${periodCode} - ${periodName}`);
      } catch (error) {
        this.logger.error(`Error creating period ${periodCode}: ${error.message}`);
      }
    }

    return periodsCreated;
  }

  /**
   * Gets statistics about the seeded financial periods
   */
  async getStats(): Promise<{
    totalYears: number;
    totalPeriods: number;
    currentYear: string | null;
    currentPeriod: string | null;
  }> {
    const totalYears = await this.financialYearRepository.count();
    const totalPeriods = await this.financialPeriodRepository.count();

    const currentYear = await this.financialYearRepository.findOne({
      where: { isCurrent: true },
    });

    const currentPeriod = await this.financialPeriodRepository.findOne({
      where: { isCurrent: true },
    });

    return {
      totalYears,
      totalPeriods,
      currentYear: currentYear?.yearCode || null,
      currentPeriod: currentPeriod?.periodCode || null,
    };
  }
}
