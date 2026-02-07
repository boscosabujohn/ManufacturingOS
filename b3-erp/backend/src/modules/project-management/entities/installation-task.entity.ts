import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../project/entities/project.entity';

export enum InstallationStatus {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    DONE = 'done',
    BLOCKED = 'blocked',
}

@Entity('installation_tasks')
export class InstallationTask {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column({ name: 'installer_id', nullable: true })
    installerId: string;

    @Column({ name: 'task_name' })
    taskName: string;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    progress: number;

    @Column({
        type: 'enum',
        enum: InstallationStatus,
        default: InstallationStatus.TODO,
    })
    status: InstallationStatus;

    @Column({ name: 'completion_photos', type: 'jsonb', nullable: true })
    completionPhotos: string[];

    @Column({ type: 'text', nullable: true })
    snagNotes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
