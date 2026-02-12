import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// General CPQ Settings
@Entity('cpq_settings')
export class CPQSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  companyId: string;

  // Quote Settings
  @Column({ default: 'QT' })
  quoteNumberPrefix: string;

  @Column({ type: 'int', default: 30 })
  defaultQuoteValidityDays: number;

  @Column({ default: false })
  requireQuoteApproval: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  autoApprovalThreshold: number;

  @Column({ default: 'USD' })
  defaultCurrency: string;

  // Pricing Settings
  @Column({ default: false })
  allowManualPricing: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 50 })
  maxDiscountPercentage: number;

  @Column({ default: false })
  requireDiscountApproval: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  discountApprovalThreshold: number;

  @Column({ default: true })
  showListPrice: boolean;

  @Column({ default: true })
  showDiscountOnQuote: boolean;

  // Configuration Settings
  @Column({ default: true })
  enforceConfigurationRules: boolean;

  @Column({ default: true })
  allowPartialConfiguration: boolean;

  @Column({ default: false })
  requireConfigurationApproval: boolean;

  // Proposal Settings
  @Column({ default: 'PR' })
  proposalNumberPrefix: string;

  @Column({ default: false })
  requireProposalApproval: boolean;

  @Column({ default: true })
  trackProposalViews: boolean;

  // Contract Settings
  @Column({ default: 'CT' })
  contractNumberPrefix: string;

  @Column({ type: 'int', default: 12 })
  defaultContractTermMonths: number;

  @Column({ default: true })
  requireContractApproval: boolean;

  @Column({ default: false })
  enableESignature: boolean;

  @Column({ type: 'varchar', nullable: true })
  eSignatureProvider: string;

  // Integration Settings
  @Column({ type: 'json', nullable: true })
  crmIntegration: {
    enabled: boolean;
    provider: string;
    syncOpportunities: boolean;
    syncContacts: boolean;
    syncQuotes: boolean;
  };

  @Column({ type: 'json', nullable: true })
  erpIntegration: {
    enabled: boolean;
    syncProducts: boolean;
    syncPricing: boolean;
    syncOrders: boolean;
  };

  // Notification Settings
  @Column({ type: 'json', nullable: true })
  notifications: {
    quoteCreated: boolean;
    quoteApprovalRequired: boolean;
    quoteExpiring: boolean;
    proposalViewed: boolean;
    contractExpiring: boolean;
  };

  @Column({ type: 'int', default: 7 })
  expirationReminderDays: number;

  @Column({ type: 'varchar', nullable: true })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// User Permissions for CPQ
@Entity('cpq_user_permissions')
export class CPQUserPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  userId: string;

  @Column({ type: 'varchar', nullable: true })
  roleId: string;

  // Quote Permissions
  @Column({ default: true })
  canCreateQuotes: boolean;

  @Column({ default: false })
  canApproveQuotes: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  quoteApprovalLimit: number;

  @Column({ default: true })
  canViewAllQuotes: boolean;

  @Column({ default: true })
  canEditOwnQuotes: boolean;

  @Column({ default: false })
  canEditAllQuotes: boolean;

  @Column({ default: false })
  canDeleteQuotes: boolean;

  // Pricing Permissions
  @Column({ default: false })
  canOverridePrice: boolean;

  @Column({ default: false })
  canApplyAnyDiscount: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  maxDiscountPercentage: number;

  @Column({ default: false })
  canApproveDiscounts: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  discountApprovalLimit: number;

  // Configuration Permissions
  @Column({ default: true })
  canCreateConfigurations: boolean;

  @Column({ default: false })
  canOverrideRules: boolean;

  // Proposal Permissions
  @Column({ default: true })
  canCreateProposals: boolean;

  @Column({ default: false })
  canApproveProposals: boolean;

  @Column({ default: true })
  canSendProposals: boolean;

  // Contract Permissions
  @Column({ default: false })
  canCreateContracts: boolean;

  @Column({ default: false })
  canApproveContracts: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  contractApprovalLimit: number;

  @Column({ default: false })
  canModifyContractClauses: boolean;

  // Analytics Permissions
  @Column({ default: true })
  canViewOwnAnalytics: boolean;

  @Column({ default: false })
  canViewAllAnalytics: boolean;

  @Column({ default: false })
  canExportReports: boolean;

  // Admin Permissions
  @Column({ default: false })
  canManageSettings: boolean;

  @Column({ default: false })
  canManageTemplates: boolean;

  @Column({ default: false })
  canManageProducts: boolean;

  @Column({ default: false })
  canManagePricingRules: boolean;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// CPQ Approval Workflows
@Entity('cpq_approval_workflows')
export class CPQApprovalWorkflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['quote', 'discount', 'proposal', 'contract'],
  })
  workflowType: 'quote' | 'discount' | 'proposal' | 'contract';

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ type: 'json' })
  steps: {
    stepNumber: number;
    stepName: string;
    approverType: 'user' | 'role' | 'manager';
    approverId?: string;
    approverRole?: string;
    isRequired: boolean;
    canSkip: boolean;
    timeoutHours?: number;
    escalationUserId?: string;
  }[];

  @Column({ type: 'json', nullable: true })
  conditions: {
    field: string;
    operator: string;
    value: unknown;
  }[];

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  thresholdAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  thresholdDiscountPercentage: number;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Approval Requests
@Entity('cpq_approval_requests')
export class CPQApprovalRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  workflowId: string;

  @Column({
    type: 'enum',
    enum: ['quote', 'discount', 'proposal', 'contract'],
  })
  entityType: 'quote' | 'discount' | 'proposal' | 'contract';

  @Column()
  entityId: string;

  @Column({ type: 'varchar', nullable: true })
  entityNumber: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected', 'cancelled', 'escalated'],
    default: 'pending',
  })
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'escalated';

  @Column({ type: 'int', default: 1 })
  currentStep: number;

  @Column({ type: 'json', nullable: true })
  stepHistory: {
    stepNumber: number;
    stepName: string;
    approverId: string;
    approverName: string;
    action: 'approved' | 'rejected' | 'escalated';
    actionAt: Date;
    comments?: string;
  }[];

  @Column({ type: 'varchar', nullable: true })
  requestedBy: string;

  @Column({ type: 'text', nullable: true })
  requestNotes: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  requestedAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  requestedDiscountPercentage: number;

  @Column({ type: 'varchar', nullable: true })
  finalApproverId: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'text', nullable: true })
  finalComments: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Notification Settings
@Entity('cpq_notification_settings')
export class CPQNotificationSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: [
      'quote_created',
      'quote_approved',
      'quote_rejected',
      'quote_expiring',
      'approval_required',
      'discount_approved',
      'proposal_viewed',
      'contract_signed',
      'contract_expiring',
    ],
  })
  notificationType: string;

  @Column({ default: true })
  emailEnabled: boolean;

  @Column({ default: true })
  inAppEnabled: boolean;

  @Column({ default: false })
  smsEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Integrations
@Entity('cpq_integrations')
export class CPQIntegration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['crm', 'erp', 'cad', 'ecommerce', 'esignature', 'custom'],
  })
  integrationType: 'crm' | 'erp' | 'cad' | 'ecommerce' | 'esignature' | 'custom';

  @Column({ type: 'varchar', nullable: true })
  provider: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  configuration: {
    apiUrl?: string;
    apiKey?: string;
    clientId?: string;
    clientSecret?: string;
    webhookUrl?: string;
    syncSettings?: Record<string, boolean>;
  };

  @Column({ type: 'json', nullable: true })
  fieldMappings: {
    sourceField: string;
    targetField: string;
    transformationType?: string;
  }[];

  @Column({ type: 'timestamp', nullable: true })
  lastSyncAt: Date;

  @Column({
    type: 'enum',
    enum: ['success', 'failed', 'in_progress', 'never'],
    default: 'never',
  })
  lastSyncStatus: 'success' | 'failed' | 'in_progress' | 'never';

  @Column({ type: 'text', nullable: true })
  lastSyncError: string | null;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
