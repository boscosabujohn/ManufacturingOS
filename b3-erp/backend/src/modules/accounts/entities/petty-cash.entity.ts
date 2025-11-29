import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('petty_cash')
export class PettyCash {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    custodian: string; // Employee ID

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'date' })
    date: Date;

    @Column()
    purpose: string;

    @Column()
    category: string;

    @Column({ nullable: true })
    receiptNumber: string;

    @Column({ nullable: true })
    approvedBy: string;

    @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected'], default: 'pending' })
    status: string;

    @Column({ nullable: true })
    remarks: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
