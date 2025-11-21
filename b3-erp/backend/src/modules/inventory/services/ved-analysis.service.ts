import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type VEDCategory = 'V' | 'E' | 'D';
export type CriticalityFactor = 'production_impact' | 'safety' | 'lead_time' | 'availability' | 'cost';

export interface VEDItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  category: string;
  unit: string;
  unitCost: number;
  annualUsage: number;
  annualValue: number;
  vedCategory: VEDCategory;
  criticalityScore: number;
  criticalityFactors: CriticalityAssessment[];
  abcClass?: string;
  fsnClass?: string;
  lastReviewDate: string;
  nextReviewDate: string;
  reviewedBy?: string;
  notes?: string;
}

export interface CriticalityAssessment {
  factor: CriticalityFactor;
  weight: number;
  score: number;
  weightedScore: number;
  justification: string;
}

export interface VEDMatrix {
  category: VEDCategory;
  name: string;
  description: string;
  scoreRange: { min: number; max: number };
  stockPolicy: {
    safetyStockMultiplier: number;
    reorderPointMultiplier: number;
    reviewFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    minStockDays: number;
  };
  procurementPolicy: {
    multipleSuppliers: boolean;
    minSuppliers: number;
    bufferStock: boolean;
    expeditingAllowed: boolean;
  };
  itemCount: number;
  totalValue: number;
}

export interface VEDABCCombination {
  vedCategory: VEDCategory;
  abcClass: string;
  itemCount: number;
  totalValue: number;
  controlLevel: 'very_tight' | 'tight' | 'moderate' | 'normal' | 'loose';
  recommendations: string[];
}

export interface VEDAnalysisReport {
  totalItems: number;
  byCategory: Record<VEDCategory, { count: number; value: number; percentage: number }>;
  criticalItems: VEDItem[];
  reviewPending: VEDItem[];
  riskAssessment: {
    highRiskItems: number;
    mediumRiskItems: number;
    lowRiskItems: number;
  };
  recommendations: string[];
}

@Injectable()
export class VEDAnalysisService {
  private items: VEDItem[] = [];
  private vedMatrix: VEDMatrix[] = [];

  constructor() {
    this.initializeVEDMatrix();
    this.seedMockData();
  }

  private initializeVEDMatrix(): void {
    this.vedMatrix = [
      {
        category: 'V',
        name: 'Vital',
        description: 'Items critical for production, safety, or operations. Shortage causes immediate stoppage.',
        scoreRange: { min: 70, max: 100 },
        stockPolicy: {
          safetyStockMultiplier: 2.0,
          reorderPointMultiplier: 1.5,
          reviewFrequency: 'daily',
          minStockDays: 30,
        },
        procurementPolicy: {
          multipleSuppliers: true,
          minSuppliers: 2,
          bufferStock: true,
          expeditingAllowed: true,
        },
        itemCount: 0,
        totalValue: 0,
      },
      {
        category: 'E',
        name: 'Essential',
        description: 'Items important for smooth operations. Shortage causes delays but not stoppage.',
        scoreRange: { min: 40, max: 69 },
        stockPolicy: {
          safetyStockMultiplier: 1.5,
          reorderPointMultiplier: 1.25,
          reviewFrequency: 'weekly',
          minStockDays: 15,
        },
        procurementPolicy: {
          multipleSuppliers: true,
          minSuppliers: 1,
          bufferStock: true,
          expeditingAllowed: true,
        },
        itemCount: 0,
        totalValue: 0,
      },
      {
        category: 'D',
        name: 'Desirable',
        description: 'Items needed but shortage does not significantly affect operations.',
        scoreRange: { min: 0, max: 39 },
        stockPolicy: {
          safetyStockMultiplier: 1.0,
          reorderPointMultiplier: 1.0,
          reviewFrequency: 'monthly',
          minStockDays: 7,
        },
        procurementPolicy: {
          multipleSuppliers: false,
          minSuppliers: 1,
          bufferStock: false,
          expeditingAllowed: false,
        },
        itemCount: 0,
        totalValue: 0,
      },
    ];
  }

  async assessItem(
    itemId: string,
    itemCode: string,
    itemName: string,
    category: string,
    unit: string,
    unitCost: number,
    annualUsage: number,
    criticalityFactors: Omit<CriticalityAssessment, 'weightedScore'>[],
    reviewedBy: string
  ): Promise<VEDItem> {
    // Calculate weighted scores
    const assessments: CriticalityAssessment[] = criticalityFactors.map(factor => ({
      ...factor,
      weightedScore: factor.weight * factor.score,
    }));

    // Calculate total criticality score
    const totalWeight = assessments.reduce((sum, a) => sum + a.weight, 0);
    const totalWeightedScore = assessments.reduce((sum, a) => sum + a.weightedScore, 0);
    const criticalityScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;

    // Determine VED category
    const vedCategory = this.determineVEDCategory(criticalityScore);

    const vedItem: VEDItem = {
      id: uuidv4(),
      itemId,
      itemCode,
      itemName,
      category,
      unit,
      unitCost,
      annualUsage,
      annualValue: unitCost * annualUsage,
      vedCategory,
      criticalityScore,
      criticalityFactors: assessments,
      lastReviewDate: new Date().toISOString().split('T')[0],
      nextReviewDate: this.calculateNextReviewDate(vedCategory),
      reviewedBy,
    };

    // Remove existing assessment for this item
    this.items = this.items.filter(i => i.itemId !== itemId);
    this.items.push(vedItem);

    return vedItem;
  }

  private determineVEDCategory(score: number): VEDCategory {
    for (const matrix of this.vedMatrix) {
      if (score >= matrix.scoreRange.min && score <= matrix.scoreRange.max) {
        return matrix.category;
      }
    }
    return 'D';
  }

  private calculateNextReviewDate(category: VEDCategory): string {
    const matrix = this.vedMatrix.find(m => m.category === category);
    const date = new Date();

    switch (matrix?.stockPolicy.reviewFrequency) {
      case 'daily':
        date.setDate(date.getDate() + 30); // Review monthly for daily tracked items
        break;
      case 'weekly':
        date.setDate(date.getDate() + 90); // Review quarterly
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 6); // Review semi-annually
        break;
      case 'quarterly':
        date.setFullYear(date.getFullYear() + 1); // Review annually
        break;
    }

    return date.toISOString().split('T')[0];
  }

  async getVEDMatrix(): Promise<VEDMatrix[]> {
    // Update counts
    for (const matrix of this.vedMatrix) {
      const categoryItems = this.items.filter(i => i.vedCategory === matrix.category);
      matrix.itemCount = categoryItems.length;
      matrix.totalValue = categoryItems.reduce((sum, i) => sum + i.annualValue, 0);
    }

    return this.vedMatrix;
  }

  async getItemsByCategory(category: VEDCategory): Promise<VEDItem[]> {
    return this.items.filter(i => i.vedCategory === category);
  }

  async getVEDABCMatrix(): Promise<VEDABCCombination[]> {
    const combinations: VEDABCCombination[] = [];
    const vedCategories: VEDCategory[] = ['V', 'E', 'D'];
    const abcClasses = ['A', 'B', 'C'];

    for (const ved of vedCategories) {
      for (const abc of abcClasses) {
        const matchingItems = this.items.filter(i =>
          i.vedCategory === ved && i.abcClass === abc
        );

        const controlLevel = this.determineControlLevel(ved, abc);
        const recommendations = this.getRecommendations(ved, abc);

        combinations.push({
          vedCategory: ved,
          abcClass: abc,
          itemCount: matchingItems.length,
          totalValue: matchingItems.reduce((sum, i) => sum + i.annualValue, 0),
          controlLevel,
          recommendations,
        });
      }
    }

    return combinations;
  }

  private determineControlLevel(
    ved: VEDCategory,
    abc: string
  ): 'very_tight' | 'tight' | 'moderate' | 'normal' | 'loose' {
    if (ved === 'V' && abc === 'A') return 'very_tight';
    if (ved === 'V' || abc === 'A') return 'tight';
    if (ved === 'E' || abc === 'B') return 'moderate';
    if (ved === 'D' && abc === 'C') return 'loose';
    return 'normal';
  }

  private getRecommendations(ved: VEDCategory, abc: string): string[] {
    const recommendations: string[] = [];

    if (ved === 'V') {
      recommendations.push('Maintain safety stock at all times');
      recommendations.push('Ensure multiple supplier sources');
      recommendations.push('Regular quality inspections');
    }

    if (abc === 'A') {
      recommendations.push('Tight inventory control');
      recommendations.push('Regular demand forecasting');
      recommendations.push('Negotiated contracts with suppliers');
    }

    if (ved === 'V' && abc === 'A') {
      recommendations.push('CEO/CFO approval for stock-outs');
      recommendations.push('Real-time monitoring dashboard');
    }

    if (ved === 'D' && abc === 'C') {
      recommendations.push('Consider consignment stocking');
      recommendations.push('Reduce review frequency');
    }

    return recommendations;
  }

  async calculateStockParameters(itemId: string): Promise<{
    item: VEDItem;
    safetyStock: number;
    reorderPoint: number;
    reviewFrequency: string;
    minStock: number;
    maxStock: number;
    recommendations: string[];
  }> {
    const item = this.items.find(i => i.itemId === itemId);
    if (!item) throw new Error(`VED assessment not found for item ${itemId}`);

    const matrix = this.vedMatrix.find(m => m.category === item.vedCategory);
    if (!matrix) throw new Error('VED matrix not found');

    const dailyUsage = item.annualUsage / 365;
    const leadTimeDays = 7; // Would come from item master

    // Calculate stock parameters based on VED policy
    const baseSafetyStock = dailyUsage * leadTimeDays;
    const safetyStock = Math.ceil(baseSafetyStock * matrix.stockPolicy.safetyStockMultiplier);
    const reorderPoint = Math.ceil((dailyUsage * leadTimeDays * matrix.stockPolicy.reorderPointMultiplier) + safetyStock);
    const minStock = Math.ceil(dailyUsage * matrix.stockPolicy.minStockDays);
    const maxStock = Math.ceil(minStock * 3);

    const recommendations: string[] = [];
    if (matrix.procurementPolicy.multipleSuppliers) {
      recommendations.push(`Maintain minimum ${matrix.procurementPolicy.minSuppliers} suppliers`);
    }
    if (matrix.procurementPolicy.bufferStock) {
      recommendations.push('Keep buffer stock at supplier location');
    }
    if (matrix.procurementPolicy.expeditingAllowed) {
      recommendations.push('Expediting allowed for urgent requirements');
    }

    return {
      item,
      safetyStock,
      reorderPoint,
      reviewFrequency: matrix.stockPolicy.reviewFrequency,
      minStock,
      maxStock,
      recommendations,
    };
  }

  async getAnalysisReport(): Promise<VEDAnalysisReport> {
    const byCategory: Record<VEDCategory, { count: number; value: number; percentage: number }> = {
      V: { count: 0, value: 0, percentage: 0 },
      E: { count: 0, value: 0, percentage: 0 },
      D: { count: 0, value: 0, percentage: 0 },
    };

    const totalValue = this.items.reduce((sum, i) => sum + i.annualValue, 0);

    for (const item of this.items) {
      byCategory[item.vedCategory].count++;
      byCategory[item.vedCategory].value += item.annualValue;
    }

    // Calculate percentages
    for (const category of Object.keys(byCategory) as VEDCategory[]) {
      byCategory[category].percentage = totalValue > 0
        ? Math.round((byCategory[category].value / totalValue) * 100)
        : 0;
    }

    // Get critical items (V category with high scores)
    const criticalItems = this.items
      .filter(i => i.vedCategory === 'V')
      .sort((a, b) => b.criticalityScore - a.criticalityScore)
      .slice(0, 10);

    // Get items pending review
    const today = new Date().toISOString().split('T')[0];
    const reviewPending = this.items.filter(i => i.nextReviewDate <= today);

    // Risk assessment
    const riskAssessment = {
      highRiskItems: this.items.filter(i => i.vedCategory === 'V' && i.criticalityScore >= 80).length,
      mediumRiskItems: this.items.filter(i =>
        i.vedCategory === 'V' && i.criticalityScore < 80 ||
        i.vedCategory === 'E' && i.criticalityScore >= 60
      ).length,
      lowRiskItems: this.items.filter(i =>
        i.vedCategory === 'D' ||
        i.vedCategory === 'E' && i.criticalityScore < 60
      ).length,
    };

    // Generate recommendations
    const recommendations: string[] = [];
    if (reviewPending.length > 0) {
      recommendations.push(`${reviewPending.length} items are due for VED review`);
    }
    if (byCategory.V.count > this.items.length * 0.2) {
      recommendations.push('High proportion of Vital items - review classification criteria');
    }
    if (riskAssessment.highRiskItems > 0) {
      recommendations.push(`Focus on ${riskAssessment.highRiskItems} high-risk vital items`);
    }

    return {
      totalItems: this.items.length,
      byCategory,
      criticalItems,
      reviewPending,
      riskAssessment,
      recommendations,
    };
  }

  async bulkClassify(
    items: {
      itemId: string;
      itemCode: string;
      itemName: string;
      category: string;
      productionImpact: number;
      safetyImpact: number;
      leadTime: number;
      availability: number;
    }[]
  ): Promise<VEDItem[]> {
    const results: VEDItem[] = [];

    for (const item of items) {
      const criticalityFactors: Omit<CriticalityAssessment, 'weightedScore'>[] = [
        {
          factor: 'production_impact',
          weight: 30,
          score: item.productionImpact,
          justification: 'Auto-assessed based on production dependency',
        },
        {
          factor: 'safety',
          weight: 25,
          score: item.safetyImpact,
          justification: 'Auto-assessed based on safety criticality',
        },
        {
          factor: 'lead_time',
          weight: 20,
          score: item.leadTime > 30 ? 80 : item.leadTime > 14 ? 50 : 20,
          justification: `Lead time: ${item.leadTime} days`,
        },
        {
          factor: 'availability',
          weight: 25,
          score: item.availability,
          justification: 'Auto-assessed based on supplier availability',
        },
      ];

      const vedItem = await this.assessItem(
        item.itemId,
        item.itemCode,
        item.itemName,
        item.category,
        'Nos',
        100,
        1000,
        criticalityFactors,
        'System'
      );

      results.push(vedItem);
    }

    return results;
  }

  private seedMockData(): void {
    const mockItems = [
      {
        itemId: 'item-001',
        itemCode: 'RM-001',
        itemName: 'Steel Sheet 2mm',
        category: 'Raw Materials',
        productionImpact: 90,
        safetyImpact: 30,
        leadTime: 7,
        availability: 80,
      },
      {
        itemId: 'item-002',
        itemCode: 'CP-001',
        itemName: 'Electronic Controller',
        category: 'Components',
        productionImpact: 95,
        safetyImpact: 50,
        leadTime: 21,
        availability: 60,
      },
      {
        itemId: 'item-003',
        itemCode: 'SP-001',
        itemName: 'Hydraulic Pump',
        category: 'Spare Parts',
        productionImpact: 100,
        safetyImpact: 70,
        leadTime: 30,
        availability: 40,
      },
    ];

    this.bulkClassify(mockItems);
  }
}
