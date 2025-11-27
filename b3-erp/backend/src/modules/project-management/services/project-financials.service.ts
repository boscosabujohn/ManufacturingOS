import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectFinancialsService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
    ) { }

    async trackExpense(projectId: string, amount: number, category: string): Promise<Project> {
        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }

        project.totalExpenditure += amount;
        project.actualCost += amount; // Sync actualCost
        this.calculateFinancials(project);

        return this.projectRepository.save(project);
    }

    async trackIncome(projectId: string, amount: number, source: string): Promise<Project> {
        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }

        project.totalIncome += amount;
        this.calculateFinancials(project);

        return this.projectRepository.save(project);
    }

    async calculateIoE(projectId: string): Promise<{ income: number; expenditure: number; margin: number; status: string }> {
        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }

        return {
            income: project.totalIncome,
            expenditure: project.totalExpenditure,
            margin: project.margin,
            status: project.financialStatus,
        };
    }

    private calculateFinancials(project: Project): void {
        project.margin = project.totalIncome - project.totalExpenditure;
        if (project.margin > 0) {
            project.financialStatus = 'Profitable';
        } else if (project.margin < 0) {
            project.financialStatus = 'Loss';
        } else {
            project.financialStatus = 'Break-even';
        }
    }
}
