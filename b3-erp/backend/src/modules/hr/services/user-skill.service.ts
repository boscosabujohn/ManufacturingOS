import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSkill, UserSkillStatus } from '../entities/user-skill.entity';
import {
  CreateUserSkillDto,
  UpdateUserSkillDto,
  UserSkillResponseDto,
} from '../dto';

@Injectable()
export class UserSkillService {
  constructor(
    @InjectRepository(UserSkill)
    private readonly repository: Repository<UserSkill>,
  ) {}

  async create(createDto: CreateUserSkillDto): Promise<UserSkillResponseDto> {
    const existing = await this.repository.findOne({
      where: {
        employeeId: createDto.employeeId,
        skillId: createDto.skillId,
      },
    });

    if (existing) {
      throw new BadRequestException('This skill is already assigned to the employee');
    }

    const entity = this.repository.create(createDto);
    const saved = await this.repository.save(entity);
    return this.mapToResponseDto(saved);
  }

  async findAll(filters?: {
    employeeId?: string;
    skillId?: string;
    status?: string;
    isEnabled?: boolean;
  }): Promise<UserSkillResponseDto[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('userSkill')
      .leftJoinAndSelect('userSkill.skill', 'skill')
      .leftJoinAndSelect('skill.category', 'category')
      .orderBy('skill.sortOrder', 'ASC')
      .addOrderBy('skill.name', 'ASC');

    if (filters?.employeeId) {
      queryBuilder.andWhere('userSkill.employeeId = :employeeId', {
        employeeId: filters.employeeId,
      });
    }

    if (filters?.skillId) {
      queryBuilder.andWhere('userSkill.skillId = :skillId', {
        skillId: filters.skillId,
      });
    }

    if (filters?.status) {
      queryBuilder.andWhere('userSkill.status = :status', {
        status: filters.status,
      });
    }

    if (filters?.isEnabled !== undefined) {
      queryBuilder.andWhere('userSkill.isEnabled = :isEnabled', {
        isEnabled: filters.isEnabled,
      });
    }

    const userSkills = await queryBuilder.getMany();
    return userSkills.map((us) => this.mapToResponseDto(us));
  }

  async findOne(id: string): Promise<UserSkillResponseDto> {
    const userSkill = await this.repository.findOne({
      where: { id },
      relations: ['skill', 'skill.category'],
    });
    if (!userSkill) {
      throw new NotFoundException(`User skill with ID ${id} not found`);
    }
    return this.mapToResponseDto(userSkill);
  }

  async findByEmployeeId(employeeId: string): Promise<UserSkillResponseDto[]> {
    const userSkills = await this.repository.find({
      where: { employeeId },
      relations: ['skill', 'skill.category'],
      order: { createdAt: 'DESC' },
    });
    return userSkills.map((us) => this.mapToResponseDto(us));
  }

  async findByEmployeeAndSkill(employeeId: string, skillId: string): Promise<UserSkillResponseDto | null> {
    const userSkill = await this.repository.findOne({
      where: { employeeId, skillId },
      relations: ['skill', 'skill.category'],
    });
    return userSkill ? this.mapToResponseDto(userSkill) : null;
  }

  async update(id: string, updateDto: UpdateUserSkillDto): Promise<UserSkillResponseDto> {
    const userSkill = await this.repository.findOne({ where: { id } });
    if (!userSkill) {
      throw new NotFoundException(`User skill with ID ${id} not found`);
    }

    Object.assign(userSkill, updateDto);
    const updated = await this.repository.save(userSkill);
    return this.mapToResponseDto(updated);
  }

  async verifySkill(
    id: string,
    verifiedById: string,
    verifiedByName: string,
    notes?: string,
  ): Promise<UserSkillResponseDto> {
    const userSkill = await this.repository.findOne({ where: { id } });
    if (!userSkill) {
      throw new NotFoundException(`User skill with ID ${id} not found`);
    }

    userSkill.verifiedById = verifiedById;
    userSkill.verifiedByName = verifiedByName;
    userSkill.verifiedAt = new Date();
    userSkill.verificationNotes = notes;
    userSkill.status = UserSkillStatus.VERIFIED;

    const updated = await this.repository.save(userSkill);
    return this.mapToResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const userSkill = await this.repository.findOne({ where: { id } });
    if (!userSkill) {
      throw new NotFoundException(`User skill with ID ${id} not found`);
    }
    await this.repository.remove(userSkill);
  }

  async removeByEmployeeAndSkill(employeeId: string, skillId: string): Promise<void> {
    const userSkill = await this.repository.findOne({
      where: { employeeId, skillId },
    });
    if (!userSkill) {
      throw new NotFoundException('User skill not found');
    }
    await this.repository.remove(userSkill);
  }

  async getSkillMatrix(departmentId?: string): Promise<any[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('userSkill')
      .leftJoinAndSelect('userSkill.skill', 'skill')
      .leftJoinAndSelect('userSkill.employee', 'employee')
      .leftJoinAndSelect('skill.category', 'category')
      .where('userSkill.isEnabled = :isEnabled', { isEnabled: true });

    if (departmentId) {
      queryBuilder.andWhere('employee.departmentId = :departmentId', {
        departmentId,
      });
    }

    const userSkills = await queryBuilder.getMany();

    // Group by employee and skill for matrix
    const matrix: Record<string, Record<string, number>> = {};
    userSkills.forEach((us) => {
      const employeeName = us.employee?.fullName || us.employeeId;
      const skillName = us.skill?.name || us.skillId;

      if (!matrix[employeeName]) {
        matrix[employeeName] = {};
      }
      matrix[employeeName][skillName] = us.proficiencyLevel;
    });

    return Object.entries(matrix).map(([employee, skills]) => ({
      employee,
      skills,
    }));
  }

  private mapToResponseDto(userSkill: UserSkill): UserSkillResponseDto {
    return { ...userSkill } as UserSkillResponseDto;
  }
}
