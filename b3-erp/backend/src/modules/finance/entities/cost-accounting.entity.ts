import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum CostType {
  STANDARD = 'Standard',
  ACTUAL = 'Actual',
  BUDGETED = 'Budgeted',
}

export enum CostCategory {
  MATERIAL = 'Material',
  LABOR = 'Labor',
  OVERHEAD = 'Overhead',
  OTHER = 'Other',
}

@Entity('cost_centers')
export class CostCenter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  costCenterCode: string;

  @Column({ length: 255 })
  costCenterName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  parentCostCenterId: string;

  @ManyToOne(() => CostCenter, { nullable: true })
  @JoinColumn({ name: 'parentCostCenterId' })
  parentCostCenter: CostCenter;

  @Column({ nullable: true, length: 100 })
  department: string;

  @Column({ nullable: true, length: 100 })
  location: string;

  @Column({ nullable: true })
  managerId: string;

  @Column({ nullable: true, length: 255 })
  managerName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isProfitCenter: boolean;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('standard_costs')
export class StandardCost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column({ length: 255 })
  productName: string;

  @Column({ length: 50 })
  productCode: string;

  @Column({ type: 'date' })
  effectiveFromDate: Date;

  @Column({ type: 'date', nullable: true })
  effectiveToDate: Date;

  // Cost breakdown
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  materialCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  laborCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  overheadCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  otherCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalStandardCost: number;

  // Detailed cost components
  @Column({ type: 'json', nullable: true })
  materialComponents: {
    materialId: string;
    materialName: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }[];

  @Column({ type: 'json', nullable: true })
  laborComponents: {
    operationId: string;
    operationName: string;
    hours: number;
    hourlyRate: number;
    totalCost: number;
  }[];

  @Column({ type: 'json', nullable: true })
  overheadComponents: {
    overheadType: string;
    allocationBase: string;
    rate: number;
    totalCost: number;
  }[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('variance_analysis')
export class VarianceAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  varianceNumber: string;

  @Column()
  periodId: string;

  @Column({ nullable: true })
  productId: string;

  @Column({ nullable: true, length: 255 })
  productName: string;

  @Column({ nullable: true })
  jobId: string;

  @Column({ nullable: true, length: 255 })
  jobName: string;

  @Column({ type: 'date' })
  analysisDate: Date;

  // Material variance
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  materialPriceVariance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  materialQuantityVariance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalMaterialVariance: number;

  // Labor variance
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  laborRateVariance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  laborEfficiencyVariance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalLaborVariance: number;

  // Overhead variance
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  overheadSpendingVariance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  overheadEfficiencyVariance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  overheadVolumeVariance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalOverheadVariance: number;

  // Total variance
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalVariance: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  variancePercentage: number;

  // Standard vs Actual
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  standardCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  actualCost: number;

  // Detailed analysis
  @Column({ type: 'json', nullable: true })
  detailedAnalysis: {
    category: string;
    varianceType: string;
    standardValue: number;
    actualValue: number;
    variance: number;
    explanation: string;
  }[];

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ type: 'text', nullable: true })
  correctiveActions: string;

  @Column({ nullable: true, length: 100 })
  analyzedBy: string;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('wip_accounting')
export class WIPAccounting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  wipNumber: string;

  @Column()
  productionOrderId: string;

  @Column({ length: 255 })
  productionOrderNumber: string;

  @Column()
  periodId: string;

  @Column({ type: 'date' })
  valuationDate: Date;

  @Column({ nullable: true })
  productId: string;

  @Column({ nullable: true, length: 255 })
  productName: string;

  // Quantity
  @Column({ type: 'decimal', precision: 15, scale: 4 })
  quantity: number;

  @Column({ length: 50 })
  unit: string;

  // Cost accumulation
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  materialCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  laborCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  overheadCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalWIPValue: number;

  // Completion percentage
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  completionPercentage: number;

  // Status
  @Column({ default: 'In Progress', length: 50 })
  status: string;

  @Column({ nullable: true })
  costCenterId: string;

  @Column({ nullable: true, length: 100 })
  department: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
