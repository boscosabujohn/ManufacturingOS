import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductionEntry, ProductionEntryStatus } from '../entities/production-entry.entity';
import { CreateProductionEntryDto, UpdateProductionEntryDto, ProductionEntryResponseDto } from '../dto';

@Injectable()
export class ProductionEntryService {
  constructor(
    @InjectRepository(ProductionEntry)
    private readonly productionEntryRepository: Repository<ProductionEntry>,
  ) {}

  async create(createDto: CreateProductionEntryDto): Promise<ProductionEntryResponseDto> {
    const existing = await this.productionEntryRepository.findOne({
      where: { entryNumber: createDto.entryNumber },
    });

    if (existing) {
      throw new BadRequestException(`Production Entry ${createDto.entryNumber} already exists`);
    }

    const entry = this.productionEntryRepository.create({
      ...createDto,
      status: ProductionEntryStatus.DRAFT,
    });

    const savedEntry = await this.productionEntryRepository.save(entry);
    return this.mapToResponseDto(savedEntry);
  }

  async findAll(filters?: {
    workOrderId?: string;
    status?: ProductionEntryStatus;
    entryType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ProductionEntryResponseDto[]> {
    const query = this.productionEntryRepository.createQueryBuilder('entry');

    if (filters?.workOrderId) {
      query.andWhere('entry.workOrderId = :workOrderId', { workOrderId: filters.workOrderId });
    }

    if (filters?.status) {
      query.andWhere('entry.status = :status', { status: filters.status });
    }

    if (filters?.entryType) {
      query.andWhere('entry.entryType = :entryType', { entryType: filters.entryType });
    }

    if (filters?.startDate) {
      query.andWhere('entry.postingDate >= :startDate', { startDate: filters.startDate });
    }

    if (filters?.endDate) {
      query.andWhere('entry.postingDate <= :endDate', { endDate: filters.endDate });
    }

    query.orderBy('entry.postingDate', 'DESC');

    const entries = await query.getMany();
    return entries.map((entry) => this.mapToResponseDto(entry));
  }

  async findOne(id: string): Promise<ProductionEntryResponseDto> {
    const entry = await this.productionEntryRepository.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`Production Entry with ID ${id} not found`);
    }

    return this.mapToResponseDto(entry);
  }

  async update(id: string, updateDto: UpdateProductionEntryDto): Promise<ProductionEntryResponseDto> {
    const entry = await this.productionEntryRepository.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`Production Entry with ID ${id} not found`);
    }

    if (entry.status === ProductionEntryStatus.POSTED) {
      throw new BadRequestException('Cannot modify posted production entry');
    }

    Object.assign(entry, updateDto);
    const updatedEntry = await this.productionEntryRepository.save(entry);
    return this.mapToResponseDto(updatedEntry);
  }

  async remove(id: string): Promise<void> {
    const entry = await this.productionEntryRepository.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`Production Entry with ID ${id} not found`);
    }

    if (entry.status !== ProductionEntryStatus.DRAFT) {
      throw new BadRequestException('Only draft production entries can be deleted');
    }

    await this.productionEntryRepository.remove(entry);
  }

  // Special operations
  async postProduction(id: string, postedBy: string): Promise<ProductionEntryResponseDto> {
    const entry = await this.productionEntryRepository.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`Production Entry with ID ${id} not found`);
    }

    if (entry.status !== ProductionEntryStatus.SUBMITTED) {
      throw new BadRequestException('Only submitted entries can be posted');
    }

    entry.status = ProductionEntryStatus.POSTED;
    entry.postedBy = postedBy;
    entry.postingTime = new Date();
    entry.inventoryPosted = true;
    entry.inventoryPostedAt = new Date();

    const updatedEntry = await this.productionEntryRepository.save(entry);
    return this.mapToResponseDto(updatedEntry);
  }

  async consumeMaterials(id: string, materialsConsumed: any[]): Promise<ProductionEntryResponseDto> {
    const entry = await this.productionEntryRepository.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`Production Entry with ID ${id} not found`);
    }

    entry.materialsConsumed = materialsConsumed;

    // Calculate material cost
    entry.totalMaterialCost = materialsConsumed.reduce(
      (sum, material) => sum + (material.totalCost || 0),
      0
    );

    entry.totalCost = entry.totalMaterialCost + entry.totalLaborCost + entry.overheadCost;
    entry.costPerUnit = entry.quantity > 0 ? entry.totalCost / entry.quantity : 0;

    const updatedEntry = await this.productionEntryRepository.save(entry);
    return this.mapToResponseDto(updatedEntry);
  }

  async reverse(id: string, reversedBy: string, reason: string): Promise<ProductionEntryResponseDto> {
    const entry = await this.productionEntryRepository.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`Production Entry with ID ${id} not found`);
    }

    if (entry.status !== ProductionEntryStatus.POSTED) {
      throw new BadRequestException('Only posted entries can be reversed');
    }

    if (entry.isReversed) {
      throw new BadRequestException('Entry is already reversed');
    }

    entry.status = ProductionEntryStatus.REVERSED;
    entry.isReversed = true;
    entry.reversedBy = reversedBy;
    entry.reversedAt = new Date();
    entry.reversalReason = reason;

    const updatedEntry = await this.productionEntryRepository.save(entry);
    return this.mapToResponseDto(updatedEntry);
  }

  private mapToResponseDto(entry: ProductionEntry): ProductionEntryResponseDto {
    return {
      id: entry.id,
      entryNumber: entry.entryNumber,
      entryType: entry.entryType,
      status: entry.status,
      postingDate: entry.postingDate,
      workOrderId: entry.workOrderId,
      workOrderNumber: entry.workOrderNumber,
      itemId: entry.itemId,
      itemCode: entry.itemCode,
      itemName: entry.itemName,
      operationId: entry.operationId,
      workCenterId: entry.workCenterId,
      quantity: entry.quantity,
      acceptedQuantity: entry.acceptedQuantity,
      rejectedQuantity: entry.rejectedQuantity,
      scrapQuantity: entry.scrapQuantity,
      uom: entry.uom,
      totalMaterialCost: entry.totalMaterialCost,
      totalLaborCost: entry.totalLaborCost,
      overheadCost: entry.overheadCost,
      totalCost: entry.totalCost,
      costPerUnit: entry.costPerUnit,
      inventoryPosted: entry.inventoryPosted,
      glPosted: entry.glPosted,
      isReversed: entry.isReversed,
      operatorId: entry.operatorId,
      operatorName: entry.operatorName,
      remarks: entry.remarks,
      createdBy: entry.createdBy,
      updatedBy: entry.updatedBy,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    };
  }
}
