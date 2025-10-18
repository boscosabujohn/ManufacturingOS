import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FinancialPeriod } from './financial-period.entity';

export enum CashFlowCategory {
  OPERATING = 'Operating Activities',
  INVESTING = 'Investing Activities',
  FINANCING = 'Financing Activities',
}

export enum CashFlowType {
  INFLOW = 'Inflow',
  OUTFLOW = 'Outflow',
}

export enum TransactionSource {
  ACTUAL = 'Actual',
  FORECAST = 'Forecast',
  BUDGET = 'Budget',
}

@Entity('cash_flow_transactions')
export class CashFlowTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  transactionNumber: string;

  @Column()
  periodId: string;

  @ManyToOne(() => FinancialPeriod)
  @JoinColumn({ name: 'periodId' })
  period: FinancialPeriod;

  @Column({ type: 'date' })
  transactionDate: Date;

  @Column({
    type: 'enum',
    enum: CashFlowCategory,
  })
  category: CashFlowCategory;

  @Column({
    type: 'enum',
    enum: CashFlowType,
  })
  flowType: CashFlowType;

  @Column({
    type: 'enum',
    enum: TransactionSource,
    default: TransactionSource.ACTUAL,
  })
  source: TransactionSource;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  // Reference
  @Column({ nullable: true, length: 100 })
  referenceNumber: string;

  @Column({ nullable: true, length: 50 })
  referenceType: string;

  @Column({ nullable: true })
  referenceId: string;

  // Party
  @Column({ nullable: true })
  partyId: string;

  @Column({ nullable: true, length: 255 })
  partyName: string;

  @Column({ nullable: true, length: 50 })
  partyType: string;

  // Bank account
  @Column({ nullable: true })
  bankAccountId: string;

  // GL Account
  @Column({ nullable: true })
  glAccountId: string;

  // Classification
  @Column({ nullable: true, length: 100 })
  costCenter: string;

  @Column({ nullable: true, length: 100 })
  department: string;

  @Column({ nullable: true, length: 100 })
  project: string;

  @Column({ nullable: true, length: 100 })
  location: string;

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
}

@Entity('anticipated_receipts')
export class AnticipatedReceipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  receiptNumber: string;

  @Column({ type: 'date' })
  expectedDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  expectedAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  receivedAmount: number;

  @Column({ length: 255 })
  description: string;

  // Customer/Party
  @Column({ nullable: true })
  customerId: string;

  @Column({ length: 255 })
  customerName: string;

  // Reference (Invoice, Sales Order, etc.)
  @Column({ nullable: true, length: 100 })
  referenceNumber: string;

  @Column({ nullable: true, length: 50 })
  referenceType: string;

  @Column({ nullable: true })
  referenceId: string;

  // Status
  @Column({ default: 'Pending', length: 50 })
  status: string; // Pending, Partially Received, Fully Received, Overdue

  @Column({ default: false })
  isReceived: boolean;

  @Column({ type: 'date', nullable: true })
  actualReceiptDate: Date;

  // Payment method
  @Column({ nullable: true, length: 100 })
  expectedPaymentMethod: string;

  @Column({ nullable: true })
  bankAccountId: string;

  // Probability and confidence
  @Column({ type: 'int', default: 100 })
  confidenceLevel: number; // 0-100%

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Reminders
  @Column({ default: false })
  reminderSent: boolean;

  @Column({ type: 'timestamp', nullable: true })
  reminderSentAt: Date;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('anticipated_payments')
export class AnticipatedPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  paymentNumber: string;

  @Column({ type: 'date' })
  expectedDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  expectedAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ length: 255 })
  description: string;

  // Vendor/Party
  @Column({ nullable: true })
  vendorId: string;

  @Column({ length: 255 })
  vendorName: string;

  // Reference (Bill, Purchase Order, etc.)
  @Column({ nullable: true, length: 100 })
  referenceNumber: string;

  @Column({ nullable: true, length: 50 })
  referenceType: string;

  @Column({ nullable: true })
  referenceId: string;

  // Priority
  @Column({ type: 'int', default: 5 })
  priority: number; // 1-10, 1 being highest priority

  @Column({ default: 'Medium', length: 50 })
  urgency: string; // Low, Medium, High, Critical

  // Status
  @Column({ default: 'Pending', length: 50 })
  status: string; // Pending, Scheduled, Partially Paid, Fully Paid, Overdue

  @Column({ default: false })
  isPaid: boolean;

  @Column({ type: 'date', nullable: true })
  actualPaymentDate: Date;

  // Payment method
  @Column({ nullable: true, length: 100 })
  plannedPaymentMethod: string;

  @Column({ nullable: true })
  bankAccountId: string;

  // Approval
  @Column({ default: false })
  requiresApproval: boolean;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

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
}
