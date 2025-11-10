import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Shipment,
  ShipmentStatus,
  ShipmentItem,
} from '../entities';
import {
  CreateShipmentDto,
  UpdateShipmentDto,
  ShipmentResponseDto,
} from '../dto';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,
    @InjectRepository(ShipmentItem)
    private readonly shipmentItemRepository: Repository<ShipmentItem>,
  ) {}

  async create(createDto: CreateShipmentDto): Promise<ShipmentResponseDto> {
    const existing = await this.shipmentRepository.findOne({
      where: { shipmentNumber: createDto.shipmentNumber },
    });

    if (existing) {
      throw new BadRequestException(
        `Shipment with number ${createDto.shipmentNumber} already exists`,
      );
    }

    const shipment = this.shipmentRepository.create({
      ...createDto,
      status: ShipmentStatus.DRAFT,
    });

    const saved = await this.shipmentRepository.save(shipment);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: any): Promise<ShipmentResponseDto[]> {
    const query = this.shipmentRepository.createQueryBuilder('shipment');

    if (filters?.status) {
      query.andWhere('shipment.status = :status', { status: filters.status });
    }

    if (filters?.shipmentType) {
      query.andWhere('shipment.shipmentType = :type', {
        type: filters.shipmentType,
      });
    }

    if (filters?.originCity) {
      query.andWhere('shipment.originCity = :city', {
        city: filters.originCity,
      });
    }

    if (filters?.destinationCity) {
      query.andWhere('shipment.destinationCity = :city', {
        city: filters.destinationCity,
      });
    }

    query.orderBy('shipment.createdAt', 'DESC');
    const shipments = await query.getMany();
    return shipments.map((s) => this.mapToResponseDto(s));
  }

  async findOne(id: string): Promise<ShipmentResponseDto> {
    const shipment = await this.shipmentRepository.findOne({
      where: { id },
      relations: ['items', 'trackingEvents'],
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    return this.mapToResponseDto(shipment);
  }

  async update(
    id: string,
    updateDto: UpdateShipmentDto,
  ): Promise<ShipmentResponseDto> {
    const shipment = await this.shipmentRepository.findOne({ where: { id } });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    Object.assign(shipment, updateDto);
    const updated = await this.shipmentRepository.save(shipment);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const shipment = await this.shipmentRepository.findOne({ where: { id } });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    if (
      shipment.status !== ShipmentStatus.DRAFT &&
      shipment.status !== ShipmentStatus.CANCELLED
    ) {
      throw new BadRequestException('Cannot delete non-draft shipment');
    }

    await this.shipmentRepository.remove(shipment);
  }

  // Special Operations
  async dispatch(id: string): Promise<ShipmentResponseDto> {
    const shipment = await this.shipmentRepository.findOne({ where: { id } });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    if (shipment.status !== ShipmentStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed shipments can be dispatched');
    }

    shipment.status = ShipmentStatus.DISPATCHED;
    shipment.dispatchedDate = new Date();
    const updated = await this.shipmentRepository.save(shipment);
    return this.mapToResponseDto(updated);
  }

  async markInTransit(id: string): Promise<ShipmentResponseDto> {
    const shipment = await this.shipmentRepository.findOne({ where: { id } });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    shipment.status = ShipmentStatus.IN_TRANSIT;
    const updated = await this.shipmentRepository.save(shipment);
    return this.mapToResponseDto(updated);
  }

  async markDelivered(
    id: string,
    deliveryDetails: any,
  ): Promise<ShipmentResponseDto> {
    const shipment = await this.shipmentRepository.findOne({ where: { id } });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    shipment.status = ShipmentStatus.DELIVERED;
    shipment.actualDeliveryDate = new Date();
    shipment.deliveredToName = deliveryDetails.deliveredToName;
    shipment.deliveryRemarks = deliveryDetails.remarks;

    const updated = await this.shipmentRepository.save(shipment);
    return this.mapToResponseDto(updated);
  }

  async cancel(id: string, reason: string): Promise<ShipmentResponseDto> {
    const shipment = await this.shipmentRepository.findOne({ where: { id } });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    if (shipment.status === ShipmentStatus.DELIVERED) {
      throw new BadRequestException('Cannot cancel delivered shipment');
    }

    shipment.status = ShipmentStatus.CANCELLED;
    shipment.cancellationReason = reason;

    const updated = await this.shipmentRepository.save(shipment);
    return this.mapToResponseDto(updated);
  }

  async getShipmentTracking(id: string): Promise<any> {
    const shipment = await this.shipmentRepository.findOne({
      where: { id },
      relations: ['trackingEvents'],
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    return {
      shipmentNumber: shipment.shipmentNumber,
      status: shipment.status,
      origin: shipment.originName,
      destination: shipment.destinationName,
      currentLocation: shipment.trackingEvents?.[0]?.locationName || 'N/A',
      trackingEvents: shipment.trackingEvents || [],
    };
  }

  async getShipmentsByStatus(status: ShipmentStatus): Promise<any[]> {
    const shipments = await this.shipmentRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });

    return shipments.map((s) => this.mapToResponseDto(s));
  }

  private mapToResponseDto(shipment: Shipment): ShipmentResponseDto {
    return {
      ...shipment,
    } as ShipmentResponseDto;
  }
}
