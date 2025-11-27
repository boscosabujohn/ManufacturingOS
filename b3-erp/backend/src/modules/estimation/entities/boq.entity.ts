import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum BOQStatus {
    DRAFT = 'Draft',
    UNDER_REVIEW = 'Under Review',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
}

@Entity('boq')
export class BOQ {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    boqNumber: string;

    @Column()
    projectName: string;

    @Column()
    clientName: string;

    @Column()
    projectLocation: string;

    @Column({ nullable: true })
    projectDuration: string;

    @Column({ default: 'USD' })
    currency: string;

    @Column({ type: 'float', default: 0 })
    estimatedValue: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({
        type: 'enum',
        enum: BOQStatus,
        default: BOQStatus.DRAFT,
    })
    status: BOQStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

@Entity('boq_items')
export class BOQItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    boqId: string;

    @Column()
    itemNo: string;

    @Column()
    description: string;

    @Column()
    unit: string;

    @Column({ type: 'float' })
    quantity: number;

    @Column({ type: 'float' })
    unitRate: number;

    @Column({ type: 'float' })
    totalAmount: number;

    @Column({ type: 'text', nullable: true })
    specifications: string;

    @Column()
    category: string;

    @ManyToOne(() => BOQ, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'boqId' })
    boq: BOQ;
}
