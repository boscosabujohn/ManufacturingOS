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
import { Payroll } from './payroll.entity';
import { Employee } from './employee.entity';

export enum SalarySlipStatus {
  DRAFT = 'Draft',
  GENERATED = 'Generated',
  SENT = 'Sent',
  PAID = 'Paid',
  ON_HOLD = 'On Hold',
  CANCELLED = 'Cancelled',
}

@Entity('hr_salary_slips')
@Unique(['payrollId', 'employeeId'])
export class SalarySlip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  slipNumber: string;

  @Column()
  payrollId: string;

  @ManyToOne(() => Payroll, (payroll) => payroll.salarySlips)
  @JoinColumn({ name: 'payrollId' })
  payroll: Payroll;

  @Column()
  employeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column({ length: 50 })
  employeeCode: string;

  @Column({ length: 100 })
  employeeName: string;

  @Column({ length: 100, nullable: true })
  designation: string;

  @Column({ length: 100, nullable: true })
  department: string;

  @Column({ type: 'date', nullable: true })
  joiningDate: Date;

  @Column({ length: 100, nullable: true })
  bankAccount: string;

  @Column({ length: 50, nullable: true })
  panNumber: string;

  @Column({ length: 50, nullable: true })
  pfNumber: string;

  @Column({ length: 50, nullable: true })
  esiNumber: string;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'date' })
  paymentDate: Date;

  @Column({ type: 'int', default: 0 })
  workingDays: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  presentDays: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  absentDays: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  leaveDays: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  paidDays: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  lopDays: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  overtimeHours: number;

  @Column({ type: 'json' })
  earnings: Array<{
    component: string;
    amount: number;
    isTaxable: boolean;
  }>;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  grossSalary: number;

  @Column({ type: 'json' })
  deductions: Array<{
    component: string;
    amount: number;
  }>;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalDeductions: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  netSalary: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  pfEmployeeContribution: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  pfEmployerContribution: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  esiEmployeeContribution: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  esiEmployerContribution: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  professionalTax: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  tds: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  advance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  loan: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  otherDeductions: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  reimbursements: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  bonus: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  incentive: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  arrears: number;

  @Column({
    type: 'enum',
    enum: SalarySlipStatus,
    default: SalarySlipStatus.DRAFT,
  })
  status: SalarySlipStatus;

  @Column({ default: false })
  isSent: boolean;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  paymentReferenceNumber: string;

  @Column({ length: 50, nullable: true })
  paymentMode: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'text', nullable: true })
  pdfUrl: string;

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
