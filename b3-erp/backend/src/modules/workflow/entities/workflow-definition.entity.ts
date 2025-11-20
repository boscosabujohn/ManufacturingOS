import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { WorkflowInstance } from './workflow-instance.entity';

export enum WorkflowType {
  SALES_TO_PRODUCTION = 'sales_to_production',
  PROCUREMENT_TO_INVENTORY = 'procurement_to_inventory',
  QUALITY_INSPECTION = 'quality_inspection',
  ORDER_FULFILLMENT = 'order_fulfillment',
  PURCHASE_REQUISITION = 'purchase_requisition',
  GOODS_RECEIPT = 'goods_receipt',
  CUSTOM = 'custom',
}

export enum WorkflowStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
}

export interface WorkflowTrigger {
  event: string;
  conditions?: Record<string, any>;
}

export interface WorkflowAction {
  type: string;
  config: Record<string, any>;
  order: number;
}

export interface WorkflowStepDefinition {
  id: string;
  name: string;
  description?: string;
  actions: WorkflowAction[];
  nextSteps?: string[];
  conditions?: Record<string, any>;
}

@Entity('workflow_definitions')
export class WorkflowDefinition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    default: WorkflowType.CUSTOM,
  })
  type: WorkflowType;

  @Column({
    type: 'varchar',
    default: WorkflowStatus.DRAFT,
  })
  status: WorkflowStatus;

  @Column({ default: 1 })
  version: number;

  @Column({ type: 'jsonb', nullable: true })
  triggers: WorkflowTrigger[];

  @Column({ type: 'jsonb', nullable: true })
  steps: WorkflowStepDefinition[];

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => WorkflowInstance, (instance) => instance.definition)
  instances: WorkflowInstance[];
}
