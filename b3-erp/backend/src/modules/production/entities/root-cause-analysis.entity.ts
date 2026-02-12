import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DowntimeRecord } from './downtime-record.entity';

export type RCAStatus = 'open' | 'in_progress' | 'completed' | 'closed';
export type RCAMethodology = 'five_whys' | 'fishbone' | 'fmea' | 'fault_tree' | 'pareto';

@Entity('production_root_cause_analyses')
export class RootCauseAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'rca_number', unique: true })
  rcaNumber: string;

  @Column({ name: 'downtime_record_id', type: 'varchar', nullable: true })
  downtimeRecordId: string | null;

  @ManyToOne(() => DowntimeRecord, { nullable: true })
  @JoinColumn({ name: 'downtime_record_id' })
  downtimeRecord: DowntimeRecord;

  @Column()
  title: string;

  @Column({ type: 'text' })
  problemStatement: string;

  @Column({ type: 'varchar', length: 20, default: 'open' })
  status: RCAStatus;

  @Column({ type: 'varchar', length: 20 })
  methodology: RCAMethodology;

  @Column({ name: 'analysis_date', type: 'date' })
  analysisDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  fiveWhys: {
    whyNumber: number;
    question: string;
    answer: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  fishboneDiagram: {
    category: string;
    causes: {
      cause: string;
      subCauses: string[];
    }[];
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  contributingFactors: {
    factor: string;
    category: string;
    impact: 'high' | 'medium' | 'low';
    description: string;
  }[] | null;

  @Column({ name: 'root_cause', type: 'text', nullable: true })
  rootCause: string | null;

  @Column({ type: 'jsonb', nullable: true })
  correctiveActions: {
    action: string;
    assignedTo: string;
    dueDate: string;
    status: string;
    completedDate: string;
    effectiveness: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  preventiveActions: {
    action: string;
    assignedTo: string;
    dueDate: string;
    status: string;
    completedDate: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  lessonsLearned: string[] | null;

  @Column({ name: 'verification_status', type: 'varchar', length: 20, nullable: true })
  verificationStatus: string | null;

  @Column({ name: 'verification_date', type: 'date', nullable: true })
  verificationDate: Date | null;

  @Column({ name: 'verified_by', type: 'varchar', nullable: true })
  verifiedBy: string | null;

  @Column({ type: 'jsonb', nullable: true })
  teamMembers: {
    userId: string;
    name: string;
    role: string;
  }[] | null;

  @Column({ name: 'lead_investigator' })
  leadInvestigator: string;

  @Column({ type: 'jsonb', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
  }[] | null;

  @Column({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
