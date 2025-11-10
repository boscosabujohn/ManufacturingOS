import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BOM } from './bom.entity';

export enum BOMItemType {
  COMPONENT = 'Component',
  SUB_ASSEMBLY = 'Sub-Assembly',
  CONSUMABLE = 'Consumable',
  SCRAP = 'Scrap',
  CO_PRODUCT = 'Co-Product',
  BY_PRODUCT = 'By-Product',
}

export enum SupplyType {
  PURCHASE = 'Purchase',
  MANUFACTURE = 'Manufacture',
  TRANSFER = 'Transfer',
  CUSTOMER_PROVIDED = 'Customer Provided',
}

@Entity('bom_items')
export class BOMItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Parent BOM
  @Column()
  bomId: string;

  @ManyToOne(() => BOM, (bom) => bom.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bomId' })
  bom: BOM;

  // Item details
  @Column()
  itemId: string;

  @Column({ length: 100 })
  itemCode: string;

  @Column({ length: 255 })
  itemName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: BOMItemType, default: BOMItemType.COMPONENT })
  itemType: BOMItemType;

  @Column({ type: 'enum', enum: SupplyType, default: SupplyType.PURCHASE })
  supplyType: SupplyType;

  // Sequence and hierarchy
  @Column({ type: 'int', default: 0 })
  sequenceNumber: number;

  @Column({ nullable: true })
  parentItemId: string;

  @Column({ type: 'int', default: 0 })
  level: number;

  // Quantity
  @Column({ type: 'decimal', precision: 15, scale: 4 })
  quantity: number;

  @Column({ length: 50, default: 'PCS' })
  uom: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  scrapPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  netQuantity: number; // quantity * (1 + scrapPercentage/100)

  // Costing
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  unitCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCost: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  costAllocationPercentage: number;

  // Consumption tracking
  @Column({ default: true })
  trackConsumption: boolean;

  @Column({ default: false })
  backflush: boolean; // Auto-consume when operation completes

  @Column({ nullable: true })
  operationId: string; // Operation at which this item is consumed

  @Column({ length: 100, nullable: true })
  operationCode: string;

  // Alternative items
  @Column({ default: false })
  hasAlternatives: boolean;

  @Column({ type: 'json', nullable: true })
  alternatives: {
    itemId: string;
    itemCode: string;
    itemName: string;
    conversionFactor: number;
    priority: number;
  }[];

  // Sourcing
  @Column({ nullable: true })
  preferredVendorId: string;

  @Column({ length: 255, nullable: true })
  preferredVendorName: string;

  @Column({ type: 'int', default: 0 })
  leadTimeDays: number;

  // Quality
  @Column({ default: false })
  requiresInspection: boolean;

  @Column({ nullable: true })
  qcTemplateId: string;

  // Reference
  @Column({ length: 100, nullable: true })
  referenceDesignator: string;

  @Column({ length: 100, nullable: true })
  findNumber: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Effective dates
  @Column({ type: 'date', nullable: true })
  effectiveFrom: Date;

  @Column({ type: 'date', nullable: true })
  effectiveTo: Date;

  @Column({ default: true })
  isActive: boolean;

  // Metadata
  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
