import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { QualityGate } from './quality-gate.entity';

@Entity('defects')
@Index(['projectId', 'status'])
@Index(['severity'])
export class Defect {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    qualityGateId: string;

    @Column()
    @Index()
    projectId: string;

    @Column()
    severity: 'critical' | 'major' | 'minor';

    @Column({ type: 'text' })
    description: string;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    assignedTo: string; // user ID

    @Column({ default: 'open' })
    @Index()
    status: 'open' | 'in_rework' | 'resolved' | 'closed' | 'rejected';

    @Column({ type: 'simple-array', nullable: true })
    photos: string[]; // Array of S3 URLs

    @Column({ type: 'text', nullable: true })
    resolutionNotes: string;

    @Column({ type: 'timestamp', nullable: true })
    resolvedAt: Date;

    @Column({ nullable: true })
    resolvedBy: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;

    @ManyToOne(() => QualityGate, (gate) => gate.defects, { nullable: true })
    @JoinColumn({ name: 'qualityGateId' })
    qualityGate: QualityGate;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
