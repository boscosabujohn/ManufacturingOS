import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EventBusService } from '../../workflow/services/event-bus.service';
import { WorkflowEventType } from '../../workflow/events/event-types';

export interface ApprovalTier {
  level: number;
  minValue: number;
  maxValue: number;
  approverRole: string;
  slaHours: number;
  requiresMultipleApprovals: boolean;
  description: string;
}

export interface ApprovalRequest {
  id: string;
  requestType: 'discount' | 'payment_terms' | 'delivery' | 'margin' | 'credit_limit';
  referenceId: string; // Order ID or Quote ID
  referenceNumber: string;
  requestValue: number;
  currentLevel: number;
  requiredLevel: number;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'escalated';
  requestedBy: string;
  requestedAt: string;
  reason: string;
  approvers: ApprovalAction[];
  escalatedAt?: string;
  escalatedTo?: string;
  resolvedAt?: string;
  comments?: string;
}

export interface ApprovalAction {
  approverId: string;
  approverName: string;
  role: string;
  level: number;
  action: 'approved' | 'rejected' | 'pending' | 'skipped';
  actionDate?: string;
  comments?: string;
  delegatedFrom?: string;
}

export interface ApprovalThresholds {
  discount: {
    level1: number; // 10% - Sales Manager
    level2: number; // 20% - Regional Head
    level3: number; // 30% - CFO
    level4: number; // >30% - CEO
  };
  margin: {
    minimumThreshold: number; // 15% minimum margin
    warningThreshold: number; // 20% warning level
  };
  paymentTerms: {
    standardDays: number; // 30 days
    maxDeviation: number; // 60 days max
  };
  creditLimit: {
    level1: number; // Up to 500K
    level2: number; // Up to 2M
    level3: number; // Up to 10M
    level4: number; // >10M
  };
}

@Injectable()
export class ApprovalWorkflowService {
  private approvalRequests: ApprovalRequest[] = [];

  private readonly approvalMatrix: ApprovalTier[] = [
    {
      level: 1,
      minValue: 0,
      maxValue: 100000,
      approverRole: 'SALES_MANAGER',
      slaHours: 4,
      requiresMultipleApprovals: false,
      description: 'Sales Manager Approval',
    },
    {
      level: 2,
      minValue: 100001,
      maxValue: 500000,
      approverRole: 'REGIONAL_HEAD',
      slaHours: 8,
      requiresMultipleApprovals: false,
      description: 'Regional Head Approval',
    },
    {
      level: 3,
      minValue: 500001,
      maxValue: 2000000,
      approverRole: 'GENERAL_MANAGER',
      slaHours: 24,
      requiresMultipleApprovals: false,
      description: 'General Manager Approval',
    },
    {
      level: 4,
      minValue: 2000001,
      maxValue: 10000000,
      approverRole: 'CFO',
      slaHours: 48,
      requiresMultipleApprovals: true,
      description: 'CFO Approval',
    },
    {
      level: 5,
      minValue: 10000001,
      maxValue: Infinity,
      approverRole: 'CEO',
      slaHours: 72,
      requiresMultipleApprovals: true,
      description: 'CEO Approval',
    },
  ];

  private readonly thresholds: ApprovalThresholds = {
    discount: {
      level1: 0.10, // 10%
      level2: 0.20, // 20%
      level3: 0.30, // 30%
      level4: 1.00, // >30%
    },
    margin: {
      minimumThreshold: 0.15, // 15%
      warningThreshold: 0.20, // 20%
    },
    paymentTerms: {
      standardDays: 30,
      maxDeviation: 60,
    },
    creditLimit: {
      level1: 500000,
      level2: 2000000,
      level3: 10000000,
      level4: Infinity,
    },
  };

  constructor(private readonly eventBusService: EventBusService) { }

  getApprovalTier(value: number): ApprovalTier {
    const tier = this.approvalMatrix.find(
      t => value >= t.minValue && value <= t.maxValue
    );
    return tier || this.approvalMatrix[this.approvalMatrix.length - 1];
  }

  getApproverRole(value: number): string {
    return this.getApprovalTier(value).approverRole;
  }

  getSLA(value: number): number {
    return this.getApprovalTier(value).slaHours;
  }

  determineApprovers(
    discount: number,
    margin: number,
    amount: number
  ): { levels: number[]; roles: string[]; reasons: string[] } {
    const levels: number[] = [];
    const roles: string[] = [];
    const reasons: string[] = [];

    // Check discount approval level
    if (discount > this.thresholds.discount.level3) {
      levels.push(4);
      roles.push('CEO');
      reasons.push(`Discount ${(discount * 100).toFixed(1)}% exceeds 30%`);
    } else if (discount > this.thresholds.discount.level2) {
      levels.push(3);
      roles.push('CFO');
      reasons.push(`Discount ${(discount * 100).toFixed(1)}% exceeds 20%`);
    } else if (discount > this.thresholds.discount.level1) {
      levels.push(2);
      roles.push('REGIONAL_HEAD');
      reasons.push(`Discount ${(discount * 100).toFixed(1)}% exceeds 10%`);
    }

    // Check margin
    if (margin < this.thresholds.margin.minimumThreshold) {
      levels.push(4);
      roles.push('CFO');
      reasons.push(`Margin ${(margin * 100).toFixed(1)}% below minimum ${(this.thresholds.margin.minimumThreshold * 100)}%`);
    } else if (margin < this.thresholds.margin.warningThreshold) {
      levels.push(2);
      roles.push('REGIONAL_HEAD');
      reasons.push(`Margin ${(margin * 100).toFixed(1)}% below warning threshold`);
    }

    // Check value-based approval
    const valueTier = this.getApprovalTier(amount);
    if (!levels.includes(valueTier.level)) {
      levels.push(valueTier.level);
      roles.push(valueTier.approverRole);
      reasons.push(`Order value ${amount} requires ${valueTier.description}`);
    }

    // Return highest level required
    const maxLevel = Math.max(...levels);
    const finalRoles = [...new Set(roles)];

    return {
      levels: [maxLevel],
      roles: finalRoles,
      reasons,
    };
  }

  async createApprovalRequest(
    requestType: ApprovalRequest['requestType'],
    referenceId: string,
    referenceNumber: string,
    requestValue: number,
    requestedBy: string,
    reason: string
  ): Promise<ApprovalRequest> {
    const tier = this.getApprovalTier(requestValue);

    const request: ApprovalRequest = {
      id: uuidv4(),
      requestType,
      referenceId,
      referenceNumber,
      requestValue,
      currentLevel: 0,
      requiredLevel: tier.level,
      status: 'pending',
      requestedBy,
      requestedAt: new Date().toISOString(),
      reason,
      approvers: [],
    };

    this.approvalRequests.push(request);

    await this.eventBusService.emit<any>(WorkflowEventType.APPROVAL_REQUEST_CREATED, {
      requestId: request.id,
      requestType,
      referenceId,
      requiredRole: tier.approverRole,
      userId: requestedBy,
    });

    return request;
  }

  async routeForApproval(requestId: string, approverId: string, approverName: string, role: string): Promise<void> {
    const request = this.approvalRequests.find(r => r.id === requestId);
    if (!request) {
      throw new NotFoundException(`Approval request ${requestId} not found`);
    }

    const nextLevel = request.currentLevel + 1;

    request.approvers.push({
      approverId,
      approverName,
      role,
      level: nextLevel,
      action: 'pending',
    });

    request.status = 'in_progress';

    await this.eventBusService.emit<any>(WorkflowEventType.APPROVAL_ROUTED, {
      requestId,
      approverId,
      level: nextLevel,
      userId: 'SYSTEM',
    });
  }

  async approveRequest(requestId: string, approverId: string, comments?: string): Promise<ApprovalRequest> {
    const request = this.approvalRequests.find(r => r.id === requestId);
    if (!request) {
      throw new NotFoundException(`Approval request ${requestId} not found`);
    }

    const approverIndex = request.approvers.findIndex(
      a => a.approverId === approverId && a.action === 'pending'
    );

    if (approverIndex === -1) {
      throw new BadRequestException('No pending approval found for this approver');
    }

    request.approvers[approverIndex].action = 'approved';
    request.approvers[approverIndex].actionDate = new Date().toISOString();
    request.approvers[approverIndex].comments = comments;

    request.currentLevel = request.approvers[approverIndex].level;

    // Check if fully approved
    if (request.currentLevel >= request.requiredLevel) {
      request.status = 'approved';
      request.resolvedAt = new Date().toISOString();
    }

    await this.eventBusService.emit<any>(request.status === 'approved' ? WorkflowEventType.APPROVAL_GRANTED : WorkflowEventType.APPROVAL_LEVEL_APPROVED, {
      requestId,
      approverId,
      level: request.currentLevel,
      isFullyApproved: request.status === 'approved',
      userId: approverId,
    });

    return request;
  }

  async rejectRequest(requestId: string, approverId: string, comments: string): Promise<ApprovalRequest> {
    const request = this.approvalRequests.find(r => r.id === requestId);
    if (!request) {
      throw new NotFoundException(`Approval request ${requestId} not found`);
    }

    const approverIndex = request.approvers.findIndex(
      a => a.approverId === approverId && a.action === 'pending'
    );

    if (approverIndex === -1) {
      throw new BadRequestException('No pending approval found for this approver');
    }

    request.approvers[approverIndex].action = 'rejected';
    request.approvers[approverIndex].actionDate = new Date().toISOString();
    request.approvers[approverIndex].comments = comments;
    request.status = 'rejected';
    request.resolvedAt = new Date().toISOString();

    await this.eventBusService.emit<any>(WorkflowEventType.APPROVAL_REJECTED, {
      requestId,
      approverId,
      reason: comments,
      userId: approverId,
    });

    return request;
  }

  async escalateRequest(requestId: string, escalatedToId: string, escalatedToName: string): Promise<ApprovalRequest> {
    const request = this.approvalRequests.find(r => r.id === requestId);
    if (!request) {
      throw new NotFoundException(`Approval request ${requestId} not found`);
    }

    request.status = 'escalated';
    request.escalatedAt = new Date().toISOString();
    request.escalatedTo = escalatedToId;

    // Mark current pending approvers as skipped
    request.approvers.forEach(a => {
      if (a.action === 'pending') {
        a.action = 'skipped';
      }
    });

    // Add escalation approver
    const nextLevel = request.currentLevel + 1;
    request.approvers.push({
      approverId: escalatedToId,
      approverName: escalatedToName,
      role: 'ESCALATION_APPROVER',
      level: nextLevel,
      action: 'pending',
    });

    await this.eventBusService.emit<any>(WorkflowEventType.APPROVAL_ESCALATED, {
      requestId,
      escalatedToId,
      previousLevel: request.currentLevel,
      newLevel: nextLevel,
      userId: 'SYSTEM',
    });

    return request;
  }

  async checkEscalationTimeout(): Promise<ApprovalRequest[]> {
    const now = new Date();
    const escalatedRequests: ApprovalRequest[] = [];

    for (const request of this.approvalRequests) {
      if (request.status !== 'in_progress') continue;

      const tier = this.getApprovalTier(request.requestValue);
      const slaHours = tier.slaHours;
      const requestTime = new Date(request.requestedAt);
      const hoursPassed = (now.getTime() - requestTime.getTime()) / (1000 * 60 * 60);

      if (hoursPassed > slaHours) {
        // Auto-escalate overdue requests
        escalatedRequests.push(request);

        await this.eventBusService.emit<any>(WorkflowEventType.APPROVAL_SLA_BREACHED, {
          requestId: request.id,
          slaHours,
          hoursPassed: Math.round(hoursPassed),
          userId: 'SYSTEM',
        });
      }
    }

    return escalatedRequests;
  }

  async getPendingApprovals(approverId?: string, role?: string): Promise<ApprovalRequest[]> {
    let results = this.approvalRequests.filter(r => r.status === 'in_progress' || r.status === 'pending');

    if (approverId) {
      results = results.filter(r =>
        r.approvers.some(a => a.approverId === approverId && a.action === 'pending')
      );
    }

    if (role) {
      const roleLevel = this.approvalMatrix.find(t => t.approverRole === role)?.level;
      if (roleLevel) {
        results = results.filter(r => {
          const tier = this.getApprovalTier(r.requestValue);
          return tier.level === roleLevel || r.currentLevel + 1 === roleLevel;
        });
      }
    }

    return results;
  }

  async getApprovalHistory(referenceId: string): Promise<ApprovalRequest[]> {
    return this.approvalRequests.filter(r => r.referenceId === referenceId);
  }

  validateDiscountApproval(discount: number, margin: number): {
    isValid: boolean;
    requiredLevel: number;
    requiredRole: string;
    message: string;
  } {
    // Check minimum margin first
    if (margin < this.thresholds.margin.minimumThreshold) {
      return {
        isValid: false,
        requiredLevel: 4,
        requiredRole: 'CFO',
        message: `Margin ${(margin * 100).toFixed(1)}% is below minimum threshold of ${(this.thresholds.margin.minimumThreshold * 100)}%`,
      };
    }

    // Determine required level based on discount
    let requiredLevel = 1;
    let requiredRole = 'SALES_MANAGER';

    if (discount > this.thresholds.discount.level3) {
      requiredLevel = 4;
      requiredRole = 'CEO';
    } else if (discount > this.thresholds.discount.level2) {
      requiredLevel = 3;
      requiredRole = 'CFO';
    } else if (discount > this.thresholds.discount.level1) {
      requiredLevel = 2;
      requiredRole = 'REGIONAL_HEAD';
    }

    return {
      isValid: true,
      requiredLevel,
      requiredRole,
      message: `Discount of ${(discount * 100).toFixed(1)}% requires ${requiredRole} approval`,
    };
  }
}
