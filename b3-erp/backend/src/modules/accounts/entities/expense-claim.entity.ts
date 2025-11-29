import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('expense_claims')
export class ExpenseClaim {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    claimNumber: string;

    @Column()
    employeeId: string;

    @Column()
    employeeName: string;

    @Column({ type: 'date' })
    claimDate: Date;

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;

    @Column()
    category: string;

    @Column('text')
    description: string;

    @Column('simple-array', { nullable: true })
    receipts: string[]; // File URLs

    @Column({ type: 'enum', enum: ['draft', 'pending', 'approved', 'rejected', 'paid'], default: 'draft' })
    status: string;

    @Column({ nullable: true })
    approvedBy: string;

    @Column({ type: 'date', nullable: true })
    approvedDate: Date;

    @Column({ type: 'date', nullable: true })
    paidDate: Date;

    @Column({ nullable: true })
    paidBy: string;

    @Column({ nullable: true })
    paymentReference: string;

    @Column({ nullable: true })
    rejectionReason: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
