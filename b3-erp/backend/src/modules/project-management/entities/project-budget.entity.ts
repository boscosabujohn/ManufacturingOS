import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../project/entities/project.entity';

@Entity('project_budgets')
export class ProjectBudget {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column()
    category: string;

    @Column({ name: 'budget_allocated', type: 'decimal', precision: 15, scale: 2, default: 0 })
    budgetAllocated: number;

    @Column({ name: 'budget_spent', type: 'decimal', precision: 15, scale: 2, default: 0 })
    budgetSpent: number;

    @Column({ name: 'forecast_cost', type: 'decimal', precision: 15, scale: 2, default: 0 })
    forecastCost: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
