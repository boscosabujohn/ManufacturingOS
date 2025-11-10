import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EvaluationStatus {
  DRAFT = 'Draft',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export enum EvaluationPeriod {
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  HALF_YEARLY = 'Half Yearly',
  YEARLY = 'Yearly',
  AD_HOC = 'Ad-hoc',
}

export enum VendorPerformanceGrade {
  A_PLUS = 'A+',
  A = 'A',
  B_PLUS = 'B+',
  B = 'B',
  C = 'C',
  D = 'D',
  F = 'F',
}

@Entity('vendor_evaluations')
export class VendorEvaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  evaluationNumber: string;

  @Column({ type: 'date' })
  evaluationDate: Date;

  @Column({ type: 'date' })
  evaluationPeriodStart: Date;

  @Column({ type: 'date' })
  evaluationPeriodEnd: Date;

  @Column({
    type: 'enum',
    enum: EvaluationPeriod,
    default: EvaluationPeriod.QUARTERLY,
  })
  evaluationPeriod: EvaluationPeriod;

  @Column({
    type: 'enum',
    enum: EvaluationStatus,
    default: EvaluationStatus.DRAFT,
  })
  status: EvaluationStatus;

  // Vendor Information
  @Column()
  vendorId: string;

  @Column({ length: 255 })
  vendorName: string;

  @Column({ length: 50 })
  vendorCode: string;

  @Column({ length: 100, nullable: true })
  vendorCategory: string;

  // Evaluator Information
  @Column({ length: 100 })
  evaluatorId: string;

  @Column({ length: 255 })
  evaluatorName: string;

  @Column({ length: 100, nullable: true })
  department: string;

  // Performance Metrics - Quality
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  qualityScore: number;

  @Column({ type: 'int', default: 0 })
  totalDeliveries: number;

  @Column({ type: 'int', default: 0 })
  defectiveDeliveries: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  defectRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
  totalQuantityReceived: number;

  @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
  rejectedQuantity: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  rejectionRate: number;

  @Column({ type: 'int', default: 0 })
  qualityComplaints: number;

  @Column({ type: 'text', nullable: true })
  qualityRemarks: string;

  // Performance Metrics - Delivery
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  deliveryScore: number;

  @Column({ type: 'int', default: 0 })
  totalOrders: number;

  @Column({ type: 'int', default: 0 })
  onTimeDeliveries: number;

  @Column({ type: 'int', default: 0 })
  lateDeliveries: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  onTimeDeliveryPercentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  averageDeliveryDelay: number;

  @Column({ type: 'int', default: 0 })
  deliveryComplaints: number;

  @Column({ type: 'text', nullable: true })
  deliveryRemarks: string;

  // Performance Metrics - Pricing
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  priceScore: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalPurchaseValue: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  priceCompetitiveness: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  priceVariation: number;

  @Column({ type: 'int', default: 0 })
  priceIncreaseInstances: number;

  @Column({ type: 'int', default: 0 })
  priceDiscounts: number;

  @Column({ type: 'text', nullable: true })
  priceRemarks: string;

  // Performance Metrics - Responsiveness
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  responsivenessScore: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  averageResponseTime: number;

  @Column({ type: 'int', default: 0 })
  communicationIssues: number;

  @Column({ type: 'int', default: 0 })
  orderModifications: number;

  @Column({ type: 'int', default: 0 })
  emergencyOrdersFulfilled: number;

  @Column({ type: 'text', nullable: true })
  responsivenessRemarks: string;

  // Performance Metrics - Compliance
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  complianceScore: number;

  @Column({ type: 'int', default: 0 })
  documentationIssues: number;

  @Column({ type: 'int', default: 0 })
  packagingIssues: number;

  @Column({ type: 'int', default: 0 })
  regulatoryViolations: number;

  @Column({ default: false })
  certificationsValid: boolean;

  @Column({ type: 'text', nullable: true })
  complianceRemarks: string;

  // Performance Metrics - Service
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  serviceScore: number;

  @Column({ type: 'int', default: 0 })
  serviceRequests: number;

  @Column({ type: 'int', default: 0 })
  serviceRequestsResolved: number;

  @Column({ type: 'int', default: 0 })
  warrantyIssues: number;

  @Column({ type: 'int', default: 0 })
  technicalSupportIssues: number;

  @Column({ type: 'text', nullable: true })
  serviceRemarks: string;

  // Custom Evaluation Criteria
  @Column({ type: 'json', nullable: true })
  customCriteria: {
    criterion: string;
    weightage: number;
    score: number;
    weightedScore: number;
    maxScore: number;
    remarks: string;
  }[];

  // Overall Performance
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  qualityWeightage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  deliveryWeightage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  priceWeightage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  responsivenessWeightage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  complianceWeightage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  serviceWeightage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  overallScore: number;

  @Column({
    type: 'enum',
    enum: VendorPerformanceGrade,
    nullable: true,
  })
  performanceGrade: VendorPerformanceGrade;

  @Column({ type: 'int', nullable: true })
  ranking: number;

  // Strengths and Weaknesses
  @Column({ type: 'json', nullable: true })
  strengths: string[];

  @Column({ type: 'json', nullable: true })
  weaknesses: string[];

  @Column({ type: 'json', nullable: true })
  opportunities: string[];

  @Column({ type: 'json', nullable: true })
  threats: string[];

  // Recommendations
  @Column({ type: 'text', nullable: true })
  recommendations: string;

  @Column({ type: 'json', nullable: true })
  actionItems: {
    action: string;
    assignedTo: string;
    dueDate: Date;
    status: string;
    completedDate?: Date;
  }[];

  @Column({ type: 'text', nullable: true })
  improvementAreas: string;

  // Business Impact
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  costSavings: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  costOverruns: number;

  @Column({ type: 'int', default: 0 })
  productionDowntimeDays: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  productionDowntimeCost: number;

  // Future Outlook
  @Column({ type: 'text', nullable: true })
  futureBusinessRecommendation: string;

  @Column({ default: true })
  recommendForFutureBusiness: boolean;

  @Column({ default: false })
  recommendForBlacklist: boolean;

  @Column({ type: 'text', nullable: true })
  blacklistReason: string;

  // Approval Workflow
  @Column({ default: false })
  isApproved: boolean;

  @Column({ nullable: true, length: 100 })
  approvedBy: string;

  @Column({ nullable: true, length: 255 })
  approverName: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'text', nullable: true })
  approvalNotes: string;

  // Historical Comparison
  @Column({ nullable: true })
  previousEvaluationId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  previousScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  scoreImprovement: number;

  @Column({ type: 'text', nullable: true })
  trendAnalysis: string;

  // Additional Information
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];

  // Metadata
  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
