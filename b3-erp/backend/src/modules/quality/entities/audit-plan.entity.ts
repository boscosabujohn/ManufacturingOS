import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AuditFindings } from './audit-findings.entity';

export enum AuditType {
  INTERNAL = 'Internal',
  EXTERNAL = 'External',
  SUPPLIER = 'Supplier',
  CUSTOMER = 'Customer',
  CERTIFICATION = 'Certification',
  SURVEILLANCE = 'Surveillance',
  COMPLIANCE = 'Compliance',
  PROCESS = 'Process',
  PRODUCT = 'Product',
  SYSTEM = 'System',
}

export enum AuditStatus {
  DRAFT = 'Draft',
  SCHEDULED = 'Scheduled',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  REPORT_PENDING = 'Report Pending',
  REPORT_SUBMITTED = 'Report Submitted',
  UNDER_REVIEW = 'Under Review',
  APPROVED = 'Approved',
  CLOSED = 'Closed',
  CANCELLED = 'Cancelled',
}

export enum AuditPriority {
  LOW = 'Low',
  NORMAL = 'Normal',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

@Entity('audit_plans')
export class AuditPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  auditNumber: string;

  @Column({ length: 255 })
  auditTitle: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: AuditType, default: AuditType.INTERNAL })
  auditType: AuditType;

  @Column({ type: 'enum', enum: AuditStatus, default: AuditStatus.DRAFT })
  status: AuditStatus;

  @Column({ type: 'enum', enum: AuditPriority, default: AuditPriority.NORMAL })
  priority: AuditPriority;

  // Audit scope
  @Column({ type: 'text' })
  auditScope: string;

  @Column({ type: 'text', nullable: true })
  auditObjectives: string;

  @Column({ type: 'json', nullable: true })
  auditCriteria: string[]; // ISO 9001, AS9100, IATF 16949, etc.

  @Column({ type: 'json', nullable: true })
  clausesCovered: string[];

  // Standards and references
  @Column({ type: 'json', nullable: true })
  standards: {
    standardCode: string;
    standardName: string;
    version: string;
  }[];

  @Column({ type: 'json', nullable: true })
  referenceDocuments: string[];

  // Audit areas
  @Column({ type: 'json', nullable: true })
  departmentIds: string[];

  @Column({ type: 'json', nullable: true })
  departmentNames: string[];

  @Column({ type: 'json', nullable: true })
  processIds: string[];

  @Column({ type: 'json', nullable: true })
  processNames: string[];

  @Column({ type: 'json', nullable: true })
  locations: string[];

  // Auditee (for external audits)
  @Column({ nullable: true })
  auditeeId: string;

  @Column({ length: 255, nullable: true })
  auditeeName: string;

  @Column({ length: 50, nullable: true })
  auditeeType: string; // Supplier, Customer, Subcontractor

  @Column({ length: 255, nullable: true })
  auditeeAddress: string;

  @Column({ length: 255, nullable: true })
  auditeeContactPerson: string;

  @Column({ length: 50, nullable: true })
  auditeeContactPhone: string;

  @Column({ length: 100, nullable: true })
  auditeeContactEmail: string;

  // Audit team
  @Column({ nullable: true })
  leadAuditorId: string;

  @Column({ length: 255, nullable: true })
  leadAuditorName: string;

  @Column({ type: 'json', nullable: true })
  auditTeam: {
    auditorId: string;
    auditorName: string;
    role: string; // Lead, Auditor, Technical Expert, Observer
    qualification: string;
  }[];

  // Auditee representatives
  @Column({ type: 'json', nullable: true })
  auditeeRepresentatives: {
    name: string;
    designation: string;
    department: string;
    contactEmail: string;
  }[];

  // Scheduling
  @Column({ type: 'date' })
  plannedStartDate: Date;

  @Column({ type: 'date' })
  plannedEndDate: Date;

  @Column({ type: 'date', nullable: true })
  actualStartDate: Date;

  @Column({ type: 'date', nullable: true })
  actualEndDate: Date;

  @Column({ type: 'int', nullable: true })
  estimatedDurationHours: number;

  @Column({ type: 'int', nullable: true })
  actualDurationHours: number;

  // Audit schedule
  @Column({ type: 'json', nullable: true })
  auditSchedule: {
    day: number;
    date: Date;
    startTime: string;
    endTime: string;
    area: string;
    department: string;
    process: string;
    auditor: string;
    auditee: string;
  }[];

  // Checklist
  @Column({ type: 'json', nullable: true })
  checklistItems: {
    sequence: number;
    clause: string;
    requirement: string;
    verificationMethod: string;
    questions: string[];
    evidenceRequired: string;
  }[];

  // Opening meeting
  @Column({ type: 'timestamp', nullable: true })
  openingMeetingDateTime: Date;

  @Column({ length: 255, nullable: true })
  openingMeetingLocation: string;

  @Column({ type: 'json', nullable: true })
  openingMeetingAttendees: string[];

  @Column({ type: 'text', nullable: true })
  openingMeetingNotes: string;

  // Closing meeting
  @Column({ type: 'timestamp', nullable: true })
  closingMeetingDateTime: Date;

  @Column({ length: 255, nullable: true })
  closingMeetingLocation: string;

  @Column({ type: 'json', nullable: true })
  closingMeetingAttendees: string[];

  @Column({ type: 'text', nullable: true })
  closingMeetingNotes: string;

  // Findings summary
  @Column({ type: 'int', default: 0 })
  totalFindings: number;

  @Column({ type: 'int', default: 0 })
  criticalFindings: number;

  @Column({ type: 'int', default: 0 })
  majorFindings: number;

  @Column({ type: 'int', default: 0 })
  minorFindings: number;

  @Column({ type: 'int', default: 0 })
  observations: number;

  @Column({ type: 'int', default: 0 })
  opportunities: number;

  @Column({ type: 'int', default: 0 })
  closedFindings: number;

  // Audit report
  @Column({ type: 'text', nullable: true })
  executiveSummary: string;

  @Column({ type: 'text', nullable: true })
  auditConclusion: string;

  @Column({ length: 50, nullable: true })
  overallRating: string; // Excellent, Good, Satisfactory, Needs Improvement, Unsatisfactory

  @Column({ type: 'int', nullable: true })
  complianceScore: number; // Percentage

  @Column({ type: 'text', nullable: true })
  strengths: string;

  @Column({ type: 'text', nullable: true })
  areasForImprovement: string;

  @Column({ type: 'text', nullable: true })
  recommendations: string;

  @Column({ type: 'date', nullable: true })
  reportSubmittedDate: Date;

  @Column({ length: 255, nullable: true })
  reportSubmittedBy: string;

  // Follow-up
  @Column({ default: false })
  requiresFollowUp: boolean;

  @Column({ type: 'date', nullable: true })
  followUpDate: Date;

  @Column({ default: false })
  followUpCompleted: boolean;

  @Column({ type: 'date', nullable: true })
  followUpCompletedDate: Date;

  @Column({ type: 'text', nullable: true })
  followUpNotes: string;

  // Next audit
  @Column({ type: 'date', nullable: true })
  nextAuditDate: Date;

  @Column({ length: 50, nullable: true })
  auditFrequency: string; // Monthly, Quarterly, Semi-Annual, Annual

  // Certification (for certification audits)
  @Column({ default: false })
  isCertificationAudit: boolean;

  @Column({ length: 255, nullable: true })
  certificationBody: string;

  @Column({ length: 100, nullable: true })
  certificateNumber: string;

  @Column({ type: 'date', nullable: true })
  certificationDate: Date;

  @Column({ type: 'date', nullable: true })
  certificationExpiryDate: Date;

  // Cost
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  estimatedCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  actualCost: number;

  // Attachments
  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    category: string; // Checklist, Report, Evidence, etc.
    uploadedBy: string;
    uploadedAt: Date;
  }[];

  // Workflow
  @Column({ length: 100, nullable: true })
  preparedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  preparedAt: Date;

  @Column({ length: 100, nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ length: 100, nullable: true })
  completedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

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
  @OneToMany(() => AuditFindings, (finding) => finding.auditPlan, { cascade: true })
  findings: AuditFindings[];
}
