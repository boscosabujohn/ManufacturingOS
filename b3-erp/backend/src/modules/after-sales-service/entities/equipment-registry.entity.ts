export enum EquipmentHealthStatus {
  EXCELLENT = 'excellent', // 90-100%
  GOOD = 'good', // 75-89%
  FAIR = 'fair', // 60-74%
  POOR = 'poor', // 40-59%
  CRITICAL = 'critical', // <40%
}

export enum LifecycleStage {
  NEW = 'new', // 0-2 years
  PRIME = 'prime', // 2-5 years
  MATURE = 'mature', // 5-8 years
  AGING = 'aging', // 8-12 years
  END_OF_LIFE = 'end_of_life', // >12 years
}

export class EquipmentRegistry {
  id: string;
  equipmentId: string;
  registrationNumber: string;

  // Equipment Details
  model: string;
  serialNumber: string;
  category: string;
  type: string;
  manufacturer: string;

  // Customer & Location
  customerId: string;
  customerName: string;
  installationSiteId: string;
  installationAddress: string;
  siteContactPerson?: string;
  siteContactPhone?: string;

  // Installation
  installationDate: Date;
  installationJobId?: string;
  commissioningDate?: Date;
  commissioningJobId?: string;

  // Purchase Information
  salesOrderId?: string;
  invoiceId?: string;
  purchaseDate?: Date;
  purchasePrice?: number;

  // Warranty
  warrantyId?: string;
  warrantyStartDate?: Date;
  warrantyEndDate?: Date;
  underWarranty: boolean;

  // Service Contract
  contractId?: string;
  contractStartDate?: Date;
  contractEndDate?: Date;
  underContract: boolean;

  // Equipment Specifications
  specifications?: Record<string, any>;
  capacity?: string;
  powerRating?: string;
  dimensions?: string;
  weight?: string;

  // Operational Data
  operationalSince: Date;
  totalOperatingHours?: number;
  averageDailyUsage?: number;
  lastUsageDate?: Date;

  // Health Status
  healthStatus: EquipmentHealthStatus;
  healthScore: number; // 0-100
  lastHealthCheckDate?: Date;
  healthCheckBy?: string;

  // Lifecycle
  lifecycleStage: LifecycleStage;
  equipmentAge: number; // in months
  expectedLifespan: number; // in months
  remainingLifespan: number; // in months

  // Maintenance History Summary
  totalServiceCalls: number;
  totalBreakdowns: number;
  totalPMVisits: number;
  lastServiceDate?: Date;
  nextServiceDue?: Date;

  // Reliability Metrics
  mtbf?: number; // Mean Time Between Failures (hours)
  mttr?: number; // Mean Time To Repair (hours)
  availabilityPercentage?: number;
  reliabilityScore?: number; // 0-100

  // Parts Replacement Summary
  totalPartsReplaced: number;
  majorComponentsReplaced?: Array<{
    componentName: string;
    replacementDate: Date;
    cost: number;
  }>;

  // Performance Trends
  performanceTrend: string; // improving/stable/declining
  faultFrequency: string; // low/medium/high
  costTrend: string; // decreasing/stable/increasing

  // Alerts & Recommendations
  activeAlerts?: string[];
  maintenanceRecommendations?: string[];
  upgradeRecommendations?: string[];
  replacementRecommended: boolean;
  replacementReason?: string;

  // Replacement Planning
  estimatedReplacementDate?: Date;
  estimatedReplacementCost?: number;
  replacementApproved: boolean;
  replacementOrderId?: string;

  // Status
  currentStatus: string; // operational/under_maintenance/breakdown/decommissioned
  lastStatusChange: Date;

  // Decommissioning
  decommissioned: boolean;
  decommissionDate?: Date;
  decommissionReason?: string;
  disposalMethod?: string;

  // Documents
  operationManual?: string;
  maintenanceManual?: string;
  installationCertificate?: string;
  testReports?: string[];
  photos?: string[];

  // IoT Integration (if applicable)
  iotEnabled: boolean;
  sensorIds?: string[];
  lastDataSync?: Date;
  realTimeMonitoring: boolean;

  // Audit
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ServiceHistory {
  id: string;
  equipmentRegistryId: string;
  equipmentId: string;

  // Service Record
  serviceDate: Date;
  serviceType: string; // installation/pm/repair/breakdown/inspection
  serviceTicketId?: string;
  fieldServiceJobId?: string;

  // Service Details
  problemDescription?: string;
  diagnosis?: string;
  rootCause?: string;
  actionTaken: string;

  // Engineer
  engineerId: string;
  engineerName: string;

  // Duration
  serviceDuration: number; // in hours
  downtimeDuration?: number; // if breakdown

  // Parts & Cost
  partsReplaced?: Array<{
    partId: string;
    partName: string;
    quantity: number;
    serialNumber?: string;
    cost: number;
  }>;
  totalPartsCost: number;
  laborCost: number;
  totalCost: number;

  // Resolution
  issueResolved: boolean;
  resolutionNotes?: string;
  followUpRequired: boolean;
  followUpDate?: Date;

  // Customer Feedback
  customerRating?: number;
  customerComments?: string;

  // Quality
  firstTimeFix: boolean;
  repeatIssue: boolean;
  previousServiceId?: string;

  // Documents
  serviceReport?: string;
  photos?: string[];

  // Audit
  createdAt: Date;
  updatedAt: Date;
}

export class EquipmentPerformance {
  id: string;
  equipmentRegistryId: string;
  equipmentId: string;

  // Period
  periodStart: Date;
  periodEnd: Date;
  periodType: string; // daily/weekly/monthly/quarterly/annual

  // Operational Metrics
  totalOperatingHours: number;
  totalIdleHours: number;
  totalBreakdownHours: number;
  availabilityPercentage: number;

  // Reliability Metrics
  numberOfFailures: number;
  mtbf: number; // Mean Time Between Failures
  mttr: number; // Mean Time To Repair
  reliabilityRate: number;

  // Maintenance Metrics
  plannedMaintenanceHours: number;
  unplannedMaintenanceHours: number;
  preventiveMaintenanceCompliance: number; // percentage
  maintenanceCost: number;

  // Performance Indicators
  efficiencyPercentage?: number;
  outputQuality?: number;
  energyConsumption?: number;
  productionCapacity?: number;

  // Cost Analysis
  operationalCost: number;
  maintenanceCost: number;
  breakdownCost: number;
  totalCost: number;
  costPerOperatingHour: number;

  // Trend Analysis
  performanceTrend: string; // improving/stable/declining
  costTrend: string; // decreasing/stable/increasing
  reliabilityTrend: string; // improving/stable/declining

  // Comparison
  industryBenchmark?: number;
  companyAverage?: number;
  variance?: number;

  // Health Score
  calculatedHealthScore: number; // 0-100
  healthScoreChange: number; // from previous period

  // Alerts Generated
  alertsGenerated: number;
  criticalAlerts: number;
  warningAlerts: number;

  // Audit
  calculatedAt: Date;
  calculatedBy: string;
}
