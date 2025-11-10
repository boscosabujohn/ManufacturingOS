import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { QCParameter } from './qc-parameter.entity';

export enum QCTemplateType {
  INCOMING = 'Incoming',
  IN_PROCESS = 'In-Process',
  FINAL = 'Final',
  SUPPLIER = 'Supplier',
  PERIODIC = 'Periodic',
  CUSTOM = 'Custom',
}

export enum QCTemplateStatus {
  DRAFT = 'Draft',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  OBSOLETE = 'Obsolete',
}

@Entity('qc_templates')
export class QCTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  templateCode: string;

  @Column({ length: 255 })
  templateName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: QCTemplateType, default: QCTemplateType.INCOMING })
  templateType: QCTemplateType;

  @Column({ type: 'enum', enum: QCTemplateStatus, default: QCTemplateStatus.DRAFT })
  status: QCTemplateStatus;

  @Column({ type: 'int', default: 1 })
  version: number;

  // Item/Product associations
  @Column({ nullable: true })
  itemId: string;

  @Column({ length: 100, nullable: true })
  itemCode: string;

  @Column({ length: 255, nullable: true })
  itemName: string;

  @Column({ nullable: true })
  itemCategory: string;

  // Supplier association
  @Column({ nullable: true })
  supplierId: string;

  @Column({ length: 255, nullable: true })
  supplierName: string;

  // Process/Operation association
  @Column({ nullable: true })
  processId: string;

  @Column({ length: 100, nullable: true })
  processCode: string;

  @Column({ length: 255, nullable: true })
  processName: string;

  // Inspection settings
  @Column({ type: 'int', default: 100 })
  sampleSize: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 2.5 })
  acceptableQualityLevel: number; // AQL %

  @Column({ length: 50, default: 'Normal' })
  inspectionLevel: string; // Normal, Reduced, Tightened

  @Column({ length: 50, default: 'Single' })
  samplingPlan: string; // Single, Double, Multiple

  @Column({ default: true })
  requirePhotos: boolean;

  @Column({ default: false })
  requireSignature: boolean;

  // Frequency
  @Column({ length: 50, nullable: true })
  inspectionFrequency: string; // Per Lot, Per Hour, Per Shift, Daily, Weekly

  @Column({ type: 'int', nullable: true })
  frequencyValue: number;

  // Acceptance criteria
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  acceptanceThreshold: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  rejectionThreshold: number;

  // Auto actions
  @Column({ default: false })
  autoReject: boolean;

  @Column({ default: false })
  autoCreateNCR: boolean;

  @Column({ default: false })
  autoNotify: boolean;

  @Column({ type: 'json', nullable: true })
  notificationEmails: string[];

  // Reference standards
  @Column({ length: 255, nullable: true })
  referenceStandard: string; // ISO, ASTM, etc.

  @Column({ length: 100, nullable: true })
  referenceDocument: string;

  // Instructions
  @Column({ type: 'text', nullable: true })
  inspectionInstructions: string;

  @Column({ type: 'json', nullable: true })
  checklistItems: {
    sequence: number;
    item: string;
    required: boolean;
  }[];

  // Attachments
  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];

  // Workflow
  @Column({ length: 100, nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'date', nullable: true })
  effectiveDate: Date;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ type: 'date', nullable: true })
  lastReviewDate: Date;

  @Column({ type: 'date', nullable: true })
  nextReviewDate: Date;

  // Additional
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

  // Metadata
  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => QCParameter, (parameter) => parameter.qcTemplate, { cascade: true })
  parameters: QCParameter[];
}
