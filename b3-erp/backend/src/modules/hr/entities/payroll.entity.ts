import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SalarySlip } from './salary-slip.entity';

export enum PayrollStatus {
  DRAFT = 'Draft',
  PROCESSING = 'Processing',
  PROCESSED = 'Processed',
  VERIFIED = 'Verified',
  APPROVED = 'Approved',
  POSTED = 'Posted',
  PAID = 'Paid',
  CANCELLED = 'Cancelled',
}

export enum PayrollPeriod {
  MONTHLY = 'Monthly',
  WEEKLY = 'Weekly',
  BIWEEKLY = 'Biweekly',
  SEMIMONTHLY = 'Semi-monthly',
}

@Entity('hr_payrolls')
export class Payroll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  payrollNumber: string;

  @Column({ length: 100 })
  title: string;

  @Column({
    type: 'enum',
    enum: PayrollPeriod,
    default: PayrollPeriod.MONTHLY,
  })
  period: PayrollPeriod;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'date' })
  paymentDate: Date;

  @Column({ type: 'int', default: 0 })
  totalEmployees: number;

  @Column({ type: 'int', default: 0 })
  processedEmployees: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalGrossSalary: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalDeductions: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalNetSalary: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalEmployerContributions: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCTC: number;

  @Column({
    type: 'enum',
    enum: PayrollStatus,
    default: PayrollStatus.DRAFT,
  })
  status: PayrollStatus;

  @Column({ type: 'simple-array', nullable: true })
  includedDepartments: string[];

  @Column({ type: 'simple-array', nullable: true })
  excludedEmployees: string[];

  @Column({ default: false })
  isPosted: boolean;

  @Column({ nullable: true })
  journalEntryId: string;

  @Column({ type: 'timestamp', nullable: true })
  postedAt: Date;

  @Column({ nullable: true })
  postedBy: string;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  paidBy: string;

  @Column({ nullable: true })
  paymentReferenceNumber: string;

  @Column({ nullable: true })
  bankTransactionId: string;

  @Column({ nullable: true })
  processedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'json', nullable: true })
  summary: {
    basic: number;
    hra: number;
    allowances: number;
    pf: number;
    esi: number;
    tax: number;
    otherDeductions: number;
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

  @OneToMany(() => SalarySlip, (slip) => slip.payroll)
  salarySlips: SalarySlip[];
}
