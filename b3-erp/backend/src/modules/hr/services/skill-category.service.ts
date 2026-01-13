import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillCategory } from '../entities/skill-category.entity';
import {
  CreateSkillCategoryDto,
  UpdateSkillCategoryDto,
  SkillCategoryResponseDto,
} from '../dto';

@Injectable()
export class SkillCategoryService {
  constructor(
    @InjectRepository(SkillCategory)
    private readonly repository: Repository<SkillCategory>,
  ) {}

  async create(createDto: CreateSkillCategoryDto): Promise<SkillCategoryResponseDto> {
    const existing = await this.repository.findOne({
      where: { code: createDto.code },
    });

    if (existing) {
      throw new BadRequestException(`Skill category with code ${createDto.code} already exists`);
    }

    const entity = this.repository.create(createDto);
    const saved = await this.repository.save(entity);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: any): Promise<SkillCategoryResponseDto[]> {
    const categories = await this.repository.find({
      order: { sortOrder: 'ASC', name: 'ASC' },
      relations: ['skills'],
    });
    return categories.map((c) => this.mapToResponseDto(c));
  }

  async findOne(id: string): Promise<SkillCategoryResponseDto> {
    const category = await this.repository.findOne({
      where: { id },
      relations: ['skills'],
    });
    if (!category) {
      throw new NotFoundException(`Skill category with ID ${id} not found`);
    }
    return this.mapToResponseDto(category);
  }

  async findByCode(code: string): Promise<SkillCategoryResponseDto> {
    const category = await this.repository.findOne({
      where: { code },
      relations: ['skills'],
    });
    if (!category) {
      throw new NotFoundException(`Skill category with code ${code} not found`);
    }
    return this.mapToResponseDto(category);
  }

  async update(id: string, updateDto: UpdateSkillCategoryDto): Promise<SkillCategoryResponseDto> {
    const category = await this.repository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Skill category with ID ${id} not found`);
    }

    Object.assign(category, updateDto);
    const updated = await this.repository.save(category);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const category = await this.repository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Skill category with ID ${id} not found`);
    }
    await this.repository.remove(category);
  }

  private mapToResponseDto(category: SkillCategory): SkillCategoryResponseDto {
    return { ...category } as SkillCategoryResponseDto;
  }
}
