export class ServicePerformanceMetrics {
  id: string;
  periodStart: Date;
  periodEnd: Date;
  periodType: string; // daily/weekly/monthly/quarterly/annual

  // Service Volume
  totalServiceCalls: number;
  emergencyServiceCalls: number;
  plannedServiceCalls: number;
  installationJobs: number;
  preventiveMaintenanceVisits: number;

  // Response Metrics
  averageResponseTime: number; // in hours
  p1ResponseTimeAvg: number;
  p2ResponseTimeAvg: number;
  p3ResponseTimeAvg: number;
  p4ResponseTimeAvg: number;

  // Resolution Metrics
  averageResolutionTime: number; // in hours
  p1ResolutionTimeAvg: number;
  p2ResolutionTimeAvg: number;
  p3ResolutionTimeAvg: number;
  p4ResolutionTimeAvg: number;

  // SLA Compliance
  totalSLATracked: number;
  responseSLAMet: number;
  responseSLAMissed: number;
  responseSLAComplianceRate: number; // percentage
  resolutionSLAMet: number;
  resolutionSLAMissed: number;
  resolutionSLAComplianceRate: number; // percentage
  overallSLAComplianceRate: number; // percentage

  // First Time Fix
  totalServiceAttempts: number;
  firstTimeFixCount: number;
  firstTimeFixRate: number; // percentage
  repeatCallCount: number;
  repeatCallRate: number; // percentage

  // MTTR & MTBF
  averageMTTR: number; // Mean Time To Repair
  averageMTBF: number; // Mean Time Between Failures
  equipmentAvailabilityRate: number; // percentage

  // Engineer Performance
  totalEngineersActive: number;
  averageJobsPerEngineer: number;
  averageHoursPerJob: number;
  engineerUtilizationRate: number; // percentage
  travelTimePercentage: number;
  productiveTimePercentage: number;

  // Quality Metrics
  qualityChecksPassed: number;
  qualityChecksFailed: number;
  qualityPassRate: number; // percentage
  reworkRequired: number;
  reworkRate: number; // percentage

  // Customer Satisfaction
  totalFeedbackReceived: number;
  averageCustomerRating: number; // 1-5
  csatScore: number; // Customer Satisfaction Score
  npsScore?: number; // Net Promoter Score
  promotersCount: number;
  passivesCount: number;
  detractorsCount: number;

  // Escalations
  totalEscalations: number;
  level1Escalations: number;
  level2Escalations: number;
  level3Escalations: number;
  escalationRate: number; // percentage

  // Parts Management
  partsRequestsRaised: number;
  partsAvailabilityRate: number; // percentage
  stockOutIncidents: number;
  emergencyProcurements: number;
  averagePartsWaitingTime: number; // in hours

  // Contract & Warranty
  totalContractJobs: number;
  totalWarrantyJobs: number;
  totalBillableJobs: number;
  contractComplianceRate: number; // percentage
  warrantyClaimRate: number; // percentage

  // Training
  trainingSessionsConducted: number;
  customersTrainedCount: number;
  averageTrainingDuration: number; // in hours

  // Cost Efficiency
  totalServiceCost: number;
  averageCostPerCall: number;
  laborCostPercentage: number;
  partsCostPercentage: number;
  travelCostPercentage: number;

  // Productivity
  jobsCompletedOnTime: number;
  onTimeCompletionRate: number; // percentage
  jobsCancelled: number;
  cancellationRate: number; // percentage

  // Top Issues
  topFaultCategories?: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;

  topEquipmentTypes?: Array<{
    equipmentType: string;
    callCount: number;
    percentage: number;
  }>;

  // Trends
  callVolumeTrend: string; // increasing/stable/decreasing
  slaComplianceTrend: string; // improving/stable/declining
  customerSatisfactionTrend: string; // improving/stable/declining
  costTrend: string; // increasing/stable/decreasing

  // Audit
  calculatedBy: string;
  calculatedAt: Date;
  lastUpdated: Date;
}

export class EngineerPerformance {
  id: string;
  engineerId: string;
  engineerName: string;
  periodStart: Date;
  periodEnd: Date;
  periodType: string;

  // Job Statistics
  totalJobsAssigned: number;
  totalJobsCompleted: number;
  jobCompletionRate: number; // percentage
  averageJobsPerDay: number;

  // Time Metrics
  totalWorkingHours: number;
  totalServiceHours: number;
  totalTravelHours: number;
  totalIdleHours: number;
  utilizationRate: number; // percentage

  // Quality Metrics
  firstTimeFixCount: number;
  firstTimeFixRate: number; // percentage
  repeatCallsCount: number;
  repeatCallRate: number; // percentage
  qualityScore: number; // 0-100

  // Customer Satisfaction
  feedbackReceived: number;
  averageRating: number; // 1-5
  csatScore: number;
  complimentsReceived: number;
  complaintsReceived: number;

  // SLA Performance
  slaCompliantJobs: number;
  slaBreachedJobs: number;
  slaComplianceRate: number; // percentage
  averageResponseTime: number;
  averageResolutionTime: number;

  // Skills & Specialization
  specializations?: string[];
  certificationsHeld?: string[];
  skillLevel: string; // junior/intermediate/senior/expert
  trainingHoursCompleted?: number;

  // Revenue Generation
  totalRevenue: number;
  billableHours: number;
  billingRate: number;
  averageJobValue: number;

  // Cost Efficiency
  partsCostIncurred: number;
  travelCostIncurred: number;
  totalCostIncurred: number;
  costEfficiencyScore: number;

  // Productivity
  jobsCompletedOnTime: number;
  onTimeCompletionRate: number; // percentage
  overtimeHours: number;
  absences: number;

  // Equipment Handled
  uniqueEquipmentTypes: number;
  uniqueCustomersServed: number;
  emergencyCallsAttended: number;

  // Performance Rating
  overallPerformanceScore: number; // 0-100
  performanceRating: string; // excellent/good/average/needs_improvement

  // Recommendations
  strengthAreas?: string[];
  improvementAreas?: string[];
  trainingRecommendations?: string[];

  // Audit
  evaluatedBy: string;
  evaluationDate: Date;
  lastUpdated: Date;
}

export class SLACompliance {
  id: string;
  serviceTicketId: string;
  serviceRequestId?: string;

  // SLA Definition
  priority: string; // P1, P2, P3, P4
  responseTimeSLA: number; // in hours
  resolutionTimeSLA: number; // in hours

  // Deadlines
  responseDeadline: Date;
  resolutionDeadline: Date;

  // Actual Performance
  actualResponseTime?: number; // in hours
  actualResolutionTime?: number; // in hours
  responseTime: Date;
  resolutionTime?: Date;

  // Compliance Status
  responseSLAMet: boolean;
  resolutionSLAMet: boolean;
  overallSLAMet: boolean;

  // Breach Details
  responseBreachMinutes?: number;
  resolutionBreachMinutes?: number;
  breachReason?: string;

  // Escalation
  escalated: boolean;
  escalationLevel?: number;
  escalationTime?: Date;
  escalationReason?: string;

  // Exception Handling
  slaException: boolean;
  exceptionReason?: string;
  approvedBy?: string;

  // Pause/Resume
  slaPaused: boolean;
  pauseReason?: string;
  totalPausedDuration?: number; // in hours
  pauseResumeLog?: Array<{
    pausedAt: Date;
    resumedAt?: Date;
    reason: string;
    approvedBy: string;
  }>;

  // Impact
  customerImpact: string; // low/medium/high/critical
  businessImpact?: string;

  // Audit
  createdAt: Date;
  updatedAt: Date;
}
