import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';

@Injectable()
export class EmergencySpareService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
    ) { }

    async requestSpare(projectId: string, partId: string, quantity: number, urgency: string, requestedBy: string): Promise<any> {
        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }

        // Simulate creation of a SpareRequest entity
        const request = {
            id: `SPR-${Date.now()}`,
            projectId,
            partId,
            quantity,
            urgency,
            requestedBy,
            status: 'Pending Approval',
            createdAt: new Date(),
        };

        // In a real system, we would check inventory here or trigger a purchase requisition
        // For now, we just log the request
        console.log(`Emergency spare requested for project ${project.projectName}: ${quantity} x ${partId} (${urgency})`);

        return request;
    }

    async approveRequest(requestId: string, approverId: string): Promise<any> {
        // Mock approval logic
        return {
            id: requestId,
            status: 'Approved',
            approvedBy: approverId,
            approvedAt: new Date(),
        };
    }

    async rejectRequest(requestId: string, rejectorId: string, reason: string): Promise<any> {
        // Mock rejection logic
        return {
            id: requestId,
            status: 'Rejected',
            rejectedBy: rejectorId,
            rejectionReason: reason,
            rejectedAt: new Date(),
        };
    }
}
