import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ShipmentItem } from './shipment-item.entity';
import { DeliveryNote } from './delivery-note.entity';
import { Trip } from './trip.entity';
import { TrackingEvent } from './tracking-event.entity';
import { FreightCharge } from './freight-charge.entity';

export enum ShipmentStatus {
  DRAFT = 'Draft',
  CONFIRMED = 'Confirmed',
  DISPATCHED = 'Dispatched',
  IN_TRANSIT = 'In Transit',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
  PARTIALLY_DELIVERED = 'Partially Delivered',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled',
  RETURNED = 'Returned',
}

export enum ShipmentType {
  INBOUND = 'Inbound',
  OUTBOUND = 'Outbound',
  INTER_WAREHOUSE = 'Inter-warehouse',
  RETURN = 'Return',
  CUSTOMER_DELIVERY = 'Customer Delivery',
  SUPPLIER_DELIVERY = 'Supplier Delivery',
}

export enum ShipmentMode {
  ROAD = 'Road',
  RAIL = 'Rail',
  AIR = 'Air',
  SEA = 'Sea',
  COURIER = 'Courier',
  MULTIMODAL = 'Multimodal',
}

export enum ShipmentPriority {
  LOW = 'Low',
  NORMAL = 'Normal',
  HIGH = 'High',
  URGENT = 'Urgent',
}

@Entity('logistics_shipments')
export class Shipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Shipment Identification
  @Column({ unique: true, length: 50 })
  shipmentNumber: string;

  @Column({ nullable: true, length: 100 })
  referenceNumber: string;

  @Column({ nullable: true, length: 100 })
  trackingNumber: string;

  @Column({
    type: 'enum',
    enum: ShipmentType,
    default: ShipmentType.OUTBOUND,
  })
  shipmentType: ShipmentType;

  @Column({
    type: 'enum',
    enum: ShipmentStatus,
    default: ShipmentStatus.DRAFT,
  })
  status: ShipmentStatus;

  @Column({
    type: 'enum',
    enum: ShipmentPriority,
    default: ShipmentPriority.NORMAL,
  })
  priority: ShipmentPriority;

  @Column({
    type: 'enum',
    enum: ShipmentMode,
    default: ShipmentMode.ROAD,
  })
  shipmentMode: ShipmentMode;

  // Origin Information
  @Column({ nullable: true })
  originType: string; // Warehouse, Customer, Supplier

  @Column({ nullable: true })
  originId: string;

  @Column({ nullable: true, length: 200 })
  originName: string;

  @Column({ type: 'text', nullable: true })
  originAddress: string;

  @Column({ nullable: true, length: 100 })
  originCity: string;

  @Column({ nullable: true, length: 100 })
  originState: string;

  @Column({ nullable: true, length: 20 })
  originPostalCode: string;

  @Column({ nullable: true, length: 100 })
  originCountry: string;

  @Column({ nullable: true, length: 100 })
  originContactPerson: string;

  @Column({ nullable: true, length: 20 })
  originContactPhone: string;

  // Destination Information
  @Column({ nullable: true })
  destinationType: string; // Warehouse, Customer, Supplier

  @Column({ nullable: true })
  destinationId: string;

  @Column({ nullable: true, length: 200 })
  destinationName: string;

  @Column({ type: 'text', nullable: true })
  destinationAddress: string;

  @Column({ nullable: true, length: 100 })
  destinationCity: string;

  @Column({ nullable: true, length: 100 })
  destinationState: string;

  @Column({ nullable: true, length: 20 })
  destinationPostalCode: string;

  @Column({ nullable: true, length: 100 })
  destinationCountry: string;

  @Column({ nullable: true, length: 100 })
  destinationContactPerson: string;

  @Column({ nullable: true, length: 20 })
  destinationContactPhone: string;

  // Shipment Details
  @Column({ nullable: true })
  salesOrderId: string;

  @Column({ nullable: true })
  purchaseOrderId: string;

  @Column({ nullable: true })
  deliveryNoteId: string;

  @Column({ nullable: true })
  tripId: string;

  @ManyToOne(() => Trip, (trip) => trip.shipments, { nullable: true })
  @JoinColumn({ name: 'tripId' })
  trip: Trip;

  @Column({ nullable: true })
  transportCompanyId: string;

  @Column({ nullable: true, length: 200 })
  transportCompanyName: string;

  @Column({ nullable: true })
  vehicleId: string;

  @Column({ nullable: true })
  driverId: string;

  @Column({ nullable: true })
  routeId: string;

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

  @Column({ type: 'decimal', precision: 15, scale: 3, nullable: true })
  declaredValue: number;

  @Column({ length: 10, default: 'INR' })
  currency: string;

  @Column({ type: 'simple-array', nullable: true })
  packageTypes: string[];

  // Dates and Times
  @Column({ type: 'timestamp', nullable: true })
  plannedPickupDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualPickupDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  plannedDeliveryDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  estimatedDeliveryDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualDeliveryDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  dispatchedDate: Date;

  // Distance and Duration
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedDistance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualDistance: number;

  @Column({ length: 50, default: 'km' })
  distanceUnit: string;

  @Column({ type: 'int', nullable: true })
  estimatedDurationMinutes: number;

  @Column({ type: 'int', nullable: true })
  actualDurationMinutes: number;

  // Freight and Charges
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  freightCharges: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  insuranceCharges: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  packagingCharges: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  handlingCharges: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  otherCharges: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number;

  // Special Handling
  @Column({ default: false })
  isFragile: boolean;

  @Column({ default: false })
  isPerishable: boolean;

  @Column({ default: false })
  requiresRefrigeration: boolean;

  @Column({ default: false })
  isHazardous: boolean;

  @Column({ default: false })
  requiresInsurance: boolean;

  @Column({ default: false })
  requiresSignature: boolean;

  @Column({ type: 'text', nullable: true })
  specialInstructions: string;

  @Column({ type: 'simple-array', nullable: true })
  handlingCodes: string[];

  // Delivery Proof
  @Column({ nullable: true, length: 200 })
  deliveredToName: string;

  @Column({ nullable: true, length: 100 })
  deliveredToDesignation: string;

  @Column({ type: 'text', nullable: true })
  deliverySignatureUrl: string;

  @Column({ type: 'json', nullable: true })
  deliveryPhotos: Array<{
    url: string;
    description: string;
    uploadedAt: Date;
  }>;

  @Column({ type: 'text', nullable: true })
  deliveryRemarks: string;

  // Additional Information
  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

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

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => ShipmentItem, (item) => item.shipment, { cascade: true })
  items: ShipmentItem[];

  @OneToMany(() => TrackingEvent, (event) => event.shipment)
  trackingEvents: TrackingEvent[];

  @OneToMany(() => FreightCharge, (charge) => charge.shipment)
  freightChargeDetails: FreightCharge[];

  @OneToMany(() => DeliveryNote, (note) => note.shipment)
  deliveryNotes: DeliveryNote[];
}
