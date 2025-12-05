import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { ApprovalRequest } from './approval-request.entity';

@Entity('approval_comments')
export class ApprovalComment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'request_id' })
    requestId: string;

    @ManyToOne(() => ApprovalRequest, (request) => request.comments, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'request_id' })
    request: ApprovalRequest;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ type: 'text' })
    comment: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
