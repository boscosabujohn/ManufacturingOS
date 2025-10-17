export enum FieldServiceJobStatus {
  SCHEDULED = 'scheduled',
  DISPATCHED = 'dispatched',
  EN_ROUTE = 'en_route',
  ON_SITE = 'on_site',
  IN_PROGRESS = 'in_progress',
  AWAITING_PARTS = 'awaiting_parts',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum JobType {
  INSTALLATION = 'installation',
  REPAIR = 'repair',
  MAINTENANCE = 'maintenance',
  INSPECTION = 'inspection',
  EMERGENCY = 'emergency',
  FOLLOW_UP = 'follow_up',
}

export class FieldServiceJob {
  id: string;
  jobNumber: string;
  status: FieldServiceJobStatus;
  jobType: JobType;
  priority: string; // P1, P2, P3, P4

  // Related Records
  serviceRequestId?: string;
  serviceTicketId?: string;
  installationId?: string;
  contractId?: string;
  warrantyId?: string;

  // Customer Information
  customerId: string;
  customerName: string;
  contactPerson: string;
  contactPhone: string;

  // Equipment Information
  equipmentId?: string;
  equipmentModel?: string;
  equipmentSerialNumber?: string;

  // Service Location
  serviceAddress: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  siteContactPerson?: string;
  siteContactPhone?: string;
  siteInstructions?: string;

  // Scheduling
  scheduledDate: Date;
  scheduledTimeSlot: string;
  estimatedDuration: number; // in hours
  estimatedCompletionTime?: Date;

  // Engineer Assignment
  assignedEngineerId: string;
  assignedEngineerName: string;
  engineerSkills?: string[];
  backupEngineerId?: string;

  // Route Information
  travelDistance?: number; // in km
  estimatedTravelTime?: number; // in minutes
  routeDetails?: string;
  trafficConditions?: string;

  // Job Details
  problemDescription: string;
  symptomsReported?: string[];
  customerRequirements?: string;

  // Parts & Tools
  partsRequired?: Array<{
    partId: string;
    partName: string;
    quantity: number;
    availability: string;
  }>;
  toolsRequired?: string[];
  vanStockItems?: string[];

  // Dispatch
  dispatchedAt?: Date;
  dispatchedBy?: string;
  dispatchNotes?: string;

  // Check-in/Check-out
  checkInTime?: Date;
  checkInLocation?: {
    latitude: number;
    longitude: number;
  };
  checkOutTime?: Date;
  checkOutLocation?: {
    latitude: number;
    longitude: number;
  };

  // Service Execution
  actualStartTime?: Date;
  actualEndTime?: Date;
  actualDuration?: number;

  // Diagnosis
  diagnosisCompleted: boolean;
  diagnosisNotes?: string;
  rootCause?: string;
  faultCategory?: string;

  // Work Performed
  workPerformed: string;
  actionTaken?: string;
  testingPerformed?: string;
  testResults?: string;

  // Parts Consumption
  partsUsed?: Array<{
    partId: string;
    partName: string;
    quantity: number;
    serialNumbers?: string[];
    cost: number;
  }>;

  // Labor
  laborHours: number;
  laborRate?: number;
  laborCost?: number;

  // Customer Interaction
  customerPresent: boolean;
  customerDemonstration: boolean;
  customerTraining: boolean;
  customerSatisfied: boolean;
  customerComments?: string;
  customerSignature?: string;
  customerRating?: number;

  // Resolution
  issueResolved: boolean;
  resolutionNotes?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  followUpReason?: string;

  // Documentation
  servicePhotos?: string[];
  serviceVideos?: string[];
  beforePhotos?: string[];
  afterPhotos?: string[];
  signedServiceReport?: string;

  // Digital Service Report
  serviceReport: {
    problemStatement: string;
    diagnosis: string;
    workPerformed: string;
    partsReplaced?: string[];
    recommendations?: string;
    nextServiceDate?: Date;
  };

  // Real-time Updates
  statusUpdates?: Array<{
    timestamp: Date;
    status: string;
    location?: {
      latitude: number;
      longitude: number;
    };
    notes?: string;
  }>;

  // Mobile App Data
  mobileDeviceId?: string;
  appVersion?: string;
  syncStatus?: string;
  lastSyncTime?: Date;

  // Cost Tracking
  partsCost: number;
  laborCost: number;
  travelCost?: number;
  otherCosts?: number;
  totalCost: number;

  // Billing
  billable: boolean;
  billableAmount?: number;
  invoiceId?: string;

  // Quality
  firstTimeFix: boolean;
  repeatVisit: boolean;
  repeatOfJobId?: string;

  // Cancellation
  cancellationReason?: string;
  cancellationDate?: Date;
  cancellationRequestedBy?: string;

  // Audit
  createdBy: string;
  updatedBy?: string;
  completedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export class EngineerSchedule {
  id: string;
  engineerId: string;
  engineerName: string;
  scheduleDate: Date;

  // Availability
  availableFrom: string; // HH:MM
  availableTo: string; // HH:MM
  totalAvailableHours: number;

  // Jobs Scheduled
  jobs: Array<{
    jobId: string;
    jobNumber: string;
    startTime: string;
    endTime: string;
    duration: number;
    priority: string;
    customerName: string;
    location: string;
  }>;

  // Capacity
  totalJobsScheduled: number;
  totalHoursScheduled: number;
  utilizationPercentage: number;
  overbooked: boolean;

  // Travel
  totalTravelDistance: number;
  totalTravelTime: number;
  routeOptimized: boolean;
  routeDetails?: string;

  // Location Tracking
  currentLocation?: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  };
  locationHistory?: Array<{
    latitude: number;
    longitude: number;
    timestamp: Date;
  }>;

  // Status
  workingStatus: string; // available/on_job/traveling/break/off_duty
  lastStatusUpdate: Date;

  // Performance
  jobsCompleted: number;
  averageJobDuration: number;
  onTimePercentage: number;
  customerSatisfactionScore?: number;

  // Audit
  createdAt: Date;
  updatedAt: Date;
}

export class ServiceReport {
  id: string;
  reportNumber: string;
  fieldServiceJobId: string;
  serviceTicketId?: string;

  // Basic Information
  serviceDate: Date;
  engineerId: string;
  engineerName: string;
  customerId: string;
  customerName: string;

  // Equipment
  equipmentId: string;
  equipmentModel: string;
  equipmentSerialNumber: string;

  // Service Details
  problemReported: string;
  symptomsObserved: string[];
  diagnosis: string;
  rootCause: string;

  // Work Performed
  workDescription: string;
  actionTaken: string;
  testsPerformed?: string[];
  testResults?: string;

  // Parts & Materials
  partsReplaced?: Array<{
    partNumber: string;
    partName: string;
    oldSerialNumber?: string;
    newSerialNumber?: string;
    quantity: number;
  }>;

  // Time & Cost
  laborHours: number;
  laborCost: number;
  partsCost: number;
  otherCosts: number;
  totalCost: number;

  // Resolution
  issueResolved: boolean;
  resolutionStatus: string;
  followUpRequired: boolean;
  followUpRecommendation?: string;
  nextMaintenanceDate?: Date;

  // Recommendations
  technicalRecommendations?: string[];
  customerRecommendations?: string[];
  partsToOrder?: string[];

  // Customer Feedback
  customerPresent: boolean;
  customerName?: string;
  customerSignature: string;
  customerComments?: string;
  customerRating?: number;
  signedDate: Date;

  // Photos & Attachments
  beforePhotos?: string[];
  afterPhotos?: string[];
  attachments?: string[];

  // Quality Checks
  qualityCheckCompleted: boolean;
  qualityCheckBy?: string;
  qualityCheckNotes?: string;
  qualityRating?: number;

  // Audit
  createdBy: string;
  approvedBy?: string;
  approvalDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
