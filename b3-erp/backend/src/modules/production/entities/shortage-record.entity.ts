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

export type ShortageStatus = 'open' | 'resolved' | 'escalated' | 'cancelled';
export type ShortageSeverity = 'critical' | 'high' | 'medium' | 'low';

@Entity('production_shortage_records')
export class ShortageRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'shortage_number', unique: true })
  shortageNumber: string;

  @Column({ name: 'mrp_run_id', type: 'varchar', nullable: true })
  mrpRunId: string | null;

  @ManyToOne(() => MRPRun, { nullable: true })
  @JoinColumn({ name: 'mrp_run_id' })
  mrpRun: MRPRun;

  @Column({ type: 'varchar', length: 20, default: 'open' })
  status: ShortageStatus;

  @Column({ type: 'varchar', length: 20 })
  severity: ShortageSeverity;

  @Column({ name: 'item_id' })
  itemId: string;

  @Column({ name: 'item_code' })
  itemCode: string;

  @Column({ name: 'item_name' })
  itemName: string;

  @Column({ name: 'shortage_date', type: 'date' })
  shortageDate: Date;

  @Column({ name: 'required_quantity', type: 'decimal', precision: 15, scale: 4 })
  requiredQuantity: number;

  @Column({ name: 'available_quantity', type: 'decimal', precision: 15, scale: 4 })
  availableQuantity: number;

  @Column({ name: 'shortage_quantity', type: 'decimal', precision: 15, scale: 4 })
  shortageQuantity: number;

  @Column({ name: 'uom' })
  uom: string;

  @Column({ name: 'warehouse_id', type: 'varchar', nullable: true })
  warehouseId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  affectedOrders: {
    orderType: 'work_order' | 'sales_order' | 'production_order';
    orderId: string;
    orderNumber: string;
    impactedQuantity: number;
    dueDate: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  resolutionOptions: {
    option: string;
    description: string;
    leadTime: number;
    cost: number;
    isRecommended: boolean;
  }[] | null;

  @Column({ name: 'selected_resolution', type: 'varchar', nullable: true })
  selectedResolution: string | null;

  @Column({ name: 'resolution_notes', type: 'text', nullable: true })
  resolutionNotes: string | null;

  @Column({ name: 'resolved_by', type: 'varchar', nullable: true })
  resolvedBy: string | null;

  @Column({ name: 'resolved_at', type: 'timestamp', nullable: true })
  resolvedAt: Date | null;

  @Column({ name: 'escalated_to', type: 'varchar', nullable: true })
  escalatedTo: string | null;

  @Column({ name: 'escalated_at', type: 'timestamp', nullable: true })
  escalatedAt: Date | null;

  @Column({ name: 'estimated_impact_cost', type: 'decimal', precision: 15, scale: 2, nullable: true })
  estimatedImpactCost: number | null;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
