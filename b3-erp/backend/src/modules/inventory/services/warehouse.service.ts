import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse, WarehouseStatus } from '../entities/warehouse.entity';
import {
  CreateWarehouseDto,
  UpdateWarehouseDto,
  WarehouseResponseDto,
} from '../dto';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  async create(createDto: CreateWarehouseDto): Promise<WarehouseResponseDto> {
    // Check if warehouse code already exists
    const existing = await this.warehouseRepository.findOne({
      where: { warehouseCode: createDto.warehouseCode },
    });

    if (existing) {
      throw new BadRequestException(
        `Warehouse with code ${createDto.warehouseCode} already exists`,
      );
    }

    const warehouse = this.warehouseRepository.create({
      ...createDto,
      status: WarehouseStatus.ACTIVE,
      currentUtilization: 0,
    });

    const saved = await this.warehouseRepository.save(warehouse);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: any): Promise<WarehouseResponseDto[]> {
    const query = this.warehouseRepository.createQueryBuilder('warehouse');

    if (filters?.status) {
      query.andWhere('warehouse.status = :status', { status: filters.status });
    }

    if (filters?.type) {
      query.andWhere('warehouse.warehouseType = :type', {
        type: filters.type,
      });
    }

    if (filters?.branchId) {
      query.andWhere('warehouse.branchId = :branchId', {
        branchId: filters.branchId,
      });
    }

    query.orderBy('warehouse.warehouseName', 'ASC');
    const warehouses = await query.getMany();
    return warehouses.map((w) => this.mapToResponseDto(w));
  }

  async findActive(): Promise<WarehouseResponseDto[]> {
    const warehouses = await this.warehouseRepository.find({
      where: { status: WarehouseStatus.ACTIVE },
      order: { warehouseName: 'ASC' },
    });
    return warehouses.map((w) => this.mapToResponseDto(w));
  }

  async findOne(id: string): Promise<WarehouseResponseDto> {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
      relations: ['locations'],
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    return this.mapToResponseDto(warehouse);
  }

  async getLocations(id: string): Promise<any[]> {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
      relations: ['locations'],
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    return warehouse.locations || [];
  }

  async getStockSummary(id: string): Promise<any> {
    const warehouse = await this.findOne(id);

    // Placeholder for actual stock summary calculation
    return {
      warehouseId: id,
      warehouseName: warehouse.warehouseName,
      totalItems: 0,
      totalQuantity: 0,
      totalValue: 0,
      locationCount: 0,
      utilizationPercentage: warehouse.currentUtilization,
    };
  }

  async getCapacityUtilization(): Promise<any> {
    const warehouses = await this.warehouseRepository.find({
      where: { status: WarehouseStatus.ACTIVE },
    });

    return warehouses.map((w) => ({
      warehouseId: w.id,
      warehouseCode: w.warehouseCode,
      warehouseName: w.warehouseName,
      totalCapacity: w.storageCapacity,
      currentUtilization: w.currentUtilization,
      availableCapacity: w.storageCapacity
        ? w.storageCapacity * (1 - (w.currentUtilization || 0) / 100)
        : null,
    }));
  }

  async update(
    id: string,
    updateDto: UpdateWarehouseDto,
  ): Promise<WarehouseResponseDto> {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    // If updating warehouse code, check for duplicates
    if (
      updateDto.warehouseCode &&
      updateDto.warehouseCode !== warehouse.warehouseCode
    ) {
      const existing = await this.warehouseRepository.findOne({
        where: { warehouseCode: updateDto.warehouseCode },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException(
          `Warehouse code ${updateDto.warehouseCode} already exists`,
        );
      }
    }

    Object.assign(warehouse, updateDto);
    const updated = await this.warehouseRepository.save(warehouse);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    // Check if warehouse has active stock
    // This would require checking stock_balances table
    // Placeholder logic
    const hasStock = false; // await this.checkIfWarehouseHasStock(id);

    if (hasStock) {
      throw new BadRequestException(
        'Cannot delete warehouse with active stock',
      );
    }

    await this.warehouseRepository.remove(warehouse);
  }

  async activate(id: string): Promise<WarehouseResponseDto> {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    warehouse.status = WarehouseStatus.ACTIVE;
    const updated = await this.warehouseRepository.save(warehouse);
    return this.mapToResponseDto(updated);
  }

  async deactivate(id: string): Promise<WarehouseResponseDto> {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    warehouse.status = WarehouseStatus.INACTIVE;
    const updated = await this.warehouseRepository.save(warehouse);
    return this.mapToResponseDto(updated);
  }

  private mapToResponseDto(warehouse: Warehouse): WarehouseResponseDto {
    return {
      ...warehouse,
    } as WarehouseResponseDto;
  }
}
