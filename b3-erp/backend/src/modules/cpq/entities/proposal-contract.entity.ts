import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProposalStatus {
  DRAFT = 'Draft',
  IN_REVIEW = 'In Review',
  APPROVED = 'Approved',
  SENT = 'Sent',
  VIEWED = 'Viewed',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  EXPIRED = 'Expired',
}

// Proposals
@Entity('cpq_proposals')
export class Proposal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  proposalNumber: string;

  @Column()
  name: string;

  @Column()
  customerId: string;

  @Column({ type: 'varchar', nullable: true })
  customerName: string;

  @Column({ type: 'varchar', nullable: true })
  contactId: string;

  @Column({ type: 'varchar', nullable: true })
  quoteId: string;

  @Column({ type: 'varchar', nullable: true })
  opportunityId: string;

  @Column({
    type: 'enum',
    enum: ProposalStatus,
    default: ProposalStatus.DRAFT,
  })
  status: ProposalStatus;

  @Column({ type: 'varchar', nullable: true })
  templateId: string;

  // Content
  @Column({ type: 'text', nullable: true })
  coverLetter: string;

  @Column({ type: 'text', nullable: true })
  executiveSummary: string;

  @Column({ type: 'json', nullable: true })
  sections: {
    sectionId: string;
    title: string;
    content: string;
    order: number;
    isVisible: boolean;
  }[];

  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }[];

  // Pricing Summary
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalValue: number;

  @Column({ default: 'USD' })
  currency: string;

  // Dates
  @Column({ type: 'date' })
  proposalDate: Date;

  @Column({ type: 'date', nullable: true })
  expirationDate: Date;

  @Column({ type: 'int', default: 30 })
  validityDays: number;

  // E-Signature
  @Column({ default: false })
  requiresSignature: boolean;

  @Column({ type: 'varchar', nullable: true })
  signatureRequestId: string;

  @Column({ type: 'timestamp', nullable: true })
  signedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  signedBy: string;

  @Column({ type: 'text', nullable: true })
  signatureData: string;

  // Tracking
  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastViewedAt: Date;

  @Column({ type: 'json', nullable: true })
  viewHistory: {
    viewedAt: Date;
    viewerEmail?: string;
    duration?: number;
    pagesViewed?: number[];
  }[];

  // Workflow
  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ type: 'varchar', nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;

  @Column({ type: 'varchar', nullable: true })
  sentBy: string;

  @Column({ type: 'timestamp', nullable: true })
  customerResponseAt: Date;

  @Column({ type: 'text', nullable: true })
  customerFeedback: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Proposal Templates
@Entity('cpq_proposal_templates')
export class ProposalTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ type: 'json' })
  sections: {
    sectionId: string;
    title: string;
    defaultContent: string;
    order: number;
    isRequired: boolean;
    isEditable: boolean;
  }[];

  @Column({ type: 'json', nullable: true })
  styling: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    headerImageUrl: string;
    fontFamily: string;
  };

  @Column({ type: 'text', nullable: true })
  defaultCoverLetter: string;

  @Column({ type: 'text', nullable: true })
  defaultFooter: string;

  @Column({ type: 'int', default: 0 })
  usageCount: number;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Content Library
@Entity('cpq_content_library')
export class ContentLibraryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['text_block', 'image', 'document', 'video', 'case_study', 'testimonial'],
    default: 'text_block',
  })
  contentType: 'text_block' | 'image' | 'document' | 'video' | 'case_study' | 'testimonial';

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'varchar', nullable: true })
  fileUrl: string;

  @Column({ type: 'varchar', nullable: true })
  thumbnailUrl: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, unknown>;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  usageCount: number;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum ContractStatus {
  DRAFT = 'Draft',
  PENDING_APPROVAL = 'Pending Approval',
  APPROVED = 'Approved',
  SENT = 'Sent for Signature',
  PARTIALLY_SIGNED = 'Partially Signed',
  FULLY_SIGNED = 'Fully Signed',
  ACTIVE = 'Active',
  EXPIRED = 'Expired',
  TERMINATED = 'Terminated',
  RENEWED = 'Renewed',
}

// Contracts
@Entity('cpq_contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  contractNumber: string;

  @Column()
  name: string;

  @Column()
  customerId: string;

  @Column({ type: 'varchar', nullable: true })
  customerName: string;

  @Column({ type: 'varchar', nullable: true })
  quoteId: string;

  @Column({ type: 'varchar', nullable: true })
  proposalId: string;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.DRAFT,
  })
  status: ContractStatus;

  @Column({ type: 'varchar', nullable: true })
  templateId: string;

  @Column({
    type: 'enum',
    enum: ['standard', 'master_agreement', 'amendment', 'renewal', 'sow'],
    default: 'standard',
  })
  contractType: 'standard' | 'master_agreement' | 'amendment' | 'renewal' | 'sow';

  // Value
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalValue: number;

  @Column({ default: 'USD' })
  currency: string;

  // Dates
  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'int', nullable: true })
  termMonths: number;

  @Column({ default: false })
  autoRenewal: boolean;

  @Column({ type: 'int', nullable: true })
  renewalNoticeDays: number;

  // Content
  @Column({ type: 'json', nullable: true })
  clauses: {
    clauseId: string;
    title: string;
    content: string;
    order: number;
    isModified: boolean;
    isRequired: boolean;
  }[];

  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
  }[];

  // Signatories
  @Column({ type: 'json', nullable: true })
  signatories: {
    name: string;
    email: string;
    title: string;
    organization: string;
    signedAt?: Date;
    signatureData?: string;
    signatureStatus: 'pending' | 'signed' | 'declined';
  }[];

  @Column({ type: 'varchar', nullable: true })
  signatureRequestId: string;

  // Workflow
  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ type: 'varchar', nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'text', nullable: true })
  approvalNotes: string;

  // Renewal
  @Column({ type: 'varchar', nullable: true })
  parentContractId: string;

  @Column({ type: 'int', default: 1 })
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Contract Templates
@Entity('cpq_contract_templates')
export class ContractTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['standard', 'master_agreement', 'amendment', 'renewal', 'sow'],
    default: 'standard',
  })
  contractType: 'standard' | 'master_agreement' | 'amendment' | 'renewal' | 'sow';

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ type: 'json' })
  clauses: {
    clauseId: string;
    title: string;
    content: string;
    order: number;
    isRequired: boolean;
    isEditable: boolean;
    category: string;
  }[];

  @Column({ type: 'int', default: 12 })
  defaultTermMonths: number;

  @Column({ type: 'int', default: 0 })
  usageCount: number;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Contract Clauses Library
@Entity('cpq_contract_clauses')
export class ContractClause {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({
    type: 'enum',
    enum: ['standard', 'legal_required', 'optional', 'custom'],
    default: 'standard',
  })
  clauseType: 'standard' | 'legal_required' | 'optional' | 'custom';

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  usageCount: number;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ type: 'varchar', nullable: true })
  approvedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
