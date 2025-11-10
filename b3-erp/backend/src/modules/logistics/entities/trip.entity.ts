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
import { Vehicle } from './vehicle.entity';
import { Driver } from './driver.entity';
import { Route } from './route.entity';
import { Shipment } from './shipment.entity';
import { TrackingEvent } from './tracking-event.entity';

export enum TripStatus {
  PLANNED = 'Planned',
  SCHEDULED = 'Scheduled',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  DELAYED = 'Delayed',
  ON_HOLD = 'On Hold',
}

export enum TripType {
  DELIVERY = 'Delivery',
  PICKUP = 'Pickup',
  ROUND_TRIP = 'Round Trip',
  MULTI_DROP = 'Multi-drop',
  EMPTY_RUN = 'Empty Run',
}

@Entity('logistics_trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Trip Identification
  @Column({ unique: true, length: 50 })
  tripNumber: string;

  @Column({ nullable: true, length: 100 })
  referenceNumber: string;

  @Column({
    type: 'enum',
    enum: TripType,
    default: TripType.DELIVERY,
  })
  tripType: TripType;

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.PLANNED,
  })
  status: TripStatus;

  // Vehicle and Driver
  @Column()
  vehicleId: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.trips)
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;

  @Column()
  driverId: string;

  @ManyToOne(() => Driver, (driver) => driver.trips)
  @JoinColumn({ name: 'driverId' })
  driver: Driver;

  @Column({ nullable: true })
  coDriverId: string;

  @Column({ nullable: true, length: 100 })
  coDriverName: string;

  // Route
  @Column({ nullable: true })
  routeId: string;

  @ManyToOne(() => Route, (route) => route.trips, { nullable: true })
  @JoinColumn({ name: 'routeId' })
  route: Route;

  // Origin and Destination
  @Column({ length: 200 })
  originName: string;

  @Column({ type: 'text' })
  originAddress: string;

  @Column({ nullable: true, length: 100 })
  originCity: string;

  @Column({ nullable: true, length: 100 })
  originState: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  originLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  originLongitude: number;

  @Column({ length: 200 })
  destinationName: string;

  @Column({ type: 'text' })
  destinationAddress: string;

  @Column({ nullable: true, length: 100 })
  destinationCity: string;

  @Column({ nullable: true, length: 100 })
  destinationState: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  destinationLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  destinationLongitude: number;

  // Schedule
  @Column({ type: 'timestamp' })
  plannedStartTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualStartTime: Date;

  @Column({ type: 'timestamp' })
  plannedEndTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualEndTime: Date;

  @Column({ type: 'int' })
  estimatedDurationMinutes: number;

  @Column({ type: 'int', nullable: true })
  actualDurationMinutes: number;

  // Distance and Odometer
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  plannedDistance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualDistance: number;

  @Column({ length: 50, default: 'km' })
  distanceUnit: string;

  @Column({ type: 'int', nullable: true })
  odometerStart: number;

  @Column({ type: 'int', nullable: true })
  odometerEnd: number;

  // Load Details
  @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
  loadWeight: number;

  @Column({ length: 50, default: 'kg' })
  weightUnit: string;

  @Column({ type: 'decimal', precision: 15, scale: 3, nullable: true })
  loadVolume: number;

  @Column({ length: 50, nullable: true })
  volumeUnit: string;

  @Column({ type: 'int', default: 0 })
  numberOfShipments: number;

  @Column({ type: 'int', default: 0 })
  numberOfStops: number;

  // Stops and Checkpoints
  @Column({ type: 'json', nullable: true })
  stops: Array<{
    stopNumber: number;
    stopName: string;
    address: string;
    latitude: number;
    longitude: number;
    stopType: string; // Pickup, Delivery, Rest
    plannedArrival: Date;
    actualArrival?: Date;
    plannedDeparture: Date;
    actualDeparture?: Date;
    status: string;
    notes?: string;
  }>;

  // Fuel and Expenses
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fuelAtStart: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fuelAtEnd: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fuelConsumed: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  fuelCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  tollCharges: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  parkingCharges: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  maintenanceCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  driverAllowance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  otherExpenses: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalExpenses: number;

  @Column({ length: 10, default: 'INR' })
  currency: string;

  @Column({ type: 'json', nullable: true })
  expenseDetails: Array<{
    expenseType: string;
    amount: number;
    description: string;
    receiptUrl?: string;
    recordedAt: Date;
  }>;

  // Performance Metrics
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  averageSpeed: number; // km/h

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fuelEfficiency: number; // km per liter

  @Column({ type: 'int', nullable: true })
  delayMinutes: number;

  @Column({ type: 'text', nullable: true })
  delayReason: string;

  @Column({ default: false })
  isOnTime: boolean;

  // Tracking
  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  currentLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  currentLongitude: number;

  @Column({ type: 'timestamp', nullable: true })
  lastLocationUpdateAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  completionPercentage: number;

  // Incidents and Issues
  @Column({ type: 'json', nullable: true })
  incidents: Array<{
    incidentType: string;
    description: string;
    location: string;
    latitude: number;
    longitude: number;
    reportedAt: Date;
    resolvedAt?: Date;
    severity: string;
  }>;

  @Column({ type: 'int', default: 0 })
  incidentCount: number;

  // Delivery Confirmation
  @Column({ default: false })
  isDeliveryConfirmed: boolean;

  @Column({ type: 'text', nullable: true })
  deliverySignatureUrl: string;

  @Column({ type: 'json', nullable: true })
  deliveryPhotos: Array<{
    url: string;
    description: string;
    uploadedAt: Date;
  }>;

  @Column({ nullable: true, length: 200 })
  deliveredToName: string;

  @Column({ type: 'text', nullable: true })
  deliveryNotes: string;

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
  @OneToMany(() => Shipment, (shipment) => shipment.trip)
  shipments: Shipment[];

  @OneToMany(() => TrackingEvent, (event) => event.trip)
  trackingEvents: TrackingEvent[];
}
