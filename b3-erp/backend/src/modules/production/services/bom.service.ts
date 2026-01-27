import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BOM, BOMStatus } from '../entities/bom.entity';
import { BOMItem } from '../entities/bom-item.entity';
import { CreateBOMDto, UpdateBOMDto, BOMResponseDto } from '../dto';

@Injectable()
export class BOMService {
  constructor(
    @InjectRepository(BOM)
    private readonly bomRepository: Repository<BOM>,
    @InjectRepository(BOMItem)
    private readonly bomItemRepository: Repository<BOMItem>,
  ) {}

  async create(createDto: CreateBOMDto): Promise<BOMResponseDto> {
    // Check if BOM code already exists
    const existing = await this.bomRepository.findOne({
      where: { bomCode: createDto.bomCode },
    });

    if (existing) {
      throw new BadRequestException(
        `BOM code ${createDto.bomCode} already exists`,
      );
    }

    const bom = this.bomRepository.create({
      ...createDto,
      status: BOMStatus.DRAFT,
    });

    const savedBOM = await this.bomRepository.save(bom);
    return this.mapToResponseDto(savedBOM);
  }

  async findAll(filters?: {
    itemId?: string;
    status?: BOMStatus;
    isActive?: boolean;
  }): Promise<BOMResponseDto[]> {
    const query = this.bomRepository.createQueryBuilder('bom');

    if (filters?.itemId) {
      query.andWhere('bom.itemId = :itemId', { itemId: filters.itemId });
    }

    if (filters?.status) {
      query.andWhere('bom.status = :status', { status: filters.status });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('bom.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    query.orderBy('bom.createdAt', 'DESC');

    const boms = await query.getMany();
    return boms.map((bom) => this.mapToResponseDto(bom));
  }

  async findOne(id: string): Promise<BOMResponseDto> {
    const bom = await this.bomRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!bom) {
      throw new NotFoundException(`BOM with ID ${id} not found`);
    }

    return this.mapToResponseDto(bom);
  }

  async update(id: string, updateDto: UpdateBOMDto): Promise<BOMResponseDto> {
    const bom = await this.bomRepository.findOne({ where: { id } });

    if (!bom) {
      throw new NotFoundException(`BOM with ID ${id} not found`);
    }

    // Check if BOM is in editable status
    if (bom.status === BOMStatus.ACTIVE && updateDto.status !== BOMStatus.INACTIVE) {
      throw new BadRequestException(
        'Cannot modify active BOM. Please create a new version.',
      );
    }

    // If changing BOM code, check uniqueness
    if (updateDto.bomCode && updateDto.bomCode !== bom.bomCode) {
      const existing = await this.bomRepository.findOne({
        where: { bomCode: updateDto.bomCode },
      });

      if (existing) {
        throw new BadRequestException(
          `BOM code ${updateDto.bomCode} already exists`,
        );
      }
    }

    Object.assign(bom, updateDto);
    const updatedBOM = await this.bomRepository.save(bom);
    return this.mapToResponseDto(updatedBOM);
  }

  async remove(id: string): Promise<void> {
    const bom = await this.bomRepository.findOne({ where: { id } });

    if (!bom) {
      throw new NotFoundException(`BOM with ID ${id} not found`);
    }

    if (bom.status === BOMStatus.ACTIVE) {
      throw new BadRequestException('Cannot delete active BOM');
    }

    await this.bomRepository.remove(bom);
  }

  // Special operations
  async submit(id: string, submittedBy: string): Promise<BOMResponseDto> {
    const bom = await this.bomRepository.findOne({ where: { id } });

    if (!bom) {
      throw new NotFoundException(`BOM with ID ${id} not found`);
    }

    if (bom.status !== BOMStatus.DRAFT) {
      throw new BadRequestException('Only draft BOMs can be submitted');
    }

    bom.status = BOMStatus.SUBMITTED;
    bom.submittedBy = submittedBy;
    bom.submittedAt = new Date();

    const updatedBOM = await this.bomRepository.save(bom);
    return this.mapToResponseDto(updatedBOM);
  }

  async approve(
    id: string,
    approvedBy: string,
    comments?: string,
  ): Promise<BOMResponseDto> {
    const bom = await this.bomRepository.findOne({ where: { id } });

    if (!bom) {
      throw new NotFoundException(`BOM with ID ${id} not found`);
    }

    if (bom.status !== BOMStatus.SUBMITTED) {
      throw new BadRequestException('Only submitted BOMs can be approved');
    }

    bom.status = BOMStatus.ACTIVE;
    bom.approvedBy = approvedBy;
    bom.approvedAt = new Date();
    bom.approvalComments = comments ?? '';

    const updatedBOM = await this.bomRepository.save(bom);
    return this.mapToResponseDto(updatedBOM);
  }

  async explodeBOM(id: string): Promise<any> {
    const bom = await this.bomRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!bom) {
      throw new NotFoundException(`BOM with ID ${id} not found`);
    }

    // Build multi-level BOM explosion
    const explodedItems = [];

    for (const item of bom.items || []) {
      explodedItems.push({
        level: item.level,
        itemId: item.itemId,
        itemCode: item.itemCode,
        itemName: item.itemName,
        quantity: item.quantity,
        netQuantity: item.netQuantity,
        uom: item.uom,
        unitCost: item.unitCost,
        totalCost: item.totalCost,
      });

      // If item has its own BOM, recursively explode it
      if (item.itemType === 'Sub-Assembly') {
        const subBOM = await this.bomRepository.findOne({
          where: { itemId: item.itemId, isDefault: true, isActive: true },
          relations: ['items'],
        });

        if (subBOM) {
          for (const subItem of subBOM.items || []) {
            explodedItems.push({
              level: item.level + 1,
              itemId: subItem.itemId,
              itemCode: subItem.itemCode,
              itemName: subItem.itemName,
              quantity: subItem.quantity * item.quantity,
              netQuantity: subItem.netQuantity * item.quantity,
              uom: subItem.uom,
              unitCost: subItem.unitCost,
              totalCost: subItem.totalCost * item.quantity,
            });
          }
        }
      }
    }

    return {
      bomId: bom.id,
      bomCode: bom.bomCode,
      itemCode: bom.itemCode,
      itemName: bom.itemName,
      quantity: bom.quantity,
      explodedItems,
      totalComponents: explodedItems.length,
    };
  }

  async costRollup(id: string): Promise<BOMResponseDto> {
    const bom = await this.bomRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!bom) {
      throw new NotFoundException(`BOM with ID ${id} not found`);
    }

    // Calculate material cost from items
    let materialCost = 0;
    for (const item of bom.items || []) {
      materialCost += item.totalCost;
    }

    bom.materialCost = materialCost;
    bom.totalCost = bom.materialCost + bom.operationCost + bom.overheadCost;
    bom.costPerUnit = bom.quantity > 0 ? bom.totalCost / bom.quantity : 0;
    bom.lastCostRollupDate = new Date();

    const updatedBOM = await this.bomRepository.save(bom);
    return this.mapToResponseDto(updatedBOM);
  }

  async whereUsed(itemId: string): Promise<any[]> {
    // Find all BOMs that use this item
    const bomItems = await this.bomItemRepository.find({
      where: { itemId },
      relations: ['bom'],
    });

    return bomItems.map((bomItem) => ({
      bomId: bomItem.bom.id,
      bomCode: bomItem.bom.bomCode,
      bomName: bomItem.bom.bomName,
      itemCode: bomItem.bom.itemCode,
      itemName: bomItem.bom.itemName,
      quantity: bomItem.quantity,
      status: bomItem.bom.status,
      isActive: bomItem.bom.isActive,
    }));
  }

  private mapToResponseDto(bom: BOM): BOMResponseDto {
    return {
      id: bom.id,
      bomCode: bom.bomCode,
      bomName: bom.bomName,
      description: bom.description,
      itemId: bom.itemId,
      itemCode: bom.itemCode,
      itemName: bom.itemName,
      bomType: bom.bomType,
      status: bom.status,
      version: bom.version,
      isActive: bom.isActive,
      isDefault: bom.isDefault,
      effectiveFrom: bom.effectiveFrom,
      effectiveTo: bom.effectiveTo,
      quantity: bom.quantity,
      uom: bom.uom,
      materialCost: bom.materialCost,
      operationCost: bom.operationCost,
      overheadCost: bom.overheadCost,
      totalCost: bom.totalCost,
      costPerUnit: bom.costPerUnit,
      lastCostRollupDate: bom.lastCostRollupDate,
      leadTimeDays: bom.leadTimeDays,
      scrapPercentage: bom.scrapPercentage,
      batchSize: bom.batchSize,
      allowAlternativeItems: bom.allowAlternativeItems,
      requiresQualityInspection: bom.requiresQualityInspection,
      defaultRoutingId: bom.defaultRoutingId,
      defaultRoutingCode: bom.defaultRoutingCode,
      drawingNumber: bom.drawingNumber,
      revision: bom.revision,
      submittedBy: bom.submittedBy,
      submittedAt: bom.submittedAt,
      approvedBy: bom.approvedBy,
      approvedAt: bom.approvedAt,
      notes: bom.notes,
      customFields: bom.customFields,
      createdBy: bom.createdBy,
      updatedBy: bom.updatedBy,
      createdAt: bom.createdAt,
      updatedAt: bom.updatedAt,
    };
  }
}
