import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TransportCompanyStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  BLACKLISTED = 'Blacklisted',
  SUSPENDED = 'Suspended',
}

export enum TransportCompanyType {
  OWN_FLEET = 'Own Fleet',
  THIRD_PARTY = 'Third Party',
  COURIER = 'Courier',
  FREIGHT_FORWARDER = 'Freight Forwarder',
  SHIPPING_LINE = 'Shipping Line',
  AIRLINE = 'Airline',
  RAILWAY = 'Railway',
}

export enum ServiceType {
  ROAD = 'Road',
  RAIL = 'Rail',
  AIR = 'Air',
  SEA = 'Sea',
  COURIER = 'Courier',
  MULTIMODAL = 'Multimodal',
}

@Entity('logistics_transport_companies')
export class TransportCompany {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Company Identification
  @Column({ unique: true, length: 50 })
  companyCode: string;

  @Column({ length: 200 })
  companyName: string;

  @Column({ length: 200, nullable: true })
  legalName: string;

  @Column({
    type: 'enum',
    enum: TransportCompanyType,
    default: TransportCompanyType.THIRD_PARTY,
  })
  companyType: TransportCompanyType;

  @Column({
    type: 'enum',
    enum: TransportCompanyStatus,
    default: TransportCompanyStatus.ACTIVE,
  })
  status: TransportCompanyStatus;

  // Contact Information
  @Column({ type: 'text' })
  address: string;

  @Column({ nullable: true, length: 100 })
  addressLine2: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  state: string;

  @Column({ length: 20 })
  postalCode: string;

  @Column({ length: 100 })
  country: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 20, nullable: true })
  alternatePhone: string;

  @Column({ nullable: true, length: 20 })
  fax: string;

  @Column({ nullable: true, length: 200 })
  website: string;

  // Primary Contact Person
  @Column({ length: 100 })
  contactPersonName: string;

  @Column({ nullable: true, length: 100 })
  contactPersonDesignation: string;

  @Column({ length: 100 })
  contactPersonEmail: string;

  @Column({ length: 20 })
  contactPersonPhone: string;

  // Additional Contacts
  @Column({ type: 'json', nullable: true })
  additionalContacts: Array<{
    name: string;
    designation: string;
    email: string;
    phone: string;
    isPrimary: boolean;
  }>;

  // Business Details
  @Column({ nullable: true, length: 100 })
  registrationNumber: string;

  @Column({ type: 'date', nullable: true })
  incorporationDate: Date;

  @Column({ nullable: true, length: 100 })
  gstNumber: string;

  @Column({ nullable: true, length: 100 })
  panNumber: string;

  @Column({ nullable: true, length: 100 })
  tanNumber: string;

  @Column({ nullable: true, length: 100 })
  iecCode: string; // Import Export Code

  // Service Details
  @Column({ type: 'simple-array' })
  serviceTypes: ServiceType[];

  @Column({ type: 'simple-array', nullable: true })
  serviceAreas: string[]; // Cities, States, Regions they cover

  @Column({ type: 'simple-array', nullable: true })
  specializations: string[]; // Refrigerated, Hazardous, Oversized, etc.

  @Column({ default: false })
  hasGpsTracking: boolean;

  @Column({ default: false })
  providesInsurance: boolean;

  @Column({ default: false })
  hasWarehouse: boolean;

  @Column({ type: 'simple-array', nullable: true })
  certifications: string[]; // ISO, etc.

  // Fleet Information
  @Column({ type: 'int', default: 0 })
  numberOfVehicles: number;

  @Column({ type: 'int', default: 0 })
  numberOfDrivers: number;

  @Column({ type: 'json', nullable: true })
  fleetDetails: Array<{
    vehicleType: string;
    count: number;
    capacity: number;
    capacityUnit: string;
  }>;

  // Capacity and Coverage
  @Column({ type: 'decimal', precision: 15, scale: 3, nullable: true })
  totalCapacity: number;

  @Column({ length: 50, nullable: true })
  capacityUnit: string;

  @Column({ type: 'simple-array', nullable: true })
  operatingStates: string[];

  @Column({ type: 'simple-array', nullable: true })
  operatingCountries: string[];

  @Column({ default: false })
  providesInternationalService: boolean;

  // Rates and Charges
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  baseRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  perKmRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  perKgRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minimumCharges: number;

  @Column({ length: 10, default: 'INR' })
  currency: string;

  @Column({ type: 'json', nullable: true })
  rateCard: Array<{
    serviceType: string;
    fromLocation: string;
    toLocation: string;
    vehicleType: string;
    rate: number;
    rateType: string;
    validFrom: Date;
    validTo: Date;
  }>;

  // Payment Terms
  @Column({ nullable: true, length: 100 })
  paymentTerms: string; // Advance, COD, Credit

  @Column({ type: 'int', default: 0 })
  creditDays: number;

  @Column({ nullable: true, length: 100 })
  preferredPaymentMode: string;

  @Column({ nullable: true, length: 100 })
  bankName: string;

  @Column({ nullable: true, length: 50 })
  accountNumber: string;

  @Column({ nullable: true, length: 50 })
  ifscCode: string;

  @Column({ nullable: true, length: 100 })
  accountHolderName: string;

  // Performance Metrics
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  performanceRating: number; // Out of 5

  @Column({ type: 'int', default: 0 })
  totalShipmentsHandled: number;

  @Column({ type: 'int', default: 0 })
  onTimeDeliveries: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  onTimeDeliveryRate: number; // Percentage

  @Column({ type: 'int', default: 0 })
  damagedShipments: number;

  @Column({ type: 'int', default: 0 })
  lostShipments: number;

  @Column({ type: 'int', default: 0 })
  customerComplaints: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalBusinessValue: number;

  @Column({ type: 'date', nullable: true })
  lastShipmentDate: Date;

  // Contract Details
  @Column({ nullable: true })
  contractId: string;

  @Column({ nullable: true, length: 100 })
  contractNumber: string;

  @Column({ type: 'date', nullable: true })
  contractStartDate: Date;

  @Column({ type: 'date', nullable: true })
  contractEndDate: Date;

  @Column({ nullable: true, length: 100 })
  contractStatus: string;

  @Column({ type: 'text', nullable: true })
  contractTerms: string;

  // Insurance
  @Column({ default: false })
  hasInsurance: boolean;

  @Column({ nullable: true, length: 200 })
  insuranceCompany: string;

  @Column({ nullable: true, length: 100 })
  insurancePolicyNumber: string;

  @Column({ type: 'date', nullable: true })
  insuranceExpiryDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  insuranceCoverage: number;

  // Compliance
  @Column({ type: 'json', nullable: true })
  licenses: Array<{
    licenseType: string;
    licenseNumber: string;
    issueDate: Date;
    expiryDate: Date;
    issuingAuthority: string;
  }>;

  @Column({ type: 'json', nullable: true })
  complianceCertificates: Array<{
    certificateType: string;
    certificateNumber: string;
    issueDate: Date;
    expiryDate: Date;
  }>;

  // SLA and KPIs
  @Column({ type: 'int', nullable: true })
  guaranteedDeliveryDays: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  expectedOnTimeRate: number; // Percentage

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  maxDamageRate: number; // Percentage

  @Column({ type: 'json', nullable: true })
  slaTerms: Record<string, any>;

  // Additional Information
  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  blacklistReason: string;

  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
  }>;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
