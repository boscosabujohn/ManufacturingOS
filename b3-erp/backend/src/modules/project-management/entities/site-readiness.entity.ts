import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../project/entities/project.entity';

export enum ReadinessStatus {
    READY = 'ready',
    NOT_READY = 'not_ready',
    WAITING = 'waiting',
}

@Entity('site_readiness')
export class SiteReadiness {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column()
    item: string; // e.g., "Electrical Power Availability", "Floor Levelling"

    @Column({
        type: 'enum',
        enum: ReadinessStatus,
        default: ReadinessStatus.WAITING,
    })
    status: ReadinessStatus;

    @Column({ name: 'verified_by', nullable: true })
    verifiedBy: string;

    @Column({ type: 'jsonb', nullable: true })
    photos: string[];

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
