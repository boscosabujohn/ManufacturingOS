import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum WorkOrderStatusState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('work_order_statuses')
export class WorkOrderStatusEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 20, nullable: true })
  color: string;

  @Column({ type: 'int', default: 0 })
  sequenceOrder: number;

  @Column({ default: false })
  isInitial: boolean;

  @Column({ default: false })
  isFinal: boolean;

  @Column({ default: false })
  isDefault: boolean;

  // Allowed actions in this status
  @Column({ default: false })
  allowMaterialIssue: boolean;

  @Column({ default: false })
  allowProduction: boolean;

  @Column({ default: false })
  allowQualityCheck: boolean;

  @Column({ default: true })
  allowEdit: boolean;

  @Column({ default: true })
  allowCancel: boolean;

  // Transition rules
  @Column({ type: 'simple-array', nullable: true })
  allowedNextStatuses: string[];

  @Column({ type: 'simple-array', nullable: true })
  allowedPreviousStatuses: string[];

  // Notifications
  @Column({ default: false })
  notifyOnTransition: boolean;

  @Column({ type: 'simple-array', nullable: true })
  notifyRoles: string[];

  @Column({
    type: 'enum',
    enum: WorkOrderStatusState,
    default: WorkOrderStatusState.ACTIVE,
  })
  status: WorkOrderStatusState;

  @Column({ default: true })
  isSystem: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
