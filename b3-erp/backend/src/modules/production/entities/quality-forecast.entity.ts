import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ForecastType = 'defect_rate' | 'yield' | 'scrap' | 'rework' | 'compliance';
export type ForecastStatus = 'draft' | 'active' | 'validated' | 'expired';
export type ForecastAccuracy = 'high' | 'medium' | 'low';

@Entity('production_quality_forecasts')
export class QualityForecast {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'forecast_number', unique: true })
  forecastNumber: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'forecast_type', type: 'varchar', length: 20 })
  forecastType: ForecastType;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: ForecastStatus;

  @Column({ name: 'forecast_period_start', type: 'date' })
  forecastPeriodStart: Date;

  @Column({ name: 'forecast_period_end', type: 'date' })
  forecastPeriodEnd: Date;

  @Column({ name: 'product_id', type: 'varchar', nullable: true })
  productId: string | null;

  @Column({ name: 'product_category', type: 'varchar', nullable: true })
  productCategory: string | null;

  @Column({ name: 'production_line_id', type: 'varchar', nullable: true })
  productionLineId: string | null;

  @Column({ name: 'work_center_id', type: 'varchar', nullable: true })
  workCenterId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  forecastData: {
    period: string;
    predictedDefectRate: number;
    predictedYield: number;
    confidenceInterval: { lower: number; upper: number };
    riskLevel: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  inputFactors: {
    factor: string;
    weight: number;
    currentValue: number;
    trend: string;
    impact: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  historicalBaseline: {
    period: string;
    actualDefectRate: number;
    actualYield: number;
  }[] | null;

  @Column({ name: 'model_name', type: 'varchar', nullable: true })
  modelName: string | null;

  @Column({ name: 'model_version', type: 'varchar', nullable: true })
  modelVersion: string | null;

  @Column({ name: 'confidence_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  confidenceScore: number | null;

  @Column({ name: 'accuracy_rating', type: 'varchar', length: 20, nullable: true })
  accuracyRating: ForecastAccuracy | null;

  @Column({ type: 'jsonb', nullable: true })
  riskAssessment: {
    riskType: string;
    probability: number;
    impact: string;
    mitigation: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  recommendations: {
    priority: number;
    area: string;
    recommendation: string;
    expectedImprovement: number;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  validationResults: {
    validatedAt: string;
    actualValue: number;
    predictedValue: number;
    accuracy: number;
    notes: string;
  }[] | null;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'validated_by', type: 'varchar', nullable: true })
  validatedBy: string | null;

  @Column({ name: 'validated_at', type: 'timestamp', nullable: true })
  validatedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
