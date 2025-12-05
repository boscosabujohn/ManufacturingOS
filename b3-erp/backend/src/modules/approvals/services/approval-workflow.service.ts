import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    ApprovalRequest,
    ApprovalHistory,
    ApprovalStatus,
    ApprovalAction,
    ApprovalPriority,
    UserTask,
    TaskType,
    TaskStatus,
    SLAStatus,
} from '../entities';
import { ApprovalChainService } from './approval-chain.service';
import { CreateApprovalRequestDto } from '../dto/create-approval-request.dto';

@Injectable()
export class ApprovalWorkflowService {
    constructor(
        @InjectRepository(ApprovalRequest)
        private requestRepository: Repository<ApprovalRequest>,
        @InjectRepository(ApprovalHistory)
        private historyRepository: Repository<ApprovalHistory>,
        @InjectRepository(UserTask)
        private taskRepository: Repository<UserTask>,
        private chainService: ApprovalChainService,
    ) { }

    /**
     * Create a new approval request and initiate the approval workflow
     */
    async createApprovalRequest(
        dto: CreateApprovalRequestDto,
    ): Promise<ApprovalRequest> {
        // Get the approval chain for this entity type
        const chain = await this.chainService.getChainForEntity(dto.entityType, {
            amount: dto.amount,
        });

        if (!chain || chain.levels.length === 0) {
            throw new NotFoundException(
                `No approval chain configured for entity type: ${dto.entityType}`,
            );
        }

        // Calculate deadline based on first level SLA
        const firstLevelSLA = chain.levels[0].slaHours;
        const deadline = new Date();
        deadline.setHours(deadline.getHours() + firstLevelSLA);

        // Create the approval request
        const request = this.requestRepository.create({
            ...dto,
            priority: dto.priority || ApprovalPriority.MEDIUM,
            status: ApprovalStatus.PENDING,
            currentLevel: 1,
            totalLevels: chain.levels.length,
            chainId: chain.id,
            deadline,
        });

        const savedRequest = await this.requestRepository.save(request);

        // Create initial history entry
        await this.historyRepository.save({
            requestId: savedRequest.id,
            level: 1,
            approverId: 'system',
            action: ApprovalAction.PENDING,
            comment: 'Approval request created',
        });

        // Create tasks for level 1 approvers
        await this.createApproverTasks(savedRequest, chain.levels[0]);

        return this.requestRepository.findOne({
            where: { id: savedRequest.id },
            relations: ['history', 'comments', 'attachments'],
        });
    }

    /**
     * Approve an approval request
     */
    async approveRequest(
        requestId: string,
        approverId: string,
        comment?: string,
    ): Promise<ApprovalRequest> {
        const request = await this.requestRepository.findOne({
            where: { id: requestId },
            relations: ['history'],
        });

        if (!request) {
            throw new NotFoundException('Approval request not found');
        }

        if (request.status !== ApprovalStatus.PENDING) {
            throw new BadRequestException(
                `Cannot approve request with status: ${request.status}`,
            );
        }

        // Get the approval chain
        const chain = await this.chainService.getChainForEntity(
            request.entityType,
            { amount: request.amount },
        );

        const currentLevel = chain.levels.find(
            (l) => l.sequence === request.currentLevel,
        );

        // Record the approval
        await this.historyRepository.save({
            requestId,
            level: request.currentLevel,
            approverId,
            action: ApprovalAction.APPROVED,
            comment,
        });

        // Mark user's task as completed
        await this.completeUserTask(requestId, approverId);

        // Check if this level is complete
        const approvalsAtLevel = await this.getApprovalCountForLevel(
            requestId,
            request.currentLevel,
        );

        if (approvalsAtLevel >= currentLevel.requiredCount) {
            // Level is complete - move to next level or complete the request
            if (request.currentLevel < request.totalLevels) {
                return this.moveToNextLevel(request, chain);
            } else {
                return this.completeApproval(request);
            }
        }

        return this.requestRepository.findOne({
            where: { id: requestId },
            relations: ['history', 'comments', 'attachments'],
        });
    }

    /**
     * Reject an approval request
     */
    async rejectRequest(
        requestId: string,
        approverId: string,
        reason: string,
    ): Promise<ApprovalRequest> {
        const request = await this.requestRepository.findOne({
            where: { id: requestId },
        });

        if (!request) {
            throw new NotFoundException('Approval request not found');
        }

        if (request.status !== ApprovalStatus.PENDING) {
            throw new BadRequestException(
                `Cannot reject request with status: ${request.status}`,
            );
        }

        // Record the rejection
        await this.historyRepository.save({
            requestId,
            level: request.currentLevel,
            approverId,
            action: ApprovalAction.REJECTED,
            comment: reason,
        });

        // Update request status
        await this.requestRepository.update(requestId, {
            status: ApprovalStatus.REJECTED,
        });

        // Cancel all pending tasks for this request
        await this.cancelPendingTasks(requestId);

        // TODO: Notify requester of rejection
        // TODO: Update entity status (e.g., PO status = "rejected")

        return this.requestRepository.findOne({
            where: { id: requestId },
            relations: ['history', 'comments', 'attachments'],
        });
    }

    /**
     * Get pending approval requests for a specific user
     */
    async getPendingApprovalsForUser(userId: string): Promise<ApprovalRequest[]> {
        // TODO: Implement user role checking to filter approvals
        // For now, return all pending approvals
        return this.requestRepository.find({
            where: { status: ApprovalStatus.PENDING },
            relations: ['history'],
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Get approval history for a request
     */
    async getApprovalHistory(requestId: string): Promise<ApprovalHistory[]> {
        return this.historyRepository.find({
            where: { requestId },
            order: { timestamp: 'ASC' },
        });
    }

    /**
     * Move approval request to the next level
     */
    private async moveToNextLevel(request: ApprovalRequest, chain: any) {
        const nextLevel = request.currentLevel + 1;
        const nextLevelConfig = chain.levels.find((l) => l.sequence === nextLevel);

        if (!nextLevelConfig) {
            throw new Error('Next level configuration not found');
        }

        // Calculate new deadline
        const newDeadline = new Date();
        newDeadline.setHours(newDeadline.getHours() + nextLevelConfig.slaHours);

        // Update request
        await this.requestRepository.update(request.id, {
            currentLevel: nextLevel,
            deadline: newDeadline,
        });

        // Create history entry for new level
        await this.historyRepository.save({
            requestId: request.id,
            level: nextLevel,
            approverId: 'system',
            action: ApprovalAction.PENDING,
            comment: `Moved to level ${nextLevel}`,
        });

        // Create tasks for next level approvers
        const updatedRequest = await this.requestRepository.findOne({
            where: { id: request.id },
        });
        await this.createApproverTasks(updatedRequest, nextLevelConfig);

        // TODO: Send notifications to next level approvers

        return this.requestRepository.findOne({
            where: { id: request.id },
            relations: ['history', 'comments', 'attachments'],
        });
    }

    /**
     * Complete the approval workflow
     */
    private async completeApproval(request: ApprovalRequest) {
        await this.requestRepository.update(request.id, {
            status: ApprovalStatus.APPROVED,
        });

        // TODO: Update entity status (e.g., PO status = "approved")
        // TODO: Notify requester of approval

        return this.requestRepository.findOne({
            where: { id: request.id },
            relations: ['history', 'comments', 'attachments'],
        });
    }

    /**
     * Create tasks for approvers at a specific level
     */
    private async createApproverTasks(request: ApprovalRequest, level: any) {
        // For now, create tasks for all approvers in approverIds
        // TODO: Implement role-based user lookup
        const tasks = level.approverIds.map((approverId) =>
            this.taskRepository.create({
                userId: approverId,
                taskType: TaskType.APPROVAL,
                title: `Approve: ${request.title}`,
                description: request.description,
                module: 'Procurement',
                moduleUrl: `/workflow/approvals/view/${request.id}`,
                referenceNumber: request.referenceNumber,
                priority: request.priority as any,
                status: TaskStatus.PENDING,
                dueDate: request.deadline,
                slaStatus: SLAStatus.ON_TRACK,
                metadata: {
                    approvalRequestId: request.id,
                    entityType: request.entityType,
                    entityId: request.entityId,
                },
            }),
        );

        await this.taskRepository.save(tasks);
    }

    /**
     * Get approval count for a specific level
     */
    private async getApprovalCountForLevel(
        requestId: string,
        level: number,
    ): Promise<number> {
        return this.historyRepository.count({
            where: {
                requestId,
                level,
                action: ApprovalAction.APPROVED,
            },
        });
    }

    /**
     * Mark user's task as completed
     */
    private async completeUserTask(requestId: string, userId: string) {
        await this.taskRepository.update(
            {
                metadata: { approvalRequestId: requestId } as any,
                userId,
                status: TaskStatus.PENDING,
            },
            {
                status: TaskStatus.COMPLETED,
                completedAt: new Date(),
            },
        );
    }

    /**
     * Cancel all pending tasks for a request
     */
    private async cancelPendingTasks(requestId: string) {
        await this.taskRepository.delete({
            metadata: { approvalRequestId: requestId } as any,
            status: TaskStatus.PENDING,
        });
    }
}
