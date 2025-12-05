import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { ProjectTask } from './project-task.entity';

@Entity('time_logs')
export class TimeLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column({ name: 'task_id', nullable: true })
    taskId: string;

    @ManyToOne(() => ProjectTask)
    @JoinColumn({ name: 'task_id' })
    task: ProjectTask;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ type: 'date' })
    date: Date;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    hours: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: true })
    billable: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
