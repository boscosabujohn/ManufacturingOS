import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { WorkflowInstance } from './workflow-instance.entity';

export enum HistoryEventType {
  // Instance events
  INSTANCE_CREATED = 'instance_created',
  INSTANCE_STARTED = 'instance_started',
  INSTANCE_PAUSED = 'instance_paused',
  INSTANCE_RESUMED = 'instance_resumed',
  INSTANCE_COMPLETED = 'instance_completed',
  INSTANCE_FAILED = 'instance_failed',
  INSTANCE_CANCELLED = 'instance_cancelled',

  // Step events
  STEP_STARTED = 'step_started',
  STEP_COMPLETED = 'step_completed',
  STEP_FAILED = 'step_failed',
  STEP_SKIPPED = 'step_skipped',
  STEP_RETRIED = 'step_retried',

  // Action events
  ACTION_EXECUTED = 'action_executed',
  NOTIFICATION_SENT = 'notification_sent',
  APPROVAL_REQUESTED = 'approval_requested',
  APPROVAL_GRANTED = 'approval_granted',
  APPROVAL_REJECTED = 'approval_rejected',

  // Data events
  CONTEXT_UPDATED = 'context_updated',
  ERROR_OCCURRED = 'error_occurred',

  // Integration events
  EVENT_RECEIVED = 'event_received',
  EVENT_EMITTED = 'event_emitted',
  JOB_QUEUED = 'job_queued',
  JOB_PROCESSED = 'job_processed',
}

export enum HistorySeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  DEBUG = 'debug',
}

@Entity('workflow_history')
@Index(['instanceId', 'createdAt'])
@Index(['eventType', 'createdAt'])
export class WorkflowHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  instanceId: string;

  @ManyToOne(() => WorkflowInstance, (instance) => instance.history)
  @JoinColumn({ name: 'instanceId' })
  instance: WorkflowInstance;

  @Column({ nullable: true })
  stepId: string;

  @Column({
    type: 'varchar',
  })
  eventType: HistoryEventType;

  @Column({
    type: 'varchar',
    default: HistorySeverity.INFO,
  })
  severity: HistorySeverity;

  @Column()
  message: string;

  @Column({ nullable: true })
  details: string;

  // Event data
  @Column({ type: 'jsonb', nullable: true })
  eventData: Record<string, any>;

  // Previous and new state for tracking changes
  @Column({ type: 'jsonb', nullable: true })
  previousState: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  newState: Record<string, any>;

  // Source information
  @Column({ nullable: true })
  sourceEvent: string;

  @Column({ nullable: true })
  sourceModule: string;

  // User who triggered this
  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  userName: string;

  // IP address for audit
  @Column({ nullable: true })
  ipAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  // Factory methods for common history entries
  static createInstanceEvent(
    instanceId: string,
    eventType: HistoryEventType,
    message: string,
    userId?: string,
    eventData?: Record<string, any>,
  ): Partial<WorkflowHistory> {
    return {
      instanceId,
      eventType,
      message,
      userId,
      eventData,
      severity: HistorySeverity.INFO,
    };
  }

  static createStepEvent(
    instanceId: string,
    stepId: string,
    eventType: HistoryEventType,
    message: string,
    userId?: string,
    eventData?: Record<string, any>,
  ): Partial<WorkflowHistory> {
    return {
      instanceId,
      stepId,
      eventType,
      message,
      userId,
      eventData,
      severity: HistorySeverity.INFO,
    };
  }

  static createErrorEvent(
    instanceId: string,
    message: string,
    errorDetails: Record<string, any>,
    userId?: string,
  ): Partial<WorkflowHistory> {
    return {
      instanceId,
      eventType: HistoryEventType.ERROR_OCCURRED,
      severity: HistorySeverity.ERROR,
      message,
      eventData: errorDetails,
      userId,
    };
  }
}
