import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ItemType {
  RAW_MATERIAL = 'Raw Material',
  SEMI_FINISHED = 'Semi-Finished Good',
  FINISHED_GOOD = 'Finished Good',
  SERVICE = 'Service',
  CONSUMABLE = 'Consumable',
  ASSET = 'Asset',
  SPARE_PART = 'Spare Part',
}

export enum ItemStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DISCONTINUED = 'Discontinued',
  OBSOLETE = 'Obsolete',
}

export enum ValuationMethod {
  FIFO = 'FIFO',
  LIFO = 'LIFO',
  WEIGHTED_AVERAGE = 'Weighted Average',
  STANDARD_COST = 'Standard Cost',
}

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  itemCode: string;

  @Column({ length: 255 })
  itemName: string;

  @Column({ length: 255, nullable: true })
  itemDescription: string;

  @Column({
    type: 'enum',
    enum: ItemType,
    default: ItemType.RAW_MATERIAL,
  })
  itemType: ItemType;

  @Column({
    type: 'enum',
    enum: ItemStatus,
    default: ItemStatus.ACTIVE,
  })
  status: ItemStatus;

  // Classification
  @Column({ length: 100, nullable: true })
  category: string;

  @Column({ length: 100, nullable: true })
  subCategory: string;

  @Column({ length: 100, nullable: true })
  brand: string;

  @Column({ length: 100, nullable: true })
  manufacturer: string;

  // Identification
  @Column({ length: 100, nullable: true })
  barcode: string;

  @Column({ length: 100, nullable: true })
  sku: string;

  @Column({ length: 100, nullable: true })
  hsnCode: string; // HSN/SAC code for GST

  // Unit of Measure
  @Column({ length: 50, default: 'PCS' })
  baseUOM: string;

  @Column({ type: 'json', nullable: true })
  alternateUOMs: {
    uom: string;
    conversionFactor: number;
    barcode?: string;
  }[];

  // Inventory Settings
  @Column({ default: true })
  maintainStock: boolean;

  @Column({ default: true })
  trackSerialNumber: boolean;

  @Column({ default: false })
  trackBatchNumber: boolean;

  @Column({ default: false })
  trackExpiryDate: boolean;

  // Stock Levels
  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  currentStock: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  reorderLevel: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  reorderQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  minimumOrderQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  maximumStock: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  safetyStock: number;

  @Column({ type: 'int', default: 0 })
  leadTimeDays: number;

  // Pricing
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  standardCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  averageCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  lastPurchasePrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  standardSellingPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  minimumSellingPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  maximumSellingPrice: number;

  @Column({
    type: 'enum',
    enum: ValuationMethod,
    default: ValuationMethod.WEIGHTED_AVERAGE,
  })
  valuationMethod: ValuationMethod;

  // Tax Information
  @Column({ default: false })
  isTaxable: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate: number;

  @Column({ length: 50, nullable: true })
  taxCategory: string;

  @Column({ length: 100, nullable: true })
  gstSlabCode: string;

  // Physical Attributes
  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  weight: number;

  @Column({ length: 20, default: 'kg' })
  weightUOM: string;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  length: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  width: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  height: number;

  @Column({ length: 20, default: 'cm' })
  dimensionUOM: string;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  volume: number;

  // Quality Control
  @Column({ default: false })
  requiresQualityInspection: boolean;

  @Column({ nullable: true })
  qcTemplateId: string;

  @Column({ type: 'int', default: 0 })
  shelfLifeDays: number;

  @Column({ type: 'int', default: 0 })
  warrantyDays: number;

  // Suppliers
  @Column({ nullable: true })
  preferredVendorId: string;

  @Column({ length: 255, nullable: true })
  preferredVendorName: string;

  @Column({ type: 'json', nullable: true })
  approvedVendors: {
    vendorId: string;
    vendorName: string;
    vendorItemCode: string;
    unitPrice: number;
    leadTimeDays: number;
    isPrimary: boolean;
  }[];

  // Manufacturing
  @Column({ default: false })
  isManufactured: boolean;

  @Column({ default: false })
  isPurchased: boolean;

  @Column({ default: false })
  isSold: boolean;

  @Column({ nullable: true })
  defaultBOMId: string;

  @Column({ nullable: true })
  defaultRoutingId: string;

  // GL Account Mapping
  @Column({ nullable: true })
  inventoryAccountId: string;

  @Column({ nullable: true })
  cogsAccountId: string;

  @Column({ nullable: true })
  salesAccountId: string;

  @Column({ nullable: true })
  purchaseAccountId: string;

  // Images and Documents
  @Column({ length: 500, nullable: true })
  primaryImageUrl: string;

  @Column({ type: 'json', nullable: true })
  images: {
    url: string;
    isPrimary: boolean;
    caption?: string;
  }[];

  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];

  // Sales & Purchase
  @Column({ default: true })
  allowSales: boolean;

  @Column({ default: true })
  allowPurchase: boolean;

  @Column({ default: false })
  isStockItem: boolean;

  @Column({ default: false })
  isFixedAsset: boolean;

  // Additional Information
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  specifications: {
    name: string;
    value: string;
    unit?: string;
  }[];

  // Statistics (calculated fields)
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalStockValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  ytdSalesQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  ytdSalesValue: number;

  @Column({ type: 'timestamp', nullable: true })
  lastSaleDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastPurchaseDate: Date;

  // Metadata
  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual fields
  stockStatus?: string;
  needsReorder?: boolean;
  availableStock?: number;
}
