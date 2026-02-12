import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BOQ } from './boq.entity';

export enum CostEstimateStatus {
  DRAFT = 'Draft',
  PENDING_APPROVAL = 'Pending Approval',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CONVERTED = 'Converted to Order',
}

export enum CostEstimateType {
  PRELIMINARY = 'Preliminary',
  DETAILED = 'Detailed',
  FINAL = 'Final',
  REVISED = 'Revised',
}

@Entity('estimation_cost_estimates')
export class CostEstimate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column({ unique: true })
  estimateNumber: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  boqId: string;

  @ManyToOne(() => BOQ, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'boqId' })
  boq: BOQ;

  @Column({ type: 'varchar', nullable: true })
  projectId: string;

  @Column({ type: 'varchar', nullable: true })
  customerId: string;

  @Column({ type: 'varchar', nullable: true })
  customerName: string;

  @Column({
    type: 'enum',
    enum: CostEstimateType,
    default: CostEstimateType.PRELIMINARY,
  })
  estimateType: CostEstimateType;

  @Column({
    type: 'enum',
    enum: CostEstimateStatus,
    default: CostEstimateStatus.DRAFT,
  })
  status: CostEstimateStatus;

  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ type: 'varchar', nullable: true })
  parentEstimateId: string;

  @Column({ default: 'USD' })
  currency: string;

  // Material Costs
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  materialCost: number;

  @Column({ type: 'json', nullable: true })
  materialCostBreakdown: {
    categoryId: string;
    categoryName: string;
    amount: number;
    items: {
      itemId: string;
      itemName: string;
      quantity: number;
      unitCost: number;
      totalCost: number;
    }[];
  }[];

  // Labor Costs
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  laborCost: number;

  @Column({ type: 'json', nullable: true })
  laborCostBreakdown: {
    roleId: string;
    roleName: string;
    hours: number;
    hourlyRate: number;
    totalCost: number;
  }[];

  // Overhead Costs
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  overheadCost: number;

  @Column({ type: 'json', nullable: true })
  overheadCostBreakdown: {
    categoryId: string;
    categoryName: string;
    amount: number;
    isPercentage: boolean;
    percentageBase?: string;
  }[];

  // Equipment Costs
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  equipmentCost: number;

  @Column({ type: 'json', nullable: true })
  equipmentCostBreakdown: {
    equipmentId: string;
    equipmentName: string;
    durationDays: number;
    dailyRate: number;
    totalCost: number;
  }[];

  // Subcontractor Costs
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  subcontractorCost: number;

  @Column({ type: 'json', nullable: true })
  subcontractorCostBreakdown: {
    subcontractorId: string;
    subcontractorName: string;
    description: string;
    amount: number;
  }[];

  // Total Cost Calculations
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  directCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  indirectCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  contingency: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  contingencyPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCost: number;

  // Risk Analysis
  @Column({ type: 'json', nullable: true })
  riskFactors: {
    riskId: string;
    riskName: string;
    probability: 'Low' | 'Medium' | 'High';
    impact: 'Low' | 'Medium' | 'High';
    mitigationCost: number;
    notes: string;
  }[];

  // Dates
  @Column({ type: 'date', nullable: true })
  estimateDate: Date;

  @Column({ type: 'date', nullable: true })
  validUntil: Date;

  @Column({ type: 'date', nullable: true })
  expectedStartDate: Date;

  @Column({ type: 'date', nullable: true })
  expectedEndDate: Date;

  // Approval
  @Column({ type: 'varchar', nullable: true })
  submittedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'text', nullable: true })
  approvalNotes: string;

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

@Entity('estimation_cost_estimate_items')
export class CostEstimateItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  costEstimateId: string;

  @ManyToOne(() => CostEstimate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'costEstimateId' })
  costEstimate: CostEstimate;

  @Column()
  itemNumber: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column()
  costType: 'Material' | 'Labor' | 'Equipment' | 'Overhead' | 'Subcontractor';

  @Column()
  unit: string;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  quantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  unitCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalCost: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', nullable: true })
  resourceRateId: string;

  @CreateDateColumn()
  createdAt: Date;
}
