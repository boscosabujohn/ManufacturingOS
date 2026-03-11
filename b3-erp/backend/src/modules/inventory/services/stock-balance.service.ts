import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateStockBalanceDto,
  UpdateStockBalanceDto,
  StockBalanceResponseDto,
} from '../dto';
import { EventBusService } from '../../workflow/services/event-bus.service';

@Injectable()
export class StockBalanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) { }

  async create(createDto: CreateStockBalanceDto): Promise<StockBalanceResponseDto> {
    const totalQuantity = Number(createDto.availableQuantity);
    const balance = await this.prisma.stockBalance.create({
      data: {
        ...createDto,
        availableQuantity: totalQuantity,
        totalQuantity: totalQuantity,
        freeQuantity: totalQuantity,
        reservedQuantity: 0,
        stockValue: totalQuantity * (createDto.valuationRate || 0),
        lastUpdatedTime: new Date(),
      } as any,
    });

    return this.mapToResponseDto(balance);
  }

  async findAll(filters?: any): Promise<StockBalanceResponseDto[]> {
    const where: any = {};

    if (filters?.itemId) {
      where.itemId = filters.itemId;
    }

    if (filters?.warehouseId) {
      where.warehouseId = filters.warehouseId;
    }

    if (filters?.locationId) {
      where.locationId = filters.locationId;
    }

    const balances = await this.prisma.stockBalance.findMany({
      where,
      orderBy: { itemCode: 'asc' },
    });
    return balances.map((b) => this.mapToResponseDto(b));
  }

  async getRealTimeBalance(itemId: string, warehouseId: string): Promise<any> {
    const balances = await this.prisma.stockBalance.findMany({
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
    const where: any = {};
    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    const balances = await this.prisma.stockBalance.findMany({ where });

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
    const where: any = {};
    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    const balances = await this.prisma.stockBalance.findMany({ where });

    return {
      reportDate: new Date(),
      warehouseId,
      aClass: { count: 0, value: 0, percentage: 70 },
      bClass: { count: 0, value: 0, percentage: 20 },
      cClass: { count: 0, value: 0, percentage: 10 },
    };
  }

  async getValuationReport(warehouseId?: string, asOfDate?: string): Promise<any> {
    const where: any = {};
    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    const balances = await this.prisma.stockBalance.findMany({ where });
    const totalValue = balances.reduce((sum: number, b: any) => sum + (Number(b.stockValue) || 0), 0);

    return {
      reportDate: asOfDate || new Date(),
      warehouseId,
      totalValue,
      itemCount: balances.length,
      byCategory: [],
    };
  }

  async getReorderAnalysis(warehouseId?: string): Promise<any> {
    const where: any = {
      isBelowReorderLevel: true, // Assuming this is the field name in Prisma
    };

    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    const balances = await this.prisma.stockBalance.findMany({ where });

    return {
      asOf: new Date(),
      itemCount: balances.length,
      itemsBelowReorder: balances.map((b: any) => ({
        itemId: b.itemId,
        itemCode: b.itemCode,
        itemName: b.itemName,
        available: b.availableQuantity,
        reorderLevel: b.reorderLevel,
      })),
    };
  }

  async findOne(id: string): Promise<StockBalanceResponseDto> {
    const balance = await this.prisma.stockBalance.findUnique({
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
    const updated = await this.prisma.stockBalance.update({
      where: { id },
      data: {
        ...updateDto,
        lastUpdatedTime: new Date(),
      } as any,
    });

    // Check if stock is below reorder level and emit event
    await this.checkAndEmitStockEvents(updated);

    return this.mapToResponseDto(updated);
  }

  /**
   * Check stock levels and emit appropriate events
   */
  private async checkAndEmitStockEvents(balance: any): Promise<void> {
    const availableQty = Number(balance.availableQuantity);
    const reorderLevel = Number(balance.reorderLevel || 0);

    // Emit STOCK_OUT event if stock is zero
    if (availableQty <= 0) {
      await this.eventBus.emitStockOut({
        itemId: balance.itemId,
        itemCode: balance.itemCode,
        itemName: balance.itemName,
        warehouseId: balance.warehouseId,
        warehouseName: balance.warehouseName || '',
        locationId: balance.locationId,
        quantity: availableQty,
        unit: balance.uom,
        currentStock: availableQty,
        reorderLevel,
        userId: 'system',
      });
    }
    // Emit STOCK_LOW event if below reorder level
    else if (reorderLevel > 0 && availableQty <= reorderLevel) {
      await this.eventBus.emitStockLow({
        itemId: balance.itemId,
        itemCode: balance.itemCode,
        itemName: balance.itemName,
        warehouseId: balance.warehouseId,
        warehouseName: balance.warehouseName || '',
        locationId: balance.locationId,
        quantity: availableQty,
        unit: balance.uom,
        currentStock: availableQty,
        reorderLevel,
        userId: 'system',
      });
    }
  }

  /**
   * Adjust stock balance and emit events
   */
  async adjustBalance(
    itemId: string,
    warehouseId: string,
    quantityChange: number,
    adjustedBy: string,
    reason?: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Pessimistic Locking with Raw SQL
      const balances: any[] = await tx.$queryRaw`
        SELECT * FROM "stock_balances" 
        WHERE "itemId" = ${itemId} AND "warehouseId" = ${warehouseId} 
        FOR UPDATE
      `;

      if (balances.length > 0) {
        const balance = balances[0];
        const newAvailable = Number(balance.availableQuantity) + quantityChange;
        const newTotal = Number(balance.totalQuantity) + quantityChange;
        const newFree = Number(balance.freeQuantity) + quantityChange;

        const updated = await tx.stockBalance.update({
          where: { id: balance.id },
          data: {
            availableQuantity: newAvailable,
            totalQuantity: newTotal,
            freeQuantity: newFree,
            lastUpdatedTime: new Date(),
            updatedBy: adjustedBy,
          },
        });

        await this.checkAndEmitStockEvents(updated);
      }
    });
  }

  /**
   * Reserve stock for a specific requirement
   */
  async reserveStock(
    itemId: string,
    warehouseId: string,
    quantity: number,
    userId: string,
  ): Promise<{ success: boolean; shortage: number }> {
    return await this.prisma.$transaction(async (tx) => {
      // Pessimistic Locking
      const balances: any[] = await tx.$queryRaw`
        SELECT * FROM "stock_balances" 
        WHERE "itemId" = ${itemId} AND "warehouseId" = ${warehouseId} 
        FOR UPDATE
      `;

      if (balances.length === 0) {
        return { success: false, shortage: quantity };
      }

      const balance = balances[0];
      const freeQty = Number(balance.freeQuantity);

      if (freeQty < quantity) {
        const shortage = quantity - freeQty;
        // Reserve what is available
        if (freeQty > 0) {
          await tx.stockBalance.update({
            where: { id: balance.id },
            data: {
              reservedQuantity: Number(balance.reservedQuantity) + freeQty,
              freeQuantity: 0,
              lastUpdatedTime: new Date(),
              updatedBy: userId,
            },
          });
        }
        return { success: false, shortage };
      }

      await tx.stockBalance.update({
        where: { id: balance.id },
        data: {
          reservedQuantity: Number(balance.reservedQuantity) + quantity,
          freeQuantity: Number(balance.freeQuantity) - quantity,
          lastUpdatedTime: new Date(),
          updatedBy: userId,
        },
      });

      return { success: true, shortage: 0 };
    });
  }

  /**
   * Release reserved stock
   */
  async releaseStock(
    itemId: string,
    warehouseId: string,
    quantity: number,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Pessimistic Locking
      const balances: any[] = await tx.$queryRaw`
        SELECT * FROM "stock_balances" 
        WHERE "itemId" = ${itemId} AND "warehouseId" = ${warehouseId} 
        FOR UPDATE
      `;

      if (balances.length > 0) {
        const balance = balances[0];
        const releaseQty = Math.min(Number(balance.reservedQuantity), quantity);

        await tx.stockBalance.update({
          where: { id: balance.id },
          data: {
            reservedQuantity: Number(balance.reservedQuantity) - releaseQty,
            freeQuantity: Number(balance.freeQuantity) + releaseQty,
            lastUpdatedTime: new Date(),
          },
        });
      }
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.stockBalance.delete({
      where: { id },
    });
  }

  private mapToResponseDto(balance: any): StockBalanceResponseDto {
    return {
      ...balance,
    } as StockBalanceResponseDto;
  }
}
