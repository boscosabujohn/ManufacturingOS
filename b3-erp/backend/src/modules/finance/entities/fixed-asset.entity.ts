import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum AssetStatus {
  ACTIVE = 'Active',
  UNDER_MAINTENANCE = 'Under Maintenance',
  DISPOSED = 'Disposed',
  SOLD = 'Sold',
  WRITTEN_OFF = 'Written Off',
  RETIRED = 'Retired',
}

export enum DepreciationMethod {
  STRAIGHT_LINE = 'Straight Line',
  WRITTEN_DOWN_VALUE = 'Written Down Value (Reducing Balance)',
  DOUBLE_DECLINING = 'Double Declining Balance',
  UNITS_OF_PRODUCTION = 'Units of Production',
  SUM_OF_YEARS_DIGITS = 'Sum of Years Digits',
}

@Entity('fixed_assets')
export class FixedAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  assetCode: string;

  @Column({ length: 255 })
  assetName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Classification
  @Column({ length: 100 })
  assetCategory: string; // Land, Building, Machinery, Vehicles, etc.

  @Column({ length: 100, nullable: true })
  assetSubCategory: string;

  @Column({ nullable: true })
  glAccountId: string; // Link to Chart of Accounts

  // Acquisition details
  @Column({ type: 'date' })
  acquisitionDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  acquisitionCost: number;

  @Column({ nullable: true, length: 100 })
  supplier: string;

  @Column({ nullable: true, length: 100 })
  invoiceNumber: string;

  @Column({ nullable: true, length: 100 })
  poNumber: string;

  // Depreciation settings
  @Column({
    type: 'enum',
    enum: DepreciationMethod,
    default: DepreciationMethod.STRAIGHT_LINE,
  })
  depreciationMethod: DepreciationMethod;

  @Column({ type: 'int' })
  usefulLifeYears: number;

  @Column({ type: 'int', default: 12 })
  usefulLifeMonths: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  depreciationRate: number; // Annual depreciation rate %

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  salvageValue: number;

  // Depreciation tracking
  @Column({ type: 'date' })
  depreciationStartDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  accumulatedDepreciation: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  netBookValue: number;

  @Column({ type: 'date', nullable: true })
  lastDepreciationDate: Date;

  @Column({ type: 'date', nullable: true })
  nextDepreciationDate: Date;

  // Location and assignment
  @Column({ nullable: true, length: 100 })
  location: string;

  @Column({ nullable: true, length: 100 })
  department: string;

  @Column({ nullable: true, length: 100 })
  costCenter: string;

  @Column({ nullable: true })
  assignedToEmployeeId: string;

  @Column({ nullable: true, length: 255 })
  assignedToEmployeeName: string;

  // Physical details
  @Column({ nullable: true, length: 100 })
  manufacturer: string;

  @Column({ nullable: true, length: 100 })
  model: string;

  @Column({ nullable: true, length: 100 })
  serialNumber: string;

  @Column({ nullable: true, length: 100 })
  barcode: string;

  // Status
  @Column({
    type: 'enum',
    enum: AssetStatus,
    default: AssetStatus.ACTIVE,
  })
  status: AssetStatus;

  @Column({ default: true })
  isDepreciable: boolean;

  // Warranty
  @Column({ type: 'date', nullable: true })
  warrantyStartDate: Date;

  @Column({ type: 'date', nullable: true })
  warrantyEndDate: Date;

  @Column({ nullable: true, length: 255 })
  warrantyProvider: string;

  // Insurance
  @Column({ default: false })
  isInsured: boolean;

  @Column({ nullable: true, length: 255 })
  insuranceProvider: string;

  @Column({ nullable: true, length: 100 })
  insurancePolicyNumber: string;

  @Column({ type: 'date', nullable: true })
  insuranceExpiryDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  insuredValue: number;

  // Disposal details
  @Column({ type: 'date', nullable: true })
  disposalDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  disposalAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  gainLossOnDisposal: number;

  @Column({ type: 'text', nullable: true })
  disposalReason: string;

  // Attachments
  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AssetDepreciation, (depreciation) => depreciation.asset)
  depreciationHistory: AssetDepreciation[];

  @OneToMany(() => AssetMaintenance, (maintenance) => maintenance.asset)
  maintenanceHistory: AssetMaintenance[];
}

@Entity('asset_depreciation')
export class AssetDepreciation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  assetId: string;

  @ManyToOne(() => FixedAsset, (asset) => asset.depreciationHistory)
  @JoinColumn({ name: 'assetId' })
  asset: FixedAsset;

  @Column({ length: 50 })
  depreciationNumber: string;

  @Column()
  periodId: string;

  @Column({ type: 'date' })
  depreciationDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  depreciationAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  openingBookValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  closingBookValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  accumulatedDepreciation: number;

  @Column({ nullable: true })
  journalEntryId: string;

  @Column({ default: false })
  isPosted: boolean;

  @Column({ nullable: true })
  postedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  postedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('asset_maintenance')
export class AssetMaintenance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  assetId: string;

  @ManyToOne(() => FixedAsset, (asset) => asset.maintenanceHistory)
  @JoinColumn({ name: 'assetId' })
  asset: FixedAsset;

  @Column({ length: 50, unique: true })
  maintenanceNumber: string;

  @Column({ type: 'date' })
  maintenanceDate: Date;

  @Column({ length: 100 })
  maintenanceType: string; // Preventive, Corrective, Breakdown

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true, length: 255 })
  serviceProvider: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  cost: number;

  @Column({ nullable: true, length: 100 })
  invoiceNumber: string;

  @Column({ type: 'date', nullable: true })
  nextMaintenanceDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true, length: 100 })
  performedBy: string;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
