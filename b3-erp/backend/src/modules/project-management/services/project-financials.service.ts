import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../project/entities/project.entity';

@Injectable()
export class ProjectFinancialsService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
    ) { }

    async trackExpense(projectId: string, amount: number, category: string, description?: string): Promise<Project> {
        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }

        project.budgetSpent = (Number(project.budgetSpent) || 0) + amount;
        // this.calculateFinancials(project); // Disabled until fields exist

        return this.projectRepository.save(project);
    }

    async trackIncome(projectId: string, amount: number, source: string, description?: string): Promise<Project> {
        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }

        // project.totalIncome += amount; // Field does not exist
        // this.calculateFinancials(project);

        return project; // No-op for now
    }

    async calculateIoE(projectId: string): Promise<{ income: number; expenditure: number; margin: number; status: string }> {
        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }

        const income = 0; // Placeholder
        const expenditure = Number(project.budgetSpent) || 0;
        const margin = income - expenditure;
        let status = 'Break-even';
        if (margin > 0) status = 'Profitable';
        if (margin < 0) status = 'Loss';

        return {
            income,
            expenditure,
            margin,
            status,
        };
    }

    private calculateFinancials(project: Project): void {
        // Disabled
    }
}
