import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { BatchNumber, BatchStatus } from '../entities/batch-number.entity';
import {
  CreateBatchNumberDto,
  UpdateBatchNumberDto,
  BatchNumberResponseDto,
} from '../dto';

@Injectable()
export class BatchNumberService {
  constructor(
    @InjectRepository(BatchNumber)
    private readonly batchNumberRepository: Repository<BatchNumber>,
  ) {}

  async create(createDto: CreateBatchNumberDto): Promise<BatchNumberResponseDto> {
    const existing = await this.batchNumberRepository.findOne({
      where: {
        batchNumber: createDto.batchNumber,
        itemId: createDto.itemId,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Batch number ${createDto.batchNumber} already exists for this item`,
      );
    }

    const batch = this.batchNumberRepository.create({
      ...createDto,
      status: BatchStatus.ACTIVE,
      availableQuantity: createDto.initialQuantity,
      issuedQuantity: 0,
      reservedQuantity: 0,
      isExpired: false,
      isPickable: true,
    });

    // Calculate days to expiry
    if (createDto.expiryDate) {
      const expiryDate = new Date(createDto.expiryDate);
      const today = new Date();
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      batch.daysToExpiry = diffDays;
      batch.isExpired = diffDays <= 0;
    }

    const saved = await this.batchNumberRepository.save(batch);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: any): Promise<BatchNumberResponseDto[]> {
    const query = this.batchNumberRepository.createQueryBuilder('batch');

    if (filters?.itemId) {
      query.andWhere('batch.itemId = :itemId', { itemId: filters.itemId });
    }

    if (filters?.status) {
      query.andWhere('batch.status = :status', { status: filters.status });
    }

    query.orderBy('batch.expiryDate', 'ASC');
    const batches = await query.getMany();
    return batches.map((b) => this.mapToResponseDto(b));
  }

  async findAvailable(itemId: string): Promise<BatchNumberResponseDto[]> {
    const batches = await this.batchNumberRepository.find({
      where: {
        itemId,
        status: BatchStatus.ACTIVE,
        isPickable: true,
        isExpired: false,
      },
      order: { fifoSequence: 'ASC', expiryDate: 'ASC' },
    });
    return batches.map((b) => this.mapToResponseDto(b));
  }

  async getExpiringSoon(days: number): Promise<BatchNumberResponseDto[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const batches = await this.batchNumberRepository
      .createQueryBuilder('batch')
      .where('batch.expiryDate <= :futureDate', { futureDate })
      .andWhere('batch.expiryDate >= :today', { today })
      .andWhere('batch.isExpired = :isExpired', { isExpired: false })
      .andWhere('batch.availableQuantity > 0')
      .orderBy('batch.expiryDate', 'ASC')
      .getMany();

    return batches.map((b) => this.mapToResponseDto(b));
  }

  async findOne(id: string): Promise<BatchNumberResponseDto> {
    const batch = await this.batchNumberRepository.findOne({
      where: { id },
    });

    if (!batch) {
      throw new NotFoundException(`Batch number with ID ${id} not found`);
    }

    return this.mapToResponseDto(batch);
  }

  async findByBatch(
    batchNumber: string,
    itemId: string,
  ): Promise<BatchNumberResponseDto> {
    const batch = await this.batchNumberRepository.findOne({
      where: { batchNumber, itemId },
    });

    if (!batch) {
      throw new NotFoundException(
        `Batch number ${batchNumber} not found for this item`,
      );
    }

    return this.mapToResponseDto(batch);
  }

  async update(
    id: string,
    updateDto: UpdateBatchNumberDto,
  ): Promise<BatchNumberResponseDto> {
    const batch = await this.batchNumberRepository.findOne({
      where: { id },
    });

    if (!batch) {
      throw new NotFoundException(`Batch number with ID ${id} not found`);
    }

    Object.assign(batch, updateDto);
    const updated = await this.batchNumberRepository.save(batch);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const batch = await this.batchNumberRepository.findOne({
      where: { id },
    });

    if (!batch) {
      throw new NotFoundException(`Batch number with ID ${id} not found`);
    }

    if (Number(batch.availableQuantity) > 0) {
      throw new BadRequestException(
        'Cannot delete batch with available quantity',
      );
    }

    await this.batchNumberRepository.remove(batch);
  }

  private mapToResponseDto(batch: BatchNumber): BatchNumberResponseDto {
    return {
      ...batch,
    } as BatchNumberResponseDto;
  }
}
