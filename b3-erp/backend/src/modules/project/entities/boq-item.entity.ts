
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BOQ } from './boq.entity';

@Entity('boq_items')
export class BOQItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => BOQ, boq => boq.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'boqId' })
    boq: BOQ;

    @Column()
    description: string;

    @Column()
    quantity: number;

    @Column()
    unit: string;

    @Column('decimal', { precision: 10, scale: 2 })
    rate: number;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    category: string; // e.g., 'material', 'labor', 'overhead'

    @Column({ nullable: true })
    specifications: string;
}
