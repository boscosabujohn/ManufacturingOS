import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum VendorType {
  MANUFACTURER = 'Manufacturer',
  DISTRIBUTOR = 'Distributor',
  SERVICE_PROVIDER = 'Service Provider',
  RAW_MATERIAL_SUPPLIER = 'Raw Material Supplier',
  CONTRACTOR = 'Contractor',
}

export enum VendorStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  SUSPENDED = 'Suspended',
  BLACKLISTED = 'Blacklisted',
  PROSPECTIVE = 'Prospective',
}

export enum VendorRating {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  FAIR = 'Fair',
  POOR = 'Poor',
  NO_RATING = 'No Rating',
}

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  vendorCode: string;

  @Column({ length: 255 })
  vendorName: string;

  @Column({
    type: 'enum',
    enum: VendorType,
    default: VendorType.MANUFACTURER,
  })
  vendorType: VendorType;

  @Column({
    type: 'enum',
    enum: VendorStatus,
    default: VendorStatus.PROSPECTIVE,
  })
  status: VendorStatus;

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
  address: string;

  @Column({ length: 255, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 20, nullable: true })
  zipCode: string;

  // Tax Information
  @Column({ length: 50, nullable: true })
  taxId: string;

  @Column({ length: 50, nullable: true })
  gstNumber: string;

  @Column({ length: 50, nullable: true })
  panNumber: string;

  @Column({ default: false })
  isTaxDeducted: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  tdsRate: number;

  // Financial Information
  @Column({ type: 'int', default: 30 })
  paymentTermsDays: number;

  @Column({ length: 100, nullable: true })
  paymentTerms: string;

  @Column({ default: 'INR', length: 3 })
  currency: string;

  // Banking Information
  @Column({ length: 255, nullable: true })
  bankName: string;

  @Column({ length: 100, nullable: true })
  bankAccountNumber: string;

  @Column({ length: 50, nullable: true })
  ifscCode: string;

  @Column({ length: 50, nullable: true })
  swiftCode: string;

  @Column({ length: 255, nullable: true })
  beneficiaryName: string;

  // Performance Metrics
  @Column({
    type: 'enum',
    enum: VendorRating,
    default: VendorRating.NO_RATING,
  })
  qualityRating: VendorRating;

  @Column({
    type: 'enum',
    enum: VendorRating,
    default: VendorRating.NO_RATING,
  })
  deliveryRating: VendorRating;

  @Column({
    type: 'enum',
    enum: VendorRating,
    default: VendorRating.NO_RATING,
  })
  priceRating: VendorRating;

  @Column({
    type: 'enum',
    enum: VendorRating,
    default: VendorRating.NO_RATING,
  })
  overallRating: VendorRating;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  onTimeDeliveryPercentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  defectRate: number;

  @Column({ type: 'int', default: 0 })
  leadTimeDays: number;

  // Business Classification
  @Column({ type: 'text', nullable: true })
  productsSupplied: string;

  @Column({ type: 'text', nullable: true })
  servicesProvided: string;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column({ nullable: true })
  buyerId: string;

  @Column({ length: 255, nullable: true })
  buyerName: string;

  // Certifications
  @Column({ default: false })
  isISO9001Certified: boolean;

  @Column({ default: false })
  isISO14001Certified: boolean;

  @Column({ type: 'json', nullable: true })
  certifications: {
    name: string;
    certificationNumber: string;
    issuedBy: string;
    issueDate: Date;
    expiryDate: Date;
  }[];

  // Balances (calculated fields)
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  outstandingPayables: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalPurchases: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  lastPurchaseAmount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastPurchaseDate: Date;

  // Approval Workflow
  @Column({ default: false })
  isApproved: boolean;

  @Column({ nullable: true, length: 100 })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

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

  // Virtual fields
  averageRating?: number;
  paymentStatus?: string;
}
