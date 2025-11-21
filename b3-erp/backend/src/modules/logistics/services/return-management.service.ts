import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type ReturnType = 'customer_return' | 'vendor_return' | 'internal_transfer' | 'rto' | 'exchange';
export type ReturnStatus = 'initiated' | 'approved' | 'in_transit' | 'received' | 'inspected' | 'processed' | 'closed' | 'rejected';
export type ReturnReason = 'defective' | 'wrong_item' | 'damaged' | 'not_as_described' | 'change_of_mind' | 'duplicate' | 'quality_issue' | 'other';
export type DispositionAction = 'restock' | 'repair' | 'scrap' | 'return_to_vendor' | 'resale' | 'donate';

export interface ReturnRequest {
  id: string;
  returnNumber: string;
  type: ReturnType;
  status: ReturnStatus;
  originalDocumentType: 'sales_order' | 'purchase_order' | 'delivery_note';
  originalDocumentNumber: string;
  customerId?: string;
  customerName?: string;
  vendorId?: string;
  vendorName?: string;
  requestDate: string;
  reason: ReturnReason;
  reasonDetails?: string;
  items: ReturnItem[];
  totalValue: number;
  refundAmount?: number;
  refundMethod?: 'credit_note' | 'bank_transfer' | 'original_method' | 'store_credit';
  pickupRequired: boolean;
  pickupAddress?: string;
  pickupDate?: string;
  receivedDate?: string;
  inspectionDate?: string;
  processedDate?: string;
  approvedBy?: string;
  inspectedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  returnQuantity: number;
  originalQuantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  reason: ReturnReason;
  condition: 'new' | 'good' | 'fair' | 'damaged' | 'unusable';
  inspectionResult?: InspectionResult;
  disposition?: DispositionAction;
  dispositionNotes?: string;
  restockLocation?: string;
}

export interface InspectionResult {
  inspectedBy: string;
  inspectedDate: string;
  passed: boolean;
  findings: string;
  recommendedDisposition: DispositionAction;
  photos?: string[];
}

export interface ReturnPolicy {
  id: string;
  name: string;
  returnWindow: number; // days
  conditions: string[];
  exemptions: string[];
  restockingFee: number; // percentage
  requiresApproval: boolean;
  approvalThreshold: number;
  isActive: boolean;
}

export interface ReturnAnalytics {
  totalReturns: number;
  returnRate: number;
  totalValue: number;
  byReason: Record<string, { count: number; value: number }>;
  byDisposition: Record<string, number>;
  avgProcessingTime: number;
  customerSatisfaction: number;
}

@Injectable()
export class ReturnManagementService {
  private returns: ReturnRequest[] = [];
  private policies: ReturnPolicy[] = [];
  private returnCounter = 1000;

  constructor() {
    this.seedMockData();
  }

  async createReturn(
    type: ReturnType,
    originalDocumentType: ReturnRequest['originalDocumentType'],
    originalDocumentNumber: string,
    items: Omit<ReturnItem, 'id' | 'inspectionResult' | 'disposition'>[],
    reason: ReturnReason,
    reasonDetails?: string,
    customerId?: string,
    customerName?: string,
    vendorId?: string,
    vendorName?: string
  ): Promise<ReturnRequest> {
    const returnItems: ReturnItem[] = items.map(item => ({
      ...item,
      id: uuidv4(),
      totalPrice: item.returnQuantity * item.unitPrice,
    }));

    const totalValue = returnItems.reduce((sum, i) => sum + i.totalPrice, 0);

    // Check if approval required
    const policy = this.policies.find(p => p.isActive);
    const requiresApproval = policy && totalValue > policy.approvalThreshold;

    const returnRequest: ReturnRequest = {
      id: uuidv4(),
      returnNumber: `RET-${++this.returnCounter}`,
      type,
      status: requiresApproval ? 'initiated' : 'approved',
      originalDocumentType,
      originalDocumentNumber,
      customerId,
      customerName,
      vendorId,
      vendorName,
      requestDate: new Date().toISOString().split('T')[0],
      reason,
      reasonDetails,
      items: returnItems,
      totalValue,
      pickupRequired: type === 'customer_return',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.returns.push(returnRequest);
    return returnRequest;
  }

  async approveReturn(returnId: string, approvedBy: string): Promise<ReturnRequest> {
    const returnRequest = this.returns.find(r => r.id === returnId);
    if (!returnRequest) throw new Error(`Return ${returnId} not found`);

    returnRequest.status = 'approved';
    returnRequest.approvedBy = approvedBy;
    returnRequest.updatedAt = new Date().toISOString();

    return returnRequest;
  }

  async schedulePickup(returnId: string, pickupDate: string, pickupAddress: string): Promise<ReturnRequest> {
    const returnRequest = this.returns.find(r => r.id === returnId);
    if (!returnRequest) throw new Error(`Return ${returnId} not found`);

    returnRequest.pickupDate = pickupDate;
    returnRequest.pickupAddress = pickupAddress;
    returnRequest.status = 'in_transit';
    returnRequest.updatedAt = new Date().toISOString();

    return returnRequest;
  }

  async receiveReturn(returnId: string): Promise<ReturnRequest> {
    const returnRequest = this.returns.find(r => r.id === returnId);
    if (!returnRequest) throw new Error(`Return ${returnId} not found`);

    returnRequest.status = 'received';
    returnRequest.receivedDate = new Date().toISOString().split('T')[0];
    returnRequest.updatedAt = new Date().toISOString();

    return returnRequest;
  }

  async inspectItem(
    returnId: string,
    itemId: string,
    inspectedBy: string,
    passed: boolean,
    findings: string,
    recommendedDisposition: DispositionAction
  ): Promise<ReturnItem> {
    const returnRequest = this.returns.find(r => r.id === returnId);
    if (!returnRequest) throw new Error(`Return ${returnId} not found`);

    const item = returnRequest.items.find(i => i.id === itemId);
    if (!item) throw new Error(`Item ${itemId} not found`);

    item.inspectionResult = {
      inspectedBy,
      inspectedDate: new Date().toISOString(),
      passed,
      findings,
      recommendedDisposition,
    };

    // Update condition based on inspection
    if (!passed) {
      item.condition = recommendedDisposition === 'scrap' ? 'unusable' : 'damaged';
    }

    // Check if all items inspected
    const allInspected = returnRequest.items.every(i => i.inspectionResult);
    if (allInspected) {
      returnRequest.status = 'inspected';
      returnRequest.inspectionDate = new Date().toISOString().split('T')[0];
      returnRequest.inspectedBy = inspectedBy;
    }

    returnRequest.updatedAt = new Date().toISOString();
    return item;
  }

  async processDisposition(
    returnId: string,
    itemId: string,
    disposition: DispositionAction,
    notes?: string,
    restockLocation?: string
  ): Promise<ReturnItem> {
    const returnRequest = this.returns.find(r => r.id === returnId);
    if (!returnRequest) throw new Error(`Return ${returnId} not found`);

    const item = returnRequest.items.find(i => i.id === itemId);
    if (!item) throw new Error(`Item ${itemId} not found`);

    item.disposition = disposition;
    item.dispositionNotes = notes;
    if (disposition === 'restock' && restockLocation) {
      item.restockLocation = restockLocation;
    }

    // Check if all items processed
    const allProcessed = returnRequest.items.every(i => i.disposition);
    if (allProcessed) {
      returnRequest.status = 'processed';
      returnRequest.processedDate = new Date().toISOString().split('T')[0];
    }

    returnRequest.updatedAt = new Date().toISOString();
    return item;
  }

  async processRefund(
    returnId: string,
    refundMethod: ReturnRequest['refundMethod'],
    refundAmount?: number
  ): Promise<ReturnRequest> {
    const returnRequest = this.returns.find(r => r.id === returnId);
    if (!returnRequest) throw new Error(`Return ${returnId} not found`);

    // Calculate refund (may include restocking fee)
    const policy = this.policies.find(p => p.isActive);
    let calculatedRefund = refundAmount || returnRequest.totalValue;

    if (policy && policy.restockingFee > 0) {
      const fee = calculatedRefund * (policy.restockingFee / 100);
      calculatedRefund -= fee;
    }

    returnRequest.refundMethod = refundMethod;
    returnRequest.refundAmount = calculatedRefund;
    returnRequest.status = 'closed';
    returnRequest.updatedAt = new Date().toISOString();

    return returnRequest;
  }

  async getReturnsByStatus(status: ReturnStatus): Promise<ReturnRequest[]> {
    return this.returns.filter(r => r.status === status);
  }

  async getReturnsByCustomer(customerId: string): Promise<ReturnRequest[]> {
    return this.returns.filter(r => r.customerId === customerId);
  }

  async getReturnAnalytics(dateFrom?: string, dateTo?: string): Promise<ReturnAnalytics> {
    let filteredReturns = this.returns;

    if (dateFrom) {
      filteredReturns = filteredReturns.filter(r => r.requestDate >= dateFrom);
    }
    if (dateTo) {
      filteredReturns = filteredReturns.filter(r => r.requestDate <= dateTo);
    }

    const byReason: Record<string, { count: number; value: number }> = {};
    const byDisposition: Record<string, number> = {};
    let totalProcessingTime = 0;
    let processedCount = 0;

    for (const ret of filteredReturns) {
      // By reason
      if (!byReason[ret.reason]) {
        byReason[ret.reason] = { count: 0, value: 0 };
      }
      byReason[ret.reason].count++;
      byReason[ret.reason].value += ret.totalValue;

      // By disposition
      for (const item of ret.items) {
        if (item.disposition) {
          byDisposition[item.disposition] = (byDisposition[item.disposition] || 0) + 1;
        }
      }

      // Processing time
      if (ret.status === 'closed' && ret.processedDate) {
        const created = new Date(ret.requestDate);
        const processed = new Date(ret.processedDate);
        const days = Math.ceil((processed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        totalProcessingTime += days;
        processedCount++;
      }
    }

    return {
      totalReturns: filteredReturns.length,
      returnRate: 5.2, // Would calculate from sales data
      totalValue: filteredReturns.reduce((sum, r) => sum + r.totalValue, 0),
      byReason,
      byDisposition,
      avgProcessingTime: processedCount > 0 ? Math.round(totalProcessingTime / processedCount) : 0,
      customerSatisfaction: 4.1, // Would come from feedback
    };
  }

  async checkReturnEligibility(
    originalDocumentNumber: string,
    itemId: string
  ): Promise<{
    eligible: boolean;
    reason?: string;
    daysRemaining?: number;
    restockingFee?: number;
  }> {
    const policy = this.policies.find(p => p.isActive);
    if (!policy) {
      return { eligible: false, reason: 'No active return policy' };
    }

    // Mock: Would check actual document date
    const documentDate = new Date();
    documentDate.setDate(documentDate.getDate() - 10); // 10 days ago

    const daysSincePurchase = Math.ceil(
      (new Date().getTime() - documentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSincePurchase > policy.returnWindow) {
      return {
        eligible: false,
        reason: `Return window of ${policy.returnWindow} days has expired`,
      };
    }

    return {
      eligible: true,
      daysRemaining: policy.returnWindow - daysSincePurchase,
      restockingFee: policy.restockingFee,
    };
  }

  async getReturnReport(): Promise<{
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    pendingInspection: number;
    pendingProcessing: number;
    totalRefunded: number;
    avgResolutionDays: number;
  }> {
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    let totalRefunded = 0;

    for (const ret of this.returns) {
      byType[ret.type] = (byType[ret.type] || 0) + 1;
      byStatus[ret.status] = (byStatus[ret.status] || 0) + 1;
      if (ret.refundAmount) totalRefunded += ret.refundAmount;
    }

    return {
      total: this.returns.length,
      byType,
      byStatus,
      pendingInspection: this.returns.filter(r => r.status === 'received').length,
      pendingProcessing: this.returns.filter(r => r.status === 'inspected').length,
      totalRefunded,
      avgResolutionDays: 5,
    };
  }

  private seedMockData(): void {
    // Return policies
    this.policies = [
      {
        id: uuidv4(),
        name: 'Standard Return Policy',
        returnWindow: 30,
        conditions: [
          'Item must be in original packaging',
          'Item must not be used or damaged',
          'Must have proof of purchase',
        ],
        exemptions: [
          'Custom/personalized items',
          'Perishable goods',
          'Software/digital products',
        ],
        restockingFee: 10,
        requiresApproval: true,
        approvalThreshold: 10000,
        isActive: true,
      },
    ];
  }
}
