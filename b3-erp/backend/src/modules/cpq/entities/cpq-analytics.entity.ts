import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Quote Analytics
@Entity('cpq_quote_analytics')
export class QuoteAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  quoteId: string;

  @Column()
  quoteNumber: string;

  @Column({ type: 'varchar', nullable: true })
  customerId: string;

  @Column({ type: 'varchar', nullable: true })
  salesRepId: string;

  // Timeline Metrics
  @Column({ type: 'int', nullable: true })
  daysToCreate: number;

  @Column({ type: 'int', nullable: true })
  daysToApproval: number;

  @Column({ type: 'int', nullable: true })
  daysToSend: number;

  @Column({ type: 'int', nullable: true })
  daysToResponse: number;

  @Column({ type: 'int', nullable: true })
  totalCycleDays: number;

  // Revision Metrics
  @Column({ type: 'int', default: 1 })
  revisionCount: number;

  @Column({ type: 'int', default: 0 })
  approvalAttempts: number;

  // Value Metrics
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  initialValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  finalValue: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  valueChangePercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  totalDiscount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  discountPercentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  marginPercentage: number;

  // Outcome
  @Column({
    type: 'enum',
    enum: ['won', 'lost', 'pending', 'expired', 'cancelled'],
    default: 'pending',
  })
  outcome: 'won' | 'lost' | 'pending' | 'expired' | 'cancelled';

  @Column({ type: 'text', nullable: true })
  lossReason: string;

  @Column({ type: 'varchar', nullable: true })
  competitorWon: string;

  // Engagement Metrics
  @Column({ type: 'int', default: 0 })
  customerViewCount: number;

  @Column({ type: 'int', nullable: true })
  avgViewDuration: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Win/Loss Analysis
@Entity('cpq_win_loss_records')
export class CPQWinLossRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  quoteId: string;

  @Column({ type: 'varchar', nullable: true })
  opportunityId: string;

  @Column()
  customerId: string;

  @Column({ type: 'varchar', nullable: true })
  customerName: string;

  @Column({
    type: 'enum',
    enum: ['won', 'lost'],
  })
  outcome: 'won' | 'lost';

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  quoteValue: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', nullable: true })
  industry: string;

  @Column({ type: 'varchar', nullable: true })
  productCategory: string;

  @Column({ type: 'varchar', nullable: true })
  salesRepId: string;

  @Column({ type: 'varchar', nullable: true })
  region: string;

  // Win-specific
  @Column({ type: 'json', nullable: true })
  winFactors: string[];

  // Loss-specific
  @Column({ type: 'json', nullable: true })
  lossReasons: {
    reason: string;
    isPrimary: boolean;
  }[];

  @Column({ type: 'varchar', nullable: true })
  competitorWon: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  competitorPrice: number;

  @Column({ type: 'text', nullable: true })
  feedbackNotes: string;

  // Comparison
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  priceDifferencePercentage: number;

  @Column({ type: 'int', nullable: true })
  leadTimeDifferenceDays: number;

  @CreateDateColumn()
  recordedAt: Date;
}

// Pricing Analytics
@Entity('cpq_pricing_analytics')
export class PricingAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  productId: string;

  @Column({ type: 'varchar', nullable: true })
  productCategory: string;

  @Column({ type: 'date' })
  periodStart: Date;

  @Column({ type: 'date' })
  periodEnd: Date;

  @Column({
    type: 'enum',
    enum: ['daily', 'weekly', 'monthly', 'quarterly'],
    default: 'monthly',
  })
  periodType: 'daily' | 'weekly' | 'monthly' | 'quarterly';

  // Price Metrics
  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  avgListPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  avgSoldPrice: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  avgDiscountPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  minSoldPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  maxSoldPrice: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  priceVariance: number;

  // Volume Metrics
  @Column({ type: 'int', default: 0 })
  quotesGenerated: number;

  @Column({ type: 'int', default: 0 })
  quotesWon: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalRevenue: number;

  @Column({ type: 'int', default: 0 })
  totalQuantitySold: number;

  // Margin Metrics
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  avgMarginPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  totalMarginAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Sales Cycle Analysis
@Entity('cpq_sales_cycle_analytics')
export class SalesCycleAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column({ type: 'date' })
  periodStart: Date;

  @Column({ type: 'date' })
  periodEnd: Date;

  @Column({ type: 'varchar', nullable: true })
  salesRepId: string;

  @Column({ type: 'varchar', nullable: true })
  region: string;

  @Column({ type: 'varchar', nullable: true })
  productCategory: string;

  @Column({ type: 'varchar', nullable: true })
  customerSegment: string;

  // Cycle Time Metrics
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  avgCycleDays: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  avgQuoteCreationDays: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  avgApprovalDays: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  avgCustomerDecisionDays: number;

  @Column({ type: 'int', nullable: true })
  minCycleDays: number;

  @Column({ type: 'int', nullable: true })
  maxCycleDays: number;

  // Volume Metrics
  @Column({ type: 'int', default: 0 })
  totalQuotes: number;

  @Column({ type: 'int', default: 0 })
  quotesConverted: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  conversionRate: number;

  // Stage Metrics
  @Column({ type: 'json', nullable: true })
  stageMetrics: {
    stage: string;
    avgDays: number;
    dropOffRate: number;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Discount Analysis
@Entity('cpq_discount_analytics')
export class DiscountAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column({ type: 'date' })
  periodStart: Date;

  @Column({ type: 'date' })
  periodEnd: Date;

  @Column({ type: 'varchar', nullable: true })
  salesRepId: string;

  @Column({ type: 'varchar', nullable: true })
  productCategory: string;

  @Column({ type: 'varchar', nullable: true })
  customerSegment: string;

  // Discount Metrics
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  avgDiscountPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  totalDiscountAmount: number;

  @Column({ type: 'int', default: 0 })
  discountApprovalCount: number;

  @Column({ type: 'int', default: 0 })
  discountRejectionCount: number;

  // Distribution
  @Column({ type: 'json', nullable: true })
  discountDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];

  // By Type
  @Column({ type: 'json', nullable: true })
  discountsByType: {
    discountType: string;
    count: number;
    totalAmount: number;
    avgPercentage: number;
  }[];

  // Impact Analysis
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  revenueImpact: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  marginImpact: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Product Performance
@Entity('cpq_product_performance')
export class ProductPerformance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  productId: string;

  @Column({ type: 'varchar', nullable: true })
  productName: string;

  @Column({ type: 'varchar', nullable: true })
  productCategory: string;

  @Column({ type: 'date' })
  periodStart: Date;

  @Column({ type: 'date' })
  periodEnd: Date;

  // Quote Metrics
  @Column({ type: 'int', default: 0 })
  timesQuoted: number;

  @Column({ type: 'int', default: 0 })
  timesWon: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  winRate: number;

  // Revenue Metrics
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalRevenue: number;

  @Column({ type: 'int', default: 0 })
  totalQuantitySold: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  avgSellingPrice: number;

  // Configuration Metrics
  @Column({ type: 'int', default: 0 })
  configurationsCreated: number;

  @Column({ type: 'json', nullable: true })
  popularOptions: {
    optionId: string;
    optionName: string;
    selectionCount: number;
    percentage: number;
  }[];

  // Bundle Metrics
  @Column({ type: 'int', default: 0 })
  timesSoldInBundle: number;

  @Column({ type: 'json', nullable: true })
  frequentlyBundledWith: {
    productId: string;
    productName: string;
    bundleCount: number;
  }[];

  // Recommendation Metrics
  @Column({ type: 'int', default: 0 })
  recommendationImpressions: number;

  @Column({ type: 'int', default: 0 })
  recommendationConversions: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
