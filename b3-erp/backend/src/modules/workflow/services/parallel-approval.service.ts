import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type ApprovalLogic = 'and' | 'or' | 'voting' | 'sequential' | 'any_one';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';
export type ParticipantStatus = 'pending' | 'approved' | 'rejected' | 'abstained' | 'delegated';

export interface ApprovalWorkflow {
  id: string;
  name: string;
  description: string;
  documentType: string;
  stages: ApprovalStage[];
  timeoutHours?: number;
  allowDelegation: boolean;
  allowComments: boolean;
  requireCommentOnReject: boolean;
  notifyOnStatusChange: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface ApprovalStage {
  id: string;
  name: string;
  sequence: number;
  logic: ApprovalLogic;
  participants: StageParticipant[];
  votingConfig?: VotingConfig;
  timeoutHours?: number;
  autoApproveOnTimeout?: boolean;
  escalationConfig?: EscalationConfig;
}

export interface StageParticipant {
  id: string;
  type: 'user' | 'role' | 'department' | 'dynamic';
  identifier: string;
  name: string;
  isRequired?: boolean;
  weight?: number; // For voting
}

export interface VotingConfig {
  minimumVotes: number;
  approvalThreshold: number; // Percentage
  tieBreaker?: 'approve' | 'reject' | 'escalate';
}

export interface EscalationConfig {
  afterHours: number;
  escalateTo: string;
  notifyOriginal: boolean;
}

export interface ApprovalRequest {
  id: string;
  workflowId: string;
  workflowName: string;
  documentId: string;
  documentType: string;
  documentNumber: string;
  documentTitle: string;
  requestedBy: string;
  requestedByName: string;
  status: ApprovalStatus;
  currentStageId: string;
  currentStageName: string;
  stageResults: StageResult[];
  summary?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  expiresAt?: string;
}

export interface StageResult {
  stageId: string;
  stageName: string;
  logic: ApprovalLogic;
  status: ApprovalStatus;
  participantActions: ParticipantAction[];
  voteSummary?: VoteSummary;
  startedAt: string;
  completedAt?: string;
}

export interface ParticipantAction {
  participantId: string;
  userId: string;
  userName: string;
  status: ParticipantStatus;
  comment?: string;
  delegatedTo?: string;
  actionAt?: string;
}

export interface VoteSummary {
  totalVotes: number;
  approveVotes: number;
  rejectVotes: number;
  abstainedVotes: number;
  approvalPercent: number;
  thresholdMet: boolean;
}

export interface ApprovalAction {
  requestId: string;
  userId: string;
  action: 'approve' | 'reject' | 'abstain' | 'delegate';
  comment?: string;
  delegateTo?: string;
}

@Injectable()
export class ParallelApprovalService {
  private workflows: ApprovalWorkflow[] = [];
  private requests: ApprovalRequest[] = [];

  constructor() {
    this.seedMockData();
  }

  async createWorkflow(workflow: Omit<ApprovalWorkflow, 'id' | 'createdAt'>): Promise<ApprovalWorkflow> {
    const newWorkflow: ApprovalWorkflow = {
      ...workflow,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    this.workflows.push(newWorkflow);
    return newWorkflow;
  }

  async initiateApproval(
    workflowId: string,
    documentId: string,
    documentType: string,
    documentNumber: string,
    documentTitle: string,
    requestedBy: string,
    requestedByName: string,
    summary?: string
  ): Promise<ApprovalRequest> {
    const workflow = this.workflows.find(w => w.id === workflowId);
    if (!workflow) throw new Error(`Workflow ${workflowId} not found`);

    const firstStage = workflow.stages.sort((a, b) => a.sequence - b.sequence)[0];

    const request: ApprovalRequest = {
      id: uuidv4(),
      workflowId,
      workflowName: workflow.name,
      documentId,
      documentType,
      documentNumber,
      documentTitle,
      requestedBy,
      requestedByName,
      status: 'pending',
      currentStageId: firstStage.id,
      currentStageName: firstStage.name,
      stageResults: [],
      summary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: workflow.timeoutHours
        ? new Date(Date.now() + workflow.timeoutHours * 60 * 60 * 1000).toISOString()
        : undefined,
    };

    // Initialize first stage
    const stageResult = this.initializeStage(firstStage);
    request.stageResults.push(stageResult);

    this.requests.push(request);
    return request;
  }

  private initializeStage(stage: ApprovalStage): StageResult {
    const participantActions: ParticipantAction[] = stage.participants.map(p => ({
      participantId: p.id,
      userId: p.identifier,
      userName: p.name,
      status: 'pending',
    }));

    return {
      stageId: stage.id,
      stageName: stage.name,
      logic: stage.logic,
      status: 'pending',
      participantActions,
      startedAt: new Date().toISOString(),
    };
  }

  async processAction(action: ApprovalAction): Promise<ApprovalRequest> {
    const request = this.requests.find(r => r.id === action.requestId);
    if (!request) throw new Error(`Request ${action.requestId} not found`);

    const workflow = this.workflows.find(w => w.id === request.workflowId);
    if (!workflow) throw new Error('Workflow not found');

    const currentStageResult = request.stageResults.find(sr => sr.stageId === request.currentStageId);
    if (!currentStageResult) throw new Error('Current stage not found');

    // Find participant action
    const participantAction = currentStageResult.participantActions.find(pa => pa.userId === action.userId);
    if (!participantAction) throw new Error('User not authorized for this approval');

    // Update participant action
    participantAction.status = action.action === 'approve' ? 'approved' :
      action.action === 'reject' ? 'rejected' :
        action.action === 'abstain' ? 'abstained' : 'delegated';
    participantAction.comment = action.comment;
    participantAction.actionAt = new Date().toISOString();

    if (action.action === 'delegate' && action.delegateTo) {
      participantAction.delegatedTo = action.delegateTo;
      // Add new participant
      currentStageResult.participantActions.push({
        participantId: uuidv4(),
        userId: action.delegateTo,
        userName: `User ${action.delegateTo}`,
        status: 'pending',
      });
    }

    // Evaluate stage completion
    const stage = workflow.stages.find(s => s.id === request.currentStageId);
    if (stage) {
      const stageComplete = this.evaluateStageCompletion(currentStageResult, stage);
      if (stageComplete) {
        await this.completeStage(request, workflow, currentStageResult);
      }
    }

    request.updatedAt = new Date().toISOString();
    return request;
  }

  private evaluateStageCompletion(stageResult: StageResult, stage: ApprovalStage): boolean {
    const actions = stageResult.participantActions;
    const completed = actions.filter(a => a.status !== 'pending' && a.status !== 'delegated');
    const approved = actions.filter(a => a.status === 'approved');
    const rejected = actions.filter(a => a.status === 'rejected');

    switch (stage.logic) {
      case 'and':
        // All must approve
        if (rejected.length > 0) {
          stageResult.status = 'rejected';
          return true;
        }
        if (approved.length === actions.length) {
          stageResult.status = 'approved';
          return true;
        }
        return false;

      case 'or':
      case 'any_one':
        // Any one approval is enough
        if (approved.length > 0) {
          stageResult.status = 'approved';
          return true;
        }
        if (rejected.length === actions.length) {
          stageResult.status = 'rejected';
          return true;
        }
        return false;

      case 'voting':
        if (stage.votingConfig && completed.length >= stage.votingConfig.minimumVotes) {
          const totalVotes = approved.length + rejected.length;
          const approvalPercent = totalVotes > 0 ? (approved.length / totalVotes) * 100 : 0;

          stageResult.voteSummary = {
            totalVotes,
            approveVotes: approved.length,
            rejectVotes: rejected.length,
            abstainedVotes: actions.filter(a => a.status === 'abstained').length,
            approvalPercent,
            thresholdMet: approvalPercent >= stage.votingConfig.approvalThreshold,
          };

          if (approvalPercent >= stage.votingConfig.approvalThreshold) {
            stageResult.status = 'approved';
          } else {
            stageResult.status = 'rejected';
          }
          return true;
        }
        return false;

      case 'sequential':
        // First rejection or all approved
        if (rejected.length > 0) {
          stageResult.status = 'rejected';
          return true;
        }
        if (approved.length === actions.length) {
          stageResult.status = 'approved';
          return true;
        }
        return false;

      default:
        return false;
    }
  }

  private async completeStage(
    request: ApprovalRequest,
    workflow: ApprovalWorkflow,
    stageResult: StageResult
  ): Promise<void> {
    stageResult.completedAt = new Date().toISOString();

    if (stageResult.status === 'rejected') {
      request.status = 'rejected';
      request.completedAt = new Date().toISOString();
      return;
    }

    // Move to next stage
    const currentStage = workflow.stages.find(s => s.id === request.currentStageId);
    const stages = workflow.stages.sort((a, b) => a.sequence - b.sequence);
    const currentIndex = stages.findIndex(s => s.id === currentStage?.id);

    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      request.currentStageId = nextStage.id;
      request.currentStageName = nextStage.name;

      const nextStageResult = this.initializeStage(nextStage);
      request.stageResults.push(nextStageResult);
    } else {
      // All stages complete
      request.status = 'approved';
      request.completedAt = new Date().toISOString();
    }
  }

  async getPendingApprovals(userId: string): Promise<ApprovalRequest[]> {
    return this.requests.filter(r => {
      if (r.status !== 'pending') return false;

      const currentResult = r.stageResults.find(sr => sr.stageId === r.currentStageId);
      if (!currentResult) return false;

      return currentResult.participantActions.some(
        pa => pa.userId === userId && pa.status === 'pending'
      );
    });
  }

  async getRequestsByDocument(documentId: string): Promise<ApprovalRequest[]> {
    return this.requests.filter(r => r.documentId === documentId);
  }

  async cancelRequest(requestId: string, cancelledBy: string): Promise<ApprovalRequest> {
    const request = this.requests.find(r => r.id === requestId);
    if (!request) throw new Error(`Request ${requestId} not found`);

    request.status = 'cancelled';
    request.completedAt = new Date().toISOString();
    request.updatedAt = new Date().toISOString();

    return request;
  }

  async getApprovalHistory(requestId: string): Promise<ParticipantAction[]> {
    const request = this.requests.find(r => r.id === requestId);
    if (!request) return [];

    return request.stageResults
      .flatMap(sr => sr.participantActions)
      .filter(pa => pa.actionAt)
      .sort((a, b) => new Date(a.actionAt!).getTime() - new Date(b.actionAt!).getTime());
  }

  async getApprovalStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    avgCompletionTime: number;
    byWorkflow: Record<string, { total: number; approved: number; rejected: number }>;
  }> {
    const byWorkflow: Record<string, { total: number; approved: number; rejected: number }> = {};

    let totalTime = 0;
    let completedCount = 0;

    for (const request of this.requests) {
      if (!byWorkflow[request.workflowName]) {
        byWorkflow[request.workflowName] = { total: 0, approved: 0, rejected: 0 };
      }
      byWorkflow[request.workflowName].total++;

      if (request.status === 'approved') {
        byWorkflow[request.workflowName].approved++;
      } else if (request.status === 'rejected') {
        byWorkflow[request.workflowName].rejected++;
      }

      if (request.completedAt) {
        const time = new Date(request.completedAt).getTime() - new Date(request.createdAt).getTime();
        totalTime += time;
        completedCount++;
      }
    }

    return {
      total: this.requests.length,
      pending: this.requests.filter(r => r.status === 'pending').length,
      approved: this.requests.filter(r => r.status === 'approved').length,
      rejected: this.requests.filter(r => r.status === 'rejected').length,
      avgCompletionTime: completedCount > 0 ? Math.round(totalTime / completedCount / 60000) : 0,
      byWorkflow,
    };
  }

  private seedMockData(): void {
    // Sample parallel approval workflow
    this.workflows = [
      {
        id: uuidv4(),
        name: 'High Value Purchase Approval',
        description: 'Approval workflow for purchases above 100,000',
        documentType: 'purchase_order',
        stages: [
          {
            id: uuidv4(),
            name: 'Department Heads',
            sequence: 1,
            logic: 'and',
            participants: [
              { id: uuidv4(), type: 'user', identifier: 'dept-head-1', name: 'Operations Head', isRequired: true },
              { id: uuidv4(), type: 'user', identifier: 'dept-head-2', name: 'Finance Head', isRequired: true },
            ],
            timeoutHours: 24,
          },
          {
            id: uuidv4(),
            name: 'Committee Vote',
            sequence: 2,
            logic: 'voting',
            participants: [
              { id: uuidv4(), type: 'user', identifier: 'committee-1', name: 'Committee Member 1', weight: 1 },
              { id: uuidv4(), type: 'user', identifier: 'committee-2', name: 'Committee Member 2', weight: 1 },
              { id: uuidv4(), type: 'user', identifier: 'committee-3', name: 'Committee Member 3', weight: 1 },
            ],
            votingConfig: {
              minimumVotes: 2,
              approvalThreshold: 66,
              tieBreaker: 'escalate',
            },
            timeoutHours: 48,
          },
          {
            id: uuidv4(),
            name: 'Final Approval',
            sequence: 3,
            logic: 'or',
            participants: [
              { id: uuidv4(), type: 'user', identifier: 'ceo', name: 'CEO', isRequired: false },
              { id: uuidv4(), type: 'user', identifier: 'cfo', name: 'CFO', isRequired: false },
            ],
            timeoutHours: 24,
          },
        ],
        timeoutHours: 120,
        allowDelegation: true,
        allowComments: true,
        requireCommentOnReject: true,
        notifyOnStatusChange: true,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];
  }
}
