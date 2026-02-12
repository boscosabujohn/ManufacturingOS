import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ScheduleStatus = 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled';
export type ScheduleType = 'daily' | 'weekly' | 'monthly' | 'custom';

@Entity('production_schedules')
export class ProductionSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'schedule_number', unique: true })
  scheduleNumber: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'schedule_type', type: 'varchar', length: 20 })
  scheduleType: ScheduleType;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: ScheduleStatus;

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp' })
  endDate: Date;

  @Column({ name: 'production_line_id', type: 'varchar', nullable: true })
  productionLineId: string | null;

  @Column({ name: 'work_center_id', type: 'varchar', nullable: true })
  workCenterId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  scheduleItems: {
    itemId: string;
    workOrderId: string;
    workOrderNumber: string;
    itemCode: string;
    itemName: string;
    quantity: number;
    startTime: string;
    endTime: string;
    duration: number;
    operationId: string;
    resourceId: string;
    status: string;
    sequence: number;
  }[] | null;

  @Column({ name: 'total_scheduled_hours', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalScheduledHours: number;

  @Column({ name: 'total_work_orders', type: 'int', default: 0 })
  totalWorkOrders: number;

  @Column({ name: 'utilization_percentage', type: 'decimal', precision: 5, scale: 2, default: 0 })
  utilizationPercentage: number;

  @Column({ type: 'jsonb', nullable: true })
  resourceAllocations: {
    resourceId: string;
    resourceType: string;
    resourceName: string;
    allocatedHours: number;
    availableHours: number;
    utilization: number;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  conflicts: {
    type: string;
    description: string;
    affectedItems: string[];
    resolution: string;
  }[] | null;

  @Column({ name: 'is_optimized', type: 'boolean', default: false })
  isOptimized: boolean;

  @Column({ name: 'optimization_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  optimizationScore: number | null;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'published_by', type: 'varchar', nullable: true })
  publishedBy: string | null;

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  publishedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
