import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface PriceCalculation {
  itemId: string;
  basePrice: number;
  quantityBreakDiscount: number;
  customerCategoryDiscount: number;
  promotionalDiscount: number;
  finalPrice: number;
  currency: string;
  validUntil: string;
  breakdown: {
    component: string;
    value: number;
    type: 'addition' | 'deduction';
  }[];
}

export interface QuantityBreak {
  minQuantity: number;
  maxQuantity: number;
  discountPercentage: number;
  pricePerUnit?: number;
}

export interface CustomerCategory {
  id: string;
  name: string;
  discountPercentage: number;
  priority: number;
}

export interface Promotion {
  id: string;
  name: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  applicableItems?: string[];
  applicableCategories?: string[];
  minimumOrderValue?: number;
  maximumDiscount?: number;
  isActive: boolean;
}

export interface PriceListItem {
  itemId: string;
  itemCode: string;
  itemName: string;
  basePrice: number;
  currency: string;
  unitOfMeasure: string;
  effectiveFrom: string;
  effectiveTo?: string;
  quantityBreaks: QuantityBreak[];
  minimumOrderQuantity?: number;
  version: number;
}

export interface MarginValidation {
  isValid: boolean;
  actualMargin: number;
  minimumMargin: number;
  message: string;
}

@Injectable()
export class PricingService {
  private priceList: PriceListItem[] = [];
  private customerCategories: CustomerCategory[] = [];
  private promotions: Promotion[] = [];
  private minimumMarginThreshold = 0.15; // 15%

  constructor() {
    this.seedMockData();
  }

  async calculatePrice(
    itemId: string,
    quantity: number,
    customerId: string,
    date: Date = new Date()
  ): Promise<PriceCalculation> {
    const priceItem = this.priceList.find(p => p.itemId === itemId);
    if (!priceItem) {
      throw new NotFoundException(`Price not found for item ${itemId}`);
    }

    const breakdown: PriceCalculation['breakdown'] = [];
    let currentPrice = priceItem.basePrice;

    breakdown.push({
      component: 'Base Price',
      value: priceItem.basePrice,
      type: 'addition',
    });

    // Apply quantity break discount
    const quantityBreakDiscount = this.getQuantityBreakDiscount(priceItem, quantity);
    if (quantityBreakDiscount > 0) {
      const discountAmount = currentPrice * quantityBreakDiscount;
      currentPrice -= discountAmount;
      breakdown.push({
        component: `Quantity Break (${(quantityBreakDiscount * 100).toFixed(1)}%)`,
        value: discountAmount,
        type: 'deduction',
      });
    }

    // Apply customer category discount
    const customerCategoryDiscount = await this.getCustomerCategoryDiscount(customerId);
    if (customerCategoryDiscount > 0) {
      const discountAmount = currentPrice * customerCategoryDiscount;
      currentPrice -= discountAmount;
      breakdown.push({
        component: `Customer Category (${(customerCategoryDiscount * 100).toFixed(1)}%)`,
        value: discountAmount,
        type: 'deduction',
      });
    }

    // Apply promotional discounts
    const activePromotions = await this.getActivePromotions(date, itemId);
    let promotionalDiscount = 0;
    for (const promo of activePromotions) {
      if (promo.discountType === 'percentage') {
        const promoDiscount = currentPrice * (promo.discountValue / 100);
        const cappedDiscount = promo.maximumDiscount
          ? Math.min(promoDiscount, promo.maximumDiscount)
          : promoDiscount;
        currentPrice -= cappedDiscount;
        promotionalDiscount += cappedDiscount;
        breakdown.push({
          component: `Promotion: ${promo.name} (${promo.discountValue}%)`,
          value: cappedDiscount,
          type: 'deduction',
        });
      } else {
        currentPrice -= promo.discountValue;
        promotionalDiscount += promo.discountValue;
        breakdown.push({
          component: `Promotion: ${promo.name}`,
          value: promo.discountValue,
          type: 'deduction',
        });
      }
    }

    // Calculate validity period (7 days by default)
    const validUntil = new Date(date);
    validUntil.setDate(validUntil.getDate() + 7);

    return {
      itemId,
      basePrice: priceItem.basePrice,
      quantityBreakDiscount: priceItem.basePrice * quantityBreakDiscount,
      customerCategoryDiscount: (priceItem.basePrice - priceItem.basePrice * quantityBreakDiscount) * customerCategoryDiscount,
      promotionalDiscount,
      finalPrice: Math.max(currentPrice, 0),
      currency: priceItem.currency,
      validUntil: validUntil.toISOString(),
      breakdown,
    };
  }

  async getQuantityBreaks(itemId: string): Promise<QuantityBreak[]> {
    const priceItem = this.priceList.find(p => p.itemId === itemId);
    if (!priceItem) {
      throw new NotFoundException(`Price not found for item ${itemId}`);
    }
    return priceItem.quantityBreaks;
  }

  async getCustomerCategoryDiscount(customerId: string): Promise<number> {
    // In production, this would look up the customer's category
    // For now, return a mock discount based on customer ID
    const hash = customerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const categoryIndex = hash % this.customerCategories.length;
    return this.customerCategories[categoryIndex]?.discountPercentage || 0;
  }

  async validateMargin(sellPrice: number, costPrice: number): Promise<MarginValidation> {
    if (costPrice <= 0) {
      return {
        isValid: false,
        actualMargin: 0,
        minimumMargin: this.minimumMarginThreshold,
        message: 'Invalid cost price',
      };
    }

    const actualMargin = (sellPrice - costPrice) / sellPrice;

    return {
      isValid: actualMargin >= this.minimumMarginThreshold,
      actualMargin,
      minimumMargin: this.minimumMarginThreshold,
      message: actualMargin >= this.minimumMarginThreshold
        ? `Margin of ${(actualMargin * 100).toFixed(1)}% meets minimum requirement`
        : `Margin of ${(actualMargin * 100).toFixed(1)}% is below minimum ${(this.minimumMarginThreshold * 100)}%`,
    };
  }

  async applyDynamicPricing(itemId: string, market: string): Promise<number> {
    const priceItem = this.priceList.find(p => p.itemId === itemId);
    if (!priceItem) {
      throw new NotFoundException(`Price not found for item ${itemId}`);
    }

    // Apply market-based adjustments
    const marketAdjustments: Record<string, number> = {
      'domestic': 1.0,
      'export': 1.15, // 15% higher for exports
      'government': 0.95, // 5% discount for government
      'oem': 0.90, // 10% discount for OEM customers
    };

    const adjustment = marketAdjustments[market.toLowerCase()] || 1.0;
    return priceItem.basePrice * adjustment;
  }

  async getActivePromotions(date: Date, itemId?: string): Promise<Promotion[]> {
    const dateStr = date.toISOString();

    return this.promotions.filter(promo => {
      if (!promo.isActive) return false;
      if (promo.startDate > dateStr) return false;
      if (promo.endDate < dateStr) return false;

      if (itemId && promo.applicableItems && promo.applicableItems.length > 0) {
        return promo.applicableItems.includes(itemId);
      }

      return true;
    });
  }

  async createPriceListItem(item: Omit<PriceListItem, 'version'>): Promise<PriceListItem> {
    const existingItem = this.priceList.find(p => p.itemId === item.itemId);
    const version = existingItem ? existingItem.version + 1 : 1;

    const newItem: PriceListItem = {
      ...item,
      version,
    };

    // Mark old version as expired
    if (existingItem) {
      existingItem.effectiveTo = new Date().toISOString();
    }

    this.priceList.push(newItem);
    return newItem;
  }

  async updatePriceListItem(itemId: string, updates: Partial<PriceListItem>): Promise<PriceListItem> {
    const index = this.priceList.findIndex(p => p.itemId === itemId && !p.effectiveTo);
    if (index === -1) {
      throw new NotFoundException(`Active price not found for item ${itemId}`);
    }

    // Create new version
    const oldItem = this.priceList[index];
    oldItem.effectiveTo = new Date().toISOString();

    const newItem: PriceListItem = {
      ...oldItem,
      ...updates,
      version: oldItem.version + 1,
      effectiveFrom: new Date().toISOString(),
      effectiveTo: undefined,
    };

    this.priceList.push(newItem);
    return newItem;
  }

  async getPriceHistory(itemId: string): Promise<PriceListItem[]> {
    return this.priceList
      .filter(p => p.itemId === itemId)
      .sort((a, b) => b.version - a.version);
  }

  async createPromotion(promotion: Omit<Promotion, 'id'>): Promise<Promotion> {
    const newPromotion: Promotion = {
      id: uuidv4(),
      ...promotion,
    };
    this.promotions.push(newPromotion);
    return newPromotion;
  }

  async updatePromotion(id: string, updates: Partial<Promotion>): Promise<Promotion> {
    const index = this.promotions.findIndex(p => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Promotion ${id} not found`);
    }

    this.promotions[index] = {
      ...this.promotions[index],
      ...updates,
    };

    return this.promotions[index];
  }

  async deactivatePromotion(id: string): Promise<void> {
    const promotion = this.promotions.find(p => p.id === id);
    if (!promotion) {
      throw new NotFoundException(`Promotion ${id} not found`);
    }
    promotion.isActive = false;
  }

  async getQuotePrice(
    items: Array<{ itemId: string; quantity: number }>,
    customerId: string,
    date: Date = new Date()
  ): Promise<{
    items: Array<PriceCalculation & { quantity: number; lineTotal: number }>;
    subtotal: number;
    totalDiscount: number;
    grandTotal: number;
  }> {
    const pricedItems = await Promise.all(
      items.map(async item => {
        const calculation = await this.calculatePrice(
          item.itemId,
          item.quantity,
          customerId,
          date
        );
        return {
          ...calculation,
          quantity: item.quantity,
          lineTotal: calculation.finalPrice * item.quantity,
        };
      })
    );

    const subtotal = pricedItems.reduce(
      (sum, item) => sum + item.basePrice * item.quantity,
      0
    );
    const grandTotal = pricedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const totalDiscount = subtotal - grandTotal;

    return {
      items: pricedItems,
      subtotal,
      totalDiscount,
      grandTotal,
    };
  }

  private getQuantityBreakDiscount(priceItem: PriceListItem, quantity: number): number {
    if (!priceItem.quantityBreaks || priceItem.quantityBreaks.length === 0) {
      return 0;
    }

    const applicableBreak = priceItem.quantityBreaks.find(
      qb => quantity >= qb.minQuantity && quantity <= qb.maxQuantity
    );

    return applicableBreak?.discountPercentage || 0;
  }

  private seedMockData(): void {
    // Seed customer categories
    this.customerCategories = [
      { id: 'cat-1', name: 'Platinum', discountPercentage: 0.15, priority: 1 },
      { id: 'cat-2', name: 'Gold', discountPercentage: 0.10, priority: 2 },
      { id: 'cat-3', name: 'Silver', discountPercentage: 0.05, priority: 3 },
      { id: 'cat-4', name: 'Standard', discountPercentage: 0, priority: 4 },
    ];

    // Seed price list
    this.priceList = [
      {
        itemId: 'item-001',
        itemCode: 'PRD-001',
        itemName: 'Industrial Motor',
        basePrice: 25000,
        currency: 'INR',
        unitOfMeasure: 'Nos',
        effectiveFrom: '2024-01-01',
        quantityBreaks: [
          { minQuantity: 1, maxQuantity: 9, discountPercentage: 0 },
          { minQuantity: 10, maxQuantity: 49, discountPercentage: 0.05 },
          { minQuantity: 50, maxQuantity: 99, discountPercentage: 0.10 },
          { minQuantity: 100, maxQuantity: Infinity, discountPercentage: 0.15 },
        ],
        minimumOrderQuantity: 1,
        version: 1,
      },
      {
        itemId: 'item-002',
        itemCode: 'PRD-002',
        itemName: 'Control Panel',
        basePrice: 75000,
        currency: 'INR',
        unitOfMeasure: 'Nos',
        effectiveFrom: '2024-01-01',
        quantityBreaks: [
          { minQuantity: 1, maxQuantity: 4, discountPercentage: 0 },
          { minQuantity: 5, maxQuantity: 19, discountPercentage: 0.05 },
          { minQuantity: 20, maxQuantity: Infinity, discountPercentage: 0.10 },
        ],
        minimumOrderQuantity: 1,
        version: 1,
      },
      {
        itemId: 'item-003',
        itemCode: 'PRD-003',
        itemName: 'Conveyor Belt System',
        basePrice: 250000,
        currency: 'INR',
        unitOfMeasure: 'Set',
        effectiveFrom: '2024-01-01',
        quantityBreaks: [
          { minQuantity: 1, maxQuantity: 2, discountPercentage: 0 },
          { minQuantity: 3, maxQuantity: Infinity, discountPercentage: 0.08 },
        ],
        minimumOrderQuantity: 1,
        version: 1,
      },
    ];

    // Seed promotions
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    this.promotions = [
      {
        id: uuidv4(),
        name: 'New Year Sale',
        discountType: 'percentage',
        discountValue: 5,
        startDate: now.toISOString(),
        endDate: nextMonth.toISOString(),
        minimumOrderValue: 100000,
        maximumDiscount: 25000,
        isActive: true,
      },
      {
        id: uuidv4(),
        name: 'Bulk Order Bonus',
        discountType: 'fixed',
        discountValue: 10000,
        startDate: now.toISOString(),
        endDate: nextMonth.toISOString(),
        minimumOrderValue: 500000,
        isActive: true,
      },
    ];
  }
}
