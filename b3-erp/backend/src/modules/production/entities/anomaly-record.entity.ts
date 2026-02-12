import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type AnomalyStatus = 'detected' | 'investigating' | 'resolved' | 'false_positive';
export type AnomalySeverity = 'critical' | 'high' | 'medium' | 'low';
export type AnomalyType = 'statistical' | 'pattern' | 'threshold' | 'contextual' | 'collective';

@Entity('production_anomaly_records')
export class AnomalyRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'anomaly_number', unique: true })
  anomalyNumber: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'anomaly_type', type: 'varchar', length: 20 })
  anomalyType: AnomalyType;

  @Column({ type: 'varchar', length: 20, default: 'detected' })
  status: AnomalyStatus;

  @Column({ type: 'varchar', length: 20 })
  severity: AnomalySeverity;

  @Column({ name: 'detected_at', type: 'timestamp' })
  detectedAt: Date;

  @Column({ name: 'metric_name' })
  metricName: string;

  @Column({ name: 'metric_value', type: 'decimal', precision: 15, scale: 4 })
  metricValue: number;

  @Column({ name: 'expected_value', type: 'decimal', precision: 15, scale: 4, nullable: true })
  expectedValue: number | null;

  @Column({ name: 'deviation_percentage', type: 'decimal', precision: 10, scale: 2, nullable: true })
  deviationPercentage: number | null;

  @Column({ name: 'anomaly_score', type: 'decimal', precision: 5, scale: 2 })
  anomalyScore: number;

  @Column({ type: 'jsonb', nullable: true })
  context: {
    workCenterId: string;
    machineId: string;
    operatorId: string;
    workOrderId: string;
    shiftId: string;
    productId: string;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  historicalData: {
    timestamp: string;
    value: number;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  statisticalAnalysis: {
    mean: number;
    standardDeviation: number;
    zScore: number;
    percentile: number;
    iqrOutlier: boolean;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  possibleCauses: {
    cause: string;
    probability: number;
    relatedFactors: string[];
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  correlatedAnomalies: {
    anomalyId: string;
    metric: string;
    correlationScore: number;
  }[] | null;

  @Column({ name: 'detection_model', type: 'varchar', nullable: true })
  detectionModel: string | null;

  @Column({ name: 'model_confidence', type: 'decimal', precision: 5, scale: 2, nullable: true })
  modelConfidence: number | null;

  @Column({ name: 'investigated_by', type: 'varchar', nullable: true })
  investigatedBy: string | null;

  @Column({ name: 'investigation_notes', type: 'text', nullable: true })
  investigationNotes: string | null;

  @Column({ name: 'root_cause', type: 'text', nullable: true })
  rootCause: string | null;

  @Column({ name: 'resolution_action', type: 'text', nullable: true })
  resolutionAction: string | null;

  @Column({ name: 'resolved_by', type: 'varchar', nullable: true })
  resolvedBy: string | null;

  @Column({ name: 'resolved_at', type: 'timestamp', nullable: true })
  resolvedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
