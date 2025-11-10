import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum LeaveTypeStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export enum LeaveAccrualType {
  ANNUAL = 'Annual',
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  NONE = 'None',
}

@Entity('hr_leave_types')
export class LeaveType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isPaid: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  maxDaysPerYear: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  minDaysPerApplication: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  maxDaysPerApplication: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  maxCarryForward: number;

  @Column({ default: false })
  allowCarryForward: boolean;

  @Column({ default: false })
  allowEncashment: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  maxEncashmentDays: number;

  @Column({ default: true })
  requiresApproval: boolean;

  @Column({ default: false })
  requiresDocument: boolean;

  @Column({ type: 'int', default: 0 })
  minAdvanceNoticeDays: number;

  @Column({ type: 'int', default: 0 })
  maxBackdatedDays: number;

  @Column({
    type: 'enum',
    enum: LeaveAccrualType,
    default: LeaveAccrualType.ANNUAL,
  })
  accrualType: LeaveAccrualType;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  accrualRate: number; // e.g., 1.5 days per month

  @Column({ default: false })
  allowHalfDay: boolean;

  @Column({ default: false })
  allowNegativeBalance: boolean;

  @Column({ default: true })
  includeHolidays: boolean;

  @Column({ default: true })
  includeWeekends: boolean;

  @Column({ type: 'simple-array', nullable: true })
  applicableEmployeeTypes: string[];

  @Column({ type: 'simple-array', nullable: true })
  applicableGenders: string[];

  @Column({ type: 'int', default: 0 })
  applicableAfterMonths: number;

  @Column({ default: 1 })
  displayOrder: number;

  @Column({ length: 50, nullable: true })
  color: string; // For calendar display

  @Column({
    type: 'enum',
    enum: LeaveTypeStatus,
    default: LeaveTypeStatus.ACTIVE,
  })
  status: LeaveTypeStatus;

  @Column({ type: 'json', nullable: true })
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
