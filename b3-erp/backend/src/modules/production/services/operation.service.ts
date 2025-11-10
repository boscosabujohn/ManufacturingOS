import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operation, OperationStatus } from '../entities/operation.entity';
import { CreateOperationDto, UpdateOperationDto, OperationResponseDto } from '../dto';

@Injectable()
export class OperationService {
  constructor(
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>,
  ) {}

  async create(createDto: CreateOperationDto): Promise<OperationResponseDto> {
    const existing = await this.operationRepository.findOne({
      where: { operationCode: createDto.operationCode },
    });

    if (existing) {
      throw new BadRequestException(`Operation code ${createDto.operationCode} already exists`);
    }

    const operation = this.operationRepository.create({
      ...createDto,
      status: OperationStatus.ACTIVE,
    });

    // Calculate total time
    operation.totalTimePerUnitMinutes =
      (operation.setupTimeMinutes || 0) / (operation.batchSize || 1) +
      (operation.runTimePerUnitMinutes || 0) +
      (operation.teardownTimeMinutes || 0) / (operation.batchSize || 1);

    const savedOperation = await this.operationRepository.save(operation);
    return this.mapToResponseDto(savedOperation);
  }

  async findAll(filters?: {
    operationType?: string;
    workCenterId?: string;
    isActive?: boolean;
  }): Promise<OperationResponseDto[]> {
    const query = this.operationRepository.createQueryBuilder('op');

    if (filters?.operationType) {
      query.andWhere('op.operationType = :operationType', { operationType: filters.operationType });
    }

    if (filters?.workCenterId) {
      query.andWhere('op.defaultWorkCenterId = :workCenterId', { workCenterId: filters.workCenterId });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('op.isActive = :isActive', { isActive: filters.isActive });
    }

    query.orderBy('op.operationCode', 'ASC');

    const operations = await query.getMany();
    return operations.map((op) => this.mapToResponseDto(op));
  }

  async findOne(id: string): Promise<OperationResponseDto> {
    const operation = await this.operationRepository.findOne({ where: { id } });

    if (!operation) {
      throw new NotFoundException(`Operation with ID ${id} not found`);
    }

    return this.mapToResponseDto(operation);
  }

  async update(id: string, updateDto: UpdateOperationDto): Promise<OperationResponseDto> {
    const operation = await this.operationRepository.findOne({ where: { id } });

    if (!operation) {
      throw new NotFoundException(`Operation with ID ${id} not found`);
    }

    Object.assign(operation, updateDto);

    // Recalculate total time if any time component changed
    if (updateDto.setupTimeMinutes !== undefined ||
        updateDto.runTimePerUnitMinutes !== undefined ||
        updateDto.teardownTimeMinutes !== undefined ||
        updateDto.batchSize !== undefined) {
      operation.totalTimePerUnitMinutes =
        (operation.setupTimeMinutes || 0) / (operation.batchSize || 1) +
        (operation.runTimePerUnitMinutes || 0) +
        (operation.teardownTimeMinutes || 0) / (operation.batchSize || 1);
    }

    const updatedOperation = await this.operationRepository.save(operation);
    return this.mapToResponseDto(updatedOperation);
  }

  async remove(id: string): Promise<void> {
    const operation = await this.operationRepository.findOne({ where: { id } });

    if (!operation) {
      throw new NotFoundException(`Operation with ID ${id} not found`);
    }

    await this.operationRepository.remove(operation);
  }

  private mapToResponseDto(operation: Operation): OperationResponseDto {
    return {
      id: operation.id,
      operationCode: operation.operationCode,
      operationName: operation.operationName,
      description: operation.description,
      operationType: operation.operationType,
      status: operation.status,
      defaultWorkCenterId: operation.defaultWorkCenterId,
      defaultWorkCenterCode: operation.defaultWorkCenterCode,
      setupTimeMinutes: operation.setupTimeMinutes,
      runTimePerUnitMinutes: operation.runTimePerUnitMinutes,
      teardownTimeMinutes: operation.teardownTimeMinutes,
      totalTimePerUnitMinutes: operation.totalTimePerUnitMinutes,
      batchSize: operation.batchSize,
      hourlyRate: operation.hourlyRate,
      costPerUnit: operation.costPerUnit,
      numberOfOperators: operation.numberOfOperators,
      numberOfMachines: operation.numberOfMachines,
      requiresQualityInspection: operation.requiresQualityInspection,
      workInstructions: operation.workInstructions,
      isOutsourced: operation.isOutsourced,
      isActive: operation.isActive,
      notes: operation.notes,
      createdBy: operation.createdBy,
      updatedBy: operation.updatedBy,
      createdAt: operation.createdAt,
      updatedAt: operation.updatedAt,
    };
  }
}
