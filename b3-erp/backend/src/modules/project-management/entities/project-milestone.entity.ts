import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../project/entities/project.entity';

@Entity('project_milestones')
export class ProjectMilestone {
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

    @Column({ name: 'due_date', type: 'date', nullable: true })
    dueDate: Date;

    @Column({ name: 'completed_date', type: 'date', nullable: true })
    completedDate: Date;

    @Column({ default: 'pending' })
    status: string;

    @Column('jsonb', { nullable: true })
    deliverables: any;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
