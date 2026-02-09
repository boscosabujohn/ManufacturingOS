import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  StockEntry,
  StockEntryLine,
  StockEntryStatus,
  MovementDirection,
  StockEntryType,
} from '../entities/stock-entry.entity';
import { StockValuationService } from './stock-valuation.service';
import { StockBalanceService } from './stock-balance.service';
import { StockBalance } from '../entities/stock-balance.entity';
import {
  CreateStockEntryDto,
  UpdateStockEntryDto,
  StockEntryResponseDto,
} from '../dto';

@Injectable()
export class StockEntryService {
  constructor(
    @InjectRepository(StockEntry)
    private readonly stockEntryRepository: Repository<StockEntry>,
    @InjectRepository(StockEntryLine)
    private readonly stockEntryLineRepository: Repository<StockEntryLine>,
    private readonly stockValuationService: StockValuationService,
    private readonly stockBalanceService: StockBalanceService,
    private readonly dataSource: DataSource,
  ) { }

  async create(createDto: CreateStockEntryDto): Promise<StockEntryResponseDto> {
    return await this.dataSource.transaction(async (manager) => {
      const entryNumber = await this.generateEntryNumber(createDto.entryType);
      const movementDirection = this.getMovementDirection(createDto.entryType);

      // Calculate total value
      const totalValue = createDto.lines.reduce(
        (sum, line) => sum + (line.quantity * (line.rate || 0)),
        0,
      ) + (createDto.additionalCosts || 0);

      const stockEntry = manager.create(StockEntry, {
        ...createDto,
        entryNumber,
        movementDirection,
        postingTime: new Date(),
        totalValue,
        status: StockEntryStatus.DRAFT,
        isPosted: false,
      });

      const saved = await manager.save(StockEntry, stockEntry);

      // Create lines
      const lines = createDto.lines.map((lineDto) => {
        const amount = lineDto.quantity * (lineDto.rate || 0);
        return manager.create(StockEntryLine, {
          ...lineDto,
          stockEntryId: saved.id,
          amount,
          stockQuantity: lineDto.quantity,
          stockUom: lineDto.uom,
        });
      });

      await manager.save(StockEntryLine, lines);

      return this.findOne(saved.id);
    });
  }

  async findAll(filters?: any): Promise<StockEntryResponseDto[]> {
    const query = this.stockEntryRepository.createQueryBuilder('stockEntry');

    if (filters?.status) {
      query.andWhere('stockEntry.status = :status', { status: filters.status });
    }

    if (filters?.entryType) {
      query.andWhere('stockEntry.entryType = :entryType', {
        entryType: filters.entryType,
      });
    }

    if (filters?.warehouseId) {
      query.andWhere(
        '(stockEntry.fromWarehouseId = :warehouseId OR stockEntry.toWarehouseId = :warehouseId)',
        { warehouseId: filters.warehouseId },
      );
    }

    if (filters?.startDate) {
      query.andWhere('stockEntry.postingDate >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters?.endDate) {
      query.andWhere('stockEntry.postingDate <= :endDate', {
        endDate: filters.endDate,
      });
    }

    query.orderBy('stockEntry.postingDate', 'DESC');
    const entries = await query.getMany();
    return Promise.all(entries.map((e) => this.findOne(e.id)));
  }

  async getPendingPost(): Promise<StockEntryResponseDto[]> {
    const entries = await this.stockEntryRepository.find({
      where: { status: StockEntryStatus.SUBMITTED, isPosted: false },
      order: { postingDate: 'ASC' },
    });
    return Promise.all(entries.map((e) => this.findOne(e.id)));
  }

  async getStockLedger(filters?: any): Promise<any> {
    // Placeholder for stock ledger report
    return {
      filters,
      entries: [],
      summary: {
        openingBalance: 0,
        totalIn: 0,
        totalOut: 0,
        closingBalance: 0,
      },
    };
  }

  async findOne(id: string): Promise<StockEntryResponseDto> {
    const entry = await this.stockEntryRepository.findOne({
      where: { id },
      relations: ['lines'],
    });

    if (!entry) {
      throw new NotFoundException(`Stock entry with ID ${id} not found`);
    }

    return this.mapToResponseDto(entry);
  }

  async update(
    id: string,
    updateDto: UpdateStockEntryDto,
  ): Promise<StockEntryResponseDto> {
    const entry = await this.stockEntryRepository.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`Stock entry with ID ${id} not found`);
    }

    if (entry.isPosted) {
      throw new BadRequestException('Cannot update posted stock entry');
    }

    // Update logic would go here
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const entry = await this.stockEntryRepository.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`Stock entry with ID ${id} not found`);
    }

    if (entry.isPosted) {
      throw new BadRequestException('Cannot delete posted stock entry');
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(StockEntryLine, { stockEntryId: id });
      await manager.delete(StockEntry, { id });
    });
  }

  async submit(id: string): Promise<StockEntryResponseDto> {
    const entry = await this.stockEntryRepository.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`Stock entry with ID ${id} not found`);
    }

    entry.status = StockEntryStatus.SUBMITTED;
    await this.stockEntryRepository.save(entry);
    return this.findOne(id);
  }

  async post(id: string): Promise<StockEntryResponseDto> {
    const entry = await this.stockEntryRepository.findOne({
      where: { id },
      relations: ['lines'],
    });

    if (!entry) {
      throw new NotFoundException(`Stock entry with ID ${id} not found`);
    }

    if (entry.isPosted) {
      throw new BadRequestException('Stock entry already posted');
    }

    return await this.dataSource.transaction(async (manager) => {
      for (const line of entry.lines) {
        // 1. Process IN movement (Receipt)
        if (line.toLocationId) {
          const warehouseId = line.toLocationId.split(':')[0]; // Assuming format 'warehouseId:locationId' or just warehouseId

          let balance = await manager.findOne(StockBalance, {
            where: { itemId: line.itemId, warehouseId }
          });

          if (!balance) {
            balance = manager.create(StockBalance, {
              itemId: line.itemId,
              itemCode: line.itemCode,
              itemName: line.itemName,
              warehouseId,
              availableQuantity: 0,
              valuationRate: 0,
              uom: line.uom,
            });
          }

          const method = (balance.valuationMethod as any) || 'Weighted Average';
          const { valuationRate, stockValue } = await this.stockValuationService.calculateNewRate(
            line.itemId,
            warehouseId,
            method,
            Number(line.quantity),
            Number(line.rate),
            balance
          );

          balance.availableQuantity = Number(balance.availableQuantity) + Number(line.quantity);
          balance.totalQuantity = Number(balance.totalQuantity) + Number(line.quantity);
          balance.freeQuantity = Number(balance.freeQuantity) + Number(line.quantity);
          balance.valuationRate = valuationRate;
          balance.stockValue = stockValue;
          balance.lastReceiptDate = new Date();

          await manager.save(StockBalance, balance);
        }

        // 2. Process OUT movement (Issue)
        if (line.fromLocationId) {
          const warehouseId = line.fromLocationId.split(':')[0];

          const balance = await manager.findOne(StockBalance, {
            where: { itemId: line.itemId, warehouseId }
          });

          if (!balance || Number(balance.availableQuantity) < Number(line.quantity)) {
            throw new BadRequestException(`Insufficient stock for item ${line.itemCode} in warehouse ${warehouseId}`);
          }

          const method = (balance.valuationMethod as any) || 'Weighted Average';
          const { averageRate } = await this.stockValuationService.calculateIssueValue(
            line.itemId,
            warehouseId,
            Number(line.quantity),
            method
          );

          // Update the line's rate to reflect the valuation at time of issue
          line.rate = averageRate;
          line.amount = averageRate * Number(line.quantity);
          await manager.save(StockEntryLine, line);

          balance.availableQuantity = Number(balance.availableQuantity) - Number(line.quantity);
          balance.totalQuantity = Number(balance.totalQuantity) - Number(line.quantity);
          balance.freeQuantity = Number(balance.freeQuantity) - Number(line.quantity);
          balance.stockValue = Number(balance.availableQuantity) * Number(balance.valuationRate);
          balance.lastIssueDate = new Date();

          await manager.save(StockBalance, balance);
        }
      }

      entry.status = StockEntryStatus.POSTED;
      entry.isPosted = true;
      entry.postedAt = new Date();
      const saved = await manager.save(StockEntry, entry);

      return this.mapToResponseDto(saved);
    });
  }

  async cancel(id: string): Promise<StockEntryResponseDto> {
    const entry = await this.stockEntryRepository.findOne({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`Stock entry with ID ${id} not found`);
    }

    if (entry.isPosted) {
      throw new BadRequestException('Cannot cancel posted stock entry');
    }

    entry.status = StockEntryStatus.CANCELLED;
    await this.stockEntryRepository.save(entry);
    return this.findOne(id);
  }

  private async generateEntryNumber(entryType: StockEntryType): Promise<string> {
    const prefix = this.getEntryPrefix(entryType);
    const year = new Date().getFullYear();
    const count = await this.stockEntryRepository.count();
    return `${prefix}-${year}-${String(count + 1).padStart(6, '0')}`;
  }

  private getEntryPrefix(entryType: StockEntryType): string {
    const prefixMap = {
      [StockEntryType.MATERIAL_RECEIPT]: 'MR',
      [StockEntryType.MATERIAL_ISSUE]: 'MI',
      [StockEntryType.MATERIAL_TRANSFER]: 'MT',
      [StockEntryType.PURCHASE_RECEIPT]: 'PR',
      [StockEntryType.PURCHASE_RETURN]: 'PRN',
      [StockEntryType.SALES_ISSUE]: 'SI',
      [StockEntryType.SALES_RETURN]: 'SRN',
      [StockEntryType.PRODUCTION_RECEIPT]: 'PD',
      [StockEntryType.PRODUCTION_ISSUE]: 'PI',
      [StockEntryType.OPENING_STOCK]: 'OS',
      [StockEntryType.REPACK]: 'RPK',
      [StockEntryType.SCRAP]: 'SCP',
      [StockEntryType.STOCK_RECONCILIATION]: 'SR',
    };
    return prefixMap[entryType] || 'SE';
  }

  private getMovementDirection(entryType: StockEntryType): MovementDirection {
    const inTypes = [
      StockEntryType.MATERIAL_RECEIPT,
      StockEntryType.PURCHASE_RECEIPT,
      StockEntryType.SALES_RETURN,
      StockEntryType.PRODUCTION_RECEIPT,
      StockEntryType.OPENING_STOCK,
    ];

    const outTypes = [
      StockEntryType.MATERIAL_ISSUE,
      StockEntryType.PURCHASE_RETURN,
      StockEntryType.SALES_ISSUE,
      StockEntryType.PRODUCTION_ISSUE,
      StockEntryType.SCRAP,
    ];

    if (inTypes.includes(entryType)) return MovementDirection.IN;
    if (outTypes.includes(entryType)) return MovementDirection.OUT;
    return MovementDirection.INTERNAL;
  }

  private mapToResponseDto(entry: StockEntry): StockEntryResponseDto {
    return {
      ...entry,
      lines: entry.lines?.map((line) => ({ ...line })) || [],
    } as any;
  }
}
