
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('project_phases')
export class ProjectPhase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    projectId: string;

    @Column({ default: 1 })
    currentPhase: number;

    @Column({ nullable: true })
    currentStep: string;

    @Column({ default: 'active' })
    status: string;

    @Column('jsonb', { nullable: true })
    blockingReasons: any;

    @Column('jsonb', { nullable: true })
    metadata: any;

    @Column({ type: 'date', nullable: true })
    targetCompletionDate: Date;

    @Column({ type: 'date', nullable: true })
    actualCompletionDate: Date;

    @Column({ nullable: true })
    createdBy: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
