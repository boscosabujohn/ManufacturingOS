import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type MRPRunStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
export type MRPRunType = 'regenerative' | 'net_change' | 'selective';

@Entity('production_mrp_runs')
export class MRPRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'run_number', unique: true })
  runNumber: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'run_type', type: 'varchar', length: 20 })
  runType: MRPRunType;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: MRPRunStatus;

  @Column({ name: 'planning_horizon_days', type: 'int', default: 90 })
  planningHorizonDays: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ name: 'run_started_at', type: 'timestamp', nullable: true })
  runStartedAt: Date | null;

  @Column({ name: 'run_completed_at', type: 'timestamp', nullable: true })
  runCompletedAt: Date | null;

  @Column({ name: 'items_processed', type: 'int', default: 0 })
  itemsProcessed: number;

  @Column({ name: 'planned_orders_created', type: 'int', default: 0 })
  plannedOrdersCreated: number;

  @Column({ name: 'action_messages_generated', type: 'int', default: 0 })
  actionMessagesGenerated: number;

  @Column({ type: 'jsonb', nullable: true })
  parameters: {
    includeSafetyStock: boolean;
    includeLeadTimeOffset: boolean;
    considerAlternates: boolean;
    lowLevelCodeRecalc: boolean;
    peggingEnabled: boolean;
    firmPlannedOrders: boolean;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  filters: {
    itemIds: string[];
    itemGroups: string[];
    warehouses: string[];
    planners: string[];
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  summary: {
    totalRequirements: number;
    totalPlannedOrders: number;
    totalPurchaseRequisitions: number;
    totalReschedulingActions: number;
    totalCancellationActions: number;
    exceptions: number;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  errors: {
    itemId: string;
    errorCode: string;
    message: string;
    timestamp: string;
  }[] | null;

  @Column({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
