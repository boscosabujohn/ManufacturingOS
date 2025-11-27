import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inspection, InspectionStatus, InspectionResultEnum } from '../entities/inspection.entity';
import { CreateInspectionDto, UpdateInspectionDto, InspectionResponseDto } from '../dto';
import { EventBusService } from '../../workflow/services/event-bus.service';

@Injectable()
export class InspectionService {
  constructor(
    @InjectRepository(Inspection)
    private readonly inspectionRepository: Repository<Inspection>,
    private readonly eventBus: EventBusService,
  ) { }

  async create(createDto: CreateInspectionDto): Promise<InspectionResponseDto> {
    const existing = await this.inspectionRepository.findOne({
      where: { inspectionNumber: createDto.inspectionNumber },
    });

    if (existing) {
      throw new BadRequestException(
        `Inspection ${createDto.inspectionNumber} already exists`,
      );
    }

    const inspection = this.inspectionRepository.create({
      ...createDto,
      status: InspectionStatus.DRAFT,
    });

    const savedInspection = await this.inspectionRepository.save(inspection);
    return this.mapToResponseDto(savedInspection);
  }

  async findAll(filters?: {
    status?: InspectionStatus;
    inspectionType?: string;
    itemId?: string;
  }): Promise<InspectionResponseDto[]> {
    const query = this.inspectionRepository.createQueryBuilder('i');

    if (filters?.status) {
      query.andWhere('i.status = :status', { status: filters.status });
    }

    if (filters?.inspectionType) {
      query.andWhere('i.inspectionType = :inspectionType', {
        inspectionType: filters.inspectionType,
      });
    }

    if (filters?.itemId) {
      query.andWhere('i.itemId = :itemId', { itemId: filters.itemId });
    }

    query.orderBy('i.createdAt', 'DESC');

    const inspections = await query.getMany();
    return inspections.map((i) => this.mapToResponseDto(i));
  }

  async findOne(id: string): Promise<InspectionResponseDto> {
    const inspection = await this.inspectionRepository.findOne({
      where: { id },
      relations: ['results'],
    });

    if (!inspection) {
      throw new NotFoundException(`Inspection with ID ${id} not found`);
    }

    return this.mapToResponseDto(inspection);
  }

  async update(
    id: string,
    updateDto: UpdateInspectionDto,
  ): Promise<InspectionResponseDto> {
    const inspection = await this.inspectionRepository.findOne({
      where: { id },
    });

    if (!inspection) {
      throw new NotFoundException(`Inspection with ID ${id} not found`);
    }

    Object.assign(inspection, updateDto);
    const updatedInspection = await this.inspectionRepository.save(inspection);
    return this.mapToResponseDto(updatedInspection);
  }

  async remove(id: string): Promise<void> {
    const inspection = await this.inspectionRepository.findOne({
      where: { id },
    });

    if (!inspection) {
      throw new NotFoundException(`Inspection with ID ${id} not found`);
    }

    if (inspection.status !== InspectionStatus.DRAFT) {
      throw new BadRequestException('Only draft inspections can be deleted');
    }

    await this.inspectionRepository.remove(inspection);
  }

  async start(id: string, inspectedById: string, inspectedByName: string): Promise<InspectionResponseDto> {
    const inspection = await this.inspectionRepository.findOne({
      where: { id },
    });

    if (!inspection) {
      throw new NotFoundException(`Inspection with ID ${id} not found`);
    }

    if (inspection.status !== InspectionStatus.SCHEDULED && inspection.status !== InspectionStatus.DRAFT) {
      throw new BadRequestException(
        'Only scheduled or draft inspections can be started',
      );
    }

    inspection.status = InspectionStatus.IN_PROGRESS;
    inspection.inspectedById = inspectedById;
    inspection.inspectedByName = inspectedByName;
    inspection.actualStartTime = new Date();

    const updatedInspection = await this.inspectionRepository.save(inspection);
    return this.mapToResponseDto(updatedInspection);
  }

  async submit(id: string): Promise<InspectionResponseDto> {
    const inspection = await this.inspectionRepository.findOne({
      where: { id },
    });

    if (!inspection) {
      throw new NotFoundException(`Inspection with ID ${id} not found`);
    }

    if (inspection.status !== InspectionStatus.IN_PROGRESS) {
      throw new BadRequestException(
        'Only in-progress inspections can be submitted',
      );
    }

    inspection.status = InspectionStatus.COMPLETED;
    inspection.actualEndTime = new Date();

    const startTime = inspection.actualStartTime ? new Date(inspection.actualStartTime).getTime() : 0;
    const endTime = inspection.actualEndTime.getTime();
    inspection.durationMinutes = Math.floor((endTime - startTime) / 60000);

    const updatedInspection = await this.inspectionRepository.save(inspection);
    return this.mapToResponseDto(updatedInspection);
  }

  async approve(id: string, approvedBy: string): Promise<InspectionResponseDto> {
    const inspection = await this.inspectionRepository.findOne({
      where: { id },
    });

    if (!inspection) {
      throw new NotFoundException(`Inspection with ID ${id} not found`);
    }

    if (inspection.status !== InspectionStatus.COMPLETED) {
      throw new BadRequestException(
        'Only completed inspections can be approved',
      );
    }

    inspection.status = InspectionStatus.APPROVED;
    inspection.approvedBy = approvedBy;
    inspection.approvedAt = new Date();

    const updatedInspection = await this.inspectionRepository.save(inspection);

    // Emit inspection passed event
    await this.eventBus.emitInspectionPassed({
      inspectionId: updatedInspection.id,
      inspectionNumber: updatedInspection.inspectionNumber,
      referenceType: updatedInspection.referenceType as any || 'goods_receipt',
      referenceId: updatedInspection.referenceId || '',
      itemId: updatedInspection.itemId,
      itemName: updatedInspection.itemName,
      quantity: updatedInspection.acceptedQuantity || updatedInspection.lotQuantity,
      unit: updatedInspection.uom || 'units',
      result: 'passed',
      userId: approvedBy,
    });

    return this.mapToResponseDto(updatedInspection);
  }

  async reject(id: string, rejectedBy: string, reason: string): Promise<InspectionResponseDto> {
    const inspection = await this.inspectionRepository.findOne({
      where: { id },
    });

    if (!inspection) {
      throw new NotFoundException(`Inspection with ID ${id} not found`);
    }

    inspection.status = InspectionStatus.REJECTED;
    inspection.result = InspectionResultEnum.FAILED;
    inspection.rejectedBy = rejectedBy;
    inspection.rejectedAt = new Date();
    inspection.rejectionReason = reason;

    const updatedInspection = await this.inspectionRepository.save(inspection);

    // Emit inspection failed event
    await this.eventBus.emitInspectionFailed({
      inspectionId: updatedInspection.id,
      inspectionNumber: updatedInspection.inspectionNumber,
      referenceType: updatedInspection.referenceType as any || 'goods_receipt',
      referenceId: updatedInspection.referenceId || '',
      itemId: updatedInspection.itemId,
      itemName: updatedInspection.itemName,
      quantity: updatedInspection.rejectedQuantity || updatedInspection.lotQuantity,
      unit: updatedInspection.uom || 'units',
      result: 'failed',
      defects: updatedInspection.totalDefects ? [
        { type: 'critical', quantity: updatedInspection.criticalDefects || 0, severity: 'critical' as const },
        { type: 'major', quantity: updatedInspection.majorDefects || 0, severity: 'major' as const },
        { type: 'minor', quantity: updatedInspection.minorDefects || 0, severity: 'minor' as const },
      ] : undefined,
      userId: rejectedBy,
    });

    return this.mapToResponseDto(updatedInspection);
  }

  async calculateStatistics(id: string): Promise<any> {
    const inspection = await this.inspectionRepository.findOne({
      where: { id },
      relations: ['results'],
    });

    if (!inspection) {
      throw new NotFoundException(`Inspection with ID ${id} not found`);
    }

    const total = inspection.parametersChecked;
    const passed = inspection.parametersPassed;
    const failed = inspection.parametersFailed;

    const passRate = total > 0 ? (passed / total) * 100 : 0;
    const failRate = total > 0 ? (failed / total) * 100 : 0;

    return {
      totalParameters: total,
      parametersPassed: passed,
      parametersFailed: failed,
      passRate: Number(passRate.toFixed(2)),
      failRate: Number(failRate.toFixed(2)),
      defectRate: inspection.defectRate,
      rejectionRate: inspection.rejectionRate,
      totalDefects: inspection.totalDefects,
      criticalDefects: inspection.criticalDefects,
      majorDefects: inspection.majorDefects,
      minorDefects: inspection.minorDefects,
    };
  }

  private mapToResponseDto(inspection: Inspection): InspectionResponseDto {
    return {
      id: inspection.id,
      inspectionNumber: inspection.inspectionNumber,
      inspectionName: inspection.inspectionName,
      inspectionType: inspection.inspectionType,
      status: inspection.status,
      result: inspection.result,
      priority: inspection.priority,
      itemCode: inspection.itemCode,
      itemName: inspection.itemName,
      lotQuantity: inspection.lotQuantity,
      sampleSize: inspection.sampleSize,
      acceptedQuantity: inspection.acceptedQuantity,
      rejectedQuantity: inspection.rejectedQuantity,
      scheduledDate: inspection.scheduledDate,
      assignedToName: inspection.assignedToName,
      inspectedByName: inspection.inspectedByName,
      defectRate: inspection.defectRate,
      totalDefects: inspection.totalDefects,
      createdAt: inspection.createdAt,
      updatedAt: inspection.updatedAt,
    };
  }
}
