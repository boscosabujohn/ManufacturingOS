import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { EventBusService } from '../../workflow/services/event-bus.service';
import { WorkflowEventType } from '../../workflow/events/event-types';

export enum MatchingStatus {
  NOT_MATCHED = 'not_matched',
  TWO_WAY_MATCHED = 'two_way_matched',
  THREE_WAY_MATCHED = 'three_way_matched',
  QUANTITY_MISMATCH = 'quantity_mismatch',
  PRICE_MISMATCH = 'price_mismatch',
  AMOUNT_MISMATCH = 'amount_mismatch',
  TOLERANCE_EXCEEDED = 'tolerance_exceeded',
  EXCEPTION = 'exception',
}

export interface MatchingVariance {
  itemId: string;
  itemCode: string;
  itemName: string;
  varianceType: 'QUANTITY' | 'PRICE' | 'AMOUNT';
  poValue: number;
  grnValue: number;
  invoiceValue: number;
  variance: number;
  variancePercentage: number;
  toleranceExceeded: boolean;
  toleranceLimit: number;
}

export interface MatchingResult {
  matchingId: string;
  invoiceId: string;
  invoiceNumber: string;
  purchaseOrderId: string;
  poNumber: string;
  goodsReceiptIds: string[];
  grnNumbers: string[];
  matchingStatus: MatchingStatus;
  isMatched: boolean;
  matchedAt: string;
  variances: MatchingVariance[];
  exceptions: string[];
  totalPOAmount: number;
  totalGRNAmount: number;
  totalInvoiceAmount: number;
  netVariance: number;
  requiresApproval: boolean;
  approvalReason?: string;
}

export interface MatchingTolerance {
  quantityTolerance: number; // Percentage
  priceTolerance: number; // Percentage
  amountTolerance: number; // Percentage
  maxAbsoluteVariance: number; // Maximum absolute variance allowed
}

export interface POData {
  id: string;
  poNumber: string;
  vendorId: string;
  items: Array<{
    itemId: string;
    itemCode: string;
    itemName: string;
    orderedQuantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  totalAmount: number;
}

export interface GRNData {
  id: string;
  grnNumber: string;
  purchaseOrderId: string;
  items: Array<{
    itemId: string;
    itemCode: string;
    itemName: string;
    receivedQuantity: number;
    acceptedQuantity: number;
    rejectedQuantity: number;
  }>;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  vendorInvoiceNumber: string;
  purchaseOrderId: string;
  items: Array<{
    itemId: string;
    itemCode: string;
    itemName: string;
    invoicedQuantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
}

@Injectable()
export class ThreeWayMatchingService {
  private matchingResults: MatchingResult[] = [];

  private readonly defaultTolerances: MatchingTolerance = {
    quantityTolerance: 0.02, // 2%
    priceTolerance: 0.05, // 5%
    amountTolerance: 0.03, // 3%
    maxAbsoluteVariance: 10000, // INR 10,000
  };

  constructor(private readonly eventBusService: EventBusService) { }

  async performThreeWayMatching(
    invoice: InvoiceData,
    po: POData,
    grns: GRNData[],
    tolerances?: Partial<MatchingTolerance>
  ): Promise<MatchingResult> {
    const appliedTolerances = { ...this.defaultTolerances, ...tolerances };
    const variances: MatchingVariance[] = [];
    const exceptions: string[] = [];

    // Calculate total received quantities from all GRNs
    const grnQuantities: Record<string, number> = {};
    grns.forEach(grn => {
      grn.items.forEach(item => {
        grnQuantities[item.itemId] = (grnQuantities[item.itemId] || 0) + item.acceptedQuantity;
      });
    });

    // Compare each invoice item
    for (const invItem of invoice.items) {
      const poItem = po.items.find(i => i.itemId === invItem.itemId);
      const totalGrnQty = grnQuantities[invItem.itemId] || 0;

      if (!poItem) {
        exceptions.push(`Item ${invItem.itemCode} (${invItem.itemName}) not found in PO ${po.poNumber}`);
        continue;
      }

      // Check quantity variance (Invoice vs GRN)
      if (totalGrnQty > 0) {
        const qtyVariance = Math.abs(invItem.invoicedQuantity - totalGrnQty) / totalGrnQty;
        if (qtyVariance > appliedTolerances.quantityTolerance) {
          variances.push({
            itemId: invItem.itemId,
            itemCode: invItem.itemCode,
            itemName: invItem.itemName,
            varianceType: 'QUANTITY',
            poValue: poItem.orderedQuantity,
            grnValue: totalGrnQty,
            invoiceValue: invItem.invoicedQuantity,
            variance: invItem.invoicedQuantity - totalGrnQty,
            variancePercentage: qtyVariance * 100,
            toleranceExceeded: true,
            toleranceLimit: appliedTolerances.quantityTolerance * 100,
          });
        }
      } else if (invItem.invoicedQuantity > 0) {
        exceptions.push(`No GRN found for item ${invItem.itemCode}`);
      }

      // Check price variance (Invoice vs PO)
      const priceVariance = Math.abs(invItem.unitPrice - poItem.unitPrice) / poItem.unitPrice;
      if (priceVariance > appliedTolerances.priceTolerance) {
        variances.push({
          itemId: invItem.itemId,
          itemCode: invItem.itemCode,
          itemName: invItem.itemName,
          varianceType: 'PRICE',
          poValue: poItem.unitPrice,
          grnValue: poItem.unitPrice, // GRN doesn't have price
          invoiceValue: invItem.unitPrice,
          variance: invItem.unitPrice - poItem.unitPrice,
          variancePercentage: priceVariance * 100,
          toleranceExceeded: true,
          toleranceLimit: appliedTolerances.priceTolerance * 100,
        });
      }

      // Check amount variance
      const expectedAmount = totalGrnQty * poItem.unitPrice;
      const invoiceAmount = invItem.lineTotal;
      if (expectedAmount > 0) {
        const amountVariance = Math.abs(invoiceAmount - expectedAmount) / expectedAmount;
        if (amountVariance > appliedTolerances.amountTolerance) {
          variances.push({
            itemId: invItem.itemId,
            itemCode: invItem.itemCode,
            itemName: invItem.itemName,
            varianceType: 'AMOUNT',
            poValue: poItem.lineTotal,
            grnValue: expectedAmount,
            invoiceValue: invoiceAmount,
            variance: invoiceAmount - expectedAmount,
            variancePercentage: amountVariance * 100,
            toleranceExceeded: true,
            toleranceLimit: appliedTolerances.amountTolerance * 100,
          });
        }
      }
    }

    // Check for items in PO not in invoice
    for (const poItem of po.items) {
      const invItem = invoice.items.find(i => i.itemId === poItem.itemId);
      if (!invItem && (grnQuantities[poItem.itemId] || 0) > 0) {
        exceptions.push(`Item ${poItem.itemCode} received in GRN but not in invoice`);
      }
    }

    // Determine overall matching status
    let matchingStatus = MatchingStatus.THREE_WAY_MATCHED;
    if (exceptions.length > 0) {
      matchingStatus = MatchingStatus.EXCEPTION;
    } else if (variances.length > 0) {
      const hasQuantityVariance = variances.some(v => v.varianceType === 'QUANTITY');
      const hasPriceVariance = variances.some(v => v.varianceType === 'PRICE');
      const hasAmountVariance = variances.some(v => v.varianceType === 'AMOUNT');

      if (hasQuantityVariance) {
        matchingStatus = MatchingStatus.QUANTITY_MISMATCH;
      } else if (hasPriceVariance) {
        matchingStatus = MatchingStatus.PRICE_MISMATCH;
      } else if (hasAmountVariance) {
        matchingStatus = MatchingStatus.AMOUNT_MISMATCH;
      }
    }

    // Calculate totals
    const totalGRNAmount = Object.keys(grnQuantities).reduce((sum, itemId) => {
      const poItem = po.items.find(i => i.itemId === itemId);
      return sum + (poItem ? grnQuantities[itemId] * poItem.unitPrice : 0);
    }, 0);

    const netVariance = invoice.totalAmount - totalGRNAmount;

    // Determine if approval is required
    const requiresApproval = variances.length > 0 ||
      Math.abs(netVariance) > appliedTolerances.maxAbsoluteVariance;

    let approvalReason: string | undefined;
    if (requiresApproval) {
      if (Math.abs(netVariance) > appliedTolerances.maxAbsoluteVariance) {
        approvalReason = `Net variance of ${netVariance.toFixed(2)} exceeds maximum allowed ${appliedTolerances.maxAbsoluteVariance}`;
      } else {
        approvalReason = `${variances.length} variance(s) detected`;
      }
    }

    const result: MatchingResult = {
      matchingId: uuidv4(),
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      purchaseOrderId: po.id,
      poNumber: po.poNumber,
      goodsReceiptIds: grns.map(g => g.id),
      grnNumbers: grns.map(g => g.grnNumber),
      matchingStatus,
      isMatched: variances.length === 0 && exceptions.length === 0,
      matchedAt: new Date().toISOString(),
      variances,
      exceptions,
      totalPOAmount: po.totalAmount,
      totalGRNAmount,
      totalInvoiceAmount: invoice.totalAmount,
      netVariance,
      requiresApproval,
      approvalReason,
    };

    this.matchingResults.push(result);

    // Emit event
    await this.eventBusService.emit<any>(result.isMatched ? WorkflowEventType.INVOICE_MATCHED : WorkflowEventType.INVOICE_MATCHING_VARIANCE, {
      matchingId: result.matchingId,
      invoiceId: invoice.id,
      status: matchingStatus,
      varianceCount: variances.length,
      exceptionCount: exceptions.length,
      requiresApproval,
      userId: 'SYSTEM',
    });

    return result;
  }

  async performTwoWayMatching(
    invoice: InvoiceData,
    po: POData,
    tolerances?: Partial<MatchingTolerance>
  ): Promise<MatchingResult> {
    const appliedTolerances = { ...this.defaultTolerances, ...tolerances };
    const variances: MatchingVariance[] = [];
    const exceptions: string[] = [];

    for (const invItem of invoice.items) {
      const poItem = po.items.find(i => i.itemId === invItem.itemId);

      if (!poItem) {
        exceptions.push(`Item ${invItem.itemCode} not found in PO ${po.poNumber}`);
        continue;
      }

      // Check quantity variance (Invoice vs PO)
      const qtyVariance = Math.abs(invItem.invoicedQuantity - poItem.orderedQuantity) / poItem.orderedQuantity;
      if (qtyVariance > appliedTolerances.quantityTolerance) {
        variances.push({
          itemId: invItem.itemId,
          itemCode: invItem.itemCode,
          itemName: invItem.itemName,
          varianceType: 'QUANTITY',
          poValue: poItem.orderedQuantity,
          grnValue: 0, // No GRN in two-way matching
          invoiceValue: invItem.invoicedQuantity,
          variance: invItem.invoicedQuantity - poItem.orderedQuantity,
          variancePercentage: qtyVariance * 100,
          toleranceExceeded: true,
          toleranceLimit: appliedTolerances.quantityTolerance * 100,
        });
      }

      // Check price variance
      const priceVariance = Math.abs(invItem.unitPrice - poItem.unitPrice) / poItem.unitPrice;
      if (priceVariance > appliedTolerances.priceTolerance) {
        variances.push({
          itemId: invItem.itemId,
          itemCode: invItem.itemCode,
          itemName: invItem.itemName,
          varianceType: 'PRICE',
          poValue: poItem.unitPrice,
          grnValue: 0,
          invoiceValue: invItem.unitPrice,
          variance: invItem.unitPrice - poItem.unitPrice,
          variancePercentage: priceVariance * 100,
          toleranceExceeded: true,
          toleranceLimit: appliedTolerances.priceTolerance * 100,
        });
      }
    }

    const matchingStatus = variances.length === 0 && exceptions.length === 0
      ? MatchingStatus.TWO_WAY_MATCHED
      : variances.some(v => v.varianceType === 'QUANTITY')
        ? MatchingStatus.QUANTITY_MISMATCH
        : MatchingStatus.PRICE_MISMATCH;

    const netVariance = invoice.totalAmount - po.totalAmount;

    const result: MatchingResult = {
      matchingId: uuidv4(),
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      purchaseOrderId: po.id,
      poNumber: po.poNumber,
      goodsReceiptIds: [],
      grnNumbers: [],
      matchingStatus,
      isMatched: variances.length === 0 && exceptions.length === 0,
      matchedAt: new Date().toISOString(),
      variances,
      exceptions,
      totalPOAmount: po.totalAmount,
      totalGRNAmount: 0,
      totalInvoiceAmount: invoice.totalAmount,
      netVariance,
      requiresApproval: variances.length > 0,
      approvalReason: variances.length > 0 ? `${variances.length} variance(s) detected in two-way matching` : undefined,
    };

    this.matchingResults.push(result);
    return result;
  }

  async getMatchingResult(matchingId: string): Promise<MatchingResult> {
    const result = this.matchingResults.find(r => r.matchingId === matchingId);
    if (!result) {
      throw new NotFoundException(`Matching result ${matchingId} not found`);
    }
    return result;
  }

  async getMatchingsByInvoice(invoiceId: string): Promise<MatchingResult[]> {
    return this.matchingResults.filter(r => r.invoiceId === invoiceId);
  }

  async getMatchingsByPO(poId: string): Promise<MatchingResult[]> {
    return this.matchingResults.filter(r => r.purchaseOrderId === poId);
  }

  async getUnmatchedInvoices(): Promise<MatchingResult[]> {
    return this.matchingResults.filter(r => !r.isMatched);
  }

  async getVarianceReport(
    fromDate?: string,
    toDate?: string
  ): Promise<{
    totalMatched: number;
    totalUnmatched: number;
    varianceByType: Record<string, number>;
    totalVarianceAmount: number;
    requiresApprovalCount: number;
  }> {
    let results = [...this.matchingResults];

    if (fromDate) {
      results = results.filter(r => r.matchedAt >= fromDate);
    }
    if (toDate) {
      results = results.filter(r => r.matchedAt <= toDate);
    }

    const varianceByType: Record<string, number> = {
      QUANTITY: 0,
      PRICE: 0,
      AMOUNT: 0,
    };

    let totalVarianceAmount = 0;

    results.forEach(r => {
      r.variances.forEach(v => {
        varianceByType[v.varianceType]++;
        totalVarianceAmount += Math.abs(v.variance);
      });
    });

    return {
      totalMatched: results.filter(r => r.isMatched).length,
      totalUnmatched: results.filter(r => !r.isMatched).length,
      varianceByType,
      totalVarianceAmount,
      requiresApprovalCount: results.filter(r => r.requiresApproval).length,
    };
  }

  setTolerances(tolerances: Partial<MatchingTolerance>): MatchingTolerance {
    Object.assign(this.defaultTolerances, tolerances);
    return this.defaultTolerances;
  }

  getTolerances(): MatchingTolerance {
    return { ...this.defaultTolerances };
  }
}
