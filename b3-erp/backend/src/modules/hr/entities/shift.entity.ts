import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ShiftStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export enum ShiftType {
  GENERAL = 'General',
  ROTATING = 'Rotating',
  FLEXIBLE = 'Flexible',
  NIGHT = 'Night',
}

@Entity('hr_shifts')
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ShiftType,
    default: ShiftType.GENERAL,
  })
  type: ShiftType;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  workingHours: number;

  @Column({ type: 'time', nullable: true })
  breakStartTime: string;

  @Column({ type: 'time', nullable: true })
  breakEndTime: string;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 0 })
  breakHours: number;

  @Column({ type: 'int', default: 15 })
  graceMinutes: number;

  @Column({ type: 'int', default: 30 })
  lateMarkAfterMinutes: number;

  @Column({ type: 'int', default: 60 })
  halfDayAfterMinutes: number;

  @Column({ type: 'int', default: 240 })
  absentAfterMinutes: number;

  @Column({ type: 'simple-array', default: '1,2,3,4,5' })
  workingDays: number[]; // 0=Sunday, 1=Monday, etc.

  @Column({ default: true })
  allowOvertime: boolean;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 1.5 })
  overtimeMultiplier: number;

  @Column({ default: false })
  isNightShift: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  nightShiftAllowance: number;

  @Column({
    type: 'enum',
    enum: ShiftStatus,
    default: ShiftStatus.ACTIVE,
  })
  status: ShiftStatus;

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
