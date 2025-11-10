import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from './employee.entity';
import { LeaveType } from './leave-type.entity';

export enum LeaveApplicationStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled',
  ON_HOLD = 'On Hold',
}

export enum LeavePeriod {
  FULL_DAY = 'Full Day',
  FIRST_HALF = 'First Half',
  SECOND_HALF = 'Second Half',
}

@Entity('hr_leave_applications')
export class LeaveApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  applicationNumber: string;

  @Column()
  employeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  leaveTypeId: string;

  @ManyToOne(() => LeaveType)
  @JoinColumn({ name: 'leaveTypeId' })
  leaveType: LeaveType;

  @Column({ type: 'date' })
  fromDate: Date;

  @Column({ type: 'date' })
  toDate: Date;

  @Column({
    type: 'enum',
    enum: LeavePeriod,
    default: LeavePeriod.FULL_DAY,
  })
  fromDatePeriod: LeavePeriod;

  @Column({
    type: 'enum',
    enum: LeavePeriod,
    default: LeavePeriod.FULL_DAY,
  })
  toDatePeriod: LeavePeriod;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  totalDays: number;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'text', nullable: true })
  contactAddress: string;

  @Column({ length: 20, nullable: true })
  contactPhone: string;

  @Column({ nullable: true, length: 100 })
  handoverTo: string;

  @Column({ type: 'date' })
  applicationDate: Date;

  @Column({
    type: 'enum',
    enum: LeaveApplicationStatus,
    default: LeaveApplicationStatus.DRAFT,
  })
  status: LeaveApplicationStatus;

  // Approval Workflow
  @Column({ nullable: true })
  approver1Id: string;

  @Column({ nullable: true, length: 100 })
  approver1Name: string;

  @Column({ type: 'timestamp', nullable: true })
  approver1Date: Date;

  @Column({ type: 'text', nullable: true })
  approver1Remarks: string;

  @Column({ nullable: true })
  approver2Id: string;

  @Column({ nullable: true, length: 100 })
  approver2Name: string;

  @Column({ type: 'timestamp', nullable: true })
  approver2Date: Date;

  @Column({ type: 'text', nullable: true })
  approver2Remarks: string;

  @Column({ nullable: true })
  finalApproverId: string;

  @Column({ nullable: true, length: 100 })
  finalApproverName: string;

  @Column({ type: 'timestamp', nullable: true })
  finalApprovalDate: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ nullable: true })
  rejectedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  rejectedDate: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ nullable: true })
  cancelledBy: string;

  @Column({ type: 'timestamp', nullable: true })
  cancelledDate: Date;

  // Documents
  @Column({ type: 'json', nullable: true })
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    uploadedAt: Date;
  }>;

  // Post-leave
  @Column({ default: false })
  isRejoined: boolean;

  @Column({ type: 'date', nullable: true })
  actualRejoinDate: Date;

  @Column({ type: 'text', nullable: true })
  postLeaveRemarks: string;

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
