import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('stock_balances')
@Index(['itemId', 'warehouseId', 'locationId'], { unique: true })
@Index(['itemId', 'warehouseId', 'batchId'])
@Index(['itemId', 'warehouseId'])
export class StockBalance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Item details
  @Column()
  itemId: string;

  @Column({ length: 100 })
  itemCode: string;

  @Column({ length: 255 })
  itemName: string;

  @Column({ length: 100, nullable: true })
  itemCategory: string;

  @Column({ length: 100, nullable: true })
  itemGroup: string;

  // Location details
  @Column()
  warehouseId: string;

  @Column({ length: 255 })
  warehouseName: string;

  @Column({ nullable: true })
  locationId: string;

  @Column({ length: 255, nullable: true })
  locationName: string;

  // Batch/Serial tracking
  @Column({ nullable: true })
  batchId: string;

  @Column({ length: 100, nullable: true })
  batchNumber: string;

  @Column({ nullable: true })
  serialNumberId: string;

  @Column({ length: 100, nullable: true })
  serialNumber: string;

  // Quantity tracking
  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  availableQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  reservedQuantity: number; // Reserved for orders

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  inQualityInspection: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  quarantineQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  damageQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  inTransitQuantity: number; // In transfer between warehouses

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  committedQuantity: number; // Committed to production/sales

  @Column({ length: 50 })
  uom: string;

  // Calculated fields
  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  totalQuantity: number; // Sum of all quantities

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  freeQuantity: number; // Available - Reserved - Committed

  // Valuation
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  valuationRate: number; // Current valuation rate

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  stockValue: number; // Total stock value

  @Column({ length: 50, default: 'Weighted Average' })
  valuationMethod: string; // FIFO, LIFO, Weighted Average, Moving Average

  @Column({ default: 'INR', length: 3 })
  currency: string;

  // Reorder management
  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  reorderLevel: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  reorderQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  minimumOrderQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  maximumOrderQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  safetyStock: number;

  @Column({ default: false })
  belowReorderLevel: boolean;

  // Aging information
  @Column({ type: 'date', nullable: true })
  firstReceiptDate: Date; // Date of first receipt

  @Column({ type: 'date', nullable: true })
  lastReceiptDate: Date; // Date of last receipt

  @Column({ type: 'date', nullable: true })
  lastIssueDate: Date; // Date of last issue

  @Column({ type: 'int', nullable: true })
  daysInStock: number; // Days since first receipt

  @Column({ type: 'int', nullable: true })
  daysSinceLastMovement: number;

  // Stock status
  @Column({ default: false })
  isSlowMoving: boolean; // No movement in X days

  @Column({ default: false })
  isNonMoving: boolean; // No movement in Y days (Y > X)

  @Column({ default: false })
  isObsolete: boolean;

  @Column({ default: false })
  isExpired: boolean; // For batch-tracked items

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  // ABC Classification
  @Column({ length: 10, nullable: true })
  abcClassification: string; // A, B, C based on value/movement

  @Column({ length: 50, nullable: true })
  velocityClassification: string; // Fast, Medium, Slow

  // Cycle count
  @Column({ nullable: true })
  lastCycleCountDate: Date;

  @Column({ nullable: true })
  nextCycleCountDate: Date;

  @Column({ type: 'int', default: 0 })
  cycleCountFrequency: number; // Days

  // Project/Cost Center allocation
  @Column({ nullable: true })
  projectId: string;

  @Column({ length: 255, nullable: true })
  projectName: string;

  @Column({ nullable: true })
  costCenterId: string;

  @Column({ length: 255, nullable: true })
  costCenterName: string;

  // Ownership
  @Column({ nullable: true })
  ownerId: string; // For consignment stock

  @Column({ length: 255, nullable: true })
  ownerName: string;

  @Column({ default: 'Own Stock' })
  ownershipType: string; // Own Stock, Consignment, Customer Owned

  // Additional tracking
  @Column({ nullable: true })
  lastStockEntryId: string;

  @Column({ nullable: true })
  lastStockEntryNumber: string;

  @Column({ type: 'timestamp', nullable: true })
  lastUpdatedTime: Date;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
