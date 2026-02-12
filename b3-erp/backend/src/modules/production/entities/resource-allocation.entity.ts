import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductionSchedule } from './production-schedule.entity';

export type AllocationStatus = 'allocated' | 'in_use' | 'released' | 'unavailable';
export type ResourceType = 'machine' | 'labor' | 'tool' | 'material';

@Entity('production_resource_allocations')
export class ResourceAllocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'schedule_id', type: 'varchar', nullable: true })
  scheduleId: string | null;

  @ManyToOne(() => ProductionSchedule, { nullable: true })
  @JoinColumn({ name: 'schedule_id' })
  schedule: ProductionSchedule;

  @Column({ name: 'work_order_id', type: 'varchar', nullable: true })
  workOrderId: string | null;

  @Column({ name: 'operation_id', type: 'varchar', nullable: true })
  operationId: string | null;

  @Column({ name: 'resource_type', type: 'varchar', length: 20 })
  resourceType: ResourceType;

  @Column({ name: 'resource_id' })
  resourceId: string;

  @Column({ name: 'resource_name' })
  resourceName: string;

  @Column({ type: 'varchar', length: 20, default: 'allocated' })
  status: AllocationStatus;

  @Column({ name: 'start_time', type: 'timestamp' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp' })
  endTime: Date;

  @Column({ name: 'allocated_hours', type: 'decimal', precision: 10, scale: 2 })
  allocatedHours: number;

  @Column({ name: 'actual_hours', type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualHours: number | null;

  @Column({ name: 'quantity', type: 'decimal', precision: 15, scale: 4, default: 1 })
  quantity: number;

  @Column({ name: 'uom', type: 'varchar', nullable: true })
  uom: string | null;

  @Column({ name: 'cost_per_hour', type: 'decimal', precision: 10, scale: 2, nullable: true })
  costPerHour: number | null;

  @Column({ name: 'total_cost', type: 'decimal', precision: 15, scale: 2, nullable: true })
  totalCost: number | null;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ name: 'priority', type: 'int', default: 5 })
  priority: number;

  @Column({ name: 'is_overtime', type: 'boolean', default: false })
  isOvertime: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'allocated_by' })
  allocatedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
