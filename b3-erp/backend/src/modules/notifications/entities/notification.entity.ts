import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    @Index()
    userId: string;

    @Column({ type: 'varchar', length: 50 })
    type: string; // 'approval_assigned', 'approval_approved', 'approval_rejected', 'sla_approaching', 'sla_breached', 'escalation'

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column('text')
    message: string;

    @Column('jsonb', { nullable: true })
    metadata: Record<string, any>; // { approvalId, workflowName, etc. }

    @Column({ default: false })
    @Index()
    isRead: boolean;

    @Column({ type: 'varchar', length: 20, default: 'info' })
    priority: string; // 'info', 'warning', 'urgent'

    @Column({ type: 'varchar', length: 255, nullable: true })
    actionUrl: string; // URL to navigate to

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
