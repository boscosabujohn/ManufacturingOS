import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GoodsReceipt } from './goods-receipt.entity';

export enum GRNItemStatus {
  PENDING_INSPECTION = 'Pending Inspection',
  UNDER_INSPECTION = 'Under Inspection',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  PARTIALLY_ACCEPTED = 'Partially Accepted',
  RETURNED = 'Returned',
}

@Entity('goods_receipt_items')
export class GoodsReceiptItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  goodsReceiptId: string;

  @ManyToOne(() => GoodsReceipt, (grn) => grn.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'goodsReceiptId' })
  goodsReceipt: GoodsReceipt;

  @Column({ type: 'int' })
  lineNumber: number;

  @Column({
    type: 'enum',
    enum: GRNItemStatus,
    default: GRNItemStatus.PENDING_INSPECTION,
  })
  status: GRNItemStatus;

  // PO Reference
  @Column({ nullable: true })
  purchaseOrderItemId: string;

  @Column({ type: 'int', nullable: true })
  poLineNumber: number;

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
  @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
  orderedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 3 })
  receivedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
  acceptedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
  rejectedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
  shortageQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
  excessQuantity: number;

  // Pricing Information
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  lineTotal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number;

  // Physical Inspection
  @Column({ type: 'text', nullable: true })
  batchNumber: string;

  @Column({ type: 'text', nullable: true })
  serialNumber: string;

  @Column({ type: 'date', nullable: true })
  manufacturingDate: Date;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ type: 'text', nullable: true })
  packingCondition: string;

  @Column({ default: false })
  isDamaged: boolean;

  @Column({ type: 'text', nullable: true })
  damageRemarks: string;

  // Quality Control
  @Column({ default: false })
  requiresQualityCheck: boolean;

  @Column({ default: false })
  qualityCheckCompleted: boolean;

  @Column({ default: false })
  qualityCheckPassed: boolean;

  @Column({ type: 'text', nullable: true })
  qualityCheckRemarks: string;

  @Column({ nullable: true, length: 100 })
  inspectedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  inspectedAt: Date;

  @Column({ type: 'json', nullable: true })
  qualityParameters: {
    parameter: string;
    standard: string;
    result: string;
    status: string;
    remarks: string;
  }[];

  // Storage Information
  @Column({ nullable: true, length: 100 })
  warehouseId: string;

  @Column({ nullable: true, length: 255 })
  warehouseName: string;

  @Column({ nullable: true, length: 100 })
  binLocation: string;

  @Column({ nullable: true, length: 100 })
  rackNumber: string;

  // Accounting Information
  @Column({ nullable: true, length: 100 })
  accountCode: string;

  @Column({ nullable: true, length: 100 })
  costCenter: string;

  @Column({ nullable: true, length: 100 })
  project: string;

  // Rejection Details
  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ length: 100, nullable: true })
  rejectionCode: string;

  @Column({ type: 'text', nullable: true })
  disposalInstructions: string;

  @Column({ default: false })
  isReturnedToVendor: boolean;

  @Column({ nullable: true })
  purchaseReturnId: string;

  @Column({ length: 50, nullable: true })
  purchaseReturnNumber: string;

  // Inventory Posting
  @Column({ default: false })
  isPostedToInventory: boolean;

  @Column({ nullable: true })
  inventoryTransactionId: string;

  @Column({ type: 'timestamp', nullable: true })
  inventoryPostedAt: Date;

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
