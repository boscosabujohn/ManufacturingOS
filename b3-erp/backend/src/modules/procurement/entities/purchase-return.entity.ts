import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PurchaseReturnStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  DISPATCHED = 'Dispatched',
  RECEIVED_BY_VENDOR = 'Received by Vendor',
  CREDIT_NOTE_RECEIVED = 'Credit Note Received',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum ReturnReason {
  DAMAGED = 'Damaged',
  DEFECTIVE = 'Defective',
  WRONG_ITEM = 'Wrong Item',
  EXCESS_QUANTITY = 'Excess Quantity',
  QUALITY_ISSUE = 'Quality Issue',
  EXPIRED = 'Expired',
  NOT_AS_PER_SPECIFICATION = 'Not as per Specification',
  OTHER = 'Other',
}

@Entity('purchase_returns')
export class PurchaseReturn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  returnNumber: string;

  @Column({ type: 'date' })
  returnDate: Date;

  @Column({
    type: 'enum',
    enum: PurchaseReturnStatus,
    default: PurchaseReturnStatus.DRAFT,
  })
  status: PurchaseReturnStatus;

  // References
  @Column({ nullable: true })
  goodsReceiptId: string;

  @Column({ length: 50, nullable: true })
  goodsReceiptNumber: string;

  @Column({ nullable: true })
  purchaseOrderId: string;

  @Column({ length: 50, nullable: true })
  purchaseOrderNumber: string;

  // Vendor Information
  @Column()
  vendorId: string;

  @Column({ length: 255 })
  vendorName: string;

  @Column({ length: 50 })
  vendorCode: string;

  @Column({ type: 'text', nullable: true })
  vendorAddress: string;

  @Column({ length: 100, nullable: true })
  vendorContactPerson: string;

  @Column({ length: 100, nullable: true })
  vendorEmail: string;

  @Column({ length: 50, nullable: true })
  vendorPhone: string;

  // Return Details
  @Column({
    type: 'enum',
    enum: ReturnReason,
  })
  returnReason: ReturnReason;

  @Column({ type: 'text' })
  returnReasonDescription: string;

  // Items
  @Column({ type: 'json' })
  items: {
    lineNumber: number;
    grnItemId: string;
    poItemId?: string;
    itemId: string;
    itemCode: string;
    itemName: string;
    description: string;
    uom: string;
    receivedQuantity: number;
    returnQuantity: number;
    unitPrice: number;
    lineTotal: number;
    taxAmount: number;
    totalAmount: number;
    batchNumber?: string;
    serialNumber?: string;
    returnReason: string;
    remarks: string;
  }[];

  // Financial Information
  @Column({ default: 'INR', length: 3 })
  currency: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number;

  // Dispatch Information
  @Column({ type: 'date', nullable: true })
  dispatchDate: Date;

  @Column({ length: 100, nullable: true })
  dispatchedBy: string;

  @Column({ length: 100, nullable: true })
  vehicleNumber: string;

  @Column({ length: 100, nullable: true })
  driverName: string;

  @Column({ length: 50, nullable: true })
  driverPhone: string;

  @Column({ length: 100, nullable: true })
  transporterName: string;

  @Column({ length: 100, nullable: true })
  lrNumber: string;

  @Column({ type: 'date', nullable: true })
  lrDate: Date;

  @Column({ length: 100, nullable: true })
  eWayBillNumber: string;

  // Vendor Acknowledgment
  @Column({ default: false })
  isAcknowledgedByVendor: boolean;

  @Column({ type: 'date', nullable: true })
  vendorAcknowledgmentDate: Date;

  @Column({ type: 'text', nullable: true })
  vendorAcknowledgmentRemarks: string;

  // Credit Note Information
  @Column({ default: false })
  isCreditNoteReceived: boolean;

  @Column({ length: 50, nullable: true })
  creditNoteNumber: string;

  @Column({ type: 'date', nullable: true })
  creditNoteDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  creditNoteAmount: number;

  @Column({ nullable: true })
  creditNoteId: string;

  // Approval Workflow
  @Column({ default: false })
  isApproved: boolean;

  @Column({ nullable: true, length: 100 })
  approvedBy: string;

  @Column({ nullable: true, length: 255 })
  approverName: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'text', nullable: true })
  approvalNotes: string;

  @Column({ nullable: true, length: 100 })
  rejectedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  // Inventory Adjustment
  @Column({ default: false })
  isInventoryAdjusted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  inventoryAdjustedAt: Date;

  @Column({ nullable: true, length: 100 })
  inventoryAdjustedBy: string;

  @Column({ type: 'json', nullable: true })
  inventoryTransactions: {
    transactionId: string;
    transactionNumber: string;
    itemId: string;
    quantity: number;
    adjustedAt: Date;
  }[];

  // Accounting Posting
  @Column({ default: false })
  isPostedToAccounting: boolean;

  @Column({ type: 'timestamp', nullable: true })
  accountingPostedAt: Date;

  @Column({ nullable: true, length: 100 })
  accountingPostedBy: string;

  @Column({ nullable: true })
  journalEntryId: string;

  @Column({ length: 50, nullable: true })
  journalEntryNumber: string;

  // Additional Information
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  internalRemarks: string;

  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
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
