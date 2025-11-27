
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ProjectPhase } from '../../workflow/entities/project-phase.entity';
import { WorkflowDocument } from '../../workflow/entities/workflow-document.entity';
import { QualityGate } from '../../workflow/entities/quality-gate.entity';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    clientName: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    salesOrderId: string;

    @Column({ nullable: true })
    managerId: string;

    @Column({ default: 'active' })
    status: string; // active, completed, on_hold, cancelled

    @Column({ type: 'date', nullable: true })
    startDate: Date;

    @Column({ type: 'date', nullable: true })
    endDate: Date;

    @Column('jsonb', { nullable: true })
    metadata: any;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
