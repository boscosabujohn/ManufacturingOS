export enum OrderStatus {
  DRAFT = 'draft',
  CONFIRMED = 'confirmed',
  APPROVED = 'approved',
  IN_PRODUCTION = 'in_production',
  READY_FOR_DISPATCH = 'ready_for_dispatch',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  HANDOVER_PENDING = 'handover_pending',
  HANDOVER_ACCEPTED = 'handover_accepted',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum OrderType {
  STANDARD = 'standard',
  RUSH = 'rush',
  BLANKET = 'blanket',
  SCHEDULED = 'scheduled',
  SERVICE = 'service',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERDUE = 'overdue',
}

export interface OrderItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  description?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  discountType: 'percentage' | 'amount';
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
  deliveryDate?: string;
  specifications?: string;
  bomId?: string;
  notes?: string;
}

export interface OrderValidation {
  matchesRFP: boolean;
  termsAccepted: boolean;
  deliveryConfirmed: boolean;
  paymentTermsVerified: boolean;
  technicalSpecsAligned: boolean;
  creditVerified: boolean;
  capacityAvailable: boolean;
  profitabilityApproved: boolean;
}

export interface HandoverPackage {
  id: string;
  handoverDate: string;
  documents: {
    confirmedPO: string;
    technicalSpecs: string;
    approvedDrawings?: string;
    deliveryRequirements: string;
    specialInstructions: string;
    qualityRequirements: string;
  };
  handoverMeeting?: {
    date: string;
    participants: string[];
    notes: string;
  };
  riskIdentification: string[];
  resourceAllocation: string;
  acceptedBy?: string;
  acceptedAt?: string;
  acceptanceStatus: 'pending' | 'accepted' | 'rejected' | 'conditional';
  acceptanceRemarks?: string;
}

export interface ApprovalRecord {
  approverId: string;
  approverName: string;
  role: string;
  action: 'approved' | 'rejected' | 'pending';
  date: string;
  comments?: string;
  level: number;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  orderType: OrderType;
  status: OrderStatus;

  // Source Reference
  rfpId?: string;
  rfpNumber?: string;
  quotationId?: string;
  quotationNumber?: string;

  // Customer Information
  customerId: string;
  customerName: string;
  customerCode?: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;

  // PO Details
  poNumber?: string;
  poDate?: string;
  poValue?: number;

  // Order Items
  items: OrderItem[];

  // Financial Summary
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  totalAmount: number;
  currency: string;

  // Payment Information
  paymentTerms: string;
  paymentStatus: PaymentStatus;
  advanceAmount?: number;
  advanceReceived?: number;
  creditLimit?: number;
  creditUtilized?: number;

  // Delivery Information
  deliveryTerms: string;
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  requestedDeliveryDate: string;
  promisedDeliveryDate?: string;
  actualDeliveryDate?: string;

  // Special Instructions
  specialInstructions?: string;
  qualityRequirements?: string;
  packagingRequirements?: string;

  // Documents
  documents?: {
    po?: string;
    specs?: string;
    drawings?: string;
    others?: string[];
  };

  // Validation & Compliance
  validations: OrderValidation;

  // Approval Workflow
  approvalStatus: 'pending' | 'in_progress' | 'approved' | 'rejected';
  currentApprovalLevel: number;
  requiredApprovalLevels: number;
  approvalHistory: ApprovalRecord[];

  // Handover to Production
  handoverPackage?: HandoverPackage;
  productionOrderId?: string;
  workOrderIds?: string[];

  // Tracking
  salesPersonId: string;
  salesPersonName: string;
  assignedTeam?: string[];

  // Margin & Profitability
  estimatedCost?: number;
  estimatedMargin?: number;
  marginPercentage?: number;

  // Related Records
  invoiceIds?: string[];
  shipmentIds?: string[];
  returnIds?: string[];

  // Audit Fields
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;

  // Notes & Comments
  internalNotes?: string;
  customerNotes?: string;

  // Tags
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}
