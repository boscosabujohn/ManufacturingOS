import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

export enum DiscrepancyType {
    BOQ_VS_DWG = 'BOQ_VS_DWG',
    DWG_VS_SITE = 'DWG_VS_SITE',
    SPEC_MISMATCH = 'SPEC_MISMATCH',
}

export enum DiscrepancyStatus {
    OPEN = 'OPEN',
    RESOLVED = 'RESOLVED',
    ARCHIVED = 'ARCHIVED',
}

export enum DiscrepancySeverity {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

@Entity('discrepancy_logs')
export class DiscrepancyLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    projectId: string;

    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    project: Project;

    @Column({
        type: 'enum',
        enum: DiscrepancyType,
    })
    type: DiscrepancyType;

    @Column('text')
    description: string;

    @Column({
        type: 'enum',
        enum: DiscrepancyStatus,
        default: DiscrepancyStatus.OPEN,
    })
    status: DiscrepancyStatus;

    @Column({
        type: 'enum',
        enum: DiscrepancySeverity,
        default: DiscrepancySeverity.MEDIUM,
    })
    severity: DiscrepancySeverity;

    @Column({ nullable: true })
    resolvedBy: string;

    @Column({ type: 'timestamp', nullable: true })
    resolvedAt: Date;

    @Column('text', { nullable: true })
    resolutionNotes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
