import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkCenter, WorkCenterType, WorkCenterStatus } from '../entities/work-center.entity';

interface WorkCenterSeedData {
  workCenterCode: string;
  workCenterName: string;
  description: string;
  workCenterType: WorkCenterType;
  workingHoursPerDay: number;
  availableCapacityHoursPerDay: number;
  hourlyOperatingCost: number;
  totalCostPerHour: number;
  department: string;
}

@Injectable()
export class WorkCenterSeederService implements OnModuleInit {
  private readonly logger = new Logger(WorkCenterSeederService.name);

  private readonly workCenters: WorkCenterSeedData[] = [
    {
      workCenterCode: 'WC-CUT',
      workCenterName: 'Cutting Section',
      description: 'Metal cutting and shearing operations',
      workCenterType: WorkCenterType.MACHINE,
      workingHoursPerDay: 8,
      availableCapacityHoursPerDay: 8,
      hourlyOperatingCost: 500,
      totalCostPerHour: 500,
      department: 'Production',
    },
    {
      workCenterCode: 'WC-WELD',
      workCenterName: 'Welding Section',
      description: 'Welding and joining operations',
      workCenterType: WorkCenterType.MACHINE,
      workingHoursPerDay: 8,
      availableCapacityHoursPerDay: 8,
      hourlyOperatingCost: 600,
      totalCostPerHour: 600,
      department: 'Production',
    },
    {
      workCenterCode: 'WC-BEND',
      workCenterName: 'Bending Section',
      description: 'Metal bending and forming operations',
      workCenterType: WorkCenterType.MACHINE,
      workingHoursPerDay: 8,
      availableCapacityHoursPerDay: 8,
      hourlyOperatingCost: 450,
      totalCostPerHour: 450,
      department: 'Production',
    },
    {
      workCenterCode: 'WC-ASSY',
      workCenterName: 'Assembly Section',
      description: 'Product assembly and sub-assembly operations',
      workCenterType: WorkCenterType.ASSEMBLY_LINE,
      workingHoursPerDay: 8,
      availableCapacityHoursPerDay: 8,
      hourlyOperatingCost: 450,
      totalCostPerHour: 450,
      department: 'Production',
    },
    {
      workCenterCode: 'WC-PAINT',
      workCenterName: 'Painting Section',
      description: 'Surface painting and coating operations',
      workCenterType: WorkCenterType.MACHINE,
      workingHoursPerDay: 8,
      availableCapacityHoursPerDay: 8,
      hourlyOperatingCost: 400,
      totalCostPerHour: 400,
      department: 'Production',
    },
    {
      workCenterCode: 'WC-QC',
      workCenterName: 'Quality Check',
      description: 'Quality inspection and testing operations',
      workCenterType: WorkCenterType.INSPECTION,
      workingHoursPerDay: 8,
      availableCapacityHoursPerDay: 8,
      hourlyOperatingCost: 350,
      totalCostPerHour: 350,
      department: 'Quality',
    },
    {
      workCenterCode: 'WC-PACK',
      workCenterName: 'Packing Section',
      description: 'Product packing and packaging operations',
      workCenterType: WorkCenterType.PACKAGING,
      workingHoursPerDay: 8,
      availableCapacityHoursPerDay: 8,
      hourlyOperatingCost: 300,
      totalCostPerHour: 300,
      department: 'Dispatch',
    },
    {
      workCenterCode: 'WC-CNC',
      workCenterName: 'CNC Machining',
      description: 'CNC machining and precision operations',
      workCenterType: WorkCenterType.MACHINE,
      workingHoursPerDay: 8,
      availableCapacityHoursPerDay: 8,
      hourlyOperatingCost: 800,
      totalCostPerHour: 800,
      department: 'Production',
    },
  ];

  constructor(
    @InjectRepository(WorkCenter)
    private readonly workCenterRepository: Repository<WorkCenter>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seed();
  }

  async seed(): Promise<void> {
    this.logger.log('Starting work center seeding...');

    for (const workCenterData of this.workCenters) {
      try {
        const existingWorkCenter = await this.workCenterRepository.findOne({
          where: { workCenterCode: workCenterData.workCenterCode },
        });

        if (existingWorkCenter) {
          this.logger.debug(
            `Work center ${workCenterData.workCenterCode} already exists, skipping...`,
          );
          continue;
        }

        const workCenter = this.workCenterRepository.create({
          ...workCenterData,
          status: WorkCenterStatus.AVAILABLE,
          isActive: true,
          allowBooking: true,
          numberOfStations: 1,
          workingDaysPerWeek: 5,
          efficiency: 100,
          requiredOperators: 1,
          createdBy: 'system',
        });

        await this.workCenterRepository.save(workCenter);
        this.logger.log(
          `Created work center: ${workCenterData.workCenterCode} - ${workCenterData.workCenterName}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to seed work center ${workCenterData.workCenterCode}: ${error.message}`,
        );
      }
    }

    this.logger.log('Work center seeding completed.');
  }

  async getWorkCenterByCode(code: string): Promise<WorkCenter | null> {
    return this.workCenterRepository.findOne({
      where: { workCenterCode: code },
    });
  }
}
