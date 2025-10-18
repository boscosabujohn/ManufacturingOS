import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ChartOfAccounts } from './chart-of-accounts.entity';
import { FinancialPeriod } from './financial-period.entity';

export enum TransactionType {
  JOURNAL_ENTRY = 'Journal Entry',
  INVOICE = 'Invoice',
  PAYMENT = 'Payment',
  RECEIPT = 'Receipt',
  ADJUSTMENT = 'Adjustment',
  ACCRUAL = 'Accrual',
  REVERSAL = 'Reversal',
  DEPRECIATION = 'Depreciation',
  INVENTORY = 'Inventory',
  PAYROLL = 'Payroll',
  CLOSING = 'Closing Entry',
}

export enum EntryStatus {
  DRAFT = 'Draft',
  POSTED = 'Posted',
  REVERSED = 'Reversed',
  VOID = 'Void',
}

@Entity('general_ledger')
@Index(['accountId', 'postingDate'])
@Index(['periodId', 'accountId'])
@Index(['transactionType', 'postingDate'])
export class GeneralLedger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Reference to Chart of Accounts
  @Column()
  accountId: string;

  @ManyToOne(() => ChartOfAccounts)
  @JoinColumn({ name: 'accountId' })
  account: ChartOfAccounts;

  // Financial Period
  @Column()
  periodId: string;

  @ManyToOne(() => FinancialPeriod)
  @JoinColumn({ name: 'periodId' })
  period: FinancialPeriod;

  // Transaction Details
  @Column({ length: 50 })
  transactionNumber: string; // Auto-generated unique number

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  transactionType: TransactionType;

  @Column({ type: 'date' })
  postingDate: Date;

  @Column({ type: 'date' })
  transactionDate: Date;

  // Debit/Credit amounts
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  debitAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  creditAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  netAmount: number;

  // Description and reference
  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true, length: 100 })
  referenceNumber: string; // Invoice number, payment number, etc.

  @Column({ nullable: true, length: 50 })
  referenceType: string; // Invoice, Payment, PO, etc.

  @Column({ nullable: true })
  referenceId: string; // UUID of the source document

  // Multi-dimensional accounting
  @Column({ nullable: true, length: 100 })
  costCenter: string;

  @Column({ nullable: true, length: 100 })
  department: string;

  @Column({ nullable: true, length: 100 })
  project: string;

  @Column({ nullable: true, length: 100 })
  location: string;

  // Party information (Customer/Vendor)
  @Column({ nullable: true })
  partyId: string;

  @Column({ nullable: true, length: 255 })
  partyName: string;

  @Column({ nullable: true, length: 50 })
  partyType: string; // Customer, Vendor, Employee, etc.

  // Currency
  @Column({ default: 'INR', length: 3 })
  currency: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, default: 1 })
  exchangeRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  baseCurrencyAmount: number;

  // Status
  @Column({
    type: 'enum',
    enum: EntryStatus,
    default: EntryStatus.DRAFT,
  })
  status: EntryStatus;

  @Column({ nullable: true })
  postedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  postedAt: Date;

  // Reversal tracking
  @Column({ default: false })
  isReversed: boolean;

  @Column({ nullable: true })
  reversedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  reversedAt: Date;

  @Column({ nullable: true })
  reversalEntryId: string; // Link to the reversing entry

  // Journal Entry pairing (for double-entry validation)
  @Column({ nullable: true })
  journalEntryId: string; // Groups debit and credit entries together

  @Column({ type: 'int', nullable: true })
  lineNumber: number; // Line number within a journal entry

  // Reconciliation
  @Column({ default: false })
  isReconciled: boolean;

  @Column({ type: 'timestamp', nullable: true })
  reconciledDate: Date;

  @Column({ nullable: true })
  reconciledBy: string;

  // Audit fields
  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual/calculated fields
  runningBalance?: number;
}
