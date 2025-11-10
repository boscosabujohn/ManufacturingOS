import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

export enum UserStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  SUSPENDED = 'Suspended',
  LOCKED = 'Locked',
  PENDING_ACTIVATION = 'Pending Activation',
}

export enum UserType {
  INTERNAL = 'Internal',
  EXTERNAL = 'External',
  SYSTEM = 'System',
  API = 'API',
}

@Entity('it_users')
@Index(['username'], { unique: true })
@Index(['email'], { unique: true })
@Index(['status'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 200 })
  fullName: string;

  @Column({ nullable: true, length: 20 })
  phoneNumber: string;

  @Column({ nullable: true, length: 50 })
  employeeId: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.INTERNAL,
  })
  userType: UserType;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING_ACTIVATION,
  })
  status: UserStatus;

  @Column({ default: false })
  isSystemAdmin: boolean;

  @Column({ nullable: true, length: 500 })
  profilePhotoUrl: string;

  @Column({ nullable: true, length: 50 })
  department: string;

  @Column({ nullable: true, length: 50 })
  designation: string;

  @Column({ nullable: true, length: 100 })
  location: string;

  @Column({ nullable: true, type: 'date' })
  lastLoginAt: Date;

  @Column({ nullable: true, length: 50 })
  lastLoginIp: string;

  @Column({ default: 0 })
  failedLoginAttempts: number;

  @Column({ nullable: true, type: 'timestamp' })
  lockedUntil: Date;

  @Column({ nullable: true, type: 'timestamp' })
  passwordChangedAt: Date;

  @Column({ default: false })
  mustChangePassword: boolean;

  @Column({ default: true })
  isEmailVerified: boolean;

  @Column({ nullable: true, length: 100 })
  emailVerificationToken: string;

  @Column({ nullable: true, type: 'timestamp' })
  emailVerificationExpiry: Date;

  @Column({ nullable: true, length: 100 })
  passwordResetToken: string;

  @Column({ nullable: true, type: 'timestamp' })
  passwordResetExpiry: Date;

  @Column({ default: true })
  twoFactorEnabled: boolean;

  @Column({ nullable: true, length: 100 })
  twoFactorSecret: string;

  @Column({ type: 'simple-array', nullable: true })
  twoFactorBackupCodes: string[];

  @Column({ type: 'jsonb', nullable: true })
  preferences: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true, type: 'timestamp' })
  activatedAt: Date;

  @Column({ nullable: true, length: 100 })
  activatedBy: string;

  @Column({ nullable: true, type: 'timestamp' })
  deactivatedAt: Date;

  @Column({ nullable: true, length: 100 })
  deactivatedBy: string;

  @Column({ nullable: true, type: 'text' })
  deactivationReason: string;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => UserSession, (session) => session.user)
  sessions: UserSession[];

  @OneToMany(() => PasswordHistory, (history) => history.user)
  passwordHistory: PasswordHistory[];

  @OneToMany(() => AuditLog, (log) => log.user)
  auditLogs: AuditLog[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}

// Import related entities
import { UserRole } from './user-role.entity';
import { UserSession } from './user-session.entity';
import { PasswordHistory } from './password-history.entity';
import { AuditLog } from './audit-log.entity';
import { Notification } from './notification.entity';
