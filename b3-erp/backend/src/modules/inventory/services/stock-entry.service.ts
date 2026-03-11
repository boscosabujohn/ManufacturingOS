import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StockValuationService } from './stock-valuation.service';
import { StockBalanceService } from './stock-balance.service';
import { AuditLogger } from '../../../common/logging/audit-logger.service';
import {
  CreateStockEntryDto,
  UpdateStockEntryDto,
  StockEntryResponseDto,
} from '../dto';

@Injectable()
export class StockEntryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stockValuationService: StockValuationService,
    private readonly stockBalanceService: StockBalanceService,
    private readonly auditLogger: AuditLogger,
  ) { }

  async create(createDto: CreateStockEntryDto): Promise<StockEntryResponseDto> {
    return await this.prisma.$transaction(async (tx) => {
      const entryNumber = await this.generateEntryNumber(createDto.entryType);
      const movementDirection = this.getMovementDirection(createDto.entryType);

      // Calculate total value
      const totalValue = createDto.lines.reduce(
        (sum, line) => sum + (Number(line.quantity) * (Number(line.rate) || 0)),
        0,
      ) + (Number(createDto.additionalCosts) || 0);

      const stockEntry = await tx.stockEntry.create({
        data: {
          entryNumber,
          entryType: createDto.entryType,
          movementDirection,
          postingDate: createDto.postingDate ? new Date(createDto.postingDate) : new Date(),
          postingTime: new Date(),
          totalValue,
          status: 'Draft',
          isPosted: false,
          referenceType: createDto.referenceType,
          referenceId: createDto.referenceId,
          referenceNumber: createDto.referenceNumber,
          fromWarehouseId: createDto.fromWarehouseId,
          toWarehouseId: createDto.toWarehouseId,
          currency: createDto.currency || 'INR',
          additionalCosts: Number(createDto.additionalCosts) || 0,
          remarks: createDto.remarks,
          createdBy: (createDto as any).createdBy || 'SYSTEM',
          lines: {
            create: createDto.lines.map((lineDto, index) => ({
              lineNumber: index + 1,
              itemId: lineDto.itemId,
              itemCode: lineDto.itemCode,
              itemName: lineDto.itemName,
              quantity: Number(lineDto.quantity),
              uom: lineDto.uom,
              rate: Number(lineDto.rate) || 0,
              amount: Number(lineDto.quantity) * (Number(lineDto.rate) || 0),
              stockQuantity: Number(lineDto.quantity),
              stockUom: lineDto.uom,
              fromLocationId: lineDto.fromLocationId,
              toLocationId: lineDto.toLocationId,
            })),
          },
        },
        include: { lines: true },
      });

      return this.mapToResponseDto(stockEntry);
    });
  }

  async findAll(filters?: any): Promise<StockEntryResponseDto[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.entryType) {
      where.entryType = filters.entryType;
    }

    if (filters?.warehouseId) {
      where.OR = [
        { fromWarehouseId: filters.warehouseId },
        { toWarehouseId: filters.warehouseId },
      ];
    }

    if (filters?.startDate) {
      where.postingDate = { gte: new Date(filters.startDate) };
    }

    if (filters?.endDate) {
      where.postingDate = { ...where.postingDate, lte: new Date(filters.endDate) };
    }

    const entries = await this.prisma.stockEntry.findMany({
      where,
      include: { lines: true },
      orderBy: { postingDate: 'desc' },
    });
    return entries.map((e) => this.mapToResponseDto(e));
  }

  async getPendingPost(): Promise<StockEntryResponseDto[]> {
    const entries = await this.prisma.stockEntry.findMany({
      where: { status: 'Submitted', isPosted: false },
      include: { lines: true },
      orderBy: { postingDate: 'asc' },
    });
    return entries.map((e) => this.mapToResponseDto(e));
  }

  async getStockLedger(filters?: any): Promise<any> {
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
    const entry = await this.prisma.stockEntry.findUnique({
      where: { id },
      include: { lines: true },
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
    const entry = await this.prisma.stockEntry.findUnique({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`Stock entry with ID ${id} not found`);
    }

    if (entry.isPosted) {
      throw new BadRequestException('Cannot update posted stock entry');
    }

    const updated = await this.prisma.stockEntry.update({
      where: { id },
      data: updateDto as any,
      include: { lines: true },
    });
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const entry = await this.prisma.stockEntry.findUnique({ where: { id } });

    if (!entry) {
      throw new NotFoundException(`Stock entry with ID ${id} not found`);
    }

    if (entry.isPosted) {
      throw new BadRequestException('Cannot delete posted stock entry');
    }

    await this.prisma.stockEntry.delete({
      where: { id },
    });
  }

  async submit(id: string): Promise<StockEntryResponseDto> {
    const updated = await this.prisma.stockEntry.update({
      where: { id },
      data: { status: 'Submitted' },
      include: { lines: true },
    });
    return this.mapToResponseDto(updated);
  }

  async post(id: string): Promise<StockEntryResponseDto> {
    const entry = await this.prisma.stockEntry.findUnique({
      where: { id },
      include: { lines: true },
    });

    if (!entry) {
      throw new NotFoundException(`Stock entry with ID ${id} not found`);
    }

    if (entry.isPosted) {
      throw new BadRequestException('Stock entry already posted');
    }

    return await this.prisma.$transaction(async (tx) => {
      for (const line of entry.lines) {
        // 1. Process IN movement (Receipt)
        if (line.toLocationId) {
          const warehouseId = line.toLocationId.split(':')[0];

          // Pessimistic Locking
          let balances: any[] = await tx.$queryRaw`
            SELECT * FROM "stock_balances" 
            WHERE "itemId" = ${line.itemId} AND "warehouseId" = ${warehouseId} 
            FOR UPDATE
          `;

          let balance: any;
          if (balances.length === 0) {
            balance = await tx.stockBalance.create({
              data: {
                itemId: line.itemId,
                itemCode: line.itemCode,
                itemName: line.itemName,
                warehouseId,
                warehouseName: '', // Should fetch if needed
                availableQuantity: 0,
                totalQuantity: 0,
                freeQuantity: 0,
                valuationRate: 0,
                uom: line.uom,
                stockValue: 0,
                lastUpdatedTime: new Date(),
              } as any,
            });
          } else {
            balance = balances[0];
          }

          const method = (balance.valuationMethod) || 'Weighted Average';
          const { valuationRate, stockValue } = await this.stockValuationService.calculateNewRate(
            line.itemId,
            warehouseId,
            method,
            Number(line.quantity),
            Number(line.rate),
            balance
          );

          await tx.stockBalance.update({
            where: { id: balance.id },
            data: {
              availableQuantity: Number(balance.availableQuantity) + Number(line.quantity),
              totalQuantity: Number(balance.totalQuantity) + Number(line.quantity),
              freeQuantity: Number(balance.freeQuantity) + Number(line.quantity),
              valuationRate: valuationRate,
              stockValue: stockValue,
              lastReceiptDate: new Date(),
              lastUpdatedTime: new Date(),
            },
          });
        }

        // 2. Process OUT movement (Issue)
        if (line.fromLocationId) {
          const warehouseId = line.fromLocationId.split(':')[0];

          // Pessimistic Locking
          const balances: any[] = await tx.$queryRaw`
            SELECT * FROM "stock_balances" 
            WHERE "itemId" = ${line.itemId} AND "warehouseId" = ${warehouseId} 
            FOR UPDATE
          `;

          if (balances.length === 0 || Number(balances[0].availableQuantity) < Number(line.quantity)) {
            throw new BadRequestException(`Insufficient stock for item ${line.itemCode} in warehouse ${warehouseId}`);
          }

          const balance = balances[0];
          const method = (balance.valuationMethod) || 'Weighted Average';
          const { averageRate } = await this.stockValuationService.calculateIssueValue(
            line.itemId,
            warehouseId,
            Number(line.quantity),
            method
          );

          // Update the line's rate to reflect the valuation at time of issue
          await tx.stockEntryLine.update({
            where: { id: line.id },
            data: {
              rate: averageRate,
              amount: averageRate * Number(line.quantity),
            },
          });

          const newAvailable = Number(balance.availableQuantity) - Number(line.quantity);
          await tx.stockBalance.update({
            where: { id: balance.id },
            data: {
              availableQuantity: newAvailable,
              totalQuantity: Number(balance.totalQuantity) - Number(line.quantity),
              freeQuantity: Number(balance.freeQuantity) - Number(line.quantity),
              stockValue: newAvailable * Number(balance.valuationRate),
              lastIssueDate: new Date(),
              lastUpdatedTime: new Date(),
            },
          });
        }
      }

      const posted = await tx.stockEntry.update({
        where: { id: entry.id },
        data: {
          status: 'Posted',
          isPosted: true,
          postedAt: new Date(),
          updatedBy: 'SYSTEM',
        },
        include: { lines: true },
      });

      this.auditLogger.logAction('STOCK_POST', entry.createdBy || 'SYSTEM', {
        entryId: entry.id,
        entryNumber: entry.entryNumber,
        type: entry.entryType,
        totalValue: entry.totalValue,
      });

      return this.mapToResponseDto(posted);
    });
  }

  async cancel(id: string): Promise<StockEntryResponseDto> {
    const updated = await this.prisma.stockEntry.update({
      where: { id },
      data: { status: 'Cancelled' },
      include: { lines: true },
    });
    return this.mapToResponseDto(updated);
  }

  private async generateEntryNumber(entryType: string): Promise<string> {
    const prefix = this.getEntryPrefix(entryType);
    const year = new Date().getFullYear();
    const count = await this.prisma.stockEntry.count();
    return `${prefix}-${year}-${String(count + 1).padStart(6, '0')}`;
  }

  private getEntryPrefix(entryType: string): string {
    const prefixMap: Record<string, string> = {
      'MATERIAL_RECEIPT': 'MR',
      'MATERIAL_ISSUE': 'MI',
      'MATERIAL_TRANSFER': 'MT',
      'PURCHASE_RECEIPT': 'PR',
      'PURCHASE_RETURN': 'PRN',
      'SALES_ISSUE': 'SI',
      'SALES_RETURN': 'SRN',
      'PRODUCTION_RECEIPT': 'PD',
      'PRODUCTION_ISSUE': 'PI',
      'OPENING_STOCK': 'OS',
      'REPACK': 'RPK',
      'SCRAP': 'SCP',
      'STOCK_RECONCILIATION': 'SR',
    };
    return prefixMap[entryType] || 'SE';
  }

  private getMovementDirection(entryType: string): string {
    const inTypes = [
      'MATERIAL_RECEIPT',
      'PURCHASE_RECEIPT',
      'SALES_RETURN',
      'PRODUCTION_RECEIPT',
      'OPENING_STOCK',
    ];

    const outTypes = [
      'MATERIAL_ISSUE',
      'PURCHASE_RETURN',
      'SALES_ISSUE',
      'PRODUCTION_ISSUE',
      'SCRAP',
    ];

    if (inTypes.includes(entryType)) return 'IN';
    if (outTypes.includes(entryType)) return 'OUT';
    return 'INTERNAL';
  }

  private mapToResponseDto(entry: any): StockEntryResponseDto {
    return {
      ...entry,
      lines: entry.lines?.map((line: any) => ({ ...line })) || [],
    } as any;
  }
}
