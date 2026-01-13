import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Skill } from '../entities/skill.entity';
import {
  CreateSkillDto,
  UpdateSkillDto,
  SkillResponseDto,
} from '../dto';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private readonly repository: Repository<Skill>,
  ) {}

  async create(createDto: CreateSkillDto): Promise<SkillResponseDto> {
    const existing = await this.repository.findOne({
      where: { code: createDto.code },
    });

    if (existing) {
      throw new BadRequestException(`Skill with code ${createDto.code} already exists`);
    }

    const entity = this.repository.create(createDto);
    const saved = await this.repository.save(entity);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: {
    categoryId?: string;
    skillType?: string;
    status?: string;
    search?: string;
  }): Promise<SkillResponseDto[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('skill')
      .leftJoinAndSelect('skill.category', 'category')
      .orderBy('skill.sortOrder', 'ASC')
      .addOrderBy('skill.name', 'ASC');

    if (filters?.categoryId) {
      queryBuilder.andWhere('skill.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    if (filters?.skillType) {
      queryBuilder.andWhere('skill.skillType = :skillType', {
        skillType: filters.skillType,
      });
    }

    if (filters?.status) {
      queryBuilder.andWhere('skill.status = :status', {
        status: filters.status,
      });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(skill.name ILIKE :search OR skill.code ILIKE :search OR skill.description ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    const skills = await queryBuilder.getMany();
    return skills.map((s) => this.mapToResponseDto(s));
  }

  async findOne(id: string): Promise<SkillResponseDto> {
    const skill = await this.repository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }
    return this.mapToResponseDto(skill);
  }

  async findByCode(code: string): Promise<SkillResponseDto> {
    const skill = await this.repository.findOne({
      where: { code },
      relations: ['category'],
    });
    if (!skill) {
      throw new NotFoundException(`Skill with code ${code} not found`);
    }
    return this.mapToResponseDto(skill);
  }

  async findByCodes(codes: string[]): Promise<SkillResponseDto[]> {
    const skills = await this.repository.find({
      where: { code: In(codes) },
      relations: ['category'],
    });
    return skills.map((s) => this.mapToResponseDto(s));
  }

  async update(id: string, updateDto: UpdateSkillDto): Promise<SkillResponseDto> {
    const skill = await this.repository.findOne({ where: { id } });
    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    Object.assign(skill, updateDto);
    const updated = await this.repository.save(skill);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const skill = await this.repository.findOne({ where: { id } });
    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }
    await this.repository.remove(skill);
  }

  async getSkillsByCategory(): Promise<Record<string, SkillResponseDto[]>> {
    const skills = await this.repository.find({
      relations: ['category'],
      order: { sortOrder: 'ASC', name: 'ASC' },
    });

    const grouped: Record<string, SkillResponseDto[]> = {};
    skills.forEach((skill) => {
      const categoryName = skill.category?.name || 'Uncategorized';
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(this.mapToResponseDto(skill));
    });

    return grouped;
  }

  private mapToResponseDto(skill: Skill): SkillResponseDto {
    return { ...skill } as SkillResponseDto;
  }
}
