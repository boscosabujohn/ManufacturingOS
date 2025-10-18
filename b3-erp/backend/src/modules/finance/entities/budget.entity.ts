import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { FinancialYear } from './financial-period.entity';

export enum BudgetType {
  OPERATING = 'Operating Budget',
  CAPITAL = 'Capital Budget',
  CASH = 'Cash Budget',
  MASTER = 'Master Budget',
}

export enum BudgetStatus {
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  APPROVED = 'Approved',
  ACTIVE = 'Active',
  CLOSED = 'Closed',
  REVISED = 'Revised',
}

@Entity('budgets')
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  budgetCode: string;

  @Column({ length: 255 })
  budgetName: string;

  @Column()
  financialYearId: string;

  @ManyToOne(() => FinancialYear)
  @JoinColumn({ name: 'financialYearId' })
  financialYear: FinancialYear;

  @Column({
    type: 'enum',
    enum: BudgetType,
  })
  budgetType: BudgetType;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: BudgetStatus,
    default: BudgetStatus.DRAFT,
  })
  status: BudgetStatus;

  // Organizational dimension
  @Column({ nullable: true, length: 100 })
  department: string;

  @Column({ nullable: true, length: 100 })
  costCenter: string;

  @Column({ nullable: true, length: 100 })
  project: string;

  @Column({ nullable: true, length: 100 })
  location: string;

  // Totals
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalBudgetedAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalActualAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalVariance: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  utilizationPercentage: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Approval workflow
  @Column({ nullable: true })
  submittedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date;

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  rejectedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  // Revision tracking
  @Column({ type: 'int', default: 1 })
  version: number;

  @Column({ nullable: true })
  previousVersionId: string;

  @Column({ type: 'text', nullable: true })
  revisionNotes: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BudgetLine, (line) => line.budget, { cascade: true })
  lines: BudgetLine[];
}

@Entity('budget_lines')
export class BudgetLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  budgetId: string;

  @ManyToOne(() => Budget, (budget) => budget.lines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'budgetId' })
  budget: Budget;

  @Column()
  accountId: string; // Link to Chart of Accounts

  @Column({ length: 255 })
  accountName: string;

  @Column({ length: 50 })
  accountCode: string;

  // Period-wise budgets (Monthly/Quarterly)
  @Column({ type: 'json', nullable: true })
  periodWiseBudget: {
    periodId: string;
    periodName: string;
    budgetedAmount: number;
    actualAmount: number;
    variance: number;
  }[];

  // Annual total
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  annualBudgetedAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  annualActualAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  annualVariance: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  utilizationPercentage: number;

  // Classification
  @Column({ nullable: true, length: 100 })
  costCenter: string;

  @Column({ nullable: true, length: 100 })
  department: string;

  @Column({ nullable: true, length: 100 })
  project: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
