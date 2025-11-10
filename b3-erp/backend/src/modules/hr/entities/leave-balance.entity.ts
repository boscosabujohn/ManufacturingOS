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
import { LeaveType } from './leave-type.entity';

@Entity('hr_leave_balances')
@Unique(['employeeId', 'leaveTypeId', 'year'])
export class LeaveBalance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employeeId: string;

  @ManyToOne(() => Employee, (employee) => employee.leaveBalances)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  leaveTypeId: string;

  @ManyToOne(() => LeaveType)
  @JoinColumn({ name: 'leaveTypeId' })
  leaveType: LeaveType;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  openingBalance: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  allocated: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  earned: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  used: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  pending: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  lapsed: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  carriedForward: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  encashed: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  available: number;

  @Column({ type: 'json', nullable: true })
  history: Array<{
    date: Date;
    type: string;
    days: number;
    reason: string;
    referenceId: string;
  }>;

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
