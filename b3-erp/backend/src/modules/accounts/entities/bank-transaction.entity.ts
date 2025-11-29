import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BankAccount } from './bank-account.entity';

@Entity('bank_transactions')
export class BankTransaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    bankAccountId: string;

    @ManyToOne(() => BankAccount)
    @JoinColumn({ name: 'bankAccountId' })
    bankAccount: BankAccount;

    @Column({ type: 'date' })
    transactionDate: Date;

    @Column()
    description: string;

    @Column({ nullable: true })
    referenceNumber: string;

    @Column('decimal', { precision: 15, scale: 2, default: 0 })
    debit: number;

    @Column('decimal', { precision: 15, scale: 2, default: 0 })
    credit: number;

    @Column('decimal', { precision: 15, scale: 2 })
    balance: number;

    @Column({ default: false })
    reconciled: boolean;

    @Column({ type: 'date', nullable: true })
    reconciledDate: Date;

    @Column({ nullable: true })
    reconciledBy: string;

    @Column({ nullable: true })
    statementLineId: string;

    @Column({ nullable: true })
    journalEntryId: string;

    @CreateDateColumn()
    createdAt: Date;
}
