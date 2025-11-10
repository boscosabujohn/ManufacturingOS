import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SerialNumber,
  SerialNumberStatus,
} from '../entities/serial-number.entity';
import {
  CreateSerialNumberDto,
  UpdateSerialNumberDto,
  SerialNumberResponseDto,
} from '../dto';

@Injectable()
export class SerialNumberService {
  constructor(
    @InjectRepository(SerialNumber)
    private readonly serialNumberRepository: Repository<SerialNumber>,
  ) {}

  async create(
    createDto: CreateSerialNumberDto,
  ): Promise<SerialNumberResponseDto> {
    const existing = await this.serialNumberRepository.findOne({
      where: { serialNumber: createDto.serialNumber },
    });

    if (existing) {
      throw new BadRequestException(
        `Serial number ${createDto.serialNumber} already exists`,
      );
    }

    const serialNumber = this.serialNumberRepository.create({
      ...createDto,
      status: SerialNumberStatus.IN_STORE,
      isUnderWarranty: false,
      isExpired: false,
    });

    const saved = await this.serialNumberRepository.save(serialNumber);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: any): Promise<SerialNumberResponseDto[]> {
    const query = this.serialNumberRepository.createQueryBuilder('serial');

    if (filters?.itemId) {
      query.andWhere('serial.itemId = :itemId', { itemId: filters.itemId });
    }

    if (filters?.warehouseId) {
      query.andWhere('serial.warehouseId = :warehouseId', {
        warehouseId: filters.warehouseId,
      });
    }

    if (filters?.status) {
      query.andWhere('serial.status = :status', { status: filters.status });
    }

    query.orderBy('serial.serialNumber', 'ASC');
    const serialNumbers = await query.getMany();
    return serialNumbers.map((s) => this.mapToResponseDto(s));
  }

  async findAvailable(
    itemId: string,
    warehouseId?: string,
  ): Promise<SerialNumberResponseDto[]> {
    const query = this.serialNumberRepository.createQueryBuilder('serial');

    query
      .where('serial.itemId = :itemId', { itemId })
      .andWhere('serial.status IN (:...statuses)', {
        statuses: [SerialNumberStatus.AVAILABLE, SerialNumberStatus.IN_STORE],
      });

    if (warehouseId) {
      query.andWhere('serial.warehouseId = :warehouseId', { warehouseId });
    }

    query.orderBy('serial.receiptDate', 'ASC');
    const serialNumbers = await query.getMany();
    return serialNumbers.map((s) => this.mapToResponseDto(s));
  }

  async findOne(id: string): Promise<SerialNumberResponseDto> {
    const serialNumber = await this.serialNumberRepository.findOne({
      where: { id },
    });

    if (!serialNumber) {
      throw new NotFoundException(`Serial number with ID ${id} not found`);
    }

    return this.mapToResponseDto(serialNumber);
  }

  async findBySerial(serialNumber: string): Promise<SerialNumberResponseDto> {
    const serial = await this.serialNumberRepository.findOne({
      where: { serialNumber },
    });

    if (!serial) {
      throw new NotFoundException(
        `Serial number ${serialNumber} not found`,
      );
    }

    return this.mapToResponseDto(serial);
  }

  async update(
    id: string,
    updateDto: UpdateSerialNumberDto,
  ): Promise<SerialNumberResponseDto> {
    const serialNumber = await this.serialNumberRepository.findOne({
      where: { id },
    });

    if (!serialNumber) {
      throw new NotFoundException(`Serial number with ID ${id} not found`);
    }

    Object.assign(serialNumber, updateDto);
    const updated = await this.serialNumberRepository.save(serialNumber);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const serialNumber = await this.serialNumberRepository.findOne({
      where: { id },
    });

    if (!serialNumber) {
      throw new NotFoundException(`Serial number with ID ${id} not found`);
    }

    await this.serialNumberRepository.remove(serialNumber);
  }

  private mapToResponseDto(serial: SerialNumber): SerialNumberResponseDto {
    return {
      ...serial,
    } as SerialNumberResponseDto;
  }
}
