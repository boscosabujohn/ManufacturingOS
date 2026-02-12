import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ProcessCategory = 'production' | 'supply_chain' | 'it_systems' | 'facilities' | 'workforce' | 'logistics' | 'finance' | 'customer_service';
export type BCPHealthStatus = 'healthy' | 'warning' | 'critical' | 'down';
export type RecoveryPriority = 'critical' | 'high' | 'medium' | 'low';

@Entity('business_continuities')
export class BusinessContinuity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  processName: string;

  @Column({ type: 'varchar', length: 50 })
  category: ProcessCategory;

  @Column({ type: 'varchar', length: 20 })
  currentStatus: BCPHealthStatus;

  @Column({ type: 'varchar', length: 20 })
  priority: RecoveryPriority;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  healthScore: number;

  @Column({ type: 'int' })
  rto: number; // Recovery Time Objective in hours

  @Column({ type: 'int' })
  rpo: number; // Recovery Point Objective in hours

  @Column({ type: 'int', nullable: true })
  mtpd: number; // Maximum Tolerable Period of Disruption in hours

  @Column({ type: 'jsonb', nullable: true })
  dependencies: {
    processId: string;
    processName: string;
    dependencyType: 'upstream' | 'downstream' | 'supporting';
    criticality: RecoveryPriority;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  recoveryProcedures: {
    step: number;
    action: string;
    responsible: string;
    estimatedTime: number;
    resources: string[];
    checkpoints: string[];
  }[];

  @Column({ type: 'jsonb', nullable: true })
  backupSystems: {
    systemName: string;
    location: string;
    lastTested: Date;
    testResult: 'passed' | 'failed' | 'partial';
    switchoverTime: number;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  contactList: {
    role: string;
    name: string;
    phone: string;
    email: string;
    backup: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  drillHistory: {
    drillDate: Date;
    drillType: 'tabletop' | 'functional' | 'full_scale';
    outcome: 'successful' | 'partial' | 'failed';
    actualRecoveryTime: number;
    lessonsLearned: string[];
    improvements: string[];
  }[];

  @Column({ type: 'jsonb', nullable: true })
  incidentHistory: {
    incidentDate: Date;
    incidentType: string;
    duration: number;
    impact: string;
    resolution: string;
    rootCause: string;
  }[];

  @Column({ type: 'date', nullable: true })
  lastReviewDate: Date;

  @Column({ type: 'date', nullable: true })
  nextReviewDate: Date;

  @Column({ type: 'date', nullable: true })
  lastDrillDate: Date;

  @Column({ type: 'date', nullable: true })
  nextDrillDate: Date;

  @Column({ type: 'varchar', nullable: true })
  planOwner: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
