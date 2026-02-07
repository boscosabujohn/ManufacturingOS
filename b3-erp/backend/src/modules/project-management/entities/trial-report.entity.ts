import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../project/entities/project.entity';

@Entity('trial_reports')
export class TrialReport {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column({ name: 'inspected_by' })
    inspectedBy: string;

    @Column({ default: 'pending' })
    result: string; // PASS, FAIL, REWORK

    @Column({ type: 'jsonb', nullable: true })
    photos: string[];

    @Column({ type: 'jsonb', nullable: true })
    checklist: any;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
