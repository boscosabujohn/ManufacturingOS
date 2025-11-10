import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CustomerType {
  INDIVIDUAL = 'Individual',
  COMPANY = 'Company',
  GOVERNMENT = 'Government',
  DISTRIBUTOR = 'Distributor',
  RESELLER = 'Reseller',
}

export enum CustomerStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  SUSPENDED = 'Suspended',
  BLACKLISTED = 'Blacklisted',
}

export enum CreditRating {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  FAIR = 'Fair',
  POOR = 'Poor',
  NO_RATING = 'No Rating',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  customerCode: string;

  @Column({ length: 255 })
  customerName: string;

  @Column({
    type: 'enum',
    enum: CustomerType,
    default: CustomerType.COMPANY,
  })
  customerType: CustomerType;

  @Column({
    type: 'enum',
    enum: CustomerStatus,
    default: CustomerStatus.ACTIVE,
  })
  status: CustomerStatus;

  // Contact Information
  @Column({ length: 255, nullable: true })
  contactPerson: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 50, nullable: true })
  mobile: string;

  @Column({ length: 50, nullable: true })
  fax: string;

  @Column({ length: 255, nullable: true })
  website: string;

  // Address Information
  @Column({ type: 'text', nullable: true })
  billingAddress: string;

  @Column({ length: 255, nullable: true })
  billingCity: string;

  @Column({ length: 100, nullable: true })
  billingState: string;

  @Column({ length: 100, nullable: true })
  billingCountry: string;

  @Column({ length: 20, nullable: true })
  billingZipCode: string;

  @Column({ type: 'text', nullable: true })
  shippingAddress: string;

  @Column({ length: 255, nullable: true })
  shippingCity: string;

  @Column({ length: 100, nullable: true })
  shippingState: string;

  @Column({ length: 100, nullable: true })
  shippingCountry: string;

  @Column({ length: 20, nullable: true })
  shippingZipCode: string;

  // Tax Information
  @Column({ length: 50, nullable: true })
  taxId: string;

  @Column({ length: 50, nullable: true })
  gstNumber: string;

  @Column({ length: 50, nullable: true })
  panNumber: string;

  @Column({ default: false })
  isTaxExempt: boolean;

  // Financial Information
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  creditLimit: number;

  @Column({ type: 'int', default: 30 })
  creditDays: number;

  @Column({
    type: 'enum',
    enum: CreditRating,
    default: CreditRating.NO_RATING,
  })
  creditRating: CreditRating;

  @Column({ length: 100, nullable: true })
  paymentTerms: string;

  @Column({ default: 'INR', length: 3 })
  currency: string;

  @Column({ length: 100, nullable: true })
  priceList: string;

  // Banking Information
  @Column({ length: 255, nullable: true })
  bankName: string;

  @Column({ length: 100, nullable: true })
  bankAccountNumber: string;

  @Column({ length: 50, nullable: true })
  ifscCode: string;

  @Column({ length: 50, nullable: true })
  swiftCode: string;

  // Business Classification
  @Column({ length: 100, nullable: true })
  industry: string;

  @Column({ length: 100, nullable: true })
  territory: string;

  @Column({ length: 100, nullable: true })
  salesPerson: string;

  @Column({ nullable: true })
  salesPersonId: string;

  @Column({ length: 100, nullable: true })
  customerGroup: string;

  // Balances (calculated fields)
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  outstandingBalance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalSales: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  lastSaleAmount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastSaleDate: Date;

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

  // Loyalty & Discount
  @Column({ type: 'int', default: 0 })
  loyaltyPoints: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  defaultDiscountPercentage: number;

  // Metadata
  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual fields
  isOverdue?: boolean;
  creditAvailable?: number;
}
