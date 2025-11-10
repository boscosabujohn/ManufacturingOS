import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum QuotationStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  UNDER_REVIEW = 'Under Review',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  AWARDED = 'Awarded',
  EXPIRED = 'Expired',
  WITHDRAWN = 'Withdrawn',
}

@Entity('vendor_quotations')
export class VendorQuotation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  quotationNumber: string;

  @Column({ type: 'date' })
  quotationDate: Date;

  @Column({ type: 'date' })
  validUntil: Date;

  @Column({
    type: 'enum',
    enum: QuotationStatus,
    default: QuotationStatus.DRAFT,
  })
  status: QuotationStatus;

  // RFQ Reference
  @Column()
  rfqId: string;

  @Column({ length: 50 })
  rfqNumber: string;

  @Column({ type: 'date' })
  rfqDate: Date;

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

  // Quotation Items
  @Column({ type: 'json' })
  items: {
    lineNumber: number;
    rfqLineNumber: number;
    itemId: string;
    itemCode: string;
    itemName: string;
    description: string;
    uom: string;
    quantity: number;
    unitPrice: number;
    discountPercentage: number;
    discountAmount: number;
    netUnitPrice: number;
    taxRate: number;
    taxAmount: number;
    totalAmount: number;
    deliveryDays: number;
    warranty: string;
    remarks: string;
    alternativeOffered: boolean;
    alternativeDescription?: string;
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
  taxAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  shippingCharges: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  otherCharges: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number;

  // Commercial Terms
  @Column({ length: 100, nullable: true })
  paymentTerms: string;

  @Column({ type: 'text', nullable: true })
  paymentTermsDescription: string;

  @Column({ length: 100, nullable: true })
  deliveryTerms: string;

  @Column({ type: 'int', nullable: true })
  deliveryDays: number;

  @Column({ type: 'date', nullable: true })
  deliveryDate: Date;

  @Column({ length: 100, nullable: true })
  shippingMethod: string;

  @Column({ type: 'text', nullable: true })
  packingDetails: string;

  @Column({ length: 100, nullable: true })
  warrantyPeriod: string;

  @Column({ type: 'text', nullable: true })
  warrantyTerms: string;

  // Technical Details
  @Column({ type: 'text', nullable: true })
  technicalSpecifications: string;

  @Column({ type: 'text', nullable: true })
  qualityStandards: string;

  @Column({ type: 'text', nullable: true })
  certifications: string;

  @Column({ default: false })
  sampleProvided: boolean;

  @Column({ type: 'text', nullable: true })
  sampleDetails: string;

  // Evaluation
  @Column({ default: false })
  isEvaluated: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  evaluationScore: number;

  @Column({ type: 'int', nullable: true })
  rank: number;

  @Column({ type: 'json', nullable: true })
  evaluationCriteria: {
    criterion: string;
    weightage: number;
    score: number;
    weightedScore: number;
    remarks: string;
  }[];

  @Column({ type: 'text', nullable: true })
  evaluationRemarks: string;

  @Column({ nullable: true, length: 100 })
  evaluatedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  evaluatedAt: Date;

  // Award Information
  @Column({ default: false })
  isAwarded: boolean;

  @Column({ type: 'date', nullable: true })
  awardedDate: Date;

  @Column({ nullable: true })
  purchaseOrderId: string;

  @Column({ length: 50, nullable: true })
  purchaseOrderNumber: string;

  @Column({ type: 'text', nullable: true })
  awardRemarks: string;

  // Rejection Information
  @Column({ default: false })
  isRejected: boolean;

  @Column({ type: 'date', nullable: true })
  rejectedDate: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  // Additional Information
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  vendorRemarks: string;

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
