import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum BankAccountType {
  SAVINGS = 'Savings',
  CURRENT = 'Current',
  OVERDRAFT = 'Overdraft',
  FIXED_DEPOSIT = 'Fixed Deposit',
  CASH_CREDIT = 'Cash Credit',
}

export enum AccountStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  CLOSED = 'Closed',
  FROZEN = 'Frozen',
}

@Entity('bank_accounts')
export class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  accountCode: string;

  @Column({ length: 255 })
  accountName: string;

  @Column({ length: 255 })
  bankName: string;

  @Column({ length: 255 })
  branchName: string;

  @Column({ length: 100, nullable: true })
  branchCode: string;

  @Column({ length: 100 })
  accountNumber: string;

  @Column({ length: 50, nullable: true })
  ifscCode: string;

  @Column({ length: 50, nullable: true })
  swiftCode: string;

  @Column({
    type: 'enum',
    enum: BankAccountType,
  })
  accountType: BankAccountType;

  @Column({ default: 'INR', length: 3 })
  currency: string;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  status: AccountStatus;

  // Chart of Accounts linkage
  @Column({ nullable: true })
  glAccountId: string; // Link to Chart of Accounts

  // Balance tracking
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  openingBalance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  currentBalance: number;

  @Column({ type: 'date', nullable: true })
  balanceAsOfDate: Date;

  // Limits
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  overdraftLimit: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  minimumBalance: number;

  // Reconciliation
  @Column({ default: false })
  isReconciledUptoDate: boolean;

  @Column({ type: 'date', nullable: true })
  lastReconciledDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  lastReconciledBalance: number;

  // Contact information
  @Column({ length: 255, nullable: true })
  contactPerson: string;

  @Column({ length: 50, nullable: true })
  contactPhone: string;

  @Column({ length: 255, nullable: true })
  contactEmail: string;

  // Address
  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 20, nullable: true })
  pincode: string;

  @Column({ length: 100, nullable: true })
  country: string;

  // Online banking
  @Column({ default: false })
  hasOnlineBanking: boolean;

  @Column({ length: 255, nullable: true })
  onlineBankingUrl: string;

  // Additional details
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: true })
  isDefault: boolean;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
