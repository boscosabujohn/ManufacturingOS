import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  StockLocation,
  LocationStatus,
} from '../entities/stock-location.entity';
import {
  CreateStockLocationDto,
  UpdateStockLocationDto,
  StockLocationResponseDto,
} from '../dto';

@Injectable()
export class StockLocationService {
  constructor(
    @InjectRepository(StockLocation)
    private readonly stockLocationRepository: Repository<StockLocation>,
  ) {}

  async create(
    createDto: CreateStockLocationDto,
  ): Promise<StockLocationResponseDto> {
    const existing = await this.stockLocationRepository.findOne({
      where: { locationCode: createDto.locationCode },
    });

    if (existing) {
      throw new BadRequestException(
        `Location with code ${createDto.locationCode} already exists`,
      );
    }

    const location = this.stockLocationRepository.create({
      ...createDto,
      status: LocationStatus.ACTIVE,
      currentCapacity: 0,
      utilizationPercentage: 0,
    });

    const saved = await this.stockLocationRepository.save(location);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: any): Promise<StockLocationResponseDto[]> {
    const query =
      this.stockLocationRepository.createQueryBuilder('stockLocation');

    if (filters?.warehouseId) {
      query.andWhere('stockLocation.warehouseId = :warehouseId', {
        warehouseId: filters.warehouseId,
      });
    }

    if (filters?.status) {
      query.andWhere('stockLocation.status = :status', {
        status: filters.status,
      });
    }

    query.orderBy('stockLocation.locationCode', 'ASC');
    const locations = await query.getMany();
    return locations.map((l) => this.mapToResponseDto(l));
  }

  async findByWarehouse(
    warehouseId: string,
  ): Promise<StockLocationResponseDto[]> {
    const locations = await this.stockLocationRepository.find({
      where: { warehouseId },
      order: { pickingSequence: 'ASC', locationCode: 'ASC' },
    });
    return locations.map((l) => this.mapToResponseDto(l));
  }

  async findAvailableForPutaway(
    warehouseId: string,
    itemId?: string,
  ): Promise<StockLocationResponseDto[]> {
    const query =
      this.stockLocationRepository.createQueryBuilder('stockLocation');

    query
      .where('stockLocation.warehouseId = :warehouseId', { warehouseId })
      .andWhere('stockLocation.status = :status', {
        status: LocationStatus.ACTIVE,
      });

    // If item is specified and location is fixed for specific item
    if (itemId) {
      query.andWhere(
        '(stockLocation.isFixedLocation = false OR stockLocation.fixedItemId = :itemId)',
        { itemId },
      );
    } else {
      query.andWhere('stockLocation.isFixedLocation = false');
    }

    query.orderBy('stockLocation.putawaySequence', 'ASC');
    const locations = await query.getMany();
    return locations.map((l) => this.mapToResponseDto(l));
  }

  async findOne(id: string): Promise<StockLocationResponseDto> {
    const location = await this.stockLocationRepository.findOne({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException(`Stock location with ID ${id} not found`);
    }

    return this.mapToResponseDto(location);
  }

  async getStockBalance(id: string): Promise<any> {
    const location = await this.findOne(id);

    // Placeholder for actual stock balance calculation
    return {
      locationId: id,
      locationCode: location.locationCode,
      currentCapacity: location.currentCapacity,
      maxCapacity: location.maxCapacity,
      utilizationPercentage: location.utilizationPercentage,
      items: [],
    };
  }

  async update(
    id: string,
    updateDto: UpdateStockLocationDto,
  ): Promise<StockLocationResponseDto> {
    const location = await this.stockLocationRepository.findOne({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException(`Stock location with ID ${id} not found`);
    }

    Object.assign(location, updateDto);
    const updated = await this.stockLocationRepository.save(location);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const location = await this.stockLocationRepository.findOne({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException(`Stock location with ID ${id} not found`);
    }

    // Check if location has stock
    if (location.currentCapacity > 0) {
      throw new BadRequestException(
        'Cannot delete location with active stock',
      );
    }

    await this.stockLocationRepository.remove(location);
  }

  async block(id: string): Promise<StockLocationResponseDto> {
    const location = await this.stockLocationRepository.findOne({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException(`Stock location with ID ${id} not found`);
    }

    location.status = LocationStatus.BLOCKED;
    const updated = await this.stockLocationRepository.save(location);
    return this.mapToResponseDto(updated);
  }

  async unblock(id: string): Promise<StockLocationResponseDto> {
    const location = await this.stockLocationRepository.findOne({
      where: { id },
    });

    if (!location) {
      throw new NotFoundException(`Stock location with ID ${id} not found`);
    }

    location.status = LocationStatus.ACTIVE;
    const updated = await this.stockLocationRepository.save(location);
    return this.mapToResponseDto(updated);
  }

  private mapToResponseDto(
    location: StockLocation,
  ): StockLocationResponseDto {
    return {
      ...location,
    } as StockLocationResponseDto;
  }
}
