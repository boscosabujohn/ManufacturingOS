import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Trip } from './trip.entity';

export enum RouteStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  UNDER_CONSTRUCTION = 'Under Construction',
  BLOCKED = 'Blocked',
}

export enum RouteType {
  DIRECT = 'Direct',
  MULTI_STOP = 'Multi-stop',
  CIRCULAR = 'Circular',
  SCHEDULED = 'Scheduled',
}

@Entity('logistics_routes')
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Route Identification
  @Column({ unique: true, length: 50 })
  routeCode: string;

  @Column({ length: 200 })
  routeName: string;

  @Column({
    type: 'enum',
    enum: RouteType,
    default: RouteType.DIRECT,
  })
  routeType: RouteType;

  @Column({
    type: 'enum',
    enum: RouteStatus,
    default: RouteStatus.ACTIVE,
  })
  status: RouteStatus;

  // Origin
  @Column({ length: 200 })
  originName: string;

  @Column({ type: 'text' })
  originAddress: string;

  @Column({ nullable: true, length: 100 })
  originCity: string;

  @Column({ nullable: true, length: 100 })
  originState: string;

  @Column({ nullable: true, length: 20 })
  originPostalCode: string;

  @Column({ nullable: true, length: 100 })
  originCountry: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  originLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  originLongitude: number;

  // Destination
  @Column({ length: 200 })
  destinationName: string;

  @Column({ type: 'text' })
  destinationAddress: string;

  @Column({ nullable: true, length: 100 })
  destinationCity: string;

  @Column({ nullable: true, length: 100 })
  destinationState: string;

  @Column({ nullable: true, length: 20 })
  destinationPostalCode: string;

  @Column({ nullable: true, length: 100 })
  destinationCountry: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  destinationLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  destinationLongitude: number;

  // Route Details
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalDistance: number;

  @Column({ length: 50, default: 'km' })
  distanceUnit: string;

  @Column({ type: 'int' })
  estimatedDurationMinutes: number;

  @Column({ type: 'int', default: 0 })
  numberOfStops: number;

  // Stops/Waypoints
  @Column({ type: 'json', nullable: true })
  stops: Array<{
    stopNumber: number;
    stopName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    estimatedArrivalMinutes: number;
    stopDurationMinutes: number;
    stopType: string; // Pickup, Delivery, Rest Stop, Fuel Stop
    isRequired: boolean;
  }>;

  // Road Conditions
  @Column({ type: 'simple-array', nullable: true })
  roadTypes: string[]; // Highway, State Highway, City Roads, Village Roads

  @Column({ nullable: true, length: 100 })
  surfaceCondition: string; // Excellent, Good, Fair, Poor

  @Column({ default: false })
  hasTollPlaza: boolean;

  @Column({ type: 'int', default: 0 })
  numberOfTollPlazas: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  estimatedTollCharges: number;

  @Column({ type: 'json', nullable: true })
  tollPlazas: Array<{
    name: string;
    location: string;
    estimatedCharge: number;
  }>;

  // Traffic and Restrictions
  @Column({ nullable: true, length: 100 })
  trafficDensity: string; // Low, Medium, High

  @Column({ type: 'simple-array', nullable: true })
  peakHours: string[];

  @Column({ type: 'simple-array', nullable: true })
  restrictedHours: string[];

  @Column({ type: 'simple-array', nullable: true })
  vehicleRestrictions: string[];

  @Column({ default: false })
  requiresSpecialPermit: boolean;

  @Column({ type: 'text', nullable: true })
  permitDetails: string;

  // Weather and Safety
  @Column({ type: 'simple-array', nullable: true })
  weatherChallenges: string[]; // Heavy Rain, Fog, Snow, Extreme Heat

  @Column({ type: 'simple-array', nullable: true })
  safetyHazards: string[];

  @Column({ type: 'int', nullable: true })
  accidentProneZones: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  safetyRating: number; // Out of 5

  // Facilities
  @Column({ type: 'json', nullable: true })
  restStops: Array<{
    name: string;
    location: string;
    distanceFromOrigin: number;
    facilities: string[];
  }>;

  @Column({ type: 'json', nullable: true })
  fuelStations: Array<{
    name: string;
    location: string;
    distanceFromOrigin: number;
    fuelTypes: string[];
  }>;

  // Optimization
  @Column({ default: false })
  isOptimized: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastOptimizedAt: Date;

  @Column({ type: 'json', nullable: true })
  alternativeRoutes: Array<{
    routeName: string;
    distance: number;
    duration: number;
    description: string;
  }>;

  // Cost Estimation
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  estimatedFuelCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  estimatedDriverCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  estimatedMaintenanceCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  estimatedTotalCost: number;

  @Column({ length: 10, default: 'INR' })
  currency: string;

  // Usage Statistics
  @Column({ type: 'int', default: 0 })
  totalTripsCompleted: number;

  @Column({ type: 'date', nullable: true })
  lastUsedDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  averageActualDuration: number; // In minutes

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  onTimePercentage: number;

  // Additional Information
  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  specialInstructions: string;

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

  // Relations
  @OneToMany(() => Trip, (trip) => trip.route)
  trips: Trip[];
}
