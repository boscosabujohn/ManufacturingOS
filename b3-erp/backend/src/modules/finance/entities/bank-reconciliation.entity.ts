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
import { BankAccount } from './bank-account.entity';

export enum ReconciliationStatus {
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  REVIEWED = 'Reviewed',
  APPROVED = 'Approved',
}

export enum TransactionStatus {
  MATCHED = 'Matched',
  UNMATCHED = 'Unmatched',
  SUGGESTED_MATCH = 'Suggested Match',
  MANUALLY_MATCHED = 'Manually Matched',
}

@Entity('bank_reconciliations')
export class BankReconciliation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  reconciliationNumber: string;

  @Column()
  bankAccountId: string;

  @ManyToOne(() => BankAccount)
  @JoinColumn({ name: 'bankAccountId' })
  bankAccount: BankAccount;

  @Column({ type: 'date' })
  reconciliationDate: Date;

  @Column({ type: 'date' })
  statementStartDate: Date;

  @Column({ type: 'date' })
  statementEndDate: Date;

  // Balances
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  openingBalancePerBooks: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  closingBalancePerBooks: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  openingBalancePerBank: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  closingBalancePerBank: number;

  // Reconciliation summary
  @Column({ type: 'int', default: 0 })
  totalTransactions: number;

  @Column({ type: 'int', default: 0 })
  matchedTransactions: number;

  @Column({ type: 'int', default: 0 })
  unmatchedBookTransactions: number;

  @Column({ type: 'int', default: 0 })
  unmatchedBankTransactions: number;

  // Differences
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalDifference: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  unreconciledDebits: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  unreconciledCredits: number;

  // Status
  @Column({
    type: 'enum',
    enum: ReconciliationStatus,
    default: ReconciliationStatus.IN_PROGRESS,
  })
  status: ReconciliationStatus;

  @Column({ default: false })
  isBalanced: boolean;

  // Workflow
  @Column({ nullable: true })
  reconciledBy: string;

  @Column({ type: 'timestamp', nullable: true })
  reconciledAt: Date;

  @Column({ nullable: true })
  reviewedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  // Adjustments
  @Column({ type: 'json', nullable: true })
  adjustments: {
    type: string;
    description: string;
    amount: number;
    date: Date;
  }[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BankStatement, (statement) => statement.reconciliation)
  bankStatements: BankStatement[];

  @OneToMany(
    () => ReconciliationMatch,
    (match) => match.reconciliation,
  )
  matches: ReconciliationMatch[];
}

@Entity('bank_statements')
export class BankStatement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  reconciliationId: string;

  @ManyToOne(() => BankReconciliation, (reconciliation) => reconciliation.bankStatements)
  @JoinColumn({ name: 'reconciliationId' })
  reconciliation: BankReconciliation;

  @Column()
  bankAccountId: string;

  @Column({ type: 'date' })
  transactionDate: Date;

  @Column({ type: 'date', nullable: true })
  valueDate: Date;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true, length: 100 })
  referenceNumber: string;

  @Column({ nullable: true, length: 100 })
  chequeNumber: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  debitAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  creditAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  balance: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.UNMATCHED,
  })
  status: TransactionStatus;

  @Column({ default: false })
  isMatched: boolean;

  @Column({ nullable: true })
  matchedPaymentId: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('reconciliation_matches')
export class ReconciliationMatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  reconciliationId: string;

  @ManyToOne(() => BankReconciliation, (reconciliation) => reconciliation.matches)
  @JoinColumn({ name: 'reconciliationId' })
  reconciliation: BankReconciliation;

  @Column({ nullable: true })
  bankStatementId: string;

  @Column({ nullable: true })
  paymentId: string; // Link to Payment entity

  @Column({ nullable: true })
  generalLedgerId: string; // Link to General Ledger

  @Column({ length: 100 })
  matchType: string; // Automatic, Manual, Suggested

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  matchedDate: Date;

  @Column({ nullable: true })
  matchedBy: string;

  @Column({ type: 'int', nullable: true })
  confidenceScore: number; // For automatic matching (0-100)

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}
