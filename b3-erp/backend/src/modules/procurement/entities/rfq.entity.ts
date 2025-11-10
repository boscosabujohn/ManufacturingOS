import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RFQStatus {
  DRAFT = 'Draft',
  SENT = 'Sent',
  IN_PROGRESS = 'In Progress',
  QUOTES_RECEIVED = 'Quotes Received',
  EVALUATED = 'Evaluated',
  AWARDED = 'Awarded',
  CLOSED = 'Closed',
  CANCELLED = 'Cancelled',
}

export enum RFQType {
  STANDARD = 'Standard',
  SERVICE = 'Service',
  TENDER = 'Tender',
  EMERGENCY = 'Emergency',
}

@Entity('rfqs')
export class RFQ {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  rfqNumber: string;

  @Column({ type: 'date' })
  rfqDate: Date;

  @Column({ type: 'date' })
  submissionDeadline: Date;

  @Column({ type: 'date', nullable: true })
  validUntil: Date;

  @Column({
    type: 'enum',
    enum: RFQStatus,
    default: RFQStatus.DRAFT,
  })
  status: RFQStatus;

  @Column({
    type: 'enum',
    enum: RFQType,
    default: RFQType.STANDARD,
  })
  rfqType: RFQType;

  // Reference Information
  @Column({ length: 50, nullable: true })
  prNumber: string;

  @Column({ nullable: true })
  prId: string;

  // RFQ Details
  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  // Buyer Information
  @Column({ length: 100 })
  buyerId: string;

  @Column({ length: 255 })
  buyerName: string;

  @Column({ length: 100, nullable: true })
  department: string;

  @Column({ length: 100, nullable: true })
  buyerEmail: string;

  @Column({ length: 50, nullable: true })
  buyerPhone: string;

  // Vendors
  @Column({ type: 'json' })
  vendors: {
    vendorId: string;
    vendorCode: string;
    vendorName: string;
    email: string;
    contactPerson: string;
    sentDate: Date;
    receivedDate?: Date;
    quotationId?: string;
    quotationNumber?: string;
    quotationAmount?: number;
    status: string;
  }[];

  // Items
  @Column({ type: 'json' })
  items: {
    lineNumber: number;
    itemId: string;
    itemCode: string;
    itemName: string;
    description: string;
    uom: string;
    quantity: number;
    specification: string;
    requiredDate: Date;
    estimatedPrice: number;
    targetPrice: number;
    notes: string;
  }[];

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  estimatedTotal: number;

  // Terms and Conditions
  @Column({ type: 'text', nullable: true })
  termsAndConditions: string;

  @Column({ type: 'text', nullable: true })
  paymentTerms: string;

  @Column({ type: 'text', nullable: true })
  deliveryTerms: string;

  @Column({ type: 'text', nullable: true })
  qualityRequirements: string;

  @Column({ type: 'text', nullable: true })
  packingRequirements: string;

  // Evaluation Criteria
  @Column({ type: 'json', nullable: true })
  evaluationCriteria: {
    criterion: string;
    weightage: number;
    description: string;
  }[];

  @Column({ type: 'text', nullable: true })
  technicalRequirements: string;

  @Column({ type: 'text', nullable: true })
  commercialRequirements: string;

  // Comparative Analysis
  @Column({ type: 'json', nullable: true })
  comparativeAnalysis: {
    itemId: string;
    itemCode: string;
    itemName: string;
    quotes: {
      vendorId: string;
      vendorName: string;
      unitPrice: number;
      totalPrice: number;
      deliveryTime: number;
      paymentTerms: string;
      score: number;
      rank: number;
    }[];
    lowestQuote: number;
    highestQuote: number;
    averageQuote: number;
    recommendedVendor: string;
  }[];

  // Award Information
  @Column({ nullable: true })
  awardedVendorId: string;

  @Column({ length: 255, nullable: true })
  awardedVendorName: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  awardedAmount: number;

  @Column({ type: 'date', nullable: true })
  awardedDate: Date;

  @Column({ type: 'text', nullable: true })
  awardJustification: string;

  @Column({ nullable: true })
  awardedPOId: string;

  @Column({ length: 50, nullable: true })
  awardedPONumber: string;

  // Quotation Summary
  @Column({ type: 'int', default: 0 })
  quotationsReceived: number;

  @Column({ type: 'int', default: 0 })
  quotationsPending: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  lowestQuotationAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  highestQuotationAmount: number;

  // Additional Information
  @Column({ type: 'text', nullable: true })
  notes: string;

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
