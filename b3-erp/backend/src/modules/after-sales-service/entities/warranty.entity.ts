import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

export enum WarrantyStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CLAIMED = 'claimed',
  TRANSFERRED = 'transferred',
  CANCELLED = 'cancelled',
}

export enum WarrantyType {
  STANDARD = 'standard',
  EXTENDED = 'extended',
  MANUFACTURER = 'manufacturer',
  DEALER = 'dealer',
  COMPREHENSIVE = 'comprehensive',
}

export enum WarrantyCoverage {
  PARTS_ONLY = 'parts_only',
  LABOR_ONLY = 'labor_only',
  PARTS_AND_LABOR = 'parts_and_labor',
  COMPREHENSIVE = 'comprehensive',
}

export class Warranty {
  id: string;
  warrantyNumber: string;
  warrantyType: WarrantyType;
  status: WarrantyStatus;

  // Equipment Information
  equipmentId: string;
  equipmentModel: string;
  equipmentSerialNumber: string;
  equipmentCategory: string;

  // Customer Information
  customerId: string;
  customerName: string;
  installationSiteId?: string;
  installationAddress?: string;

  // Warranty Period
  startDate: Date;
  endDate: Date;
  durationMonths: number;

  // Coverage
  coverage: WarrantyCoverage;
  coverageScope: string[];
  exclusions: string[];

  // Registration
  registrationDate: Date;
  activationDate: Date;
  installationDate?: Date;
  commissioningDate?: Date;

  // Source
  salesOrderId?: string;
  invoiceId?: string;
  installationJobId?: string;

  // Extended Warranty
  isExtended: boolean;
  baseWarrantyId?: string; // original warranty if this is extended
  extendedDurationMonths?: number;
  extendedCost?: number;

  // Transfer
  transferredFrom?: string; // previous owner
  transferredTo?: string; // new owner
  transferDate?: Date;
  transferReason?: string;

  // OEM/Manufacturer
  manufacturerWarranty: boolean;
  manufacturerId?: string;
  manufacturerWarrantyNumber?: string;
  manufacturerContactInfo?: Record<string, any>;

  // Alerts
  expiryAlertDays: number[]; // [90, 60, 30]
  alertsSent?: Date[];
  extensionOfferSent: boolean;
  extensionOfferDate?: Date;

  // Related Documents
  warrantyCard?: string;
  installationCertificate?: string;
  invoiceCopy?: string;
  attachments?: string[];

  // Terms
  termsAndConditions: string;
  claimProcess?: string;

  // Statistics
  totalClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  totalClaimCost: number;

  // Audit
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum WarrantyClaimStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CLOSED = 'closed',
}

export class WarrantyClaim {
  id: string;
  claimNumber: string;
  warrantyId: string;
  status: WarrantyClaimStatus;

  // Equipment & Fault
  equipmentId: string;
  faultDescription: string;
  faultCategory: string;
  faultDate: Date;

  // Customer Information
  customerId: string;
  customerName: string;
  contactPerson?: string;
  contactPhone?: string;

  // Claim Details
  claimDate: Date;
  claimReason: string;
  actionRequired: string;

  // Eligibility
  eligibilityChecked: boolean;
  eligibilityStatus: string; // eligible/not_eligible/partial
  eligibilityNotes?: string;
  ineligibilityReason?: string;

  // Approval
  approvalRequired: boolean;
  approvedBy?: string;
  approvalDate?: Date;
  approvalNotes?: string;
  rejectionReason?: string;

  // Service Execution
  serviceTicketId?: string;
  serviceDate?: Date;
  serviceEngineer?: string;
  actionTaken?: string;

  // Parts Replacement
  partsReplaced?: Array<{
    partId: string;
    partName: string;
    quantity: number;
    cost: number;
  }>;

  // Labor
  laborHours?: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  laborCost: number;

  // Costs
  partsCost: number;
  totalCost: number;
  customerCharge: number; // if partial coverage
  companyBearing: number;

  // OEM Coordination
  oemClaim: boolean;
  oemClaimNumber?: string;
  oemApprovalDate?: Date;
  oemReimbursement?: number;

  // Resolution
  resolutionDate?: Date;
  resolutionNotes?: string;
  customerSatisfaction?: number;

  // Documents
  faultPhotos?: string[];
  serviceReport?: string;
  invoiceDoc?: string;
  attachments?: string[];

  // Audit
  createdBy: string;
  updatedBy?: string;
  reviewedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
