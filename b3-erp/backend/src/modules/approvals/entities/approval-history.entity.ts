import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { ApprovalRequest } from './approval-request.entity';

export enum ApprovalAction {
    APPROVED = 'approved',
    REJECTED = 'rejected',
    PENDING = 'pending',
}

@Entity('approval_history')
export class ApprovalHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'request_id' })
    requestId: string;

    @ManyToOne(() => ApprovalRequest, (request) => request.history, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'request_id' })
    request: ApprovalRequest;

    @Column({ type: 'int' })
    level: number;

    @Column({ name: 'approver_id' })
    approverId: string;

    @Column({ type: 'enum', enum: ApprovalAction })
    action: ApprovalAction;

    @Column({ type: 'text', nullable: true })
    comment: string;

    @CreateDateColumn({ name: 'timestamp' })
    timestamp: Date;
}
