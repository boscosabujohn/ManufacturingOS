import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { BOMHeader } from './bom-header.entity';

export enum PRStatus {
    DRAFT = 'draft',
    PENDING_APPROVAL = 'pending_approval',
    APPROVED = 'approved',
    PO_GENERATED = 'po_generated',
    CANCELLED = 'cancelled',
}

@Entity('purchase_requisitions')
export class PurchaseRequisition {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column({ name: 'bom_header_id', nullable: true })
    bomHeaderId: string;

    @ManyToOne(() => BOMHeader)
    @JoinColumn({ name: 'bom_header_id' })
    bomHeader: BOMHeader;

    @Column({
        type: 'enum',
        enum: PRStatus,
        default: PRStatus.DRAFT,
    })
    status: PRStatus;

    @Column({ name: 'requested_by' })
    requestedBy: string;

    @Column({ name: 'total_estimated_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
    totalEstimatedAmount: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
