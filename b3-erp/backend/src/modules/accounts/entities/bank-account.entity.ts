import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('accounts_bank_accounts')
export class BankAccount {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    accountNumber: string;

    @Column()
    accountName: string;

    @Column()
    bankName: string;

    @Column()
    branch: string;

    @Column({ type: 'varchar', nullable: true })
    ifscCode: string;

    @Column({ type: 'varchar', nullable: true })
    swiftCode: string;

    @Column({ default: 'USD' })
    currency: string;

    @Column('decimal', { precision: 15, scale: 2, default: 0 })
    currentBalance: number;

    @Column('decimal', { precision: 15, scale: 2, default: 0 })
    openingBalance: number;

    @Column({ type: 'date' })
    openingDate: Date;

    @Column({ type: 'enum', enum: ['savings', 'current', 'fixed-deposit', 'credit-card'], default: 'current' })
    accountType: string;

    @Column({ type: 'enum', enum: ['active', 'inactive', 'closed'], default: 'active' })
    status: string;

    @Column({ type: 'varchar', nullable: true })
    companyId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'varchar', nullable: true })
    createdBy: string;
}
