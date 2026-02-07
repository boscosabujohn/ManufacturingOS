import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

@Entity('site_surveys')
export class SiteSurvey {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    projectId: string;

    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    project: Project;

    @Column()
    performedBy: string;

    @Column({ type: 'date' })
    date: Date;

    @Column('jsonb')
    measurements: any; // Structured measurement data (e.g., { kitchen_wall_1: 3450, hob_point_dist: 1200 })

    @Column('text', { nullable: true })
    notes: string;

    @Column('text', { array: true, default: '{}' })
    photoIds: string[]; // Links to ProjectAttachment IDs

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
