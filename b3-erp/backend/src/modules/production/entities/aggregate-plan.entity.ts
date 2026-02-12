import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type AggregatePlanStatus = 'draft' | 'active' | 'approved' | 'archived';
export type PlanningStrategy = 'chase' | 'level' | 'hybrid';

@Entity('production_aggregate_plans')
export class AggregatePlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'plan_number', unique: true })
  planNumber: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: AggregatePlanStatus;

  @Column({ name: 'planning_strategy', type: 'varchar', length: 20 })
  planningStrategy: PlanningStrategy;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  periodData: {
    period: string;
    demand: number;
    production: number;
    inventory: number;
    backlog: number;
    workforce: number;
    overtime: number;
    subcontracting: number;
  }[] | null;

  @Column({ name: 'total_demand', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalDemand: number;

  @Column({ name: 'total_production', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalProduction: number;

  @Column({ name: 'ending_inventory', type: 'decimal', precision: 15, scale: 2, default: 0 })
  endingInventory: number;

  @Column({ type: 'jsonb', nullable: true })
  costs: {
    regularLaborCost: number;
    overtimeCost: number;
    inventoryHoldingCost: number;
    backlogCost: number;
    hiringCost: number;
    firingCost: number;
    subcontractingCost: number;
    totalCost: number;
  } | null;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'jsonb', nullable: true })
  constraints: {
    maxWorkforce: number;
    maxOvertime: number;
    maxInventory: number;
    minInventory: number;
    maxSubcontracting: number;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  scenarios: {
    name: string;
    totalCost: number;
    description: string;
    isSelected: boolean;
  }[] | null;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'approved_by', type: 'varchar', nullable: true })
  approvedBy: string | null;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
