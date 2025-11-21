import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type RequisitionStatus = 'draft' | 'pending_approval' | 'approved' | 'ordered' | 'partial' | 'completed' | 'cancelled';
export type RequisitionPriority = 'low' | 'normal' | 'high' | 'urgent';
export type SourceType = 'mrp' | 'manual' | 'reorder_point' | 'production_order';

export interface MRPRequirement {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  requiredDate: string;
  requiredQuantity: number;
  availableStock: number;
  allocatedStock: number;
  shortfall: number;
  productionOrderId?: string;
  productionOrderNumber?: string;
  bomId?: string;
  leadTimeDays: number;
  preferredVendorId?: string;
  preferredVendorName?: string;
  lastPurchasePrice?: number;
}

export interface PurchaseRequisition {
  id: string;
  requisitionNumber: string;
  sourceType: SourceType;
  sourceReference?: string;
  status: RequisitionStatus;
  priority: RequisitionPriority;
  requestedBy: string;
  requestedDate: string;
  requiredDate: string;
  department?: string;
  costCenter?: string;
  lines: PurchaseRequisitionLine[];
  totalEstimatedCost: number;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseRequisitionLine {
  id: string;
  lineNumber: number;
  itemId: string;
  itemCode: string;
  itemName: string;
  description?: string;
  quantity: number;
  unit: string;
  estimatedUnitPrice: number;
  estimatedTotalPrice: number;
  requiredDate: string;
  vendorId?: string;
  vendorName?: string;
  specifications?: string;
  mrpRequirementId?: string;
  productionOrderId?: string;
}

export interface MRPRunResult {
  runId: string;
  runDate: string;
  planningHorizonDays: number;
  requirements: MRPRequirement[];
  generatedRequisitions: PurchaseRequisition[];
  totalShortfall: number;
  totalEstimatedCost: number;
  itemsProcessed: number;
  requisitionsCreated: number;
}

export interface ConsolidationRule {
  id: string;
  name: string;
  consolidateByVendor: boolean;
  consolidateByDate: boolean;
  dateToleranceDays: number;
  minimumOrderValue?: number;
  maximumLinesPerRequisition?: number;
  isActive: boolean;
}

@Injectable()
export class MRPRequisitionService {
  private requirements: MRPRequirement[] = [];
  private requisitions: PurchaseRequisition[] = [];
  private consolidationRules: ConsolidationRule[] = [];
  private requisitionCounter = 1000;

  constructor() {
    this.seedMockData();
  }

  async runMRP(planningHorizonDays: number = 30): Promise<MRPRunResult> {
    const runId = uuidv4();
    const runDate = new Date().toISOString();

    // Get all requirements within planning horizon
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + planningHorizonDays);

    const relevantRequirements = this.requirements.filter(req => {
      const reqDate = new Date(req.requiredDate);
      return reqDate <= endDate && req.shortfall > 0;
    });

    // Generate requisitions from requirements
    const generatedRequisitions = await this.generateRequisitionsFromMRP(relevantRequirements);

    // Calculate totals
    const totalShortfall = relevantRequirements.reduce((sum, r) => sum + r.shortfall, 0);
    const totalEstimatedCost = generatedRequisitions.reduce((sum, pr) => sum + pr.totalEstimatedCost, 0);

    return {
      runId,
      runDate,
      planningHorizonDays,
      requirements: relevantRequirements,
      generatedRequisitions,
      totalShortfall,
      totalEstimatedCost,
      itemsProcessed: relevantRequirements.length,
      requisitionsCreated: generatedRequisitions.length,
    };
  }

  async generateRequisitionsFromMRP(requirements: MRPRequirement[]): Promise<PurchaseRequisition[]> {
    const activeRule = this.consolidationRules.find(r => r.isActive);

    if (activeRule?.consolidateByVendor) {
      return this.generateConsolidatedByVendor(requirements, activeRule);
    }

    // Default: one requisition per requirement
    return this.generateIndividualRequisitions(requirements);
  }

  private async generateConsolidatedByVendor(
    requirements: MRPRequirement[],
    rule: ConsolidationRule
  ): Promise<PurchaseRequisition[]> {
    const vendorGroups = new Map<string, MRPRequirement[]>();

    // Group by vendor
    for (const req of requirements) {
      const vendorId = req.preferredVendorId || 'unassigned';
      if (!vendorGroups.has(vendorId)) {
        vendorGroups.set(vendorId, []);
      }
      vendorGroups.get(vendorId)!.push(req);
    }

    const requisitions: PurchaseRequisition[] = [];

    for (const [vendorId, vendorReqs] of vendorGroups) {
      // Further group by date if needed
      if (rule.consolidateByDate) {
        const dateGroups = this.groupByDateTolerance(vendorReqs, rule.dateToleranceDays);
        for (const dateReqs of dateGroups) {
          const pr = this.createRequisitionFromRequirements(dateReqs, 'mrp');
          requisitions.push(pr);
          this.requisitions.push(pr);
        }
      } else {
        const pr = this.createRequisitionFromRequirements(vendorReqs, 'mrp');
        requisitions.push(pr);
        this.requisitions.push(pr);
      }
    }

    return requisitions;
  }

  private groupByDateTolerance(requirements: MRPRequirement[], toleranceDays: number): MRPRequirement[][] {
    const sorted = [...requirements].sort((a, b) =>
      new Date(a.requiredDate).getTime() - new Date(b.requiredDate).getTime()
    );

    const groups: MRPRequirement[][] = [];
    let currentGroup: MRPRequirement[] = [];
    let groupStartDate: Date | null = null;

    for (const req of sorted) {
      const reqDate = new Date(req.requiredDate);

      if (!groupStartDate || this.daysDifference(groupStartDate, reqDate) <= toleranceDays) {
        if (!groupStartDate) groupStartDate = reqDate;
        currentGroup.push(req);
      } else {
        if (currentGroup.length > 0) groups.push(currentGroup);
        currentGroup = [req];
        groupStartDate = reqDate;
      }
    }

    if (currentGroup.length > 0) groups.push(currentGroup);
    return groups;
  }

  private daysDifference(date1: Date, date2: Date): number {
    return Math.abs(Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)));
  }

  private async generateIndividualRequisitions(requirements: MRPRequirement[]): Promise<PurchaseRequisition[]> {
    const requisitions: PurchaseRequisition[] = [];

    for (const req of requirements) {
      const pr = this.createRequisitionFromRequirements([req], 'mrp');
      requisitions.push(pr);
      this.requisitions.push(pr);
    }

    return requisitions;
  }

  private createRequisitionFromRequirements(
    requirements: MRPRequirement[],
    sourceType: SourceType
  ): PurchaseRequisition {
    const lines: PurchaseRequisitionLine[] = requirements.map((req, index) => ({
      id: uuidv4(),
      lineNumber: index + 1,
      itemId: req.itemId,
      itemCode: req.itemCode,
      itemName: req.itemName,
      quantity: req.shortfall,
      unit: 'Nos',
      estimatedUnitPrice: req.lastPurchasePrice || 0,
      estimatedTotalPrice: req.shortfall * (req.lastPurchasePrice || 0),
      requiredDate: req.requiredDate,
      vendorId: req.preferredVendorId,
      vendorName: req.preferredVendorName,
      mrpRequirementId: req.id,
      productionOrderId: req.productionOrderId,
    }));

    const earliestDate = requirements.reduce((earliest, req) => {
      const reqDate = new Date(req.requiredDate);
      return reqDate < earliest ? reqDate : earliest;
    }, new Date(requirements[0].requiredDate));

    const pr: PurchaseRequisition = {
      id: uuidv4(),
      requisitionNumber: `PR-${++this.requisitionCounter}`,
      sourceType,
      sourceReference: requirements[0].productionOrderNumber,
      status: 'pending_approval',
      priority: this.calculatePriority(requirements),
      requestedBy: 'MRP System',
      requestedDate: new Date().toISOString().split('T')[0],
      requiredDate: earliestDate.toISOString().split('T')[0],
      lines,
      totalEstimatedCost: lines.reduce((sum, l) => sum + l.estimatedTotalPrice, 0),
      approvalStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return pr;
  }

  private calculatePriority(requirements: MRPRequirement[]): RequisitionPriority {
    const now = new Date();
    const minLeadTime = Math.min(...requirements.map(r => {
      const reqDate = new Date(r.requiredDate);
      const daysUntilRequired = Math.ceil((reqDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilRequired - r.leadTimeDays;
    }));

    if (minLeadTime < 0) return 'urgent';
    if (minLeadTime <= 3) return 'high';
    if (minLeadTime <= 7) return 'normal';
    return 'low';
  }

  async createManualRequisition(
    lines: Omit<PurchaseRequisitionLine, 'id' | 'lineNumber'>[],
    requestedBy: string,
    requiredDate: string,
    priority: RequisitionPriority = 'normal',
    notes?: string
  ): Promise<PurchaseRequisition> {
    const prLines: PurchaseRequisitionLine[] = lines.map((line, index) => ({
      ...line,
      id: uuidv4(),
      lineNumber: index + 1,
      estimatedTotalPrice: line.quantity * line.estimatedUnitPrice,
    }));

    const pr: PurchaseRequisition = {
      id: uuidv4(),
      requisitionNumber: `PR-${++this.requisitionCounter}`,
      sourceType: 'manual',
      status: 'pending_approval',
      priority,
      requestedBy,
      requestedDate: new Date().toISOString().split('T')[0],
      requiredDate,
      lines: prLines,
      totalEstimatedCost: prLines.reduce((sum, l) => sum + l.estimatedTotalPrice, 0),
      approvalStatus: 'pending',
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.requisitions.push(pr);
    return pr;
  }

  async approveRequisition(id: string, approvedBy: string): Promise<PurchaseRequisition> {
    const pr = this.requisitions.find(r => r.id === id);
    if (!pr) throw new Error(`Requisition ${id} not found`);

    pr.approvalStatus = 'approved';
    pr.status = 'approved';
    pr.approvedBy = approvedBy;
    pr.approvedDate = new Date().toISOString();
    pr.updatedAt = new Date().toISOString();

    return pr;
  }

  async rejectRequisition(id: string, rejectedBy: string, reason: string): Promise<PurchaseRequisition> {
    const pr = this.requisitions.find(r => r.id === id);
    if (!pr) throw new Error(`Requisition ${id} not found`);

    pr.approvalStatus = 'rejected';
    pr.status = 'cancelled';
    pr.notes = `Rejected by ${rejectedBy}: ${reason}`;
    pr.updatedAt = new Date().toISOString();

    return pr;
  }

  async convertToPurchaseOrder(requisitionId: string): Promise<string> {
    const pr = this.requisitions.find(r => r.id === requisitionId);
    if (!pr) throw new Error(`Requisition ${requisitionId} not found`);
    if (pr.approvalStatus !== 'approved') {
      throw new Error('Requisition must be approved before conversion to PO');
    }

    // In production, this would create actual PO
    const poNumber = `PO-${Date.now()}`;
    pr.status = 'ordered';
    pr.updatedAt = new Date().toISOString();

    return poNumber;
  }

  async getRequisitionsByStatus(status: RequisitionStatus): Promise<PurchaseRequisition[]> {
    return this.requisitions.filter(r => r.status === status);
  }

  async getPendingApprovals(): Promise<PurchaseRequisition[]> {
    return this.requisitions.filter(r => r.approvalStatus === 'pending');
  }

  async getRequisitionSummary(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    totalValue: number;
    urgentCount: number;
  }> {
    const byStatus: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    let totalValue = 0;
    let urgentCount = 0;

    for (const pr of this.requisitions) {
      byStatus[pr.status] = (byStatus[pr.status] || 0) + 1;
      byPriority[pr.priority] = (byPriority[pr.priority] || 0) + 1;
      totalValue += pr.totalEstimatedCost;
      if (pr.priority === 'urgent') urgentCount++;
    }

    return {
      total: this.requisitions.length,
      byStatus,
      byPriority,
      totalValue,
      urgentCount,
    };
  }

  async updateConsolidationRule(rule: Partial<ConsolidationRule> & { id: string }): Promise<ConsolidationRule> {
    const existing = this.consolidationRules.find(r => r.id === rule.id);
    if (!existing) throw new Error(`Rule ${rule.id} not found`);

    Object.assign(existing, rule);
    return existing;
  }

  private seedMockData(): void {
    // Sample MRP requirements
    this.requirements = [
      {
        id: uuidv4(),
        itemId: 'item-001',
        itemCode: 'RM-001',
        itemName: 'Steel Sheet 2mm',
        requiredDate: this.addDays(7),
        requiredQuantity: 500,
        availableStock: 200,
        allocatedStock: 100,
        shortfall: 400,
        productionOrderId: 'wo-001',
        productionOrderNumber: 'WO-2024-001',
        leadTimeDays: 7,
        preferredVendorId: 'vendor-001',
        preferredVendorName: 'Steel Corp',
        lastPurchasePrice: 85,
      },
      {
        id: uuidv4(),
        itemId: 'item-002',
        itemCode: 'CP-001',
        itemName: 'Electronic Controller',
        requiredDate: this.addDays(14),
        requiredQuantity: 100,
        availableStock: 30,
        allocatedStock: 20,
        shortfall: 90,
        productionOrderId: 'wo-002',
        productionOrderNumber: 'WO-2024-002',
        leadTimeDays: 14,
        preferredVendorId: 'vendor-002',
        preferredVendorName: 'Electronics Plus',
        lastPurchasePrice: 2500,
      },
      {
        id: uuidv4(),
        itemId: 'item-003',
        itemCode: 'RM-002',
        itemName: 'Aluminum Bar',
        requiredDate: this.addDays(10),
        requiredQuantity: 200,
        availableStock: 50,
        allocatedStock: 50,
        shortfall: 200,
        productionOrderId: 'wo-001',
        productionOrderNumber: 'WO-2024-001',
        leadTimeDays: 5,
        preferredVendorId: 'vendor-001',
        preferredVendorName: 'Steel Corp',
        lastPurchasePrice: 120,
      },
    ];

    // Consolidation rules
    this.consolidationRules = [
      {
        id: uuidv4(),
        name: 'Vendor Consolidation',
        consolidateByVendor: true,
        consolidateByDate: true,
        dateToleranceDays: 3,
        minimumOrderValue: 5000,
        maximumLinesPerRequisition: 50,
        isActive: true,
      },
    ];
  }

  private addDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }
}
