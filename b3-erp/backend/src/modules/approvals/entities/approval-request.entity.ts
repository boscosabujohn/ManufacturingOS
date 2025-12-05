import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { ApprovalHistory } from './approval-history.entity';
import { ApprovalComment } from './approval-comment.entity';
import { ApprovalAttachment } from './approval-attachment.entity';
import { ApprovalChain } from './approval-chain.entity';
import { JoinColumn, ManyToOne } from 'typeorm';

export enum ApprovalStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    EXPIRED = 'expired',
}

export enum ApprovalPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
}

@Entity('approval_requests')
export class ApprovalRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'entity_type', length: 100 })
    entityType: string; // 'purchase_order', 'expense', etc.

    @Column({ name: 'entity_id' })
    entityId: string; // Reference to the actual entity (e.g., PO ID)

    @Column({ name: 'reference_number', length: 100 })
    referenceNumber: string; // PO-2025-001, EXP-2025-089

    @Column({ length: 500 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'requested_by' })
    requestedBy: string; // User ID

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    amount: number;

    @Column({
        type: 'enum',
        enum: ApprovalPriority,
        default: ApprovalPriority.MEDIUM,
    })
    priority: ApprovalPriority;

    @Column({
        type: 'enum',
        enum: ApprovalStatus,
        default: ApprovalStatus.PENDING,
    })
    status: ApprovalStatus;

    @Column({ name: 'current_level', type: 'int', default: 1 })
    currentLevel: number;

    @Column({ name: 'total_levels', type: 'int' })
    totalLevels: number;

    @Column({ name: 'chain_id' })
    chainId: string;

    @ManyToOne(() => ApprovalChain)
    @JoinColumn({ name: 'chain_id' })
    chain: ApprovalChain;

    @Column({ type: 'timestamp', nullable: true })
    deadline: Date;

    @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
    completedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => ApprovalHistory, (history) => history.request, {
        cascade: true,
    })
    history: ApprovalHistory[];

    @OneToMany(() => ApprovalComment, (comment) => comment.request, {
        cascade: true,
    })
    comments: ApprovalComment[];

    @OneToMany(() => ApprovalAttachment, (attachment) => attachment.request, {
        cascade: true,
    })
    attachments: ApprovalAttachment[];
}
