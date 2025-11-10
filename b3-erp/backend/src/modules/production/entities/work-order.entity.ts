import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { WorkOrderItem } from './work-order-item.entity';

export enum WorkOrderType {
  PRODUCTION = 'Production',
  REWORK = 'Rework',
  MAINTENANCE = 'Maintenance',
  ASSEMBLY = 'Assembly',
  DISASSEMBLY = 'Disassembly',
  PROTOTYPE = 'Prototype',
}

export enum WorkOrderStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  RELEASED = 'Released',
  IN_PROGRESS = 'In Progress',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed',
  CLOSED = 'Closed',
  CANCELLED = 'Cancelled',
}

export enum WorkOrderPriority {
  LOW = 'Low',
  NORMAL = 'Normal',
  HIGH = 'High',
  URGENT = 'Urgent',
  CRITICAL = 'Critical',
}

@Entity('work_orders')
export class WorkOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  workOrderNumber: string;

  @Column({ length: 255 })
  workOrderName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: WorkOrderType, default: WorkOrderType.PRODUCTION })
  workOrderType: WorkOrderType;

  @Column({ type: 'enum', enum: WorkOrderStatus, default: WorkOrderStatus.DRAFT })
  status: WorkOrderStatus;

  @Column({ type: 'enum', enum: WorkOrderPriority, default: WorkOrderPriority.NORMAL })
  priority: WorkOrderPriority;

  // Production item
  @Column()
  itemId: string;

  @Column({ length: 100 })
  itemCode: string;

  @Column({ length: 255 })
  itemName: string;

  @Column({ length: 50, default: 'PCS' })
  uom: string;

  // Quantities
  @Column({ type: 'decimal', precision: 15, scale: 4 })
  plannedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  producedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  acceptedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  rejectedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  scrapQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  pendingQuantity: number;

  // BOM and Routing
  @Column({ nullable: true })
  bomId: string;

  @Column({ length: 100, nullable: true })
  bomCode: string;

  @Column({ type: 'int', nullable: true })
  bomVersion: number;

  @Column({ nullable: true })
  routingId: string;

  @Column({ length: 100, nullable: true })
  routingCode: string;

  // Dates
  @Column({ type: 'date' })
  plannedStartDate: Date;

  @Column({ type: 'date' })
  plannedEndDate: Date;

  @Column({ type: 'date', nullable: true })
  actualStartDate: Date;

  @Column({ type: 'date', nullable: true })
  actualEndDate: Date;

  @Column({ type: 'date', nullable: true })
  requiredByDate: Date;

  // Work center
  @Column({ nullable: true })
  workCenterId: string;

  @Column({ length: 100, nullable: true })
  workCenterCode: string;

  @Column({ length: 255, nullable: true })
  workCenterName: string;

  // Source references
  @Column({ nullable: true })
  salesOrderId: string;

  @Column({ length: 100, nullable: true })
  salesOrderNumber: string;

  @Column({ nullable: true })
  productionPlanId: string;

  @Column({ length: 100, nullable: true })
  productionPlanNumber: string;

  @Column({ nullable: true })
  projectId: string;

  @Column({ length: 100, nullable: true })
  projectCode: string;

  // Customer/Job details
  @Column({ nullable: true })
  customerId: string;

  @Column({ length: 255, nullable: true })
  customerName: string;

  @Column({ length: 100, nullable: true })
  customerPO: string;

  @Column({ length: 100, nullable: true })
  jobNumber: string;

  // Costing
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  estimatedMaterialCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  estimatedLaborCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  estimatedOverheadCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  estimatedTotalCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  actualMaterialCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  actualLaborCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  actualOverheadCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  actualTotalCost: number;

  // Tracking
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progressPercentage: number;

  @Column({ default: false })
  materialsIssued: boolean;

  @Column({ default: false })
  materialsConsumed: boolean;

  @Column({ default: false })
  productionCompleted: boolean;

  @Column({ default: false })
  qualityInspected: boolean;

  @Column({ default: false })
  stockReceived: boolean;

  // Serial/Batch tracking
  @Column({ default: false })
  trackSerialNumbers: boolean;

  @Column({ default: false })
  trackBatchNumbers: boolean;

  @Column({ length: 100, nullable: true })
  batchNumber: string;

  @Column({ type: 'json', nullable: true })
  serialNumbers: string[];

  // Warehouse
  @Column({ nullable: true })
  sourceWarehouseId: string; // For raw materials

  @Column({ length: 100, nullable: true })
  sourceWarehouseName: string;

  @Column({ nullable: true })
  targetWarehouseId: string; // For finished goods

  @Column({ length: 100, nullable: true })
  targetWarehouseName: string;

  // Quality
  @Column({ default: false })
  requiresInspection: boolean;

  @Column({ nullable: true })
  qcTemplateId: string;

  @Column({ length: 50, nullable: true })
  qualityStatus: string;

  // Workflow
  @Column({ length: 100, nullable: true })
  submittedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date;

  @Column({ length: 100, nullable: true })
  releasedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  releasedAt: Date;

  @Column({ length: 100, nullable: true })
  startedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ length: 100, nullable: true })
  completedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ length: 100, nullable: true })
  closedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;

  @Column({ length: 100, nullable: true })
  cancelledBy: string;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

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

  // Relations
  @OneToMany(() => WorkOrderItem, (item) => item.workOrder, { cascade: true })
  items: WorkOrderItem[];
}
