
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('phase_transitions')
export class PhaseTransition {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    projectId: string;

    @Column({ type: 'varchar', nullable: true })
    fromPhase: number;

    @Column()
    toPhase: number;

    @Column({ type: 'varchar', nullable: true })
    fromStep: string;

    @Column({ type: 'varchar', nullable: true })
    toStep: string;

    @Column()
    transitionType: string;

    @Column({ type: 'varchar', nullable: true })
    triggeredBy: string;

    @Column('jsonb', { nullable: true })
    conditionsMet: any;

    @Column('jsonb', { nullable: true })
    metadata: any;

    @CreateDateColumn()
    @Index()
    triggeredAt: Date;
}
