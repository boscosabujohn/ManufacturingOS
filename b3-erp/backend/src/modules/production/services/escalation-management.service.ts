import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type EscalationLevel = 1 | 2 | 3 | 4 | 5;
export type EscalationType = 'delay' | 'quality' | 'safety' | 'resource' | 'material' | 'equipment' | 'process';
export type EscalationStatus = 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed';
export type EscalationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Escalation {
  id: string;
  escalationNumber: string;
  type: EscalationType;
  priority: EscalationPriority;
  level: EscalationLevel;
  status: EscalationStatus;

  // Source
  sourceType: 'work_order' | 'production_line' | 'quality_check' | 'maintenance' | 'manual';
  sourceId?: string;
  sourceReference?: string;

  // Details
  title: string;
  description: string;
  impact: string;
  rootCause?: string;
  resolution?: string;

  // Assignment
  assignedToId: string;
  assignedToName: string;
  assignedToRole: string;
  escalatedById: string;
  escalatedByName: string;

  // Escalation chain
  escalationHistory: EscalationHistoryItem[];

  // SLA
  slaHours: number;
  dueAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  closedAt?: string;

  // Notifications
  notificationsSent: Array<{
    level: EscalationLevel;
    recipients: string[];
    sentAt: string;
    method: 'email' | 'sms' | 'push';
  }>;

  // Attachments
  attachments?: string[];

  // Audit
  createdAt: string;
  updatedAt: string;
}

export interface EscalationHistoryItem {
  id: string;
  action: 'created' | 'escalated' | 'acknowledged' | 'assigned' | 'updated' | 'resolved' | 'closed';
  fromLevel?: EscalationLevel;
  toLevel?: EscalationLevel;
  performedById: string;
  performedByName: string;
  notes?: string;
  timestamp: string;
}

export interface EscalationMatrix {
  type: EscalationType;
  levels: Array<{
    level: EscalationLevel;
    role: string;
    userId: string;
    userName: string;
    slaHours: number;
    autoEscalateAfterHours: number;
  }>;
}

export interface EscalationRule {
  id: string;
  name: string;
  isActive: boolean;
  triggerCondition: {
    type: EscalationType;
    metric: string;
    operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
    threshold: number;
    unit: string;
  };
  initialLevel: EscalationLevel;
  priority: EscalationPriority;
  notifyImmediately: boolean;
}

@Injectable()
export class EscalationManagementService {
  private escalations: Escalation[] = [];
  private escalationMatrices: EscalationMatrix[] = [];
  private escalationRules: EscalationRule[] = [];

  constructor() {
    this.initializeMatrices();
    this.initializeRules();
    this.seedMockData();
  }

  async createEscalation(data: Partial<Escalation>): Promise<Escalation> {
    const escalationNumber = await this.generateEscalationNumber();
    const matrix = this.getMatrix(data.type || 'delay');
    const levelConfig = matrix?.levels.find(l => l.level === (data.level || 1));

    const escalation: Escalation = {
      id: uuidv4(),
      escalationNumber,
      type: data.type || 'delay',
      priority: data.priority || 'medium',
      level: data.level || 1,
      status: 'open',
      sourceType: data.sourceType || 'manual',
      sourceId: data.sourceId,
      sourceReference: data.sourceReference,
      title: data.title || '',
      description: data.description || '',
      impact: data.impact || '',
      assignedToId: levelConfig?.userId || data.assignedToId || '',
      assignedToName: levelConfig?.userName || data.assignedToName || '',
      assignedToRole: levelConfig?.role || data.assignedToRole || '',
      escalatedById: data.escalatedById || '',
      escalatedByName: data.escalatedByName || '',
      escalationHistory: [{
        id: uuidv4(),
        action: 'created',
        toLevel: data.level || 1,
        performedById: data.escalatedById || '',
        performedByName: data.escalatedByName || '',
        timestamp: new Date().toISOString(),
      }],
      slaHours: levelConfig?.slaHours || 4,
      dueAt: this.calculateDueDate(levelConfig?.slaHours || 4),
      notificationsSent: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.escalations.push(escalation);

    // Send initial notification
    await this.sendNotification(escalation);

    return escalation;
  }

  async getEscalation(id: string): Promise<Escalation> {
    const escalation = this.escalations.find(e => e.id === id);
    if (!escalation) {
      throw new NotFoundException(`Escalation ${id} not found`);
    }
    return escalation;
  }

  async acknowledgeEscalation(id: string, userId: string, userName: string): Promise<Escalation> {
    const escalation = await this.getEscalation(id);

    escalation.status = 'acknowledged';
    escalation.acknowledgedAt = new Date().toISOString();
    escalation.updatedAt = new Date().toISOString();

    escalation.escalationHistory.push({
      id: uuidv4(),
      action: 'acknowledged',
      performedById: userId,
      performedByName: userName,
      timestamp: new Date().toISOString(),
    });

    return escalation;
  }

  async escalateToNextLevel(
    id: string,
    userId: string,
    userName: string,
    reason: string
  ): Promise<Escalation> {
    const escalation = await this.getEscalation(id);
    const currentLevel = escalation.level;

    if (currentLevel >= 5) {
      throw new Error('Already at maximum escalation level');
    }

    const newLevel = (currentLevel + 1) as EscalationLevel;
    const matrix = this.getMatrix(escalation.type);
    const levelConfig = matrix?.levels.find(l => l.level === newLevel);

    escalation.level = newLevel;
    escalation.assignedToId = levelConfig?.userId || escalation.assignedToId;
    escalation.assignedToName = levelConfig?.userName || escalation.assignedToName;
    escalation.assignedToRole = levelConfig?.role || escalation.assignedToRole;
    escalation.slaHours = levelConfig?.slaHours || escalation.slaHours;
    escalation.dueAt = this.calculateDueDate(levelConfig?.slaHours || 4);
    escalation.status = 'open';
    escalation.updatedAt = new Date().toISOString();

    escalation.escalationHistory.push({
      id: uuidv4(),
      action: 'escalated',
      fromLevel: currentLevel,
      toLevel: newLevel,
      performedById: userId,
      performedByName: userName,
      notes: reason,
      timestamp: new Date().toISOString(),
    });

    // Send notification for new level
    await this.sendNotification(escalation);

    return escalation;
  }

  async resolveEscalation(
    id: string,
    userId: string,
    userName: string,
    resolution: string,
    rootCause?: string
  ): Promise<Escalation> {
    const escalation = await this.getEscalation(id);

    escalation.status = 'resolved';
    escalation.resolution = resolution;
    escalation.rootCause = rootCause;
    escalation.resolvedAt = new Date().toISOString();
    escalation.updatedAt = new Date().toISOString();

    escalation.escalationHistory.push({
      id: uuidv4(),
      action: 'resolved',
      performedById: userId,
      performedByName: userName,
      notes: resolution,
      timestamp: new Date().toISOString(),
    });

    return escalation;
  }

  async closeEscalation(id: string, userId: string, userName: string): Promise<Escalation> {
    const escalation = await this.getEscalation(id);

    escalation.status = 'closed';
    escalation.closedAt = new Date().toISOString();
    escalation.updatedAt = new Date().toISOString();

    escalation.escalationHistory.push({
      id: uuidv4(),
      action: 'closed',
      performedById: userId,
      performedByName: userName,
      timestamp: new Date().toISOString(),
    });

    return escalation;
  }

  async getActiveEscalations(filters?: {
    type?: EscalationType;
    priority?: EscalationPriority;
    assignedToId?: string;
    level?: EscalationLevel;
  }): Promise<Escalation[]> {
    let result = this.escalations.filter(e =>
      !['resolved', 'closed'].includes(e.status)
    );

    if (filters?.type) {
      result = result.filter(e => e.type === filters.type);
    }
    if (filters?.priority) {
      result = result.filter(e => e.priority === filters.priority);
    }
    if (filters?.assignedToId) {
      result = result.filter(e => e.assignedToId === filters.assignedToId);
    }
    if (filters?.level) {
      result = result.filter(e => e.level === filters.level);
    }

    return result.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  async getOverdueEscalations(): Promise<Escalation[]> {
    const now = new Date();
    return this.escalations.filter(e =>
      !['resolved', 'closed'].includes(e.status) &&
      new Date(e.dueAt) < now
    );
  }

  async checkAutoEscalations(): Promise<Escalation[]> {
    const escalated: Escalation[] = [];
    const now = new Date();

    for (const escalation of this.escalations) {
      if (['resolved', 'closed'].includes(escalation.status)) continue;
      if (escalation.level >= 5) continue;

      const matrix = this.getMatrix(escalation.type);
      const levelConfig = matrix?.levels.find(l => l.level === escalation.level);

      if (!levelConfig) continue;

      const autoEscalateAt = new Date(escalation.createdAt);
      autoEscalateAt.setHours(autoEscalateAt.getHours() + levelConfig.autoEscalateAfterHours);

      if (now > autoEscalateAt) {
        await this.escalateToNextLevel(
          escalation.id,
          'system',
          'System',
          'Auto-escalated due to SLA breach'
        );
        escalated.push(escalation);
      }
    }

    return escalated;
  }

  async getStatistics(): Promise<{
    total: number;
    byStatus: Record<EscalationStatus, number>;
    byType: Record<EscalationType, number>;
    byPriority: Record<EscalationPriority, number>;
    byLevel: Record<number, number>;
    averageResolutionTime: number;
    slaCompliance: number;
    overdueCount: number;
  }> {
    const byStatus: Record<EscalationStatus, number> = {
      open: 0, acknowledged: 0, in_progress: 0, resolved: 0, closed: 0
    };
    const byType: Record<EscalationType, number> = {
      delay: 0, quality: 0, safety: 0, resource: 0, material: 0, equipment: 0, process: 0
    };
    const byPriority: Record<EscalationPriority, number> = {
      low: 0, medium: 0, high: 0, critical: 0
    };
    const byLevel: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    let totalResolutionTime = 0;
    let resolvedCount = 0;
    let withinSLA = 0;
    const now = new Date();
    let overdueCount = 0;

    for (const e of this.escalations) {
      byStatus[e.status]++;
      byType[e.type]++;
      byPriority[e.priority]++;
      byLevel[e.level]++;

      if (e.resolvedAt) {
        const resolutionTime = (new Date(e.resolvedAt).getTime() - new Date(e.createdAt).getTime()) / (1000 * 60 * 60);
        totalResolutionTime += resolutionTime;
        resolvedCount++;

        if (resolutionTime <= e.slaHours) {
          withinSLA++;
        }
      }

      if (!['resolved', 'closed'].includes(e.status) && new Date(e.dueAt) < now) {
        overdueCount++;
      }
    }

    return {
      total: this.escalations.length,
      byStatus,
      byType,
      byPriority,
      byLevel,
      averageResolutionTime: resolvedCount > 0 ? Math.round(totalResolutionTime / resolvedCount) : 0,
      slaCompliance: resolvedCount > 0 ? Math.round((withinSLA / resolvedCount) * 100) : 100,
      overdueCount,
    };
  }

  private async sendNotification(escalation: Escalation): Promise<void> {
    escalation.notificationsSent.push({
      level: escalation.level,
      recipients: [escalation.assignedToId],
      sentAt: new Date().toISOString(),
      method: 'email',
    });
  }

  private getMatrix(type: EscalationType): EscalationMatrix | undefined {
    return this.escalationMatrices.find(m => m.type === type);
  }

  private calculateDueDate(hours: number): string {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    return date.toISOString();
  }

  private async generateEscalationNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const sequence = String(this.escalations.length + 1).padStart(4, '0');
    return `ESC-${year}${month}-${sequence}`;
  }

  private initializeMatrices(): void {
    const defaultLevels = [
      { level: 1 as EscalationLevel, role: 'Supervisor', userId: 'sup-001', userName: 'Line Supervisor', slaHours: 2, autoEscalateAfterHours: 4 },
      { level: 2 as EscalationLevel, role: 'Manager', userId: 'mgr-001', userName: 'Production Manager', slaHours: 4, autoEscalateAfterHours: 8 },
      { level: 3 as EscalationLevel, role: 'Senior Manager', userId: 'smgr-001', userName: 'Senior Manager', slaHours: 8, autoEscalateAfterHours: 16 },
      { level: 4 as EscalationLevel, role: 'Director', userId: 'dir-001', userName: 'Operations Director', slaHours: 24, autoEscalateAfterHours: 48 },
      { level: 5 as EscalationLevel, role: 'VP', userId: 'vp-001', userName: 'VP Operations', slaHours: 48, autoEscalateAfterHours: 72 },
    ];

    const types: EscalationType[] = ['delay', 'quality', 'safety', 'resource', 'material', 'equipment', 'process'];
    this.escalationMatrices = types.map(type => ({ type, levels: [...defaultLevels] }));
  }

  private initializeRules(): void {
    this.escalationRules = [
      {
        id: uuidv4(),
        name: 'Production Delay > 2 hours',
        isActive: true,
        triggerCondition: { type: 'delay', metric: 'delay_hours', operator: 'gt', threshold: 2, unit: 'hours' },
        initialLevel: 1,
        priority: 'medium',
        notifyImmediately: true,
      },
      {
        id: uuidv4(),
        name: 'Quality Defect Rate > 5%',
        isActive: true,
        triggerCondition: { type: 'quality', metric: 'defect_rate', operator: 'gt', threshold: 5, unit: 'percent' },
        initialLevel: 2,
        priority: 'high',
        notifyImmediately: true,
      },
      {
        id: uuidv4(),
        name: 'Safety Incident',
        isActive: true,
        triggerCondition: { type: 'safety', metric: 'incident_count', operator: 'gte', threshold: 1, unit: 'count' },
        initialLevel: 3,
        priority: 'critical',
        notifyImmediately: true,
      },
    ];
  }

  private seedMockData(): void {
    this.createEscalation({
      type: 'delay',
      priority: 'high',
      level: 1,
      sourceType: 'work_order',
      sourceReference: 'WO-2024-001',
      title: 'Production delay on Assembly Line 2',
      description: 'Assembly line 2 is experiencing delays due to equipment malfunction',
      impact: '50 units behind schedule, estimated 4 hour delay',
      escalatedById: 'user-001',
      escalatedByName: 'John Operator',
    });
  }
}
