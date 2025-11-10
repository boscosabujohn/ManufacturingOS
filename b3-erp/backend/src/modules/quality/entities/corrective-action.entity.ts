import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CorrectiveActionStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  APPROVED = 'Approved',
  IN_PROGRESS = 'In Progress',
  IMPLEMENTED = 'Implemented',
  PENDING_VERIFICATION = 'Pending Verification',
  VERIFIED = 'Verified',
  CLOSED = 'Closed',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled',
}

export enum CorrectiveActionPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
  CRITICAL = 'Critical',
}

@Entity('corrective_actions')
export class CorrectiveAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  caNumber: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: CorrectiveActionStatus, default: CorrectiveActionStatus.DRAFT })
  status: CorrectiveActionStatus;

  @Column({ type: 'enum', enum: CorrectiveActionPriority, default: CorrectiveActionPriority.MEDIUM })
  priority: CorrectiveActionPriority;

  // Source reference
  @Column({ nullable: true })
  ncrId: string;

  @Column({ length: 100, nullable: true })
  ncrNumber: string;

  @Column({ nullable: true })
  capaId: string;

  @Column({ length: 100, nullable: true })
  capaNumber: string;

  @Column({ nullable: true })
  auditId: string;

  @Column({ length: 100, nullable: true })
  auditNumber: string;

  @Column({ length: 255, nullable: true })
  sourceType: string; // NCR, CAPA, Audit, Customer Complaint, etc.

  @Column({ nullable: true })
  sourceId: string;

  @Column({ length: 100, nullable: true })
  sourceReference: string;

  // Problem definition
  @Column({ type: 'text' })
  problemStatement: string;

  @Column({ type: 'text', nullable: true })
  problemDetails: string;

  @Column({ type: 'date', nullable: true })
  problemDetectedDate: Date;

  @Column({ type: 'date', nullable: true })
  problemOccurrenceDate: Date;

  // Root cause
  @Column({ type: 'text' })
  rootCause: string;

  @Column({ length: 255, nullable: true })
  rootCauseMethod: string; // 5 Why, Fishbone, Fault Tree, etc.

  @Column({ type: 'json', nullable: true })
  rootCauseCategories: string[];

  // Corrective action plan
  @Column({ type: 'text' })
  actionPlan: string;

  @Column({ type: 'text', nullable: true })
  actionDetails: string;

  @Column({ type: 'json', nullable: true })
  actionSteps: {
    stepNumber: number;
    description: string;
    assignedTo: string;
    assignedToName: string;
    dueDate: Date;
    status: string;
    completedDate: Date;
    completedBy: string;
    remarks: string;
  }[];

  // Assignment
  @Column({ nullable: true })
  assignedToId: string;

  @Column({ length: 255, nullable: true })
  assignedToName: string;

  @Column({ nullable: true })
  departmentId: string;

  @Column({ length: 255, nullable: true })
  departmentName: string;

  @Column({ type: 'date', nullable: true })
  assignedDate: Date;

  // Dates
  @Column({ type: 'date' })
  targetDate: Date;

  @Column({ type: 'date', nullable: true })
  actualStartDate: Date;

  @Column({ type: 'date', nullable: true })
  actualCompletionDate: Date;

  @Column({ type: 'date', nullable: true })
  implementationDate: Date;

  @Column({ type: 'date', nullable: true })
  verificationDate: Date;

  // Implementation
  @Column({ type: 'text', nullable: true })
  implementationDetails: string;

  @Column({ length: 255, nullable: true })
  implementedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  implementedAt: Date;

  @Column({ default: false })
  isImplemented: boolean;

  // Verification
  @Column({ type: 'text', nullable: true })
  verificationMethod: string;

  @Column({ type: 'text', nullable: true })
  verificationCriteria: string;

  @Column({ type: 'text', nullable: true })
  verificationResults: string;

  @Column({ length: 255, nullable: true })
  verifiedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isEffective: boolean;

  // Effectiveness evaluation
  @Column({ type: 'text', nullable: true })
  effectivenessEvaluation: string;

  @Column({ type: 'date', nullable: true })
  effectivenessEvaluationDate: Date;

  @Column({ length: 255, nullable: true })
  effectivenessEvaluatedBy: string;

  @Column({ type: 'int', nullable: true })
  effectivenessScore: number; // 1-10 scale

  // Resources
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  estimatedCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  actualCost: number;

  @Column({ type: 'int', nullable: true })
  estimatedHours: number;

  @Column({ type: 'int', nullable: true })
  actualHours: number;

  @Column({ type: 'text', nullable: true })
  resourcesRequired: string;

  // Impact assessment
  @Column({ type: 'text', nullable: true })
  impactAssessment: string;

  @Column({ type: 'json', nullable: true })
  affectedAreas: string[];

  @Column({ default: false })
  requiresTraining: boolean;

  @Column({ type: 'text', nullable: true })
  trainingDetails: string;

  @Column({ default: false })
  requiresDocumentUpdate: boolean;

  @Column({ type: 'text', nullable: true })
  documentUpdateDetails: string;

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
  submittedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date;

  @Column({ length: 100, nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ length: 100, nullable: true })
  rejectedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ length: 100, nullable: true })
  closedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;

  @Column({ length: 100, nullable: true })
  cancelledBy: string;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  // Progress tracking
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progressPercentage: number;

  @Column({ default: false })
  isOverdue: boolean;

  @Column({ type: 'int', nullable: true })
  daysOverdue: number;

  // Additional
  @Column({ type: 'text', nullable: true })
  lessonsLearned: string;

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
}
