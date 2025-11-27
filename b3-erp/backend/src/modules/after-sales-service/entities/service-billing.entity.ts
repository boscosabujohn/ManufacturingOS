export enum ServiceInvoiceStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  SENT = 'sent',
  PARTIALLY_PAID = 'partially_paid',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  VOID = 'void',
  WRITTEN_OFF = 'written_off',
}

export const InvoiceStatus = ServiceInvoiceStatus; // Alias

export enum ServiceChargeType {
  LABOR = 'labor',
  PARTS = 'parts',
  TRAVEL = 'travel',
  EMERGENCY_CHARGE = 'emergency_charge',
  AFTER_HOURS = 'after_hours',
  WEEKEND_CHARGE = 'weekend_charge',
  CONSUMABLES = 'consumables',
  MISCELLANEOUS = 'miscellaneous',
}

export class ServiceInvoice {
  id: string;
  invoiceNumber: string;
  status: ServiceInvoiceStatus;
  invoiceType: string; // service/amc/installation

  // Related Records
  serviceTicketId?: string;
  fieldServiceJobId?: string;
  installationId?: string;
  contractId?: string;
  warrantyId?: string;

  // Customer Information
  customerId: string;
  customerName: string;
  billingAddress: string;
  gstNumber?: string;
  panNumber?: string;

  // Invoice Dates
  invoiceDate: Date;
  dueDate: Date;
  paymentTerms: string; // immediate/net_15/net_30/net_45

  // Service Details
  serviceDate: Date;
  serviceDescription: string;
  engineerName?: string;
  equipmentDetails?: string;

  // Line Items
  lineItems: Array<{
    itemType: ServiceChargeType;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    taxable: boolean;
    taxRate?: number;
    taxAmount?: number;
  }>;

  // Charges Breakdown
  laborCharges: number;
  partsCharges: number;
  travelCharges: number;
  emergencyCharges: number;
  otherCharges: number;

  // Calculations
  subtotal: number;
  discountPercentage?: number;
  discountAmount?: number;
  taxableAmount: number;

  // Tax Details (GST)
  cgstRate?: number;
  cgstAmount?: number;
  sgstRate?: number;
  sgstAmount?: number;
  igstRate?: number;
  igstAmount?: number;
  totalTaxAmount: number;

  // Total
  totalAmount: number;
  roundOffAmount?: number;
  grandTotal: number;

  // Contract/Warranty
  underContract: boolean;
  contractDiscount?: number;
  underWarranty: boolean;
  warrantyCovered: number; // amount covered by warranty
  customerPayable: number;

  // Payment Information
  amountPaid: number;
  paidAmount?: number; // Alias for amountPaid
  amountDue: number;
  balanceAmount?: number; // Alias for amountDue
  paymentHistory?: Array<{
    paymentDate: Date;
    amount: number;
    paymentMode: string;
    referenceNumber?: string;
    notes?: string;
  }>;

  // Approval
  approvalRequired: boolean;
  approvedBy?: string;
  approvalDate?: Date;
  approvalNotes?: string;

  // Delivery
  sentToCustomer: boolean;
  sentDate?: Date;
  sentVia?: string; // email/whatsapp/post
  customerEmail?: string;
  deliveryStatus?: string;

  // Notes
  internalNotes?: string;
  customerNotes?: string;
  termsAndConditions?: string;

  // Documents
  serviceReportAttached: boolean;
  serviceReportId?: string;
  attachments?: string[];

  // Cancellation
  cancellationReason?: string;
  cancellationDate?: Date;
  cancellationApprovedBy?: string;
  writeOffReason?: string;
  writeOffDate?: Date;
  writeOffApprovedBy?: string;
  isOverdue?: boolean;
  overdueDays?: number;

  // Audit
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  paymentStatus?: string;
  sentBy?: string;
  paidDate?: Date;
  voidDate?: Date;
  voidReason?: string;
}

export enum AMCInvoiceFrequency {
  UPFRONT = 'upfront',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  HALF_YEARLY = 'half_yearly',
  ANNUAL = 'annual',
}

export class AMCInvoice {
  id: string;
  invoiceNumber: string;
  contractId: string;
  contractNumber: string;
  status: ServiceInvoiceStatus;

  // Customer Information
  customerId: string;
  customerName: string;
  billingAddress: string;
  gstNumber?: string;

  // Contract Details
  contractType: string; // AMC/CMC
  contractStartDate: Date;
  contractEndDate: Date;
  contractValue: number;

  // Billing Period
  billingFrequency: AMCInvoiceFrequency;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  periodNumber: number; // 1st quarter, 2nd quarter, etc.

  // Invoice Details
  invoiceDate: Date;
  dueDate: Date;
  paymentTerms: string;

  // Equipment Coverage
  equipmentCovered: Array<{
    equipmentId: string;
    equipmentModel: string;
    serialNumber: string;
    coverage: string;
  }>;

  // Charges
  baseContractValue: number;
  proRataAdjustment?: number;
  additionalCharges?: number;
  discount?: number;

  // Tax Calculation
  taxableAmount: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  totalTaxAmount: number;

  // Total
  totalAmount: number;
  grandTotal: number;

  // Payment Tracking
  amountPaid: number;
  amountDue: number;
  paymentDueDate: Date;
  overdueDays?: number;

  // Auto-Renewal
  autoRenewalInvoice: boolean;
  previousInvoiceId?: string;
  nextInvoiceDate?: Date;

  // Services Provided (for reference)
  servicesSummary?: string;
  visitsConducted?: number;
  partsReplaced?: number;

  // Audit
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ServiceRevenue {
  id: string;
  periodStart: Date;
  periodEnd: Date;
  periodType: string; // daily/weekly/monthly/quarterly/annual

  // Revenue by Type
  serviceCallRevenue: number;
  installationRevenue: number;
  amcRevenue: number;
  partsRevenue: number;
  laborRevenue: number;
  emergencyServiceRevenue: number;
  trainingRevenue: number;

  // Revenue Breakdown
  totalRevenue: number;
  warrantyRevenue: number; // covered under warranty
  contractRevenue: number; // covered under AMC/CMC
  billableRevenue: number; // paid by customer

  // Cost Analysis
  partsCost: number;
  laborCost: number;
  travelCost: number;
  overheadCost: number;
  totalCost: number;

  // Profitability
  grossProfit: number;
  grossMargin: number; // percentage
  netProfit: number;
  netMargin: number; // percentage

  // Volume Metrics
  totalServiceCalls: number;
  totalInstallations: number;
  totalPMVisits: number;
  totalEmergencyCalls: number;

  // Customer Metrics
  uniqueCustomersServed: number;
  newCustomers: number;
  repeatCustomers: number;

  // Contract Metrics
  activeContracts: number;
  newContracts: number;
  renewedContracts: number;
  expiredContracts: number;
  contractRenewalRate: number; // percentage

  // Collection Metrics
  invoicesRaised: number;
  invoiceValue: number;
  paymentsReceived: number;
  outstandingAmount: number;
  collectionEfficiency: number; // percentage

  // Average Metrics
  averageServiceValue: number;
  averageJobCost: number;
  averageGrossMargin: number;

  // Top Performers
  topRevenueCustomers?: Array<{
    customerId: string;
    customerName: string;
    revenue: number;
  }>;

  topRevenueEngineers?: Array<{
    engineerId: string;
    engineerName: string;
    revenue: number;
  }>;

  // Audit
  calculatedBy: string;
  calculatedAt: Date;
  lastUpdated: Date;
}

export class PaymentCollection {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  invoiceType: string; // service/amc

  // Customer Information
  customerId: string;
  customerName: string;

  // Payment Details
  paymentDate: Date;
  amount: number;
  paymentMode: string; // cash/cheque/card/upi/neft/rtgs

  // Payment Mode Specific
  chequeNumber?: string;
  chequeDate?: Date;
  bankName?: string;
  transactionId?: string;
  upiId?: string;
  cardLastFourDigits?: string;

  // Reference
  referenceNumber?: string;
  paymentNotes?: string;

  // Allocation
  allocatedToInvoice: number;
  excessAmount?: number; // if paid more
  shortAmount?: number; // if paid less

  // Bank Reconciliation
  reconciled: boolean;
  reconciledDate?: Date;
  reconciledBy?: string;
  bankStatementRef?: string;

  // Acknowledgment
  receiptGenerated: boolean;
  receiptNumber?: string;
  receiptSent: boolean;
  receiptSentDate?: Date;

  // Audit
  collectedBy: string;
  enteredBy: string;
  createdAt: Date;
  updatedAt: Date;
  paymentReference?: string; // Alias for referenceNumber
  notes?: string; // Alias for paymentNotes
  recordedBy?: string; // Alias for enteredBy
}
