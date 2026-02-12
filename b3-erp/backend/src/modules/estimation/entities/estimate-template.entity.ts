import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TemplateType {
  BOQ = 'BOQ',
  COST_ESTIMATE = 'Cost Estimate',
  PRICING = 'Pricing',
  FULL_ESTIMATE = 'Full Estimate',
}

@Entity('estimation_estimate_templates')
export class EstimateTemplate {
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
    enum: TemplateType,
    default: TemplateType.COST_ESTIMATE,
  })
  templateType: TemplateType;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: 'USD' })
  defaultCurrency: string;

  // Template Structure
  @Column({ type: 'json', nullable: true })
  sections: {
    sectionId: string;
    sectionName: string;
    order: number;
    isRequired: boolean;
    items: {
      itemId: string;
      itemName: string;
      description: string;
      costType: string;
      unit: string;
      defaultQuantity: number;
      defaultRate: number;
      isRequired: boolean;
    }[];
  }[];

  // Default Markup Settings
  @Column({ type: 'json', nullable: true })
  defaultMarkups: {
    costType: string;
    markupPercentage: number;
    name: string;
  }[];

  // Default Overhead Settings
  @Column({ type: 'json', nullable: true })
  defaultOverheads: {
    name: string;
    percentage: number;
    applyTo: string;
  }[];

  // Default Contingency
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  defaultContingencyPercentage: number;

  // Default Terms
  @Column({ type: 'json', nullable: true })
  defaultPaymentTerms: {
    milestone: string;
    percentage: number;
  }[];

  @Column({ type: 'int', nullable: true })
  defaultValidityDays: number;

  // Usage Stats
  @Column({ type: 'int', default: 0 })
  usageCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastUsedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ type: 'varchar', nullable: true })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('estimation_cost_categories')
export class CostCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  costType: 'Material' | 'Labor' | 'Equipment' | 'Overhead' | 'Subcontractor' | 'Other';

  @Column({ type: 'varchar', nullable: true })
  parentCategoryId: string;

  @Column({ type: 'int', default: 0 })
  level: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  defaultMarkupPercentage: number;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'varchar', nullable: true })
  glAccountCode: string;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('estimation_approval_workflows')
export class EstimateApprovalWorkflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column()
  entityType: 'BOQ' | 'CostEstimate' | 'Pricing' | 'All';

  @Column({ type: 'json' })
  steps: {
    stepNumber: number;
    stepName: string;
    approverRole: string;
    approverUserId?: string;
    minAmount?: number;
    maxAmount?: number;
    isRequired: boolean;
    timeoutDays?: number;
    escalationUserId?: string;
  }[];

  @Column({ type: 'json', nullable: true })
  conditions: {
    field: string;
    operator: string;
    value: string | number;
    action: string;
  }[];

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  thresholdAmount: number;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('estimation_estimate_versions')
export class EstimateVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  estimateId: string;

  @Column()
  estimateType: 'BOQ' | 'CostEstimate' | 'Pricing';

  @Column({ type: 'int' })
  versionNumber: number;

  @Column({ type: 'text', nullable: true })
  changeDescription: string;

  @Column({ type: 'json' })
  snapshot: Record<string, unknown>;

  @Column({ type: 'json', nullable: true })
  changedFields: {
    field: string;
    previousValue: unknown;
    newValue: unknown;
  }[];

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  previousTotal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  newTotal: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  changePercentage: number;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ type: 'varchar', nullable: true })
  createdByName: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('estimation_boq_templates')
export class BOQTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ type: 'json' })
  sections: {
    sectionNumber: string;
    sectionName: string;
    description: string;
    items: {
      itemNumber: string;
      description: string;
      unit: string;
      defaultQuantity?: number;
      defaultRate?: number;
      specifications?: string;
    }[];
  }[];

  @Column({ type: 'int', default: 0 })
  usageCount: number;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
