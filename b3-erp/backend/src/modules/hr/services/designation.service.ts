import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Designation } from '../entities/designation.entity';
import {
  CreateDesignationDto,
  UpdateDesignationDto,
  DesignationResponseDto,
} from '../dto';

@Injectable()
export class DesignationService {
  constructor(
    @InjectRepository(Designation)
    private readonly designationRepository: Repository<Designation>,
  ) {}

  async create(createDto: CreateDesignationDto): Promise<DesignationResponseDto> {
    const existing = await this.designationRepository.findOne({
      where: { code: createDto.code },
    });

    if (existing) {
      throw new BadRequestException(`Designation with code ${createDto.code} already exists`);
    }

    const designation = this.designationRepository.create(createDto);
    const saved = await this.designationRepository.save(designation);
    return this.mapToResponseDto(saved);
  }

  async findAll(): Promise<DesignationResponseDto[]> {
    const designations = await this.designationRepository.find({
      order: { gradeLevel: 'ASC', title: 'ASC' },
    });
    return designations.map((d) => this.mapToResponseDto(d));
  }

  async findOne(id: string): Promise<DesignationResponseDto> {
    const designation = await this.designationRepository.findOne({ where: { id } });
    if (!designation) {
      throw new NotFoundException(`Designation with ID ${id} not found`);
    }
    return this.mapToResponseDto(designation);
  }

  async update(id: string, updateDto: UpdateDesignationDto): Promise<DesignationResponseDto> {
    const designation = await this.designationRepository.findOne({ where: { id } });
    if (!designation) {
      throw new NotFoundException(`Designation with ID ${id} not found`);
    }

    Object.assign(designation, updateDto);
    const updated = await this.designationRepository.save(designation);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const designation = await this.designationRepository.findOne({ where: { id } });
    if (!designation) {
      throw new NotFoundException(`Designation with ID ${id} not found`);
    }
    await this.designationRepository.remove(designation);
  }

  async getByLevel(level: string): Promise<DesignationResponseDto[]> {
    const designations = await this.designationRepository.find({
      where: { level: level as any },
      order: { title: 'ASC' },
    });
    return designations.map((d) => this.mapToResponseDto(d));
  }

  private mapToResponseDto(designation: Designation): DesignationResponseDto {
    return { ...designation } as DesignationResponseDto;
  }
}
