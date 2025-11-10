import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CAPAStatus {
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

export enum CAPAPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
  CRITICAL = 'Critical',
}

export enum CAPAType {
  CORRECTIVE = 'Corrective',
  PREVENTIVE = 'Preventive',
  COMBINED = 'Combined',
}

@Entity('capas')
export class CAPA {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  capaNumber: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: CAPAStatus, default: CAPAStatus.DRAFT })
  status: CAPAStatus;

  @Column({ type: 'enum', enum: CAPAPriority, default: CAPAPriority.MEDIUM })
  priority: CAPAPriority;

  @Column({ type: 'enum', enum: CAPAType, default: CAPAType.COMBINED })
  capaType: CAPAType;

  // Source reference
  @Column({ nullable: true })
  ncrId: string;

  @Column({ length: 100, nullable: true })
  ncrNumber: string;

  @Column({ nullable: true })
  auditId: string;

  @Column({ length: 100, nullable: true })
  auditNumber: string;

  @Column({ nullable: true })
  inspectionId: string;

  @Column({ length: 100, nullable: true })
  inspectionNumber: string;

  @Column({ length: 255, nullable: true })
  sourceType: string; // NCR, Audit, Inspection, Customer Complaint, Risk Assessment

  @Column({ nullable: true })
  sourceId: string;

  @Column({ length: 100, nullable: true })
  sourceReference: string;

  // Problem/Opportunity
  @Column({ type: 'text' })
  problemStatement: string;

  @Column({ type: 'text', nullable: true })
  problemDetails: string;

  @Column({ type: 'date', nullable: true })
  problemDetectedDate: Date;

  @Column({ type: 'date', nullable: true })
  problemOccurrenceDate: Date;

  // Root cause analysis
  @Column({ type: 'text' })
  rootCauseAnalysis: string;

  @Column({ length: 255, nullable: true })
  rootCauseMethod: string; // 5 Why, Fishbone, Fault Tree, etc.

  @Column({ type: 'json', nullable: true })
  rootCauseCategories: string[];

  @Column({ type: 'text', nullable: true })
  identifiedRootCauses: string;

  // Immediate containment action
  @Column({ type: 'text', nullable: true })
  containmentAction: string;

  @Column({ type: 'date', nullable: true })
  containmentActionDate: Date;

  @Column({ length: 255, nullable: true })
  containmentActionBy: string;

  @Column({ default: false })
  isContained: boolean;

  // Corrective Action
  @Column({ nullable: true })
  correctiveActionId: string;

  @Column({ length: 100, nullable: true })
  correctiveActionNumber: string;

  @Column({ type: 'text', nullable: true })
  correctiveActionPlan: string;

  @Column({ type: 'text', nullable: true })
  correctiveActionDetails: string;

  // Preventive Action
  @Column({ nullable: true })
  preventiveActionId: string;

  @Column({ length: 100, nullable: true })
  preventiveActionNumber: string;

  @Column({ type: 'text', nullable: true })
  preventiveActionPlan: string;

  @Column({ type: 'text', nullable: true })
  preventiveActionDetails: string;

  // Combined action plan
  @Column({ type: 'text' })
  actionPlan: string;

  @Column({ type: 'json', nullable: true })
  actionSteps: {
    stepNumber: number;
    stepType: string; // Corrective, Preventive
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
  ownerId: string;

  @Column({ length: 255, nullable: true })
  ownerName: string;

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

  @Column({ type: 'date', nullable: true })
  effectivenessCheckDate: Date;

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

  // Effectiveness evaluation
  @Column({ type: 'text', nullable: true })
  effectivenessEvaluation: string;

  @Column({ length: 255, nullable: true })
  effectivenessEvaluatedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  effectivenessEvaluatedAt: Date;

  @Column({ default: false })
  isEffective: boolean;

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

  // Cost-benefit
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  estimatedSavings: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  actualSavings: number;

  @Column({ type: 'text', nullable: true })
  costBenefitAnalysis: string;

  // Impact assessment
  @Column({ type: 'text', nullable: true })
  impactAssessment: string;

  @Column({ type: 'json', nullable: true })
  affectedProcesses: string[];

  @Column({ type: 'json', nullable: true })
  affectedDepartments: string[];

  @Column({ type: 'json', nullable: true })
  affectedProducts: string[];

  // Training and documentation
  @Column({ default: false })
  requiresTraining: boolean;

  @Column({ type: 'text', nullable: true })
  trainingDetails: string;

  @Column({ type: 'date', nullable: true })
  trainingCompletedDate: Date;

  @Column({ default: false })
  requiresDocumentUpdate: boolean;

  @Column({ type: 'text', nullable: true })
  documentUpdateDetails: string;

  @Column({ type: 'date', nullable: true })
  documentUpdatedDate: Date;

  // Risk assessment
  @Column({ length: 50, nullable: true })
  initialRiskLevel: string;

  @Column({ type: 'int', nullable: true })
  initialRiskScore: number;

  @Column({ length: 50, nullable: true })
  residualRiskLevel: string;

  @Column({ type: 'int', nullable: true })
  residualRiskScore: number;

  // Monitoring
  @Column({ type: 'text', nullable: true })
  monitoringPlan: string;

  @Column({ type: 'date', nullable: true })
  nextReviewDate: Date;

  @Column({ length: 50, nullable: true })
  reviewFrequency: string; // Monthly, Quarterly, Semi-Annual, Annual

  // Attachments
  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    category: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];

  // Workflow
  @Column({ length: 100, nullable: true })
  initiatedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  initiatedAt: Date;

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
