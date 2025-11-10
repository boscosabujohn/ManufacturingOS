import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FreightCharge } from '../entities';
import {
  CreateFreightChargeDto,
  UpdateFreightChargeDto,
  FreightChargeResponseDto,
} from '../dto';

@Injectable()
export class FreightChargeService {
  constructor(
    @InjectRepository(FreightCharge)
    private readonly freightChargeRepository: Repository<FreightCharge>,
  ) {}

  async create(
    createDto: CreateFreightChargeDto,
  ): Promise<FreightChargeResponseDto> {
    // Calculate amounts
    const amountAfterDiscount =
      createDto.baseAmount - (createDto.discountAmount || 0);
    const taxAmount = amountAfterDiscount * ((createDto.taxPercentage || 0) / 100);
    const totalAmount = amountAfterDiscount + taxAmount;

    const freightCharge = this.freightChargeRepository.create({
      ...createDto,
      amountAfterDiscount,
      taxAmount,
      totalAmount,
    });

    const saved = await this.freightChargeRepository.save(freightCharge);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: any): Promise<FreightChargeResponseDto[]> {
    const query = this.freightChargeRepository.createQueryBuilder('charge');

    if (filters?.shipmentId) {
      query.andWhere('charge.shipmentId = :shipmentId', {
        shipmentId: filters.shipmentId,
      });
    }

    if (filters?.tripId) {
      query.andWhere('charge.tripId = :tripId', { tripId: filters.tripId });
    }

    if (filters?.chargeType) {
      query.andWhere('charge.chargeType = :chargeType', {
        chargeType: filters.chargeType,
      });
    }

    query.orderBy('charge.createdAt', 'DESC');
    const charges = await query.getMany();
    return charges.map((c) => this.mapToResponseDto(c));
  }

  async findOne(id: string): Promise<FreightChargeResponseDto> {
    const freightCharge = await this.freightChargeRepository.findOne({
      where: { id },
    });

    if (!freightCharge) {
      throw new NotFoundException(`Freight Charge with ID ${id} not found`);
    }

    return this.mapToResponseDto(freightCharge);
  }

  async update(
    id: string,
    updateDto: UpdateFreightChargeDto,
  ): Promise<FreightChargeResponseDto> {
    const freightCharge = await this.freightChargeRepository.findOne({
      where: { id },
    });

    if (!freightCharge) {
      throw new NotFoundException(`Freight Charge with ID ${id} not found`);
    }

    Object.assign(freightCharge, updateDto);

    // Recalculate amounts
    const amountAfterDiscount =
      freightCharge.baseAmount - (freightCharge.discountAmount || 0);
    const taxAmount = amountAfterDiscount * ((freightCharge.taxPercentage || 0) / 100);
    freightCharge.amountAfterDiscount = amountAfterDiscount;
    freightCharge.taxAmount = taxAmount;
    freightCharge.totalAmount = amountAfterDiscount + taxAmount;

    const updated = await this.freightChargeRepository.save(freightCharge);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const freightCharge = await this.freightChargeRepository.findOne({
      where: { id },
    });

    if (!freightCharge) {
      throw new NotFoundException(`Freight Charge with ID ${id} not found`);
    }

    await this.freightChargeRepository.remove(freightCharge);
  }

  async calculateCharges(shipmentId: string): Promise<any> {
    const charges = await this.freightChargeRepository.find({
      where: { shipmentId },
    });

    const totalBaseAmount = charges.reduce((sum, c) => sum + Number(c.baseAmount), 0);
    const totalDiscount = charges.reduce((sum, c) => sum + Number(c.discountAmount), 0);
    const totalTax = charges.reduce((sum, c) => sum + Number(c.taxAmount), 0);
    const totalAmount = charges.reduce((sum, c) => sum + Number(c.totalAmount), 0);

    return {
      shipmentId,
      totalBaseAmount,
      totalDiscount,
      totalTax,
      totalAmount,
      charges: charges.map((c) => this.mapToResponseDto(c)),
    };
  }

  async getShipmentCharges(shipmentId: string): Promise<FreightChargeResponseDto[]> {
    const charges = await this.freightChargeRepository.find({
      where: { shipmentId },
      order: { createdAt: 'ASC' },
    });
    return charges.map((c) => this.mapToResponseDto(c));
  }

  private mapToResponseDto(
    freightCharge: FreightCharge,
  ): FreightChargeResponseDto {
    return {
      ...freightCharge,
    } as FreightChargeResponseDto;
  }
}
