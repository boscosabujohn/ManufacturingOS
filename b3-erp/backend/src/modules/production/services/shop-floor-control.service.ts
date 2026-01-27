import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopFloorControl, ShopFloorStatus } from '../entities/shop-floor-control.entity';
import { CreateShopFloorControlDto, UpdateShopFloorControlDto, ShopFloorControlResponseDto } from '../dto';

@Injectable()
export class ShopFloorControlService {
  constructor(
    @InjectRepository(ShopFloorControl)
    private readonly shopFloorRepository: Repository<ShopFloorControl>,
  ) {}

  async create(createDto: CreateShopFloorControlDto): Promise<ShopFloorControlResponseDto> {
    const entry = this.shopFloorRepository.create({
      ...createDto,
      status: ShopFloorStatus.PENDING,
    });

    const savedEntry = await this.shopFloorRepository.save(entry);
    return this.mapToResponseDto(savedEntry);
  }

  async findAll(filters?: {
    workOrderId?: string;
    workCenterId?: string;
    operatorId?: string;
    status?: ShopFloorStatus;
  }): Promise<ShopFloorControlResponseDto[]> {
    const query = this.shopFloorRepository.createQueryBuilder('sfc');

    if (filters?.workOrderId) {
      query.andWhere('sfc.workOrderId = :workOrderId', { workOrderId: filters.workOrderId });
    }

    if (filters?.workCenterId) {
      query.andWhere('sfc.workCenterId = :workCenterId', { workCenterId: filters.workCenterId });
    }

    if (filters?.operatorId) {
      query.andWhere('sfc.operatorId = :operatorId', { operatorId: filters.operatorId });
    }

    if (filters?.status) {
      query.andWhere('sfc.status = :status', { status: filters.status });
    }

    query.orderBy('sfc.startTime', 'DESC');

    const entries = await query.getMany();
    return entries.map((entry) => this.mapToResponseDto(entry));
  }

  async findOne(id: string): Promise<ShopFloorControlResponseDto> {
    const entry = await this.shopFloorRepository.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`Shop Floor Control entry with ID ${id} not found`);
    }

    return this.mapToResponseDto(entry);
  }

  async update(id: string, updateDto: UpdateShopFloorControlDto): Promise<ShopFloorControlResponseDto> {
    const entry = await this.shopFloorRepository.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`Shop Floor Control entry with ID ${id} not found`);
    }

    Object.assign(entry, updateDto);
    const updatedEntry = await this.shopFloorRepository.save(entry);
    return this.mapToResponseDto(updatedEntry);
  }

  async remove(id: string): Promise<void> {
    const entry = await this.shopFloorRepository.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`Shop Floor Control entry with ID ${id} not found`);
    }

    await this.shopFloorRepository.remove(entry);
  }

  // Special operations
  async startOperation(id: string): Promise<ShopFloorControlResponseDto> {
    const entry = await this.shopFloorRepository.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`Shop Floor Control entry with ID ${id} not found`);
    }

    entry.status = ShopFloorStatus.IN_PROGRESS;
    entry.startTime = new Date();

    const updatedEntry = await this.shopFloorRepository.save(entry);
    return this.mapToResponseDto(updatedEntry);
  }

  async completeOperation(id: string, completedQty: number): Promise<ShopFloorControlResponseDto> {
    const entry = await this.shopFloorRepository.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`Shop Floor Control entry with ID ${id} not found`);
    }

    entry.status = ShopFloorStatus.COMPLETED;
    entry.endTime = new Date();
    entry.completedQuantity = completedQty;

    // Calculate duration
    if (entry.startTime && entry.endTime) {
      const durationMs = entry.endTime.getTime() - new Date(entry.startTime).getTime();
      entry.durationMinutes = Math.round(durationMs / 60000);
    }

    // Calculate efficiency
    if (entry.standardTimeMinutes > 0) {
      entry.efficiencyPercentage = (entry.standardTimeMinutes / entry.durationMinutes) * 100;
    }

    const updatedEntry = await this.shopFloorRepository.save(entry);
    return this.mapToResponseDto(updatedEntry);
  }

  async reportDowntime(id: string, downtimeData: {
    category: string;
    minutes: number;
    reason: string;
    remarks?: string;
  }): Promise<ShopFloorControlResponseDto> {
    const entry = await this.shopFloorRepository.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`Shop Floor Control entry with ID ${id} not found`);
    }

    entry.hasDowntime = true;
    entry.downtimeCategory = downtimeData.category as any;
    entry.downtimeMinutes = downtimeData.minutes;
    entry.downtimeReason = downtimeData.reason;
    entry.downtimeRemarks = downtimeData.remarks ?? '';

    const updatedEntry = await this.shopFloorRepository.save(entry);
    return this.mapToResponseDto(updatedEntry);
  }

  private mapToResponseDto(entry: ShopFloorControl): ShopFloorControlResponseDto {
    return {
      id: entry.id,
      entryNumber: entry.entryNumber,
      activityType: entry.activityType,
      status: entry.status,
      workOrderId: entry.workOrderId,
      workOrderNumber: entry.workOrderNumber,
      itemId: entry.itemId,
      itemCode: entry.itemCode,
      itemName: entry.itemName,
      operationId: entry.operationId,
      operationCode: entry.operationCode,
      workCenterId: entry.workCenterId,
      workCenterCode: entry.workCenterCode,
      operatorId: entry.operatorId,
      operatorName: entry.operatorName,
      startTime: entry.startTime,
      endTime: entry.endTime,
      durationMinutes: entry.durationMinutes,
      targetQuantity: entry.targetQuantity,
      completedQuantity: entry.completedQuantity,
      acceptedQuantity: entry.acceptedQuantity,
      rejectedQuantity: entry.rejectedQuantity,
      efficiencyPercentage: entry.efficiencyPercentage,
      hasDowntime: entry.hasDowntime,
      downtimeMinutes: entry.downtimeMinutes,
      remarks: entry.remarks,
      createdBy: entry.createdBy,
      updatedBy: entry.updatedBy,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    };
  }
}
