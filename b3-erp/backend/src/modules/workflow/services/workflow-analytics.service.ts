import { Injectable, Logger } from '@nestjs/common';

export interface WorkflowMetrics {
    totalWorkflows: number;
    completedWorkflows: number;
    pendingWorkflows: number;
    rejectedWorkflows: number;
    averageCompletionTime: number; // in hours
    slaComplianceRate: number; // percentage
    bottlenecks: BottleneckInfo[];
    approverPerformance: ApproverMetrics[];
}

export interface BottleneckInfo {
    stepName: string;
    approverRole: string;
    averageWaitTime: number;
    backlogCount: number;
}

export interface ApproverMetrics {
    approverId: string;
    approverName: string;
    totalApprovals: number;
    averageResponseTime: number; // in hours
    approvalRate: number; // percentage approved vs rejected
    slaComplianceRate: number;
}

export interface WorkflowPerformance {
    workflowId: string;
    workflowType: string;
    startTime: Date;
    endTime?: Date;
    totalDuration?: number; // in hours
    steps: StepPerformance[];
    slaStatus: 'met' | 'breached';
}

export interface StepPerformance {
    stepNumber: number;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    approverId: string;
    decision?: 'approved' | 'rejected';
    slaTarget: number;
    slaStatus: 'met' | 'breached';
}

@Injectable()
export class WorkflowAnalyticsService {
    private readonly logger = new Logger(WorkflowAnalyticsService.name);
    private workflowPerformance: Map<string, WorkflowPerformance> = new Map();

    trackWorkflowStart(
        workflowId: string,
        workflowType: string,
        steps: Array<{ stepNumber: number; approverId: string; slaTarget: number }>
    ): void {
        const performance: WorkflowPerformance = {
            workflowId,
            workflowType,
            startTime: new Date(),
            steps: steps.map(s => ({
                stepNumber: s.stepNumber,
                startTime: new Date(),
                approverId: s.approverId,
                slaTarget: s.slaTarget,
                slaStatus: 'met',
            })),
            slaStatus: 'met',
        };

        this.workflowPerformance.set(workflowId, performance);
        this.logger.log(`Tracking started for workflow ${workflowId}`);
    }

    trackStepCompletion(
        workflowId: string,
        stepNumber: number,
        decision: 'approved' | 'rejected'
    ): void {
        const performance = this.workflowPerformance.get(workflowId);
        if (!performance) return;

        const step = performance.steps.find(s => s.stepNumber === stepNumber);
        if (!step) return;

        step.endTime = new Date();
        step.duration = (step.endTime.getTime() - step.startTime.getTime()) / (60 * 60 * 1000);
        step.decision = decision;

        // Check SLA
        if (step.duration > step.slaTarget) {
            step.slaStatus = 'breached';
            performance.slaStatus = 'breached';
        }

        this.logger.log(`Step ${stepNumber} completed for workflow ${workflowId}`);
    }

    trackWorkflowCompletion(workflowId: string): void {
        const performance = this.workflowPerformance.get(workflowId);
        if (!performance) return;

        performance.endTime = new Date();
        performance.totalDuration = (performance.endTime.getTime() - performance.startTime.getTime()) / (60 * 60 * 1000);

        this.logger.log(`Workflow ${workflowId} completed in ${performance.totalDuration} hours`);
    }

    getWorkflowMetrics(
        workflowType?: string,
        startDate?: Date,
        endDate?: Date
    ): WorkflowMetrics {
        const workflows = Array.from(this.workflowPerformance.values()).filter(wf => {
            if (workflowType && wf.workflowType !== workflowType) return false;
            if (startDate && wf.startTime < startDate) return false;
            if (endDate && wf.startTime > endDate) return false;
            return true;
        });

        const completed = workflows.filter(wf => wf.endTime);
        const pending = workflows.filter(wf => !wf.endTime);
        const rejected = workflows.filter(wf =>
            wf.steps.some(s => s.decision === 'rejected')
        );

        const avgCompletionTime = completed.length > 0
            ? completed.reduce((sum, wf) => sum + (wf.totalDuration || 0), 0) / completed.length
            : 0;

        const slaCompliant = workflows.filter(wf => wf.slaStatus === 'met').length;
        const slaComplianceRate = workflows.length > 0
            ? (slaCompliant / workflows.length) * 100
            : 0;

        return {
            totalWorkflows: workflows.length,
            completedWorkflows: completed.length,
            pendingWorkflows: pending.length,
            rejectedWorkflows: rejected.length,
            averageCompletionTime: avgCompletionTime,
            slaComplianceRate,
            bottlenecks: this.identifyBottlenecks(workflows),
            approverPerformance: this.calculateApproverMetrics(workflows),
        };
    }

    private identifyBottlenecks(workflows: WorkflowPerformance[]): BottleneckInfo[] {
        const stepStats = new Map<string, { totalTime: number; count: number; backlog: number }>();

        workflows.forEach(wf => {
            wf.steps.forEach(step => {
                const key = `${step.stepNumber}-${step.approverId}`;
                const current = stepStats.get(key) || { totalTime: 0, count: 0, backlog: 0 };

                if (step.duration) {
                    current.totalTime += step.duration;
                    current.count++;
                }

                if (!step.endTime) {
                    current.backlog++;
                }

                stepStats.set(key, current);
            });
        });

        const bottlenecks: BottleneckInfo[] = [];
        stepStats.forEach((stats, key) => {
            const avgTime = stats.count > 0 ? stats.totalTime / stats.count : 0;

            // Consider it a bottleneck if avg time > 24 hours or backlog > 5
            if (avgTime > 24 || stats.backlog > 5) {
                bottlenecks.push({
                    stepName: `Step ${key.split('-')[0]}`,
                    approverRole: key.split('-')[1],
                    averageWaitTime: avgTime,
                    backlogCount: stats.backlog,
                });
            }
        });

        return bottlenecks.sort((a, b) => b.backlogCount - a.backlogCount);
    }

    private calculateApproverMetrics(workflows: WorkflowPerformance[]): ApproverMetrics[] {
        const approverStats = new Map<string, {
            total: number;
            totalTime: number;
            approved: number;
            rejected: number;
            slasMet: number;
        }>();

        workflows.forEach(wf => {
            wf.steps.forEach(step => {
                if (!step.decision) return;

                const current = approverStats.get(step.approverId) || {
                    total: 0,
                    totalTime: 0,
                    approved: 0,
                    rejected: 0,
                    slasMet: 0,
                };

                current.total++;
                if (step.duration) current.totalTime += step.duration;
                if (step.decision === 'approved') current.approved++;
                if (step.decision === 'rejected') current.rejected++;
                if (step.slaStatus === 'met') current.slasMet++;

                approverStats.set(step.approverId, current);
            });
        });

        const metrics: ApproverMetrics[] = [];
        approverStats.forEach((stats, approverId) => {
            metrics.push({
                approverId,
                approverName: `User ${approverId}`, // In production, fetch from user service
                totalApprovals: stats.total,
                averageResponseTime: stats.total > 0 ? stats.totalTime / stats.total : 0,
                approvalRate: stats.total > 0 ? (stats.approved / stats.total) * 100 : 0,
                slaComplianceRate: stats.total > 0 ? (stats.slasMet / stats.total) * 100 : 0,
            });
        });

        return metrics.sort((a, b) => b.totalApprovals - a.totalApprovals);
    }

    getWorkflowPerformance(workflowId: string): WorkflowPerformance | null {
        return this.workflowPerformance.get(workflowId) || null;
    }

    clearOldData(daysToKeep: number = 90): void {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        let deleted = 0;
        this.workflowPerformance.forEach((perf, id) => {
            if (perf.startTime < cutoffDate) {
                this.workflowPerformance.delete(id);
                deleted++;
            }
        });

        this.logger.log(`Cleared ${deleted} old workflow records`);
    }
}
