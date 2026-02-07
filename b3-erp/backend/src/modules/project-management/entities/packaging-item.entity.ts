import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PackagingCrate } from './packaging-crate.entity';
import { Item } from '../../core/entities/item.entity';

@Entity('packaging_items')
export class PackagingItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'crate_id' })
    crateId: string;

    @ManyToOne(() => PackagingCrate, crate => crate.items)
    @JoinColumn({ name: 'crate_id' })
    crate: PackagingCrate;

    @Column({ name: 'item_id' })
    itemId: string;

    @ManyToOne(() => Item)
    @JoinColumn({ name: 'item_id' })
    item: Item;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    quantityPacked: number;
}
