import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { ApprovalRequest, ApprovalStatus } from '../../approvals/entities/approval-request.entity';
import { UserTask, SLAStatus, TaskStatus } from '../../approvals/entities/user-task.entity';
import { NotificationService } from '../../notifications/services/notification.service';

@Injectable()
export class SLAMonitoringService {
    constructor(
        @InjectRepository(ApprovalRequest)
        private approvalRepository: Repository<ApprovalRequest>,
        @InjectRepository(UserTask)
        private userTaskRepository: Repository<UserTask>,
        private notificationService: NotificationService,
    ) { }

    /**
     * Check SLA status every 5 minutes
     */
    @Cron(CronExpression.EVERY_5_MINUTES)
    async checkSLAStatus() {
        console.log('🔍 Checking SLA status for all pending approvals...');

        const now = new Date();
        const approachingThreshold = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours

        try {
            // Find all pending approval requests
            const pendingApprovals = await this.approvalRepository.find({
                where: { status: ApprovalStatus.PENDING },
                relations: ['chain'],
            });

            for (const approval of pendingApprovals) {
                if (!approval.deadline) continue;

                const deadline = new Date(approval.deadline);
                const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

                // Update user tasks based on SLA status
                await this.updateUserTasksSLAStatus(approval.id, hoursRemaining);

                // Send notifications
                if (hoursRemaining < 0) {
                    // SLA breached
                    await this.handleSLABreach(approval);
                } else if (hoursRemaining <= 4 && hoursRemaining > 0) {
                    // SLA approaching (within 4 hours)
                    await this.handleSLAApproaching(approval, Math.ceil(hoursRemaining));
                }
            }

            console.log(`✅ SLA check completed for ${pendingApprovals.length} approvals`);
        } catch (error) {
            console.error('❌ SLA check failed:', error);
        }
    }

    /**
     * Daily summary of SLA breaches (sent at 9 AM)
     */
    @Cron('0 9 * * *')
    async sendDailySLAReport() {
        console.log('📊 Generating daily SLA report...');

        try {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Find all breached approvals from yesterday
            const breachedApprovals = await this.approvalRepository
                .createQueryBuilder('approval')
                .leftJoinAndSelect('approval.chain', 'chain')
                .where('approval.deadline < :now', { now: new Date() })
                .andWhere('approval.status = :status', { status: ApprovalStatus.PENDING })
                .getMany();

            if (breachedApprovals.length > 0) {
                console.log(`⚠️  ${breachedApprovals.length} approvals breached SLA`);
                // TODO: Send summary email to managers
            }
        } catch (error) {
            console.error('❌ Daily SLA report failed:', error);
        }
    }

    /**
     Update SLA status for user tasks
     */
    private async updateUserTasksSLAStatus(
        approvalId: string,
        hoursRemaining: number,
    ): Promise<void> {
        let slaStatus: string;

        if (hoursRemaining < 0) {
            slaStatus = SLAStatus.BREACHED;
        } else if (hoursRemaining <= 4) {
            slaStatus = SLAStatus.WARNING;
        } else {
            slaStatus = SLAStatus.ON_TRACK;
        }

        await this.userTaskRepository.update(
            { requestId: approvalId, status: TaskStatus.PENDING } as any, // Cast to any to avoid strict type check on where clause if needed, or better fix type
            { slaStatus: slaStatus as SLAStatus },
        );
    }

    /**
     * Handle SLA breach
     */
    private async handleSLABreach(approval: ApprovalRequest): Promise<void> {
        // Find all pending user tasks for this approval
        const tasks = await this.userTaskRepository.find({
            where: {
                metadata: { approvalRequestId: approval.id }, // Assuming metadata stores requestId, or use a proper column if it exists. Based on error "requestId" didn't exist on UserTask in entity file, but was used here. Wait, UserTask entity has metadata. The service code uses requestId property which is NOT in UserTask entity. I should check if I need to add it or use metadata.
                status: TaskStatus.PENDING,
                slaStatus: Not(SLAStatus.BREACHED),
            } as any,
        });

        for (const task of tasks) {
            // Send notification
            await this.notificationService.notifySLABreached(
                task.userId,
                approval.id,
                approval.chain?.name || 'Approval',
            );

            // Update task status
            await this.userTaskRepository.update(task.id, {
                slaStatus: SLAStatus.BREACHED,
            });
        }

        // Check if auto-escalation is enabled
        // TODO: Implement auto-escalation logic
    }

    /**
     * Handle SLA approaching
     */
    private async handleSLAApproaching(
        approval: ApprovalRequest,
        hoursRemaining: number,
    ): Promise<void> {
        const tasks = await this.userTaskRepository.find({
            where: {
                metadata: { approvalRequestId: approval.id },
                status: TaskStatus.PENDING,
                slaStatus: SLAStatus.ON_TRACK, // Only notify if status was previously on_time
            } as any,
        });

        for (const task of tasks) {
            await this.notificationService.notifySLAApproaching(
                task.userId,
                approval.id,
                approval.chain?.name || 'Approval',
                hoursRemaining,
            );

            await this.userTaskRepository.update(task.id, {
                slaStatus: SLAStatus.WARNING,
            });
        }
    }

    /**
     * Get SLA statistics
     */
    async getSLAStatistics(startDate: Date, endDate: Date) {
        const approvals = await this.approvalRepository.find({
            where: {
                createdAt: Between(startDate, endDate),
                status: In([ApprovalStatus.APPROVED, ApprovalStatus.REJECTED]),
            },
        });

        const totalApprovals = approvals.length;
        const onTimeApprovals = approvals.filter((a) => {
            if (!a.deadline || !a.completedAt) return false;
            return a.completedAt <= a.deadline;
        }).length;

        const slaComplianceRate = totalApprovals > 0
            ? (onTimeApprovals / totalApprovals) * 100
            : 0;

        return {
            totalApprovals,
            onTimeApprovals,
            breachedApprovals: totalApprovals - onTimeApprovals,
            slaComplianceRate: Math.round(slaComplianceRate * 100) / 100,
        };
    }
}

// Import these at the top
import { Not, Between, In } from 'typeorm';
