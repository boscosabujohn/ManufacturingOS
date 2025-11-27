import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Index,
    OneToMany,
} from 'typeorm';
import { ApprovalStep } from './approval-step.entity';

@Entity('workflow_approvals')
@Index(['projectId', 'status'])
@Index(['approvalType'])
export class WorkflowApproval {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    projectId: string;

    @Column()
    approvalType: string; // 'document', 'boq', 'qc', 'payment', 'design', 'client_drawing', etc.

    @Column({ nullable: true })
    referenceId: string; // ID of document/qc report/etc.

    @Column({ default: 'sequential' })
    workflowType: 'sequential' | 'parallel' | 'conditional';

    @Column({ type: 'int', default: 1 })
    currentStep: number;

    @Column({ default: 'pending' })
    @Index()
    status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'cancelled';

    @Column({ nullable: true })
    createdBy: string;

    @Column({ type: 'timestamp', nullable: true })
    completedAt: Date;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;

    @OneToMany(() => ApprovalStep, (step) => step.approval, { eager: true })
    steps: ApprovalStep[];

    @CreateDateColumn()
    createdAt: Date;
}
