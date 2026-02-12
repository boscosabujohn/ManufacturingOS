import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum WinLossStatus {
  WON = 'Won',
  LOST = 'Lost',
  PENDING = 'Pending',
  NO_BID = 'No Bid',
  WITHDRAWN = 'Withdrawn',
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

@Entity('estimation_win_loss_records')
export class WinLossRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  estimateId: string;

  @Column()
  estimateNumber: string;

  @Column()
  projectName: string;

  @Column({ type: 'varchar', nullable: true })
  customerId: string;

  @Column({ type: 'varchar', nullable: true })
  customerName: string;

  @Column({
    type: 'enum',
    enum: WinLossStatus,
    default: WinLossStatus.PENDING,
  })
  status: WinLossStatus;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  estimatedAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  actualAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  competitorPrice: number;

  @Column({ type: 'varchar', nullable: true })
  competitorName: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  priceVariancePercentage: number;

  @Column({ type: 'date' })
  submissionDate: Date;

  @Column({ type: 'date', nullable: true })
  decisionDate: Date;

  @Column({ type: 'text', nullable: true })
  winLossReason: string;

  @Column({ type: 'json', nullable: true })
  lossFactors: {
    factor: string;
    impact: 'High' | 'Medium' | 'Low';
    notes: string;
  }[];

  @Column({ type: 'json', nullable: true })
  lessonsLearned: string[];

  @Column({ type: 'varchar', nullable: true })
  estimatorId: string;

  @Column({ type: 'varchar', nullable: true })
  estimatorName: string;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('estimation_accuracy_records')
export class EstimateAccuracyRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  estimateId: string;

  @Column()
  estimateNumber: string;

  @Column()
  projectId: string;

  @Column()
  projectName: string;

  @Column({ default: 'USD' })
  currency: string;

  // Original Estimate
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  estimatedMaterialCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  estimatedLaborCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  estimatedOverheadCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  estimatedTotalCost: number;

  // Actual Costs
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  actualMaterialCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  actualLaborCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  actualOverheadCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  actualTotalCost: number;

  // Variance Analysis
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  materialVariance: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  materialVariancePercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  laborVariance: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  laborVariancePercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  overheadVariance: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  overheadVariancePercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  totalVariance: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  totalVariancePercentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  accuracyScore: number;

  // Variance Reasons
  @Column({ type: 'json', nullable: true })
  varianceReasons: {
    category: string;
    reason: string;
    amount: number;
    preventable: boolean;
  }[];

  @Column({ type: 'varchar', nullable: true })
  estimatorId: string;

  @Column({ type: 'varchar', nullable: true })
  estimatorName: string;

  @Column({ type: 'date' })
  estimateDate: Date;

  @Column({ type: 'date', nullable: true })
  projectCompletionDate: Date;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('estimation_risk_analysis')
export class RiskAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  estimateId: string;

  @Column()
  estimateNumber: string;

  @Column()
  projectName: string;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    default: RiskLevel.MEDIUM,
  })
  overallRiskLevel: RiskLevel;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  overallRiskScore: number;

  @Column({ type: 'json' })
  risks: {
    riskId: string;
    category: 'Technical' | 'Financial' | 'Schedule' | 'Resource' | 'External' | 'Other';
    description: string;
    probability: 'Low' | 'Medium' | 'High';
    impact: 'Low' | 'Medium' | 'High';
    riskScore: number;
    mitigationStrategy: string;
    mitigationCost: number;
    residualRisk: 'Low' | 'Medium' | 'High';
    owner: string;
    status: 'Identified' | 'Mitigated' | 'Accepted' | 'Closed';
  }[];

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalMitigationCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  recommendedContingency: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  recommendedContingencyPercentage: number;

  @Column({ type: 'json', nullable: true })
  sensitivityAnalysis: {
    variable: string;
    baseValue: number;
    minValue: number;
    maxValue: number;
    impactOnTotal: number;
  }[];

  @Column({ type: 'json', nullable: true })
  whatIfScenarios: {
    scenarioId: string;
    scenarioName: string;
    description: string;
    assumptions: { variable: string; value: number }[];
    resultingTotal: number;
    varianceFromBase: number;
    variancePercentage: number;
  }[];

  @Column({ type: 'varchar', nullable: true })
  analysisBy: string;

  @Column({ type: 'timestamp', nullable: true })
  analysisDate: Date;

  @Column({ type: 'text', nullable: true })
  recommendations: string;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('estimation_estimator_performance')
export class EstimatorPerformance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  estimatorId: string;

  @Column()
  estimatorName: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int', default: 0 })
  totalEstimates: number;

  @Column({ type: 'int', default: 0 })
  wonEstimates: number;

  @Column({ type: 'int', default: 0 })
  lostEstimates: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  winRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalEstimatedValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalWonValue: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  averageAccuracy: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  averageMargin: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  averageTurnaroundDays: number;

  @Column({ type: 'json', nullable: true })
  categoryBreakdown: {
    category: string;
    count: number;
    winRate: number;
    accuracy: number;
  }[];

  @Column({ type: 'json', nullable: true })
  monthlyTrend: {
    week: number;
    estimates: number;
    wins: number;
    accuracy: number;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('estimation_historical_benchmarks')
export class HistoricalBenchmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  category: string;

  @Column({ type: 'varchar', nullable: true })
  subCategory: string;

  @Column()
  metricName: string;

  @Column()
  unit: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  averageValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  minValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  maxValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  medianValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  standardDeviation: number;

  @Column({ type: 'int' })
  sampleSize: number;

  @Column({ type: 'date' })
  periodStart: Date;

  @Column({ type: 'date' })
  periodEnd: Date;

  @Column({ type: 'json', nullable: true })
  sourceData: {
    estimateId: string;
    estimateNumber: string;
    value: number;
    date: string;
  }[];

  @Column({ type: 'json', nullable: true })
  trend: {
    period: string;
    value: number;
    changePercentage: number;
  }[];

  @Column({ type: 'varchar', nullable: true })
  region: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', nullable: true })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
