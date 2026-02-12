import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type MasterScheduleStatus = 'draft' | 'released' | 'frozen' | 'closed';

@Entity('production_master_schedules')
export class MasterSchedule {
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

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: MasterScheduleStatus;

  @Column({ name: 'planning_horizon_weeks', type: 'int', default: 16 })
  planningHorizonWeeks: number;

  @Column({ name: 'frozen_horizon_weeks', type: 'int', default: 4 })
  frozenHorizonWeeks: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  scheduleItems: {
    itemId: string;
    itemCode: string;
    itemName: string;
    weeklySchedule: {
      week: number;
      weekStart: string;
      grossRequirements: number;
      scheduledReceipts: number;
      projectedAvailable: number;
      netRequirements: number;
      plannedOrderReceipt: number;
      plannedOrderRelease: number;
      mpsQuantity: number;
      availableToPromise: number;
    }[];
    totalMpsQuantity: number;
    totalAtp: number;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  demandSources: {
    type: 'sales_order' | 'forecast' | 'safety_stock' | 'interplant';
    sourceId: string;
    quantity: number;
    dueDate: string;
  }[] | null;

  @Column({ name: 'time_fence_days', type: 'int', default: 30 })
  timeFenceDays: number;

  @Column({ name: 'planning_time_fence_days', type: 'int', default: 60 })
  planningTimeFenceDays: number;

  @Column({ type: 'jsonb', nullable: true })
  exceptions: {
    type: string;
    itemId: string;
    message: string;
    severity: 'warning' | 'error';
    week: number;
  }[] | null;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'released_by', type: 'varchar', nullable: true })
  releasedBy: string | null;

  @Column({ name: 'released_at', type: 'timestamp', nullable: true })
  releasedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
