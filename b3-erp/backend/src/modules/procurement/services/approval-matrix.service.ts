import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type ApprovalDocumentType = 'purchase_requisition' | 'purchase_order' | 'rfq' | 'contract' | 'invoice';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'delegated' | 'escalated' | 'auto_approved';

export interface ApprovalTier {
  id: string;
  level: number;
  name: string;
  minAmount: number;
  maxAmount: number;
  approvers: ApproverConfig[];
  slaHours: number;
  escalationAfterHours: number;
  requiresSequential: boolean; // If true, approvers must approve in order
  minimumApprovers: number; // Minimum approvers needed for consensus
}

export interface ApproverConfig {
  userId: string;
  userName: string;
  role: string;
  department?: string;
  isMandatory: boolean;
  canDelegate: boolean;
  delegateTo?: string[];
}

export interface ApprovalRule {
  id: string;
  name: string;
  documentType: ApprovalDocumentType;
  isActive: boolean;
  tiers: ApprovalTier[];
  conditions?: ApprovalCondition[];
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in';
  value: any;
  additionalApprovers?: string[];
  skipApprovers?: string[];
}

export interface ApprovalRequest {
  id: string;
  documentType: ApprovalDocumentType;
  documentId: string;
  documentNumber: string;
  amount: number;
  currency: string;
  requesterId: string;
  requesterName: string;
  department: string;
  description: string;
  lineItems?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  attachments?: string[];

  // Approval Details
  tierId: string;
  tierName: string;
  currentLevel: number;
  approvalChain: ApprovalChainItem[];
  status: ApprovalStatus;

  // Dates
  requestedAt: string;
  dueAt: string;
  completedAt?: string;

  // Comments
  comments: ApprovalComment[];

  // Budget
  budgetCode?: string;
  budgetAvailable?: number;
  costCenter?: string;
}

export interface ApprovalChainItem {
  level: number;
  approverId: string;
  approverName: string;
  approverRole: string;
  status: ApprovalStatus;
  isMandatory: boolean;
  delegatedFromId?: string;
  delegatedFromName?: string;
  actionAt?: string;
  comment?: string;
}

export interface ApprovalComment {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  createdAt: string;
  isInternal: boolean;
}

export interface Delegation {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  startDate: string;
  endDate: string;
  documentTypes: ApprovalDocumentType[];
  maxAmount?: number;
  reason: string;
  isActive: boolean;
}

@Injectable()
export class ApprovalMatrixService {
  private approvalRules: ApprovalRule[] = [];
  private approvalRequests: ApprovalRequest[] = [];
  private delegations: Delegation[] = [];

  constructor() {
    this.initializeDefaultRules();
  }

  // Rule Management
  async createApprovalRule(rule: Partial<ApprovalRule>): Promise<ApprovalRule> {
    const newRule: ApprovalRule = {
      id: uuidv4(),
      name: rule.name || '',
      documentType: rule.documentType || 'purchase_requisition',
      isActive: rule.isActive ?? true,
      tiers: rule.tiers || [],
      conditions: rule.conditions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Validate tier amounts don't overlap
    this.validateTiers(newRule.tiers);

    this.approvalRules.push(newRule);
    return newRule;
  }

  async getApprovalRule(documentType: ApprovalDocumentType): Promise<ApprovalRule | null> {
    return this.approvalRules.find(r => r.documentType === documentType && r.isActive) || null;
  }

  async updateApprovalRule(id: string, updates: Partial<ApprovalRule>): Promise<ApprovalRule> {
    const index = this.approvalRules.findIndex(r => r.id === id);
    if (index === -1) {
      throw new NotFoundException(`Approval rule ${id} not found`);
    }

    if (updates.tiers) {
      this.validateTiers(updates.tiers);
    }

    this.approvalRules[index] = {
      ...this.approvalRules[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return this.approvalRules[index];
  }

  // Approval Request Management
  async createApprovalRequest(request: Partial<ApprovalRequest>): Promise<ApprovalRequest> {
    const documentType = request.documentType || 'purchase_requisition';
    const amount = request.amount || 0;

    // Get applicable rule and tier
    const rule = await this.getApprovalRule(documentType);
    if (!rule) {
      throw new BadRequestException(`No approval rule configured for ${documentType}`);
    }

    const tier = this.getApplicableTier(rule, amount);
    if (!tier) {
      throw new BadRequestException(`No approval tier found for amount ${amount}`);
    }

    // Build approval chain
    const approvalChain = await this.buildApprovalChain(tier, request.requesterId || '');

    // Check for auto-approval (if requester is the approver and amount is below threshold)
    const canAutoApprove = amount <= 10000 && approvalChain.length === 1 &&
      approvalChain[0].approverId === request.requesterId;

    const approvalRequest: ApprovalRequest = {
      id: uuidv4(),
      documentType,
      documentId: request.documentId || '',
      documentNumber: request.documentNumber || '',
      amount,
      currency: request.currency || 'INR',
      requesterId: request.requesterId || '',
      requesterName: request.requesterName || '',
      department: request.department || '',
      description: request.description || '',
      lineItems: request.lineItems,
      attachments: request.attachments,
      tierId: tier.id,
      tierName: tier.name,
      currentLevel: 1,
      approvalChain,
      status: canAutoApprove ? 'auto_approved' : 'pending',
      requestedAt: new Date().toISOString(),
      dueAt: this.calculateDueDate(tier.slaHours),
      completedAt: canAutoApprove ? new Date().toISOString() : undefined,
      comments: [],
      budgetCode: request.budgetCode,
      budgetAvailable: request.budgetAvailable,
      costCenter: request.costCenter,
    };

    if (canAutoApprove) {
      approvalChain[0].status = 'auto_approved';
      approvalChain[0].actionAt = new Date().toISOString();
      approvalChain[0].comment = 'Auto-approved - amount within self-approval limit';
    }

    this.approvalRequests.push(approvalRequest);
    return approvalRequest;
  }

  async getApprovalRequest(id: string): Promise<ApprovalRequest> {
    const request = this.approvalRequests.find(r => r.id === id);
    if (!request) {
      throw new NotFoundException(`Approval request ${id} not found`);
    }
    return request;
  }

  async approve(
    requestId: string,
    approverId: string,
    comment?: string
  ): Promise<ApprovalRequest> {
    const request = await this.getApprovalRequest(requestId);

    if (request.status !== 'pending') {
      throw new BadRequestException('Approval request is not pending');
    }

    // Find the current pending approval in chain
    const chainItem = request.approvalChain.find(
      item => (item.approverId === approverId || this.isDelegatedTo(item.approverId, approverId))
        && item.status === 'pending'
    );

    if (!chainItem) {
      throw new BadRequestException('User is not authorized to approve this request');
    }

    // Check if it's a delegation
    if (chainItem.approverId !== approverId) {
      chainItem.delegatedFromId = chainItem.approverId;
      chainItem.delegatedFromName = chainItem.approverName;
      const delegation = this.getActiveDelegation(chainItem.approverId, approverId);
      if (delegation) {
        chainItem.approverId = delegation.toUserId;
        chainItem.approverName = delegation.toUserName;
      }
    }

    chainItem.status = 'approved';
    chainItem.actionAt = new Date().toISOString();
    chainItem.comment = comment;

    // Check if all approvals are complete
    const allApproved = request.approvalChain.every(
      item => item.status === 'approved' || item.status === 'auto_approved'
    );

    if (allApproved) {
      request.status = 'approved';
      request.completedAt = new Date().toISOString();
    } else {
      // Move to next level if sequential
      const rule = await this.getApprovalRule(request.documentType);
      const tier = rule?.tiers.find(t => t.id === request.tierId);
      if (tier?.requiresSequential) {
        request.currentLevel++;
      }
    }

    return request;
  }

  async reject(
    requestId: string,
    approverId: string,
    reason: string
  ): Promise<ApprovalRequest> {
    const request = await this.getApprovalRequest(requestId);

    if (request.status !== 'pending') {
      throw new BadRequestException('Approval request is not pending');
    }

    const chainItem = request.approvalChain.find(
      item => (item.approverId === approverId || this.isDelegatedTo(item.approverId, approverId))
        && item.status === 'pending'
    );

    if (!chainItem) {
      throw new BadRequestException('User is not authorized to reject this request');
    }

    chainItem.status = 'rejected';
    chainItem.actionAt = new Date().toISOString();
    chainItem.comment = reason;

    request.status = 'rejected';
    request.completedAt = new Date().toISOString();

    return request;
  }

  async escalate(requestId: string, escalatedBy: string, reason: string): Promise<ApprovalRequest> {
    const request = await this.getApprovalRequest(requestId);

    if (request.status !== 'pending') {
      throw new BadRequestException('Cannot escalate non-pending request');
    }

    // Add escalation to next tier
    const rule = await this.getApprovalRule(request.documentType);
    if (!rule) {
      throw new BadRequestException('No approval rule found');
    }

    const currentTierIndex = rule.tiers.findIndex(t => t.id === request.tierId);
    if (currentTierIndex < rule.tiers.length - 1) {
      const nextTier = rule.tiers[currentTierIndex + 1];

      // Add new approvers from next tier
      for (const approverConfig of nextTier.approvers) {
        request.approvalChain.push({
          level: nextTier.level,
          approverId: approverConfig.userId,
          approverName: approverConfig.userName,
          approverRole: approverConfig.role,
          status: 'pending',
          isMandatory: true,
        });
      }

      request.tierId = nextTier.id;
      request.tierName = nextTier.name;
      request.status = 'escalated';
    }

    request.comments.push({
      id: uuidv4(),
      userId: escalatedBy,
      userName: 'System',
      comment: `Escalated: ${reason}`,
      createdAt: new Date().toISOString(),
      isInternal: true,
    });

    return request;
  }

  async addComment(
    requestId: string,
    userId: string,
    userName: string,
    comment: string,
    isInternal: boolean = false
  ): Promise<ApprovalComment> {
    const request = await this.getApprovalRequest(requestId);

    const newComment: ApprovalComment = {
      id: uuidv4(),
      userId,
      userName,
      comment,
      createdAt: new Date().toISOString(),
      isInternal,
    };

    request.comments.push(newComment);
    return newComment;
  }

  // Delegation Management
  async createDelegation(delegation: Partial<Delegation>): Promise<Delegation> {
    const newDelegation: Delegation = {
      id: uuidv4(),
      fromUserId: delegation.fromUserId || '',
      fromUserName: delegation.fromUserName || '',
      toUserId: delegation.toUserId || '',
      toUserName: delegation.toUserName || '',
      startDate: delegation.startDate || new Date().toISOString(),
      endDate: delegation.endDate || '',
      documentTypes: delegation.documentTypes || ['purchase_requisition', 'purchase_order'],
      maxAmount: delegation.maxAmount,
      reason: delegation.reason || '',
      isActive: true,
    };

    this.delegations.push(newDelegation);
    return newDelegation;
  }

  async revokeDelegation(delegationId: string): Promise<void> {
    const delegation = this.delegations.find(d => d.id === delegationId);
    if (delegation) {
      delegation.isActive = false;
    }
  }

  async getActiveDelegationsForUser(userId: string): Promise<Delegation[]> {
    const now = new Date();
    return this.delegations.filter(d =>
      d.fromUserId === userId &&
      d.isActive &&
      new Date(d.startDate) <= now &&
      new Date(d.endDate) >= now
    );
  }

  // Query Methods
  async getPendingApprovalsForUser(userId: string): Promise<ApprovalRequest[]> {
    return this.approvalRequests.filter(request => {
      if (request.status !== 'pending') return false;

      return request.approvalChain.some(item =>
        (item.approverId === userId || this.isDelegatedTo(item.approverId, userId)) &&
        item.status === 'pending'
      );
    });
  }

  async getMyApprovalRequests(requesterId: string): Promise<ApprovalRequest[]> {
    return this.approvalRequests.filter(r => r.requesterId === requesterId);
  }

  async getApprovalHistory(documentType?: ApprovalDocumentType): Promise<ApprovalRequest[]> {
    let result = this.approvalRequests.filter(r =>
      ['approved', 'rejected'].includes(r.status)
    );

    if (documentType) {
      result = result.filter(r => r.documentType === documentType);
    }

    return result.sort((a, b) =>
      new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()
    );
  }

  async getOverdueApprovals(): Promise<ApprovalRequest[]> {
    const now = new Date();
    return this.approvalRequests.filter(r =>
      r.status === 'pending' && new Date(r.dueAt) < now
    );
  }

  async getStatistics(): Promise<{
    total: number;
    byStatus: Record<ApprovalStatus, number>;
    byDocumentType: Record<ApprovalDocumentType, number>;
    averageApprovalTime: number;
    slaCompliance: number;
    pendingByTier: Record<string, number>;
  }> {
    const byStatus: Record<ApprovalStatus, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
      delegated: 0,
      escalated: 0,
      auto_approved: 0,
    };

    const byDocumentType: Record<ApprovalDocumentType, number> = {
      purchase_requisition: 0,
      purchase_order: 0,
      rfq: 0,
      contract: 0,
      invoice: 0,
    };

    const pendingByTier: Record<string, number> = {};
    let totalApprovalTime = 0;
    let completedCount = 0;
    let withinSLA = 0;

    for (const request of this.approvalRequests) {
      byStatus[request.status]++;
      byDocumentType[request.documentType]++;

      if (request.status === 'pending') {
        pendingByTier[request.tierName] = (pendingByTier[request.tierName] || 0) + 1;
      }

      if (request.completedAt) {
        const approvalTime = (
          new Date(request.completedAt).getTime() - new Date(request.requestedAt).getTime()
        ) / (1000 * 60 * 60);
        totalApprovalTime += approvalTime;
        completedCount++;

        if (new Date(request.completedAt) <= new Date(request.dueAt)) {
          withinSLA++;
        }
      }
    }

    return {
      total: this.approvalRequests.length,
      byStatus,
      byDocumentType,
      averageApprovalTime: completedCount > 0
        ? Math.round(totalApprovalTime / completedCount)
        : 0,
      slaCompliance: completedCount > 0
        ? Math.round((withinSLA / completedCount) * 100)
        : 100,
      pendingByTier,
    };
  }

  // Helper Methods
  private validateTiers(tiers: ApprovalTier[]): void {
    // Sort by minAmount
    const sorted = [...tiers].sort((a, b) => a.minAmount - b.minAmount);

    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].maxAmount > sorted[i + 1].minAmount) {
        throw new BadRequestException('Approval tier amounts cannot overlap');
      }
    }
  }

  private getApplicableTier(rule: ApprovalRule, amount: number): ApprovalTier | null {
    return rule.tiers.find(tier =>
      amount >= tier.minAmount && amount <= tier.maxAmount
    ) || null;
  }

  private async buildApprovalChain(tier: ApprovalTier, requesterId: string): Promise<ApprovalChainItem[]> {
    const chain: ApprovalChainItem[] = [];

    for (const approverConfig of tier.approvers) {
      // Skip if requester is also the approver (unless they're the only one)
      if (approverConfig.userId === requesterId && tier.approvers.length > 1) {
        continue;
      }

      chain.push({
        level: tier.level,
        approverId: approverConfig.userId,
        approverName: approverConfig.userName,
        approverRole: approverConfig.role,
        status: 'pending',
        isMandatory: approverConfig.isMandatory,
      });
    }

    return chain;
  }

  private isDelegatedTo(fromUserId: string, toUserId: string): boolean {
    const now = new Date();
    return this.delegations.some(d =>
      d.fromUserId === fromUserId &&
      d.toUserId === toUserId &&
      d.isActive &&
      new Date(d.startDate) <= now &&
      new Date(d.endDate) >= now
    );
  }

  private getActiveDelegation(fromUserId: string, toUserId: string): Delegation | undefined {
    const now = new Date();
    return this.delegations.find(d =>
      d.fromUserId === fromUserId &&
      d.toUserId === toUserId &&
      d.isActive &&
      new Date(d.startDate) <= now &&
      new Date(d.endDate) >= now
    );
  }

  private calculateDueDate(slaHours: number): string {
    const date = new Date();
    date.setHours(date.getHours() + slaHours);
    return date.toISOString();
  }

  private initializeDefaultRules(): void {
    // Purchase Requisition Approval Rule
    const prRule: ApprovalRule = {
      id: uuidv4(),
      name: 'Purchase Requisition Approval',
      documentType: 'purchase_requisition',
      isActive: true,
      tiers: [
        {
          id: uuidv4(),
          level: 1,
          name: 'Self Approval',
          minAmount: 0,
          maxAmount: 10000,
          approvers: [
            {
              userId: 'self',
              userName: 'Requester',
              role: 'Requester',
              isMandatory: true,
              canDelegate: false,
            },
          ],
          slaHours: 4,
          escalationAfterHours: 8,
          requiresSequential: false,
          minimumApprovers: 1,
        },
        {
          id: uuidv4(),
          level: 2,
          name: 'Department Manager',
          minAmount: 10001,
          maxAmount: 100000,
          approvers: [
            {
              userId: 'dept-manager',
              userName: 'Department Manager',
              role: 'Manager',
              isMandatory: true,
              canDelegate: true,
              delegateTo: ['asst-manager'],
            },
          ],
          slaHours: 8,
          escalationAfterHours: 16,
          requiresSequential: false,
          minimumApprovers: 1,
        },
        {
          id: uuidv4(),
          level: 3,
          name: 'Senior Management',
          minAmount: 100001,
          maxAmount: 500000,
          approvers: [
            {
              userId: 'dept-manager',
              userName: 'Department Manager',
              role: 'Manager',
              isMandatory: true,
              canDelegate: true,
            },
            {
              userId: 'procurement-head',
              userName: 'Procurement Head',
              role: 'Head of Procurement',
              isMandatory: true,
              canDelegate: true,
            },
          ],
          slaHours: 24,
          escalationAfterHours: 48,
          requiresSequential: true,
          minimumApprovers: 2,
        },
        {
          id: uuidv4(),
          level: 4,
          name: 'Director Approval',
          minAmount: 500001,
          maxAmount: 2000000,
          approvers: [
            {
              userId: 'procurement-head',
              userName: 'Procurement Head',
              role: 'Head of Procurement',
              isMandatory: true,
              canDelegate: false,
            },
            {
              userId: 'finance-director',
              userName: 'Finance Director',
              role: 'Director',
              isMandatory: true,
              canDelegate: false,
            },
          ],
          slaHours: 48,
          escalationAfterHours: 72,
          requiresSequential: true,
          minimumApprovers: 2,
        },
        {
          id: uuidv4(),
          level: 5,
          name: 'Executive Approval',
          minAmount: 2000001,
          maxAmount: 999999999,
          approvers: [
            {
              userId: 'cfo',
              userName: 'Chief Financial Officer',
              role: 'CFO',
              isMandatory: true,
              canDelegate: false,
            },
            {
              userId: 'ceo',
              userName: 'Chief Executive Officer',
              role: 'CEO',
              isMandatory: true,
              canDelegate: false,
            },
          ],
          slaHours: 72,
          escalationAfterHours: 96,
          requiresSequential: true,
          minimumApprovers: 2,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.approvalRules.push(prRule);

    // Purchase Order Approval Rule (similar structure)
    const poRule: ApprovalRule = {
      ...prRule,
      id: uuidv4(),
      name: 'Purchase Order Approval',
      documentType: 'purchase_order',
    };

    this.approvalRules.push(poRule);

    // Contract Approval Rule
    const contractRule: ApprovalRule = {
      ...prRule,
      id: uuidv4(),
      name: 'Contract Approval',
      documentType: 'contract',
      tiers: prRule.tiers.map(tier => ({
        ...tier,
        id: uuidv4(),
        slaHours: tier.slaHours * 2, // Contracts take longer
        escalationAfterHours: tier.escalationAfterHours * 2,
      })),
    };

    this.approvalRules.push(contractRule);
  }
}
