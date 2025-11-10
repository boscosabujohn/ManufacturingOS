import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';

export enum POItemStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  PARTIALLY_RECEIVED = 'Partially Received',
  FULLY_RECEIVED = 'Fully Received',
  CANCELLED = 'Cancelled',
}

@Entity('purchase_order_items')
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  purchaseOrderId: string;

  @ManyToOne(() => PurchaseOrder, (po) => po.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'purchaseOrderId' })
  purchaseOrder: PurchaseOrder;

  @Column({ type: 'int' })
  lineNumber: number;

  @Column({
    type: 'enum',
    enum: POItemStatus,
    default: POItemStatus.PENDING,
  })
  status: POItemStatus;

  // Item Information
  @Column()
  itemId: string;

  @Column({ length: 100 })
  itemCode: string;

  @Column({ length: 255 })
  itemName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 50 })
  uom: string;

  @Column({ type: 'text', nullable: true })
  specification: string;

  // Quantity Information
  @Column({ type: 'decimal', precision: 15, scale: 3 })
  orderedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
  receivedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
  pendingQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
  rejectedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
  acceptedQuantity: number;

  // Pricing Information
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  netUnitPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  lineTotal: number;

  // Tax Information
  @Column({ nullable: true, length: 50 })
  taxCode: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number;

  // Delivery Information
  @Column({ type: 'date', nullable: true })
  requiredDate: Date;

  @Column({ type: 'date', nullable: true })
  promisedDate: Date;

  @Column({ length: 100, nullable: true })
  deliveryLocation: string;

  // Accounting Information
  @Column({ nullable: true, length: 100 })
  accountCode: string;

  @Column({ nullable: true, length: 100 })
  costCenter: string;

  @Column({ nullable: true, length: 100 })
  project: string;

  // Quality Control
  @Column({ default: false })
  requiresQualityCheck: boolean;

  @Column({ default: false })
  qualityCheckPassed: boolean;

  @Column({ type: 'text', nullable: true })
  qualityRemarks: string;

  // Receipt References
  @Column({ type: 'json', nullable: true })
  receipts: {
    grnId: string;
    grnNumber: string;
    grnLineId: string;
    receivedDate: Date;
    quantity: number;
    acceptedQuantity: number;
    rejectedQuantity: number;
  }[];

  // Invoice References
  @Column({ type: 'json', nullable: true })
  invoices: {
    invoiceId: string;
    invoiceNumber: string;
    invoiceLineId: string;
    quantity: number;
    amount: number;
  }[];

  // Additional Information
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

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
