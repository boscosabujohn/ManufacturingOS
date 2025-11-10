import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum NCRType {
  PRODUCT = 'Product',
  PROCESS = 'Process',
  MATERIAL = 'Material',
  SUPPLIER = 'Supplier',
  CUSTOMER_COMPLAINT = 'Customer Complaint',
  AUDIT_FINDING = 'Audit Finding',
  SYSTEM = 'System',
  DOCUMENTATION = 'Documentation',
  OTHER = 'Other',
}

export enum NCRStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  UNDER_INVESTIGATION = 'Under Investigation',
  INVESTIGATION_COMPLETE = 'Investigation Complete',
  CAPA_REQUIRED = 'CAPA Required',
  CAPA_IN_PROGRESS = 'CAPA In Progress',
  PENDING_VERIFICATION = 'Pending Verification',
  VERIFIED = 'Verified',
  CLOSED = 'Closed',
  CANCELLED = 'Cancelled',
}

export enum NCRSeverity {
  CRITICAL = 'Critical',
  MAJOR = 'Major',
  MINOR = 'Minor',
}

export enum NCRPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
  CRITICAL = 'Critical',
}

@Entity('non_conformances')
export class NonConformance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  ncrNumber: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: NCRType, default: NCRType.PRODUCT })
  ncrType: NCRType;

  @Column({ type: 'enum', enum: NCRStatus, default: NCRStatus.DRAFT })
  status: NCRStatus;

  @Column({ type: 'enum', enum: NCRSeverity, default: NCRSeverity.MAJOR })
  severity: NCRSeverity;

  @Column({ type: 'enum', enum: NCRPriority, default: NCRPriority.MEDIUM })
  priority: NCRPriority;

  // Source reference
  @Column({ nullable: true })
  inspectionId: string;

  @Column({ length: 100, nullable: true })
  inspectionNumber: string;

  @Column({ nullable: true })
  auditId: string;

  @Column({ length: 100, nullable: true })
  auditNumber: string;

  @Column({ nullable: true })
  workOrderId: string;

  @Column({ length: 100, nullable: true })
  workOrderNumber: string;

  @Column({ nullable: true })
  purchaseOrderId: string;

  @Column({ length: 100, nullable: true })
  purchaseOrderNumber: string;

  @Column({ nullable: true })
  salesOrderId: string;

  @Column({ length: 100, nullable: true })
  salesOrderNumber: string;

  // Item/Product
  @Column({ nullable: true })
  itemId: string;

  @Column({ length: 100, nullable: true })
  itemCode: string;

  @Column({ length: 255, nullable: true })
  itemName: string;

  @Column({ length: 100, nullable: true })
  batchNumber: string;

  @Column({ length: 100, nullable: true })
  lotNumber: string;

  @Column({ type: 'json', nullable: true })
  serialNumbers: string[];

  // Quantities
  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  affectedQuantity: number;

  @Column({ length: 50, nullable: true })
  uom: string;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  quarantinedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  scrapQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  reworkQuantity: number;

  // Parties involved
  @Column({ nullable: true })
  supplierId: string;

  @Column({ length: 255, nullable: true })
  supplierName: string;

  @Column({ nullable: true })
  customerId: string;

  @Column({ length: 255, nullable: true })
  customerName: string;

  @Column({ nullable: true })
  reportedById: string;

  @Column({ length: 255, nullable: true })
  reportedByName: string;

  @Column({ type: 'date' })
  reportedDate: Date;

  @Column({ type: 'date', nullable: true })
  detectedDate: Date;

  @Column({ type: 'date', nullable: true })
  occurrenceDate: Date;

  // Location
  @Column({ nullable: true })
  departmentId: string;

  @Column({ length: 255, nullable: true })
  departmentName: string;

  @Column({ nullable: true })
  workCenterId: string;

  @Column({ length: 100, nullable: true })
  workCenterCode: string;

  @Column({ length: 255, nullable: true })
  location: string;

  // Defect details
  @Column({ type: 'text', nullable: true })
  defectDescription: string;

  @Column({ length: 255, nullable: true })
  defectCategory: string;

  @Column({ length: 255, nullable: true })
  defectType: string;

  @Column({ type: 'int', nullable: true })
  defectCount: number;

  // Root cause analysis
  @Column({ type: 'text', nullable: true })
  immediateAction: string;

  @Column({ type: 'date', nullable: true })
  immediateActionDate: Date;

  @Column({ length: 255, nullable: true })
  immediateActionBy: string;

  @Column({ type: 'text', nullable: true })
  rootCauseAnalysis: string;

  @Column({ length: 255, nullable: true })
  rootCauseMethod: string; // 5 Why, Fishbone, Fault Tree, etc.

  @Column({ type: 'text', nullable: true })
  identifiedRootCauses: string;

  @Column({ type: 'json', nullable: true })
  rootCauseCategories: string[]; // Man, Machine, Material, Method, Environment

  @Column({ type: 'date', nullable: true })
  investigationCompletedDate: Date;

  @Column({ length: 255, nullable: true })
  investigatedBy: string;

  // Containment actions
  @Column({ type: 'text', nullable: true })
  containmentAction: string;

  @Column({ type: 'date', nullable: true })
  containmentActionDate: Date;

  @Column({ length: 255, nullable: true })
  containmentActionBy: string;

  @Column({ default: false })
  isContained: boolean;

  // Disposition
  @Column({ length: 50, nullable: true })
  disposition: string; // Use As Is, Rework, Scrap, Return, Downgrade, Sort

  @Column({ type: 'text', nullable: true })
  dispositionReason: string;

  @Column({ type: 'text', nullable: true })
  dispositionComments: string;

  @Column({ length: 255, nullable: true })
  dispositionApprovedBy: string;

  @Column({ type: 'date', nullable: true })
  dispositionApprovedDate: Date;

  // Cost impact
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  estimatedCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  actualCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  reworkCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  scrapCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  downtimeCost: number;

  // CAPA
  @Column({ default: false })
  requiresCAPÁ: boolean;

  @Column({ nullable: true })
  capaId: string;

  @Column({ length: 100, nullable: true })
  capaNumber: string;

  @Column({ nullable: true })
  correctiveActionId: string;

  @Column({ length: 100, nullable: true })
  correctiveActionNumber: string;

  @Column({ nullable: true })
  preventiveActionId: string;

  @Column({ length: 100, nullable: true })
  preventiveActionNumber: string;

  // Verification
  @Column({ type: 'text', nullable: true })
  verificationMethod: string;

  @Column({ type: 'text', nullable: true })
  verificationResults: string;

  @Column({ type: 'date', nullable: true })
  verificationDate: Date;

  @Column({ length: 255, nullable: true })
  verifiedBy: string;

  @Column({ default: false })
  isVerified: boolean;

  // Effectiveness check
  @Column({ type: 'text', nullable: true })
  effectivenessCheck: string;

  @Column({ type: 'date', nullable: true })
  effectivenessCheckDate: Date;

  @Column({ length: 255, nullable: true })
  effectivenessCheckedBy: string;

  @Column({ default: false })
  isEffective: boolean;

  // Customer notification
  @Column({ default: false })
  customerNotificationRequired: boolean;

  @Column({ default: false })
  customerNotified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  customerNotifiedAt: Date;

  @Column({ length: 255, nullable: true })
  customerNotifiedBy: string;

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
  closedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;

  @Column({ length: 100, nullable: true })
  cancelledBy: string;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ type: 'date', nullable: true })
  targetCloseDate: Date;

  // Due dates
  @Column({ type: 'date', nullable: true })
  investigationDueDate: Date;

  @Column({ type: 'date', nullable: true })
  capaDueDate: Date;

  @Column({ type: 'date', nullable: true })
  verificationDueDate: Date;

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
