import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProposalStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export enum ProposalType {
  STANDARD = 'standard',
  TECHNICAL = 'technical',
  COMMERCIAL = 'commercial',
  RFP_RESPONSE = 'rfp_response',
  QUOTATION = 'quotation',
}

@Entity('proposals')
export class Proposal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  proposalNumber: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ProposalType,
    default: ProposalType.STANDARD,
  })
  type: ProposalType;

  @Column({
    type: 'enum',
    enum: ProposalStatus,
    default: ProposalStatus.DRAFT,
  })
  status: ProposalStatus;

  // Client Information
  @Column({ nullable: true })
  customerId: string;

  @Column({ length: 255 })
  customerName: string;

  @Column({ nullable: true })
  customerContact: string;

  @Column({ nullable: true })
  customerEmail: string;

  // Reference
  @Column({ nullable: true })
  rfpNumber: string;

  @Column({ nullable: true })
  rfpId: string;

  @Column({ nullable: true })
  opportunityId: string;

  // Content
  @Column({ type: 'jsonb', nullable: true })
  executiveSummary: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  scopeOfWork: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  deliverables: Array<{
    name: string;
    description: string;
    timeline?: string;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  pricing: {
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
    subtotal: number;
    discount?: number;
    tax?: number;
    total: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  timeline: {
    startDate?: string;
    endDate?: string;
    milestones?: Array<{
      name: string;
      date: string;
      description?: string;
    }>;
  };

  @Column({ type: 'jsonb', nullable: true })
  termsAndConditions: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  technicalSpecifications: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  teamMembers: Array<{
    name: string;
    role: string;
    experience?: string;
  }>;

  // Metadata
  @Column({ nullable: true })
  templateId: string;

  @Column({ nullable: true })
  createdById: string;

  @Column({ nullable: true })
  assignedToId: string;

  @Column({ type: 'timestamp', nullable: true })
  validUntil: Date;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt: Date;

  // Versioning
  @Column({ default: 1 })
  version: number;

  @Column({ nullable: true })
  parentVersionId: string;

  // Document
  @Column({ nullable: true })
  pdfUrl: string;

  @Column({ type: 'simple-array', nullable: true })
  attachments: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
