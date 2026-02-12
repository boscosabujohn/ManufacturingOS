import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillMatrix, ProficiencyLevel, SkillCategory } from '../entities/skill-matrix.entity';

@Injectable()
export class SkillMatrixService {
  constructor(
    @InjectRepository(SkillMatrix)
    private readonly skillMatrixRepository: Repository<SkillMatrix>,
  ) {}

  async create(createDto: Partial<SkillMatrix>): Promise<SkillMatrix> {
    const matrix = this.skillMatrixRepository.create(createDto);
    return this.skillMatrixRepository.save(matrix);
  }

  async findAll(filters?: {
    companyId?: string;
    department?: string;
    employeeId?: string;
  }): Promise<SkillMatrix[]> {
    const query = this.skillMatrixRepository.createQueryBuilder('matrix');

    if (filters?.companyId) {
      query.andWhere('matrix.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.department) {
      query.andWhere('matrix.department = :department', { department: filters.department });
    }

    if (filters?.employeeId) {
      query.andWhere('matrix.employeeId = :employeeId', { employeeId: filters.employeeId });
    }

    query.orderBy('matrix.employeeName', 'ASC');
    return query.getMany();
  }

  async findOne(id: string): Promise<SkillMatrix> {
    const matrix = await this.skillMatrixRepository.findOne({ where: { id } });
    if (!matrix) {
      throw new NotFoundException(`Skill Matrix with ID ${id} not found`);
    }
    return matrix;
  }

  async findByEmployee(employeeId: string): Promise<SkillMatrix | null> {
    return this.skillMatrixRepository.findOne({ where: { employeeId } });
  }

  async update(id: string, updateDto: Partial<SkillMatrix>): Promise<SkillMatrix> {
    const matrix = await this.findOne(id);
    Object.assign(matrix, updateDto);
    return this.skillMatrixRepository.save(matrix);
  }

  async remove(id: string): Promise<void> {
    const matrix = await this.findOne(id);
    await this.skillMatrixRepository.remove(matrix);
  }

  async addSkill(id: string, skill: any): Promise<SkillMatrix> {
    const matrix = await this.findOne(id);
    if (!matrix.skills) {
      matrix.skills = [];
    }
    matrix.skills.push(skill);
    return this.skillMatrixRepository.save(matrix);
  }

  async updateSkill(id: string, skillId: string, updates: any): Promise<SkillMatrix> {
    const matrix = await this.findOne(id);
    if (matrix.skills) {
      const skillIndex = matrix.skills.findIndex(s => s.skillId === skillId);
      if (skillIndex !== -1) {
        matrix.skills[skillIndex] = { ...matrix.skills[skillIndex], ...updates };
      }
    }
    return this.skillMatrixRepository.save(matrix);
  }

  async addCertification(id: string, certification: any): Promise<SkillMatrix> {
    const matrix = await this.findOne(id);
    if (!matrix.certifications) {
      matrix.certifications = [];
    }
    matrix.certifications.push(certification);
    return this.skillMatrixRepository.save(matrix);
  }

  async addTraining(id: string, training: any): Promise<SkillMatrix> {
    const matrix = await this.findOne(id);
    if (!matrix.trainingHistory) {
      matrix.trainingHistory = [];
    }
    matrix.trainingHistory.push(training);
    return this.skillMatrixRepository.save(matrix);
  }

  async getSkillGapAnalysis(companyId: string): Promise<any> {
    const matrices = await this.findAll({ companyId });

    const skillCounts: Record<string, { total: number; byLevel: Record<ProficiencyLevel, number> }> = {};

    matrices.forEach(m => {
      m.skills?.forEach(s => {
        if (!skillCounts[s.skillName]) {
          skillCounts[s.skillName] = {
            total: 0,
            byLevel: { novice: 0, beginner: 0, competent: 0, proficient: 0, expert: 0 },
          };
        }
        skillCounts[s.skillName].total++;
        skillCounts[s.skillName].byLevel[s.proficiency]++;
      });
    });

    const trainingNeeds = matrices
      .flatMap(m => m.trainingNeeds || [])
      .filter(t => t.priority === 'high');

    return {
      totalEmployees: matrices.length,
      skillDistribution: skillCounts,
      highPriorityTrainingNeeds: trainingNeeds,
    };
  }

  async findEmployeesWithSkill(companyId: string, skillId: string, minLevel?: ProficiencyLevel): Promise<SkillMatrix[]> {
    const matrices = await this.findAll({ companyId });

    const levelOrder: Record<ProficiencyLevel, number> = {
      novice: 1,
      beginner: 2,
      competent: 3,
      proficient: 4,
      expert: 5,
    };

    return matrices.filter(m => {
      const skill = m.skills?.find(s => s.skillId === skillId);
      if (!skill) return false;
      if (!minLevel) return true;
      return levelOrder[skill.proficiency] >= levelOrder[minLevel];
    });
  }
}
