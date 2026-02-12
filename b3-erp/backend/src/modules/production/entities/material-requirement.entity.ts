import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MRPRun } from './mrp-run.entity';

export type RequirementType = 'independent' | 'dependent';
export type RequirementSource = 'sales_order' | 'work_order' | 'forecast' | 'safety_stock' | 'manual';

@Entity('production_material_requirements')
export class MaterialRequirement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'mrp_run_id', type: 'varchar', nullable: true })
  mrpRunId: string | null;

  @ManyToOne(() => MRPRun, { nullable: true })
  @JoinColumn({ name: 'mrp_run_id' })
  mrpRun: MRPRun;

  @Column({ name: 'item_id' })
  itemId: string;

  @Column({ name: 'item_code' })
  itemCode: string;

  @Column({ name: 'item_name' })
  itemName: string;

  @Column({ name: 'requirement_type', type: 'varchar', length: 20 })
  requirementType: RequirementType;

  @Column({ name: 'requirement_source', type: 'varchar', length: 20 })
  requirementSource: RequirementSource;

  @Column({ name: 'source_document_id', type: 'varchar', nullable: true })
  sourceDocumentId: string | null;

  @Column({ name: 'source_document_number', type: 'varchar', nullable: true })
  sourceDocumentNumber: string | null;

  @Column({ name: 'required_date', type: 'date' })
  requiredDate: Date;

  @Column({ name: 'gross_requirement', type: 'decimal', precision: 15, scale: 4 })
  grossRequirement: number;

  @Column({ name: 'scheduled_receipts', type: 'decimal', precision: 15, scale: 4, default: 0 })
  scheduledReceipts: number;

  @Column({ name: 'projected_available', type: 'decimal', precision: 15, scale: 4, default: 0 })
  projectedAvailable: number;

  @Column({ name: 'net_requirement', type: 'decimal', precision: 15, scale: 4, default: 0 })
  netRequirement: number;

  @Column({ name: 'planned_order_receipt', type: 'decimal', precision: 15, scale: 4, default: 0 })
  plannedOrderReceipt: number;

  @Column({ name: 'planned_order_release', type: 'decimal', precision: 15, scale: 4, default: 0 })
  plannedOrderRelease: number;

  @Column({ name: 'uom' })
  uom: string;

  @Column({ name: 'warehouse_id', type: 'varchar', nullable: true })
  warehouseId: string | null;

  @Column({ name: 'on_hand_quantity', type: 'decimal', precision: 15, scale: 4, default: 0 })
  onHandQuantity: number;

  @Column({ name: 'safety_stock', type: 'decimal', precision: 15, scale: 4, default: 0 })
  safetyStock: number;

  @Column({ name: 'lead_time_days', type: 'int', default: 0 })
  leadTimeDays: number;

  @Column({ name: 'lot_size_type', type: 'varchar', length: 20, default: 'lot_for_lot' })
  lotSizeType: string;

  @Column({ name: 'lot_size_quantity', type: 'decimal', precision: 15, scale: 4, nullable: true })
  lotSizeQuantity: number | null;

  @Column({ name: 'low_level_code', type: 'int', default: 0 })
  lowLevelCode: number;

  @Column({ type: 'jsonb', nullable: true })
  pegging: {
    parentItemId: string;
    parentItemCode: string;
    quantity: number;
    workOrderId: string;
  }[] | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
