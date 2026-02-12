import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type HealthStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

@Entity('production_equipment_health')
export class EquipmentHealth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'equipment_id' })
  equipmentId: string;

  @Column({ name: 'equipment_code' })
  equipmentCode: string;

  @Column({ name: 'equipment_name' })
  equipmentName: string;

  @Column({ name: 'equipment_type' })
  equipmentType: string;

  @Column({ name: 'work_center_id', type: 'varchar', nullable: true })
  workCenterId: string | null;

  @Column({ name: 'production_line_id', type: 'varchar', nullable: true })
  productionLineId: string | null;

  @Column({ name: 'assessment_date', type: 'timestamp' })
  assessmentDate: Date;

  @Column({ name: 'health_score', type: 'decimal', precision: 5, scale: 2 })
  healthScore: number;

  @Column({ name: 'health_status', type: 'varchar', length: 20 })
  healthStatus: HealthStatus;

  @Column({ type: 'jsonb', nullable: true })
  sensorReadings: {
    sensorId: string;
    sensorName: string;
    value: number;
    unit: string;
    status: string;
    threshold: { min: number; max: number };
    trend: 'increasing' | 'stable' | 'decreasing';
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  vibrationAnalysis: {
    frequency: number;
    amplitude: number;
    status: string;
    dominantFrequencies: number[];
    alerts: string[];
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  thermalAnalysis: {
    currentTemperature: number;
    ambientTemperature: number;
    maxOperatingTemp: number;
    hotspots: { location: string; temperature: number }[];
    trend: string;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  wearAnalysis: {
    component: string;
    currentWear: number;
    maxWear: number;
    remainingLife: number;
    recommendedAction: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  predictedFailures: {
    component: string;
    failureType: string;
    probability: number;
    estimatedTimeToFailure: number;
    impact: string;
    recommendedAction: string;
  }[] | null;

  @Column({ name: 'mtbf_hours', type: 'decimal', precision: 10, scale: 2, nullable: true })
  mtbfHours: number | null;

  @Column({ name: 'mttr_hours', type: 'decimal', precision: 10, scale: 2, nullable: true })
  mttrHours: number | null;

  @Column({ name: 'total_operating_hours', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalOperatingHours: number;

  @Column({ name: 'hours_since_maintenance', type: 'decimal', precision: 10, scale: 2, default: 0 })
  hoursSinceMaintenance: number;

  @Column({ name: 'next_maintenance_due', type: 'timestamp', nullable: true })
  nextMaintenanceDue: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  maintenanceRecommendations: {
    type: string;
    priority: string;
    description: string;
    estimatedCost: number;
    estimatedDowntime: number;
  }[] | null;

  @Column({ name: 'recorded_by' })
  recordedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
