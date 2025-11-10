import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProductionEntryType {
  PRODUCTION = 'Production',
  REWORK = 'Rework',
  SCRAP = 'Scrap',
  REJECTION = 'Rejection',
  MATERIAL_CONSUMPTION = 'Material Consumption',
  MATERIAL_RETURN = 'Material Return',
  BY_PRODUCT = 'By-Product',
  CO_PRODUCT = 'Co-Product',
}

export enum ProductionEntryStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  POSTED = 'Posted',
  REVERSED = 'Reversed',
  CANCELLED = 'Cancelled',
}

@Entity('production_entries')
export class ProductionEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  entryNumber: string;

  @Column({ type: 'enum', enum: ProductionEntryType, default: ProductionEntryType.PRODUCTION })
  entryType: ProductionEntryType;

  @Column({ type: 'enum', enum: ProductionEntryStatus, default: ProductionEntryStatus.DRAFT })
  status: ProductionEntryStatus;

  @Column({ type: 'date' })
  postingDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  postingTime: Date;

  // Work order reference
  @Column()
  workOrderId: string;

  @Column({ length: 100 })
  workOrderNumber: string;

  @Column()
  itemId: string;

  @Column({ length: 100 })
  itemCode: string;

  @Column({ length: 255 })
  itemName: string;

  // Operation details
  @Column({ nullable: true })
  operationId: string;

  @Column({ length: 100, nullable: true })
  operationCode: string;

  @Column({ length: 255, nullable: true })
  operationName: string;

  // Work center
  @Column({ nullable: true })
  workCenterId: string;

  @Column({ length: 100, nullable: true })
  workCenterCode: string;

  @Column({ length: 255, nullable: true })
  workCenterName: string;

  // Quantities
  @Column({ type: 'decimal', precision: 15, scale: 4 })
  quantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  acceptedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  rejectedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  scrapQuantity: number;

  @Column({ length: 50, default: 'PCS' })
  uom: string;

  // Material consumption
  @Column({ type: 'json', nullable: true })
  materialsConsumed: {
    itemId: string;
    itemCode: string;
    itemName: string;
    quantity: number;
    uom: string;
    unitCost: number;
    totalCost: number;
    warehouseId?: string;
    warehouseName?: string;
    batchNumber?: string;
    serialNumbers?: string[];
  }[];

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalMaterialCost: number;

  // Labor tracking
  @Column({ type: 'json', nullable: true })
  laborEntries: {
    operatorId: string;
    operatorName: string;
    employeeCode: string;
    hoursWorked: number;
    hourlyRate: number;
    totalCost: number;
    shift?: string;
  }[];

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalLaborCost: number;

  // Overhead
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  overheadCost: number;

  // Total costing
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  costPerUnit: number;

  // Timing
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  setupTimeMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  runTimeMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  teardownTimeMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalTimeMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  downtimeMinutes: number;

  // Warehouse
  @Column({ nullable: true })
  targetWarehouseId: string;

  @Column({ length: 100, nullable: true })
  targetWarehouseName: string;

  @Column({ length: 100, nullable: true })
  binLocation: string;

  // Batch/Serial tracking
  @Column({ default: false })
  trackSerialNumbers: boolean;

  @Column({ default: false })
  trackBatchNumbers: boolean;

  @Column({ length: 100, nullable: true })
  batchNumber: string;

  @Column({ type: 'json', nullable: true })
  serialNumbers: string[];

  // Quality
  @Column({ default: false })
  qualityInspectionRequired: boolean;

  @Column({ default: false })
  qualityInspectionCompleted: boolean;

  @Column({ length: 50, nullable: true })
  qualityStatus: string;

  @Column({ nullable: true })
  qcReportId: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  // Operator
  @Column({ nullable: true })
  operatorId: string;

  @Column({ length: 255, nullable: true })
  operatorName: string;

  @Column({ length: 100, nullable: true })
  employeeCode: string;

  @Column({ length: 100, nullable: true })
  shift: string;

  // Inventory posting
  @Column({ default: false })
  inventoryPosted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  inventoryPostedAt: Date;

  @Column({ nullable: true })
  stockEntryId: string;

  @Column({ length: 100, nullable: true })
  stockEntryNumber: string;

  // GL posting
  @Column({ default: false })
  glPosted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  glPostedAt: Date;

  @Column({ nullable: true })
  journalEntryId: string;

  @Column({ length: 100, nullable: true })
  journalEntryNumber: string;

  // Reversal
  @Column({ default: false })
  isReversed: boolean;

  @Column({ nullable: true })
  reversalEntryId: string;

  @Column({ length: 100, nullable: true })
  reversalEntryNumber: string;

  @Column({ type: 'timestamp', nullable: true })
  reversedAt: Date;

  @Column({ length: 100, nullable: true })
  reversedBy: string;

  @Column({ type: 'text', nullable: true })
  reversalReason: string;

  // Workflow
  @Column({ length: 100, nullable: true })
  submittedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date;

  @Column({ length: 100, nullable: true })
  postedBy: string;

  @Column({ length: 100, nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  // Additional
  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];

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
