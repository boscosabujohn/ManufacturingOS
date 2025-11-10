import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum StockEntryType {
  MATERIAL_RECEIPT = 'Material Receipt',
  MATERIAL_ISSUE = 'Material Issue',
  MATERIAL_TRANSFER = 'Material Transfer',
  STOCK_RECONCILIATION = 'Stock Reconciliation',
  PURCHASE_RECEIPT = 'Purchase Receipt',
  PURCHASE_RETURN = 'Purchase Return',
  SALES_ISSUE = 'Sales Issue',
  SALES_RETURN = 'Sales Return',
  PRODUCTION_RECEIPT = 'Production Receipt',
  PRODUCTION_ISSUE = 'Production Issue',
  OPENING_STOCK = 'Opening Stock',
  REPACK = 'Repack',
  SCRAP = 'Scrap',
}

export enum StockEntryStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  POSTED = 'Posted',
  CANCELLED = 'Cancelled',
}

export enum MovementDirection {
  IN = 'In',
  OUT = 'Out',
  INTERNAL = 'Internal',
}

@Entity('stock_entries')
export class StockEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  entryNumber: string;

  @Column({
    type: 'enum',
    enum: StockEntryType,
  })
  entryType: StockEntryType;

  @Column({
    type: 'enum',
    enum: MovementDirection,
  })
  movementDirection: MovementDirection;

  @Column({ type: 'date' })
  postingDate: Date;

  @Column({ type: 'timestamp' })
  postingTime: Date;

  @Column({
    type: 'enum',
    enum: StockEntryStatus,
    default: StockEntryStatus.DRAFT,
  })
  status: StockEntryStatus;

  // Reference document
  @Column({ nullable: true, length: 100 })
  referenceType: string; // Purchase Order, Sales Order, Work Order, etc.

  @Column({ nullable: true })
  referenceId: string;

  @Column({ nullable: true, length: 100 })
  referenceNumber: string;

  // Source and target
  @Column({ nullable: true })
  fromWarehouseId: string;

  @Column({ length: 255, nullable: true })
  fromWarehouseName: string;

  @Column({ nullable: true })
  toWarehouseId: string;

  @Column({ length: 255, nullable: true })
  toWarehouseName: string;

  // Supplier/Customer for receipts and issues
  @Column({ nullable: true })
  supplierId: string;

  @Column({ length: 255, nullable: true })
  supplierName: string;

  @Column({ nullable: true })
  customerId: string;

  @Column({ length: 255, nullable: true })
  customerName: string;

  // Financial posting
  @Column({ default: false })
  isPosted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  postedAt: Date;

  @Column({ nullable: true })
  postedBy: string;

  @Column({ nullable: true })
  journalEntryId: string;

  // Valuation
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalValue: number;

  @Column({ default: 'INR', length: 3 })
  currency: string;

  // Additional costs
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  additionalCosts: number;

  @Column({ type: 'json', nullable: true })
  costBreakup: {
    costType: string;
    amount: number;
    description: string;
  }[];

  // Approval workflow
  @Column({ default: false })
  requiresApproval: boolean;

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  // Quality inspection
  @Column({ default: false })
  requiresInspection: boolean;

  @Column({ nullable: true })
  inspectionId: string;

  @Column({ nullable: true, length: 50 })
  inspectionStatus: string;

  // Project/Cost Center allocation
  @Column({ nullable: true })
  projectId: string;

  @Column({ length: 255, nullable: true })
  projectName: string;

  @Column({ nullable: true })
  costCenterId: string;

  @Column({ length: 255, nullable: true })
  costCenterName: string;

  // Transport and delivery
  @Column({ nullable: true, length: 100 })
  vehicleNumber: string;

  @Column({ nullable: true, length: 100 })
  driverName: string;

  @Column({ nullable: true, length: 20 })
  lrNumber: string; // Lorry Receipt Number

  @Column({ type: 'date', nullable: true })
  lrDate: Date;

  @Column({ nullable: true, length: 100 })
  transporterName: string;

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

  @OneToMany(() => StockEntryLine, (line) => line.stockEntry, { cascade: true })
  lines: StockEntryLine[];
}

@Entity('stock_entry_lines')
export class StockEntryLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  stockEntryId: string;

  @ManyToOne(() => StockEntry, (entry) => entry.lines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'stockEntryId' })
  stockEntry: StockEntry;

  @Column({ type: 'int' })
  lineNumber: number;

  @Column()
  itemId: string;

  @Column({ length: 100 })
  itemCode: string;

  @Column({ length: 255 })
  itemName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Quantity and UOM
  @Column({ type: 'decimal', precision: 15, scale: 4 })
  quantity: number;

  @Column({ length: 50 })
  uom: string; // Unit of Measure

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  conversionFactor: number;

  @Column({ length: 50, nullable: true })
  stockUom: string; // Base UOM for stock

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  stockQuantity: number; // Quantity in stock UOM

  // Location details
  @Column({ nullable: true })
  fromLocationId: string;

  @Column({ length: 255, nullable: true })
  fromLocationName: string;

  @Column({ nullable: true })
  toLocationId: string;

  @Column({ length: 255, nullable: true })
  toLocationName: string;

  // Batch and Serial tracking
  @Column({ nullable: true })
  batchId: string;

  @Column({ length: 100, nullable: true })
  batchNumber: string;

  @Column({ nullable: true })
  serialNumberId: string;

  @Column({ length: 100, nullable: true })
  serialNumber: string;

  // Valuation
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  rate: number; // Unit rate

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amount: number; // Total value

  @Column({ length: 50, nullable: true })
  valuationMethod: string; // FIFO, LIFO, Weighted Average

  // Quality
  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  acceptedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  rejectedQuantity: number;

  @Column({ nullable: true, length: 50 })
  qualityStatus: string;

  // GL Account for posting
  @Column({ nullable: true })
  glAccountId: string;

  @Column({ length: 255, nullable: true })
  glAccountName: string;

  // Reference to source document line
  @Column({ nullable: true })
  sourceDocumentLineId: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
