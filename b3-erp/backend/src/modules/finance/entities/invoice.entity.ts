import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum InvoiceType {
  SALES_INVOICE = 'Sales Invoice',
  PURCHASE_INVOICE = 'Purchase Invoice',
  CREDIT_NOTE = 'Credit Note',
  DEBIT_NOTE = 'Debit Note',
  PROFORMA = 'Proforma Invoice',
}

export enum InvoiceStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  APPROVED = 'Approved',
  SENT = 'Sent',
  PARTIALLY_PAID = 'Partially Paid',
  PAID = 'Paid',
  OVERDUE = 'Overdue',
  CANCELLED = 'Cancelled',
  VOID = 'Void',
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  invoiceNumber: string;

  @Column({
    type: 'enum',
    enum: InvoiceType,
  })
  invoiceType: InvoiceType;

  @Column({ type: 'date' })
  invoiceDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  // Customer/Vendor information
  @Column()
  partyId: string;

  @Column({ length: 255 })
  partyName: string;

  @Column({ length: 50 })
  partyType: string; // Customer, Vendor

  @Column({ type: 'text', nullable: true })
  billingAddress: string;

  @Column({ type: 'text', nullable: true })
  shippingAddress: string;

  // Reference
  @Column({ nullable: true, length: 100 })
  referenceNumber: string; // PO, SO, etc.

  @Column({ nullable: true })
  referenceId: string;

  // Financial details
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  shippingCharges: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  otherCharges: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balanceAmount: number;

  // Payment terms
  @Column({ length: 100, nullable: true })
  paymentTerms: string;

  @Column({ type: 'int', default: 0 })
  creditDays: number;

  // Currency
  @Column({ default: 'INR', length: 3 })
  currency: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, default: 1 })
  exchangeRate: number;

  // Status
  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
  })
  status: InvoiceStatus;

  // Posting to GL
  @Column({ default: false })
  isPosted: boolean;

  @Column({ nullable: true })
  journalEntryId: string;

  @Column({ type: 'timestamp', nullable: true })
  postedAt: Date;

  @Column({ nullable: true })
  postedBy: string;

  // Tax details
  @Column({ type: 'json', nullable: true })
  taxBreakup: {
    taxName: string;
    taxRate: number;
    taxableAmount: number;
    taxAmount: number;
  }[];

  // Additional fields
  @Column({ type: 'text', nullable: true })
  terms: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

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

  @OneToMany(() => InvoiceLine, (line) => line.invoice, { cascade: true })
  lines: InvoiceLine[];
}

@Entity('invoice_lines')
export class InvoiceLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  invoiceId: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.lines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;

  @Column({ type: 'int' })
  lineNumber: number;

  @Column({ nullable: true })
  productId: string;

  @Column({ length: 255 })
  productName: string;

  @Column({ length: 50, nullable: true })
  productCode: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  quantity: number;

  @Column({ length: 50 })
  unit: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number;

  // GL Account mapping
  @Column({ nullable: true })
  glAccountId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
