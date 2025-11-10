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
import { BOMItem } from './bom-item.entity';

export enum BOMType {
  MANUFACTURE = 'Manufacture',
  ASSEMBLY = 'Assembly',
  KIT = 'Kit',
  DISASSEMBLY = 'Disassembly',
  PLANNING = 'Planning',
}

export enum BOMStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  OBSOLETE = 'Obsolete',
}

@Entity('boms')
export class BOM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  bomCode: string;

  @Column({ length: 255 })
  bomName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Item/Product details
  @Column()
  itemId: string;

  @Column({ length: 100 })
  itemCode: string;

  @Column({ length: 255 })
  itemName: string;

  @Column({ type: 'enum', enum: BOMType, default: BOMType.MANUFACTURE })
  bomType: BOMType;

  @Column({ type: 'enum', enum: BOMStatus, default: BOMStatus.DRAFT })
  status: BOMStatus;

  // Version control
  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ type: 'date', nullable: true })
  effectiveFrom: Date;

  @Column({ type: 'date', nullable: true })
  effectiveTo: Date;

  // Quantity and UOM
  @Column({ type: 'decimal', precision: 15, scale: 4, default: 1 })
  quantity: number;

  @Column({ length: 50, default: 'PCS' })
  uom: string;

  // Costing
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  materialCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  operationCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  overheadCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  costPerUnit: number;

  @Column({ type: 'timestamp', nullable: true })
  lastCostRollupDate: Date;

  // Production settings
  @Column({ type: 'int', default: 0 })
  leadTimeDays: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  scrapPercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  batchSize: number;

  @Column({ default: false })
  allowAlternativeItems: boolean;

  @Column({ default: false })
  requiresQualityInspection: boolean;

  // Routing
  @Column({ nullable: true })
  defaultRoutingId: string;

  @Column({ length: 100, nullable: true })
  defaultRoutingCode: string;

  // Reference
  @Column({ length: 100, nullable: true })
  drawingNumber: string;

  @Column({ length: 100, nullable: true })
  revision: string;

  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];

  // Workflow
  @Column({ length: 100, nullable: true })
  submittedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date;

  @Column({ length: 100, nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'text', nullable: true })
  approvalComments: string;

  // Additional fields
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

  // Metadata
  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => BOMItem, (bomItem) => bomItem.bom, { cascade: true })
  items: BOMItem[];
}
