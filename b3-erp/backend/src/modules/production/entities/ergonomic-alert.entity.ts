import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'dismissed';
export type AlertCategory = 'posture' | 'repetition' | 'force' | 'environment' | 'fatigue' | 'safety';

@Entity('production_ergonomic_alerts')
export class ErgonomicAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'alert_number', unique: true })
  alertNumber: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 20 })
  category: AlertCategory;

  @Column({ type: 'varchar', length: 20 })
  severity: AlertSeverity;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: AlertStatus;

  @Column({ name: 'triggered_at', type: 'timestamp' })
  triggeredAt: Date;

  @Column({ name: 'employee_id', type: 'varchar', nullable: true })
  employeeId: string | null;

  @Column({ name: 'employee_name', type: 'varchar', nullable: true })
  employeeName: string | null;

  @Column({ name: 'workstation_id', type: 'varchar', nullable: true })
  workstationId: string | null;

  @Column({ name: 'workstation_name', type: 'varchar', nullable: true })
  workstationName: string | null;

  @Column({ name: 'work_center_id', type: 'varchar', nullable: true })
  workCenterId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  triggerConditions: {
    metric: string;
    threshold: number;
    actualValue: number;
    duration: number;
    trend: string;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  riskFactors: {
    factor: string;
    level: string;
    contribution: number;
    recommendation: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  environmentalFactors: {
    temperature: number;
    humidity: number;
    noiseLevel: number;
    lightingLevel: number;
    airQuality: string;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  workloadContext: {
    hoursWorked: number;
    breaksTaken: number;
    repetitiveMotions: number;
    heavyLifts: number;
    standingDuration: number;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  recommendedActions: {
    priority: number;
    action: string;
    timeframe: string;
    responsible: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  previousIncidents: {
    incidentId: string;
    date: string;
    category: string;
    resolution: string;
  }[] | null;

  @Column({ name: 'acknowledged_by', type: 'varchar', nullable: true })
  acknowledgedBy: string | null;

  @Column({ name: 'acknowledged_at', type: 'timestamp', nullable: true })
  acknowledgedAt: Date | null;

  @Column({ name: 'resolution_action', type: 'text', nullable: true })
  resolutionAction: string | null;

  @Column({ name: 'resolved_by', type: 'varchar', nullable: true })
  resolvedBy: string | null;

  @Column({ name: 'resolved_at', type: 'timestamp', nullable: true })
  resolvedAt: Date | null;

  @Column({ name: 'follow_up_required', type: 'boolean', default: false })
  followUpRequired: boolean;

  @Column({ name: 'follow_up_date', type: 'date', nullable: true })
  followUpDate: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
