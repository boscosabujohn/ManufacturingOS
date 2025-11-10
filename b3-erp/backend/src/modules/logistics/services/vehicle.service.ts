import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle, VehicleStatus } from '../entities';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleResponseDto,
} from '../dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(createDto: CreateVehicleDto): Promise<VehicleResponseDto> {
    const existing = await this.vehicleRepository.findOne({
      where: { registrationNumber: createDto.registrationNumber },
    });

    if (existing) {
      throw new BadRequestException(
        `Vehicle with registration ${createDto.registrationNumber} already exists`,
      );
    }

    const vehicle = this.vehicleRepository.create({
      ...createDto,
      status: VehicleStatus.ACTIVE,
    });

    const saved = await this.vehicleRepository.save(vehicle);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: any): Promise<VehicleResponseDto[]> {
    const query = this.vehicleRepository.createQueryBuilder('vehicle');

    if (filters?.status) {
      query.andWhere('vehicle.status = :status', { status: filters.status });
    }

    if (filters?.vehicleType) {
      query.andWhere('vehicle.vehicleType = :type', {
        type: filters.vehicleType,
      });
    }

    if (filters?.transportCompanyId) {
      query.andWhere('vehicle.transportCompanyId = :companyId', {
        companyId: filters.transportCompanyId,
      });
    }

    query.orderBy('vehicle.vehicleName', 'ASC');
    const vehicles = await query.getMany();
    return vehicles.map((v) => this.mapToResponseDto(v));
  }

  async findActive(): Promise<VehicleResponseDto[]> {
    const vehicles = await this.vehicleRepository.find({
      where: { status: VehicleStatus.ACTIVE },
      order: { vehicleName: 'ASC' },
    });
    return vehicles.map((v) => this.mapToResponseDto(v));
  }

  async findOne(id: string): Promise<VehicleResponseDto> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['trips'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return this.mapToResponseDto(vehicle);
  }

  async update(
    id: string,
    updateDto: UpdateVehicleDto,
  ): Promise<VehicleResponseDto> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    Object.assign(vehicle, updateDto);
    const updated = await this.vehicleRepository.save(vehicle);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    await this.vehicleRepository.remove(vehicle);
  }

  async updateLocation(
    id: string,
    latitude: number,
    longitude: number,
  ): Promise<VehicleResponseDto> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    vehicle.lastKnownLatitude = latitude;
    vehicle.lastKnownLongitude = longitude;
    vehicle.lastLocationUpdateAt = new Date();

    const updated = await this.vehicleRepository.save(vehicle);
    return this.mapToResponseDto(updated);
  }

  async updateOdometer(
    id: string,
    reading: number,
  ): Promise<VehicleResponseDto> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    vehicle.currentOdometerReading = reading;
    const updated = await this.vehicleRepository.save(vehicle);
    return this.mapToResponseDto(updated);
  }

  async getVehicleUtilization(): Promise<any> {
    const vehicles = await this.vehicleRepository.find({
      where: { status: VehicleStatus.ACTIVE },
    });

    return vehicles.map((v) => ({
      vehicleId: v.id,
      vehicleCode: v.vehicleCode,
      registrationNumber: v.registrationNumber,
      status: v.status,
      currentDriver: v.currentDriverName,
      lastKnownLocation: v.lastKnownLatitude
        ? `${v.lastKnownLatitude}, ${v.lastKnownLongitude}`
        : 'N/A',
    }));
  }

  private mapToResponseDto(vehicle: Vehicle): VehicleResponseDto {
    return {
      ...vehicle,
    } as VehicleResponseDto;
  }
}
