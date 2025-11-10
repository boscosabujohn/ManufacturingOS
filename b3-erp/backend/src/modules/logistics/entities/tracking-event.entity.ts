import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Shipment } from './shipment.entity';
import { Trip } from './trip.entity';

export enum TrackingEventType {
  SHIPMENT_CREATED = 'Shipment Created',
  PICKUP_SCHEDULED = 'Pickup Scheduled',
  PICKED_UP = 'Picked Up',
  DISPATCHED = 'Dispatched',
  IN_TRANSIT = 'In Transit',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERY_ATTEMPTED = 'Delivery Attempted',
  DELIVERED = 'Delivered',
  DELAYED = 'Delayed',
  ON_HOLD = 'On Hold',
  EXCEPTION = 'Exception',
  RETURNED = 'Returned',
  CANCELLED = 'Cancelled',
  CHECKPOINT_REACHED = 'Checkpoint Reached',
  LOCATION_UPDATE = 'Location Update',
  CUSTOMS_CLEARANCE = 'Customs Clearance',
  WAREHOUSE_ARRIVAL = 'Warehouse Arrival',
  WAREHOUSE_DEPARTURE = 'Warehouse Departure',
}

export enum EventSeverity {
  INFO = 'Info',
  WARNING = 'Warning',
  ERROR = 'Error',
  CRITICAL = 'Critical',
}

@Entity('logistics_tracking_events')
export class TrackingEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Event Identification
  @Column({ unique: true, length: 50 })
  eventNumber: string;

  @Column({
    type: 'enum',
    enum: TrackingEventType,
  })
  eventType: TrackingEventType;

  @Column({
    type: 'enum',
    enum: EventSeverity,
    default: EventSeverity.INFO,
  })
  severity: EventSeverity;

  // Associations
  @Column({ nullable: true })
  shipmentId: string;

  @ManyToOne(() => Shipment, (shipment) => shipment.trackingEvents, {
    nullable: true,
  })
  @JoinColumn({ name: 'shipmentId' })
  shipment: Shipment;

  @Column({ nullable: true })
  tripId: string;

  @ManyToOne(() => Trip, (trip) => trip.trackingEvents, { nullable: true })
  @JoinColumn({ name: 'tripId' })
  trip: Trip;

  // Location Information
  @Column({ nullable: true, length: 200 })
  locationName: string;

  @Column({ type: 'text', nullable: true })
  locationAddress: string;

  @Column({ nullable: true, length: 100 })
  city: string;

  @Column({ nullable: true, length: 100 })
  state: string;

  @Column({ nullable: true, length: 100 })
  country: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  // Timing
  @Column({ type: 'timestamp' })
  eventTimestamp: Date;

  @Column({ type: 'timestamp', nullable: true })
  plannedTimestamp: Date;

  @Column({ type: 'int', nullable: true })
  delayMinutes: number;

  // Event Details
  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  additionalDetails: string;

  @Column({ nullable: true, length: 100 })
  status: string;

  @Column({ nullable: true, length: 100 })
  previousStatus: string;

  // Vehicle and Driver
  @Column({ nullable: true })
  vehicleId: string;

  @Column({ nullable: true, length: 100 })
  vehicleNumber: string;

  @Column({ nullable: true })
  driverId: string;

  @Column({ nullable: true, length: 100 })
  driverName: string;

  // Checkpoint Information
  @Column({ nullable: true, length: 200 })
  checkpointName: string;

  @Column({ type: 'int', nullable: true })
  checkpointSequence: number;

  @Column({ default: false })
  isPlannedCheckpoint: boolean;

  // Exception Details
  @Column({ default: false })
  isException: boolean;

  @Column({ nullable: true, length: 100 })
  exceptionType: string; // Delay, Damage, Accident, Weather, etc.

  @Column({ type: 'text', nullable: true })
  exceptionReason: string;

  @Column({ type: 'text', nullable: true })
  resolutionAction: string;

  @Column({ default: false })
  isResolved: boolean;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  // Delivery Proof
  @Column({ nullable: true, length: 200 })
  receivedByName: string;

  @Column({ nullable: true, length: 100 })
  receivedByDesignation: string;

  @Column({ type: 'text', nullable: true })
  signatureUrl: string;

  @Column({ type: 'json', nullable: true })
  photos: Array<{
    url: string;
    description: string;
    uploadedAt: Date;
  }>;

  // GPS Tracking
  @Column({ nullable: true, length: 100 })
  gpsDeviceId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  speed: number; // km/h

  @Column({ nullable: true, length: 50 })
  direction: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  altitude: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  accuracy: number; // in meters

  // Environmental Data
  @Column({ nullable: true, length: 100 })
  weatherCondition: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperature: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  humidity: number;

  // Automated vs Manual
  @Column({ default: false })
  isAutomated: boolean;

  @Column({ nullable: true, length: 100 })
  dataSource: string; // GPS, Manual Entry, API, Scanner

  @Column({ nullable: true, length: 100 })
  recordedBy: string;

  @Column({ nullable: true })
  recordedById: string;

  // Notifications
  @Column({ default: false })
  isCustomerNotified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  customerNotifiedAt: Date;

  @Column({ nullable: true, length: 100 })
  notificationChannel: string; // Email, SMS, Push, None

  // System Information
  @Column({ nullable: true, length: 100 })
  deviceId: string;

  @Column({ nullable: true, length: 100 })
  appVersion: string;

  @Column({ nullable: true, length: 50 })
  ipAddress: string;

  // Additional Information
  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
