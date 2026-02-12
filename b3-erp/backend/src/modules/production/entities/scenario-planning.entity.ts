import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type DisruptionType = 'supplier_failure' | 'demand_spike' | 'capacity_loss' | 'logistics_disruption' | 'natural_disaster' | 'market_shift' | 'regulatory_change' | 'pandemic' | 'cyber_attack';
export type ImpactSeverity = 'minimal' | 'moderate' | 'significant' | 'severe' | 'catastrophic';
export type ScenarioStatus = 'draft' | 'analyzed' | 'approved' | 'archived';

@Entity('scenario_plannings')
export class ScenarioPlanning {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  scenarioName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  disruptionType: DisruptionType;

  @Column({ type: 'varchar', length: 20 })
  severity: ImpactSeverity;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  probability: number;

  @Column({ type: 'jsonb', nullable: true })
  parameters: {
    name: string;
    baseValue: number;
    scenarioValue: number;
    unit: string;
    impact: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  impactAnalysis: {
    area: string;
    metric: string;
    baselineValue: number;
    projectedValue: number;
    variance: number;
    financialImpact: number;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  affectedResources: {
    resourceType: 'supplier' | 'facility' | 'product' | 'route' | 'workforce';
    resourceId: string;
    resourceName: string;
    impactLevel: ImpactSeverity;
    recoveryTime: number;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  mitigationStrategies: {
    strategy: string;
    cost: number;
    effectivenessScore: number;
    implementationTime: number;
    priority: 'low' | 'medium' | 'high';
    status: 'proposed' | 'approved' | 'implemented';
  }[];

  @Column({ type: 'jsonb', nullable: true })
  recoveryPlan: {
    phase: string;
    actions: string[];
    duration: number;
    resources: string[];
    milestones: string[];
  }[];

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  estimatedFinancialImpact: number;

  @Column({ type: 'int', nullable: true })
  estimatedRecoveryDays: number;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: ScenarioStatus;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ type: 'varchar', nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'date', nullable: true })
  lastReviewDate: Date;

  @Column({ type: 'date', nullable: true })
  nextReviewDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
