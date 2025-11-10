import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryNote, DeliveryNoteStatus } from '../entities';
import {
  CreateDeliveryNoteDto,
  UpdateDeliveryNoteDto,
  DeliveryNoteResponseDto,
} from '../dto';

@Injectable()
export class DeliveryNoteService {
  constructor(
    @InjectRepository(DeliveryNote)
    private readonly deliveryNoteRepository: Repository<DeliveryNote>,
  ) {}

  async create(
    createDto: CreateDeliveryNoteDto,
  ): Promise<DeliveryNoteResponseDto> {
    const existing = await this.deliveryNoteRepository.findOne({
      where: { deliveryNoteNumber: createDto.deliveryNoteNumber },
    });

    if (existing) {
      throw new BadRequestException(
        `Delivery Note with number ${createDto.deliveryNoteNumber} already exists`,
      );
    }

    const deliveryNote = this.deliveryNoteRepository.create({
      ...createDto,
      status: DeliveryNoteStatus.DRAFT,
    });

    const saved = await this.deliveryNoteRepository.save(deliveryNote);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: any): Promise<DeliveryNoteResponseDto[]> {
    const query = this.deliveryNoteRepository.createQueryBuilder('dn');

    if (filters?.status) {
      query.andWhere('dn.status = :status', { status: filters.status });
    }

    if (filters?.customerId) {
      query.andWhere('dn.customerId = :customerId', {
        customerId: filters.customerId,
      });
    }

    query.orderBy('dn.deliveryDate', 'DESC');
    const notes = await query.getMany();
    return notes.map((n) => this.mapToResponseDto(n));
  }

  async findOne(id: string): Promise<DeliveryNoteResponseDto> {
    const deliveryNote = await this.deliveryNoteRepository.findOne({
      where: { id },
    });

    if (!deliveryNote) {
      throw new NotFoundException(`Delivery Note with ID ${id} not found`);
    }

    return this.mapToResponseDto(deliveryNote);
  }

  async update(
    id: string,
    updateDto: UpdateDeliveryNoteDto,
  ): Promise<DeliveryNoteResponseDto> {
    const deliveryNote = await this.deliveryNoteRepository.findOne({
      where: { id },
    });

    if (!deliveryNote) {
      throw new NotFoundException(`Delivery Note with ID ${id} not found`);
    }

    Object.assign(deliveryNote, updateDto);
    const updated = await this.deliveryNoteRepository.save(deliveryNote);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const deliveryNote = await this.deliveryNoteRepository.findOne({
      where: { id },
    });

    if (!deliveryNote) {
      throw new NotFoundException(`Delivery Note with ID ${id} not found`);
    }

    await this.deliveryNoteRepository.remove(deliveryNote);
  }

  async submit(id: string): Promise<DeliveryNoteResponseDto> {
    const deliveryNote = await this.deliveryNoteRepository.findOne({
      where: { id },
    });

    if (!deliveryNote) {
      throw new NotFoundException(`Delivery Note with ID ${id} not found`);
    }

    deliveryNote.status = DeliveryNoteStatus.SUBMITTED;
    const updated = await this.deliveryNoteRepository.save(deliveryNote);
    return this.mapToResponseDto(updated);
  }

  async markDelivered(id: string): Promise<DeliveryNoteResponseDto> {
    const deliveryNote = await this.deliveryNoteRepository.findOne({
      where: { id },
    });

    if (!deliveryNote) {
      throw new NotFoundException(`Delivery Note with ID ${id} not found`);
    }

    deliveryNote.status = DeliveryNoteStatus.DELIVERED;
    deliveryNote.actualDeliveryDate = new Date();
    const updated = await this.deliveryNoteRepository.save(deliveryNote);
    return this.mapToResponseDto(updated);
  }

  private mapToResponseDto(
    deliveryNote: DeliveryNote,
  ): DeliveryNoteResponseDto {
    return {
      ...deliveryNote,
    } as DeliveryNoteResponseDto;
  }
}
