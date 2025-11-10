import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export enum AuditAction {
  CREATE = 'Create',
  UPDATE = 'Update',
  DELETE = 'Delete',
  VIEW = 'View',
  LOGIN = 'Login',
  LOGOUT = 'Logout',
  LOGIN_FAILED = 'Login Failed',
  PASSWORD_CHANGE = 'Password Change',
  PASSWORD_RESET = 'Password Reset',
  ACTIVATE = 'Activate',
  DEACTIVATE = 'Deactivate',
  SUSPEND = 'Suspend',
  UNLOCK = 'Unlock',
  EXPORT = 'Export',
  IMPORT = 'Import',
  APPROVE = 'Approve',
  REJECT = 'Reject',
  SUBMIT = 'Submit',
  CANCEL = 'Cancel',
  CUSTOM = 'Custom',
}

export enum AuditSeverity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

@Entity('it_audit_logs')
@Index(['userId'])
@Index(['module', 'action'])
@Index(['createdAt'])
@Index(['severity'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.auditLogs, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true, length: 100 })
  username: string;

  @Column({ length: 50 })
  module: string; // e.g., 'inventory', 'sales', 'hr', 'auth'

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({ length: 200 })
  description: string;

  @Column({ nullable: true, length: 100 })
  entityType: string; // e.g., 'Product', 'Order', 'Employee'

  @Column({ nullable: true, length: 100 })
  entityId: string;

  @Column({ nullable: true, length: 200 })
  entityName: string;

  @Column({ type: 'jsonb', nullable: true })
  oldValues: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  newValues: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  changedFields: string[];

  @Column({
    type: 'enum',
    enum: AuditSeverity,
    default: AuditSeverity.LOW,
  })
  severity: AuditSeverity;

  @Column({ nullable: true, length: 50 })
  ipAddress: string;

  @Column({ nullable: true, length: 500 })
  userAgent: string;

  @Column({ nullable: true, length: 100 })
  sessionId: string;

  @Column({ nullable: true, length: 500 })
  requestUrl: string;

  @Column({ nullable: true, length: 20 })
  httpMethod: string;

  @Column({ nullable: true })
  statusCode: number;

  @Column({ nullable: true })
  responseTime: number; // milliseconds

  @Column({ default: true })
  success: boolean;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'jsonb', nullable: true })
  errorStack: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  additionalData: Record<string, any>;

  @Column({ nullable: true, length: 100 })
  location: string;

  @Column({ nullable: true, length: 100 })
  device: string;

  @Column({ nullable: true, length: 100 })
  browser: string;

  @Column({ nullable: true, length: 50 })
  os: string;

  @Column({ type: 'jsonb', nullable: true })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;
}
