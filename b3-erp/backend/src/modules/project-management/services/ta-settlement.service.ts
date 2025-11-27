import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
// Assuming we might have a Claim entity later, for now using a simple structure or linking to Finance

@Injectable()
export class TASettlementService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
    ) { }

    async createClaim(engineerId: string, projectId: string, amount: number, description: string): Promise<any> {
        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }

        // In a real system, this would create a Claim entity record
        // For now, we'll simulate it and log the expense to the project

        // Log as project expense
        project.totalExpenditure += amount;
        project.actualCost += amount;

        await this.projectRepository.save(project);

        return {
            id: `CLAIM-${Date.now()}`,
            engineerId,
            projectId,
            amount,
            description,
            status: 'Pending Approval',
            createdAt: new Date(),
        };
    }

    async approveClaim(claimId: string, approverId: string): Promise<any> {
        // Mock approval logic
        return {
            id: claimId,
            status: 'Approved',
            approvedBy: approverId,
            approvedAt: new Date(),
        };
    }

    async getProjectClaims(projectId: string): Promise<any[]> {
        // Mock retrieval
        return [];
    }
}
