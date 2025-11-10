import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum BatchStatus {
  ACTIVE = 'Active',
  QUARANTINE = 'Quarantine',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  EXPIRED = 'Expired',
  RECALLED = 'Recalled',
  CONSUMED = 'Consumed',
  CLOSED = 'Closed',
}

@Entity('batch_numbers')
@Index(['batchNumber', 'itemId'], { unique: true })
@Index(['itemId', 'status'])
@Index(['expiryDate'])
export class BatchNumber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  batchNumber: string;

  // Item details
  @Column()
  itemId: string;

  @Column({ length: 100 })
  itemCode: string;

  @Column({ length: 255 })
  itemName: string;

  // Status
  @Column({
    type: 'enum',
    enum: BatchStatus,
    default: BatchStatus.ACTIVE,
  })
  status: BatchStatus;

  // Manufacturing details
  @Column({ type: 'date', nullable: true })
  manufacturingDate: Date;

  @Column({ length: 255, nullable: true })
  manufacturerName: string;

  @Column({ length: 100, nullable: true })
  manufacturerBatchNumber: string; // Manufacturer's batch number

  @Column({ length: 100, nullable: true })
  lotNumber: string; // Alternative/additional lot number

  // Expiry details
  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ type: 'int', nullable: true })
  shelfLifeDays: number; // Shelf life in days

  @Column({ type: 'date', nullable: true })
  bestBeforeDate: Date;

  @Column({ type: 'date', nullable: true })
  retestDate: Date; // Date for retesting/recertification

  @Column({ default: false })
  isExpired: boolean;

  @Column({ type: 'int', nullable: true })
  daysToExpiry: number; // Calculated days remaining

  // Procurement details
  @Column({ nullable: true })
  purchaseOrderId: string;

  @Column({ length: 100, nullable: true })
  purchaseOrderNumber: string;

  @Column({ nullable: true })
  supplierId: string;

  @Column({ length: 255, nullable: true })
  supplierName: string;

  @Column({ length: 100, nullable: true })
  supplierBatchNumber: string;

  @Column({ type: 'date', nullable: true })
  purchaseDate: Date;

  // Receipt details
  @Column({ type: 'date', nullable: true })
  receiptDate: Date;

  @Column({ nullable: true })
  receiptStockEntryId: string;

  @Column({ length: 100, nullable: true })
  receiptStockEntryNumber: string;

  // Quality control
  @Column({ default: false })
  requiresQualityInspection: boolean;

  @Column({ nullable: true })
  qualityInspectionId: string;

  @Column({ length: 50, nullable: true })
  qualityStatus: string; // Pending, Passed, Failed

  @Column({ type: 'date', nullable: true })
  qualityInspectionDate: Date;

  @Column({ nullable: true })
  qualityInspectorId: string;

  @Column({ length: 100, nullable: true })
  qualityInspectorName: string;

  @Column({ type: 'json', nullable: true })
  qualityParameters: {
    parameterName: string;
    standardValue: string;
    actualValue: string;
    result: string; // Pass/Fail
    remarks: string;
  }[];

  // Quantity tracking
  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  initialQuantity: number; // Original received quantity

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  availableQuantity: number; // Current available quantity

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  reservedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  issuedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  quarantineQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  rejectedQuantity: number;

  @Column({ length: 50 })
  uom: string;

  // Valuation
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  purchasePrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  landedCost: number; // Including freight, duties, etc.

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  currentValue: number;

  @Column({ default: 'INR', length: 3 })
  currency: string;

  // Storage conditions
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  storageTemperatureMin: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  storageTemperatureMax: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  storageHumidityMin: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  storageHumidityMax: number;

  @Column({ type: 'text', nullable: true })
  storageInstructions: string;

  @Column({ type: 'text', nullable: true })
  handlingInstructions: string;

  // Compliance and certification
  @Column({ type: 'json', nullable: true })
  certifications: {
    certificateType: string;
    certificateNumber: string;
    issuedBy: string;
    issueDate: Date;
    expiryDate: Date;
  }[];

  @Column({ type: 'json', nullable: true })
  regulatoryInfo: {
    regulation: string;
    complianceStatus: string;
    approvalNumber: string;
    approvalDate: Date;
  }[];

  // Traceability
  @Column({ length: 100, nullable: true })
  parentBatchId: string; // For repackaging/splitting

  @Column({ type: 'json', nullable: true })
  childBatchIds: string[]; // Batches created from this batch

  @Column({ type: 'json', nullable: true })
  ingredientBatches: {
    itemId: string;
    itemCode: string;
    itemName: string;
    batchNumber: string;
    quantity: number;
  }[]; // For manufactured items - ingredient batches

  // Recall information
  @Column({ default: false })
  isRecalled: boolean;

  @Column({ type: 'date', nullable: true })
  recallDate: Date;

  @Column({ length: 255, nullable: true })
  recallReason: string;

  @Column({ type: 'text', nullable: true })
  recallNotes: string;

  // Additional attributes
  @Column({ type: 'json', nullable: true })
  customAttributes: {
    attributeName: string;
    attributeValue: string;
  }[];

  // Packaging details
  @Column({ length: 100, nullable: true })
  packagingType: string;

  @Column({ type: 'int', nullable: true })
  unitsPerPackage: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  netWeight: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  grossWeight: number;

  @Column({ length: 20, nullable: true })
  weightUnit: string;

  // Country of origin
  @Column({ length: 100, nullable: true })
  countryOfOrigin: string;

  @Column({ length: 100, nullable: true })
  portOfEntry: string;

  // Barcode
  @Column({ length: 255, nullable: true })
  barcode: string;

  @Column({ type: 'text', nullable: true })
  qrCode: string;

  // FIFO tracking
  @Column({ type: 'int', default: 0 })
  fifoSequence: number; // For FIFO picking

  @Column({ default: true })
  isPickable: boolean; // Can be picked for orders

  // Notes and remarks
  @Column({ type: 'text', nullable: true })
  description: string;

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
}
