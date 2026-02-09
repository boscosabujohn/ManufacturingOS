import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToolDeployment, ToolDeploymentStatus } from '../entities/tool-deployment.entity';

@Injectable()
export class ToolManagementService {
    constructor(
        @InjectRepository(ToolDeployment)
        private toolDeploymentRepository: Repository<ToolDeployment>,
    ) { }

    async issueToolToSite(toolId: string, projectId: string, condition: string, issuedBy?: string): Promise<ToolDeployment> {
        const deployment = this.toolDeploymentRepository.create({
            toolId,
            projectId,
            conditionAtIssue: condition,
            status: ToolDeploymentStatus.ISSUED,
            issuedBy,
            issuedAt: new Date(),
        });

        return await this.toolDeploymentRepository.save(deployment);
    }

    async returnToolFromSite(deploymentId: string, condition: string, depreciation: number, returnedBy?: string): Promise<ToolDeployment> {
        const deployment = await this.toolDeploymentRepository.findOne({ where: { id: deploymentId } });
        if (!deployment) {
            throw new NotFoundException(`Tool deployment with ID ${deploymentId} not found`);
        }

        deployment.status = ToolDeploymentStatus.RETURNED;
        deployment.conditionAtReturn = condition;
        deployment.depreciationValue = depreciation;
        deployment.returnedAt = new Date();
        deployment.returnedBy = returnedBy;

        return await this.toolDeploymentRepository.save(deployment);
    }

    async getDeployedTools(projectId: string): Promise<ToolDeployment[]> {
        return await this.toolDeploymentRepository.find({
            where: { projectId },
            order: { issuedAt: 'DESC' },
        });
    }

    async getAllDeployments(): Promise<ToolDeployment[]> {
        return await this.toolDeploymentRepository.find({
            order: { issuedAt: 'DESC' },
        });
    }
}
