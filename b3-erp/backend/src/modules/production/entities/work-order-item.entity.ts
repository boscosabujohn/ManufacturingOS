import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WorkOrder } from './work-order.entity';

export enum WorkOrderItemType {
  REQUIRED = 'Required',
  CONSUMED = 'Consumed',
  RETURNED = 'Returned',
  SCRAP = 'Scrap',
  BY_PRODUCT = 'By-Product',
}

@Entity('work_order_items')
export class WorkOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Parent work order
  @Column()
  workOrderId: string;

  @ManyToOne(() => WorkOrder, (workOrder) => workOrder.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workOrderId' })
  workOrder: WorkOrder;

  // Item details
  @Column()
  itemId: string;

  @Column({ length: 100 })
  itemCode: string;

  @Column({ length: 255 })
  itemName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: WorkOrderItemType, default: WorkOrderItemType.REQUIRED })
  itemType: WorkOrderItemType;

  // Sequence
  @Column({ type: 'int', default: 0 })
  sequenceNumber: number;

  // Quantities
  @Column({ type: 'decimal', precision: 15, scale: 4 })
  requiredQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  issuedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  consumedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  returnedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  pendingQuantity: number;

  @Column({ length: 50, default: 'PCS' })
  uom: string;

  // Costing
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  unitCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCost: number;

  // Operation link
  @Column({ nullable: true })
  operationId: string;

  @Column({ length: 100, nullable: true })
  operationCode: string;

  @Column({ default: false })
  backflush: boolean;

  // Source BOM
  @Column({ nullable: true })
  bomItemId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  scrapPercentage: number;

  // Warehouse
  @Column({ nullable: true })
  warehouseId: string;

  @Column({ length: 100, nullable: true })
  warehouseName: string;

  @Column({ length: 100, nullable: true })
  binLocation: string;

  // Batch/Serial tracking
  @Column({ default: false })
  trackSerialNumbers: boolean;

  @Column({ default: false })
  trackBatchNumbers: boolean;

  @Column({ length: 100, nullable: true })
  batchNumber: string;

  @Column({ type: 'json', nullable: true })
  serialNumbers: string[];

  // Issue tracking
  @Column({ default: false })
  isMaterialIssued: boolean;

  @Column({ type: 'timestamp', nullable: true })
  issuedAt: Date;

  @Column({ length: 100, nullable: true })
  issuedBy: string;

  @Column({ length: 100, nullable: true })
  materialIssueId: string;

  // Consumption tracking
  @Column({ default: false })
  isMaterialConsumed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  consumedAt: Date;

  @Column({ length: 100, nullable: true })
  consumedBy: string;

  // Alternative item flag
  @Column({ default: false })
  isAlternativeItem: boolean;

  @Column({ nullable: true })
  originalItemId: string;

  @Column({ length: 100, nullable: true })
  originalItemCode: string;

  // Additional
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: true })
  isActive: boolean;

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
