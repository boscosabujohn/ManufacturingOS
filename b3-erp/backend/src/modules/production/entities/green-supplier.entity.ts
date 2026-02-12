import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type CertificationType = 'iso14001' | 'iso50001' | 'leed' | 'energy_star' | 'fsc' | 'rainforest_alliance' | 'fair_trade' | 'b_corp' | 'carbon_neutral' | 'other';
export type SupplierTier = 'platinum' | 'gold' | 'silver' | 'bronze' | 'standard';
export type AssessmentStatus = 'pending' | 'in_progress' | 'completed' | 'expired';

@Entity('green_suppliers')
export class GreenSupplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  vendorId: string;

  @Column()
  vendorName: string;

  @Column({ type: 'varchar', length: 20 })
  tier: SupplierTier;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  sustainabilityScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  environmentalScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  socialScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  governanceScore: number;

  @Column({ type: 'jsonb', nullable: true })
  certifications: {
    type: CertificationType;
    name: string;
    certificateNumber: string;
    issuedBy: string;
    issuedDate: Date;
    expiryDate: Date;
    verificationUrl: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  environmentalMetrics: {
    carbonFootprint: number;
    renewableEnergyUsage: number;
    wasteRecyclingRate: number;
    waterEfficiency: number;
    emissionsReduction: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  assessmentHistory: {
    assessmentDate: Date;
    assessor: string;
    score: number;
    findings: string;
    improvementAreas: string[];
    nextAssessmentDate: Date;
  }[];

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  assessmentStatus: AssessmentStatus;

  @Column({ type: 'date', nullable: true })
  lastAssessmentDate: Date;

  @Column({ type: 'date', nullable: true })
  nextAssessmentDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  sustainabilityCommitments: {
    commitment: string;
    targetDate: Date;
    status: 'on_track' | 'at_risk' | 'achieved';
    progress: number;
  }[];

  @Column({ type: 'boolean', default: false })
  isPreferred: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
