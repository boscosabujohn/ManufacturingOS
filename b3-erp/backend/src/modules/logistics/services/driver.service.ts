import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver, DriverStatus } from '../entities';
import {
  CreateDriverDto,
  UpdateDriverDto,
  DriverResponseDto,
} from '../dto';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
  ) {}

  async create(createDto: CreateDriverDto): Promise<DriverResponseDto> {
    const existing = await this.driverRepository.findOne({
      where: { licenseNumber: createDto.licenseNumber },
    });

    if (existing) {
      throw new BadRequestException(
        `Driver with license ${createDto.licenseNumber} already exists`,
      );
    }

    const driver = this.driverRepository.create({
      ...createDto,
      status: DriverStatus.ACTIVE,
      isAvailable: true,
    });

    const saved = await this.driverRepository.save(driver);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: any): Promise<DriverResponseDto[]> {
    const query = this.driverRepository.createQueryBuilder('driver');

    if (filters?.status) {
      query.andWhere('driver.status = :status', { status: filters.status });
    }

    if (filters?.isAvailable !== undefined) {
      query.andWhere('driver.isAvailable = :available', {
        available: filters.isAvailable,
      });
    }

    if (filters?.transportCompanyId) {
      query.andWhere('driver.transportCompanyId = :companyId', {
        companyId: filters.transportCompanyId,
      });
    }

    query.orderBy('driver.fullName', 'ASC');
    const drivers = await query.getMany();
    return drivers.map((d) => this.mapToResponseDto(d));
  }

  async findAvailable(): Promise<DriverResponseDto[]> {
    const drivers = await this.driverRepository.find({
      where: { status: DriverStatus.ACTIVE, isAvailable: true },
      order: { fullName: 'ASC' },
    });
    return drivers.map((d) => this.mapToResponseDto(d));
  }

  async findOne(id: string): Promise<DriverResponseDto> {
    const driver = await this.driverRepository.findOne({
      where: { id },
      relations: ['trips'],
    });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }

    return this.mapToResponseDto(driver);
  }

  async update(
    id: string,
    updateDto: UpdateDriverDto,
  ): Promise<DriverResponseDto> {
    const driver = await this.driverRepository.findOne({ where: { id } });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }

    Object.assign(driver, updateDto);
    const updated = await this.driverRepository.save(driver);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const driver = await this.driverRepository.findOne({ where: { id } });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }

    await this.driverRepository.remove(driver);
  }

  async markOnTrip(id: string, tripId: string): Promise<DriverResponseDto> {
    const driver = await this.driverRepository.findOne({ where: { id } });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }

    driver.status = DriverStatus.ON_TRIP;
    driver.isAvailable = false;
    driver.currentTripId = tripId;
    driver.totalTrips += 1;

    const updated = await this.driverRepository.save(driver);
    return this.mapToResponseDto(updated);
  }

  async markAvailable(id: string): Promise<DriverResponseDto> {
    const driver = await this.driverRepository.findOne({ where: { id } });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }

    driver.status = DriverStatus.ACTIVE;
    driver.isAvailable = true;
    driver.currentTripId = null as unknown as string;

    const updated = await this.driverRepository.save(driver);
    return this.mapToResponseDto(updated);
  }

  async getDriverPerformance(id: string): Promise<any> {
    const driver = await this.driverRepository.findOne({ where: { id } });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }

    return {
      driverId: driver.id,
      driverCode: driver.driverCode,
      fullName: driver.fullName,
      totalTrips: driver.totalTrips,
      totalDistance: driver.totalDistanceCovered,
      safetyRating: driver.safetyRating,
      performanceRating: driver.performanceRating,
      onTimeDeliveryRate: driver.onTimeDeliveryRate,
      accidentCount: driver.accidentCount,
    };
  }

  private mapToResponseDto(driver: Driver): DriverResponseDto {
    return {
      ...driver,
    } as DriverResponseDto;
  }
}
