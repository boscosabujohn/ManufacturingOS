import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackingEvent } from '../entities';
import {
  CreateTrackingEventDto,
  UpdateTrackingEventDto,
  TrackingEventResponseDto,
} from '../dto';

@Injectable()
export class TrackingEventService {
  constructor(
    @InjectRepository(TrackingEvent)
    private readonly trackingEventRepository: Repository<TrackingEvent>,
  ) {}

  async create(
    createDto: CreateTrackingEventDto,
  ): Promise<TrackingEventResponseDto> {
    const trackingEvent = this.trackingEventRepository.create(createDto);
    const saved = await this.trackingEventRepository.save(trackingEvent);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: any): Promise<TrackingEventResponseDto[]> {
    const query = this.trackingEventRepository.createQueryBuilder('event');

    if (filters?.shipmentId) {
      query.andWhere('event.shipmentId = :shipmentId', {
        shipmentId: filters.shipmentId,
      });
    }

    if (filters?.tripId) {
      query.andWhere('event.tripId = :tripId', { tripId: filters.tripId });
    }

    if (filters?.eventType) {
      query.andWhere('event.eventType = :eventType', {
        eventType: filters.eventType,
      });
    }

    query.orderBy('event.eventTimestamp', 'DESC');
    const events = await query.getMany();
    return events.map((e) => this.mapToResponseDto(e));
  }

  async findOne(id: string): Promise<TrackingEventResponseDto> {
    const trackingEvent = await this.trackingEventRepository.findOne({
      where: { id },
    });

    if (!trackingEvent) {
      throw new NotFoundException(`Tracking Event with ID ${id} not found`);
    }

    return this.mapToResponseDto(trackingEvent);
  }

  async update(
    id: string,
    updateDto: UpdateTrackingEventDto,
  ): Promise<TrackingEventResponseDto> {
    const trackingEvent = await this.trackingEventRepository.findOne({
      where: { id },
    });

    if (!trackingEvent) {
      throw new NotFoundException(`Tracking Event with ID ${id} not found`);
    }

    Object.assign(trackingEvent, updateDto);
    const updated = await this.trackingEventRepository.save(trackingEvent);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const trackingEvent = await this.trackingEventRepository.findOne({
      where: { id },
    });

    if (!trackingEvent) {
      throw new NotFoundException(`Tracking Event with ID ${id} not found`);
    }

    await this.trackingEventRepository.remove(trackingEvent);
  }

  async getShipmentEvents(shipmentId: string): Promise<TrackingEventResponseDto[]> {
    const events = await this.trackingEventRepository.find({
      where: { shipmentId },
      order: { eventTimestamp: 'ASC' },
    });
    return events.map((e) => this.mapToResponseDto(e));
  }

  async getTripEvents(tripId: string): Promise<TrackingEventResponseDto[]> {
    const events = await this.trackingEventRepository.find({
      where: { tripId },
      order: { eventTimestamp: 'ASC' },
    });
    return events.map((e) => this.mapToResponseDto(e));
  }

  private mapToResponseDto(
    trackingEvent: TrackingEvent,
  ): TrackingEventResponseDto {
    return {
      ...trackingEvent,
    } as TrackingEventResponseDto;
  }
}
