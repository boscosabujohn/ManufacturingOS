import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BOMHeader } from './bom-header.entity';
import { Item } from '../../core/entities/item.entity';

@Entity('bom_details')
export class BOMDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'header_id' })
    headerId: string;

    @ManyToOne(() => BOMHeader, header => header.details, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'header_id' })
    header: BOMHeader;

    @Column({ name: 'item_id' })
    itemId: string;

    @ManyToOne(() => Item)
    @JoinColumn({ name: 'item_id' })
    item: Item;

    @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
    quantity: number;

    @Column({ nullable: true })
    uom: string;

    @Column({ name: 'parent_detail_id', nullable: true })
    parentDetailId: string;

    @ManyToOne(() => BOMDetail, detail => detail.subDetails)
    @JoinColumn({ name: 'parent_detail_id' })
    parentDetail: BOMDetail;

    @OneToMany(() => BOMDetail, detail => detail.parentDetail)
    subDetails: BOMDetail[];

    @Column({ nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
