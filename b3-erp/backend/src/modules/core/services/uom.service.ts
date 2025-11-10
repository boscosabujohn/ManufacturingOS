import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitOfMeasure } from '../entities/uom.entity';
import { CreateUomDto } from '../dto/create-uom.dto';
import { UpdateUomDto } from '../dto/update-uom.dto';

export interface UomFilters {
  search?: string;
  uomType?: string;
  isActive?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class UomService {
  constructor(
    @InjectRepository(UnitOfMeasure)
    private readonly uomRepository: Repository<UnitOfMeasure>,
  ) {}

  async findAll(
    filters: UomFilters = {},
    pagination: PaginationParams = {},
  ): Promise<{
    data: UnitOfMeasure[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { search, uomType, isActive } = filters;

    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = pagination;

    const queryBuilder = this.uomRepository.createQueryBuilder('uom');

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(uom.uomCode ILIKE :search OR uom.uomName ILIKE :search OR uom.symbol ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply UOM type filter
    if (uomType) {
      queryBuilder.andWhere('uom.uomType = :uomType', { uomType });
    }

    // Apply active filter
    if (isActive !== undefined) {
      queryBuilder.andWhere('uom.isActive = :isActive', { isActive });
    }

    // Apply sorting
    queryBuilder.orderBy(`uom.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<UnitOfMeasure> {
    const uom = await this.uomRepository.findOne({
      where: { id },
    });

    if (!uom) {
      throw new NotFoundException(`Unit of Measure with ID ${id} not found`);
    }

    return uom;
  }

  async findByCode(uomCode: string): Promise<UnitOfMeasure | null> {
    return this.uomRepository.findOne({
      where: { uomCode },
    });
  }

  async create(createUomDto: CreateUomDto): Promise<UnitOfMeasure> {
    // Check if UOM code already exists
    const existingUom = await this.findByCode(createUomDto.uomCode);
    if (existingUom) {
      throw new ConflictException(
        `Unit of Measure with code ${createUomDto.uomCode} already exists`,
      );
    }

    // Validate base UOM if provided
    if (createUomDto.baseUOMId) {
      const baseUom = await this.uomRepository.findOne({
        where: { id: createUomDto.baseUOMId },
      });
      if (!baseUom) {
        throw new BadRequestException(
          `Base UOM with ID ${createUomDto.baseUOMId} not found`,
        );
      }

      // Ensure base UOM is of the same type
      if (baseUom.uomType !== createUomDto.uomType) {
        throw new BadRequestException(
          'Base UOM must be of the same type as the UOM being created',
        );
      }

      // Validate conversion factor
      if (
        createUomDto.conversionFactor === undefined ||
        createUomDto.conversionFactor <= 0
      ) {
        throw new BadRequestException(
          'Conversion factor must be greater than 0',
        );
      }
    }

    const uom = this.uomRepository.create(createUomDto);
    return this.uomRepository.save(uom);
  }

  async update(id: string, updateUomDto: UpdateUomDto): Promise<UnitOfMeasure> {
    const uom = await this.findOne(id);

    // Check if UOM code is being changed and if it already exists
    if (updateUomDto.uomCode && updateUomDto.uomCode !== uom.uomCode) {
      const existingUom = await this.findByCode(updateUomDto.uomCode);
      if (existingUom) {
        throw new ConflictException(
          `Unit of Measure with code ${updateUomDto.uomCode} already exists`,
        );
      }
    }

    // Validate base UOM if being changed
    if (updateUomDto.baseUOMId && updateUomDto.baseUOMId !== uom.baseUOMId) {
      const baseUom = await this.uomRepository.findOne({
        where: { id: updateUomDto.baseUOMId },
      });
      if (!baseUom) {
        throw new BadRequestException(
          `Base UOM with ID ${updateUomDto.baseUOMId} not found`,
        );
      }

      // Ensure base UOM is of the same type
      const uomType = updateUomDto.uomType || uom.uomType;
      if (baseUom.uomType !== uomType) {
        throw new BadRequestException(
          'Base UOM must be of the same type as the current UOM',
        );
      }
    }

    Object.assign(uom, updateUomDto);
    return this.uomRepository.save(uom);
  }

  async remove(id: string): Promise<void> {
    const uom = await this.findOne(id);

    // Check if any other UOMs are using this as a base
    const dependentUoms = await this.uomRepository.find({
      where: { baseUOMId: id },
    });

    if (dependentUoms.length > 0) {
      throw new BadRequestException(
        `Cannot delete UOM that is used as a base for ${dependentUoms.length} other UOM(s)`,
      );
    }

    await this.uomRepository.remove(uom);
  }

  async getActiveUoms(): Promise<UnitOfMeasure[]> {
    return this.uomRepository.find({
      where: { isActive: true },
      order: { uomName: 'ASC' },
    });
  }

  async getUomsByType(uomType: string): Promise<UnitOfMeasure[]> {
    return this.uomRepository.find({
      where: { uomType: uomType as any, isActive: true },
      order: { uomName: 'ASC' },
    });
  }

  async getBaseUoms(): Promise<UnitOfMeasure[]> {
    return this.uomRepository
      .createQueryBuilder('uom')
      .where('uom.baseUOMId IS NULL')
      .andWhere('uom.isActive = true')
      .orderBy('uom.uomName', 'ASC')
      .getMany();
  }

  async getDerivedUoms(baseUOMId: string): Promise<UnitOfMeasure[]> {
    return this.uomRepository.find({
      where: { baseUOMId },
      order: { uomName: 'ASC' },
    });
  }

  async convertQuantity(
    quantity: number,
    fromUomId: string,
    toUomId: string,
  ): Promise<number> {
    if (fromUomId === toUomId) {
      return quantity;
    }

    const fromUom = await this.findOne(fromUomId);
    const toUom = await this.findOne(toUomId);

    // Check if both UOMs are of the same type
    if (fromUom.uomType !== toUom.uomType) {
      throw new BadRequestException(
        'Cannot convert between UOMs of different types',
      );
    }

    // Convert to base UOM first
    let quantityInBase = quantity;
    if (fromUom.baseUOMId) {
      quantityInBase = quantity * fromUom.conversionFactor;
    }

    // Convert from base to target UOM
    if (toUom.baseUOMId) {
      return quantityInBase / toUom.conversionFactor;
    }

    return quantityInBase;
  }

  async toggleActive(id: string): Promise<UnitOfMeasure> {
    const uom = await this.findOne(id);
    uom.isActive = !uom.isActive;
    return this.uomRepository.save(uom);
  }
}
