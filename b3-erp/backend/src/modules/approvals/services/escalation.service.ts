import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalRequest } from '../entities/approval-request.entity';
import { ApprovalLevel } from '../entities/approval-level.entity';
import { UserTask, TaskStatus } from '../entities/user-task.entity';
import { NotificationService } from '../../notifications/services/notification.service';

@Injectable()
export class EscalationService {
    constructor(
        @InjectRepository(ApprovalRequest)
        private approvalRepository: Repository<ApprovalRequest>,
        @InjectRepository(ApprovalLevel)
        private levelRepository: Repository<ApprovalLevel>,
        @InjectRepository(UserTask)
        private userTaskRepository: Repository<UserTask>,
        private notificationService: NotificationService,
    ) { }

    /**
     * Auto-escalate approval on SLA breach
     */
    async autoEscalate(approvalId: string): Promise<boolean> {
        const approval = await this.approvalRepository.findOne({
            where: { id: approvalId },
            relations: ['chain', 'chain.levels'],
        });

        if (!approval || approval.status !== 'pending') {
            return false;
        }

        // Get current level
        const currentLevel = approval.chain.levels.find(
            (l) => l.sequence === approval.currentLevel,
        );

        if (!currentLevel || !currentLevel.escalationRules) {
            return false;
        }

        const escalationRules = currentLevel.escalationRules;

        // Check if auto-escalation is enabled
        if (!escalationRules.autoEscalate) {
            return false;
        }

        // Find next level or escalation target
        const targetLevelSequence = escalationRules.escalateToLevel || approval.currentLevel + 1;
        const targetLevel = approval.chain.levels.find(
            (l) => l.sequence === targetLevelSequence,
        );

        if (!targetLevel) {
            console.warn(`No escalation target found for approval ${approvalId}`);
            return false;
        }

        // Create tasks for escalated approvers
        const newTasks = targetLevel.approverIds.map((approverId) => {
            return this.userTaskRepository.create({
                userId: approverId,
                metadata: { approvalRequestId: approval.id },
                taskType: 'approval' as any,
                status: TaskStatus.PENDING,
                dueDate: this.calculateNewDeadline(targetLevel.slaHours),
            } as any);
        });

        await this.userTaskRepository.save(newTasks as any);

        // Update approval level
        await this.approvalRepository.update(approval.id, {
            currentLevel: targetLevelSequence,
            deadline: this.calculateNewDeadline(targetLevel.slaHours),
        });

        // Send notifications
        for (const approverId of targetLevel.approverIds) {
            await this.notificationService.notifyEscalation(
                approverId,
                approval.id,
                approval.chain.name,
                'Previous Approver', // TODO: Get actual approver name
            );
        }

        console.log(`✅ Escalated approval ${approvalId} to level ${targetLevelSequence}`);
        return true;
    }

    /**
     * Manual escalation
     */
    async manualEscalate(
        approvalId: string,
        escalatedBy: string,
        escalateTo: string[],
        reason: string,
    ): Promise<boolean> {
        const approval = await this.approvalRepository.findOne({
            where: { id: approvalId },
            relations: ['chain'],
        });

        if (!approval || approval.status !== 'pending') {
            return false;
        }

        // Cancel existing pending tasks
        await this.userTaskRepository.update(
            { metadata: { approvalRequestId: approvalId }, status: TaskStatus.PENDING } as any,
            { status: TaskStatus.ESCALATED },
        );

        // Create new tasks for escalated users
        const newTasks = escalateTo.map((userId) => {
            return this.userTaskRepository.create({
                userId,
                metadata: { approvalRequestId: approval.id },
                taskType: 'approval' as any,
                status: TaskStatus.PENDING,
                dueDate: this.calculateNewDeadline(24), // 24 hour SLA for manual escalation
            } as any);
        });

        await this.userTaskRepository.save(newTasks as any);

        // Send notifications
        for (const userId of escalateTo) {
            await this.notificationService.notifyEscalation(
                userId,
                approval.id,
                approval.chain.name,
                escalatedBy,
            );
        }

        console.log(`✅ Manually escalated approval ${approvalId} by ${escalatedBy}`);
        return true;
    }

    /**
     * Get escalation history
     */
    async getEscalationHistory(approvalId: string) {
        const tasks = await this.userTaskRepository.find({
            where: { metadata: { approvalRequestId: approvalId } } as any,
            order: { createdAt: 'ASC' },
        });

        return tasks.filter((t) => t.status === TaskStatus.ESCALATED);
    }

    /**
     * Calculate new deadline
     */
    private calculateNewDeadline(slaHours: number): Date {
        const deadline = new Date();
        deadline.setHours(deadline.getHours() + slaHours);
        return deadline;
    }

    /**
     * Check if escalation is needed
     */
    async checkEscalationNeeded(approvalId: string): Promise<boolean> {
        const approval = await this.approvalRepository.findOne({
            where: { id: approvalId },
        });

        if (!approval || !approval.deadline) {
            return false;
        }

        const now = new Date();
        return now > approval.deadline;
    }
}
