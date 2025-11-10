import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  StockAdjustment,
  StockAdjustmentLine,
  AdjustmentStatus,
} from '../entities/stock-adjustment.entity';
import {
  CreateStockAdjustmentDto,
  UpdateStockAdjustmentDto,
  StockAdjustmentResponseDto,
} from '../dto';

@Injectable()
export class StockAdjustmentService {
  constructor(
    @InjectRepository(StockAdjustment)
    private readonly stockAdjustmentRepository: Repository<StockAdjustment>,
    @InjectRepository(StockAdjustmentLine)
    private readonly stockAdjustmentLineRepository: Repository<StockAdjustmentLine>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createDto: CreateStockAdjustmentDto,
  ): Promise<StockAdjustmentResponseDto> {
    return await this.dataSource.transaction(async (manager) => {
      const adjustmentNumber = await this.generateAdjustmentNumber();

      let totalPositive = 0;
      let totalNegative = 0;

      createDto.lines.forEach((line) => {
        const adjustment = line.physicalQuantity - line.systemQuantity;
        const value = adjustment * 0; // Would calculate with valuation rate
        if (adjustment > 0) {
          totalPositive += value;
        } else {
          totalNegative += Math.abs(value);
        }
      });

      const adjustment = manager.create(StockAdjustment, {
        ...createDto,
        adjustmentNumber,
        status: AdjustmentStatus.DRAFT,
        positiveAdjustmentValue: totalPositive,
        negativeAdjustmentValue: totalNegative,
        totalAdjustmentValue: totalPositive - totalNegative,
      });

      const saved = await manager.save(StockAdjustment, adjustment);

      const lines = createDto.lines.map((lineDto) => {
        const adjustmentQty = lineDto.physicalQuantity - lineDto.systemQuantity;
        return manager.create(StockAdjustmentLine, {
          ...lineDto,
          stockAdjustmentId: saved.id,
          adjustmentQuantity: adjustmentQty,
          variancePercentage:
            lineDto.systemQuantity > 0
              ? (adjustmentQty / lineDto.systemQuantity) * 100
              : 0,
        });
      });

      await manager.save(StockAdjustmentLine, lines);
      return this.findOne(saved.id);
    });
  }

  async findAll(filters?: any): Promise<StockAdjustmentResponseDto[]> {
    const query =
      this.stockAdjustmentRepository.createQueryBuilder('stockAdjustment');

    if (filters?.status) {
      query.andWhere('stockAdjustment.status = :status', {
        status: filters.status,
      });
    }

    if (filters?.adjustmentType) {
      query.andWhere('stockAdjustment.adjustmentType = :adjustmentType', {
        adjustmentType: filters.adjustmentType,
      });
    }

    if (filters?.warehouseId) {
      query.andWhere('stockAdjustment.warehouseId = :warehouseId', {
        warehouseId: filters.warehouseId,
      });
    }

    query.orderBy('stockAdjustment.adjustmentDate', 'DESC');
    const adjustments = await query.getMany();
    return Promise.all(adjustments.map((a) => this.findOne(a.id)));
  }

  async getPendingApproval(): Promise<StockAdjustmentResponseDto[]> {
    const adjustments = await this.stockAdjustmentRepository.find({
      where: { status: AdjustmentStatus.SUBMITTED },
      order: { adjustmentDate: 'ASC' },
    });
    return Promise.all(adjustments.map((a) => this.findOne(a.id)));
  }

  async findOne(id: string): Promise<StockAdjustmentResponseDto> {
    const adjustment = await this.stockAdjustmentRepository.findOne({
      where: { id },
      relations: ['lines'],
    });

    if (!adjustment) {
      throw new NotFoundException(`Stock adjustment with ID ${id} not found`);
    }

    return this.mapToResponseDto(adjustment);
  }

  async update(
    id: string,
    updateDto: UpdateStockAdjustmentDto,
  ): Promise<StockAdjustmentResponseDto> {
    const adjustment = await this.stockAdjustmentRepository.findOne({
      where: { id },
    });

    if (!adjustment) {
      throw new NotFoundException(`Stock adjustment with ID ${id} not found`);
    }

    if (adjustment.status !== AdjustmentStatus.DRAFT) {
      throw new BadRequestException('Can only update draft adjustments');
    }

    Object.assign(adjustment, updateDto);
    await this.stockAdjustmentRepository.save(adjustment);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const adjustment = await this.stockAdjustmentRepository.findOne({
      where: { id },
    });

    if (!adjustment) {
      throw new NotFoundException(`Stock adjustment with ID ${id} not found`);
    }

    if (adjustment.isPosted) {
      throw new BadRequestException('Cannot delete posted adjustment');
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(StockAdjustmentLine, { stockAdjustmentId: id });
      await manager.delete(StockAdjustment, { id });
    });
  }

  async submit(id: string): Promise<StockAdjustmentResponseDto> {
    const adjustment = await this.stockAdjustmentRepository.findOne({
      where: { id },
    });

    if (!adjustment) {
      throw new NotFoundException(`Stock adjustment with ID ${id} not found`);
    }

    adjustment.status = AdjustmentStatus.SUBMITTED;
    await this.stockAdjustmentRepository.save(adjustment);
    return this.findOne(id);
  }

  async approve(id: string): Promise<StockAdjustmentResponseDto> {
    const adjustment = await this.stockAdjustmentRepository.findOne({
      where: { id },
    });

    if (!adjustment) {
      throw new NotFoundException(`Stock adjustment with ID ${id} not found`);
    }

    adjustment.status = AdjustmentStatus.APPROVED;
    adjustment.approvedAt = new Date();
    await this.stockAdjustmentRepository.save(adjustment);
    return this.findOne(id);
  }

  async reject(id: string, rejectData: any): Promise<StockAdjustmentResponseDto> {
    const adjustment = await this.stockAdjustmentRepository.findOne({
      where: { id },
    });

    if (!adjustment) {
      throw new NotFoundException(`Stock adjustment with ID ${id} not found`);
    }

    adjustment.status = AdjustmentStatus.REJECTED;
    adjustment.rejectedAt = new Date();
    adjustment.rejectionReason = rejectData.reason;
    await this.stockAdjustmentRepository.save(adjustment);
    return this.findOne(id);
  }

  async post(id: string): Promise<StockAdjustmentResponseDto> {
    const adjustment = await this.stockAdjustmentRepository.findOne({
      where: { id },
      relations: ['lines'],
    });

    if (!adjustment) {
      throw new NotFoundException(`Stock adjustment with ID ${id} not found`);
    }

    if (adjustment.status !== AdjustmentStatus.APPROVED) {
      throw new BadRequestException('Adjustment must be approved before posting');
    }

    // Create stock entry and update balances
    adjustment.status = AdjustmentStatus.POSTED;
    adjustment.isPosted = true;
    adjustment.postedAt = new Date();
    await this.stockAdjustmentRepository.save(adjustment);

    return this.findOne(id);
  }

  private async generateAdjustmentNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.stockAdjustmentRepository.count();
    return `ADJ-${year}-${String(count + 1).padStart(6, '0')}`;
  }

  private mapToResponseDto(
    adjustment: StockAdjustment,
  ): StockAdjustmentResponseDto {
    return {
      ...adjustment,
      lines: adjustment.lines?.map((line) => ({ ...line })) || [],
    } as any;
  }
}
