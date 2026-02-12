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

export type SequenceStatus = 'pending' | 'in_queue' | 'processing' | 'completed' | 'on_hold';
export type SequencingRule = 'fifo' | 'spt' | 'edd' | 'critical_ratio' | 'slack' | 'priority';

@Entity('production_job_sequences')
export class JobSequence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'schedule_id', type: 'varchar', nullable: true })
  scheduleId: string | null;

  @ManyToOne(() => ProductionSchedule, { nullable: true })
  @JoinColumn({ name: 'schedule_id' })
  schedule: ProductionSchedule;

  @Column({ name: 'work_center_id' })
  workCenterId: string;

  @Column({ name: 'work_center_name' })
  workCenterName: string;

  @Column({ name: 'sequencing_rule', type: 'varchar', length: 20 })
  sequencingRule: SequencingRule;

  @Column({ name: 'sequence_date', type: 'date' })
  sequenceDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  jobs: {
    jobId: string;
    workOrderId: string;
    workOrderNumber: string;
    itemCode: string;
    itemName: string;
    operationId: string;
    sequenceNumber: number;
    priority: number;
    processingTime: number;
    setupTime: number;
    dueDate: string;
    slack: number;
    criticalRatio: number;
    status: string;
    startTime: string;
    endTime: string;
  }[] | null;

  @Column({ name: 'total_jobs', type: 'int', default: 0 })
  totalJobs: number;

  @Column({ name: 'total_processing_time', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalProcessingTime: number;

  @Column({ name: 'total_setup_time', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalSetupTime: number;

  @Column({ name: 'makespan', type: 'decimal', precision: 10, scale: 2, nullable: true })
  makespan: number | null;

  @Column({ name: 'average_flow_time', type: 'decimal', precision: 10, scale: 2, nullable: true })
  averageFlowTime: number | null;

  @Column({ name: 'average_lateness', type: 'decimal', precision: 10, scale: 2, nullable: true })
  averageLateness: number | null;

  @Column({ name: 'jobs_on_time', type: 'int', default: 0 })
  jobsOnTime: number;

  @Column({ name: 'jobs_late', type: 'int', default: 0 })
  jobsLate: number;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: SequenceStatus;

  @Column({ name: 'is_locked', type: 'boolean', default: false })
  isLocked: boolean;

  @Column({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
