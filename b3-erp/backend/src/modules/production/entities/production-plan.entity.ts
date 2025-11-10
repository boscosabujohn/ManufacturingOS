import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProductionPlanStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  APPROVED = 'Approved',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CLOSED = 'Closed',
  CANCELLED = 'Cancelled',
}

export enum PlanningMethod {
  MRP = 'MRP',
  JIT = 'JIT',
  MAKE_TO_ORDER = 'Make to Order',
  MAKE_TO_STOCK = 'Make to Stock',
  ASSEMBLE_TO_ORDER = 'Assemble to Order',
}

@Entity('production_plans')
export class ProductionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  planNumber: string;

  @Column({ length: 255 })
  planName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ProductionPlanStatus, default: ProductionPlanStatus.DRAFT })
  status: ProductionPlanStatus;

  @Column({ type: 'enum', enum: PlanningMethod, default: PlanningMethod.MRP })
  planningMethod: PlanningMethod;

  // Planning period
  @Column({ type: 'date' })
  periodStartDate: Date;

  @Column({ type: 'date' })
  periodEndDate: Date;

  @Column({ length: 50, nullable: true })
  periodName: string; // e.g., "Q1 2024", "Week 15"

  // Dates
  @Column({ type: 'date', nullable: true })
  planningDate: Date;

  @Column({ type: 'date', nullable: true })
  frozenDate: Date; // Date when plan is frozen

  // Item/Product
  @Column({ nullable: true })
  itemId: string;

  @Column({ length: 100, nullable: true })
  itemCode: string;

  @Column({ length: 255, nullable: true })
  itemName: string;

  @Column({ length: 100, nullable: true })
  itemCategory: string;

  // Quantities
  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  demandQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  forecastQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  openOrderQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  currentStockQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  plannedProductionQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  actualProductionQuantity: number;

  @Column({ length: 50, default: 'PCS' })
  uom: string;

  // MRP calculations
  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  netRequirement: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  safetyStock: number;

  @Column({ type: 'int', default: 0 })
  leadTimeDays: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  lotSize: number;

  // Capacity planning
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  requiredCapacityHours: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  availableCapacityHours: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  capacityUtilizationPercentage: number;

  @Column({ default: false })
  hasCapacityConstraint: boolean;

  // Work center
  @Column({ nullable: true })
  workCenterId: string;

  @Column({ length: 100, nullable: true })
  workCenterCode: string;

  @Column({ length: 255, nullable: true })
  workCenterName: string;

  // Source references
  @Column({ nullable: true })
  salesForecastId: string;

  @Column({ nullable: true })
  salesOrderId: string;

  @Column({ length: 100, nullable: true })
  salesOrderNumber: string;

  @Column({ nullable: true })
  customerId: string;

  @Column({ length: 255, nullable: true })
  customerName: string;

  // Work orders
  @Column({ type: 'int', default: 0 })
  workOrdersGenerated: number;

  @Column({ type: 'json', nullable: true })
  workOrderIds: string[];

  // MRP run details
  @Column({ default: false })
  mrpRunExecuted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  mrpRunDate: Date;

  @Column({ length: 100, nullable: true })
  mrpRunBy: string;

  @Column({ type: 'json', nullable: true })
  mrpResults: {
    componentsRequired: number;
    purchaseRequisitionsGenerated: number;
    workOrdersRecommended: number;
    shortages: any[];
    excesses: any[];
  };

  // Status tracking
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  completionPercentage: number;

  @Column({ default: false })
  isFrozen: boolean; // Frozen plans cannot be modified

  // Workflow
  @Column({ length: 100, nullable: true })
  submittedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date;

  @Column({ length: 100, nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'text', nullable: true })
  approvalComments: string;

  // Additional
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
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
