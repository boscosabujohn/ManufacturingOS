import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum AdjustmentType {
  CYCLE_COUNT = 'Cycle Count',
  PHYSICAL_INVENTORY = 'Physical Inventory',
  WRITE_OFF = 'Write Off',
  WRITE_ON = 'Write On',
  REVALUATION = 'Revaluation',
  DAMAGE = 'Damage',
  EXPIRY = 'Expiry',
  THEFT = 'Theft',
  OBSOLESCENCE = 'Obsolescence',
  CONVERSION = 'UOM Conversion',
  CORRECTION = 'Correction',
}

export enum AdjustmentStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  APPROVED = 'Approved',
  POSTED = 'Posted',
  CANCELLED = 'Cancelled',
  REJECTED = 'Rejected',
}

@Entity('stock_adjustments')
export class StockAdjustment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  adjustmentNumber: string;

  @Column({
    type: 'enum',
    enum: AdjustmentType,
  })
  adjustmentType: AdjustmentType;

  @Column({
    type: 'enum',
    enum: AdjustmentStatus,
    default: AdjustmentStatus.DRAFT,
  })
  status: AdjustmentStatus;

  @Column({ type: 'date' })
  adjustmentDate: Date;

  // Warehouse and location
  @Column()
  warehouseId: string;

  @Column({ length: 255 })
  warehouseName: string;

  @Column({ nullable: true })
  locationId: string;

  @Column({ length: 255, nullable: true })
  locationName: string;

  // Reference
  @Column({ nullable: true, length: 100 })
  referenceType: string; // Cycle Count Plan, Physical Inventory, etc.

  @Column({ nullable: true })
  referenceId: string;

  @Column({ nullable: true, length: 100 })
  referenceNumber: string;

  // Cycle Count/Physical Inventory details
  @Column({ default: false })
  isCycleCount: boolean;

  @Column({ default: false })
  isPhysicalInventory: boolean;

  @Column({ type: 'date', nullable: true })
  countDate: Date;

  @Column({ nullable: true })
  counterId: string;

  @Column({ length: 100, nullable: true })
  counterName: string;

  // Approval workflow
  @Column({ default: true })
  requiresApproval: boolean;

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ length: 100, nullable: true })
  approvedByName: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'text', nullable: true })
  approvalRemarks: string;

  // Rejection
  @Column({ nullable: true })
  rejectedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  // Posting to inventory
  @Column({ default: false })
  isPosted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  postedAt: Date;

  @Column({ nullable: true })
  postedBy: string;

  @Column({ nullable: true })
  stockEntryId: string; // Generated stock entry

  // Financial posting
  @Column({ default: false })
  isFinanciallyPosted: boolean;

  @Column({ nullable: true })
  journalEntryId: string;

  // Valuation impact
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAdjustmentValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  positiveAdjustmentValue: number; // Write-on

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  negativeAdjustmentValue: number; // Write-off

  @Column({ default: 'INR', length: 3 })
  currency: string;

  // Reason and justification
  @Column({ length: 255, nullable: true })
  reason: string;

  @Column({ type: 'text', nullable: true })
  justification: string;

  @Column({ type: 'text', nullable: true })
  rootCause: string;

  @Column({ type: 'text', nullable: true })
  correctiveAction: string;

  // Project/Cost Center
  @Column({ nullable: true })
  projectId: string;

  @Column({ length: 255, nullable: true })
  projectName: string;

  @Column({ nullable: true })
  costCenterId: string;

  @Column({ length: 255, nullable: true })
  costCenterName: string;

  // GL Account for expense/income
  @Column({ nullable: true })
  expenseAccountId: string;

  @Column({ length: 255, nullable: true })
  expenseAccountName: string;

  // Additional information
  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StockAdjustmentLine, (line) => line.stockAdjustment, {
    cascade: true,
  })
  lines: StockAdjustmentLine[];
}

@Entity('stock_adjustment_lines')
export class StockAdjustmentLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  stockAdjustmentId: string;

  @ManyToOne(() => StockAdjustment, (adjustment) => adjustment.lines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'stockAdjustmentId' })
  stockAdjustment: StockAdjustment;

  @Column({ type: 'int' })
  lineNumber: number;

  // Item details
  @Column()
  itemId: string;

  @Column({ length: 100 })
  itemCode: string;

  @Column({ length: 255 })
  itemName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Location
  @Column({ nullable: true })
  locationId: string;

  @Column({ length: 255, nullable: true })
  locationName: string;

  // Batch and Serial
  @Column({ nullable: true })
  batchId: string;

  @Column({ length: 100, nullable: true })
  batchNumber: string;

  @Column({ nullable: true })
  serialNumberId: string;

  @Column({ length: 100, nullable: true })
  serialNumber: string;

  // Quantity details
  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  systemQuantity: number; // Quantity as per system

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  physicalQuantity: number; // Counted quantity

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  adjustmentQuantity: number; // Difference (Physical - System)

  @Column({ length: 50 })
  uom: string;

  // Valuation
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  valuationRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  adjustmentValue: number; // adjustmentQuantity * valuationRate

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  systemValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  physicalValue: number;

  // Count details
  @Column({ type: 'timestamp', nullable: true })
  countedAt: Date;

  @Column({ nullable: true })
  countedBy: string;

  @Column({ length: 100, nullable: true })
  countedByName: string;

  // Variance analysis
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  variancePercentage: number;

  @Column({ default: false })
  isSignificantVariance: boolean; // Flag if variance > threshold

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  varianceThreshold: number;

  // Reason for adjustment
  @Column({ length: 255, nullable: true })
  adjustmentReason: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  // GL Account
  @Column({ nullable: true })
  glAccountId: string;

  @Column({ length: 255, nullable: true })
  glAccountName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
