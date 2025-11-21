import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type ReorderMethod = 'eoq' | 'min_max' | 'fixed_period' | 'demand_based';
export type ReorderStatus = 'suggested' | 'approved' | 'ordered' | 'received' | 'cancelled';

export interface InventoryItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  unit: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  reorderPoint: number;
  minimumStock: number;
  maximumStock: number;
  safetyStock: number;
  leadTimeDays: number;
  unitCost: number;
  orderingCost: number;
  holdingCostPercent: number;
  annualDemand: number;
  reorderMethod: ReorderMethod;
  lastReorderDate?: string;
  preferredVendorId?: string;
  preferredVendorName?: string;
}

export interface ReorderSuggestion {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  currentStock: number;
  reorderPoint: number;
  suggestedQuantity: number;
  eoqQuantity?: number;
  minimumOrderQuantity?: number;
  unitCost: number;
  totalCost: number;
  vendorId?: string;
  vendorName?: string;
  leadTimeDays: number;
  expectedDeliveryDate: string;
  status: ReorderStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  purchaseRequisitionId?: string;
}

export interface EOQCalculation {
  itemId: string;
  annualDemand: number;
  orderingCost: number;
  holdingCostPerUnit: number;
  eoq: number;
  numberOfOrders: number;
  totalOrderingCost: number;
  totalHoldingCost: number;
  totalCost: number;
  reorderPoint: number;
}

export interface StockAnalysis {
  itemId: string;
  itemCode: string;
  itemName: string;
  currentStock: number;
  daysOfStock: number;
  stockoutRisk: 'low' | 'medium' | 'high' | 'critical';
  turnoverRatio: number;
  averageDailyDemand: number;
  demandVariability: number;
  suggestedSafetyStock: number;
}

@Injectable()
export class ReorderManagementService {
  private items: InventoryItem[] = [];
  private suggestions: ReorderSuggestion[] = [];

  constructor() {
    this.seedMockData();
  }

  async calculateEOQ(itemId: string): Promise<EOQCalculation> {
    const item = this.items.find(i => i.id === itemId);
    if (!item) {
      throw new Error(`Item ${itemId} not found`);
    }

    const D = item.annualDemand;
    const S = item.orderingCost;
    const H = item.unitCost * (item.holdingCostPercent / 100);

    // EOQ = sqrt((2 * D * S) / H)
    const eoq = Math.sqrt((2 * D * S) / H);
    const roundedEOQ = Math.ceil(eoq);

    // Number of orders per year
    const numberOfOrders = D / roundedEOQ;

    // Total costs
    const totalOrderingCost = numberOfOrders * S;
    const totalHoldingCost = (roundedEOQ / 2) * H;
    const totalCost = totalOrderingCost + totalHoldingCost;

    // Reorder point = (Daily demand * Lead time) + Safety stock
    const dailyDemand = D / 365;
    const reorderPoint = Math.ceil((dailyDemand * item.leadTimeDays) + item.safetyStock);

    return {
      itemId,
      annualDemand: D,
      orderingCost: S,
      holdingCostPerUnit: H,
      eoq: roundedEOQ,
      numberOfOrders: Math.round(numberOfOrders * 10) / 10,
      totalOrderingCost: Math.round(totalOrderingCost),
      totalHoldingCost: Math.round(totalHoldingCost),
      totalCost: Math.round(totalCost),
      reorderPoint,
    };
  }

  async generateReorderSuggestions(): Promise<ReorderSuggestion[]> {
    const newSuggestions: ReorderSuggestion[] = [];

    for (const item of this.items) {
      if (item.availableStock <= item.reorderPoint) {
        const eoqCalc = await this.calculateEOQ(item.id);
        const suggestedQty = this.calculateSuggestedQuantity(item, eoqCalc.eoq);
        const priority = this.calculatePriority(item);

        const suggestion: ReorderSuggestion = {
          id: uuidv4(),
          itemId: item.id,
          itemCode: item.itemCode,
          itemName: item.itemName,
          currentStock: item.availableStock,
          reorderPoint: item.reorderPoint,
          suggestedQuantity: suggestedQty,
          eoqQuantity: eoqCalc.eoq,
          unitCost: item.unitCost,
          totalCost: suggestedQty * item.unitCost,
          vendorId: item.preferredVendorId,
          vendorName: item.preferredVendorName,
          leadTimeDays: item.leadTimeDays,
          expectedDeliveryDate: this.calculateExpectedDelivery(item.leadTimeDays),
          status: 'suggested',
          priority,
          reason: this.getReorderReason(item, priority),
          createdAt: new Date().toISOString(),
        };

        newSuggestions.push(suggestion);
        this.suggestions.push(suggestion);
      }
    }

    return newSuggestions;
  }

  async approveSuggestion(
    suggestionId: string,
    approvedBy: string,
    quantity?: number
  ): Promise<ReorderSuggestion> {
    const suggestion = this.suggestions.find(s => s.id === suggestionId);
    if (!suggestion) {
      throw new Error(`Suggestion ${suggestionId} not found`);
    }

    if (quantity) {
      suggestion.suggestedQuantity = quantity;
      suggestion.totalCost = quantity * suggestion.unitCost;
    }

    suggestion.status = 'approved';
    suggestion.approvedAt = new Date().toISOString();
    suggestion.approvedBy = approvedBy;

    return suggestion;
  }

  async createPurchaseRequisition(suggestionId: string): Promise<string> {
    const suggestion = this.suggestions.find(s => s.id === suggestionId);
    if (!suggestion || suggestion.status !== 'approved') {
      throw new Error('Suggestion must be approved first');
    }

    // In production, this would create actual PR
    const prId = `PR-${Date.now()}`;
    suggestion.purchaseRequisitionId = prId;
    suggestion.status = 'ordered';

    // Update item's last reorder date
    const item = this.items.find(i => i.id === suggestion.itemId);
    if (item) {
      item.lastReorderDate = new Date().toISOString().split('T')[0];
    }

    return prId;
  }

  async getStockAnalysis(): Promise<StockAnalysis[]> {
    const analysis: StockAnalysis[] = [];

    for (const item of this.items) {
      const avgDailyDemand = item.annualDemand / 365;
      const daysOfStock = avgDailyDemand > 0 ? item.availableStock / avgDailyDemand : 999;
      const turnoverRatio = item.unitCost > 0 && item.currentStock > 0
        ? item.annualDemand / ((item.currentStock * item.unitCost))
        : 0;

      let stockoutRisk: 'low' | 'medium' | 'high' | 'critical';
      if (daysOfStock <= item.leadTimeDays) {
        stockoutRisk = 'critical';
      } else if (daysOfStock <= item.leadTimeDays * 1.5) {
        stockoutRisk = 'high';
      } else if (daysOfStock <= item.leadTimeDays * 2) {
        stockoutRisk = 'medium';
      } else {
        stockoutRisk = 'low';
      }

      // Simplified safety stock calculation (would use historical data in production)
      const demandVariability = 0.2; // 20% variability
      const serviceLevel = 1.65; // 95% service level
      const suggestedSafetyStock = Math.ceil(
        serviceLevel * demandVariability * avgDailyDemand * Math.sqrt(item.leadTimeDays)
      );

      analysis.push({
        itemId: item.id,
        itemCode: item.itemCode,
        itemName: item.itemName,
        currentStock: item.currentStock,
        daysOfStock: Math.round(daysOfStock),
        stockoutRisk,
        turnoverRatio: Math.round(turnoverRatio * 10) / 10,
        averageDailyDemand: Math.round(avgDailyDemand * 10) / 10,
        demandVariability,
        suggestedSafetyStock,
      });
    }

    return analysis.sort((a, b) => {
      const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return riskOrder[a.stockoutRisk] - riskOrder[b.stockoutRisk];
    });
  }

  async getReorderReport(): Promise<{
    itemsBelowReorderPoint: number;
    totalReorderValue: number;
    byPriority: Record<string, number>;
    byCategory: Record<string, { count: number; value: number }>;
    pendingSuggestions: ReorderSuggestion[];
  }> {
    const byPriority: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
    const byCategory: Record<string, { count: number; value: number }> = {};
    let totalValue = 0;

    const pendingSuggestions = this.suggestions.filter(s =>
      s.status === 'suggested' || s.status === 'approved'
    );

    for (const suggestion of pendingSuggestions) {
      byPriority[suggestion.priority]++;
      totalValue += suggestion.totalCost;

      const item = this.items.find(i => i.id === suggestion.itemId);
      if (item) {
        if (!byCategory[item.category]) {
          byCategory[item.category] = { count: 0, value: 0 };
        }
        byCategory[item.category].count++;
        byCategory[item.category].value += suggestion.totalCost;
      }
    }

    return {
      itemsBelowReorderPoint: pendingSuggestions.length,
      totalReorderValue: totalValue,
      byPriority,
      byCategory,
      pendingSuggestions,
    };
  }

  async updateReorderParameters(
    itemId: string,
    params: Partial<{
      reorderPoint: number;
      minimumStock: number;
      maximumStock: number;
      safetyStock: number;
      reorderMethod: ReorderMethod;
    }>
  ): Promise<InventoryItem> {
    const item = this.items.find(i => i.id === itemId);
    if (!item) {
      throw new Error(`Item ${itemId} not found`);
    }

    Object.assign(item, params);
    return item;
  }

  async optimizeReorderParameters(itemId: string): Promise<{
    current: Partial<InventoryItem>;
    suggested: Partial<InventoryItem>;
    costSavings: number;
  }> {
    const item = this.items.find(i => i.id === itemId);
    if (!item) {
      throw new Error(`Item ${itemId} not found`);
    }

    const eoqCalc = await this.calculateEOQ(itemId);
    const avgDailyDemand = item.annualDemand / 365;

    // Calculate optimal safety stock
    const serviceLevel = 1.65;
    const demandVariability = 0.2;
    const optimalSafetyStock = Math.ceil(
      serviceLevel * demandVariability * avgDailyDemand * Math.sqrt(item.leadTimeDays)
    );

    // Optimal reorder point
    const optimalReorderPoint = Math.ceil(
      (avgDailyDemand * item.leadTimeDays) + optimalSafetyStock
    );

    // Optimal max stock
    const optimalMaxStock = optimalReorderPoint + eoqCalc.eoq;

    // Calculate potential savings
    const currentHoldingCost = (item.currentStock / 2) * item.unitCost * (item.holdingCostPercent / 100);
    const optimalHoldingCost = (eoqCalc.eoq / 2) * item.unitCost * (item.holdingCostPercent / 100);
    const costSavings = Math.max(0, currentHoldingCost - optimalHoldingCost);

    return {
      current: {
        reorderPoint: item.reorderPoint,
        safetyStock: item.safetyStock,
        minimumStock: item.minimumStock,
        maximumStock: item.maximumStock,
      },
      suggested: {
        reorderPoint: optimalReorderPoint,
        safetyStock: optimalSafetyStock,
        minimumStock: optimalSafetyStock,
        maximumStock: optimalMaxStock,
      },
      costSavings: Math.round(costSavings),
    };
  }

  private calculateSuggestedQuantity(item: InventoryItem, eoq: number): number {
    switch (item.reorderMethod) {
      case 'eoq':
        return eoq;
      case 'min_max':
        return item.maximumStock - item.availableStock;
      case 'fixed_period':
        return Math.ceil((item.annualDemand / 12) + item.safetyStock - item.availableStock);
      case 'demand_based':
        return Math.ceil((item.annualDemand / 365) * item.leadTimeDays * 2);
      default:
        return eoq;
    }
  }

  private calculatePriority(item: InventoryItem): 'low' | 'medium' | 'high' | 'critical' {
    const stockRatio = item.availableStock / item.reorderPoint;

    if (stockRatio <= 0.25) return 'critical';
    if (stockRatio <= 0.5) return 'high';
    if (stockRatio <= 0.75) return 'medium';
    return 'low';
  }

  private getReorderReason(item: InventoryItem, priority: string): string {
    if (priority === 'critical') {
      return `Stock critically low (${item.availableStock} units). Immediate reorder required.`;
    }
    if (item.availableStock <= item.safetyStock) {
      return `Stock at safety level. Risk of stockout within ${item.leadTimeDays} days.`;
    }
    return `Stock below reorder point of ${item.reorderPoint} units.`;
  }

  private calculateExpectedDelivery(leadTimeDays: number): string {
    const date = new Date();
    date.setDate(date.getDate() + leadTimeDays);
    return date.toISOString().split('T')[0];
  }

  private seedMockData(): void {
    this.items = [
      {
        id: uuidv4(),
        itemCode: 'RM-001',
        itemName: 'Steel Sheet 2mm',
        category: 'Raw Materials',
        unit: 'Kg',
        currentStock: 500,
        reservedStock: 100,
        availableStock: 400,
        reorderPoint: 600,
        minimumStock: 200,
        maximumStock: 2000,
        safetyStock: 200,
        leadTimeDays: 7,
        unitCost: 85,
        orderingCost: 500,
        holdingCostPercent: 20,
        annualDemand: 12000,
        reorderMethod: 'eoq',
        preferredVendorId: 'vendor-001',
        preferredVendorName: 'Steel Corp',
      },
      {
        id: uuidv4(),
        itemCode: 'CP-001',
        itemName: 'Electronic Controller',
        category: 'Components',
        unit: 'Nos',
        currentStock: 50,
        reservedStock: 20,
        availableStock: 30,
        reorderPoint: 40,
        minimumStock: 20,
        maximumStock: 200,
        safetyStock: 20,
        leadTimeDays: 14,
        unitCost: 2500,
        orderingCost: 1000,
        holdingCostPercent: 25,
        annualDemand: 500,
        reorderMethod: 'eoq',
        preferredVendorId: 'vendor-002',
        preferredVendorName: 'Electronics Plus',
      },
      {
        id: uuidv4(),
        itemCode: 'PK-001',
        itemName: 'Packaging Box Large',
        category: 'Packaging',
        unit: 'Nos',
        currentStock: 1000,
        reservedStock: 200,
        availableStock: 800,
        reorderPoint: 500,
        minimumStock: 300,
        maximumStock: 3000,
        safetyStock: 300,
        leadTimeDays: 5,
        unitCost: 45,
        orderingCost: 300,
        holdingCostPercent: 15,
        annualDemand: 8000,
        reorderMethod: 'min_max',
        preferredVendorId: 'vendor-003',
        preferredVendorName: 'Pack Solutions',
      },
    ];
  }
}
