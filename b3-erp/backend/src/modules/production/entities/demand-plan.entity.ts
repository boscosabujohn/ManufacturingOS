import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type DemandPlanStatus = 'draft' | 'active' | 'approved' | 'archived';
export type ForecastMethod = 'moving_average' | 'exponential_smoothing' | 'regression' | 'seasonal' | 'manual';

@Entity('production_demand_plans')
export class DemandPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'plan_number', unique: true })
  planNumber: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: DemandPlanStatus;

  @Column({ name: 'forecast_method', type: 'varchar', length: 30 })
  forecastMethod: ForecastMethod;

  @Column({ name: 'planning_horizon_months', type: 'int', default: 12 })
  planningHorizonMonths: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  demandItems: {
    itemId: string;
    itemCode: string;
    itemName: string;
    forecastQuantity: number;
    actualQuantity: number;
    variance: number;
    period: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  forecastAccuracy: {
    period: string;
    mape: number;
    bias: number;
    rmse: number;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  seasonalFactors: {
    period: string;
    factor: number;
  }[] | null;

  @Column({ name: 'total_forecast_quantity', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalForecastQuantity: number;

  @Column({ name: 'total_forecast_value', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalForecastValue: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ name: 'confidence_level', type: 'decimal', precision: 5, scale: 2, default: 95 })
  confidenceLevel: number;

  @Column({ type: 'jsonb', nullable: true })
  assumptions: string[] | null;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'approved_by', type: 'varchar', nullable: true })
  approvedBy: string | null;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
