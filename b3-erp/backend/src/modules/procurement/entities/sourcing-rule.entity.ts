import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum SourcingRuleType {
  PREFERRED_VENDOR = 'preferred_vendor',
  SINGLE_SOURCE = 'single_source',
  MULTIPLE_SOURCE = 'multiple_source',
  COMPETITIVE_BIDDING = 'competitive_bidding',
  FRAMEWORK_AGREEMENT = 'framework_agreement',
  SPOT_PURCHASE = 'spot_purchase',
  EMERGENCY = 'emergency',
}

export enum SourcingTrigger {
  AMOUNT_THRESHOLD = 'amount_threshold',
  ITEM_CATEGORY = 'item_category',
  VENDOR_CATEGORY = 'vendor_category',
  DEPARTMENT = 'department',
  CRITICALITY = 'criticality',
  LEAD_TIME = 'lead_time',
}

export enum SourcingRuleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_APPROVAL = 'pending_approval',
  EXPIRED = 'expired',
}

@Entity('sourcing_rules')
@Index(['companyId', 'status'])
@Index(['ruleType', 'status'])
export class SourcingRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  companyId: string;

  @Column({ unique: true, length: 50 })
  ruleCode: string;

  @Column({ length: 255 })
  ruleName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: SourcingRuleType,
  })
  ruleType: SourcingRuleType;

  @Column({
    type: 'enum',
    enum: SourcingRuleStatus,
    default: SourcingRuleStatus.ACTIVE,
  })
  status: SourcingRuleStatus;

  // Priority (higher = more important)
  @Column({ type: 'int', default: 100 })
  priority: number;

  // Trigger Conditions
  @Column({
    type: 'enum',
    enum: SourcingTrigger,
  })
  triggerType: SourcingTrigger;

  @Column({ type: 'json' })
  triggerConditions: {
    minAmount?: number;
    maxAmount?: number;
    itemCategories?: string[];
    itemCodes?: string[];
    vendorCategories?: string[];
    vendorIds?: string[];
    departments?: string[];
    criticalityLevels?: string[];
    minLeadTime?: number;
    maxLeadTime?: number;
  };

  // Sourcing Actions
  @Column({ type: 'json' })
  actions: {
    minVendors?: number;
    maxVendors?: number;
    preferredVendorIds?: string[];
    excludedVendorIds?: string[];
    requireApproval?: boolean;
    approvalLevels?: number;
    allowNegotiation?: boolean;
    requireTechnicalEvaluation?: boolean;
    requireCommercialEvaluation?: boolean;
    minQuotationsRequired?: number;
    evaluationCriteria?: {
      criterion: string;
      weightage: number;
    }[];
    autoAwardThreshold?: number;
    requireJustificationAbove?: number;
  };

  // Vendor Selection Criteria
  @Column({ type: 'json', nullable: true })
  vendorCriteria: {
    minRating?: number;
    maxActiveContracts?: number;
    requiredCertifications?: string[];
    requiredCapabilities?: string[];
    geographicRestrictions?: string[];
    minExperience?: number;
    financialStability?: string;
  };

  // Time Constraints
  @Column({ type: 'json', nullable: true })
  timeConstraints: {
    minRfqDuration?: number; // days
    maxRfqDuration?: number;
    defaultRfqDuration?: number;
    reminderBeforeDays?: number;
    autoCloseAfterDays?: number;
  };

  // Compliance Requirements
  @Column({ type: 'json', nullable: true })
  complianceRequirements: {
    requireDocumentation?: boolean;
    requiredDocuments?: string[];
    requireAuditTrail?: boolean;
    requireApprovalJustification?: boolean;
    maxSingleSourceAmount?: number;
    competitiveBiddingThreshold?: number;
  };

  // Validity Period
  @Column({ type: 'date' })
  effectiveFrom: Date;

  @Column({ type: 'date', nullable: true })
  effectiveTo: Date;

  // Metadata
  @Column({ length: 100, nullable: true })
  createdBy: string;

  @Column({ length: 100, nullable: true })
  updatedBy: string;

  @Column({ length: 100, nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
