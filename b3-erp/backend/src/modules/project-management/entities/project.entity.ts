import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ProjectStatus {
    PLANNING = 'Planning',
    IN_PROGRESS = 'In Progress',
    ON_HOLD = 'On Hold',
    DELAYED = 'Delayed',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled',
}

export enum ProjectPriority {
    P1 = 'P1',
    P2 = 'P2',
    P3 = 'P3',
}

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    projectNumber: string;

    @Column()
    projectName: string;

    @Column()
    projectType: string;

    @Column()
    customer: string;

    @Column()
    location: string;

    @Column({ nullable: true })
    salesOrderNumber: string;

    @Column({ nullable: true })
    projectManager: string;

    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date' })
    endDate: string;

    @Column({ type: 'date', nullable: true })
    actualEndDate: string;

    @Column({
        type: 'enum',
        enum: ProjectStatus,
        default: ProjectStatus.PLANNING,
    })
    status: ProjectStatus;

    @Column({ type: 'float', default: 0 })
    progress: number;

    @Column({ type: 'float', default: 0 })
    budget: number;

    @Column({ type: 'float', default: 0 })
    actualCost: number;

    @Column({ default: 'Initiation' })
    phase: string;

    @Column({
        type: 'enum',
        enum: ProjectPriority,
        default: ProjectPriority.P2,
    })
    priority: ProjectPriority;

    @Column({ type: 'int', default: 0 })
    teamSize: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
