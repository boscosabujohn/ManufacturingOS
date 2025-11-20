import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WorkflowInstance } from './workflow-instance.entity';

export enum StepStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
  WAITING = 'waiting',
}

export enum StepType {
  ACTION = 'action',
  CONDITION = 'condition',
  APPROVAL = 'approval',
  NOTIFICATION = 'notification',
  INTEGRATION = 'integration',
  WAIT = 'wait',
}

@Entity('workflow_steps')
export class WorkflowStep {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  instanceId: string;

  @ManyToOne(() => WorkflowInstance, (instance) => instance.steps)
  @JoinColumn({ name: 'instanceId' })
  instance: WorkflowInstance;

  @Column()
  stepDefinitionId: string;

  @Column()
  stepName: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    default: StepType.ACTION,
  })
  stepType: StepType;

  @Column({
    type: 'varchar',
    default: StepStatus.PENDING,
  })
  status: StepStatus;

  @Column({ type: 'int', default: 0 })
  order: number;

  // Execution details
  @Column({ nullable: true })
  jobId: string;

  @Column({ nullable: true })
  queueName: string;

  // Input/Output data
  @Column({ type: 'jsonb', nullable: true })
  input: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  output: Record<string, any>;

  // Error handling
  @Column({ nullable: true })
  errorMessage: string;

  @Column({ type: 'jsonb', nullable: true })
  errorDetails: Record<string, any>;

  @Column({ type: 'int', default: 0 })
  retryCount: number;

  @Column({ type: 'int', default: 3 })
  maxRetries: number;

  // Timing
  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'int', nullable: true })
  durationMs: number;

  // Audit
  @Column({ nullable: true })
  executedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper methods
  start(): void {
    this.status = StepStatus.RUNNING;
    this.startedAt = new Date();
  }

  complete(output?: Record<string, any>): void {
    this.status = StepStatus.COMPLETED;
    this.completedAt = new Date();
    if (output) {
      this.output = output;
    }
    if (this.startedAt) {
      this.durationMs = this.completedAt.getTime() - this.startedAt.getTime();
    }
  }

  fail(error: string, details?: Record<string, any>): void {
    this.status = StepStatus.FAILED;
    this.completedAt = new Date();
    this.errorMessage = error;
    if (details) {
      this.errorDetails = details;
    }
    if (this.startedAt) {
      this.durationMs = this.completedAt.getTime() - this.startedAt.getTime();
    }
  }

  canRetry(): boolean {
    return this.retryCount < this.maxRetries;
  }

  incrementRetry(): void {
    this.retryCount++;
    this.status = StepStatus.PENDING;
  }
}
