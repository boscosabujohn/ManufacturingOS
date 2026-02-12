import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ESGCategory = 'environmental' | 'social' | 'governance';
export type KPIStatus = 'on_track' | 'at_risk' | 'off_track' | 'exceeded';
export type ReportingPeriod = 'monthly' | 'quarterly' | 'annual';

@Entity('esg_scores')
export class ESGScore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column({ type: 'date' })
  periodStartDate: Date;

  @Column({ type: 'date' })
  periodEndDate: Date;

  @Column({ type: 'varchar', length: 20 })
  reportingPeriod: ReportingPeriod;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  overallScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  environmentalScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  socialScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  governanceScore: number;

  @Column({ type: 'jsonb', nullable: true })
  kpis: {
    id: string;
    name: string;
    category: ESGCategory;
    currentValue: number;
    targetValue: number;
    unit: string;
    status: KPIStatus;
    trend: 'up' | 'down' | 'stable';
    weight: number;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  certifications: {
    name: string;
    issuer: string;
    validFrom: Date;
    validUntil: Date;
    status: 'active' | 'pending' | 'expired';
  }[];

  @Column({ type: 'jsonb', nullable: true })
  initiatives: {
    id: string;
    name: string;
    category: ESGCategory;
    status: 'planned' | 'in_progress' | 'completed';
    impact: string;
    startDate: Date;
    endDate: Date;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  benchmarks: {
    industry: string;
    averageScore: number;
    percentile: number;
    peerComparison: 'above' | 'at' | 'below';
  };

  @Column({ type: 'jsonb', nullable: true })
  riskFactors: {
    category: ESGCategory;
    risk: string;
    severity: 'low' | 'medium' | 'high';
    mitigation: string;
  }[];

  @Column({ type: 'text', nullable: true })
  executiveSummary: string;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  approvedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
