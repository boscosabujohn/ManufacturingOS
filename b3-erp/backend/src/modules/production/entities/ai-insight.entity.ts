import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type InsightType = 'anomaly' | 'prediction' | 'recommendation' | 'alert' | 'trend';
export type InsightStatus = 'new' | 'acknowledged' | 'acted_upon' | 'dismissed' | 'expired';
export type InsightPriority = 'critical' | 'high' | 'medium' | 'low';
export type InsightCategory = 'quality' | 'maintenance' | 'efficiency' | 'cost' | 'safety' | 'capacity';

@Entity('production_ai_insights')
export class AIInsight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'insight_number', unique: true })
  insightNumber: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'insight_type', type: 'varchar', length: 20 })
  insightType: InsightType;

  @Column({ type: 'varchar', length: 20 })
  category: InsightCategory;

  @Column({ type: 'varchar', length: 20, default: 'new' })
  status: InsightStatus;

  @Column({ type: 'varchar', length: 20 })
  priority: InsightPriority;

  @Column({ name: 'confidence_score', type: 'decimal', precision: 5, scale: 2 })
  confidenceScore: number;

  @Column({ name: 'generated_at', type: 'timestamp' })
  generatedAt: Date;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  relatedEntities: {
    entityType: string;
    entityId: string;
    entityName: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  dataPoints: {
    metric: string;
    value: number;
    timestamp: string;
    isAnomaly: boolean;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  analysis: {
    method: string;
    factors: { factor: string; contribution: number }[];
    historicalComparison: { period: string; value: number }[];
    trendDirection: string;
    statisticalSignificance: number;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  recommendedActions: {
    priority: number;
    action: string;
    expectedBenefit: string;
    estimatedCost: number;
    implementationTime: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  predictedImpact: {
    metric: string;
    currentValue: number;
    predictedValue: number;
    timeframe: string;
    probability: number;
  } | null;

  @Column({ name: 'model_name', type: 'varchar', nullable: true })
  modelName: string | null;

  @Column({ name: 'model_version', type: 'varchar', nullable: true })
  modelVersion: string | null;

  @Column({ name: 'acknowledged_by', type: 'varchar', nullable: true })
  acknowledgedBy: string | null;

  @Column({ name: 'acknowledged_at', type: 'timestamp', nullable: true })
  acknowledgedAt: Date | null;

  @Column({ name: 'action_taken', type: 'text', nullable: true })
  actionTaken: string | null;

  @Column({ name: 'action_by', type: 'varchar', nullable: true })
  actionBy: string | null;

  @Column({ name: 'action_at', type: 'timestamp', nullable: true })
  actionAt: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  feedback: {
    wasHelpful: boolean;
    accuracyRating: number;
    comments: string;
    submittedBy: string;
    submittedAt: string;
  } | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
