import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';

export enum LocationType {
  BIN = 'Bin',
  RACK = 'Rack',
  SHELF = 'Shelf',
  PALLET = 'Pallet',
  FLOOR = 'Floor',
  ZONE = 'Zone',
  AISLE = 'Aisle',
  RECEIVING = 'Receiving Area',
  DISPATCH = 'Dispatch Area',
  QUARANTINE = 'Quarantine',
  STAGING = 'Staging Area',
}

export enum LocationStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  FULL = 'Full',
  BLOCKED = 'Blocked',
  UNDER_MAINTENANCE = 'Under Maintenance',
}

@Entity('stock_locations')
export class StockLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  warehouseId: string;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.locations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  @Column({ unique: true, length: 100 })
  locationCode: string; // e.g., WH01-A-01-05 (Warehouse-Aisle-Rack-Bin)

  @Column({ length: 255 })
  locationName: string;

  @Column({
    type: 'enum',
    enum: LocationType,
    default: LocationType.BIN,
  })
  locationType: LocationType;

  @Column({
    type: 'enum',
    enum: LocationStatus,
    default: LocationStatus.ACTIVE,
  })
  status: LocationStatus;

  // Hierarchical location structure
  @Column({ nullable: true })
  parentLocationId: string;

  @Column({ length: 50, nullable: true })
  zone: string; // Zone A, Zone B

  @Column({ length: 50, nullable: true })
  aisle: string; // Aisle 1, Aisle 2

  @Column({ length: 50, nullable: true })
  rack: string; // Rack A, Rack B

  @Column({ length: 50, nullable: true })
  shelf: string; // Shelf 1, Shelf 2

  @Column({ length: 50, nullable: true })
  bin: string; // Bin 001, Bin 002

  @Column({ type: 'int', nullable: true })
  level: number; // Floor level

  // Physical dimensions
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  length: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  width: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  height: number;

  @Column({ length: 20, nullable: true })
  dimensionUnit: string; // meters, feet

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  volume: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  maxWeight: number;

  @Column({ length: 20, nullable: true })
  weightUnit: string; // kg, lbs

  // Capacity management
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  maxCapacity: number; // in units or volume

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  currentCapacity: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  utilizationPercentage: number;

  // Picking and putaway priority
  @Column({ type: 'int', default: 0 })
  pickingSequence: number; // Lower number = higher priority

  @Column({ type: 'int', default: 0 })
  putawaySequence: number;

  // Storage restrictions
  @Column({ default: false })
  isMixedItemAllowed: boolean; // Can store multiple items

  @Column({ default: false })
  isMixedBatchAllowed: boolean;

  @Column({ default: false })
  isFixedLocation: boolean; // Dedicated for specific item

  @Column({ nullable: true })
  fixedItemId: string;

  @Column({ length: 255, nullable: true })
  fixedItemName: string;

  // Environmental conditions
  @Column({ default: false })
  isTemperatureControlled: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperatureMin: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperatureMax: number;

  @Column({ default: false })
  isHumidityControlled: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  humidityMin: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  humidityMax: number;

  // Additional attributes
  @Column({ type: 'json', nullable: true })
  allowedItemCategories: string[]; // Restrict by category

  @Column({ type: 'json', nullable: true })
  blockedItemCategories: string[];

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ nullable: true })
  lastStockTakeDate: Date;

  @Column({ default: false })
  requiresCycleCount: boolean;

  @Column({ type: 'int', nullable: true })
  cycleCountFrequencyDays: number;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
