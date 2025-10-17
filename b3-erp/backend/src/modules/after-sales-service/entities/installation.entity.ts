export enum InstallationStatus {
  SCHEDULED = 'scheduled',
  SITE_SURVEY_PENDING = 'site_survey_pending',
  SITE_SURVEY_COMPLETED = 'site_survey_completed',
  READY_FOR_INSTALLATION = 'ready_for_installation',
  IN_PROGRESS = 'in_progress',
  TESTING = 'testing',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled',
}

export enum SiteReadinessStatus {
  NOT_READY = 'not_ready',
  PARTIALLY_READY = 'partially_ready',
  READY = 'ready',
}

export class Installation {
  id: string;
  installationNumber: string;
  status: InstallationStatus;

  // Order Information
  salesOrderId: string;
  salesOrderNumber: string;

  // Customer Information
  customerId: string;
  customerName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;

  // Equipment Information
  equipmentId: string;
  equipmentModel: string;
  equipmentSerialNumber: string;
  equipmentQuantity: number;

  // Site Information
  installationAddress: string;
  siteContactPerson?: string;
  siteContactPhone?: string;
  siteInstructions?: string;

  // Site Survey
  siteSurveyRequired: boolean;
  siteSurveyDate?: Date;
  siteSurveyBy?: string;
  siteSurveyReport?: string;
  siteReadiness: SiteReadinessStatus;

  // Readiness Checklist
  electricalReady: boolean;
  electricalNotes?: string;
  waterSupplyReady: boolean;
  waterSupplyNotes?: string;
  gasSupplyReady: boolean;
  gasSupplyNotes?: string;
  spaceReady: boolean;
  spaceNotes?: string;
  ventilationReady: boolean;
  ventilationNotes?: string;
  drainageReady: boolean;
  drainageNotes?: string;

  // Scheduling
  scheduledDate: Date;
  scheduledTimeSlot: string;
  estimatedDuration: number; // in hours
  rescheduledCount: number;
  rescheduledDates?: Date[];
  rescheduleReason?: string;

  // Team Assignment
  teamLeaderId: string;
  teamLeaderName: string;
  teamMembers: Array<{
    engineerId: string;
    engineerName: string;
    role: string;
  }>;

  // Resources Required
  toolsRequired?: string[];
  materialsRequired?: Array<{
    materialId: string;
    materialName: string;
    quantity: number;
  }>;
  vehicleRequired: boolean;
  vehicleType?: string;

  // Installation Execution
  installationStartTime?: Date;
  installationEndTime?: Date;
  actualDuration?: number;

  // Installation Checklist
  unpackingCompleted: boolean;
  positioningCompleted: boolean;
  levelingCompleted: boolean;
  electricalConnectionCompleted: boolean;
  waterConnectionCompleted: boolean;
  gasConnectionCompleted: boolean;
  drainageConnectionCompleted: boolean;
  ventilationCompleted: boolean;

  // Testing & Commissioning
  functionalTestCompleted: boolean;
  functionalTestNotes?: string;
  performanceTestCompleted: boolean;
  performanceTestNotes?: string;
  safetyTestCompleted: boolean;
  safetyTestNotes?: string;

  // Customer Training
  trainingProvided: boolean;
  trainingDuration?: number;
  trainingTopics?: string[];
  trainingCompletionCertificate?: string;

  // Documentation
  installationPhotos?: string[];
  asBuiltDrawings?: string[];
  operationManual?: string;
  maintenanceManual?: string;

  // Customer Acceptance
  demonstrationCompleted: boolean;
  customerAcceptance: boolean;
  acceptanceDate?: Date;
  customerSignature?: string;
  customerName?: string;
  customerComments?: string;

  // Handover
  handoverCompleted: boolean;
  handoverDate?: Date;
  warrantyActivated: boolean;
  warrantyStartDate?: Date;
  warrantyId?: string;

  // Post-Installation Support
  supportPeriod: number; // in days
  supportEndDate?: Date;
  supportTickets?: string[];

  // Issues & Resolution
  issuesEncountered?: Array<{
    issue: string;
    resolution: string;
    date: Date;
  }>;

  // On-Hold Information
  onHoldReason?: string;
  onHoldDate?: Date;
  onHoldResolvedDate?: Date;

  // Cancellation
  cancellationReason?: string;
  cancellationDate?: Date;
  cancellationRequestedBy?: string;

  // Financial
  installationCost: number;
  additionalCharges?: number;
  totalCost: number;
  invoiceId?: string;

  // Audit
  createdBy: string;
  updatedBy?: string;
  completedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export class SiteSurvey {
  id: string;
  surveyNumber: string;
  installationId: string;

  // Survey Details
  surveyDate: Date;
  surveyBy: string;
  surveyDuration: number;

  // Site Measurements
  siteDimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };

  // Infrastructure Checks
  electricalSupply: {
    available: boolean;
    voltage: string;
    phase: string;
    loadCapacity: string;
    notes?: string;
  };

  waterSupply: {
    available: boolean;
    pressure: string;
    quality: string;
    notes?: string;
  };

  gasSupply: {
    available: boolean;
    type: string;
    pressure: string;
    notes?: string;
  };

  drainage: {
    available: boolean;
    type: string;
    capacity: string;
    notes?: string;
  };

  ventilation: {
    available: boolean;
    type: string;
    capacity: string;
    notes?: string;
  };

  // Safety Assessment
  safetyHazards?: string[];
  safetyMeasuresRequired?: string[];
  safetyEquipmentNeeded?: string[];

  // Additional Requirements
  civilWorkRequired: boolean;
  civilWorkDetails?: string;
  electricalWorkRequired: boolean;
  electricalWorkDetails?: string;
  plumbingWorkRequired: boolean;
  plumbingWorkDetails?: string;

  // Recommendations
  recommendations?: string;
  estimatedPreparationTime?: number; // in days
  estimatedCost?: number;

  // Photos & Documents
  sitePhotos?: string[];
  siteDiagram?: string;
  reportDocument?: string;

  // Approval
  approvedBy?: string;
  approvalDate?: Date;
  approvalNotes?: string;

  // Audit
  createdAt: Date;
  updatedAt: Date;
}
