export enum ServiceRequestStatus {
  OPEN = 'open',
  PENDING = 'pending',
  ACKNOWLEDGED = 'acknowledged',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  CANCELLED = 'cancelled',
}

export enum ServiceRequestPriority {
  P1_CRITICAL = 'p1_critical', // 2 hour response, 6 hour resolution
  P2_HIGH = 'p2_high', // 4 hour response, 24 hour resolution
  P3_MEDIUM = 'p3_medium', // 8 hour response, 48 hour resolution
  P4_LOW = 'p4_low', // 24 hour response, 72 hour resolution
}

export enum ServiceRequestType {
  INSTALLATION = 'installation',
  REPAIR = 'repair',
  PREVENTIVE_MAINTENANCE = 'preventive_maintenance',
  BREAKDOWN = 'breakdown',
  INSPECTION = 'inspection',
  CONSULTATION = 'consultation',
  TRAINING = 'training',
}

export enum RequestChannel {
  PHONE = 'phone',
  EMAIL = 'email',
  WEB_PORTAL = 'web_portal',
  MOBILE_APP = 'mobile_app',
  WHATSAPP = 'whatsapp',
  CHAT = 'chat',
  WALK_IN = 'walk_in',
}

export class ServiceRequest {
  id: string;
  requestNumber: string;
  status: ServiceRequestStatus;
  priority: ServiceRequestPriority;
  serviceType: ServiceRequestType;
  channel: RequestChannel;

  // Customer Information
  customerId: string;
  customerName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;

  // Equipment Information
  equipmentId?: string;
  equipmentModel?: string;
  equipmentSerialNumber?: string;
  equipmentLocation?: string;

  // Request Details
  subject: string;
  description: string;
  faultCategory?: string;
  symptoms?: string[];
  errorCodes?: string[];

  // Service Details
  requestedDate: Date;
  preferredServiceDate?: Date;
  preferredTimeSlot?: string;
  serviceAddress: string;
  siteContactPerson?: string;
  siteContactPhone?: string;

  // Contract/Warranty
  underWarranty: boolean;
  warrantyId?: string;
  underContract: boolean;
  contractId?: string;
  billable: boolean;

  // SLA
  responseTimeSLA: number; // in hours
  resolutionTimeSLA: number; // in hours
  responseDeadline: Date;
  resolutionDeadline: Date;
  responseTime?: number; // actual
  resolutionTime?: number; // actual
  slaBreached: boolean;
  slaBreachReason?: string;
  isOverdue?: boolean;
  slaStatus?: string;
  acknowledgedDate?: Date;

  // Assignment
  assignedTo?: string;
  assignedToName?: string;
  assignedTeam?: string;
  assignmentDate?: Date;
  assignmentMethod: string; // auto/manual

  // Escalation
  escalated: boolean;
  escalationLevel?: number;
  escalatedTo?: string[];
  escalationDate?: Date;
  escalationReason?: string;

  // Resolution
  resolutionDate?: Date;
  resolutionNotes?: string;
  resolution?: string;
  rootCause?: string;
  actionTaken?: string;
  workStartDate?: Date;
  partsUsed?: any[];
  closureDate?: Date;
  closureNotes?: string;
  cancellationDate?: Date;
  cancellationReason?: string;

  // Customer Confirmation
  customerConfirmed: boolean;
  confirmationDate?: Date;
  customerFeedback?: string;
  customerRating?: number;

  // Related Records
  ticketId?: string;
  fieldServiceJobId?: string;
  invoiceId?: string;

  // Attachments
  attachments?: string[];
  photos?: string[];
  videos?: string[];

  // Communication Log
  communicationLog?: Array<{
    date: Date;
    channel: string;
    from: string;
    to: string;
    message: string;
  }>;

  // Audit
  createdBy: string;
  updatedBy?: string;
  closedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

export enum TicketStatus {
  OPEN = 'open',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  AWAITING_PARTS = 'awaiting_parts',
  AWAITING_CUSTOMER = 'awaiting_customer',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  REOPENED = 'reopened',
}

export class ServiceTicket {
  id: string;
  ticketNumber: string;
  serviceRequestId: string;
  status: TicketStatus;
  priority: ServiceRequestPriority;

  // Basic Info
  subject: string;
  description: string;
  category: string;

  // Customer & Equipment
  customerId: string;
  equipmentId?: string;

  // Assignment
  assignedEngineerId?: string;
  assignedEngineerName?: string;
  assignmentDate?: Date;

  // SLA Tracking
  responseTimeSLA: number;
  resolutionTimeSLA: number;
  responseTime: number; // actual
  resolutionTime: number; // actual
  slaCompliant: boolean;

  // Progress
  workLog?: Array<{
    date: Date;
    engineerId: string;
    notes: string;
    hoursSpent: number;
  }>;

  // Parts & Materials
  partsRequired?: Array<{
    partId: string;
    partName: string;
    quantity: number;
    availabilityStatus: string;
  }>;

  // Resolution
  resolutionNotes?: string;
  actionTaken?: string;
  partsUsed?: Array<{
    partId: string;
    quantity: number;
    cost: number;
  }>;

  // Customer Acceptance
  customerSignature?: string;
  customerName?: string;
  customerFeedback?: string;
  customerRating?: number;

  // Reopening
  reopenCount: number;
  lastReopenDate?: Date;
  reopenReason?: string;

  // Audit
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}
