import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../project/entities/project.entity';

@Entity('daily_install_reports')
export class DailyInstallReport {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    reportDate: Date;

    @Column({ name: 'overall_progress', type: 'decimal', precision: 5, scale: 2, default: 0 })
    overallProgress: number;

    @Column({ name: 'work_done', type: 'text', nullable: true })
    workDone: string;

    @Column({ name: 'planned_for_tomorrow', type: 'text', nullable: true })
    plannedForTomorrow: string;

    @Column({ name: 'issues_encountered', type: 'text', nullable: true })
    issuesEncountered: string;

    @Column({ name: 'is_site_cleaned', default: false })
    isSiteCleaned: boolean;

    @Column({ name: 'cleaning_photos', type: 'jsonb', nullable: true })
    cleaningPhotos: string[];

    @Column({ name: 'progress_photos', type: 'jsonb', nullable: true })
    progressPhotos: string[];

    @Column({ name: 'manpower_count', default: 0 })
    manpowerCount: number;

    @Column({ name: 'is_client_notified', default: false })
    isClientNotified: boolean;

    @Column({ name: 'client_feedback', type: 'text', nullable: true })
    clientFeedback: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
