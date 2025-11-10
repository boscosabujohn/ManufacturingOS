import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Trip } from './trip.entity';

export enum VehicleType {
  TRUCK = 'Truck',
  VAN = 'Van',
  PICKUP = 'Pickup',
  TRAILER = 'Trailer',
  CONTAINER = 'Container',
  TANKER = 'Tanker',
  REFRIGERATED = 'Refrigerated',
  FLATBED = 'Flatbed',
  MOTORCYCLE = 'Motorcycle',
  BICYCLE = 'Bicycle',
}

export enum VehicleStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  IN_SERVICE = 'In Service',
  UNDER_MAINTENANCE = 'Under Maintenance',
  BREAKDOWN = 'Breakdown',
  RETIRED = 'Retired',
}

export enum OwnershipType {
  OWN = 'Own',
  LEASED = 'Leased',
  RENTED = 'Rented',
  CONTRACTED = 'Contracted',
}

export enum FuelType {
  PETROL = 'Petrol',
  DIESEL = 'Diesel',
  CNG = 'CNG',
  LPG = 'LPG',
  ELECTRIC = 'Electric',
  HYBRID = 'Hybrid',
}

@Entity('logistics_vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Vehicle Identification
  @Column({ unique: true, length: 50 })
  vehicleCode: string;

  @Column({ unique: true, length: 50 })
  registrationNumber: string;

  @Column({ length: 100 })
  vehicleName: string;

  @Column({
    type: 'enum',
    enum: VehicleType,
    default: VehicleType.TRUCK,
  })
  vehicleType: VehicleType;

  @Column({
    type: 'enum',
    enum: VehicleStatus,
    default: VehicleStatus.ACTIVE,
  })
  status: VehicleStatus;

  @Column({
    type: 'enum',
    enum: OwnershipType,
    default: OwnershipType.OWN,
  })
  ownershipType: OwnershipType;

  // Vehicle Details
  @Column({ length: 100 })
  make: string;

  @Column({ length: 100 })
  model: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ nullable: true, length: 50 })
  color: string;

  @Column({ nullable: true, length: 50 })
  chassisNumber: string;

  @Column({ nullable: true, length: 50 })
  engineNumber: string;

  @Column({
    type: 'enum',
    enum: FuelType,
    default: FuelType.DIESEL,
  })
  fuelType: FuelType;

  // Capacity
  @Column({ type: 'decimal', precision: 15, scale: 3 })
  loadCapacity: number;

  @Column({ length: 50, default: 'kg' })
  capacityUnit: string;

  @Column({ type: 'decimal', precision: 15, scale: 3, nullable: true })
  volumeCapacity: number;

  @Column({ length: 50, nullable: true })
  volumeUnit: string;

  @Column({ type: 'int', nullable: true })
  numberOfSeats: number;

  // Dimensions
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  length: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  width: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  height: number;

  @Column({ length: 50, default: 'meters' })
  dimensionUnit: string;

  // Registration and Insurance
  @Column({ type: 'date' })
  registrationDate: Date;

  @Column({ type: 'date' })
  registrationExpiryDate: Date;

  @Column({ nullable: true, length: 100 })
  insuranceCompany: string;

  @Column({ nullable: true, length: 100 })
  insurancePolicyNumber: string;

  @Column({ type: 'date', nullable: true })
  insuranceExpiryDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  insuranceAmount: number;

  // Permits and Certificates
  @Column({ nullable: true, length: 100 })
  pollutionCertificateNumber: string;

  @Column({ type: 'date', nullable: true })
  pollutionCertificateExpiry: Date;

  @Column({ nullable: true, length: 100 })
  fitnesseCertificateNumber: string;

  @Column({ type: 'date', nullable: true })
  fitnessCertificateExpiry: Date;

  @Column({ nullable: true, length: 100 })
  roadTaxReceiptNumber: string;

  @Column({ type: 'date', nullable: true })
  roadTaxExpiry: Date;

  @Column({ nullable: true, length: 100 })
  permitNumber: string;

  @Column({ type: 'date', nullable: true })
  permitExpiry: Date;

  // Tracking and GPS
  @Column({ default: false })
  hasGpsTracking: boolean;

  @Column({ nullable: true, length: 100 })
  gpsDeviceId: string;

  @Column({ nullable: true, length: 200 })
  gpsProvider: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  lastKnownLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  lastKnownLongitude: number;

  @Column({ type: 'timestamp', nullable: true })
  lastLocationUpdateAt: Date;

  // Maintenance
  @Column({ type: 'int', default: 0 })
  currentOdometerReading: number;

  @Column({ type: 'date', nullable: true })
  lastServiceDate: Date;

  @Column({ type: 'date', nullable: true })
  nextServiceDate: Date;

  @Column({ type: 'int', nullable: true })
  serviceIntervalKm: number;

  @Column({ type: 'json', nullable: true })
  maintenanceHistory: Array<{
    date: Date;
    type: string;
    description: string;
    cost: number;
    mileage: number;
    serviceCenter: string;
  }>;

  // Ownership and Assignment
  @Column({ nullable: true })
  transportCompanyId: string;

  @Column({ nullable: true, length: 200 })
  transportCompanyName: string;

  @Column({ nullable: true })
  currentDriverId: string;

  @Column({ nullable: true, length: 100 })
  currentDriverName: string;

  @Column({ nullable: true })
  assignedToWarehouseId: string;

  @Column({ nullable: true, length: 200 })
  assignedToWarehouseName: string;

  // Features
  @Column({ default: false })
  hasRefrigeration: boolean;

  @Column({ default: false })
  hasTailLift: boolean;

  @Column({ default: false })
  hasSecuritySystem: boolean;

  @Column({ type: 'simple-array', nullable: true })
  specialFeatures: string[];

  // Financial
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  purchasePrice: number;

  @Column({ type: 'date', nullable: true })
  purchaseDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  currentValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  averageFuelConsumption: number; // km per liter

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  monthlyMaintenanceCost: number;

  @Column({ length: 10, default: 'INR' })
  currency: string;

  // Additional Information
  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

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
  @OneToMany(() => Trip, (trip) => trip.vehicle)
  trips: Trip[];
}
