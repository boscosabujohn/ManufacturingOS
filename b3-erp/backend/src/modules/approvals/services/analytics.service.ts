import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ApprovalRequest } from '../entities/approval-request.entity';
import { ApprovalChain } from '../entities/approval-chain.entity';
import { UserTask, TaskStatus, TaskType } from '../entities/user-task.entity';

export interface SLAMetrics {
    totalApprovals: number;
    onTimeApprovals: number;
    approachingApprovals: number;
    breachedApprovals: number;
    complianceRate: number;
    avgApprovalTime: number;
    avgResponseTime: number;
}

export interface WorkflowPerformance {
    workflowName: string;
    workflowId: string;
    totalCount: number;
    onTime: number;
    approaching: number;
    breached: number;
    avgTime: number;
    complianceRate: number;
}

export interface TrendData {
    date: string;
    onTime: number;
    approaching: number;
    breached: number;
    complianceRate: number;
}

export interface ApproverPerformance {
    approverId: string;
    approverName: string;
    role: string;
    totalTasks: number;
    completedOnTime: number;
    avgResponseTime: number;
    complianceRate: number;
}

export interface DelayAnalysis {
    workflowName: string;
    phase: string;
    avgDelay: number;
    maxDelay: number;
    delayCount: number;
    commonReasons: string[];
}

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(ApprovalRequest)
        private approvalRepository: Repository<ApprovalRequest>,
        @InjectRepository(ApprovalChain)
        private chainRepository: Repository<ApprovalChain>,
        @InjectRepository(UserTask)
        private userTaskRepository: Repository<UserTask>,
    ) { }

    /**
     * Get overall SLA metrics
     */
    async getSLAMetrics(startDate: Date, endDate: Date): Promise<SLAMetrics> {
        const approvals = await this.approvalRepository.find({
            where: {
                createdAt: Between(startDate, endDate),
            },
        });

        const totalApprovals = approvals.length;

        // Count by current status
        const onTimeApprovals = approvals.filter(a =>
            a.status === 'approved' &&
            a.completedAt &&
            a.deadline &&
            a.completedAt <= a.deadline
        ).length;

        const currentlyPending = approvals.filter(a => a.status === 'pending');
        const approachingApprovals = currentlyPending.filter(a => {
            if (!a.deadline) return false;
            const hoursRemaining = (a.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60);
            return hoursRemaining > 0 && hoursRemaining <= 4;
        }).length;

        const breachedApprovals = approvals.filter(a => {
            if (!a.deadline) return false;
            if (a.status === 'approved' || a.status === 'rejected') {
                return a.completedAt && a.completedAt > a.deadline;
            }
            return new Date() > a.deadline;
        }).length;

        const complianceRate = totalApprovals > 0
            ? (onTimeApprovals / totalApprovals) * 100
            : 0;

        // Calculate average approval time
        const completedApprovals = approvals.filter(a =>
            a.completedAt && a.createdAt
        );

        const avgApprovalTime = completedApprovals.length > 0
            ? completedApprovals.reduce((sum, a) => {
                const duration = (a.completedAt!.getTime() - a.createdAt.getTime()) / (1000 * 60 * 60);
                return sum + duration;
            }, 0) / completedApprovals.length
            : 0;

        // Calculate average response time per task
        const completedTasks = await this.userTaskRepository.find({
            where: {
                status: TaskStatus.COMPLETED,
                createdAt: Between(startDate, endDate),
            },
        });

        const avgResponseTime = completedTasks.length > 0
            ? completedTasks.reduce((sum, task) => {
                if (!task.completedAt) return sum;
                const duration = (task.completedAt.getTime() - task.createdAt.getTime()) / (1000 * 60 * 60);
                return sum + duration;
            }, 0) / completedTasks.length
            : 0;

        return {
            totalApprovals,
            onTimeApprovals,
            approachingApprovals,
            breachedApprovals,
            complianceRate: Math.round(complianceRate * 10) / 10,
            avgApprovalTime: Math.round(avgApprovalTime * 10) / 10,
            avgResponseTime: Math.round(avgResponseTime * 10) / 10,
        };
    }

    /**
     * Get performance by workflow
     */
    async getWorkflowPerformance(startDate: Date, endDate: Date): Promise<WorkflowPerformance[]> {
        const approvals = await this.approvalRepository.find({
            where: {
                createdAt: Between(startDate, endDate),
            },
            relations: ['chain'],
        });

        // Group by chain
        const chainMap = new Map<string, ApprovalRequest[]>();
        approvals.forEach(approval => {
            const chainId = approval.chain.id;
            if (!chainMap.has(chainId)) {
                chainMap.set(chainId, []);
            }
            chainMap.get(chainId)!.push(approval);
        });

        const performance: WorkflowPerformance[] = [];

        for (const [chainId, chainApprovals] of chainMap) {
            const chain = chainApprovals[0].chain;
            const totalCount = chainApprovals.length;

            const onTime = chainApprovals.filter(a =>
                a.completedAt && a.deadline && a.completedAt <= a.deadline
            ).length;

            const currentlyPending = chainApprovals.filter(a => a.status === 'pending');
            const approaching = currentlyPending.filter(a => {
                if (!a.deadline) return false;
                const hoursRemaining = (a.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60);
                return hoursRemaining > 0 && hoursRemaining <= 4;
            }).length;

            const breached = chainApprovals.filter(a => {
                if (!a.deadline) return false;
                if (a.status === 'approved' || a.status === 'rejected') {
                    return a.completedAt && a.completedAt > a.deadline;
                }
                return new Date() > a.deadline;
            }).length;

            const completedApprovals = chainApprovals.filter(a => a.completedAt);
            const avgTime = completedApprovals.length > 0
                ? completedApprovals.reduce((sum, a) => {
                    const duration = (a.completedAt!.getTime() - a.createdAt.getTime()) / (1000 * 60 * 60);
                    return sum + duration;
                }, 0) / completedApprovals.length
                : 0;

            const complianceRate = totalCount > 0
                ? (onTime / totalCount) * 100
                : 0;

            performance.push({
                workflowId: chainId,
                workflowName: chain.name,
                totalCount,
                onTime,
                approaching,
                breached,
                avgTime: Math.round(avgTime * 10) / 10,
                complianceRate: Math.round(complianceRate * 10) / 10,
            });
        }

        return performance.sort((a, b) => b.totalCount - a.totalCount);
    }

    /**
     * Get trend data over time
     */
    async getTrendData(startDate: Date, endDate: Date, granularity: 'day' | 'week' | 'month'): Promise<TrendData[]> {
        const approvals = await this.approvalRepository.find({
            where: {
                createdAt: Between(startDate, endDate),
            },
        });

        // Group by time period
        const trendMap = new Map<string, ApprovalRequest[]>();

        approvals.forEach(approval => {
            const date = this.formatDateByGranularity(approval.createdAt, granularity);
            if (!trendMap.has(date)) {
                trendMap.set(date, []);
            }
            trendMap.get(date)!.push(approval);
        });

        const trendData: TrendData[] = [];

        for (const [date, periodApprovals] of trendMap) {
            const onTime = periodApprovals.filter(a =>
                a.completedAt && a.deadline && a.completedAt <= a.deadline
            ).length;

            const approaching = periodApprovals.filter(a => {
                if (a.status !== 'pending' || !a.deadline) return false;
                const hoursRemaining = (a.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60);
                return hoursRemaining > 0 && hoursRemaining <= 4;
            }).length;

            const breached = periodApprovals.filter(a => {
                if (!a.deadline) return false;
                if (a.status === 'approved' || a.status === 'rejected') {
                    return a.completedAt && a.completedAt > a.deadline;
                }
                return new Date() > a.deadline;
            }).length;

            const complianceRate = periodApprovals.length > 0
                ? (onTime / periodApprovals.length) * 100
                : 0;

            trendData.push({
                date,
                onTime,
                approaching,
                breached,
                complianceRate: Math.round(complianceRate * 10) / 10,
            });
        }

        return trendData.sort((a, b) => a.date.localeCompare(b.date));
    }

    /**
     * Get approver performance
     */
    async getApproverPerformance(startDate: Date, endDate: Date): Promise<ApproverPerformance[]> {
        const tasks = await this.userTaskRepository.find({
            where: {
                createdAt: Between(startDate, endDate),
                taskType: TaskType.APPROVAL,
            },
        });

        // Group by user
        const userMap = new Map<string, UserTask[]>();
        tasks.forEach(task => {
            if (!userMap.has(task.userId)) {
                userMap.set(task.userId, []);
            }
            userMap.get(task.userId)!.push(task);
        });

        const performance: ApproverPerformance[] = [];

        for (const [userId, userTasks] of userMap) {
            const totalTasks = userTasks.length;

            const completedOnTime = userTasks.filter(task =>
                task.completedAt && task.dueDate && task.completedAt <= task.dueDate
            ).length;

            const completedTasks = userTasks.filter(t => t.completedAt);
            const avgResponseTime = completedTasks.length > 0
                ? completedTasks.reduce((sum, task) => {
                    const duration = (task.completedAt!.getTime() - task.createdAt.getTime()) / (1000 * 60 * 60);
                    return sum + duration;
                }, 0) / completedTasks.length
                : 0;

            const complianceRate = totalTasks > 0
                ? (completedOnTime / totalTasks) * 100
                : 0;

            performance.push({
                approverId: userId,
                approverName: `User ${userId}`, // TODO: Fetch from user service
                role: 'Role', // TODO: Fetch from user service
                totalTasks,
                completedOnTime,
                avgResponseTime: Math.round(avgResponseTime * 10) / 10,
                complianceRate: Math.round(complianceRate * 10) / 10,
            });
        }

        return performance.sort((a, b) => b.totalTasks - a.totalTasks);
    }

    /**
     * Get delay analysis
     */
    async getDelayAnalysis(startDate: Date, endDate: Date): Promise<DelayAnalysis[]> {
        const approvals = await this.approvalRepository.find({
            where: {
                createdAt: Between(startDate, endDate),
            },
            relations: ['chain'],
        });

        // Filter only delayed approvals
        const delayedApprovals = approvals.filter(a =>
            a.completedAt && a.deadline && a.completedAt > a.deadline
        );

        // Group by workflow
        const chainMap = new Map<string, ApprovalRequest[]>();
        delayedApprovals.forEach(approval => {
            const chainId = approval.chain.id;
            if (!chainMap.has(chainId)) {
                chainMap.set(chainId, []);
            }
            chainMap.get(chainId)!.push(approval);
        });

        const analysis: DelayAnalysis[] = [];

        for (const [chainId, delayed] of chainMap) {
            const chain = delayed[0].chain;

            const delays = delayed.map(a => {
                const delayHours = (a.completedAt!.getTime() - a.deadline!.getTime()) / (1000 * 60 * 60);
                return delayHours;
            });

            const avgDelay = delays.reduce((sum, d) => sum + d, 0) / delays.length;
            const maxDelay = Math.max(...delays);

            analysis.push({
                workflowName: chain.name,
                phase: this.getPhaseFromWorkflow(chain.name),
                avgDelay: Math.round(avgDelay * 10) / 10,
                maxDelay: Math.round(maxDelay * 10) / 10,
                delayCount: delayed.length,
                commonReasons: ['Approver unavailable', 'Pending information', 'High workload'],
            });
        }

        return analysis.sort((a, b) => b.delayCount - a.delayCount);
    }

    /**
     * Helper: Format date by granularity
     */
    private formatDateByGranularity(date: Date, granularity: 'day' | 'week' | 'month'): string {
        const d = new Date(date);

        if (granularity === 'day') {
            return d.toISOString().split('T')[0];
        } else if (granularity === 'week') {
            const weekNum = this.getWeekNumber(d);
            return `Week ${weekNum}`;
        } else {
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        }
    }

    /**
     * Helper: Get week number
     */
    private getWeekNumber(date: Date): number {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    }

    /**
     * Helper: Get phase from workflow name
     */
    private getPhaseFromWorkflow(workflowName: string): string {
        if (workflowName.includes('Quote') || workflowName.includes('Sales')) return 'Sales';
        if (workflowName.includes('Design')) return 'Design';
        if (workflowName.includes('BOM')) return 'BOM';
        if (workflowName.includes('Purchase') || workflowName.includes('Vendor')) return 'Procurement';
        if (workflowName.includes('Production') || workflowName.includes('Work Order')) return 'Production';
        if (workflowName.includes('Quality') || workflowName.includes('NCR')) return 'Quality';
        if (workflowName.includes('Shipment') || workflowName.includes('Invoice')) return 'Logistics';
        if (workflowName.includes('Installation')) return 'Installation';
        return 'Cross-Phase';
    }
}
