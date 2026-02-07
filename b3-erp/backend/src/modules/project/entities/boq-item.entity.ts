
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BOQ } from './boq.entity';
import { Item } from '../../core/entities/item.entity';

@Entity('boq_items')
export class BOQItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => BOQ, boq => boq.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'boqId' })
    boq: BOQ;

    @Column({ nullable: true })
    itemId: string;

    @ManyToOne(() => Item, { nullable: true })
    @JoinColumn({ name: 'itemId' })
    item: Item;

    @Column({ nullable: true })
    itemCode: string;

    @Column({ nullable: true })
    itemName: string;

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
