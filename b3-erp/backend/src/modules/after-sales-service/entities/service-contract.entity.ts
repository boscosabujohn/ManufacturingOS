export enum ContractType {
  AMC = 'amc',
  CMC = 'cmc',
  PAY_PER_VISIT = 'pay_per_visit',
  PARTS_AND_LABOR = 'parts_and_labor',
  EXTENDED_WARRANTY = 'extended_warranty',
}

export enum ContractStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  RENEWED = 'renewed',
  TERMINATED = 'terminated',
  SUSPENDED = 'suspended',
}

export enum PricingTier {
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  CUSTOM = 'custom',
}

export class ServiceContract {
  id: string;
  contractNumber: string;
  contractType: ContractType;
  status: ContractStatus;

  // Customer Information
  customerId: string;
  customerName: string;
  customerContactPerson?: string;
  customerEmail?: string;
  customerPhone?: string;

  // Equipment Coverage
  equipmentIds: string[];
  equipmentDetails?: Record<string, any>[];
  coverageScope: string; // single/multiple equipment

  // Contract Dates
  startDate: Date;
  endDate: Date;
  duration: number; // in months

  // Pricing
  pricingTier: PricingTier;
  contractValue: number;
  currency: string;
  billingFrequency: string; // upfront/monthly/quarterly/annual
  paymentTerms: string;

  // Service Terms
  responseTimeSLA: number; // in hours
  resolutionTimeSLA: number; // in hours
  visitFrequency: string; // monthly/quarterly/annual
  serviceCoverage: string[]; // preventive/breakdown/parts/labor

  // Inclusions & Exclusions
  inclusions: string[];
  exclusions: string[];
  partsIncluded: boolean;
  laborIncluded: boolean;
  consumablesIncluded: boolean;

  // Auto-Renewal
  autoRenewal: boolean;
  renewalNotificationDays: number[]; // [90, 60, 30]
  renewalRemindersSent?: Date[];

  // Related Documents
  attachments?: string[];
  terms AndConditions?: string;

  // Sales Information
  salesOrderId?: string;
  salesPersonId?: string;
  commissionableValue?: number;

  // Status Tracking
  activationDate?: Date;
  suspensionDate?: Date;
  terminationDate?: Date;
  terminationReason?: string;

  // Renewal Tracking
  parentContractId?: string; // if this is a renewal
  renewedToContractId?: string; // if renewed to new contract
  renewalCount: number;

  // Financial
  invoiceIds?: string[];
  totalBilled: number;
  totalPaid: number;
  outstandingAmount: number;

  // Notes & History
  notes?: string;
  internalNotes?: string;

  // Audit
  createdBy: string;
  updatedBy?: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
