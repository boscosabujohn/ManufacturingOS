import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RoutingStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  OBSOLETE = 'Obsolete',
}

@Entity('routings')
export class Routing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  routingCode: string;

  @Column({ length: 255 })
  routingName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: RoutingStatus, default: RoutingStatus.DRAFT })
  status: RoutingStatus;

  // Item/Product
  @Column()
  itemId: string;

  @Column({ length: 100 })
  itemCode: string;

  @Column({ length: 255 })
  itemName: string;

  // BOM reference
  @Column({ nullable: true })
  bomId: string;

  @Column({ length: 100, nullable: true })
  bomCode: string;

  // Version control
  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ type: 'date', nullable: true })
  effectiveFrom: Date;

  @Column({ type: 'date', nullable: true })
  effectiveTo: Date;

  // Operations sequence
  @Column({ type: 'json' })
  operations: {
    sequenceNumber: number;
    operationId: string;
    operationCode: string;
    operationName: string;
    operationType: string;
    workCenterId: string;
    workCenterCode: string;
    workCenterName: string;
    setupTimeMinutes: number;
    runTimePerUnitMinutes: number;
    teardownTimeMinutes: number;
    totalTimePerUnitMinutes: number;
    batchSize: number;
    numberOfOperators: number;
    numberOfMachines: number;
    costPerUnit: number;
    requiresQualityInspection: boolean;
    qcTemplateId?: string;
    requiresSupervisorApproval: boolean;
    allowParallelExecution: boolean;
    parallelSequenceGroup?: string;
    workInstructions?: string;
    notes?: string;
  }[];

  // Time totals
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalSetupTime: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalRunTimePerUnit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalTeardownTime: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalTimePerUnit: number;

  @Column({ type: 'int', default: 0 })
  totalOperations: number;

  // Costing
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCostPerUnit: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  laborCostPerUnit: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  overheadCostPerUnit: number;

  // Production settings
  @Column({ type: 'int', default: 0 })
  leadTimeDays: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 1 })
  batchSize: number;

  @Column({ length: 50, default: 'PCS' })
  uom: string;

  // Quality
  @Column({ default: false })
  requiresQualityInspection: boolean;

  @Column({ type: 'int', default: 0 })
  qualityCheckpoints: number;

  // Reference
  @Column({ length: 100, nullable: true })
  drawingNumber: string;

  @Column({ length: 100, nullable: true })
  revision: string;

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

  @Column({ type: 'text', nullable: true })
  approvalComments: string;

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
}
