import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillGap, SkillGapStatus, SkillGapPriority } from '../entities/skill-gap.entity';
import {
  CreateSkillGapDto,
  UpdateSkillGapDto,
  SkillGapResponseDto,
} from '../dto';

@Injectable()
export class SkillGapService {
  constructor(
    @InjectRepository(SkillGap)
    private readonly repository: Repository<SkillGap>,
  ) {}

  async create(createDto: CreateSkillGapDto): Promise<SkillGapResponseDto> {
    const existing = await this.repository.findOne({
      where: { code: createDto.code },
    });

    if (existing) {
      throw new BadRequestException(`Skill gap with code ${createDto.code} already exists`);
    }

    const entity = this.repository.create(createDto);
    const saved = await this.repository.save(entity);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: {
    status?: string;
    priority?: string;
    skillId?: string;
    roleId?: string;
    departmentId?: string;
  }): Promise<SkillGapResponseDto[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('skillGap')
      .leftJoinAndSelect('skillGap.skill', 'skill')
      .leftJoinAndSelect('skill.category', 'category')
      .orderBy('skillGap.priority', 'ASC')
      .addOrderBy('skillGap.gapPercentage', 'DESC');

    if (filters?.status) {
      queryBuilder.andWhere('skillGap.status = :status', { status: filters.status });
    }

    if (filters?.priority) {
      queryBuilder.andWhere('skillGap.priority = :priority', { priority: filters.priority });
    }

    if (filters?.skillId) {
      queryBuilder.andWhere('skillGap.skillId = :skillId', { skillId: filters.skillId });
    }

    if (filters?.roleId) {
      queryBuilder.andWhere('skillGap.roleId = :roleId', { roleId: filters.roleId });
    }

    if (filters?.departmentId) {
      queryBuilder.andWhere('skillGap.departmentId = :departmentId', { departmentId: filters.departmentId });
    }

    const gaps = await queryBuilder.getMany();
    return gaps.map((g) => this.mapToResponseDto(g));
  }

  async findOne(id: string): Promise<SkillGapResponseDto> {
    const gap = await this.repository.findOne({
      where: { id },
      relations: ['skill', 'skill.category'],
    });
    if (!gap) {
      throw new NotFoundException(`Skill gap with ID ${id} not found`);
    }
    return this.mapToResponseDto(gap);
  }

  async findByCode(code: string): Promise<SkillGapResponseDto> {
    const gap = await this.repository.findOne({
      where: { code },
      relations: ['skill', 'skill.category'],
    });
    if (!gap) {
      throw new NotFoundException(`Skill gap with code ${code} not found`);
    }
    return this.mapToResponseDto(gap);
  }

  async update(id: string, updateDto: UpdateSkillGapDto): Promise<SkillGapResponseDto> {
    const gap = await this.repository.findOne({ where: { id } });
    if (!gap) {
      throw new NotFoundException(`Skill gap with ID ${id} not found`);
    }

    Object.assign(gap, updateDto);
    const updated = await this.repository.save(gap);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const gap = await this.repository.findOne({ where: { id } });
    if (!gap) {
      throw new NotFoundException(`Skill gap with ID ${id} not found`);
    }
    await this.repository.remove(gap);
  }

  async getGapAnalysisSummary(): Promise<{
    totalGaps: number;
    criticalGaps: number;
    highPriorityGaps: number;
    mediumPriorityGaps: number;
    lowPriorityGaps: number;
    averageGapPercentage: number;
    gapsByCategory: Record<string, number>;
  }> {
    const gaps = await this.repository.find({
      where: { status: SkillGapStatus.ACTIVE },
    });

    const gapsByCategory: Record<string, number> = {};
    let totalGapPercentage = 0;

    gaps.forEach((gap) => {
      gapsByCategory[gap.category] = (gapsByCategory[gap.category] || 0) + 1;
      totalGapPercentage += Number(gap.gapPercentage) || 0;
    });

    return {
      totalGaps: gaps.length,
      criticalGaps: gaps.filter((g) => g.priority === SkillGapPriority.CRITICAL).length,
      highPriorityGaps: gaps.filter((g) => g.priority === SkillGapPriority.HIGH).length,
      mediumPriorityGaps: gaps.filter((g) => g.priority === SkillGapPriority.MEDIUM).length,
      lowPriorityGaps: gaps.filter((g) => g.priority === SkillGapPriority.LOW).length,
      averageGapPercentage: gaps.length > 0 ? totalGapPercentage / gaps.length : 0,
      gapsByCategory,
    };
  }

  async getGapsByPriority(): Promise<Record<string, SkillGapResponseDto[]>> {
    const gaps = await this.repository.find({
      where: { status: SkillGapStatus.ACTIVE },
      relations: ['skill', 'skill.category'],
      order: { gapPercentage: 'DESC' },
    });

    const grouped: Record<string, SkillGapResponseDto[]> = {
      [SkillGapPriority.CRITICAL]: [],
      [SkillGapPriority.HIGH]: [],
      [SkillGapPriority.MEDIUM]: [],
      [SkillGapPriority.LOW]: [],
    };

    gaps.forEach((gap) => {
      grouped[gap.priority].push(this.mapToResponseDto(gap));
    });

    return grouped;
  }

  private mapToResponseDto(gap: SkillGap): SkillGapResponseDto {
    return { ...gap } as SkillGapResponseDto;
  }
}
