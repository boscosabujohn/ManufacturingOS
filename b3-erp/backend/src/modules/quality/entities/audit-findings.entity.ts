import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AuditPlan } from './audit-plan.entity';

export enum FindingType {
  NON_CONFORMANCE = 'Non-Conformance',
  OBSERVATION = 'Observation',
  OPPORTUNITY_FOR_IMPROVEMENT = 'Opportunity for Improvement',
  BEST_PRACTICE = 'Best Practice',
  POSITIVE_FINDING = 'Positive Finding',
}

export enum FindingSeverity {
  CRITICAL = 'Critical',
  MAJOR = 'Major',
  MINOR = 'Minor',
}

export enum FindingStatus {
  OPEN = 'Open',
  ACKNOWLEDGED = 'Acknowledged',
  CAPA_INITIATED = 'CAPA Initiated',
  IN_PROGRESS = 'In Progress',
  PENDING_VERIFICATION = 'Pending Verification',
  VERIFIED = 'Verified',
  CLOSED = 'Closed',
  REJECTED = 'Rejected',
}

@Entity('audit_findings')
export class AuditFindings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  auditPlanId: string;

  @Column({ unique: true, length: 50 })
  findingNumber: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: FindingType, default: FindingType.NON_CONFORMANCE })
  findingType: FindingType;

  @Column({ type: 'enum', enum: FindingSeverity, nullable: true })
  severity: FindingSeverity;

  @Column({ type: 'enum', enum: FindingStatus, default: FindingStatus.OPEN })
  status: FindingStatus;

  // Audit reference
  @Column({ length: 100, nullable: true })
  auditNumber: string;

  @Column({ type: 'date' })
  findingDate: Date;

  // Standard/Clause reference
  @Column({ length: 255, nullable: true })
  standardReference: string;

  @Column({ length: 100, nullable: true })
  clauseNumber: string;

  @Column({ length: 255, nullable: true })
  clauseTitle: string;

  @Column({ type: 'text', nullable: true })
  requirement: string;

  // Location
  @Column({ nullable: true })
  departmentId: string;

  @Column({ length: 255, nullable: true })
  departmentName: string;

  @Column({ length: 255, nullable: true })
  process: string;

  @Column({ nullable: true })
  processId: string;

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({ nullable: true })
  workCenterId: string;

  @Column({ length: 100, nullable: true })
  workCenterCode: string;

  // Finding details
  @Column({ type: 'text' })
  evidence: string;

  @Column({ type: 'text', nullable: true })
  objectiveEvidence: string;

  @Column({ type: 'text', nullable: true })
  deviation: string;

  @Column({ type: 'text', nullable: true })
  impact: string;

  @Column({ type: 'text', nullable: true })
  riskAssessment: string;

  // Auditee
  @Column({ nullable: true })
  auditeeId: string;

  @Column({ length: 255, nullable: true })
  auditeeName: string;

  @Column({ length: 255, nullable: true })
  auditeeDesignation: string;

  @Column({ length: 255, nullable: true })
  auditeeDepartment: string;

  // Auditor
  @Column({ nullable: true })
  auditorId: string;

  @Column({ length: 255, nullable: true })
  auditorName: string;

  // Root cause
  @Column({ type: 'text', nullable: true })
  rootCauseAnalysis: string;

  @Column({ length: 255, nullable: true })
  rootCauseMethod: string;

  @Column({ type: 'json', nullable: true })
  identifiedRootCauses: string[];

  // Corrective action
  @Column({ type: 'text', nullable: true })
  proposedCorrectiveAction: string;

  @Column({ nullable: true })
  assignedToId: string;

  @Column({ length: 255, nullable: true })
  assignedToName: string;

  @Column({ type: 'date', nullable: true })
  targetCompletionDate: Date;

  @Column({ type: 'date', nullable: true })
  actualCompletionDate: Date;

  // CAPA reference
  @Column({ default: false })
  requiresCAPA: boolean;

  @Column({ nullable: true })
  capaId: string;

  @Column({ length: 100, nullable: true })
  capaNumber: string;

  @Column({ default: false })
  capaCompleted: boolean;

  @Column({ type: 'date', nullable: true })
  capaCompletionDate: Date;

  // NCR reference
  @Column({ default: false })
  requiresNCR: boolean;

  @Column({ nullable: true })
  ncrId: string;

  @Column({ length: 100, nullable: true })
  ncrNumber: string;

  // Response from auditee
  @Column({ type: 'text', nullable: true })
  auditeeResponse: string;

  @Column({ type: 'timestamp', nullable: true })
  auditeeResponseDate: Date;

  @Column({ length: 255, nullable: true })
  respondedBy: string;

  // Implementation
  @Column({ type: 'text', nullable: true })
  implementationDetails: string;

  @Column({ type: 'date', nullable: true })
  implementationDate: Date;

  @Column({ length: 255, nullable: true })
  implementedBy: string;

  // Verification
  @Column({ type: 'text', nullable: true })
  verificationMethod: string;

  @Column({ type: 'text', nullable: true })
  verificationEvidence: string;

  @Column({ type: 'text', nullable: true })
  verificationResults: string;

  @Column({ type: 'date', nullable: true })
  verificationDate: Date;

  @Column({ length: 255, nullable: true })
  verifiedBy: string;

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

  // Attachments
  @Column({ type: 'json', nullable: true })
  photos: {
    fileName: string;
    fileUrl: string;
    description: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];

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
  acknowledgedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  acknowledgedAt: Date;

  @Column({ length: 100, nullable: true })
  closedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;

  @Column({ length: 100, nullable: true })
  rejectedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  // Due dates
  @Column({ type: 'date', nullable: true })
  responseDueDate: Date;

  @Column({ type: 'date', nullable: true })
  verificationDueDate: Date;

  @Column({ default: false })
  isOverdue: boolean;

  @Column({ type: 'int', nullable: true })
  daysOverdue: number;

  // Additional
  @Column({ type: 'text', nullable: true })
  recommendations: string;

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

  // Relations
  @ManyToOne(() => AuditPlan, (plan) => plan.findings)
  @JoinColumn({ name: 'auditPlanId' })
  auditPlan: AuditPlan;
}
