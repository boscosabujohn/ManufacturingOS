import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Between, In } from 'typeorm';
import { ApprovalRequest, ApprovalStatus } from '../../approvals/entities/approval-request.entity';
import { UserTask, SLAStatus, TaskStatus } from '../../approvals/entities/user-task.entity';
import { NotificationService } from '../../notifications/services/notification.service';
import { EscalationService } from './escalation.service';

@Injectable()
export class SLAMonitoringService {
    constructor(
        @InjectRepository(ApprovalRequest)
        private approvalRepository: Repository<ApprovalRequest>,
        @InjectRepository(UserTask)
        private userTaskRepository: Repository<UserTask>,
        private notificationService: NotificationService,
        private escalationService: EscalationService,
    ) { }

    /**
     * Check SLA status every 5 minutes
     */
    @Cron(CronExpression.EVERY_5_MINUTES)
    async checkSLAStatus() {
        console.log('🔍 Checking SLA status for all pending approvals...');

        const now = new Date();

        try {
            const pendingApprovals = await this.approvalRepository.find({
                where: { status: ApprovalStatus.PENDING },
                relations: ['chain'],
            });

            for (const approval of pendingApprovals) {
                if (!approval.deadline) continue;

                const deadline = new Date(approval.deadline);
                const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

                await this.updateUserTasksSLAStatus(approval.id, hoursRemaining);

                if (hoursRemaining < 0) {
                    await this.handleSLABreach(approval);
                } else if (hoursRemaining <= 4 && hoursRemaining > 0) {
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
            const breachedApprovals = await this.approvalRepository
                .createQueryBuilder('approval')
                .leftJoinAndSelect('approval.chain', 'chain')
                .where('approval.deadline < :now', { now: new Date() })
                .andWhere('approval.status = :status', { status: ApprovalStatus.PENDING })
                .getMany();

            if (breachedApprovals.length > 0) {
                console.log(`⚠️  ${breachedApprovals.length} approvals breached SLA`);
            }
        } catch (error) {
            console.error('❌ Daily SLA report failed:', error);
        }
    }

    /**
     * Update SLA status for user tasks
     */
    private async updateUserTasksSLAStatus(
        approvalId: string,
        hoursRemaining: number,
    ): Promise<void> {
        let slaStatus: SLAStatus;

        if (hoursRemaining < 0) {
            slaStatus = SLAStatus.BREACHED;
        } else if (hoursRemaining <= 4) {
            slaStatus = SLAStatus.WARNING;
        } else {
            slaStatus = SLAStatus.ON_TRACK;
        }

        await this.userTaskRepository.update(
            { status: TaskStatus.PENDING } as any,
            { slaStatus },
        );
    }

    /**
     * Handle SLA breach — notify approvers and trigger auto-escalation
     */
    private async handleSLABreach(approval: ApprovalRequest): Promise<void> {
        const tasks = await this.userTaskRepository.find({
            where: {
                status: TaskStatus.PENDING,
                slaStatus: Not(SLAStatus.BREACHED),
            } as any,
        });

        for (const task of tasks) {
            await this.notificationService.notifySLABreached(
                task.userId,
                approval.id,
                approval.chain?.name || 'Approval',
            );

            await this.userTaskRepository.update(task.id, {
                slaStatus: SLAStatus.BREACHED,
            });
        }

        // Auto-escalate if the approval chain has escalation rules configured
        const escalated = await this.escalationService.autoEscalate(approval.id);
        if (escalated) {
            console.log(`🔺 Auto-escalated approval ${approval.id} due to SLA breach`);
        }
    }

    /**
     * Handle SLA approaching — warn approvers
     */
    private async handleSLAApproaching(
        approval: ApprovalRequest,
        hoursRemaining: number,
    ): Promise<void> {
        const tasks = await this.userTaskRepository.find({
            where: {
                status: TaskStatus.PENDING,
                slaStatus: SLAStatus.ON_TRACK,
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
     * Get SLA statistics for a date range
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
