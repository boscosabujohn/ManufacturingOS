import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum GRNStatus {
    PENDING_QC = 'pending_qc',
    COMPLETED = 'completed',
    REJECTED = 'rejected',
}

@Entity('grns')
export class GRN {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'purchase_order_id' })
    purchaseOrderId: string;

    @Column({ name: 'received_by' })
    receivedBy: string;

    @Column({ name: 'delivery_note_ref', nullable: true })
    deliveryNoteRef: string;

    @Column({
        type: 'enum',
        enum: GRNStatus,
        default: GRNStatus.PENDING_QC,
    })
    status: GRNStatus;

    @Column({ name: 'qc_notes', type: 'text', nullable: true })
    qcNotes: string;

    @Column({ name: 'qc_passed', type: 'boolean', default: false })
    qcPassed: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
