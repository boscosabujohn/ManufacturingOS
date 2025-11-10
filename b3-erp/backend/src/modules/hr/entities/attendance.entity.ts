import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Employee } from './employee.entity';

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  HALF_DAY = 'Half Day',
  LATE = 'Late',
  ON_LEAVE = 'On Leave',
  HOLIDAY = 'Holiday',
  WEEK_OFF = 'Week Off',
  ON_DUTY = 'On Duty',
  WORK_FROM_HOME = 'Work From Home',
}

export enum AttendanceType {
  REGULAR = 'Regular',
  OVERTIME = 'Overtime',
  NIGHT_SHIFT = 'Night Shift',
  EXTRA_SHIFT = 'Extra Shift',
}

@Entity('hr_attendance')
@Unique(['employeeId', 'date'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employeeId: string;

  @ManyToOne(() => Employee, (employee) => employee.attendances)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  shiftId: string;

  @Column({ type: 'time', nullable: true })
  shiftStartTime: string;

  @Column({ type: 'time', nullable: true })
  shiftEndTime: string;

  @Column({ type: 'time', nullable: true })
  checkInTime: string;

  @Column({ type: 'time', nullable: true })
  checkOutTime: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  workingHours: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  overtimeHours: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  breakHours: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  lateBy: number; // in minutes

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  earlyLeaving: number; // in minutes

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

  @Column({
    type: 'enum',
    enum: AttendanceType,
    default: AttendanceType.REGULAR,
  })
  type: AttendanceType;

  @Column({ default: false })
  isHoliday: boolean;

  @Column({ default: false })
  isWeekOff: boolean;

  @Column({ nullable: true, length: 100 })
  holidayName: string;

  @Column({ nullable: true })
  leaveApplicationId: string;

  @Column({ nullable: true, length: 100 })
  leaveType: string;

  @Column({ default: false })
  isRegularized: boolean;

  @Column({ type: 'text', nullable: true })
  regularizationReason: string;

  @Column({ nullable: true })
  regularizedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  regularizedAt: Date;

  @Column({ default: false })
  isManualEntry: boolean;

  @Column({ nullable: true })
  enteredBy: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ length: 100, nullable: true })
  location: string;

  @Column({ length: 100, nullable: true })
  deviceId: string;

  @Column({ type: 'json', nullable: true })
  biometricLogs: Array<{
    time: string;
    type: string; // IN, OUT, BREAK_START, BREAK_END
    deviceId: string;
  }>;

  @Column({ type: 'json', nullable: true })
  geoLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };

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
