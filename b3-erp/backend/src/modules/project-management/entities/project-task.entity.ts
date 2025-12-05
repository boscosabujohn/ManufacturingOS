import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Project } from '../../project/entities/project.entity';

@Entity('project_tasks')
export class ProjectTask {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ name: 'start_date', type: 'date', nullable: true })
    startDate: Date;

    @Column({ name: 'end_date', type: 'date', nullable: true })
    endDate: Date;

    @Column({ name: 'planned_duration', nullable: true })
    plannedDuration: number;

    @Column({ name: 'actual_duration', nullable: true })
    actualDuration: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    progress: number;

    @Column({ default: 'not_started' })
    status: string;

    @Column({ default: 'medium' })
    priority: string;

    @Column('uuid', { array: true, nullable: true, name: 'assigned_to' })
    assignedTo: string[];

    @Column({ name: 'parent_task_id', nullable: true })
    parentTaskId: string;

    @ManyToOne(() => ProjectTask, task => task.subtasks)
    @JoinColumn({ name: 'parent_task_id' })
    parentTask: ProjectTask;

    @OneToMany(() => ProjectTask, task => task.parentTask)
    subtasks: ProjectTask[];

    @Column('jsonb', { nullable: true })
    dependencies: any;

    @Column({ name: 'estimated_hours', type: 'decimal', precision: 10, scale: 2, default: 0 })
    estimatedHours: number;

    @Column({ name: 'actual_hours', type: 'decimal', precision: 10, scale: 2, default: 0 })
    actualHours: number;

    @Column({ default: false })
    milestone: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
