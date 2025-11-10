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

export enum DeliveryNoteStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  IN_TRANSIT = 'In Transit',
  DELIVERED = 'Delivered',
  PARTIALLY_DELIVERED = 'Partially Delivered',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled',
}

@Entity('logistics_delivery_notes')
export class DeliveryNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Delivery Note Identification
  @Column({ unique: true, length: 50 })
  deliveryNoteNumber: string;

  @Column({ nullable: true, length: 100 })
  referenceNumber: string;

  @Column({ nullable: true })
  shipmentId: string;

  @ManyToOne(() => Shipment, (shipment) => shipment.deliveryNotes, {
    nullable: true,
  })
  @JoinColumn({ name: 'shipmentId' })
  shipment: Shipment;

  @Column({ nullable: true })
  salesOrderId: string;

  @Column({ nullable: true, length: 100 })
  salesOrderNumber: string;

  @Column({ nullable: true })
  invoiceId: string;

  @Column({ nullable: true, length: 100 })
  invoiceNumber: string;

  @Column({
    type: 'enum',
    enum: DeliveryNoteStatus,
    default: DeliveryNoteStatus.DRAFT,
  })
  status: DeliveryNoteStatus;

  // Customer Information
  @Column({ nullable: true })
  customerId: string;

  @Column({ length: 200 })
  customerName: string;

  @Column({ type: 'text', nullable: true })
  customerAddress: string;

  @Column({ nullable: true, length: 100 })
  customerCity: string;

  @Column({ nullable: true, length: 100 })
  customerState: string;

  @Column({ nullable: true, length: 20 })
  customerPostalCode: string;

  @Column({ nullable: true, length: 100 })
  customerCountry: string;

  @Column({ nullable: true, length: 100 })
  contactPerson: string;

  @Column({ nullable: true, length: 20 })
  contactPhone: string;

  @Column({ nullable: true, length: 100 })
  contactEmail: string;

  // Delivery Details
  @Column({ type: 'date' })
  deliveryDate: Date;

  @Column({ nullable: true })
  warehouseId: string;

  @Column({ nullable: true, length: 200 })
  warehouseName: string;

  @Column({ nullable: true })
  transportCompanyId: string;

  @Column({ nullable: true, length: 200 })
  transportCompanyName: string;

  @Column({ nullable: true })
  vehicleId: string;

  @Column({ nullable: true, length: 100 })
  vehicleNumber: string;

  @Column({ nullable: true })
  driverId: string;

  @Column({ nullable: true, length: 100 })
  driverName: string;

  @Column({ nullable: true, length: 20 })
  driverPhone: string;

  @Column({ nullable: true, length: 100 })
  lrNumber: string; // Lorry Receipt Number

  @Column({ type: 'date', nullable: true })
  lrDate: Date;

  @Column({ nullable: true, length: 100 })
  ewayBillNumber: string;

  @Column({ type: 'date', nullable: true })
  ewayBillDate: Date;

  // Package Details
  @Column({ type: 'int', default: 0 })
  totalPackages: number;

  @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
  totalWeight: number;

  @Column({ length: 50, default: 'kg' })
  weightUnit: string;

  @Column({ type: 'decimal', precision: 15, scale: 3, nullable: true })
  totalVolume: number;

  @Column({ length: 50, nullable: true })
  volumeUnit: string;

  // Items Summary
  @Column({ type: 'json' })
  items: Array<{
    itemId: string;
    itemCode: string;
    itemName: string;
    quantity: number;
    unit: string;
    batchNumber?: string;
    serialNumbers?: string[];
  }>;

  // Delivery Information
  @Column({ type: 'timestamp', nullable: true })
  actualDeliveryDate: Date;

  @Column({ nullable: true, length: 200 })
  receivedByName: string;

  @Column({ nullable: true, length: 100 })
  receivedByDesignation: string;

  @Column({ type: 'text', nullable: true })
  receiverSignatureUrl: string;

  @Column({ type: 'json', nullable: true })
  deliveryPhotos: Array<{
    url: string;
    description: string;
    uploadedAt: Date;
  }>;

  @Column({ type: 'text', nullable: true })
  deliveryRemarks: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  // Terms and Conditions
  @Column({ type: 'text', nullable: true })
  termsAndConditions: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
  }>;

  // Approval Workflow
  @Column({ default: false })
  isApproved: boolean;

  @Column({ nullable: true, length: 100 })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
