import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type SLAType = 'response' | 'resolution' | 'update' | 'escalation';
export type SLAStatus = 'within_sla' | 'warning' | 'breached';
export type BusinessHoursType = '24x7' | 'business_hours' | 'custom';

export interface SLAPolicy {
  id: string;
  name: string;
  description: string;
  priority: number;
  isDefault: boolean;
  conditions: SLACondition[];
  targets: SLATarget[];
  escalationRules: EscalationRule[];
  businessHours: BusinessHoursConfig;
  isActive: boolean;
  createdAt: string;
}

export interface SLACondition {
  field: 'priority' | 'category' | 'channel' | 'customer_tier' | 'custom';
  operator: 'equals' | 'not_equals' | 'in' | 'not_in';
  value: string | string[];
}

export interface SLATarget {
  type: SLAType;
  targetMinutes: number;
  warningMinutes: number;
  businessHoursOnly: boolean;
}

export interface EscalationRule {
  id: string;
  level: number;
  afterMinutes: number;
  notifyUsers: string[];
  notifyTeams: string[];
  actions: ('email' | 'sms' | 'in_app' | 'reassign')[];
}

export interface BusinessHoursConfig {
  type: BusinessHoursType;
  timezone: string;
  schedule?: {
    day: number;
    start: string;
    end: string;
  }[];
  holidays?: string[];
}

export interface SLATracker {
  id: string;
  ticketId: string;
  ticketNumber: string;
  policyId: string;
  policyName: string;
  targets: SLATargetTracker[];
  overallStatus: SLAStatus;
  nextDueDate?: string;
  nextDueType?: SLAType;
  escalationLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface SLATargetTracker {
  type: SLAType;
  targetMinutes: number;
  elapsedMinutes: number;
  remainingMinutes: number;
  dueDate: string;
  status: SLAStatus;
  completedAt?: string;
  pausedAt?: string;
  pausedDuration?: number;
}

export interface SLAReport {
  totalTickets: number;
  breachedCount: number;
  withinSLACount: number;
  warningCount: number;
  complianceRate: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  byPriority: Record<string, { total: number; breached: number; compliance: number }>;
  byCategory: Record<string, { total: number; breached: number; compliance: number }>;
  trends: { date: string; compliance: number; breached: number }[];
}

@Injectable()
export class SLATrackingService {
  private policies: SLAPolicy[] = [];
  private trackers: SLATracker[] = [];

  constructor() {
    this.seedMockData();
  }

  async createPolicy(policy: Omit<SLAPolicy, 'id' | 'createdAt'>): Promise<SLAPolicy> {
    const newPolicy: SLAPolicy = {
      ...policy,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    this.policies.push(newPolicy);
    return newPolicy;
  }

  async assignSLA(
    ticketId: string,
    ticketNumber: string,
    priority: string,
    category: string,
    customerTier?: string
  ): Promise<SLATracker> {
    // Find matching policy
    const policy = await this.findMatchingPolicy(priority, category, customerTier);
    if (!policy) {
      throw new Error('No matching SLA policy found');
    }

    const now = new Date();
    const targets: SLATargetTracker[] = policy.targets.map(target => {
      const dueDate = this.calculateDueDate(now, target.targetMinutes, policy.businessHours);
      return {
        type: target.type,
        targetMinutes: target.targetMinutes,
        elapsedMinutes: 0,
        remainingMinutes: target.targetMinutes,
        dueDate: dueDate.toISOString(),
        status: 'within_sla',
      };
    });

    const tracker: SLATracker = {
      id: uuidv4(),
      ticketId,
      ticketNumber,
      policyId: policy.id,
      policyName: policy.name,
      targets,
      overallStatus: 'within_sla',
      nextDueDate: targets[0]?.dueDate,
      nextDueType: targets[0]?.type,
      escalationLevel: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.trackers.push(tracker);
    return tracker;
  }

  private async findMatchingPolicy(
    priority: string,
    category: string,
    customerTier?: string
  ): Promise<SLAPolicy | null> {
    const activePolicies = this.policies
      .filter(p => p.isActive)
      .sort((a, b) => b.priority - a.priority);

    for (const policy of activePolicies) {
      if (policy.conditions.length === 0 && policy.isDefault) {
        return policy;
      }

      const matches = policy.conditions.every(cond => {
        let value: string | undefined;
        switch (cond.field) {
          case 'priority': value = priority; break;
          case 'category': value = category; break;
          case 'customer_tier': value = customerTier; break;
        }

        if (!value) return false;

        switch (cond.operator) {
          case 'equals': return value === cond.value;
          case 'not_equals': return value !== cond.value;
          case 'in': return (cond.value as string[]).includes(value);
          case 'not_in': return !(cond.value as string[]).includes(value);
        }
        return false;
      });

      if (matches) return policy;
    }

    return activePolicies.find(p => p.isDefault) || null;
  }

  private calculateDueDate(start: Date, minutes: number, config: BusinessHoursConfig): Date {
    if (config.type === '24x7') {
      return new Date(start.getTime() + minutes * 60 * 1000);
    }

    // Business hours calculation (simplified)
    const due = new Date(start.getTime() + minutes * 60 * 1000);
    return due;
  }

  async updateSLAProgress(ticketId: string, eventType: SLAType): Promise<SLATracker | null> {
    const tracker = this.trackers.find(t => t.ticketId === ticketId);
    if (!tracker) return null;

    const target = tracker.targets.find(t => t.type === eventType);
    if (target && !target.completedAt) {
      target.completedAt = new Date().toISOString();
      const elapsed = (new Date().getTime() - new Date(tracker.createdAt).getTime()) / 60000;
      target.elapsedMinutes = Math.round(elapsed);
      target.remainingMinutes = 0;
      target.status = elapsed <= target.targetMinutes ? 'within_sla' : 'breached';
    }

    this.updateOverallStatus(tracker);
    tracker.updatedAt = new Date().toISOString();

    return tracker;
  }

  async pauseSLA(ticketId: string, reason: string): Promise<SLATracker | null> {
    const tracker = this.trackers.find(t => t.ticketId === ticketId);
    if (!tracker) return null;

    const now = new Date().toISOString();
    for (const target of tracker.targets) {
      if (!target.completedAt) {
        target.pausedAt = now;
      }
    }

    tracker.updatedAt = now;
    return tracker;
  }

  async resumeSLA(ticketId: string): Promise<SLATracker | null> {
    const tracker = this.trackers.find(t => t.ticketId === ticketId);
    if (!tracker) return null;

    const now = new Date();
    for (const target of tracker.targets) {
      if (target.pausedAt && !target.completedAt) {
        const pauseDuration = now.getTime() - new Date(target.pausedAt).getTime();
        target.pausedDuration = (target.pausedDuration || 0) + pauseDuration / 60000;
        target.pausedAt = undefined;
        // Extend due date
        const due = new Date(target.dueDate);
        due.setTime(due.getTime() + pauseDuration);
        target.dueDate = due.toISOString();
      }
    }

    tracker.updatedAt = now.toISOString();
    return tracker;
  }

  async checkSLABreaches(): Promise<SLATracker[]> {
    const breached: SLATracker[] = [];
    const now = new Date();

    for (const tracker of this.trackers) {
      let hasBreached = false;

      for (const target of tracker.targets) {
        if (target.completedAt || target.pausedAt) continue;

        const dueDate = new Date(target.dueDate);
        const elapsed = (now.getTime() - new Date(tracker.createdAt).getTime()) / 60000;
        target.elapsedMinutes = Math.round(elapsed);
        target.remainingMinutes = Math.max(0, target.targetMinutes - elapsed);

        if (now > dueDate) {
          target.status = 'breached';
          hasBreached = true;
        } else if (target.remainingMinutes <= target.targetMinutes * 0.2) {
          target.status = 'warning';
        }
      }

      if (hasBreached) {
        tracker.overallStatus = 'breached';
        breached.push(tracker);
      }

      this.updateOverallStatus(tracker);
    }

    return breached;
  }

  private updateOverallStatus(tracker: SLATracker): void {
    const statuses = tracker.targets.map(t => t.status);

    if (statuses.includes('breached')) {
      tracker.overallStatus = 'breached';
    } else if (statuses.includes('warning')) {
      tracker.overallStatus = 'warning';
    } else {
      tracker.overallStatus = 'within_sla';
    }

    // Update next due
    const pending = tracker.targets
      .filter(t => !t.completedAt)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    if (pending.length > 0) {
      tracker.nextDueDate = pending[0].dueDate;
      tracker.nextDueType = pending[0].type;
    } else {
      tracker.nextDueDate = undefined;
      tracker.nextDueType = undefined;
    }
  }

  async triggerEscalation(trackerId: string): Promise<void> {
    const tracker = this.trackers.find(t => t.id === trackerId);
    if (!tracker) return;

    const policy = this.policies.find(p => p.id === tracker.policyId);
    if (!policy) return;

    const nextLevel = tracker.escalationLevel + 1;
    const rule = policy.escalationRules.find(r => r.level === nextLevel);

    if (rule) {
      tracker.escalationLevel = nextLevel;
      // Would trigger notifications here
    }
  }

  async getSLAStatus(ticketId: string): Promise<SLATracker | undefined> {
    return this.trackers.find(t => t.ticketId === ticketId);
  }

  async getBreachedTickets(): Promise<SLATracker[]> {
    return this.trackers.filter(t => t.overallStatus === 'breached');
  }

  async getWarningTickets(): Promise<SLATracker[]> {
    return this.trackers.filter(t => t.overallStatus === 'warning');
  }

  async getSLAReport(dateFrom?: string, dateTo?: string): Promise<SLAReport> {
    let filtered = this.trackers;

    if (dateFrom) {
      filtered = filtered.filter(t => t.createdAt >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(t => t.createdAt <= dateTo);
    }

    const breached = filtered.filter(t => t.overallStatus === 'breached');
    const warning = filtered.filter(t => t.overallStatus === 'warning');
    const withinSLA = filtered.filter(t => t.overallStatus === 'within_sla');

    let totalResponseTime = 0;
    let totalResolutionTime = 0;
    let responseCount = 0;
    let resolutionCount = 0;

    for (const tracker of filtered) {
      const responseTarget = tracker.targets.find(t => t.type === 'response');
      const resolutionTarget = tracker.targets.find(t => t.type === 'resolution');

      if (responseTarget?.completedAt) {
        totalResponseTime += responseTarget.elapsedMinutes;
        responseCount++;
      }
      if (resolutionTarget?.completedAt) {
        totalResolutionTime += resolutionTarget.elapsedMinutes;
        resolutionCount++;
      }
    }

    return {
      totalTickets: filtered.length,
      breachedCount: breached.length,
      withinSLACount: withinSLA.length,
      warningCount: warning.length,
      complianceRate: filtered.length > 0
        ? Math.round((withinSLA.length / filtered.length) * 100)
        : 0,
      avgResponseTime: responseCount > 0 ? Math.round(totalResponseTime / responseCount) : 0,
      avgResolutionTime: resolutionCount > 0 ? Math.round(totalResolutionTime / resolutionCount) : 0,
      byPriority: {},
      byCategory: {},
      trends: [],
    };
  }

  private seedMockData(): void {
    // Default SLA policies
    this.policies = [
      {
        id: uuidv4(),
        name: 'Critical Priority SLA',
        description: 'For critical priority tickets',
        priority: 100,
        isDefault: false,
        conditions: [
          { field: 'priority', operator: 'equals', value: 'critical' },
        ],
        targets: [
          { type: 'response', targetMinutes: 15, warningMinutes: 10, businessHoursOnly: false },
          { type: 'resolution', targetMinutes: 240, warningMinutes: 180, businessHoursOnly: false },
        ],
        escalationRules: [
          {
            id: uuidv4(),
            level: 1,
            afterMinutes: 10,
            notifyUsers: ['manager-1'],
            notifyTeams: [],
            actions: ['email', 'sms'],
          },
          {
            id: uuidv4(),
            level: 2,
            afterMinutes: 30,
            notifyUsers: ['director-1'],
            notifyTeams: [],
            actions: ['email', 'sms', 'in_app'],
          },
        ],
        businessHours: {
          type: '24x7',
          timezone: 'UTC',
        },
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Standard SLA',
        description: 'Default SLA for all tickets',
        priority: 1,
        isDefault: true,
        conditions: [],
        targets: [
          { type: 'response', targetMinutes: 60, warningMinutes: 45, businessHoursOnly: true },
          { type: 'resolution', targetMinutes: 480, warningMinutes: 360, businessHoursOnly: true },
        ],
        escalationRules: [
          {
            id: uuidv4(),
            level: 1,
            afterMinutes: 60,
            notifyUsers: ['supervisor-1'],
            notifyTeams: [],
            actions: ['email'],
          },
        ],
        businessHours: {
          type: 'business_hours',
          timezone: 'UTC',
          schedule: [
            { day: 1, start: '09:00', end: '18:00' },
            { day: 2, start: '09:00', end: '18:00' },
            { day: 3, start: '09:00', end: '18:00' },
            { day: 4, start: '09:00', end: '18:00' },
            { day: 5, start: '09:00', end: '18:00' },
          ],
        },
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];
  }
}
