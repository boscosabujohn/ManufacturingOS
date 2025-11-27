import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { QualityGate } from './quality-gate.entity';

@Entity('quality_gate_items')
export class QualityGateItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    qualityGateId: string;

    @Column({ type: 'text' })
    itemDescription: string;

    @Column({ nullable: true })
    passed: boolean;

    @Column({ type: 'text', nullable: true })
    comments: string;

    @Column({ type: 'simple-array', nullable: true })
    photos: string[]; // Array of S3 URLs

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;

    @ManyToOne(() => QualityGate, (gate) => gate.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'qualityGateId' })
    qualityGate: QualityGate;
}
