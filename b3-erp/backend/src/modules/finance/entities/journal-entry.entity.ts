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
import { FinancialPeriod } from './financial-period.entity';
import { GeneralLedger } from './general-ledger.entity';

export enum JournalType {
  STANDARD = 'Standard',
  ADJUSTING = 'Adjusting',
  CLOSING = 'Closing',
  REVERSING = 'Reversing',
  ACCRUAL = 'Accrual',
  RECURRING = 'Recurring',
}

export enum JournalStatus {
  DRAFT = 'Draft',
  PENDING_APPROVAL = 'Pending Approval',
  APPROVED = 'Approved',
  POSTED = 'Posted',
  REVERSED = 'Reversed',
  REJECTED = 'Rejected',
}

@Entity('journal_entries')
export class JournalEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  journalNumber: string; // e.g., JE-2024-001

  @Column({
    type: 'enum',
    enum: JournalType,
    default: JournalType.STANDARD,
  })
  journalType: JournalType;

  @Column()
  periodId: string;

  @ManyToOne(() => FinancialPeriod)
  @JoinColumn({ name: 'periodId' })
  period: FinancialPeriod;

  @Column({ type: 'date' })
  journalDate: Date;

  @Column({ type: 'date' })
  postingDate: Date;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true, length: 100 })
  referenceNumber: string;

  @Column({
    type: 'enum',
    enum: JournalStatus,
    default: JournalStatus.DRAFT,
  })
  status: JournalStatus;

  // Totals (for validation)
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalDebit: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCredit: number;

  @Column({ default: false })
  isBalanced: boolean;

  // Recurring journal settings
  @Column({ default: false })
  isRecurring: boolean;

  @Column({ nullable: true, length: 50 })
  recurrencePattern: string; // Monthly, Quarterly, Annually

  @Column({ type: 'date', nullable: true })
  recurrenceStartDate: Date;

  @Column({ type: 'date', nullable: true })
  recurrenceEndDate: Date;

  @Column({ type: 'int', nullable: true })
  recurrenceCount: number;

  @Column({ nullable: true })
  nextRecurrenceDate: Date;

  // Template
  @Column({ default: false })
  isTemplate: boolean;

  @Column({ nullable: true, length: 100 })
  templateName: string;

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

  // Posting
  @Column({ nullable: true })
  postedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  postedAt: Date;

  // Reversal
  @Column({ default: false })
  isReversed: boolean;

  @Column({ nullable: true })
  reversedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  reversedAt: Date;

  @Column({ nullable: true })
  reversalJournalId: string;

  // Attachments
  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];

  // Notes
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

  // Relations
  @OneToMany(() => JournalEntryLine, (line) => line.journalEntry, {
    cascade: true,
  })
  lines: JournalEntryLine[];
}

@Entity('journal_entry_lines')
export class JournalEntryLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  journalEntryId: string;

  @ManyToOne(() => JournalEntry, (journal) => journal.lines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'journalEntryId' })
  journalEntry: JournalEntry;

  @Column({ type: 'int' })
  lineNumber: number;

  @Column()
  accountId: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  debitAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  creditAmount: number;

  // Multi-dimensional accounting
  @Column({ nullable: true, length: 100 })
  costCenter: string;

  @Column({ nullable: true, length: 100 })
  department: string;

  @Column({ nullable: true, length: 100 })
  project: string;

  @Column({ nullable: true, length: 100 })
  location: string;

  // Party information
  @Column({ nullable: true })
  partyId: string;

  @Column({ nullable: true, length: 255 })
  partyName: string;

  @Column({ nullable: true, length: 50 })
  partyType: string;

  // Tax information
  @Column({ nullable: true })
  taxId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  taxRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  taxAmount: number;

  // Reference to General Ledger entry
  @Column({ nullable: true })
  generalLedgerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
