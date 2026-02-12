import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../project/entities/project.entity';

export enum ToolDeploymentStatus {
    ISSUED = 'ISSUED',
    RETURNED = 'RETURNED',
    LOST = 'LOST',
    DAMAGED = 'DAMAGED',
}

@Entity('tool_deployments')
export class ToolDeployment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'tool_id' })
    toolId: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column({
        type: 'enum',
        enum: ToolDeploymentStatus,
        default: ToolDeploymentStatus.ISSUED,
    })
    status: ToolDeploymentStatus;

    @Column({ name: 'issued_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    issuedAt: Date;

    @Column({ name: 'returned_at', type: 'timestamp', nullable: true })
    returnedAt: Date;

    @Column({ name: 'condition_at_issue', type: 'varchar', nullable: true })
    conditionAtIssue: string;

    @Column({ name: 'condition_at_return', type: 'varchar', nullable: true })
    conditionAtReturn: string;

    @Column({ name: 'depreciation_value', type: 'decimal', precision: 10, scale: 2, default: 0 })
    depreciationValue: number;

    @Column({ name: 'issued_by', type: 'varchar', nullable: true })
    issuedBy: string;

    @Column({ name: 'returned_by', type: 'varchar', nullable: true })
    public returnedBy?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
