import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { InspectionResult } from './inspection-result.entity';
export { InspectionResult } from './inspection-result.entity';

export enum InspectionType {
  INCOMING = 'Incoming',
  IN_PROCESS = 'In-Process',
  FINAL = 'Final',
  SUPPLIER = 'Supplier',
  PERIODIC = 'Periodic',
  FIRST_ARTICLE = 'First Article',
  RANDOM = 'Random',
  AUDIT = 'Audit',
}

export enum InspectionStatus {
  DRAFT = 'Draft',
  SCHEDULED = 'Scheduled',
  IN_PROGRESS = 'In Progress',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled',
}

export enum InspectionResultEnum {
  PASSED = 'Passed',
  FAILED = 'Failed',
  CONDITIONALLY_ACCEPTED = 'Conditionally Accepted',
  PENDING = 'Pending',
  NOT_APPLICABLE = 'Not Applicable',
}

export enum InspectionPriority {
  LOW = 'Low',
  NORMAL = 'Normal',
  HIGH = 'High',
  URGENT = 'Urgent',
  CRITICAL = 'Critical',
}

@Entity('inspections')
export class Inspection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  inspectionNumber: string;

  @Column({ length: 255 })
  inspectionName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: InspectionType, default: InspectionType.INCOMING })
  inspectionType: InspectionType;

  @Column({ type: 'enum', enum: InspectionStatus, default: InspectionStatus.DRAFT })
  status: InspectionStatus;

  @Column({ type: 'enum', enum: InspectionResultEnum, default: InspectionResultEnum.PENDING })
  result: InspectionResultEnum;

  @Column({ type: 'enum', enum: InspectionPriority, default: InspectionPriority.NORMAL })
  priority: InspectionPriority;

  // QC Template
  @Column({ nullable: true })
  qcTemplateId: string;

  @Column({ length: 100, nullable: true })
  qcTemplateCode: string;

  @Column({ length: 255, nullable: true })
  qcTemplateName: string;

  // Item/Product
  @Column()
  itemId: string;

  @Column({ length: 100 })
  itemCode: string;

  @Column({ length: 255 })
  itemName: string;

  @Column({ length: 50, default: 'PCS' })
  uom: string;

  @Column({ length: 100, nullable: true })
  itemCategory: string;

  @Column({ length: 100, nullable: true })
  batchNumber: string;

  @Column({ length: 100, nullable: true })
  lotNumber: string;

  @Column({ type: 'json', nullable: true })
  serialNumbers: string[];

  // Quantities
  @Column({ type: 'decimal', precision: 15, scale: 4 })
  lotQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  sampleSize: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  acceptedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  rejectedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  reworkQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  scrapQuantity: number;

  @Column({ nullable: true })
  referenceType: string;

  @Column({ nullable: true })
  referenceId: string;

  // Source references
  @Column({ nullable: true })
  workOrderId: string;

  @Column({ length: 100, nullable: true })
  workOrderNumber: string;

  @Column({ nullable: true })
  purchaseOrderId: string;

  @Column({ length: 100, nullable: true })
  purchaseOrderNumber: string;

  @Column({ nullable: true })
  grnId: string;

  @Column({ length: 100, nullable: true })
  grnNumber: string;

  @Column({ nullable: true })
  productionEntryId: string;

  @Column({ length: 100, nullable: true })
  productionEntryNumber: string;

  @Column({ nullable: true })
  salesOrderId: string;

  @Column({ length: 100, nullable: true })
  salesOrderNumber: string;

  // Supplier (for incoming inspection)
  @Column({ nullable: true })
  supplierId: string;

  @Column({ length: 255, nullable: true })
  supplierName: string;

  @Column({ length: 100, nullable: true })
  supplierInvoiceNumber: string;

  @Column({ type: 'date', nullable: true })
  supplierInvoiceDate: Date;

  // Customer (for final inspection)
  @Column({ nullable: true })
  customerId: string;

  @Column({ length: 255, nullable: true })
  customerName: string;

  @Column({ length: 100, nullable: true })
  customerPO: string;

  // Location
  @Column({ nullable: true })
  warehouseId: string;

  @Column({ length: 100, nullable: true })
  warehouseName: string;

  @Column({ nullable: true })
  workCenterId: string;

  @Column({ length: 100, nullable: true })
  workCenterCode: string;

  @Column({ length: 255, nullable: true })
  workCenterName: string;

  @Column({ length: 255, nullable: true })
  inspectionLocation: string;

  // Scheduling
  @Column({ type: 'date' })
  scheduledDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduledTime: Date;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualStartTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualEndTime: Date;

  @Column({ type: 'int', nullable: true })
  durationMinutes: number;

  // Inspector
  @Column({ nullable: true })
  assignedToId: string;

  @Column({ length: 255, nullable: true })
  assignedToName: string;

  @Column({ nullable: true })
  inspectedById: string;

  @Column({ length: 255, nullable: true })
  inspectedByName: string;

  // Quality metrics
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  defectRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  rejectionRate: number;

  @Column({ type: 'int', default: 0 })
  totalDefects: number;

  @Column({ type: 'int', default: 0 })
  criticalDefects: number;

  @Column({ type: 'int', default: 0 })
  majorDefects: number;

  @Column({ type: 'int', default: 0 })
  minorDefects: number;

  @Column({ type: 'int', default: 0 })
  parametersChecked: number;

  @Column({ type: 'int', default: 0 })
  parametersPassed: number;

  @Column({ type: 'int', default: 0 })
  parametersFailed: number;

  // Disposition
  @Column({ length: 50, nullable: true })
  disposition: string; // Accept, Reject, Rework, Scrap, Use As Is, Return to Supplier

  @Column({ type: 'text', nullable: true })
  dispositionReason: string;

  @Column({ type: 'text', nullable: true })
  dispositionComments: string;

  // Actions taken
  @Column({ default: false })
  ncrGenerated: boolean;

  @Column({ nullable: true })
  ncrId: string;

  @Column({ length: 100, nullable: true })
  ncrNumber: string;

  @Column({ default: false })
  capaGenerated: boolean;

  @Column({ nullable: true })
  capaId: string;

  @Column({ length: 100, nullable: true })
  capaNumber: string;

  @Column({ default: false })
  supplierNotified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  supplierNotifiedAt: Date;

  // Photos and attachments
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

  // Signatures
  @Column({ type: 'text', nullable: true })
  inspectorSignature: string;

  @Column({ type: 'timestamp', nullable: true })
  inspectorSignedAt: Date;

  @Column({ type: 'text', nullable: true })
  approverSignature: string;

  @Column({ type: 'timestamp', nullable: true })
  approverSignedAt: Date;

  // Workflow
  @Column({ length: 100, nullable: true })
  startedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ length: 100, nullable: true })
  completedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

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
  cancelledBy: string;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  // Additional
  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ type: 'text', nullable: true })
  recommendations: string;

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
  @OneToMany(() => InspectionResult, (result) => result.inspection, { cascade: true })
  results: InspectionResult[];
}
