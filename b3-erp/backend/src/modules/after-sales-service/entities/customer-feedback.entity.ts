export enum FeedbackChannel {
  SMS = 'sms',
  EMAIL = 'email',
  PHONE = 'phone',
  WEB_PORTAL = 'web_portal',
  MOBILE_APP = 'mobile_app',
  WHATSAPP = 'whatsapp',
  IN_PERSON = 'in_person',
}

export enum FeedbackSentiment {
  VERY_POSITIVE = 'very_positive',
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative',
  VERY_NEGATIVE = 'very_negative',
}

export class CustomerFeedback {
  id: string;
  feedbackNumber: string;

  // Related Records
  serviceTicketId?: string;
  fieldServiceJobId?: string;
  installationId?: string;

  // Customer Information
  customerId: string;
  customerName: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;

  // Feedback Collection
  feedbackChannel: FeedbackChannel;
  feedbackDate: Date;
  collectedBy?: string;

  // Service Details
  serviceDate: Date;
  serviceType: string;
  engineerId?: string;
  engineerName?: string;

  // Rating Questions
  overallSatisfaction: number; // 1-5 scale
  serviceQuality: number; // 1-5
  engineerProfessionalism: number; // 1-5
  responseTime: number; // 1-5
  problemResolution: number; // 1-5
  communication: number; // 1-5

  // NPS (Net Promoter Score)
  npsRating?: number; // 0-10
  npsCategory?: string; // promoter/passive/detractor

  // Open-ended Feedback
  whatWentWell?: string;
  areasOfImprovement?: string;
  additionalComments?: string;
  suggestions?: string;

  // Specific Aspects
  engineerKnowledge?: string;
  engineerCourtesy?: string;
  workQuality?: string;
  timeliness?: string;
  cleanliness?: string;
  valueForMoney?: string;

  // Sentiment Analysis
  sentiment: FeedbackSentiment;
  sentimentScore?: number; // -1 to +1
  keyPhrases?: string[];

  // Issues Highlighted
  issuesReported?: string[];
  severity?: string; // low/medium/high
  actionRequired: boolean;

  // Follow-up
  followUpRequired: boolean;
  followUpReason?: string;
  followUpDate?: Date;
  followUpCompletedBy?: string;
  followUpNotes?: string;

  // Resolution
  issueResolved: boolean;
  resolutionNotes?: string;
  resolutionDate?: Date;

  // Rewards & Recognition
  engineerPraise: boolean;
  praiseShared: boolean;
  rewardRecommended: boolean;

  // Customer Loyalty
  likelyToRecommend: boolean;
  repeatCustomer: boolean;
  contractRenewalIntent?: string; // yes/no/maybe

  // Metadata
  surveyLink?: string;
  responseTime?: number; // time taken to respond to survey
  deviceType?: string;
  ipAddress?: string;

  // Audit
  createdAt: Date;
  updatedAt: Date;
}

export enum ComplaintStatus {
  REGISTERED = 'registered',
  ACKNOWLEDGED = 'acknowledged',
  UNDER_INVESTIGATION = 'under_investigation',
  ACTION_IN_PROGRESS = 'action_in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  ESCALATED = 'escalated',
}

export enum ComplaintSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export class Complaint {
  id: string;
  complaintNumber: string;
  status: ComplaintStatus;
  severity: ComplaintSeverity;

  // Customer Information
  customerId: string;
  customerName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;

  // Related Service
  serviceTicketId?: string;
  fieldServiceJobId?: string;
  serviceDate?: Date;
  engineerId?: string;

  // Complaint Details
  complaintDate: Date;
  complaintChannel: FeedbackChannel;
  complaintCategory: string; // service_quality/billing/engineer_behavior/delay/product_issue
  complaintSubject: string;
  complaintDescription: string;

  // Impact
  customerImpact: string; // low/medium/high
  businessImpact?: string;
  financialImpact?: number;
  reputationImpact?: string;

  // Acknowledgment
  acknowledged: boolean;
  acknowledgedDate?: Date;
  acknowledgedBy?: string;
  acknowledgmentSentToCustomer: boolean;

  // Investigation
  investigationStarted: boolean;
  investigationStartDate?: Date;
  investigatedBy?: string;
  investigationNotes?: string;

  // Root Cause Analysis
  rootCauseIdentified: boolean;
  rootCause?: string;
  contributingFactors?: string[];
  responsibleParty?: string;

  // Action Plan
  actionPlan?: string;
  actionOwner?: string;
  actionTargetDate?: Date;
  actionCompleted: boolean;
  actionCompletionDate?: Date;

  // Resolution
  resolutionNotes?: string;
  resolutionDate?: Date;
  resolvedBy?: string;
  resolutionMethod?: string; // refund/replacement/repair/compensation/apology

  // Customer Communication
  communicationLog?: Array<{
    date: Date;
    channel: string;
    communicatedBy: string;
    message: string;
    customerResponse?: string;
  }>;

  // Escalation
  escalated: boolean;
  escalationLevel?: number; // 1: Manager, 2: Senior Management, 3: CEO
  escalatedTo?: string;
  escalationDate?: Date;
  escalationReason?: string;

  // Customer Satisfaction
  customerSatisfiedWithResolution: boolean;
  postResolutionFeedback?: string;
  postResolutionRating?: number;

  // Preventive Measures
  preventiveMeasures?: string;
  processImprovement?: string;
  trainingRequired?: string;
  policyChange?: string;

  // Compensation
  compensationOffered: boolean;
  compensationType?: string; // refund/discount/free_service/credit_note
  compensationAmount?: number;
  compensationApprovedBy?: string;

  // Closure
  closureNotes?: string;
  closedDate?: Date;
  closedBy?: string;
  closureApprovedBy?: string;

  // Recurrence
  similarComplaintsBefore: boolean;
  previousComplaintIds?: string[];
  recurringIssue: boolean;

  // Documents
  supportingDocuments?: string[];
  evidencePhotos?: string[];
  emailCorrespondence?: string[];

  // Audit
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class FeedbackAnalytics {
  id: string;
  periodStart: Date;
  periodEnd: Date;
  periodType: string; // weekly/monthly/quarterly/annual

  // Volume
  totalFeedbackReceived: number;
  feedbackResponseRate: number; // percentage

  // Overall Satisfaction
  averageOverallSatisfaction: number; // 1-5
  satisfactionTrend: string; // improving/stable/declining

  // Category Scores
  averageServiceQuality: number;
  averageEngineerProfessionalism: number;
  averageResponseTime: number;
  averageProblemResolution: number;
  averageCommunication: number;

  // NPS Analysis
  totalNPSResponses: number;
  promotersCount: number;
  passivesCount: number;
  detractorsCount: number;
  npsScore: number; // -100 to +100
  npsTrend: string;

  // CSAT (Customer Satisfaction Score)
  csatScore: number; // percentage of satisfied customers
  csatTrend: string;

  // Sentiment Distribution
  veryPositiveCount: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  veryNegativeCount: number;
  sentimentScore: number; // -1 to +1

  // Channel Performance
  channelPerformance?: Array<{
    channel: string;
    responseCount: number;
    averageRating: number;
  }>;

  // Top Praise Areas
  topPraiseTopics?: Array<{
    topic: string;
    mentionCount: number;
  }>;

  // Top Improvement Areas
  topImprovementTopics?: Array<{
    topic: string;
    mentionCount: number;
  }>;

  // Engineer Performance
  topRatedEngineers?: Array<{
    engineerId: string;
    engineerName: string;
    averageRating: number;
    feedbackCount: number;
  }>;

  // Complaints
  totalComplaints: number;
  complaintRate: number; // percentage
  criticalComplaints: number;
  complaintResolutionRate: number; // percentage

  // Action Items
  followUpsPending: number;
  issuesUnresolved: number;
  escalationsRequired: number;

  // Recommendations
  strengthAreas?: string[];
  improvementAreas?: string[];
  urgentActions?: string[];

  // Audit
  generatedBy: string;
  generatedAt: Date;
}
