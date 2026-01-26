import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operation, OperationType, OperationStatus, TimeCalculationMethod } from '../entities/operation.entity';
import { WorkCenter } from '../entities/work-center.entity';

interface OperationSeedData {
  operationCode: string;
  operationName: string;
  description: string;
  operationType: OperationType;
  workCenterCode: string;
  runTimePerUnitMinutes: number;
  setupTimeMinutes: number;
}

@Injectable()
export class OperationSeederService implements OnModuleInit {
  private readonly logger = new Logger(OperationSeederService.name);

  private readonly operations: OperationSeedData[] = [
    {
      operationCode: 'OP-CUT',
      operationName: 'Cutting',
      description: 'Metal cutting operation',
      operationType: OperationType.MACHINING,
      workCenterCode: 'WC-CUT',
      runTimePerUnitMinutes: 30,
      setupTimeMinutes: 10,
    },
    {
      operationCode: 'OP-BEND',
      operationName: 'Bending',
      description: 'Metal bending operation',
      operationType: OperationType.MACHINING,
      workCenterCode: 'WC-BEND',
      runTimePerUnitMinutes: 20,
      setupTimeMinutes: 5,
    },
    {
      operationCode: 'OP-WELD',
      operationName: 'Welding',
      description: 'Welding and joining operation',
      operationType: OperationType.WELDING,
      workCenterCode: 'WC-WELD',
      runTimePerUnitMinutes: 45,
      setupTimeMinutes: 15,
    },
    {
      operationCode: 'OP-GRIND',
      operationName: 'Grinding',
      description: 'Surface grinding operation',
      operationType: OperationType.SURFACE_TREATMENT,
      workCenterCode: 'WC-WELD',
      runTimePerUnitMinutes: 15,
      setupTimeMinutes: 5,
    },
    {
      operationCode: 'OP-ASSY',
      operationName: 'Assembly',
      description: 'Product assembly operation',
      operationType: OperationType.ASSEMBLY,
      workCenterCode: 'WC-ASSY',
      runTimePerUnitMinutes: 60,
      setupTimeMinutes: 10,
    },
    {
      operationCode: 'OP-PAINT',
      operationName: 'Painting',
      description: 'Surface painting operation',
      operationType: OperationType.PAINTING,
      workCenterCode: 'WC-PAINT',
      runTimePerUnitMinutes: 90,
      setupTimeMinutes: 20,
    },
    {
      operationCode: 'OP-DRY',
      operationName: 'Drying',
      description: 'Paint drying operation',
      operationType: OperationType.PAINTING,
      workCenterCode: 'WC-PAINT',
      runTimePerUnitMinutes: 120,
      setupTimeMinutes: 0,
    },
    {
      operationCode: 'OP-INSP',
      operationName: 'Inspection',
      description: 'Quality inspection operation',
      operationType: OperationType.INSPECTION,
      workCenterCode: 'WC-QC',
      runTimePerUnitMinutes: 30,
      setupTimeMinutes: 5,
    },
    {
      operationCode: 'OP-PACK',
      operationName: 'Packing',
      description: 'Product packing operation',
      operationType: OperationType.PACKAGING,
      workCenterCode: 'WC-PACK',
      runTimePerUnitMinutes: 20,
      setupTimeMinutes: 5,
    },
    {
      operationCode: 'OP-CNC',
      operationName: 'CNC Operation',
      description: 'CNC machining operation',
      operationType: OperationType.MACHINING,
      workCenterCode: 'WC-CNC',
      runTimePerUnitMinutes: 60,
      setupTimeMinutes: 30,
    },
  ];

  constructor(
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>,
    @InjectRepository(WorkCenter)
    private readonly workCenterRepository: Repository<WorkCenter>,
  ) {}

  async onModuleInit(): Promise<void> {
    // Delay to ensure work centers are seeded first
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await this.seed();
  }

  async seed(): Promise<void> {
    this.logger.log('Starting operation seeding...');

    for (const operationData of this.operations) {
      try {
        const existingOperation = await this.operationRepository.findOne({
          where: { operationCode: operationData.operationCode },
        });

        if (existingOperation) {
          this.logger.debug(
            `Operation ${operationData.operationCode} already exists, skipping...`,
          );
          continue;
        }

        // Find the work center
        const workCenter = await this.workCenterRepository.findOne({
          where: { workCenterCode: operationData.workCenterCode },
        });

        if (!workCenter) {
          this.logger.warn(
            `Work center ${operationData.workCenterCode} not found for operation ${operationData.operationCode}, skipping...`,
          );
          continue;
        }

        const operation = this.operationRepository.create({
          operationCode: operationData.operationCode,
          operationName: operationData.operationName,
          description: operationData.description,
          operationType: operationData.operationType,
          status: OperationStatus.ACTIVE,
          defaultWorkCenterId: workCenter.id,
          defaultWorkCenterCode: workCenter.workCenterCode,
          defaultWorkCenterName: workCenter.workCenterName,
          timeCalculationMethod: TimeCalculationMethod.STANDARD_TIME,
          setupTimeMinutes: operationData.setupTimeMinutes,
          runTimePerUnitMinutes: operationData.runTimePerUnitMinutes,
          teardownTimeMinutes: 0,
          totalTimePerUnitMinutes:
            operationData.setupTimeMinutes + operationData.runTimePerUnitMinutes,
          batchSize: 1,
          hourlyRate: workCenter.hourlyOperatingCost,
          numberOfOperators: 1,
          numberOfMachines: 1,
          targetEfficiency: 100,
          isActive: true,
          requiresQualityInspection:
            operationData.operationType === OperationType.INSPECTION,
          createdBy: 'system',
        });

        await this.operationRepository.save(operation);
        this.logger.log(
          `Created operation: ${operationData.operationCode} - ${operationData.operationName} (Work Center: ${operationData.workCenterCode})`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to seed operation ${operationData.operationCode}: ${error.message}`,
        );
      }
    }

    this.logger.log('Operation seeding completed.');
  }

  async getOperationByCode(code: string): Promise<Operation | null> {
    return this.operationRepository.findOne({
      where: { operationCode: code },
    });
  }
}
