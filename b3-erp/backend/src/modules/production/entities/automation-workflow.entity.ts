import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'disabled' | 'error';
export type WorkflowType = 'production' | 'quality' | 'maintenance' | 'inventory' | 'reporting';
export type TriggerType = 'schedule' | 'event' | 'condition' | 'manual' | 'api';

@Entity('production_automation_workflows')
export class AutomationWorkflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'workflow_code', unique: true })
  workflowCode: string;

  @Column({ name: 'workflow_name' })
  workflowName: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'workflow_type', type: 'varchar', length: 20 })
  workflowType: WorkflowType;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: WorkflowStatus;

  @Column({ name: 'trigger_type', type: 'varchar', length: 20 })
  triggerType: TriggerType;

  @Column({ type: 'jsonb', nullable: true })
  triggerConfig: {
    schedule?: string;
    eventType?: string;
    eventSource?: string;
    conditions?: { field: string; operator: string; value: any }[];
    webhookUrl?: string;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  steps: {
    stepNumber: number;
    stepName: string;
    stepType: string;
    action: string;
    parameters: Record<string, any>;
    onSuccess: string;
    onFailure: string;
    timeout: number;
    retries: number;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  conditions: {
    conditionName: string;
    expression: string;
    trueAction: string;
    falseAction: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  notifications: {
    eventType: string;
    recipients: string[];
    channel: string;
    template: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  errorHandling: {
    errorType: string;
    action: string;
    notifyUsers: string[];
    retryPolicy: { maxRetries: number; retryDelay: number };
  } | null;

  @Column({ name: 'execution_count', type: 'int', default: 0 })
  executionCount: number;

  @Column({ name: 'success_count', type: 'int', default: 0 })
  successCount: number;

  @Column({ name: 'failure_count', type: 'int', default: 0 })
  failureCount: number;

  @Column({ name: 'last_execution_at', type: 'timestamp', nullable: true })
  lastExecutionAt: Date | null;

  @Column({ name: 'last_execution_status', type: 'varchar', nullable: true })
  lastExecutionStatus: string | null;

  @Column({ name: 'next_scheduled_run', type: 'timestamp', nullable: true })
  nextScheduledRun: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  executionHistory: {
    executionId: string;
    startTime: string;
    endTime: string;
    status: string;
    stepsCompleted: number;
    error: string | null;
  }[] | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
