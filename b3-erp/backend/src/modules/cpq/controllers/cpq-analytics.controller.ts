import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  CPQWinLossRecord,
  DiscountAnalytics,
  PricingAnalytics,
  ProductPerformance,
  QuoteAnalytics,
  SalesCycleAnalytics,
} from '../entities/cpq-analytics.entity';
import { CPQAnalyticsService } from '../services/cpq-analytics.service';

@Controller('cpq/analytics')
export class CPQAnalyticsController {
  constructor(private readonly cpqAnalyticsService: CPQAnalyticsService) {}

  // Dashboard
  @Get('dashboard')
  getDashboardSummary(
    @Headers('x-company-id') companyId: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
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
    return this.cpqAnalyticsService.getDashboardSummary(companyId, {
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
    });
  }

  // Quote Analytics
  @Post('quotes')
  recordQuoteAnalytics(
    @Headers('x-company-id') companyId: string,
    @Body() body: { quoteId: string; data: Partial<QuoteAnalytics> },
  ): Promise<QuoteAnalytics> {
    return this.cpqAnalyticsService.recordQuoteAnalytics(
      companyId,
      body.quoteId,
      body.data,
    );
  }

  @Get('quotes/summary')
  getQuoteAnalyticsSummary(
    @Headers('x-company-id') companyId: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('salesRepId') salesRepId?: string,
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
    return this.cpqAnalyticsService.getQuoteAnalyticsSummary(companyId, {
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
      salesRepId,
    });
  }

  // Win/Loss Analysis
  @Post('win-loss')
  recordWinLoss(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<CPQWinLossRecord>,
  ): Promise<CPQWinLossRecord> {
    return this.cpqAnalyticsService.recordWinLoss(companyId, data);
  }

  @Get('win-loss')
  getWinLossAnalysis(
    @Headers('x-company-id') companyId: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('industry') industry?: string,
    @Query('productCategory') productCategory?: string,
    @Query('salesRepId') salesRepId?: string,
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
    return this.cpqAnalyticsService.getWinLossAnalysis(companyId, {
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
      industry,
      productCategory,
      salesRepId,
    });
  }

  // Pricing Analytics
  @Post('pricing')
  recordPricingAnalytics(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<PricingAnalytics>,
  ): Promise<PricingAnalytics> {
    return this.cpqAnalyticsService.recordPricingAnalytics(companyId, data);
  }

  @Get('pricing/summary')
  getPricingAnalyticsSummary(
    @Headers('x-company-id') companyId: string,
    @Query('productId') productId?: string,
    @Query('productCategory') productCategory?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ): Promise<{
    avgListPrice: number;
    avgSoldPrice: number;
    avgDiscountPercentage: number;
    priceVariance: number;
    avgMarginPercentage: number;
    totalRevenue: number;
  }> {
    return this.cpqAnalyticsService.getPricingAnalyticsSummary(companyId, {
      productId,
      productCategory,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
    });
  }

  // Sales Cycle Analytics
  @Post('sales-cycle')
  recordSalesCycleAnalytics(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<SalesCycleAnalytics>,
  ): Promise<SalesCycleAnalytics> {
    return this.cpqAnalyticsService.recordSalesCycleAnalytics(companyId, data);
  }

  @Get('sales-cycle')
  getSalesCycleAnalysis(
    @Headers('x-company-id') companyId: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('salesRepId') salesRepId?: string,
    @Query('region') region?: string,
  ): Promise<{
    avgCycleDays: number;
    avgQuoteCreationDays: number;
    avgApprovalDays: number;
    avgCustomerDecisionDays: number;
    conversionRate: number;
    stageMetrics: { stage: string; avgDays: number; dropOffRate: number }[];
  }> {
    return this.cpqAnalyticsService.getSalesCycleAnalysis(companyId, {
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
      salesRepId,
      region,
    });
  }

  // Discount Analytics
  @Post('discounts')
  recordDiscountAnalytics(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<DiscountAnalytics>,
  ): Promise<DiscountAnalytics> {
    return this.cpqAnalyticsService.recordDiscountAnalytics(companyId, data);
  }

  @Get('discounts')
  getDiscountAnalysis(
    @Headers('x-company-id') companyId: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('salesRepId') salesRepId?: string,
  ): Promise<{
    avgDiscountPercentage: number;
    totalDiscountAmount: number;
    discountDistribution: { range: string; count: number; percentage: number }[];
    revenueImpact: number;
    marginImpact: number;
  }> {
    return this.cpqAnalyticsService.getDiscountAnalysis(companyId, {
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
      salesRepId,
    });
  }

  // Product Performance
  @Post('products')
  recordProductPerformance(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<ProductPerformance>,
  ): Promise<ProductPerformance> {
    return this.cpqAnalyticsService.recordProductPerformance(companyId, data);
  }

  @Get('products/summary')
  getProductPerformanceSummary(
    @Headers('x-company-id') companyId: string,
    @Query('productId') productId?: string,
    @Query('productCategory') productCategory?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
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
    return this.cpqAnalyticsService.getProductPerformanceSummary(companyId, {
      productId,
      productCategory,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
    });
  }
}
