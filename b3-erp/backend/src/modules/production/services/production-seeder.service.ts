import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkCenter } from '../entities/work-center.entity';
import { Operation } from '../entities/operation.entity';
import {
  DEFAULT_WORK_CENTERS,
  DEFAULT_OPERATIONS,
  DefaultWorkCenter,
  DefaultOperation,
} from '../data/default-production-masters.data';

@Injectable()
export class ProductionSeederService implements OnModuleInit {
  private readonly logger = new Logger(ProductionSeederService.name);

  constructor(
    @InjectRepository(WorkCenter)
    private readonly workCenterRepository: Repository<WorkCenter>,
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedAll();
  }

  async seedAll(): Promise<{
    workCenters: { created: number; skipped: number; errors: number };
    operations: { created: number; skipped: number; errors: number };
  }> {
    this.logger.log('Starting Production module seeding...');

    const workCentersResult = await this.seedWorkCenters();
    const operationsResult = await this.seedOperations();

    this.logger.log('Production module seeding completed');

    return {
      workCenters: workCentersResult,
      operations: operationsResult,
    };
  }

  async seedWorkCenters(): Promise<{ created: number; skipped: number; errors: number }> {
    this.logger.log('Seeding work centers...');

    const result = { created: 0, skipped: 0, errors: 0 };

    for (const defaultWC of DEFAULT_WORK_CENTERS) {
      try {
        const existing = await this.workCenterRepository.findOne({
          where: { workCenterCode: defaultWC.workCenterCode },
        });

        if (existing) {
          result.skipped++;
          continue;
        }

        const workCenter = this.workCenterRepository.create({
          workCenterCode: defaultWC.workCenterCode,
          workCenterName: defaultWC.workCenterName,
          description: defaultWC.description,
          workCenterType: defaultWC.workCenterType,
          status: defaultWC.status,
          department: defaultWC.department,
          plant: defaultWC.plant,
          building: defaultWC.building,
          area: defaultWC.area,
          numberOfStations: defaultWC.numberOfStations,
          workingHoursPerDay: defaultWC.workingHoursPerDay,
          workingDaysPerWeek: defaultWC.workingDaysPerWeek,
          hourlyOperatingCost: defaultWC.hourlyOperatingCost,
          laborCostPerHour: defaultWC.laborCostPerHour,
          overheadCostPerHour: defaultWC.overheadCostPerHour,
          setupCost: defaultWC.setupCost,
          totalCostPerHour:
            defaultWC.hourlyOperatingCost +
            defaultWC.laborCostPerHour +
            defaultWC.overheadCostPerHour,
          efficiency: defaultWC.efficiency,
          requiredOperators: defaultWC.requiredOperators,
          requiredSkills: defaultWC.requiredSkills,
          requiresQualityCheck: defaultWC.requiresQualityCheck,
          requiresPreventiveMaintenance: defaultWC.requiresPreventiveMaintenance,
          maintenanceIntervalDays: defaultWC.maintenanceIntervalDays,
          isActive: defaultWC.isActive,
          isCritical: defaultWC.isCritical,
          createdBy: 'SYSTEM_SEEDER',
        });

        await this.workCenterRepository.save(workCenter);
        result.created++;

        this.logger.debug(`Created work center: ${defaultWC.workCenterName}`);
      } catch (error) {
        this.logger.error(
          `Error creating work center ${defaultWC.workCenterCode}: ${error.message}`,
        );
        result.errors++;
      }
    }

    this.logger.log(
      `Work centers seeding completed. Created: ${result.created}, Skipped: ${result.skipped}, Errors: ${result.errors}`,
    );
    return result;
  }

  async seedOperations(): Promise<{ created: number; skipped: number; errors: number }> {
    this.logger.log('Seeding operations...');

    const result = { created: 0, skipped: 0, errors: 0 };

    // Get work center mappings
    const workCenters = await this.workCenterRepository.find();
    const workCenterMap = new Map<string, { id: string; name: string }>();
    for (const wc of workCenters) {
      workCenterMap.set(wc.workCenterCode, {
        id: wc.id,
        name: wc.workCenterName,
      });
    }

    for (const defaultOp of DEFAULT_OPERATIONS) {
      try {
        const existing = await this.operationRepository.findOne({
          where: { operationCode: defaultOp.operationCode },
        });

        if (existing) {
          result.skipped++;
          continue;
        }

        // Resolve work center
        let defaultWorkCenterId: string | undefined;
        let defaultWorkCenterName: string | undefined;
        if (defaultOp.defaultWorkCenterCode) {
          const wc = workCenterMap.get(defaultOp.defaultWorkCenterCode);
          if (wc) {
            defaultWorkCenterId = wc.id;
            defaultWorkCenterName = wc.name;
          }
        }

        const totalTimePerUnit =
          defaultOp.setupTimeMinutes / defaultOp.batchSize +
          defaultOp.runTimePerUnitMinutes +
          defaultOp.teardownTimeMinutes / defaultOp.batchSize;

        const costPerUnit =
          (defaultOp.hourlyRate + defaultOp.overheadRate) * (totalTimePerUnit / 60);

        const operation = this.operationRepository.create({
          operationCode: defaultOp.operationCode,
          operationName: defaultOp.operationName,
          description: defaultOp.description,
          operationType: defaultOp.operationType,
          status: defaultOp.status,
          defaultWorkCenterId: defaultWorkCenterId,
          defaultWorkCenterCode: defaultOp.defaultWorkCenterCode,
          defaultWorkCenterName: defaultWorkCenterName,
          setupTimeMinutes: defaultOp.setupTimeMinutes,
          runTimePerUnitMinutes: defaultOp.runTimePerUnitMinutes,
          teardownTimeMinutes: defaultOp.teardownTimeMinutes,
          totalTimePerUnitMinutes: totalTimePerUnit,
          batchSize: defaultOp.batchSize,
          hourlyRate: defaultOp.hourlyRate,
          overheadRate: defaultOp.overheadRate,
          costPerUnit: costPerUnit,
          totalCostPerUnit: costPerUnit,
          numberOfOperators: defaultOp.numberOfOperators,
          numberOfMachines: defaultOp.numberOfMachines,
          requiresQualityInspection: defaultOp.requiresQualityInspection,
          requiresSupervisorApproval: defaultOp.requiresSupervisorApproval,
          requiredSkills: defaultOp.requiredSkills,
          safetyEquipment: defaultOp.safetyEquipment,
          workInstructions: defaultOp.workInstructions,
          isActive: defaultOp.isActive,
          isCritical: defaultOp.isCritical,
          createdBy: 'SYSTEM_SEEDER',
        });

        await this.operationRepository.save(operation);
        result.created++;

        this.logger.debug(`Created operation: ${defaultOp.operationName}`);
      } catch (error) {
        this.logger.error(
          `Error creating operation ${defaultOp.operationCode}: ${error.message}`,
        );
        result.errors++;
      }
    }

    this.logger.log(
      `Operations seeding completed. Created: ${result.created}, Skipped: ${result.skipped}, Errors: ${result.errors}`,
    );
    return result;
  }

  getStats(): {
    workCenters: number;
    operations: number;
  } {
    return {
      workCenters: DEFAULT_WORK_CENTERS.length,
      operations: DEFAULT_OPERATIONS.length,
    };
  }
}
