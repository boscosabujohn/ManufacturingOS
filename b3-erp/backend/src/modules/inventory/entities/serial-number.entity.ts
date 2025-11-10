import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum SerialNumberStatus {
  AVAILABLE = 'Available',
  IN_STORE = 'In Store',
  ISSUED = 'Issued',
  IN_TRANSIT = 'In Transit',
  INSTALLED = 'Installed',
  IN_SERVICE = 'In Service',
  UNDER_REPAIR = 'Under Repair',
  QUARANTINE = 'Quarantine',
  RETURNED = 'Returned',
  SCRAPPED = 'Scrapped',
  SOLD = 'Sold',
  EXPIRED = 'Expired',
}

@Entity('serial_numbers')
@Index(['serialNumber'], { unique: true })
@Index(['itemId', 'status'])
@Index(['warehouseId', 'status'])
export class SerialNumber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  serialNumber: string;

  // Item details
  @Column()
  itemId: string;

  @Column({ length: 100 })
  itemCode: string;

  @Column({ length: 255 })
  itemName: string;

  // Current location
  @Column({ nullable: true })
  warehouseId: string;

  @Column({ length: 255, nullable: true })
  warehouseName: string;

  @Column({ nullable: true })
  locationId: string;

  @Column({ length: 255, nullable: true })
  locationName: string;

  // Status
  @Column({
    type: 'enum',
    enum: SerialNumberStatus,
    default: SerialNumberStatus.AVAILABLE,
  })
  status: SerialNumberStatus;

  // Batch association (optional)
  @Column({ nullable: true })
  batchId: string;

  @Column({ length: 100, nullable: true })
  batchNumber: string;

  // Procurement details
  @Column({ nullable: true })
  purchaseOrderId: string;

  @Column({ length: 100, nullable: true })
  purchaseOrderNumber: string;

  @Column({ nullable: true })
  supplierId: string;

  @Column({ length: 255, nullable: true })
  supplierName: string;

  @Column({ type: 'date', nullable: true })
  purchaseDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  purchasePrice: number;

  @Column({ default: 'INR', length: 3 })
  currency: string;

  // Manufacturing details
  @Column({ type: 'date', nullable: true })
  manufacturingDate: Date;

  @Column({ length: 100, nullable: true })
  manufacturerName: string;

  @Column({ length: 100, nullable: true })
  manufacturerPartNumber: string;

  @Column({ length: 100, nullable: true })
  modelNumber: string;

  // Receipt into inventory
  @Column({ type: 'date', nullable: true })
  receiptDate: Date;

  @Column({ nullable: true })
  receiptStockEntryId: string;

  @Column({ length: 100, nullable: true })
  receiptStockEntryNumber: string;

  // Warranty
  @Column({ type: 'date', nullable: true })
  warrantyStartDate: Date;

  @Column({ type: 'date', nullable: true })
  warrantyEndDate: Date;

  @Column({ type: 'int', nullable: true })
  warrantyPeriodMonths: number;

  @Column({ default: false })
  isUnderWarranty: boolean;

  // Expiry (for items with limited life)
  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ default: false })
  isExpired: boolean;

  // Sales/Issue details
  @Column({ nullable: true })
  customerId: string;

  @Column({ length: 255, nullable: true })
  customerName: string;

  @Column({ nullable: true })
  salesOrderId: string;

  @Column({ length: 100, nullable: true })
  salesOrderNumber: string;

  @Column({ type: 'date', nullable: true })
  salesDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  salesPrice: number;

  @Column({ nullable: true })
  issueStockEntryId: string;

  @Column({ length: 100, nullable: true })
  issueStockEntryNumber: string;

  // Installation details (for installed equipment)
  @Column({ default: false })
  isInstalled: boolean;

  @Column({ type: 'date', nullable: true })
  installationDate: Date;

  @Column({ type: 'text', nullable: true })
  installationLocation: string;

  @Column({ nullable: true })
  installedBy: string;

  @Column({ length: 100, nullable: true })
  installedByName: string;

  // Service and maintenance
  @Column({ type: 'date', nullable: true })
  lastServiceDate: Date;

  @Column({ type: 'date', nullable: true })
  nextServiceDate: Date;

  @Column({ type: 'int', default: 0 })
  serviceCount: number;

  @Column({ type: 'json', nullable: true })
  serviceHistory: {
    serviceDate: Date;
    serviceType: string;
    servicedBy: string;
    cost: number;
    remarks: string;
  }[];

  // Asset details (if tracked as fixed asset)
  @Column({ default: false })
  isFixedAsset: boolean;

  @Column({ nullable: true })
  assetId: string;

  @Column({ length: 100, nullable: true })
  assetTag: string;

  // Ownership
  @Column({ default: 'Own' })
  ownershipType: string; // Own, Leased, Rented, Consignment

  @Column({ nullable: true })
  ownerId: string;

  @Column({ length: 255, nullable: true })
  ownerName: string;

  // Quality status
  @Column({ length: 50, nullable: true })
  qualityStatus: string; // Passed, Failed, Pending Inspection

  @Column({ nullable: true })
  qualityInspectionId: string;

  @Column({ type: 'date', nullable: true })
  qualityInspectionDate: Date;

  // Project/Cost Center allocation
  @Column({ nullable: true })
  projectId: string;

  @Column({ length: 255, nullable: true })
  projectName: string;

  @Column({ nullable: true })
  costCenterId: string;

  @Column({ length: 255, nullable: true })
  costCenterName: string;

  // Additional attributes
  @Column({ type: 'json', nullable: true })
  customAttributes: {
    attributeName: string;
    attributeValue: string;
  }[];

  // QR Code/Barcode
  @Column({ length: 255, nullable: true })
  barcode: string;

  @Column({ type: 'text', nullable: true })
  qrCode: string; // QR code data

  // Tracking
  @Column({ nullable: true })
  currentHolderId: string; // Employee/customer holding the item

  @Column({ length: 255, nullable: true })
  currentHolderName: string;

  @Column({ nullable: true })
  lastMovementId: string; // Last stock entry ID

  @Column({ type: 'timestamp', nullable: true })
  lastMovementDate: Date;

  // Notes
  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
