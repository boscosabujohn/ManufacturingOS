import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PurchaseInvoiceStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  UNDER_VERIFICATION = 'Under Verification',
  MATCHED = 'Matched',
  MISMATCH = 'Mismatch',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  POSTED = 'Posted',
  PAID = 'Paid',
  PARTIALLY_PAID = 'Partially Paid',
  OVERDUE = 'Overdue',
  CANCELLED = 'Cancelled',
}

export enum InvoiceType {
  STANDARD = 'Standard',
  DEBIT_NOTE = 'Debit Note',
  CREDIT_NOTE = 'Credit Note',
  ADVANCE = 'Advance',
  FINAL = 'Final',
}

export enum MatchingStatus {
  NOT_MATCHED = 'Not Matched',
  TWO_WAY_MATCHED = '2-Way Matched',
  THREE_WAY_MATCHED = '3-Way Matched',
  QUANTITY_MISMATCH = 'Quantity Mismatch',
  PRICE_MISMATCH = 'Price Mismatch',
  AMOUNT_MISMATCH = 'Amount Mismatch',
  TOLERANCE_EXCEEDED = 'Tolerance Exceeded',
}

@Entity('purchase_invoices')
export class PurchaseInvoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  internalInvoiceNumber: string;

  @Column({ length: 50 })
  vendorInvoiceNumber: string;

  @Column({ type: 'date' })
  invoiceDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'date', nullable: true })
  receivedDate: Date;

  @Column({
    type: 'enum',
    enum: PurchaseInvoiceStatus,
    default: PurchaseInvoiceStatus.DRAFT,
  })
  status: PurchaseInvoiceStatus;

  @Column({
    type: 'enum',
    enum: InvoiceType,
    default: InvoiceType.STANDARD,
  })
  invoiceType: InvoiceType;

  // Purchase Order Reference
  @Column({ nullable: true })
  purchaseOrderId: string;

  @Column({ length: 50, nullable: true })
  purchaseOrderNumber: string;

  @Column({ type: 'date', nullable: true })
  purchaseOrderDate: Date;

  // Goods Receipt Reference
  @Column({ type: 'json', nullable: true })
  goodsReceipts: {
    grnId: string;
    grnNumber: string;
    grnDate: Date;
    amount: number;
  }[];

  // Vendor Information
  @Column()
  vendorId: string;

  @Column({ length: 255 })
  vendorName: string;

  @Column({ length: 50 })
  vendorCode: string;

  @Column({ type: 'text', nullable: true })
  vendorAddress: string;

  @Column({ length: 50, nullable: true })
  vendorGSTIN: string;

  @Column({ length: 50, nullable: true })
  vendorPAN: string;

  // Invoice Items
  @Column({ type: 'json' })
  items: {
    lineNumber: number;
    poItemId?: string;
    grnItemId?: string;
    itemId: string;
    itemCode: string;
    itemName: string;
    description: string;
    uom: string;
    invoicedQuantity: number;
    receivedQuantity?: number;
    orderedQuantity?: number;
    unitPrice: number;
    discountPercentage: number;
    discountAmount: number;
    netUnitPrice: number;
    taxCode: string;
    taxRate: number;
    taxAmount: number;
    lineTotal: number;
    totalAmount: number;
    accountCode: string;
    costCenter?: string;
    project?: string;
  }[];

  // Financial Information
  @Column({ default: 'INR', length: 3 })
  currency: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 1 })
  exchangeRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxableAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  cgstAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  sgstAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  igstAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  cessAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalTaxAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  tcsAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  tdsAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  shippingCharges: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  otherCharges: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  roundOffAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balanceAmount: number;

  // 3-Way Matching
  @Column({
    type: 'enum',
    enum: MatchingStatus,
    default: MatchingStatus.NOT_MATCHED,
  })
  matchingStatus: MatchingStatus;

  @Column({ default: false })
  isMatched: boolean;

  @Column({ type: 'timestamp', nullable: true })
  matchedAt: Date;

  @Column({ nullable: true, length: 100 })
  matchedBy: string;

  @Column({ type: 'json', nullable: true })
  matchingDetails: {
    itemId: string;
    itemCode: string;
    poQuantity: number;
    grnQuantity: number;
    invoiceQuantity: number;
    poPrice: number;
    grnPrice: number;
    invoicePrice: number;
    poAmount: number;
    grnAmount: number;
    invoiceAmount: number;
    quantityVariance: number;
    priceVariance: number;
    amountVariance: number;
    status: string;
    remarks: string;
  }[];

  @Column({ type: 'json', nullable: true })
  matchingExceptions: {
    type: string;
    description: string;
    variance: number;
    threshold: number;
    isWithinTolerance: boolean;
    requiresApproval: boolean;
  }[];

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

  // Payment Information
  @Column({ length: 100, nullable: true })
  paymentTerms: string;

  @Column({ type: 'int', default: 30 })
  paymentTermsDays: number;

  @Column({ type: 'json', nullable: true })
  payments: {
    paymentId: string;
    paymentNumber: string;
    paymentDate: Date;
    paymentMethod: string;
    amount: number;
    reference: string;
  }[];

  @Column({ type: 'date', nullable: true })
  lastPaymentDate: Date;

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

  // Tax Compliance
  @Column({ length: 100, nullable: true })
  placeOfSupply: string;

  @Column({ default: false })
  isReverseCharge: boolean;

  @Column({ default: false })
  isImportInvoice: boolean;

  @Column({ length: 100, nullable: true })
  billOfEntryNumber: string;

  @Column({ type: 'date', nullable: true })
  billOfEntryDate: Date;

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
