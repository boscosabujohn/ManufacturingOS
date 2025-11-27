import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { WorkflowApproval } from './workflow-approval.entity';

@Entity('approval_steps')
@Index(['approvalId', 'stepNumber'])
export class ApprovalStep {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    approvalId: string;

    @Column({ type: 'int' })
    stepNumber: number;

    @Column()
    approverId: string; // user ID

    @Column({ nullable: true })
    approverRole: string; // 'manager', 'director', 'qc_lead', etc.

    @Column({ default: 'pending' })
    status: 'pending' | 'approved' | 'rejected' | 'skipped';

    @Column({ type: 'timestamp', nullable: true })
    decidedAt: Date;

    @Column({ type: 'text', nullable: true })
    comments: string;

    @Column({ type: 'text', nullable: true })
    signatureData: string; // base64 encoded signature image

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;

    @ManyToOne(() => WorkflowApproval, (approval) => approval.steps, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'approvalId' })
    approval: WorkflowApproval;

    @CreateDateColumn()
    createdAt: Date;
}
