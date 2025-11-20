import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { WorkflowDefinition } from './workflow-definition.entity';
import { WorkflowStep } from './workflow-step.entity';
import { WorkflowHistory } from './workflow-history.entity';

export enum InstanceStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum InstancePriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('workflow_instances')
export class WorkflowInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  instanceNumber: string;

  @Column({ nullable: true })
  definitionId: string;

  @ManyToOne(() => WorkflowDefinition, (definition) => definition.instances)
  @JoinColumn({ name: 'definitionId' })
  definition: WorkflowDefinition;

  @Column({
    type: 'varchar',
    default: InstanceStatus.PENDING,
  })
  status: InstanceStatus;

  @Column({
    type: 'varchar',
    default: InstancePriority.NORMAL,
  })
  priority: InstancePriority;

  @Column({ nullable: true })
  currentStepId: string;

  @Column({ nullable: true })
  currentStepName: string;

  // Source reference (e.g., order, rfp, purchase order)
  @Column({ nullable: true })
  sourceType: string;

  @Column({ nullable: true })
  sourceId: string;

  @Column({ nullable: true })
  sourceNumber: string;

  // Workflow context data
  @Column({ type: 'jsonb', nullable: true })
  context: Record<string, any>;

  // Error information
  @Column({ nullable: true })
  errorMessage: string;

  @Column({ type: 'jsonb', nullable: true })
  errorDetails: Record<string, any>;

  // Timing
  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  // Progress tracking
  @Column({ type: 'int', default: 0 })
  totalSteps: number;

  @Column({ type: 'int', default: 0 })
  completedSteps: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progressPercentage: number;

  // Audit
  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => WorkflowStep, (step) => step.instance)
  steps: WorkflowStep[];

  @OneToMany(() => WorkflowHistory, (history) => history.instance)
  history: WorkflowHistory[];

  // Helper methods
  isActive(): boolean {
    return this.status === InstanceStatus.RUNNING || this.status === InstanceStatus.PENDING;
  }

  isCompleted(): boolean {
    return this.status === InstanceStatus.COMPLETED;
  }

  isFailed(): boolean {
    return this.status === InstanceStatus.FAILED;
  }

  calculateProgress(): void {
    if (this.totalSteps > 0) {
      this.progressPercentage = (this.completedSteps / this.totalSteps) * 100;
    }
  }
}
