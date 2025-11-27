import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

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

@Entity('customer_feedback')
export class CustomerFeedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  feedbackNumber: string;

  // Related Records
  @Column({ nullable: true })
  serviceTicketId?: string;

  @Column({ nullable: true })
  fieldServiceJobId?: string;

  @Column({ nullable: true })
  installationId?: string;

  // Customer Information
  @Column()
  customerId: string;

  @Column()
  customerName: string;

  @Column({ nullable: true })
  contactPerson?: string;

  @Column({ nullable: true })
  contactPhone?: string;

  @Column({ nullable: true })
  contactEmail?: string;

  // Feedback Collection
  @Column({
    type: 'enum',
    enum: FeedbackChannel,
    default: FeedbackChannel.EMAIL
  })
  feedbackChannel: FeedbackChannel;

  @Column()
  feedbackDate: Date;

  @Column({ nullable: true })
  collectedBy?: string;

  // Service Details
  @Column()
  serviceDate: Date;

  @Column()
  serviceType: string;

  @Column({ nullable: true })
  engineerId?: string;

  @Column({ nullable: true })
  engineerName?: string;

  // Rating Questions
  @Column({ type: 'int', default: 0 })
  overallSatisfaction: number; // 1-5 scale

  @Column({ type: 'int', default: 0 })
  serviceQuality: number; // 1-5

  @Column({ type: 'int', default: 0 })
  engineerProfessionalism: number; // 1-5

  @Column({ type: 'int', default: 0 })
  responseTime: number; // 1-5

  @Column({ type: 'int', default: 0 })
  problemResolution: number; // 1-5

  @Column({ type: 'int', default: 0 })
  communication: number; // 1-5

  // NPS (Net Promoter Score)
  @Column({ type: 'int', nullable: true })
  npsRating?: number; // 0-10

  @Column({ nullable: true })
  npsCategory?: string; // promoter/passive/detractor

  // Open-ended Feedback
  @Column({ type: 'text', nullable: true })
  whatWentWell?: string;

  @Column({ type: 'text', nullable: true })
  areasOfImprovement?: string;

  @Column({ type: 'text', nullable: true })
  additionalComments?: string;

  @Column({ type: 'text', nullable: true })
  suggestions?: string;

  // Specific Aspects
  @Column({ nullable: true })
  engineerKnowledge?: string;

  @Column({ nullable: true })
  engineerCourtesy?: string;

  @Column({ nullable: true })
  workQuality?: string;

  @Column({ nullable: true })
  timeliness?: string;

  @Column({ nullable: true })
  cleanliness?: string;

  @Column({ nullable: true })
  valueForMoney?: string;

  // Sentiment Analysis
  @Column({
    type: 'enum',
    enum: FeedbackSentiment,
    default: FeedbackSentiment.NEUTRAL
  })
  sentiment: FeedbackSentiment;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  sentimentScore?: number; // -1 to +1

  @Column('simple-array', { nullable: true })
  keyPhrases?: string[];

  // Issues Highlighted
  @Column('simple-array', { nullable: true })
  issuesReported?: string[];

  @Column({ nullable: true })
  severity?: string; // low/medium/high

  @Column({ default: false })
  actionRequired: boolean;

  // Follow-up
  @Column({ default: false })
  followUpRequired: boolean;

  @Column({ nullable: true })
  followUpReason?: string;

  @Column({ nullable: true })
  followUpDate?: Date;

  @Column({ nullable: true })
  followUpCompletedBy?: string;

  @Column({ type: 'text', nullable: true })
  followUpNotes?: string;

  // Resolution
  @Column({ default: false })
  issueResolved: boolean;

  @Column({ type: 'text', nullable: true })
  resolutionNotes?: string;

  @Column({ nullable: true })
  resolutionDate?: Date;

  // Rewards & Recognition
  @Column({ default: false })
  engineerPraise: boolean;

  @Column({ default: false })
  praiseShared: boolean;

  @Column({ default: false })
  rewardRecommended: boolean;

  // Customer Loyalty
  @Column({ default: false })
  likelyToRecommend: boolean;

  @Column({ default: false })
  repeatCustomer: boolean;

  @Column({ nullable: true, length: 20 })
  contractRenewalIntent?: string; // yes/no/maybe

  // Metadata
  @Column({ nullable: true })
  surveyLink?: string;

  @Column({ type: 'int', nullable: true })
  surveyDuration?: number; // in seconds

  @Column({ nullable: true })
  deviceType?: string;

  @Column({ nullable: true })
  ipAddress?: string;

  // Audit
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
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

@Entity('complaint')
export class Complaint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  complaintNumber: string;

  @Column({
    type: 'enum',
    enum: ComplaintStatus,
    default: ComplaintStatus.REGISTERED
  })
  status: ComplaintStatus;

  @Column({
    type: 'enum',
    enum: ComplaintSeverity,
    default: ComplaintSeverity.LOW
  })
  severity: ComplaintSeverity;

  // Customer Information
  @Column()
  customerId: string;

  @Column()
  customerName: string;

  @Column()
  contactPerson: string;

  @Column()
  contactPhone: string;

  @Column({ nullable: true })
  contactEmail?: string;

  // Related Service
  @Column({ nullable: true })
  serviceTicketId?: string;

  @Column({ nullable: true })
  fieldServiceJobId?: string;

  @Column({ nullable: true })
  serviceDate?: Date;

  @Column({ nullable: true })
  engineerId?: string;

  // Complaint Details
  @Column()
  complaintDate: Date;

  @Column({
    type: 'enum',
    enum: FeedbackChannel,
    default: FeedbackChannel.EMAIL
  })
  complaintChannel: FeedbackChannel;

  @Column()
  complaintCategory: string; // service_quality/billing/engineer_behavior/delay/product_issue

  @Column()
  complaintSubject: string;

  @Column('text')
  complaintDescription: string;

  // Impact
  @Column()
  customerImpact: string; // low/medium/high

  @Column({ nullable: true })
  businessImpact?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  financialImpact?: number;

  @Column({ nullable: true })
  reputationImpact?: string;

  // Acknowledgment
  @Column({ default: false })
  acknowledged: boolean;

  @Column({ nullable: true })
  acknowledgedDate?: Date;

  @Column({ nullable: true })
  acknowledgedBy?: string;

  @Column({ default: false })
  acknowledgmentSentToCustomer: boolean;

  // Investigation
  @Column({ default: false })
  investigationStarted: boolean;

  @Column({ nullable: true })
  investigationStartDate?: Date;

  @Column({ nullable: true })
  investigatedBy?: string;

  @Column({ type: 'text', nullable: true })
  investigationNotes?: string;

  // Root Cause Analysis
  @Column({ default: false })
  rootCauseIdentified: boolean;

  @Column({ type: 'text', nullable: true })
  rootCause?: string;

  @Column('simple-array', { nullable: true })
  contributingFactors?: string[];

  @Column({ nullable: true })
  responsibleParty?: string;

  // Action Plan
  @Column({ type: 'text', nullable: true })
  actionPlan?: string;

  @Column({ nullable: true })
  actionOwner?: string;

  @Column({ nullable: true })
  actionTargetDate?: Date;

  @Column({ default: false })
  actionCompleted: boolean;

  @Column({ nullable: true })
  actionCompletionDate?: Date;

  // Resolution
  @Column({ type: 'text', nullable: true })
  resolutionNotes?: string;

  @Column({ nullable: true })
  resolutionDate?: Date;

  @Column({ nullable: true })
  resolvedBy?: string;

  @Column({ nullable: true })
  resolutionMethod?: string; // refund/replacement/repair/compensation/apology

  // Customer Communication
  @Column('jsonb', { nullable: true })
  communicationLog?: Array<{
    date: Date;
    channel: string;
    communicatedBy: string;
    message: string;
    customerResponse?: string;
  }>;

  // Escalation
  @Column({ default: false })
  escalated: boolean;

  @Column({ type: 'int', nullable: true })
  escalationLevel?: number; // 1: Manager, 2: Senior Management, 3: CEO

  @Column({ nullable: true })
  escalatedTo?: string;

  @Column({ nullable: true })
  escalationDate?: Date;

  @Column({ nullable: true })
  escalationReason?: string;

  // Customer Satisfaction
  @Column({ default: false })
  customerSatisfiedWithResolution: boolean;

  @Column({ type: 'text', nullable: true })
  postResolutionFeedback?: string;

  @Column({ type: 'int', nullable: true })
  postResolutionRating?: number;

  // Preventive Measures
  @Column({ type: 'text', nullable: true })
  preventiveMeasures?: string;

  @Column({ type: 'text', nullable: true })
  processImprovement?: string;

  @Column({ type: 'text', nullable: true })
  trainingRequired?: string;

  @Column({ type: 'text', nullable: true })
  policyChange?: string;

  // Compensation
  @Column({ default: false })
  compensationOffered: boolean;

  @Column({ nullable: true })
  compensationType?: string; // refund/discount/free_service/credit_note

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  compensationAmount?: number;

  @Column({ nullable: true })
  compensationApprovedBy?: string;

  // Closure
  @Column({ type: 'text', nullable: true })
  closureNotes?: string;

  @Column({ nullable: true })
  closedDate?: Date;

  @Column({ nullable: true })
  closedBy?: string;

  @Column({ nullable: true })
  closureApprovedBy?: string;

  // Recurrence
  @Column({ default: false })
  similarComplaintsBefore: boolean;

  @Column('simple-array', { nullable: true })
  previousComplaintIds?: string[];

  @Column({ default: false })
  recurringIssue: boolean;

  // Documents
  @Column('simple-array', { nullable: true })
  supportingDocuments?: string[];

  @Column('simple-array', { nullable: true })
  evidencePhotos?: string[];

  @Column('simple-array', { nullable: true })
  emailCorrespondence?: string[];

  // Audit
  @Column()
  createdBy: string;

  @Column({ nullable: true })
  updatedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('feedback_analytics')
export class FeedbackAnalytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  periodStart: Date;

  @Column()
  periodEnd: Date;

  @Column()
  periodType: string; // weekly/monthly/quarterly/annual

  // Volume
  @Column({ type: 'int', default: 0 })
  totalFeedbackReceived: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  feedbackResponseRate: number; // percentage

  // Overall Satisfaction
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageOverallSatisfaction: number; // 1-5

  @Column({ nullable: true })
  satisfactionTrend: string; // improving/stable/declining

  // Category Scores
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageServiceQuality: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageEngineerProfessionalism: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageResponseTime: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageProblemResolution: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageCommunication: number;

  // NPS Analysis
  @Column({ type: 'int', default: 0 })
  totalNPSResponses: number;

  @Column({ type: 'int', default: 0 })
  promotersCount: number;

  @Column({ type: 'int', default: 0 })
  passivesCount: number;

  @Column({ type: 'int', default: 0 })
  detractorsCount: number;

  @Column({ type: 'int', default: 0 })
  npsScore: number; // -100 to +100

  @Column({ nullable: true })
  npsTrend: string;

  // CSAT (Customer Satisfaction Score)
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  csatScore: number; // percentage of satisfied customers

  @Column({ nullable: true })
  csatTrend: string;

  // Sentiment Distribution
  @Column({ type: 'int', default: 0 })
  veryPositiveCount: number;

  @Column({ type: 'int', default: 0 })
  positiveCount: number;

  @Column({ type: 'int', default: 0 })
  neutralCount: number;

  @Column({ type: 'int', default: 0 })
  negativeCount: number;

  @Column({ type: 'int', default: 0 })
  veryNegativeCount: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  sentimentScore: number; // -1 to +1

  // Channel Performance
  @Column('jsonb', { nullable: true })
  channelPerformance?: Array<{
    channel: string;
    responseCount: number;
    averageRating: number;
  }>;

  // Top Praise Areas
  @Column('jsonb', { nullable: true })
  topPraiseTopics?: Array<{
    topic: string;
    mentionCount: number;
  }>;

  // Top Improvement Areas
  @Column('jsonb', { nullable: true })
  topImprovementTopics?: Array<{
    topic: string;
    mentionCount: number;
  }>;

  // Engineer Performance
  @Column('jsonb', { nullable: true })
  topRatedEngineers?: Array<{
    engineerId: string;
    engineerName: string;
    averageRating: number;
    feedbackCount: number;
  }>;

  // Complaints
  @Column({ type: 'int', default: 0 })
  totalComplaints: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  complaintRate: number; // percentage

  @Column({ type: 'int', default: 0 })
  criticalComplaints: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  complaintResolutionRate: number; // percentage

  // Action Items
  @Column({ type: 'int', default: 0 })
  followUpsPending: number;

  @Column({ type: 'int', default: 0 })
  issuesUnresolved: number;

  @Column({ type: 'int', default: 0 })
  escalationsRequired: number;

  // Recommendations
  @Column('simple-array', { nullable: true })
  strengthAreas?: string[];

  @Column('simple-array', { nullable: true })
  improvementAreas?: string[];

  @Column('simple-array', { nullable: true })
  urgentActions?: string[];

  // Audit
  @Column()
  generatedBy: string;

  @CreateDateColumn()
  generatedAt: Date;
}
