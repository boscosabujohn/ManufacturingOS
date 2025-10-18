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

export enum AccountType {
  ASSET = 'Asset',
  LIABILITY = 'Liability',
  EQUITY = 'Equity',
  INCOME = 'Income',
  EXPENSE = 'Expense',
}

export enum AccountSubType {
  // Assets
  CURRENT_ASSET = 'Current Asset',
  FIXED_ASSET = 'Fixed Asset',
  INTANGIBLE_ASSET = 'Intangible Asset',
  OTHER_ASSET = 'Other Asset',

  // Liabilities
  CURRENT_LIABILITY = 'Current Liability',
  LONG_TERM_LIABILITY = 'Long-term Liability',

  // Equity
  SHARE_CAPITAL = 'Share Capital',
  RESERVES = 'Reserves',
  RETAINED_EARNINGS = 'Retained Earnings',

  // Income
  OPERATING_INCOME = 'Operating Income',
  NON_OPERATING_INCOME = 'Non-operating Income',

  // Expense
  COST_OF_GOODS_SOLD = 'Cost of Goods Sold',
  OPERATING_EXPENSE = 'Operating Expense',
  FINANCIAL_EXPENSE = 'Financial Expense',
  OTHER_EXPENSE = 'Other Expense',
}

export enum BalanceType {
  DEBIT = 'Debit',
  CREDIT = 'Credit',
}

@Entity('chart_of_accounts')
export class ChartOfAccounts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 20 })
  accountCode: string;

  @Column({ length: 255 })
  accountName: string;

  @Column({
    type: 'enum',
    enum: AccountType,
  })
  accountType: AccountType;

  @Column({
    type: 'enum',
    enum: AccountSubType,
  })
  accountSubType: AccountSubType;

  @Column({
    type: 'enum',
    enum: BalanceType,
  })
  normalBalance: BalanceType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  parentAccountId: string;

  @ManyToOne(() => ChartOfAccounts, (account) => account.children, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'parentAccountId' })
  parentAccount: ChartOfAccounts;

  @OneToMany(() => ChartOfAccounts, (account) => account.parentAccount)
  children: ChartOfAccounts[];

  @Column({ type: 'int', default: 0 })
  level: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  allowPosting: boolean; // Can transactions be posted directly to this account?

  @Column({ default: false })
  isSystemAccount: boolean; // System accounts cannot be deleted

  // Additional classification fields
  @Column({ nullable: true, length: 100 })
  costCenter: string;

  @Column({ nullable: true, length: 100 })
  department: string;

  @Column({ nullable: true, length: 100 })
  location: string;

  // Tax related
  @Column({ default: false })
  isTaxAccount: boolean;

  @Column({ nullable: true, length: 50 })
  taxType: string; // GST, TDS, etc.

  // Currency
  @Column({ default: 'INR', length: 3 })
  currency: string;

  @Column({ default: false })
  allowMultiCurrency: boolean;

  // Balances (calculated fields - updated from General Ledger)
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  openingBalance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  currentBalance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  debitTotal: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  creditTotal: number;

  // Reconciliation
  @Column({ default: false })
  requiresReconciliation: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastReconciledDate: Date;

  // Metadata
  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual fields
  hasChildren?: boolean;
}
