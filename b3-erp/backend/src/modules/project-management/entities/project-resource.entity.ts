import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../project/entities/project.entity';

@Entity('project_resources')
export class ProjectResource {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ nullable: true })
    role: string;

    @Column({ name: 'allocation_percentage', default: 100 })
    allocationPercentage: number;

    @Column({ name: 'start_date', type: 'date', nullable: true })
    startDate: Date;

    @Column({ name: 'end_date', type: 'date', nullable: true })
    endDate: Date;

    @Column({ name: 'hourly_rate', type: 'decimal', precision: 10, scale: 2, default: 0 })
    hourlyRate: number;

    @Column({ name: 'total_hours_allocated', type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalHoursAllocated: number;

    @Column({ name: 'total_hours_spent', type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalHoursSpent: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
