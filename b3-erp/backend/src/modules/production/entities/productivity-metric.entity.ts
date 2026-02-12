import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type MetricPeriod = 'hourly' | 'daily' | 'weekly' | 'monthly';
export type MetricType = 'labor' | 'machine' | 'material' | 'overall';

@Entity('production_productivity_metrics')
export class ProductivityMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'metric_date', type: 'date' })
  metricDate: Date;

  @Column({ name: 'period_type', type: 'varchar', length: 20 })
  periodType: MetricPeriod;

  @Column({ name: 'metric_type', type: 'varchar', length: 20 })
  metricType: MetricType;

  @Column({ name: 'work_center_id', type: 'varchar', nullable: true })
  workCenterId: string | null;

  @Column({ name: 'production_line_id', type: 'varchar', nullable: true })
  productionLineId: string | null;

  @Column({ name: 'shift_id', type: 'varchar', nullable: true })
  shiftId: string | null;

  @Column({ name: 'operator_id', type: 'varchar', nullable: true })
  operatorId: string | null;

  @Column({ name: 'planned_output', type: 'decimal', precision: 15, scale: 4 })
  plannedOutput: number;

  @Column({ name: 'actual_output', type: 'decimal', precision: 15, scale: 4 })
  actualOutput: number;

  @Column({ name: 'output_variance', type: 'decimal', precision: 15, scale: 4 })
  outputVariance: number;

  @Column({ name: 'output_variance_percentage', type: 'decimal', precision: 5, scale: 2 })
  outputVariancePercentage: number;

  @Column({ name: 'output_uom' })
  outputUom: string;

  @Column({ name: 'planned_hours', type: 'decimal', precision: 10, scale: 2 })
  plannedHours: number;

  @Column({ name: 'actual_hours', type: 'decimal', precision: 10, scale: 2 })
  actualHours: number;

  @Column({ name: 'productive_hours', type: 'decimal', precision: 10, scale: 2 })
  productiveHours: number;

  @Column({ name: 'non_productive_hours', type: 'decimal', precision: 10, scale: 2 })
  nonProductiveHours: number;

  @Column({ name: 'efficiency_percentage', type: 'decimal', precision: 5, scale: 2 })
  efficiencyPercentage: number;

  @Column({ name: 'utilization_percentage', type: 'decimal', precision: 5, scale: 2 })
  utilizationPercentage: number;

  @Column({ name: 'output_per_hour', type: 'decimal', precision: 15, scale: 4 })
  outputPerHour: number;

  @Column({ name: 'output_per_labor_hour', type: 'decimal', precision: 15, scale: 4, nullable: true })
  outputPerLaborHour: number | null;

  @Column({ type: 'jsonb', nullable: true })
  laborMetrics: {
    totalLaborHours: number;
    directLaborHours: number;
    indirectLaborHours: number;
    overtimeHours: number;
    laborCost: number;
    costPerUnit: number;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  qualityMetrics: {
    totalProduced: number;
    goodUnits: number;
    defectiveUnits: number;
    reworkUnits: number;
    scrapUnits: number;
    firstPassYield: number;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  costMetrics: {
    laborCost: number;
    materialCost: number;
    overheadCost: number;
    totalCost: number;
    costPerUnit: number;
  } | null;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ name: 'benchmark_productivity', type: 'decimal', precision: 5, scale: 2, nullable: true })
  benchmarkProductivity: number | null;

  @Column({ name: 'recorded_by' })
  recordedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
