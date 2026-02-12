
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ProjectPhase } from '../../workflow/entities/project-phase.entity';
import { WorkflowDocument } from '../../workflow/entities/workflow-document.entity';
import { QualityGate } from '../../workflow/entities/quality-gate.entity';
import { DiscrepancyLog } from './discrepancy-log.entity';
import { SiteSurvey } from './site-survey.entity';
import { ExternalApproval } from './external-approval.entity';

export enum ProjectStatus {
    PLANNING = 'planning',
    ACTIVE = 'active',
    ON_HOLD = 'on_hold',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export enum ProjectPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

export enum HandoverStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    NA = 'n/a',
}

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'varchar', nullable: true })
    clientName: string;

    @Column({ type: 'varchar', nullable: true })
    description: string;

    @Column({ type: 'varchar', nullable: true })
    salesOrderId: string;

    @Column({ type: 'varchar', nullable: true })
    managerId: string;

    @Column({ default: 'active' })
    status: string; // active, completed, on_hold, cancelled

    @Column({ type: 'date', nullable: true })
    startDate: Date;

    @Column({ type: 'date', nullable: true })
    endDate: Date;

    @Column('jsonb', { nullable: true })
    metadata: any;

    @Column({ name: 'project_code', nullable: true, unique: true })
    projectCode: string;

    @Column({ name: 'planned_start', type: 'date', nullable: true })
    plannedStart: Date;

    @Column({ name: 'planned_end', type: 'date', nullable: true })
    plannedEnd: Date;

    @Column({ default: 'medium' })
    priority: string;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    progress: number;

    @Column({ name: 'budget_allocated', type: 'decimal', precision: 15, scale: 2, default: 0 })
    budgetAllocated: number;

    @Column({ name: 'budget_spent', type: 'decimal', precision: 15, scale: 2, default: 0 })
    budgetSpent: number;

    @Column({ name: 'total_income', type: 'decimal', precision: 15, scale: 2, default: 0 })
    totalIncome: number;

    @Column({ name: 'total_expenditure', type: 'decimal', precision: 15, scale: 2, default: 0 })
    totalExpenditure: number;

    @Column({ name: 'net_profit', type: 'decimal', precision: 15, scale: 2, default: 0 })
    netProfit: number;

    @Column({ name: 'profit_margin', type: 'decimal', precision: 5, scale: 2, default: 0 })
    profitMargin: number;

    @Column({ name: 'project_manager_id', type: 'varchar', nullable: true })
    projectManagerId: string;

    @Column({ type: 'varchar', nullable: true })
    location: string;

    @Column({ name: 'project_type', type: 'varchar', nullable: true })
    projectType: string;

    @Column({ name: 'award_date', type: 'date', nullable: true })
    awardDate: Date;

    @Column({ name: 'client_contact_person', type: 'varchar', nullable: true })
    clientContactPerson: string;

    @Column({ name: 'client_contact_email', type: 'varchar', nullable: true })
    clientContactEmail: string;

    @Column({
        name: 'handover_status',
        type: 'enum',
        enum: HandoverStatus,
        default: HandoverStatus.PENDING,
    })
    handoverStatus: HandoverStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => DiscrepancyLog, (log) => log.project)
    discrepancyLogs: DiscrepancyLog[];

    @OneToMany(() => SiteSurvey, (survey) => survey.project)
    siteSurveys: SiteSurvey[];

    @OneToMany(() => ExternalApproval, (approval) => approval.project)
    externalApprovals: ExternalApproval[];
}
