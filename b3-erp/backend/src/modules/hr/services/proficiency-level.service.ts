import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProficiencyLevel } from '../entities/proficiency-level.entity';
import {
  CreateProficiencyLevelDto,
  UpdateProficiencyLevelDto,
  ProficiencyLevelResponseDto,
} from '../dto';

@Injectable()
export class ProficiencyLevelService {
  constructor(
    @InjectRepository(ProficiencyLevel)
    private readonly repository: Repository<ProficiencyLevel>,
  ) {}

  async create(createDto: CreateProficiencyLevelDto): Promise<ProficiencyLevelResponseDto> {
    const existing = await this.repository.findOne({
      where: { code: createDto.code },
    });

    if (existing) {
      throw new BadRequestException(`Proficiency level with code ${createDto.code} already exists`);
    }

    const entity = this.repository.create(createDto);
    const saved = await this.repository.save(entity);
    return this.mapToResponseDto(saved);
  }

  async findAll(): Promise<ProficiencyLevelResponseDto[]> {
    const levels = await this.repository.find({
      order: { level: 'ASC' },
    });
    return levels.map((l) => this.mapToResponseDto(l));
  }

  async findOne(id: string): Promise<ProficiencyLevelResponseDto> {
    const level = await this.repository.findOne({ where: { id } });
    if (!level) {
      throw new NotFoundException(`Proficiency level with ID ${id} not found`);
    }
    return this.mapToResponseDto(level);
  }

  async findByCode(code: string): Promise<ProficiencyLevelResponseDto> {
    const level = await this.repository.findOne({ where: { code } });
    if (!level) {
      throw new NotFoundException(`Proficiency level with code ${code} not found`);
    }
    return this.mapToResponseDto(level);
  }

  async findByLevel(levelNumber: number): Promise<ProficiencyLevelResponseDto> {
    const level = await this.repository.findOne({ where: { level: levelNumber } });
    if (!level) {
      throw new NotFoundException(`Proficiency level ${levelNumber} not found`);
    }
    return this.mapToResponseDto(level);
  }

  async update(id: string, updateDto: UpdateProficiencyLevelDto): Promise<ProficiencyLevelResponseDto> {
    const level = await this.repository.findOne({ where: { id } });
    if (!level) {
      throw new NotFoundException(`Proficiency level with ID ${id} not found`);
    }

    Object.assign(level, updateDto);
    const updated = await this.repository.save(level);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const level = await this.repository.findOne({ where: { id } });
    if (!level) {
      throw new NotFoundException(`Proficiency level with ID ${id} not found`);
    }
    await this.repository.remove(level);
  }

  private mapToResponseDto(level: ProficiencyLevel): ProficiencyLevelResponseDto {
    return { ...level } as ProficiencyLevelResponseDto;
  }
}
