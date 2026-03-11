import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateWarehouseDto,
  UpdateWarehouseDto,
  WarehouseResponseDto,
} from '../dto';

@Injectable()
export class WarehouseService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(createDto: CreateWarehouseDto): Promise<WarehouseResponseDto> {
    // Check if warehouse code already exists
    const existing = await this.prisma.warehouse.findUnique({
      where: { warehouseCode: createDto.warehouseCode },
    });

    if (existing) {
      throw new BadRequestException(
        `Warehouse with code ${createDto.warehouseCode} already exists`,
      );
    }

    const warehouse = await this.prisma.warehouse.create({
      data: {
        ...createDto,
        status: 'Active' as any,
        warehouseType: (createDto.warehouseType as any) || 'Main Warehouse',
        currentUtilization: 0,
      } as any,
    });

    return this.mapToResponseDto(warehouse);
  }

  async findAll(filters?: any): Promise<WarehouseResponseDto[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.type) {
      where.warehouseType = filters.type;
    }

    if (filters?.branchId) {
      where.branchId = filters.branchId;
    }

    const warehouses = await this.prisma.warehouse.findMany({
      where,
      orderBy: { warehouseName: 'asc' },
    });
    return warehouses.map((w) => this.mapToResponseDto(w));
  }

  async findActive(): Promise<WarehouseResponseDto[]> {
    const warehouses = await this.prisma.warehouse.findMany({
      where: { status: 'Active' },
      orderBy: { warehouseName: 'asc' },
    });
    return warehouses.map((w) => this.mapToResponseDto(w));
  }

  async findOne(id: string): Promise<WarehouseResponseDto> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      // include: { locations: true }, // Add if locations relation is needed
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    return this.mapToResponseDto(warehouse);
  }

  async getLocations(id: string): Promise<any[]> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      // include: { locations: true },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    return (warehouse as any).locations || [];
  }

  async getStockSummary(id: string): Promise<any> {
    const warehouse = await this.findOne(id);

    // In a real system, we'd query stock balances
    const balances = await this.prisma.stockBalance.aggregate({
      where: { warehouseId: id },
      _sum: {
        totalQuantity: true,
        stockValue: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      warehouseId: id,
      warehouseName: warehouse.warehouseName,
      totalItems: balances._count.id,
      totalQuantity: balances._sum.totalQuantity || 0,
      totalValue: balances._sum.stockValue || 0,
      locationCount: 0, // Should come from locations count
      utilizationPercentage: warehouse.currentUtilization,
    };
  }

  async getCapacityUtilization(): Promise<any> {
    const warehouses = await this.prisma.warehouse.findMany({
      where: { status: 'Active' },
    });

    return warehouses.map((w) => {
      const storageCapacity = Number(w.storageCapacity || 0);
      const currentUtilization = Number(w.currentUtilization || 0);
      return {
        warehouseId: w.id,
        warehouseCode: w.warehouseCode,
        warehouseName: w.warehouseName,
        totalCapacity: storageCapacity,
        currentUtilization: currentUtilization,
        availableCapacity: storageCapacity > 0
          ? storageCapacity * (1 - currentUtilization / 100)
          : 0,
      };
    });
  }

  async update(
    id: string,
    updateDto: UpdateWarehouseDto,
  ): Promise<WarehouseResponseDto> {
    const updated = await this.prisma.warehouse.update({
      where: { id },
      data: updateDto as any,
    });
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    // Check if warehouse has active stock
    const stockCount = await this.prisma.stockBalance.count({
      where: {
        warehouseId: id,
        totalQuantity: { gt: 0 },
      },
    });

    if (stockCount > 0) {
      throw new BadRequestException(
        'Cannot delete warehouse with active stock',
      );
    }

    await this.prisma.warehouse.delete({
      where: { id },
    });
  }

  async activate(id: string): Promise<WarehouseResponseDto> {
    const updated = await this.prisma.warehouse.update({
      where: { id },
      data: { status: 'Active' },
    });
    return this.mapToResponseDto(updated);
  }

  async deactivate(id: string): Promise<WarehouseResponseDto> {
    const updated = await this.prisma.warehouse.update({
      where: { id },
      data: { status: 'Inactive' },
    });
    return this.mapToResponseDto(updated);
  }

  private mapToResponseDto(warehouse: any): WarehouseResponseDto {
    return {
      ...warehouse,
    } as WarehouseResponseDto;
  }
}
