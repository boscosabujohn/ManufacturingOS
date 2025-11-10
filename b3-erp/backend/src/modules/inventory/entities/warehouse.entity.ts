import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { StockLocation } from './stock-location.entity';

export enum WarehouseType {
  MAIN = 'Main Warehouse',
  BRANCH = 'Branch Warehouse',
  TRANSIT = 'Transit Warehouse',
  VENDOR = 'Vendor Managed',
  CUSTOMER = 'Customer Location',
  QUARANTINE = 'Quarantine',
  SCRAP = 'Scrap Yard',
}

export enum WarehouseStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  MAINTENANCE = 'Under Maintenance',
  CLOSED = 'Closed',
}

@Entity('warehouses')
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  warehouseCode: string;

  @Column({ length: 255 })
  warehouseName: string;

  @Column({
    type: 'enum',
    enum: WarehouseType,
    default: WarehouseType.MAIN,
  })
  warehouseType: WarehouseType;

  @Column({
    type: 'enum',
    enum: WarehouseStatus,
    default: WarehouseStatus.ACTIVE,
  })
  status: WarehouseStatus;

  // Address information
  @Column({ type: 'text', nullable: true })
  addressLine1: string;

  @Column({ type: 'text', nullable: true })
  addressLine2: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 20, nullable: true })
  postalCode: string;

  @Column({ length: 100, nullable: true })
  country: string;

  // Contact information
  @Column({ length: 100, nullable: true })
  contactPerson: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  // Capacity and details
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  totalArea: number; // in square meters

  @Column({ length: 50, nullable: true })
  areaUnit: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  storageCapacity: number; // in units or cubic meters

  @Column({ length: 50, nullable: true })
  capacityUnit: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  currentUtilization: number; // percentage

  // Company/Branch assignment
  @Column({ nullable: true })
  companyId: string;

  @Column({ nullable: true })
  branchId: string;

  // Parent warehouse for hierarchical structure
  @Column({ nullable: true })
  parentWarehouseId: string;

  // Manager information
  @Column({ nullable: true })
  managerId: string;

  @Column({ length: 100, nullable: true })
  managerName: string;

  // Operational details
  @Column({ default: true })
  allowNegativeStock: boolean;

  @Column({ default: false })
  requiresBatchTracking: boolean;

  @Column({ default: false })
  requiresSerialTracking: boolean;

  @Column({ default: false })
  autoReplenishment: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperatureMin: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperatureMax: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  humidityMin: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  humidityMax: number;

  // Additional details
  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'json', nullable: true })
  workingHours: {
    day: string;
    startTime: string;
    endTime: string;
    isClosed: boolean;
  }[];

  @Column({ type: 'json', nullable: true })
  facilities: string[]; // ['Loading Dock', 'Cold Storage', 'Forklift', etc.]

  @Column({ type: 'json', nullable: true })
  certifications: {
    certificateName: string;
    certificateNumber: string;
    issueDate: Date;
    expiryDate: Date;
  }[];

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StockLocation, (location) => location.warehouse)
  locations: StockLocation[];
}
