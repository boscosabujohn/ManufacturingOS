import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type CAPAType = 'corrective' | 'preventive';
export type CAPAStatus = 'initiated' | 'investigation' | 'action_planning' | 'implementation' | 'verification' | 'closed' | 'cancelled';
export type CAPAPriority = 'low' | 'medium' | 'high' | 'critical';
export type CAPASource = 'customer_complaint' | 'internal_audit' | 'supplier_issue' | 'process_deviation' | 'nonconformance' | 'management_review' | 'other';

export interface CAPA {
  id: string;
  capaNumber: string;
  type: CAPAType;
  title: string;
  description: string;
  source: CAPASource;
  sourceReference?: string;
  priority: CAPAPriority;
  status: CAPAStatus;
  initiatedBy: string;
  initiatedByName: string;
  assignedTo: string;
  assignedToName: string;
  department: string;
  targetCompletionDate: string;
  actualCompletionDate?: string;

  // Investigation
  rootCauseAnalysis?: RootCauseAnalysis;

  // Actions
  immediateActions: CAPAAction[];
  correctiveActions: CAPAAction[];
  preventiveActions: CAPAAction[];

  // Verification
  verificationResults?: VerificationResult[];
  effectivenessCheck?: EffectivenessCheck;

  // Related
  relatedCAPAs?: string[];
  relatedDocuments?: { type: string; id: string; number: string }[];
  attachments: CAPAAttachment[];

  // Audit trail
  history: CAPAHistoryItem[];

  createdAt: string;
  updatedAt: string;
}

export interface RootCauseAnalysis {
  method: 'five_why' | 'fishbone' | 'pareto' | 'fmea' | 'other';
  findings: string;
  rootCauses: string[];
  contributingFactors?: string[];
  analysisDate: string;
  analyzedBy: string;
  attachments?: CAPAAttachment[];
}

export interface CAPAAction {
  id: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  dueDate: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  evidence?: string;
  notes?: string;
  attachments?: CAPAAttachment[];
}

export interface VerificationResult {
  id: string;
  actionId: string;
  verifiedBy: string;
  verifiedByName: string;
  verificationDate: string;
  result: 'pass' | 'fail' | 'partial';
  findings: string;
  evidence?: string;
  reVerificationRequired?: boolean;
}

export interface EffectivenessCheck {
  scheduledDate: string;
  completedDate?: string;
  checkedBy?: string;
  checkedByName?: string;
  isEffective?: boolean;
  findings?: string;
  recurrenceObserved?: boolean;
  measurementData?: Record<string, number>;
  recommendation?: 'close' | 'extend_monitoring' | 'reopen';
}

export interface CAPAAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface CAPAHistoryItem {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  performedByName: string;
  performedAt: string;
}

export interface CAPAMetrics {
  totalCAPAs: number;
  openCAPAs: number;
  overdueActions: number;
  avgClosureTime: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
  byPriority: Record<string, number>;
  effectivenessRate: number;
  recurrenceRate: number;
  trendsMonthly: { month: string; opened: number; closed: number }[];
}

@Injectable()
export class CAPAManagementService {
  private capas: CAPA[] = [];
  private capaCounter = 1000;

  constructor() {
    this.seedMockData();
  }

  async createCAPA(
    type: CAPAType,
    title: string,
    description: string,
    source: CAPASource,
    priority: CAPAPriority,
    assignedTo: string,
    assignedToName: string,
    department: string,
    targetCompletionDate: string,
    initiatedBy: string,
    initiatedByName: string,
    sourceReference?: string
  ): Promise<CAPA> {
    const capa: CAPA = {
      id: uuidv4(),
      capaNumber: `CAPA-${++this.capaCounter}`,
      type,
      title,
      description,
      source,
      sourceReference,
      priority,
      status: 'initiated',
      initiatedBy,
      initiatedByName,
      assignedTo,
      assignedToName,
      department,
      targetCompletionDate,
      immediateActions: [],
      correctiveActions: [],
      preventiveActions: [],
      attachments: [],
      history: [{
        id: uuidv4(),
        action: 'CAPA Initiated',
        details: `CAPA created with priority ${priority}`,
        performedBy: initiatedBy,
        performedByName: initiatedByName,
        performedAt: new Date().toISOString(),
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.capas.push(capa);
    return capa;
  }

  async submitRootCauseAnalysis(
    capaId: string,
    method: RootCauseAnalysis['method'],
    findings: string,
    rootCauses: string[],
    analyzedBy: string,
    contributingFactors?: string[]
  ): Promise<CAPA> {
    const capa = this.capas.find(c => c.id === capaId);
    if (!capa) throw new Error(`CAPA ${capaId} not found`);

    capa.rootCauseAnalysis = {
      method,
      findings,
      rootCauses,
      contributingFactors,
      analysisDate: new Date().toISOString().split('T')[0],
      analyzedBy,
    };

    capa.status = 'action_planning';
    this.addHistory(capa, 'Root Cause Analysis Submitted', `Method: ${method}, ${rootCauses.length} root causes identified`, analyzedBy);

    return capa;
  }

  async addAction(
    capaId: string,
    actionType: 'immediate' | 'corrective' | 'preventive',
    description: string,
    assignedTo: string,
    assignedToName: string,
    dueDate: string,
    addedBy: string
  ): Promise<CAPAAction> {
    const capa = this.capas.find(c => c.id === capaId);
    if (!capa) throw new Error(`CAPA ${capaId} not found`);

    const action: CAPAAction = {
      id: uuidv4(),
      description,
      assignedTo,
      assignedToName,
      dueDate,
      status: 'pending',
    };

    switch (actionType) {
      case 'immediate':
        capa.immediateActions.push(action);
        break;
      case 'corrective':
        capa.correctiveActions.push(action);
        break;
      case 'preventive':
        capa.preventiveActions.push(action);
        break;
    }

    this.addHistory(capa, `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} Action Added`, description, addedBy);
    capa.updatedAt = new Date().toISOString();

    return action;
  }

  async completeAction(
    capaId: string,
    actionId: string,
    evidence: string,
    notes: string,
    completedBy: string
  ): Promise<CAPAAction> {
    const capa = this.capas.find(c => c.id === capaId);
    if (!capa) throw new Error(`CAPA ${capaId} not found`);

    const allActions = [...capa.immediateActions, ...capa.correctiveActions, ...capa.preventiveActions];
    const action = allActions.find(a => a.id === actionId);
    if (!action) throw new Error(`Action ${actionId} not found`);

    action.status = 'completed';
    action.completedDate = new Date().toISOString().split('T')[0];
    action.evidence = evidence;
    action.notes = notes;

    this.addHistory(capa, 'Action Completed', action.description, completedBy);

    // Check if all actions are complete
    const pendingActions = allActions.filter(a => a.status !== 'completed' && a.status !== 'cancelled');
    if (pendingActions.length === 0 && capa.status === 'implementation') {
      capa.status = 'verification';
    }

    capa.updatedAt = new Date().toISOString();
    return action;
  }

  async startImplementation(capaId: string, startedBy: string): Promise<CAPA> {
    const capa = this.capas.find(c => c.id === capaId);
    if (!capa) throw new Error(`CAPA ${capaId} not found`);

    const allActions = [...capa.immediateActions, ...capa.correctiveActions, ...capa.preventiveActions];
    if (allActions.length === 0) {
      throw new Error('At least one action must be defined before implementation');
    }

    capa.status = 'implementation';
    this.addHistory(capa, 'Implementation Started', `${allActions.length} actions to implement`, startedBy);
    capa.updatedAt = new Date().toISOString();

    return capa;
  }

  async verifyAction(
    capaId: string,
    actionId: string,
    verifiedBy: string,
    verifiedByName: string,
    result: VerificationResult['result'],
    findings: string,
    evidence?: string
  ): Promise<VerificationResult> {
    const capa = this.capas.find(c => c.id === capaId);
    if (!capa) throw new Error(`CAPA ${capaId} not found`);

    if (!capa.verificationResults) {
      capa.verificationResults = [];
    }

    const verification: VerificationResult = {
      id: uuidv4(),
      actionId,
      verifiedBy,
      verifiedByName,
      verificationDate: new Date().toISOString().split('T')[0],
      result,
      findings,
      evidence,
      reVerificationRequired: result === 'fail',
    };

    capa.verificationResults.push(verification);
    this.addHistory(capa, 'Action Verified', `Result: ${result} - ${findings}`, verifiedBy);
    capa.updatedAt = new Date().toISOString();

    return verification;
  }

  async scheduleEffectivenessCheck(
    capaId: string,
    scheduledDate: string,
    scheduledBy: string
  ): Promise<CAPA> {
    const capa = this.capas.find(c => c.id === capaId);
    if (!capa) throw new Error(`CAPA ${capaId} not found`);

    capa.effectivenessCheck = {
      scheduledDate,
    };

    this.addHistory(capa, 'Effectiveness Check Scheduled', `Scheduled for ${scheduledDate}`, scheduledBy);
    capa.updatedAt = new Date().toISOString();

    return capa;
  }

  async completeEffectivenessCheck(
    capaId: string,
    checkedBy: string,
    checkedByName: string,
    isEffective: boolean,
    findings: string,
    recurrenceObserved: boolean,
    recommendation: EffectivenessCheck['recommendation']
  ): Promise<CAPA> {
    const capa = this.capas.find(c => c.id === capaId);
    if (!capa) throw new Error(`CAPA ${capaId} not found`);

    if (!capa.effectivenessCheck) {
      capa.effectivenessCheck = { scheduledDate: new Date().toISOString().split('T')[0] };
    }

    capa.effectivenessCheck.completedDate = new Date().toISOString().split('T')[0];
    capa.effectivenessCheck.checkedBy = checkedBy;
    capa.effectivenessCheck.checkedByName = checkedByName;
    capa.effectivenessCheck.isEffective = isEffective;
    capa.effectivenessCheck.findings = findings;
    capa.effectivenessCheck.recurrenceObserved = recurrenceObserved;
    capa.effectivenessCheck.recommendation = recommendation;

    this.addHistory(capa, 'Effectiveness Check Completed', `Effective: ${isEffective}, Recommendation: ${recommendation}`, checkedBy);

    if (recommendation === 'close') {
      capa.status = 'closed';
      capa.actualCompletionDate = new Date().toISOString().split('T')[0];
      this.addHistory(capa, 'CAPA Closed', 'CAPA completed successfully', checkedBy);
    }

    capa.updatedAt = new Date().toISOString();
    return capa;
  }

  async getCAPAsByStatus(status: CAPAStatus): Promise<CAPA[]> {
    return this.capas.filter(c => c.status === status);
  }

  async getCAPAsByAssignee(userId: string): Promise<CAPA[]> {
    return this.capas.filter(c => c.assignedTo === userId);
  }

  async getOverdueActions(): Promise<{ capa: CAPA; action: CAPAAction }[]> {
    const today = new Date().toISOString().split('T')[0];
    const overdue: { capa: CAPA; action: CAPAAction }[] = [];

    for (const capa of this.capas) {
      if (capa.status === 'closed' || capa.status === 'cancelled') continue;

      const allActions = [...capa.immediateActions, ...capa.correctiveActions, ...capa.preventiveActions];
      for (const action of allActions) {
        if (action.status !== 'completed' && action.status !== 'cancelled' && action.dueDate < today) {
          action.status = 'overdue';
          overdue.push({ capa, action });
        }
      }
    }

    return overdue;
  }

  async getMetrics(dateFrom?: string, dateTo?: string): Promise<CAPAMetrics> {
    let filtered = this.capas;

    if (dateFrom) {
      filtered = filtered.filter(c => c.createdAt >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(c => c.createdAt <= dateTo);
    }

    const byStatus: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    const byPriority: Record<string, number> = {};

    let totalClosureTime = 0;
    let closedCount = 0;
    let effectiveCount = 0;
    let recurrenceCount = 0;
    let overdueActions = 0;

    for (const capa of filtered) {
      byStatus[capa.status] = (byStatus[capa.status] || 0) + 1;
      bySource[capa.source] = (bySource[capa.source] || 0) + 1;
      byPriority[capa.priority] = (byPriority[capa.priority] || 0) + 1;

      if (capa.status === 'closed' && capa.actualCompletionDate) {
        const created = new Date(capa.createdAt);
        const closed = new Date(capa.actualCompletionDate);
        totalClosureTime += (closed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        closedCount++;

        if (capa.effectivenessCheck?.isEffective) {
          effectiveCount++;
        }
        if (capa.effectivenessCheck?.recurrenceObserved) {
          recurrenceCount++;
        }
      }

      // Count overdue actions
      const allActions = [...capa.immediateActions, ...capa.correctiveActions, ...capa.preventiveActions];
      overdueActions += allActions.filter(a => a.status === 'overdue').length;
    }

    return {
      totalCAPAs: filtered.length,
      openCAPAs: filtered.filter(c => !['closed', 'cancelled'].includes(c.status)).length,
      overdueActions,
      avgClosureTime: closedCount > 0 ? Math.round(totalClosureTime / closedCount) : 0,
      byStatus,
      bySource,
      byPriority,
      effectivenessRate: closedCount > 0 ? Math.round((effectiveCount / closedCount) * 100) : 0,
      recurrenceRate: closedCount > 0 ? Math.round((recurrenceCount / closedCount) * 100) : 0,
      trendsMonthly: [],
    };
  }

  private addHistory(capa: CAPA, action: string, details: string, performedBy: string): void {
    capa.history.push({
      id: uuidv4(),
      action,
      details,
      performedBy,
      performedByName: `User ${performedBy}`,
      performedAt: new Date().toISOString(),
    });
  }

  private seedMockData(): void {
    // Sample CAPA
    const capaId = uuidv4();
    this.capas = [
      {
        id: capaId,
        capaNumber: 'CAPA-1001',
        type: 'corrective',
        title: 'Customer Complaint - Product Quality Issue',
        description: 'Multiple customer complaints received regarding finish quality on Product XYZ',
        source: 'customer_complaint',
        sourceReference: 'CC-2024-0123',
        priority: 'high',
        status: 'investigation',
        initiatedBy: 'user-001',
        initiatedByName: 'Quality Manager',
        assignedTo: 'user-002',
        assignedToName: 'Production Supervisor',
        department: 'Production',
        targetCompletionDate: this.addDays(30),
        immediateActions: [
          {
            id: uuidv4(),
            description: 'Quarantine affected batch',
            assignedTo: 'user-003',
            assignedToName: 'Warehouse Lead',
            dueDate: this.addDays(1),
            status: 'completed',
            completedDate: new Date().toISOString().split('T')[0],
            evidence: 'Batch QTN-2024-001 quarantined',
          },
        ],
        correctiveActions: [],
        preventiveActions: [],
        attachments: [],
        history: [
          {
            id: uuidv4(),
            action: 'CAPA Initiated',
            details: 'CAPA created with priority high',
            performedBy: 'user-001',
            performedByName: 'Quality Manager',
            performedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private addDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }
}
