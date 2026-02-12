import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CostEstimate } from './cost-estimate.entity';

export enum PricingStatus {
  DRAFT = 'Draft',
  PENDING_APPROVAL = 'Pending Approval',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  SENT_TO_CUSTOMER = 'Sent to Customer',
  ACCEPTED = 'Accepted',
  DECLINED = 'Declined',
}

export enum PricingStrategy {
  COST_PLUS = 'Cost Plus',
  VALUE_BASED = 'Value Based',
  COMPETITIVE = 'Competitive',
  MARKET_BASED = 'Market Based',
  PENETRATION = 'Penetration',
  PREMIUM = 'Premium',
}

@Entity('estimation_pricing')
export class Pricing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column({ unique: true })
  pricingNumber: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  costEstimateId: string;

  @ManyToOne(() => CostEstimate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'costEstimateId' })
  costEstimate: CostEstimate;

  @Column({ type: 'varchar', nullable: true })
  customerId: string;

  @Column({ type: 'varchar', nullable: true })
  customerName: string;

  @Column({
    type: 'enum',
    enum: PricingStatus,
    default: PricingStatus.DRAFT,
  })
  status: PricingStatus;

  @Column({
    type: 'enum',
    enum: PricingStrategy,
    default: PricingStrategy.COST_PLUS,
  })
  pricingStrategy: PricingStrategy;

  @Column({ default: 'USD' })
  currency: string;

  // Base Cost from Estimate
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  baseCost: number;

  // Markup Details
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  markupPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  markupAmount: number;

  @Column({ type: 'json', nullable: true })
  markupBreakdown: {
    categoryId: string;
    categoryName: string;
    percentage: number;
    amount: number;
    applyTo: string;
  }[];

  // Margin Analysis
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  targetMarginPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  targetMarginAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  actualMarginPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  actualMarginAmount: number;

  // Discounts
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'text', nullable: true })
  discountReason: string;

  // Taxes
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxAmount: number;

  // Final Pricing
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalPrice: number;

  // Competitive Pricing
  @Column({ type: 'json', nullable: true })
  competitorPricing: {
    competitorName: string;
    estimatedPrice: number;
    source: string;
    notes: string;
  }[];

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  marketAveragePrice: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  pricePositionPercentage: number;

  // Payment Terms
  @Column({ type: 'json', nullable: true })
  paymentTerms: {
    milestone: string;
    percentage: number;
    amount: number;
    dueDate?: string;
  }[];

  // Dates
  @Column({ type: 'date', nullable: true })
  quotationDate: Date;

  @Column({ type: 'date', nullable: true })
  validUntil: Date;

  // Approval
  @Column({ type: 'varchar', nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'text', nullable: true })
  approvalNotes: string;

  // Customer Response
  @Column({ type: 'timestamp', nullable: true })
  sentToCustomerAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  customerResponseAt: Date;

  @Column({ type: 'text', nullable: true })
  customerFeedback: string;

  // Created/Updated
  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ type: 'varchar', nullable: true })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('estimation_markup_rules')
export class MarkupRule {
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

  @Column()
  applyTo: 'Material' | 'Labor' | 'Equipment' | 'Overhead' | 'Subcontractor' | 'All';

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  markupPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  minAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  maxAmount: number;

  @Column({ type: 'json', nullable: true })
  conditions: {
    field: string;
    operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan';
    value: string | number;
  }[];

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ type: 'varchar', nullable: true })
  categoryId: string;

  @Column({ type: 'varchar', nullable: true })
  customerId: string;

  @Column({ type: 'date', nullable: true })
  effectiveFrom: Date;

  @Column({ type: 'date', nullable: true })
  effectiveUntil: Date;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
