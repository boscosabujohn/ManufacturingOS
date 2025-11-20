import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type SpendCategory = 'direct_materials' | 'indirect_materials' | 'services' | 'capital' | 'mro' | 'logistics';
export type TimeGranularity = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface SpendRecord {
  id: string;
  transactionDate: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  categoryCode: string;
  categoryName: string;
  department: string;
  costCenter: string;
  amount: number;
  currency: string;
  quantity: number;
  unitPrice: number;
  contractId?: string;
  isContractCompliant: boolean;
  paymentTerms: string;
}

export interface SpendByDimension {
  dimension: string;
  value: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  trend?: number; // YoY change percentage
}

export interface VendorSpendAnalysis {
  vendorId: string;
  vendorName: string;
  totalSpend: number;
  percentage: number;
  transactionCount: number;
  averageOrderValue: number;
  contractCompliance: number;
  paymentPerformance: number;
  categories: string[];
  trend: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface CategoryAnalysis {
  categoryCode: string;
  categoryName: string;
  totalSpend: number;
  percentage: number;
  vendorCount: number;
  averagePrice: number;
  priceVariance: number;
  topVendors: Array<{ vendorName: string; amount: number }>;
  savingsOpportunity: number;
}

export interface MaverickSpend {
  id: string;
  transactionDate: string;
  poNumber: string;
  vendorName: string;
  amount: number;
  department: string;
  reason: 'no_contract' | 'off_contract' | 'price_variance' | 'unapproved_vendor' | 'split_order';
  description: string;
  potentialSavings: number;
}

export interface SavingsOpportunity {
  id: string;
  type: 'consolidation' | 'renegotiation' | 'supplier_switch' | 'demand_reduction' | 'payment_terms';
  description: string;
  category: string;
  currentSpend: number;
  potentialSavings: number;
  savingsPercentage: number;
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  vendors: string[];
}

export interface SpendTrend {
  period: string;
  totalSpend: number;
  directSpend: number;
  indirectSpend: number;
  transactionCount: number;
  averageOrderValue: number;
}

export interface ABCAnalysis {
  category: 'A' | 'B' | 'C';
  items: Array<{
    code: string;
    name: string;
    spend: number;
    cumulativePercentage: number;
  }>;
  totalSpend: number;
  percentageOfTotal: number;
  itemCount: number;
}

@Injectable()
export class SpendAnalysisService {
  private spendRecords: SpendRecord[] = [];

  constructor() {
    this.seedMockData();
  }

  async getSpendOverview(
    startDate: string,
    endDate: string,
    filters?: {
      department?: string;
      costCenter?: string;
      vendor?: string;
      category?: string;
    }
  ): Promise<{
    totalSpend: number;
    transactionCount: number;
    averageOrderValue: number;
    vendorCount: number;
    contractCompliance: number;
    yearOverYearChange: number;
    spendByCategory: SpendByDimension[];
    topVendors: SpendByDimension[];
    recentTrend: SpendTrend[];
  }> {
    let records = this.filterRecords(startDate, endDate, filters);

    const totalSpend = records.reduce((sum, r) => sum + r.amount, 0);
    const transactionCount = records.length;
    const vendorIds = new Set(records.map(r => r.vendorId));
    const compliantRecords = records.filter(r => r.isContractCompliant);

    // Spend by category
    const categoryMap = new Map<string, { amount: number; count: number }>();
    records.forEach(r => {
      const existing = categoryMap.get(r.categoryName) || { amount: 0, count: 0 };
      categoryMap.set(r.categoryName, {
        amount: existing.amount + r.amount,
        count: existing.count + 1,
      });
    });

    const spendByCategory: SpendByDimension[] = Array.from(categoryMap.entries())
      .map(([name, data]) => ({
        dimension: 'category',
        value: name,
        amount: data.amount,
        percentage: totalSpend > 0 ? Math.round((data.amount / totalSpend) * 100) : 0,
        transactionCount: data.count,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Top vendors
    const vendorMap = new Map<string, { amount: number; count: number }>();
    records.forEach(r => {
      const existing = vendorMap.get(r.vendorName) || { amount: 0, count: 0 };
      vendorMap.set(r.vendorName, {
        amount: existing.amount + r.amount,
        count: existing.count + 1,
      });
    });

    const topVendors: SpendByDimension[] = Array.from(vendorMap.entries())
      .map(([name, data]) => ({
        dimension: 'vendor',
        value: name,
        amount: data.amount,
        percentage: totalSpend > 0 ? Math.round((data.amount / totalSpend) * 100) : 0,
        transactionCount: data.count,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    // Recent trend (last 6 months)
    const recentTrend = this.calculateTrend(records, 'monthly', 6);

    return {
      totalSpend,
      transactionCount,
      averageOrderValue: transactionCount > 0 ? Math.round(totalSpend / transactionCount) : 0,
      vendorCount: vendorIds.size,
      contractCompliance: transactionCount > 0
        ? Math.round((compliantRecords.length / transactionCount) * 100)
        : 0,
      yearOverYearChange: 8.5, // Mock YoY change
      spendByCategory,
      topVendors,
      recentTrend,
    };
  }

  async getVendorAnalysis(
    startDate: string,
    endDate: string
  ): Promise<VendorSpendAnalysis[]> {
    const records = this.filterRecords(startDate, endDate);
    const totalSpend = records.reduce((sum, r) => sum + r.amount, 0);

    const vendorMap = new Map<string, {
      vendorId: string;
      vendorName: string;
      amount: number;
      count: number;
      compliant: number;
      categories: Set<string>;
    }>();

    records.forEach(r => {
      const existing = vendorMap.get(r.vendorId) || {
        vendorId: r.vendorId,
        vendorName: r.vendorName,
        amount: 0,
        count: 0,
        compliant: 0,
        categories: new Set<string>(),
      };

      existing.amount += r.amount;
      existing.count++;
      if (r.isContractCompliant) existing.compliant++;
      existing.categories.add(r.categoryName);

      vendorMap.set(r.vendorId, existing);
    });

    return Array.from(vendorMap.values())
      .map(v => ({
        vendorId: v.vendorId,
        vendorName: v.vendorName,
        totalSpend: v.amount,
        percentage: totalSpend > 0 ? Math.round((v.amount / totalSpend) * 100 * 10) / 10 : 0,
        transactionCount: v.count,
        averageOrderValue: Math.round(v.amount / v.count),
        contractCompliance: Math.round((v.compliant / v.count) * 100),
        paymentPerformance: 85 + Math.random() * 15, // Mock
        categories: Array.from(v.categories),
        trend: Math.round((Math.random() - 0.3) * 20), // Mock trend
        riskLevel: v.amount / totalSpend > 0.3 ? 'high' : v.amount / totalSpend > 0.15 ? 'medium' : 'low',
      }))
      .sort((a, b) => b.totalSpend - a.totalSpend);
  }

  async getCategoryAnalysis(
    startDate: string,
    endDate: string
  ): Promise<CategoryAnalysis[]> {
    const records = this.filterRecords(startDate, endDate);
    const totalSpend = records.reduce((sum, r) => sum + r.amount, 0);

    const categoryMap = new Map<string, {
      categoryCode: string;
      categoryName: string;
      amount: number;
      vendors: Map<string, number>;
      prices: number[];
    }>();

    records.forEach(r => {
      const existing = categoryMap.get(r.categoryCode) || {
        categoryCode: r.categoryCode,
        categoryName: r.categoryName,
        amount: 0,
        vendors: new Map<string, number>(),
        prices: [],
      };

      existing.amount += r.amount;
      existing.vendors.set(r.vendorName, (existing.vendors.get(r.vendorName) || 0) + r.amount);
      existing.prices.push(r.unitPrice);

      categoryMap.set(r.categoryCode, existing);
    });

    return Array.from(categoryMap.values())
      .map(c => {
        const avgPrice = c.prices.reduce((a, b) => a + b, 0) / c.prices.length;
        const variance = c.prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / c.prices.length;
        const topVendors = Array.from(c.vendors.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name, amount]) => ({ vendorName: name, amount }));

        // Calculate savings opportunity based on price variance
        const savingsOpportunity = Math.round(c.amount * (Math.sqrt(variance) / avgPrice) * 0.1);

        return {
          categoryCode: c.categoryCode,
          categoryName: c.categoryName,
          totalSpend: c.amount,
          percentage: totalSpend > 0 ? Math.round((c.amount / totalSpend) * 100) : 0,
          vendorCount: c.vendors.size,
          averagePrice: Math.round(avgPrice),
          priceVariance: Math.round(Math.sqrt(variance)),
          topVendors,
          savingsOpportunity,
        };
      })
      .sort((a, b) => b.totalSpend - a.totalSpend);
  }

  async getMaverickSpending(
    startDate: string,
    endDate: string
  ): Promise<{
    totalMaverickSpend: number;
    percentageOfTotal: number;
    maverickTransactions: MaverickSpend[];
    byReason: Record<string, { count: number; amount: number }>;
  }> {
    const records = this.filterRecords(startDate, endDate);
    const totalSpend = records.reduce((sum, r) => sum + r.amount, 0);

    // Identify maverick spending (non-contract compliant)
    const maverickRecords = records.filter(r => !r.isContractCompliant);
    const totalMaverickSpend = maverickRecords.reduce((sum, r) => sum + r.amount, 0);

    const byReason: Record<string, { count: number; amount: number }> = {
      no_contract: { count: 0, amount: 0 },
      off_contract: { count: 0, amount: 0 },
      price_variance: { count: 0, amount: 0 },
      unapproved_vendor: { count: 0, amount: 0 },
      split_order: { count: 0, amount: 0 },
    };

    const maverickTransactions: MaverickSpend[] = maverickRecords.map(r => {
      // Determine reason (simplified logic)
      let reason: MaverickSpend['reason'];
      if (!r.contractId) {
        reason = 'no_contract';
      } else if (r.amount > 100000) {
        reason = 'off_contract';
      } else {
        reason = 'price_variance';
      }

      byReason[reason].count++;
      byReason[reason].amount += r.amount;

      return {
        id: uuidv4(),
        transactionDate: r.transactionDate,
        poNumber: r.poNumber,
        vendorName: r.vendorName,
        amount: r.amount,
        department: r.department,
        reason,
        description: this.getMaverickDescription(reason, r),
        potentialSavings: Math.round(r.amount * 0.1), // 10% potential savings
      };
    });

    return {
      totalMaverickSpend,
      percentageOfTotal: totalSpend > 0 ? Math.round((totalMaverickSpend / totalSpend) * 100) : 0,
      maverickTransactions: maverickTransactions.sort((a, b) => b.amount - a.amount).slice(0, 50),
      byReason,
    };
  }

  async getSavingsOpportunities(
    startDate: string,
    endDate: string
  ): Promise<SavingsOpportunity[]> {
    const categoryAnalysis = await this.getCategoryAnalysis(startDate, endDate);
    const vendorAnalysis = await this.getVendorAnalysis(startDate, endDate);

    const opportunities: SavingsOpportunity[] = [];

    // Consolidation opportunities
    const multiVendorCategories = categoryAnalysis.filter(c => c.vendorCount > 3);
    multiVendorCategories.forEach(c => {
      opportunities.push({
        id: uuidv4(),
        type: 'consolidation',
        description: `Consolidate ${c.vendorCount} vendors in ${c.categoryName} to 2-3 strategic suppliers`,
        category: c.categoryName,
        currentSpend: c.totalSpend,
        potentialSavings: Math.round(c.totalSpend * 0.08),
        savingsPercentage: 8,
        effort: 'medium',
        timeline: '3-6 months',
        vendors: c.topVendors.map(v => v.vendorName),
      });
    });

    // Renegotiation opportunities
    const highSpendVendors = vendorAnalysis.filter(v => v.totalSpend > 1000000);
    highSpendVendors.forEach(v => {
      opportunities.push({
        id: uuidv4(),
        type: 'renegotiation',
        description: `Renegotiate contract with ${v.vendorName} based on volume commitment`,
        category: v.categories.join(', '),
        currentSpend: v.totalSpend,
        potentialSavings: Math.round(v.totalSpend * 0.05),
        savingsPercentage: 5,
        effort: 'low',
        timeline: '1-2 months',
        vendors: [v.vendorName],
      });
    });

    // Payment terms opportunities
    const poorPaymentVendors = vendorAnalysis.filter(v => v.paymentPerformance < 90);
    if (poorPaymentVendors.length > 0) {
      const totalSpend = poorPaymentVendors.reduce((sum, v) => sum + v.totalSpend, 0);
      opportunities.push({
        id: uuidv4(),
        type: 'payment_terms',
        description: 'Negotiate early payment discounts with vendors',
        category: 'Multiple',
        currentSpend: totalSpend,
        potentialSavings: Math.round(totalSpend * 0.02),
        savingsPercentage: 2,
        effort: 'low',
        timeline: '1 month',
        vendors: poorPaymentVendors.map(v => v.vendorName),
      });
    }

    return opportunities.sort((a, b) => b.potentialSavings - a.potentialSavings);
  }

  async getABCAnalysis(
    startDate: string,
    endDate: string,
    dimension: 'vendor' | 'category' | 'item' = 'vendor'
  ): Promise<ABCAnalysis[]> {
    const records = this.filterRecords(startDate, endDate);
    const totalSpend = records.reduce((sum, r) => sum + r.amount, 0);

    // Group by dimension
    const groupMap = new Map<string, { code: string; name: string; spend: number }>();
    records.forEach(r => {
      let key: string, code: string, name: string;

      switch (dimension) {
        case 'vendor':
          key = r.vendorId;
          code = r.vendorId;
          name = r.vendorName;
          break;
        case 'category':
          key = r.categoryCode;
          code = r.categoryCode;
          name = r.categoryName;
          break;
        default:
          key = r.categoryCode;
          code = r.categoryCode;
          name = r.categoryName;
      }

      const existing = groupMap.get(key) || { code, name, spend: 0 };
      existing.spend += r.amount;
      groupMap.set(key, existing);
    });

    // Sort by spend descending
    const sortedItems = Array.from(groupMap.values())
      .sort((a, b) => b.spend - a.spend);

    // Calculate cumulative percentages
    let cumulative = 0;
    const itemsWithCumulative = sortedItems.map(item => {
      cumulative += item.spend;
      return {
        ...item,
        cumulativePercentage: totalSpend > 0 ? Math.round((cumulative / totalSpend) * 100) : 0,
      };
    });

    // Categorize into A, B, C
    const aItems = itemsWithCumulative.filter(i => i.cumulativePercentage <= 80);
    const bItems = itemsWithCumulative.filter(i => i.cumulativePercentage > 80 && i.cumulativePercentage <= 95);
    const cItems = itemsWithCumulative.filter(i => i.cumulativePercentage > 95);

    const aSpend = aItems.reduce((sum, i) => sum + i.spend, 0);
    const bSpend = bItems.reduce((sum, i) => sum + i.spend, 0);
    const cSpend = cItems.reduce((sum, i) => sum + i.spend, 0);

    return [
      {
        category: 'A',
        items: aItems,
        totalSpend: aSpend,
        percentageOfTotal: totalSpend > 0 ? Math.round((aSpend / totalSpend) * 100) : 0,
        itemCount: aItems.length,
      },
      {
        category: 'B',
        items: bItems,
        totalSpend: bSpend,
        percentageOfTotal: totalSpend > 0 ? Math.round((bSpend / totalSpend) * 100) : 0,
        itemCount: bItems.length,
      },
      {
        category: 'C',
        items: cItems,
        totalSpend: cSpend,
        percentageOfTotal: totalSpend > 0 ? Math.round((cSpend / totalSpend) * 100) : 0,
        itemCount: cItems.length,
      },
    ];
  }

  async getSpendTrend(
    startDate: string,
    endDate: string,
    granularity: TimeGranularity = 'monthly'
  ): Promise<SpendTrend[]> {
    const records = this.filterRecords(startDate, endDate);
    return this.calculateTrend(records, granularity, 12);
  }

  async getDepartmentSpend(
    startDate: string,
    endDate: string
  ): Promise<SpendByDimension[]> {
    const records = this.filterRecords(startDate, endDate);
    const totalSpend = records.reduce((sum, r) => sum + r.amount, 0);

    const deptMap = new Map<string, { amount: number; count: number }>();
    records.forEach(r => {
      const existing = deptMap.get(r.department) || { amount: 0, count: 0 };
      deptMap.set(r.department, {
        amount: existing.amount + r.amount,
        count: existing.count + 1,
      });
    });

    return Array.from(deptMap.entries())
      .map(([name, data]) => ({
        dimension: 'department',
        value: name,
        amount: data.amount,
        percentage: totalSpend > 0 ? Math.round((data.amount / totalSpend) * 100) : 0,
        transactionCount: data.count,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  private filterRecords(
    startDate: string,
    endDate: string,
    filters?: {
      department?: string;
      costCenter?: string;
      vendor?: string;
      category?: string;
    }
  ): SpendRecord[] {
    let records = this.spendRecords.filter(r =>
      r.transactionDate >= startDate && r.transactionDate <= endDate
    );

    if (filters?.department) {
      records = records.filter(r => r.department === filters.department);
    }
    if (filters?.costCenter) {
      records = records.filter(r => r.costCenter === filters.costCenter);
    }
    if (filters?.vendor) {
      records = records.filter(r => r.vendorId === filters.vendor);
    }
    if (filters?.category) {
      records = records.filter(r => r.categoryCode === filters.category);
    }

    return records;
  }

  private calculateTrend(
    records: SpendRecord[],
    granularity: TimeGranularity,
    periods: number
  ): SpendTrend[] {
    const periodMap = new Map<string, {
      total: number;
      direct: number;
      indirect: number;
      count: number;
    }>();

    records.forEach(r => {
      const period = this.getPeriodKey(r.transactionDate, granularity);
      const existing = periodMap.get(period) || { total: 0, direct: 0, indirect: 0, count: 0 };

      existing.total += r.amount;
      if (['direct_materials', 'capital'].includes(r.categoryCode)) {
        existing.direct += r.amount;
      } else {
        existing.indirect += r.amount;
      }
      existing.count++;

      periodMap.set(period, existing);
    });

    return Array.from(periodMap.entries())
      .map(([period, data]) => ({
        period,
        totalSpend: data.total,
        directSpend: data.direct,
        indirectSpend: data.indirect,
        transactionCount: data.count,
        averageOrderValue: data.count > 0 ? Math.round(data.total / data.count) : 0,
      }))
      .sort((a, b) => a.period.localeCompare(b.period))
      .slice(-periods);
  }

  private getPeriodKey(dateString: string, granularity: TimeGranularity): string {
    const date = new Date(dateString);

    switch (granularity) {
      case 'daily':
        return dateString.substring(0, 10);
      case 'weekly':
        const week = Math.ceil(date.getDate() / 7);
        return `${date.getFullYear()}-W${week.toString().padStart(2, '0')}`;
      case 'monthly':
        return dateString.substring(0, 7);
      case 'quarterly':
        const quarter = Math.ceil((date.getMonth() + 1) / 3);
        return `${date.getFullYear()}-Q${quarter}`;
      case 'yearly':
        return date.getFullYear().toString();
      default:
        return dateString.substring(0, 7);
    }
  }

  private getMaverickDescription(reason: MaverickSpend['reason'], record: SpendRecord): string {
    switch (reason) {
      case 'no_contract':
        return `Purchase from ${record.vendorName} without valid contract`;
      case 'off_contract':
        return `Purchase exceeds contract terms or pricing`;
      case 'price_variance':
        return `Unit price variance exceeds tolerance`;
      case 'unapproved_vendor':
        return `Vendor not approved for category ${record.categoryName}`;
      case 'split_order':
        return `Potential order splitting to avoid approval`;
      default:
        return 'Non-compliant purchase';
    }
  }

  private seedMockData(): void {
    const vendors = [
      { id: 'v1', name: 'Alpha Suppliers' },
      { id: 'v2', name: 'Beta Industries' },
      { id: 'v3', name: 'Gamma Corp' },
      { id: 'v4', name: 'Delta Trading' },
      { id: 'v5', name: 'Epsilon Enterprises' },
    ];

    const categories = [
      { code: 'direct_materials', name: 'Direct Materials' },
      { code: 'indirect_materials', name: 'Indirect Materials' },
      { code: 'services', name: 'Services' },
      { code: 'mro', name: 'MRO Supplies' },
    ];

    const departments = ['Production', 'Engineering', 'Administration', 'IT', 'Logistics'];

    // Generate mock spend records for last 12 months
    for (let i = 0; i < 200; i++) {
      const monthOffset = Math.floor(Math.random() * 12);
      const date = new Date();
      date.setMonth(date.getMonth() - monthOffset);
      date.setDate(Math.floor(Math.random() * 28) + 1);

      const vendor = vendors[Math.floor(Math.random() * vendors.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];

      const quantity = Math.floor(Math.random() * 100) + 1;
      const unitPrice = Math.floor(Math.random() * 10000) + 100;

      this.spendRecords.push({
        id: uuidv4(),
        transactionDate: date.toISOString().substring(0, 10),
        poNumber: `PO-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}-${(i + 1).toString().padStart(4, '0')}`,
        vendorId: vendor.id,
        vendorName: vendor.name,
        categoryCode: category.code,
        categoryName: category.name,
        department,
        costCenter: `CC-${department.substring(0, 3).toUpperCase()}`,
        amount: quantity * unitPrice,
        currency: 'INR',
        quantity,
        unitPrice,
        contractId: Math.random() > 0.2 ? `CTR-${i}` : undefined,
        isContractCompliant: Math.random() > 0.15,
        paymentTerms: 'Net 30',
      });
    }
  }
}
