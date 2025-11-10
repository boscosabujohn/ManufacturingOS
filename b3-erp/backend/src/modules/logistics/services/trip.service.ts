import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip, TripStatus } from '../entities';
import {
  CreateTripDto,
  UpdateTripDto,
  TripResponseDto,
} from '../dto';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async create(createDto: CreateTripDto): Promise<TripResponseDto> {
    const existing = await this.tripRepository.findOne({
      where: { tripNumber: createDto.tripNumber },
    });

    if (existing) {
      throw new BadRequestException(
        `Trip with number ${createDto.tripNumber} already exists`,
      );
    }

    const trip = this.tripRepository.create({
      ...createDto,
      status: TripStatus.PLANNED,
    });

    const saved = await this.tripRepository.save(trip);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: any): Promise<TripResponseDto[]> {
    const query = this.tripRepository.createQueryBuilder('trip');

    if (filters?.status) {
      query.andWhere('trip.status = :status', { status: filters.status });
    }

    if (filters?.vehicleId) {
      query.andWhere('trip.vehicleId = :vehicleId', {
        vehicleId: filters.vehicleId,
      });
    }

    if (filters?.driverId) {
      query.andWhere('trip.driverId = :driverId', {
        driverId: filters.driverId,
      });
    }

    query.orderBy('trip.plannedStartTime', 'DESC');
    const trips = await query.getMany();
    return trips.map((t) => this.mapToResponseDto(t));
  }

  async findOne(id: string): Promise<TripResponseDto> {
    const trip = await this.tripRepository.findOne({
      where: { id },
      relations: ['vehicle', 'driver', 'shipments', 'trackingEvents'],
    });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    return this.mapToResponseDto(trip);
  }

  async update(
    id: string,
    updateDto: UpdateTripDto,
  ): Promise<TripResponseDto> {
    const trip = await this.tripRepository.findOne({ where: { id } });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    Object.assign(trip, updateDto);
    const updated = await this.tripRepository.save(trip);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const trip = await this.tripRepository.findOne({ where: { id } });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    await this.tripRepository.remove(trip);
  }

  async startTrip(id: string): Promise<TripResponseDto> {
    const trip = await this.tripRepository.findOne({ where: { id } });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    if (trip.status !== TripStatus.SCHEDULED) {
      throw new BadRequestException('Only scheduled trips can be started');
    }

    trip.status = TripStatus.IN_PROGRESS;
    trip.actualStartTime = new Date();

    const updated = await this.tripRepository.save(trip);
    return this.mapToResponseDto(updated);
  }

  async completeTrip(id: string): Promise<TripResponseDto> {
    const trip = await this.tripRepository.findOne({ where: { id } });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    if (trip.status !== TripStatus.IN_PROGRESS) {
      throw new BadRequestException('Only in-progress trips can be completed');
    }

    trip.status = TripStatus.COMPLETED;
    trip.actualEndTime = new Date();
    trip.isDeliveryConfirmed = true;

    // Calculate actual duration
    if (trip.actualStartTime) {
      const duration = trip.actualEndTime.getTime() - trip.actualStartTime.getTime();
      trip.actualDurationMinutes = Math.floor(duration / 60000);
    }

    const updated = await this.tripRepository.save(trip);
    return this.mapToResponseDto(updated);
  }

  async cancelTrip(id: string, reason: string): Promise<TripResponseDto> {
    const trip = await this.tripRepository.findOne({ where: { id } });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    trip.status = TripStatus.CANCELLED;
    trip.cancellationReason = reason;

    const updated = await this.tripRepository.save(trip);
    return this.mapToResponseDto(updated);
  }

  async updateLocation(
    id: string,
    latitude: number,
    longitude: number,
  ): Promise<TripResponseDto> {
    const trip = await this.tripRepository.findOne({ where: { id } });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    trip.currentLatitude = latitude;
    trip.currentLongitude = longitude;
    trip.lastLocationUpdateAt = new Date();

    const updated = await this.tripRepository.save(trip);
    return this.mapToResponseDto(updated);
  }

  async getTripTracking(id: string): Promise<any> {
    const trip = await this.tripRepository.findOne({
      where: { id },
      relations: ['trackingEvents', 'vehicle', 'driver'],
    });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    return {
      tripNumber: trip.tripNumber,
      status: trip.status,
      vehicle: trip.vehicle?.registrationNumber,
      driver: trip.driver?.fullName,
      currentLocation: trip.currentLatitude
        ? `${trip.currentLatitude}, ${trip.currentLongitude}`
        : 'N/A',
      completionPercentage: trip.completionPercentage || 0,
      trackingEvents: trip.trackingEvents || [],
    };
  }

  private mapToResponseDto(trip: Trip): TripResponseDto {
    return {
      ...trip,
    } as TripResponseDto;
  }
}
