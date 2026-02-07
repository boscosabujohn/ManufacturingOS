import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { Item } from '../../core/entities/item.entity';
import { BOMDetail } from './bom-detail.entity';

export enum ReservationStatus {
    PENDING = 'pending',
    FULFILLED = 'fulfilled',
    CANCELLED = 'cancelled',
}

@Entity('inventory_reservations')
export class InventoryReservation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column({ name: 'bom_detail_id', nullable: true })
    bomDetailId: string;

    @ManyToOne(() => BOMDetail)
    @JoinColumn({ name: 'bom_detail_id' })
    bomDetail: BOMDetail;

    @Column({ name: 'item_id' })
    itemId: string;

    @ManyToOne(() => Item)
    @JoinColumn({ name: 'item_id' })
    item: Item;

    @Column({ type: 'decimal', precision: 15, scale: 3, default: 0 })
    quantityReserved: number;

    @Column({
        type: 'enum',
        enum: ReservationStatus,
        default: ReservationStatus.PENDING,
    })
    status: ReservationStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
