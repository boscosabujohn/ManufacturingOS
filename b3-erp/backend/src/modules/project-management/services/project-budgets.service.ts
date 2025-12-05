import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectBudget } from '../entities/project-budget.entity';
import { CreateProjectBudgetDto, UpdateProjectBudgetDto } from '../dto/project-budget.dto';

@Injectable()
export class ProjectBudgetsService {
    constructor(
        @InjectRepository(ProjectBudget)
        private budgetRepository: Repository<ProjectBudget>,
    ) { }

    async create(createBudgetDto: CreateProjectBudgetDto): Promise<ProjectBudget> {
        const budget = this.budgetRepository.create(createBudgetDto);
        return this.budgetRepository.save(budget);
    }

    async findAll(projectId: string): Promise<ProjectBudget[]> {
        return this.budgetRepository.find({
            where: { projectId },
            order: { createdAt: 'ASC' }
        });
    }

    async findOne(id: string): Promise<ProjectBudget> {
        const budget = await this.budgetRepository.findOne({ where: { id } });
        if (!budget) {
            throw new NotFoundException(`Budget with ID ${id} not found`);
        }
        return budget;
    }

    async update(id: string, updateBudgetDto: UpdateProjectBudgetDto): Promise<ProjectBudget> {
        const budget = await this.findOne(id);
        Object.assign(budget, updateBudgetDto);
        return this.budgetRepository.save(budget);
    }

    async remove(id: string): Promise<void> {
        const result = await this.budgetRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Budget with ID ${id} not found`);
        }
    }
}
