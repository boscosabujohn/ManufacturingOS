import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Shipment } from './shipment.entity';

export enum ShipmentItemStatus {
  PENDING = 'Pending',
  PICKED = 'Picked',
  PACKED = 'Packed',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  DAMAGED = 'Damaged',
  RETURNED = 'Returned',
}

@Entity('logistics_shipment_items')
export class ShipmentItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shipmentId: string;

  @ManyToOne(() => Shipment, (shipment) => shipment.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shipmentId' })
  shipment: Shipment;

  // Item Details
  @Column()
  itemId: string;

  @Column({ length: 100 })
  itemCode: string;

  @Column({ length: 200 })
  itemName: string;

  @Column({ type: 'text', nullable: true })
  itemDescription: string;

  @Column({ nullable: true, length: 100 })
  itemCategory: string;

  // Source Reference
  @Column({ nullable: true })
  sourceDocumentType: string; // Sales Order, Purchase Order, Stock Transfer

  @Column({ nullable: true })
  sourceDocumentId: string;

  @Column({ nullable: true })
  sourceDocumentLineId: string;

  // Quantities
  @Column({ type: 'decimal', precision: 15, scale: 3 })
  orderedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 3 })
  shippedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
  deliveredQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
  damagedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
  returnedQuantity: number;

  @Column({ length: 50 })
  unit: string;

  // Batch/Serial Tracking
  @Column({ nullable: true, length: 100 })
  batchNumber: string;

  @Column({ type: 'simple-array', nullable: true })
  serialNumbers: string[];

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  // Package Details
  @Column({ type: 'int', default: 1 })
  numberOfPackages: number;

  @Column({ type: 'decimal', precision: 15, scale: 3, nullable: true })
  weight: number;

  @Column({ length: 50, default: 'kg' })
  weightUnit: string;

  @Column({ type: 'decimal', precision: 15, scale: 3, nullable: true })
  volume: number;

  @Column({ length: 50, nullable: true })
  volumeUnit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  length: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  width: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  height: number;

  @Column({ length: 50, default: 'cm' })
  dimensionUnit: string;

  // Pricing
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  lineTotal: number;

  @Column({ length: 10, default: 'INR' })
  currency: string;

  // Warehouse/Location
  @Column({ nullable: true })
  warehouseId: string;

  @Column({ nullable: true, length: 200 })
  warehouseName: string;

  @Column({ nullable: true })
  locationId: string;

  @Column({ nullable: true, length: 200 })
  locationName: string;

  // Status
  @Column({
    type: 'enum',
    enum: ShipmentItemStatus,
    default: ShipmentItemStatus.PENDING,
  })
  status: ShipmentItemStatus;

  @Column({ default: false })
  isFragile: boolean;

  @Column({ default: false })
  isHazardous: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
