import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type AssetStatus = 'in_use' | 'idle' | 'maintenance' | 'transit' | 'storage' | 'retired';
export type AssetType = 'machine' | 'tool' | 'fixture' | 'vehicle' | 'container' | 'equipment';

@Entity('production_asset_trackers')
export class AssetTracker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'asset_code', unique: true })
  assetCode: string;

  @Column({ name: 'asset_name' })
  assetName: string;

  @Column({ name: 'asset_type', type: 'varchar', length: 20 })
  assetType: AssetType;

  @Column({ type: 'varchar', length: 20, default: 'idle' })
  status: AssetStatus;

  @Column({ name: 'serial_number', type: 'varchar', nullable: true })
  serialNumber: string | null;

  @Column({ name: 'rfid_tag', type: 'varchar', nullable: true })
  rfidTag: string | null;

  @Column({ name: 'barcode', type: 'varchar', nullable: true })
  barcode: string | null;

  @Column({ type: 'jsonb', nullable: true })
  currentLocation: {
    building: string;
    floor: string;
    zone: string;
    coordinates: { x: number; y: number; z: number };
    lastUpdated: string;
  } | null;

  @Column({ name: 'assigned_to_work_center', type: 'varchar', nullable: true })
  assignedToWorkCenter: string | null;

  @Column({ name: 'assigned_to_operator', type: 'varchar', nullable: true })
  assignedToOperator: string | null;

  @Column({ name: 'current_work_order', type: 'varchar', nullable: true })
  currentWorkOrder: string | null;

  @Column({ type: 'jsonb', nullable: true })
  locationHistory: {
    location: string;
    timestamp: string;
    movedBy: string;
    reason: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  usageHistory: {
    workOrderId: string;
    operatorId: string;
    startTime: string;
    endTime: string;
    duration: number;
  }[] | null;

  @Column({ name: 'total_usage_hours', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalUsageHours: number;

  @Column({ name: 'last_maintenance_date', type: 'date', nullable: true })
  lastMaintenanceDate: Date | null;

  @Column({ name: 'next_maintenance_date', type: 'date', nullable: true })
  nextMaintenanceDate: Date | null;

  @Column({ name: 'maintenance_interval_hours', type: 'int', nullable: true })
  maintenanceIntervalHours: number | null;

  @Column({ type: 'jsonb', nullable: true })
  specifications: {
    manufacturer: string;
    model: string;
    yearOfManufacture: number;
    capacity: string;
    dimensions: { length: number; width: number; height: number };
    weight: number;
    powerRequirements: string;
  } | null;

  @Column({ name: 'purchase_date', type: 'date', nullable: true })
  purchaseDate: Date | null;

  @Column({ name: 'purchase_cost', type: 'decimal', precision: 15, scale: 2, nullable: true })
  purchaseCost: number | null;

  @Column({ name: 'current_value', type: 'decimal', precision: 15, scale: 2, nullable: true })
  currentValue: number | null;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ name: 'depreciation_rate', type: 'decimal', precision: 5, scale: 2, nullable: true })
  depreciationRate: number | null;

  @Column({ name: 'warranty_expiry', type: 'date', nullable: true })
  warrantyExpiry: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  documents: {
    type: string;
    name: string;
    url: string;
    uploadedAt: string;
  }[] | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
