import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum TaskType {
    APPROVAL = 'approval',
    ACTION = 'action',
    REVIEW = 'review',
}

export enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed',
    ESCALATED = 'escalated',
}

export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

export enum SLAStatus {
    ON_TRACK = 'on-track',
    WARNING = 'warning',
    BREACHED = 'breached',
}

@Entity('user_tasks')
export class UserTask {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({
        name: 'task_type',
        type: 'enum',
        enum: TaskType,
    })
    taskType: TaskType;

    @Column({ length: 500 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ length: 100 })
    module: string; // 'Procurement', 'Sales', etc.

    @Column({ name: 'module_url', length: 500 })
    moduleUrl: string; // URL to navigate to

    @Column({ name: 'reference_number', length: 100 })
    referenceNumber: string;

    @Column({
        type: 'enum',
        enum: TaskPriority,
        default: TaskPriority.MEDIUM,
    })
    priority: TaskPriority;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.PENDING,
    })
    status: TaskStatus;

    @Column({ name: 'due_date', type: 'timestamp', nullable: true })
    dueDate: Date;

    @Column({
        name: 'sla_status',
        type: 'enum',
        enum: SLAStatus,
        nullable: true,
    })
    slaStatus: SLAStatus;

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>; // Additional data like approvalRequestId

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
    completedAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
