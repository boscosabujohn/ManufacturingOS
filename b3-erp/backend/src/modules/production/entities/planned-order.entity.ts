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

export type PlannedOrderStatus = 'planned' | 'firmed' | 'released' | 'cancelled';
export type PlannedOrderType = 'production' | 'purchase' | 'transfer';

@Entity('production_planned_orders')
export class PlannedOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'order_number', unique: true })
  orderNumber: string;

  @Column({ name: 'mrp_run_id', type: 'varchar', nullable: true })
  mrpRunId: string | null;

  @ManyToOne(() => MRPRun, { nullable: true })
  @JoinColumn({ name: 'mrp_run_id' })
  mrpRun: MRPRun;

  @Column({ name: 'order_type', type: 'varchar', length: 20 })
  orderType: PlannedOrderType;

  @Column({ type: 'varchar', length: 20, default: 'planned' })
  status: PlannedOrderStatus;

  @Column({ name: 'item_id' })
  itemId: string;

  @Column({ name: 'item_code' })
  itemCode: string;

  @Column({ name: 'item_name' })
  itemName: string;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  quantity: number;

  @Column({ name: 'uom' })
  uom: string;

  @Column({ name: 'planned_start_date', type: 'date' })
  plannedStartDate: Date;

  @Column({ name: 'planned_end_date', type: 'date' })
  plannedEndDate: Date;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: Date;

  @Column({ name: 'lead_time_days', type: 'int', default: 0 })
  leadTimeDays: number;

  @Column({ name: 'warehouse_id', type: 'varchar', nullable: true })
  warehouseId: string | null;

  @Column({ name: 'supplier_id', type: 'varchar', nullable: true })
  supplierId: string | null;

  @Column({ name: 'work_center_id', type: 'varchar', nullable: true })
  workCenterId: string | null;

  @Column({ name: 'bom_id', type: 'varchar', nullable: true })
  bomId: string | null;

  @Column({ name: 'routing_id', type: 'varchar', nullable: true })
  routingId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  demandSources: {
    type: 'work_order' | 'sales_order' | 'forecast' | 'safety_stock' | 'dependent_demand';
    sourceId: string;
    quantity: number;
    dueDate: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  pegging: {
    parentItemId: string;
    parentOrderId: string;
    quantity: number;
  }[] | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  estimatedCost: number | null;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ name: 'priority', type: 'int', default: 5 })
  priority: number;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'firmed_by', type: 'varchar', nullable: true })
  firmedBy: string | null;

  @Column({ name: 'firmed_at', type: 'timestamp', nullable: true })
  firmedAt: Date | null;

  @Column({ name: 'released_order_id', type: 'varchar', nullable: true })
  releasedOrderId: string | null;

  @Column({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
