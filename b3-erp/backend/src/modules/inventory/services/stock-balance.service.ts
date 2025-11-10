import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockBalance } from '../entities/stock-balance.entity';
import {
  CreateStockBalanceDto,
  UpdateStockBalanceDto,
  StockBalanceResponseDto,
} from '../dto';

@Injectable()
export class StockBalanceService {
  constructor(
    @InjectRepository(StockBalance)
    private readonly stockBalanceRepository: Repository<StockBalance>,
  ) {}

  async create(createDto: CreateStockBalanceDto): Promise<StockBalanceResponseDto> {
    const balance = this.stockBalanceRepository.create({
      ...createDto,
      totalQuantity: createDto.availableQuantity,
      freeQuantity: createDto.availableQuantity,
      reservedQuantity: 0,
      stockValue: createDto.availableQuantity * (createDto.valuationRate || 0),
    });

    const saved = await this.stockBalanceRepository.save(balance);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: any): Promise<StockBalanceResponseDto[]> {
    const query = this.stockBalanceRepository.createQueryBuilder('balance');

    if (filters?.itemId) {
      query.andWhere('balance.itemId = :itemId', { itemId: filters.itemId });
    }

    if (filters?.warehouseId) {
      query.andWhere('balance.warehouseId = :warehouseId', {
        warehouseId: filters.warehouseId,
      });
    }

    if (filters?.locationId) {
      query.andWhere('balance.locationId = :locationId', {
        locationId: filters.locationId,
      });
    }

    query.orderBy('balance.itemCode', 'ASC');
    const balances = await query.getMany();
    return balances.map((b) => this.mapToResponseDto(b));
  }

  async getRealTimeBalance(itemId: string, warehouseId: string): Promise<any> {
    const balances = await this.stockBalanceRepository.find({
      where: { itemId, warehouseId },
    });

    const totalAvailable = balances.reduce(
      (sum, b) => sum + Number(b.availableQuantity),
      0,
    );
    const totalReserved = balances.reduce(
      (sum, b) => sum + Number(b.reservedQuantity),
      0,
    );
    const totalFree = balances.reduce((sum, b) => sum + Number(b.freeQuantity), 0);

    return {
      itemId,
      warehouseId,
      totalAvailable,
      totalReserved,
      totalFree,
      locations: balances.map((b) => ({
        locationId: b.locationId,
        locationName: b.locationName,
        available: b.availableQuantity,
        reserved: b.reservedQuantity,
        free: b.freeQuantity,
      })),
    };
  }

  async getAgingReport(warehouseId?: string): Promise<any> {
    const query = this.stockBalanceRepository.createQueryBuilder('balance');

    if (warehouseId) {
      query.where('balance.warehouseId = :warehouseId', { warehouseId });
    }

    const balances = await query.getMany();

    return {
      reportDate: new Date(),
      warehouseId,
      agingBuckets: [
        { range: '0-30 days', count: 0, value: 0 },
        { range: '31-60 days', count: 0, value: 0 },
        { range: '61-90 days', count: 0, value: 0 },
        { range: '90-180 days', count: 0, value: 0 },
        { range: '180+ days', count: 0, value: 0 },
      ],
    };
  }

  async getABCAnalysis(warehouseId?: string): Promise<any> {
    const query = this.stockBalanceRepository.createQueryBuilder('balance');

    if (warehouseId) {
      query.where('balance.warehouseId = :warehouseId', { warehouseId });
    }

    const balances = await query.getMany();

    return {
      reportDate: new Date(),
      warehouseId,
      aClass: { count: 0, value: 0, percentage: 70 },
      bClass: { count: 0, value: 0, percentage: 20 },
      cClass: { count: 0, value: 0, percentage: 10 },
    };
  }

  async getValuationReport(warehouseId?: string, asOfDate?: string): Promise<any> {
    const query = this.stockBalanceRepository.createQueryBuilder('balance');

    if (warehouseId) {
      query.where('balance.warehouseId = :warehouseId', { warehouseId });
    }

    const balances = await query.getMany();
    const totalValue = balances.reduce((sum, b) => sum + Number(b.stockValue), 0);

    return {
      reportDate: asOfDate || new Date(),
      warehouseId,
      totalValue,
      itemCount: balances.length,
      byCategory: [],
    };
  }

  async getReorderAnalysis(warehouseId?: string): Promise<any> {
    const query = this.stockBalanceRepository.createQueryBuilder('balance');

    query.where('balance.belowReorderLevel = :belowReorder', {
      belowReorder: true,
    });

    if (warehouseId) {
      query.andWhere('balance.warehouseId = :warehouseId', { warehouseId });
    }

    const balances = await query.getMany();

    return {
      reportDate: new Date(),
      warehouseId,
      itemsBelowReorder: balances.map((b) => ({
        itemId: b.itemId,
        itemCode: b.itemCode,
        itemName: b.itemName,
        currentQuantity: b.availableQuantity,
        reorderLevel: b.reorderLevel,
        reorderQuantity: b.reorderQuantity,
        shortage: Number(b.reorderLevel) - Number(b.availableQuantity),
      })),
    };
  }

  async findOne(id: string): Promise<StockBalanceResponseDto> {
    const balance = await this.stockBalanceRepository.findOne({
      where: { id },
    });

    if (!balance) {
      throw new NotFoundException(`Stock balance with ID ${id} not found`);
    }

    return this.mapToResponseDto(balance);
  }

  async update(
    id: string,
    updateDto: UpdateStockBalanceDto,
  ): Promise<StockBalanceResponseDto> {
    const balance = await this.stockBalanceRepository.findOne({
      where: { id },
    });

    if (!balance) {
      throw new NotFoundException(`Stock balance with ID ${id} not found`);
    }

    Object.assign(balance, updateDto);
    const updated = await this.stockBalanceRepository.save(balance);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const balance = await this.stockBalanceRepository.findOne({
      where: { id },
    });

    if (!balance) {
      throw new NotFoundException(`Stock balance with ID ${id} not found`);
    }

    await this.stockBalanceRepository.remove(balance);
  }

  private mapToResponseDto(balance: StockBalance): StockBalanceResponseDto {
    return {
      ...balance,
    } as StockBalanceResponseDto;
  }
}
