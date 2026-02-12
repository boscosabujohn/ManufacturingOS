import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import {
  CPQWinLossRecord,
  DiscountAnalytics,
  PricingAnalytics,
  ProductPerformance,
  QuoteAnalytics,
  SalesCycleAnalytics,
} from '../entities/cpq-analytics.entity';
import { Quote, QuoteStatus } from '../entities/quote.entity';

@Injectable()
export class CPQAnalyticsService {
  constructor(
    @InjectRepository(QuoteAnalytics)
    private quoteAnalyticsRepository: Repository<QuoteAnalytics>,
    @InjectRepository(CPQWinLossRecord)
    private winLossRepository: Repository<CPQWinLossRecord>,
    @InjectRepository(PricingAnalytics)
    private pricingAnalyticsRepository: Repository<PricingAnalytics>,
    @InjectRepository(SalesCycleAnalytics)
    private salesCycleRepository: Repository<SalesCycleAnalytics>,
    @InjectRepository(DiscountAnalytics)
    private discountAnalyticsRepository: Repository<DiscountAnalytics>,
    @InjectRepository(ProductPerformance)
    private productPerformanceRepository: Repository<ProductPerformance>,
    @InjectRepository(Quote)
    private quoteRepository: Repository<Quote>,
  ) {}

  // Quote Analytics
  async recordQuoteAnalytics(
    companyId: string,
    quoteId: string,
    data: Partial<QuoteAnalytics>,
  ): Promise<QuoteAnalytics> {
    let analytics = await this.quoteAnalyticsRepository.findOne({
      where: { companyId, quoteId },
    });

    if (analytics) {
      Object.assign(analytics, data);
    } else {
      analytics = this.quoteAnalyticsRepository.create({
        ...data,
        companyId,
        quoteId,
      });
    }

    return this.quoteAnalyticsRepository.save(analytics);
  }

  async getQuoteAnalyticsSummary(
    companyId: string,
    filters?: {
      fromDate?: Date;
      toDate?: Date;
      salesRepId?: string;
    },
  ): Promise<{
    totalQuotes: number;
    wonQuotes: number;
    lostQuotes: number;
    winRate: number;
    avgCycleDays: number;
    avgDiscountPercentage: number;
    avgMarginPercentage: number;
    totalValue: number;
    wonValue: number;
  }> {
    const query = this.quoteAnalyticsRepository
      .createQueryBuilder('analytics')
      .where('analytics.companyId = :companyId', { companyId });

    if (filters?.fromDate && filters?.toDate) {
      query.andWhere('analytics.createdAt BETWEEN :fromDate AND :toDate', {
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      });
    }
    if (filters?.salesRepId) {
      query.andWhere('analytics.salesRepId = :salesRepId', {
        salesRepId: filters.salesRepId,
      });
    }

    const analytics = await query.getMany();

    const totalQuotes = analytics.length;
    const wonQuotes = analytics.filter((a) => a.outcome === 'won').length;
    const lostQuotes = analytics.filter((a) => a.outcome === 'lost').length;
    const wonAnalytics = analytics.filter((a) => a.outcome === 'won');

    return {
      totalQuotes,
      wonQuotes,
      lostQuotes,
      winRate: totalQuotes > 0 ? (wonQuotes / totalQuotes) * 100 : 0,
      avgCycleDays:
        analytics.length > 0
          ? analytics.reduce((sum, a) => sum + (a.totalCycleDays || 0), 0) /
            analytics.length
          : 0,
      avgDiscountPercentage:
        analytics.length > 0
          ? analytics.reduce((sum, a) => sum + (Number(a.discountPercentage) || 0), 0) /
            analytics.length
          : 0,
      avgMarginPercentage:
        analytics.length > 0
          ? analytics.reduce((sum, a) => sum + (Number(a.marginPercentage) || 0), 0) /
            analytics.length
          : 0,
      totalValue: analytics.reduce((sum, a) => sum + (Number(a.finalValue) || 0), 0),
      wonValue: wonAnalytics.reduce((sum, a) => sum + (Number(a.finalValue) || 0), 0),
    };
  }

  // Win/Loss Analysis
  async recordWinLoss(
    companyId: string,
    data: Partial<CPQWinLossRecord>,
  ): Promise<CPQWinLossRecord> {
    const record = this.winLossRepository.create({
      ...data,
      companyId,
    });
    return this.winLossRepository.save(record);
  }

  async getWinLossAnalysis(
    companyId: string,
    filters?: {
      fromDate?: Date;
      toDate?: Date;
      industry?: string;
      productCategory?: string;
      salesRepId?: string;
    },
  ): Promise<{
    totalDeals: number;
    wins: number;
    losses: number;
    winRate: number;
    avgWonValue: number;
    avgLostValue: number;
    topLossReasons: { reason: string; count: number; percentage: number }[];
    competitorAnalysis: {
      competitor: string;
      lossCount: number;
      avgPriceDifference: number;
    }[];
  }> {
    const query = this.winLossRepository
      .createQueryBuilder('record')
      .where('record.companyId = :companyId', { companyId });

    if (filters?.fromDate && filters?.toDate) {
      query.andWhere('record.recordedAt BETWEEN :fromDate AND :toDate', {
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      });
    }
    if (filters?.industry) {
      query.andWhere('record.industry = :industry', { industry: filters.industry });
    }
    if (filters?.productCategory) {
      query.andWhere('record.productCategory = :productCategory', {
        productCategory: filters.productCategory,
      });
    }
    if (filters?.salesRepId) {
      query.andWhere('record.salesRepId = :salesRepId', {
        salesRepId: filters.salesRepId,
      });
    }

    const records = await query.getMany();

    const wins = records.filter((r) => r.outcome === 'won');
    const losses = records.filter((r) => r.outcome === 'lost');

    // Aggregate loss reasons
    const lossReasonCounts: Record<string, number> = {};
    for (const loss of losses) {
      if (loss.lossReasons) {
        for (const lr of loss.lossReasons) {
          lossReasonCounts[lr.reason] = (lossReasonCounts[lr.reason] || 0) + 1;
        }
      }
    }

    const topLossReasons = Object.entries(lossReasonCounts)
      .map(([reason, count]) => ({
        reason,
        count,
        percentage: losses.length > 0 ? (count / losses.length) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Competitor analysis
    const competitorCounts: Record<
      string,
      { count: number; totalPriceDiff: number }
    > = {};
    for (const loss of losses) {
      if (loss.competitorWon) {
        if (!competitorCounts[loss.competitorWon]) {
          competitorCounts[loss.competitorWon] = { count: 0, totalPriceDiff: 0 };
        }
        competitorCounts[loss.competitorWon].count++;
        competitorCounts[loss.competitorWon].totalPriceDiff +=
          Number(loss.priceDifferencePercentage) || 0;
      }
    }

    const competitorAnalysis = Object.entries(competitorCounts)
      .map(([competitor, data]) => ({
        competitor,
        lossCount: data.count,
        avgPriceDifference: data.count > 0 ? data.totalPriceDiff / data.count : 0,
      }))
      .sort((a, b) => b.lossCount - a.lossCount);

    return {
      totalDeals: records.length,
      wins: wins.length,
      losses: losses.length,
      winRate: records.length > 0 ? (wins.length / records.length) * 100 : 0,
      avgWonValue:
        wins.length > 0
          ? wins.reduce((sum, w) => sum + Number(w.quoteValue), 0) / wins.length
          : 0,
      avgLostValue:
        losses.length > 0
          ? losses.reduce((sum, l) => sum + Number(l.quoteValue), 0) / losses.length
          : 0,
      topLossReasons,
      competitorAnalysis,
    };
  }

  // Pricing Analytics
  async recordPricingAnalytics(
    companyId: string,
    data: Partial<PricingAnalytics>,
  ): Promise<PricingAnalytics> {
    const analytics = this.pricingAnalyticsRepository.create({
      ...data,
      companyId,
    });
    return this.pricingAnalyticsRepository.save(analytics);
  }

  async getPricingAnalyticsSummary(
    companyId: string,
    filters?: {
      productId?: string;
      productCategory?: string;
      fromDate?: Date;
      toDate?: Date;
    },
  ): Promise<{
    avgListPrice: number;
    avgSoldPrice: number;
    avgDiscountPercentage: number;
    priceVariance: number;
    avgMarginPercentage: number;
    totalRevenue: number;
  }> {
    const query = this.pricingAnalyticsRepository
      .createQueryBuilder('analytics')
      .where('analytics.companyId = :companyId', { companyId });

    if (filters?.productId) {
      query.andWhere('analytics.productId = :productId', {
        productId: filters.productId,
      });
    }
    if (filters?.productCategory) {
      query.andWhere('analytics.productCategory = :productCategory', {
        productCategory: filters.productCategory,
      });
    }
    if (filters?.fromDate && filters?.toDate) {
      query.andWhere('analytics.periodStart >= :fromDate', {
        fromDate: filters.fromDate,
      });
      query.andWhere('analytics.periodEnd <= :toDate', { toDate: filters.toDate });
    }

    const analytics = await query.getMany();

    if (analytics.length === 0) {
      return {
        avgListPrice: 0,
        avgSoldPrice: 0,
        avgDiscountPercentage: 0,
        priceVariance: 0,
        avgMarginPercentage: 0,
        totalRevenue: 0,
      };
    }

    return {
      avgListPrice:
        analytics.reduce((sum, a) => sum + (Number(a.avgListPrice) || 0), 0) /
        analytics.length,
      avgSoldPrice:
        analytics.reduce((sum, a) => sum + (Number(a.avgSoldPrice) || 0), 0) /
        analytics.length,
      avgDiscountPercentage:
        analytics.reduce((sum, a) => sum + (Number(a.avgDiscountPercentage) || 0), 0) /
        analytics.length,
      priceVariance:
        analytics.reduce((sum, a) => sum + (Number(a.priceVariance) || 0), 0) /
        analytics.length,
      avgMarginPercentage:
        analytics.reduce((sum, a) => sum + (Number(a.avgMarginPercentage) || 0), 0) /
        analytics.length,
      totalRevenue: analytics.reduce(
        (sum, a) => sum + (Number(a.totalRevenue) || 0),
        0,
      ),
    };
  }

  // Sales Cycle Analytics
  async recordSalesCycleAnalytics(
    companyId: string,
    data: Partial<SalesCycleAnalytics>,
  ): Promise<SalesCycleAnalytics> {
    const analytics = this.salesCycleRepository.create({
      ...data,
      companyId,
    });
    return this.salesCycleRepository.save(analytics);
  }

  async getSalesCycleAnalysis(
    companyId: string,
    filters?: {
      fromDate?: Date;
      toDate?: Date;
      salesRepId?: string;
      region?: string;
    },
  ): Promise<{
    avgCycleDays: number;
    avgQuoteCreationDays: number;
    avgApprovalDays: number;
    avgCustomerDecisionDays: number;
    conversionRate: number;
    stageMetrics: { stage: string; avgDays: number; dropOffRate: number }[];
  }> {
    const query = this.salesCycleRepository
      .createQueryBuilder('analytics')
      .where('analytics.companyId = :companyId', { companyId });

    if (filters?.fromDate && filters?.toDate) {
      query.andWhere('analytics.periodStart >= :fromDate', {
        fromDate: filters.fromDate,
      });
      query.andWhere('analytics.periodEnd <= :toDate', { toDate: filters.toDate });
    }
    if (filters?.salesRepId) {
      query.andWhere('analytics.salesRepId = :salesRepId', {
        salesRepId: filters.salesRepId,
      });
    }
    if (filters?.region) {
      query.andWhere('analytics.region = :region', { region: filters.region });
    }

    const analytics = await query.getMany();

    if (analytics.length === 0) {
      return {
        avgCycleDays: 0,
        avgQuoteCreationDays: 0,
        avgApprovalDays: 0,
        avgCustomerDecisionDays: 0,
        conversionRate: 0,
        stageMetrics: [],
      };
    }

    // Aggregate stage metrics
    const stageMetricsMap: Record<
      string,
      { totalDays: number; totalDropOff: number; count: number }
    > = {};
    for (const a of analytics) {
      if (a.stageMetrics) {
        for (const sm of a.stageMetrics) {
          if (!stageMetricsMap[sm.stage]) {
            stageMetricsMap[sm.stage] = { totalDays: 0, totalDropOff: 0, count: 0 };
          }
          stageMetricsMap[sm.stage].totalDays += sm.avgDays;
          stageMetricsMap[sm.stage].totalDropOff += sm.dropOffRate;
          stageMetricsMap[sm.stage].count++;
        }
      }
    }

    const stageMetrics = Object.entries(stageMetricsMap).map(([stage, data]) => ({
      stage,
      avgDays: data.count > 0 ? data.totalDays / data.count : 0,
      dropOffRate: data.count > 0 ? data.totalDropOff / data.count : 0,
    }));

    return {
      avgCycleDays:
        analytics.reduce((sum, a) => sum + (Number(a.avgCycleDays) || 0), 0) /
        analytics.length,
      avgQuoteCreationDays:
        analytics.reduce((sum, a) => sum + (Number(a.avgQuoteCreationDays) || 0), 0) /
        analytics.length,
      avgApprovalDays:
        analytics.reduce((sum, a) => sum + (Number(a.avgApprovalDays) || 0), 0) /
        analytics.length,
      avgCustomerDecisionDays:
        analytics.reduce(
          (sum, a) => sum + (Number(a.avgCustomerDecisionDays) || 0),
          0,
        ) / analytics.length,
      conversionRate:
        analytics.reduce((sum, a) => sum + (Number(a.conversionRate) || 0), 0) /
        analytics.length,
      stageMetrics,
    };
  }

  // Discount Analytics
  async recordDiscountAnalytics(
    companyId: string,
    data: Partial<DiscountAnalytics>,
  ): Promise<DiscountAnalytics> {
    const analytics = this.discountAnalyticsRepository.create({
      ...data,
      companyId,
    });
    return this.discountAnalyticsRepository.save(analytics);
  }

  async getDiscountAnalysis(
    companyId: string,
    filters?: {
      fromDate?: Date;
      toDate?: Date;
      salesRepId?: string;
    },
  ): Promise<{
    avgDiscountPercentage: number;
    totalDiscountAmount: number;
    discountDistribution: { range: string; count: number; percentage: number }[];
    revenueImpact: number;
    marginImpact: number;
  }> {
    const query = this.discountAnalyticsRepository
      .createQueryBuilder('analytics')
      .where('analytics.companyId = :companyId', { companyId });

    if (filters?.fromDate && filters?.toDate) {
      query.andWhere('analytics.periodStart >= :fromDate', {
        fromDate: filters.fromDate,
      });
      query.andWhere('analytics.periodEnd <= :toDate', { toDate: filters.toDate });
    }
    if (filters?.salesRepId) {
      query.andWhere('analytics.salesRepId = :salesRepId', {
        salesRepId: filters.salesRepId,
      });
    }

    const analytics = await query.getMany();

    if (analytics.length === 0) {
      return {
        avgDiscountPercentage: 0,
        totalDiscountAmount: 0,
        discountDistribution: [],
        revenueImpact: 0,
        marginImpact: 0,
      };
    }

    // Aggregate discount distribution
    const distributionMap: Record<string, number> = {};
    for (const a of analytics) {
      if (a.discountDistribution) {
        for (const d of a.discountDistribution) {
          distributionMap[d.range] = (distributionMap[d.range] || 0) + d.count;
        }
      }
    }

    const totalCount = Object.values(distributionMap).reduce((sum, c) => sum + c, 0);
    const discountDistribution = Object.entries(distributionMap).map(
      ([range, count]) => ({
        range,
        count,
        percentage: totalCount > 0 ? (count / totalCount) * 100 : 0,
      }),
    );

    return {
      avgDiscountPercentage:
        analytics.reduce((sum, a) => sum + (Number(a.avgDiscountPercentage) || 0), 0) /
        analytics.length,
      totalDiscountAmount: analytics.reduce(
        (sum, a) => sum + (Number(a.totalDiscountAmount) || 0),
        0,
      ),
      discountDistribution,
      revenueImpact: analytics.reduce(
        (sum, a) => sum + (Number(a.revenueImpact) || 0),
        0,
      ),
      marginImpact: analytics.reduce(
        (sum, a) => sum + (Number(a.marginImpact) || 0),
        0,
      ),
    };
  }

  // Product Performance
  async recordProductPerformance(
    companyId: string,
    data: Partial<ProductPerformance>,
  ): Promise<ProductPerformance> {
    const performance = this.productPerformanceRepository.create({
      ...data,
      companyId,
    });
    return this.productPerformanceRepository.save(performance);
  }

  async getProductPerformanceSummary(
    companyId: string,
    filters?: {
      productId?: string;
      productCategory?: string;
      fromDate?: Date;
      toDate?: Date;
    },
  ): Promise<{
    products: {
      productId: string;
      productName: string;
      timesQuoted: number;
      timesWon: number;
      winRate: number;
      totalRevenue: number;
      avgSellingPrice: number;
    }[];
    topPerformers: string[];
    underPerformers: string[];
  }> {
    const query = this.productPerformanceRepository
      .createQueryBuilder('performance')
      .where('performance.companyId = :companyId', { companyId });

    if (filters?.productId) {
      query.andWhere('performance.productId = :productId', {
        productId: filters.productId,
      });
    }
    if (filters?.productCategory) {
      query.andWhere('performance.productCategory = :productCategory', {
        productCategory: filters.productCategory,
      });
    }
    if (filters?.fromDate && filters?.toDate) {
      query.andWhere('performance.periodStart >= :fromDate', {
        fromDate: filters.fromDate,
      });
      query.andWhere('performance.periodEnd <= :toDate', {
        toDate: filters.toDate,
      });
    }

    const performances = await query.getMany();

    // Aggregate by product
    const productMap: Record<
      string,
      {
        productName: string;
        timesQuoted: number;
        timesWon: number;
        totalRevenue: number;
        totalQuantity: number;
      }
    > = {};

    for (const p of performances) {
      if (!productMap[p.productId]) {
        productMap[p.productId] = {
          productName: p.productName || '',
          timesQuoted: 0,
          timesWon: 0,
          totalRevenue: 0,
          totalQuantity: 0,
        };
      }
      productMap[p.productId].timesQuoted += p.timesQuoted;
      productMap[p.productId].timesWon += p.timesWon;
      productMap[p.productId].totalRevenue += Number(p.totalRevenue) || 0;
      productMap[p.productId].totalQuantity += p.totalQuantitySold;
    }

    const products = Object.entries(productMap).map(([productId, data]) => ({
      productId,
      productName: data.productName,
      timesQuoted: data.timesQuoted,
      timesWon: data.timesWon,
      winRate: data.timesQuoted > 0 ? (data.timesWon / data.timesQuoted) * 100 : 0,
      totalRevenue: data.totalRevenue,
      avgSellingPrice:
        data.totalQuantity > 0 ? data.totalRevenue / data.totalQuantity : 0,
    }));

    const sortedByWinRate = [...products].sort((a, b) => b.winRate - a.winRate);
    const topPerformers = sortedByWinRate.slice(0, 5).map((p) => p.productId);
    const underPerformers = sortedByWinRate
      .slice(-5)
      .reverse()
      .map((p) => p.productId);

    return {
      products,
      topPerformers,
      underPerformers,
    };
  }

  // Dashboard Summary
  async getDashboardSummary(
    companyId: string,
    filters?: { fromDate?: Date; toDate?: Date },
  ): Promise<{
    quoteMetrics: {
      total: number;
      draft: number;
      pending: number;
      approved: number;
      sent: number;
      won: number;
      lost: number;
    };
    valueMetrics: {
      totalPipelineValue: number;
      wonValue: number;
      avgDealSize: number;
    };
    performanceMetrics: {
      winRate: number;
      avgCycleDays: number;
      avgDiscountPercentage: number;
    };
  }> {
    const query = this.quoteRepository
      .createQueryBuilder('quote')
      .where('quote.companyId = :companyId', { companyId });

    if (filters?.fromDate && filters?.toDate) {
      query.andWhere('quote.createdAt BETWEEN :fromDate AND :toDate', {
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      });
    }

    const quotes = await query.getMany();

    const statusCounts = {
      draft: 0,
      pending: 0,
      approved: 0,
      sent: 0,
      won: 0,
      lost: 0,
    };

    let totalPipelineValue = 0;
    let wonValue = 0;

    for (const quote of quotes) {
      totalPipelineValue += Number(quote.totalAmount) || 0;

      switch (quote.status) {
        case QuoteStatus.DRAFT:
          statusCounts.draft++;
          break;
        case QuoteStatus.PENDING_APPROVAL:
          statusCounts.pending++;
          break;
        case QuoteStatus.APPROVED:
          statusCounts.approved++;
          break;
        case QuoteStatus.SENT:
          statusCounts.sent++;
          break;
        case QuoteStatus.ACCEPTED:
        case QuoteStatus.CONVERTED:
          statusCounts.won++;
          wonValue += Number(quote.totalAmount) || 0;
          break;
        case QuoteStatus.DECLINED:
        case QuoteStatus.EXPIRED:
          statusCounts.lost++;
          break;
      }
    }

    const completedDeals = statusCounts.won + statusCounts.lost;

    return {
      quoteMetrics: {
        total: quotes.length,
        ...statusCounts,
      },
      valueMetrics: {
        totalPipelineValue,
        wonValue,
        avgDealSize: quotes.length > 0 ? totalPipelineValue / quotes.length : 0,
      },
      performanceMetrics: {
        winRate:
          completedDeals > 0 ? (statusCounts.won / completedDeals) * 100 : 0,
        avgCycleDays: 0, // Would need to calculate from quote dates
        avgDiscountPercentage:
          quotes.length > 0
            ? quotes.reduce((sum, q) => sum + (Number(q.discountPercentage) || 0), 0) /
              quotes.length
            : 0,
      },
    };
  }
}
