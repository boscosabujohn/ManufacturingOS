import { Injectable, Logger } from '@nestjs/common';

export interface SLADefinition {
    id: string;
    workflowType: string;
    stepNumber: number;
    targetHours: number;
    warningThresholdPercent: number; // e.g., 80 = start warning at 80% of SLA
    escalationRules?: EscalationRule[];
}

export interface EscalationRule {
    triggerPercent: number; // e.g., 100 = escalate when SLA is breached
    action: 'notify' | 'escalate' | 'auto-approve';
    notifyRoles?: string[];
    escalateToRole?: string;
}

export interface SLATracking {
    approvalId: string;
    stepNumber: number;
    slaHours: number;
    startTime: Date;
    dueTime: Date;
    remainingHours: number;
    status: 'on-track' | 'warning' | 'breached';
    breachedAt?: Date;
}

@Injectable()
export class SLAService {
    private readonly logger = new Logger(SLAService.name);
    private slaDefinitions: Map<string, SLADefinition> = new Map();
    private slaTracking: Map<string, SLATracking> = new Map();

    constructor() {
        this.initializeDefaultSLAs();
    }

    private initializeDefaultSLAs() {
        // PR Approval SLAs
        this.defineSLA({
            id: 'pr-dept-head',
            workflowType: 'purchase-requisition',
            stepNumber: 1,
            targetHours: 24,
            warningThresholdPercent: 80,
            escalationRules: [
                {
                    triggerPercent: 100,
                    action: 'escalate',
                    escalateToRole: 'PROCUREMENT_HEAD',
                },
            ],
        });

        // Leave Approval SLAs
        this.defineSLA({
            id: 'leave-manager',
            workflowType: 'leave-request',
            stepNumber: 1,
            targetHours: 24,
            warningThresholdPercent: 75,
        });

        // Project Approval SLAs
        this.defineSLA({
            id: 'project-initial',
            workflowType: 'project-approval',
            stepNumber: 1,
            targetHours: 48,
            warningThresholdPercent: 80,
            escalationRules: [
                {
                    triggerPercent: 100,
                    action: 'notify',
                    notifyRoles: ['PROJECT_MANAGER', 'PMO_HEAD'],
                },
            ],
        });
    }

    defineSLA(sla: SLADefinition): void {
        this.slaDefinitions.set(sla.id, sla);
    }

    startSLATracking(
        approvalId: string,
        stepNumber: number,
        slaHours: number
    ): SLATracking {
        const startTime = new Date();
        const dueTime = new Date(startTime.getTime() + slaHours * 60 * 60 * 1000);

        const tracking: SLATracking = {
            approvalId,
            stepNumber,
            slaHours,
            startTime,
            dueTime,
            remainingHours: slaHours,
            status: 'on-track',
        };

        const key = `${approvalId}-${stepNumber}`;
        this.slaTracking.set(key, tracking);

        this.logger.log(`SLA tracking started for ${key}, due: ${dueTime.toISOString()}`);
        return tracking;
    }

    getSLAStatus(approvalId: string, stepNumber: number): SLATracking | null {
        const key = `${approvalId}-${stepNumber}`;
        const tracking = this.slaTracking.get(key);

        if (!tracking) return null;

        // Update status
        const now = new Date();
        const elapsed = now.getTime() - tracking.startTime.getTime();
        const total = tracking.dueTime.getTime() - tracking.startTime.getTime();
        const percentElapsed = (elapsed / total) * 100;

        tracking.remainingHours = Math.max(0, (total - elapsed) / (60 * 60 * 1000));

        if (percentElapsed >= 100) {
            tracking.status = 'breached';
            if (!tracking.breachedAt) {
                tracking.breachedAt = now;
                this.logger.warn(`SLA breached for ${key}`);
            }
        } else if (percentElapsed >= 80) {
            tracking.status = 'warning';
        } else {
            tracking.status = 'on-track';
        }

        return tracking;
    }

    stopSLATracking(approvalId: string, stepNumber: number): void {
        const key = `${approvalId}-${stepNumber}`;
        this.slaTracking.delete(key);
        this.logger.log(`SLA tracking stopped for ${key}`);
    }

    getAllActiveSLAs(): SLATracking[] {
        const active: SLATracking[] = [];

        for (const [key, tracking] of this.slaTracking.entries()) {
            const updated = this.getSLAStatus(tracking.approvalId, tracking.stepNumber);
            if (updated) {
                active.push(updated);
            }
        }

        return active;
    }

    getBreachedSLAs(): SLATracking[] {
        return this.getAllActiveSLAs().filter(sla => sla.status === 'breached');
    }

    getWarningSLAs(): SLATracking[] {
        return this.getAllActiveSLAs().filter(sla => sla.status === 'warning');
    }

    checkEscalation(approvalId: string, stepNumber: number): EscalationRule[] {
        const tracking = this.getSLAStatus(approvalId, stepNumber);
        if (!tracking) return [];

        const key = `${approvalId}-${stepNumber}`;
        const sla = Array.from(this.slaDefinitions.values()).find(
            s => s.stepNumber === stepNumber
        );

        if (!sla || !sla.escalationRules) return [];

        const elapsed = new Date().getTime() - tracking.startTime.getTime();
        const total = tracking.dueTime.getTime() - tracking.startTime.getTime();
        const percentElapsed = (elapsed / total) * 100;

        return sla.escalationRules.filter(rule => percentElapsed >= rule.triggerPercent);
    }
}
